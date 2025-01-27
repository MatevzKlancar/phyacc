import { supabase } from "../supabase/client";
import bs58 from "bs58";
import { VersionedTransaction, Connection, Keypair } from "@solana/web3.js";
import { CONSTANTS } from "../solana/constants";

interface TokenWallet {
  apiKey: string;
  walletPublicKey: string;
  privateKey: string;
}

export const tokenService = {
  async createTokenForProject(projectId: string): Promise<void> {
    try {
      // 1. First verify the token exists
      const { data: tokenCheck, error: tokenCheckError } = await supabase
        .from("project_tokens")
        .select("*")
        .eq("project_id", projectId)
        .single();

      console.log("Token check result:", tokenCheck);
      console.log("Token check error:", tokenCheckError);

      if (tokenCheckError || !tokenCheck) {
        throw new Error("No token configuration found for this project");
      }

      // 2. Create new wallet for token
      console.log("Creating token wallet...");
      const response = await fetch("https://pumpportal.fun/api/create-wallet", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to create token wallet");
      }

      const walletData: TokenWallet = await response.json();
      console.log("Raw API Response:", walletData);

      // DEBUG: Log the exact update we're attempting
      const updateData = {
        wallet_address: walletData.walletPublicKey,
        api_key: walletData.apiKey,
        private_key: walletData.privateKey,
        is_created: true,
      };
      console.log("Update payload:", updateData);

      // Attempt update with more detailed error logging
      const { data: updateResult, error: updateError } = await supabase
        .from("project_tokens")
        .update(updateData)
        .eq("id", tokenCheck.id)
        .select()
        .single();

      console.log("Direct update response:", { updateResult, updateError });

      if (updateError) {
        console.error("Error updating token:", updateError);
        throw updateError;
      }

      // Verify the update worked
      const { data: verifyData, error: verifyError } = await supabase
        .from("project_tokens")
        .select("*")
        .eq("id", tokenCheck.id)
        .single();

      console.log("Verification query result:", verifyData);

      if (verifyError) {
        throw new Error("Failed to verify token update");
      }

      // Check if the update actually changed the values
      if (
        !verifyData.wallet_address ||
        !verifyData.api_key ||
        !verifyData.private_key
      ) {
        throw new Error("Update appeared to succeed but values were not saved");
      }

      console.log("Update verified successfully with new values:", {
        wallet_address: verifyData.wallet_address,
        api_key: verifyData.api_key,
      });
    } catch (error) {
      console.error("Error in token creation process:", error);
      throw error;
    }
  },

  // New method for creating the token on-chain
  async createTokenOnChain(tokenId: string): Promise<void> {
    try {
      // 1. Get token data with wallet info
      const { data: token, error: tokenError } = await supabase
        .from("project_tokens")
        .select("*")
        .eq("id", tokenId)
        .single();

      if (tokenError || !token) {
        throw new Error("Token not found");
      }

      if (!token.private_key || !token.wallet_address) {
        throw new Error("Token wallet not properly initialized");
      }

      // Create Solana connection
      const connection = new Connection(CONSTANTS.SOLANA_RPC_URL, "confirmed");

      // Create signer keypair from token's private key
      const signerKeyPair = Keypair.fromSecretKey(
        bs58.decode(token.private_key)
      );

      // Generate a random keypair for token mint
      const mintKeypair = Keypair.generate();

      // 2. Upload metadata to IPFS through our Edge Function
      const formData = new FormData();
      formData.append("name", token.name);
      formData.append("symbol", token.symbol);
      formData.append("description", token.description);
      if (token.twitter_url) formData.append("twitter", token.twitter_url);
      if (token.telegram_url) formData.append("telegram", token.telegram_url);
      if (token.website_url) formData.append("website", token.website_url);
      formData.append("showName", "true");

      const imageResponse = await fetch(token.image_url);
      const imageBlob = await imageResponse.blob();
      formData.append("file", imageBlob);

      // Use our Supabase Edge Function instead of calling pump.fun directly
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const metadataResponse = await fetch(
        `${supabaseUrl}/functions/v1/ipfs-upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${supabaseAnonKey}`,
          },
          body: formData,
        }
      );

      if (!metadataResponse.ok) {
        throw new Error("Failed to upload metadata to IPFS");
      }

      const metadataResponseJSON = await metadataResponse.json();

      // Get the create transaction
      const response = await fetch(`https://pumpportal.fun/api/trade-local`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          publicKey: token.wallet_address,
          action: "create",
          tokenMetadata: {
            name: metadataResponseJSON.metadata.name,
            symbol: metadataResponseJSON.metadata.symbol,
            uri: metadataResponseJSON.metadataUri,
          },
          mint: mintKeypair.publicKey.toBase58(),
          denominatedInSol: "true",
          amount: 0.01, // Dev buy of 0.1 SOL
          slippage: 10,
          priorityFee: 0.0005,
          pool: "pump",
        }),
      });

      if (response.status !== 200) {
        throw new Error(
          `Failed to get create transaction: ${response.statusText}`
        );
      }

      // Sign and send the transaction
      const txData = await response.arrayBuffer();
      const tx = VersionedTransaction.deserialize(new Uint8Array(txData));
      tx.sign([mintKeypair, signerKeyPair]);

      const signature = await connection.sendTransaction(tx);
      console.log("Token created successfully:", signature);

      // Update token status in database
      const { error: updateError } = await supabase
        .from("project_tokens")
        .update({
          is_created: true,
          transaction_signature: signature,
          mint_address: mintKeypair.publicKey.toString(),
        })
        .eq("id", token.id);

      if (updateError) {
        throw new Error("Failed to update token status");
      }

      console.log("Token creation verified. Transaction:", {
        signature,
        solscanLink: `https://solscan.io/tx/${signature}`,
        mintAddress: mintKeypair.publicKey.toString(),
      });
    } catch (error) {
      console.error("Error creating token:", error);
      throw error;
    }
  },
};
