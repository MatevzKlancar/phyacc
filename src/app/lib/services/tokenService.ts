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
      console.error("Error creating token:", error);
      throw error;
    }
  },
};
