import { supabase } from "../supabase/client";

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
      if (!verifyData.wallet_address || !verifyData.api_key) {
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

      if (!token.api_key || !token.wallet_address) {
        throw new Error("Token wallet not properly initialized");
      }

      // 2. Upload metadata to IPFS
      const formData = new FormData();
      formData.append("name", token.name);
      formData.append("symbol", token.symbol);
      formData.append("description", token.description);
      if (token.twitter_url) formData.append("twitter", token.twitter_url);
      if (token.telegram_url) formData.append("telegram", token.telegram_url);
      if (token.website_url) formData.append("website", token.website_url);
      formData.append("showName", "true");

      // Convert image URL to file and append
      const imageResponse = await fetch(token.image_url);
      const imageBlob = await imageResponse.blob();
      formData.append("file", imageBlob);

      const metadataResponse = await fetch("https://pump.fun/api/ipfs", {
        method: "POST",
        body: formData,
      });
      const metadataResponseJSON = await metadataResponse.json();

      // 3. Create the token
      const createResponse = await fetch(
        `https://pumpportal.fun/api/trade?api-key=${token.api_key}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "create",
            tokenMetadata: {
              name: metadataResponseJSON.metadata.name,
              symbol: metadataResponseJSON.metadata.symbol,
              uri: metadataResponseJSON.metadataUri,
            },
            mint: token.wallet_address, // Using wallet_address as mint
            denominatedInSol: "true",
            amount: 0.1, // Dev buy of 1 SOL
            slippage: 10,
            priorityFee: 0.0005,
            pool: "pump",
          }),
        }
      );

      if (createResponse.status !== 200) {
        throw new Error(`Failed to create token: ${createResponse.statusText}`);
      }

      const createData = await createResponse.json();
      console.log("Token created successfully on-chain:", createData);
    } catch (error) {
      console.error("Error creating token on-chain:", error);
      throw error;
    }
  },
};
