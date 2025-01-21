const { Keypair } = require("@solana/web3.js");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" }); // Specify the .env.local file

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

async function generatePlatformWallets(count = 5) {
  const wallets = Array.from({ length: count }, () => {
    const keypair = Keypair.generate();
    return {
      public_key: keypair.publicKey.toString(),
      // Store the private key securely offline or in a secure vault
      private_key: Buffer.from(keypair.secretKey).toString("base64"),
    };
  });

  // Insert the public keys into the database
  const { data, error } = await supabase
    .from("platform_wallets")
    .insert(wallets.map((w) => ({ public_key: w.public_key })));

  if (error) {
    console.error("Error storing wallets:", error);
    return;
  }

  console.log("Generated wallets:", wallets);
  console.log("\nIMPORTANT: Save these private keys securely offline!");
  wallets.forEach((wallet, i) => {
    console.log(`\nWallet ${i + 1}:`);
    console.log(`Public Key: ${wallet.public_key}`);
    console.log(`Private Key: ${wallet.private_key}`);
    console.log("-------------------");
  });
}

// Run the function
generatePlatformWallets().catch(console.error);
