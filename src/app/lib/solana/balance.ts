import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";
import { CONSTANTS } from "./constants";

export const solanaBalance = {
  async getSOLBalance(walletAddress: string): Promise<number> {
    try {
      const connection = new Connection(CONSTANTS.SOLANA_RPC_URL);
      const publicKey = new PublicKey(walletAddress);
      const balance = await connection.getBalance(publicKey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error("Error fetching SOL balance:", error);
      throw error;
    }
  },

  async getTokenBalance(
    walletAddress: string,
    tokenMint: string
  ): Promise<number> {
    try {
      const connection = new Connection(CONSTANTS.SOLANA_RPC_URL);
      const wallet = new PublicKey(walletAddress);
      const mint = new PublicKey(tokenMint);

      // Get all token accounts for the wallet
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        wallet,
        { mint: mint }
      );

      // Sum up balances from all accounts
      let totalBalance = 0;
      for (const account of tokenAccounts.value) {
        const parsedInfo = account.account.data.parsed.info;
        totalBalance += Number(parsedInfo.tokenAmount.uiAmount);
      }

      return totalBalance;
    } catch (error) {
      console.error("Error fetching token balance:", error);
      return 0; // Return 0 instead of throwing to handle new wallets gracefully
    }
  },

  async checkEligibility(walletAddress: string): Promise<{
    isEligible: boolean;
    solBalance: number;
    tokenBalance?: number;
  }> {
    try {
      const solBalance = await this.getSOLBalance(walletAddress);

      // Check only token balance
      if (CONSTANTS.TOKEN_MINT_ADDRESS) {
        const tokenBalance = await this.getTokenBalance(
          walletAddress,
          CONSTANTS.TOKEN_MINT_ADDRESS
        );

        return {
          isEligible: tokenBalance >= CONSTANTS.MIN_TOKEN_BALANCE,
          solBalance,
          tokenBalance,
        };
      }

      return {
        isEligible: false, // If no token mint address is set, not eligible
        solBalance,
      };
    } catch (error) {
      console.error("Error checking eligibility:", error);
      throw error;
    }
  },
};
