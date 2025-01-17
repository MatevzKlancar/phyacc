import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

// Initialize connection to Solana network (using devnet for development)
export const connection = new Connection(clusterApiUrl("devnet"));

// Helper functions for Solana interactions
export const solanaService = {
  async getBalance(publicKey: string) {
    try {
      const balance = await connection.getBalance(new PublicKey(publicKey));
      return balance / 1e9; // Convert lamports to SOL
    } catch (error) {
      console.error("Error getting balance:", error);
      throw error;
    }
  },

  async validateAddress(address: string): Promise<boolean> {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  },
};
