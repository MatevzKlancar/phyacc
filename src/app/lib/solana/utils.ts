import { Connection, PublicKey } from "@solana/web3.js";
import { Project } from "../supabase";

export const solanaUtils = {
  async getWalletBalance(publicKey: string, connection: Connection) {
    try {
      const balance = await connection.getBalance(new PublicKey(publicKey));
      return balance / 1e9; // Convert lamports to SOL
    } catch (error) {
      console.error("Error getting wallet balance:", error);
      return 0;
    }
  },

  async checkProjectFunding(project: Project, connection: Connection) {
    const balance = await this.getWalletBalance(
      project.wallet_address,
      connection
    );
    const fundingPercentage = (balance / project.funding_goal) * 100;
    return {
      balance,
      fundingPercentage: Math.min(fundingPercentage, 100), // Cap at 100%
      isFullyFunded: fundingPercentage >= 100,
    };
  },
};
