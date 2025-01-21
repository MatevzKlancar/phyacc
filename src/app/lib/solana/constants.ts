export const CONSTANTS = {
  SOLANA_RPC_URL:
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com",
  TOKEN_MINT_ADDRESS:
    process.env.NEXT_PUBLIC_TOKEN_MINT_ADDRESS ||
    "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr",
  MIN_TOKEN_BALANCE: 1, // Minimum token balance required
};
