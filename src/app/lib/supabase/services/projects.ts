import { supabase } from "../client";
import type { Project, ProjectUpdate, ProjectMilestone } from "../types";

export const projectsService = {
  async getAllProjects() {
    const { data, error } = await supabase
      .from("projects")
      .select(
        `
        *,
        milestones:project_milestones(*)
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Project[];
  },

  async createProject(project: Omit<Project, "id" | "created_at">) {
    // First, get an available (unassigned) wallet
    const { data: availableWallet, error: walletError } = await supabase
      .from("platform_wallets")
      .select("*")
      .eq("is_assigned", false)
      .limit(1)
      .single();

    if (walletError || !availableWallet) {
      throw new Error("No available platform wallets");
    }

    // Start a Supabase transaction
    const { data: newProject, error: projectError } = await supabase
      .from("projects")
      .insert([{ ...project, wallet_address: availableWallet.public_key }])
      .select()
      .single();

    if (projectError) throw projectError;

    // Mark the wallet as assigned
    const { error: assignError } = await supabase
      .from("platform_wallets")
      .update({
        is_assigned: true,
        assigned_project_id: newProject.id,
      })
      .eq("id", availableWallet.id);

    if (assignError) throw assignError;

    return newProject as Project;
  },

  async getProjectById(id: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching project:", error);
      return null;
    }

    return data;
  },

  async createProjectUpdate(update: Omit<ProjectUpdate, "id" | "created_at">) {
    const { data, error } = await supabase
      .from("project_updates")
      .insert(update)
      .single();

    if (error) throw error;
    return data;
  },

  async getProjectUpdates(projectId: string) {
    const { data, error } = await supabase
      .from("project_updates")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async createProjectMilestone(
    milestone: Omit<ProjectMilestone, "id" | "created_at" | "completed_at">
  ) {
    const { data, error } = await supabase
      .from("project_milestones")
      .insert([milestone])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async completeMilestone(milestoneId: string) {
    const { data, error } = await supabase
      .from("project_milestones")
      .update({ completed_at: new Date().toISOString() })
      .eq("id", milestoneId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
