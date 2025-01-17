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

      // Get the associated token account address
      const tokenAccount = await getAssociatedTokenAddress(
        mint,
        wallet,
        false, // allowOwnerOffCurve
        TOKEN_PROGRAM_ID
      );

      try {
        const balance = await connection.getTokenAccountBalance(tokenAccount);
        return Number(balance.value.uiAmount);
      } catch (error) {
        // If token account doesn't exist, balance is 0
        return 0;
      }
    } catch (error) {
      console.error("Error fetching token balance:", error);
      throw error;
    }
  },

  async checkEligibility(walletAddress: string): Promise<{
    isEligible: boolean;
    solBalance: number;
    tokenBalance?: number;
  }> {
    try {
      const solBalance = await this.getSOLBalance(walletAddress);

      // If you want to check specific token balance
      if (CONSTANTS.TOKEN_MINT_ADDRESS) {
        const tokenBalance = await this.getTokenBalance(
          walletAddress,
          CONSTANTS.TOKEN_MINT_ADDRESS
        );

        return {
          isEligible:
            solBalance >= CONSTANTS.MIN_SOL_BALANCE &&
            tokenBalance >= CONSTANTS.MIN_TOKEN_BALANCE,
          solBalance,
          tokenBalance,
        };
      }

      return {
        isEligible: solBalance >= CONSTANTS.MIN_SOL_BALANCE,
        solBalance,
      };
    } catch (error) {
      console.error("Error checking eligibility:", error);
      throw error;
    }
  },
};
