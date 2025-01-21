import { supabase } from "../client";

interface PlatformWallet {
  id: string;
  public_key: string;
  is_assigned: boolean;
  assigned_project_id?: string;
  created_at: string;
}

export const platformWalletsService = {
  async getAvailableWallet() {
    const { data, error } = await supabase
      .from("platform_wallets")
      .select("*")
      .eq("is_assigned", false)
      .limit(1)
      .single();

    if (error) throw error;
    return data as PlatformWallet;
  },

  async assignWalletToProject(walletId: string, projectId: string) {
    const { data, error } = await supabase
      .from("platform_wallets")
      .update({
        is_assigned: true,
        assigned_project_id: projectId,
      })
      .eq("id", walletId)
      .select()
      .single();

    if (error) throw error;
    return data as PlatformWallet;
  },

  async getProjectWallet(projectId: string) {
    const { data, error } = await supabase
      .from("platform_wallets")
      .select("*")
      .eq("assigned_project_id", projectId)
      .single();

    if (error) throw error;
    return data as PlatformWallet;
  },
};
