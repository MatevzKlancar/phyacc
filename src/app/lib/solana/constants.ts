export const CONSTANTS = {
  SOLANA_RPC_URL:
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com",
  MIN_SOL_BALANCE: 2, // 2 SOL minimum requirement
  TOKEN_MINT_ADDRESS: process.env.NEXT_PUBLIC_TOKEN_MINT_ADDRESS, // Your token mint address
  MIN_TOKEN_BALANCE: 1000, // Minimum token balance required
};
