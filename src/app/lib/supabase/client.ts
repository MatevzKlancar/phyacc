import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a default client for public access
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getSupabaseClient = (walletAddress?: string) => {
  return supabase;
};

// Export the default client for public access
export { supabase };
