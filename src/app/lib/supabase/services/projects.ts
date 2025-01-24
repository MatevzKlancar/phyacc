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

  async createProject(
    project: Omit<Project, "id" | "created_at">,
    client = supabase
  ) {
    console.log("Starting createProject with project data:", project);

    // First, get an available wallet - MODIFIED THIS QUERY
    const { data: wallets, error: walletsError } = await client
      .from("platform_wallets")
      .select("*")
      .eq("is_assigned", false)
      .is("assigned_project_id", null) // Added this check
      .limit(1); // Only get one wallet

    console.log("Available wallets query result:", { wallets, walletsError });

    if (walletsError) throw walletsError;
    if (!wallets || wallets.length === 0) {
      throw new Error("No available platform wallets");
    }

    const availableWallet = wallets[0];
    console.log("Selected wallet:", availableWallet);

    // IMPORTANT: Update the wallet BEFORE creating the project
    const { error: updateError } = await client
      .from("platform_wallets")
      .update({
        is_assigned: true,
        assigned_project_id: null, // Will update this after project creation
      })
      .eq("id", availableWallet.id);

    if (updateError) {
      console.error("Error updating wallet:", updateError);
      throw updateError;
    }

    // Create the project
    const { data: projects, error: projectError } = await client
      .from("projects")
      .insert([{ ...project, wallet_address: availableWallet.public_key }])
      .select();

    console.log("Project creation result:", { projects, projectError });

    if (projectError) {
      // If project creation fails, unassign the wallet
      await client
        .from("platform_wallets")
        .update({
          is_assigned: false,
          assigned_project_id: null,
        })
        .eq("id", availableWallet.id);
      throw projectError;
    }

    if (!projects || projects.length === 0) {
      throw new Error("Failed to create project");
    }

    const newProject = projects[0];

    // Now update the wallet with the project ID
    const { error: finalUpdateError } = await client
      .from("platform_wallets")
      .update({
        assigned_project_id: newProject.id,
      })
      .eq("id", availableWallet.id);

    if (finalUpdateError) {
      console.error("Error updating wallet with project ID:", finalUpdateError);
      throw finalUpdateError;
    }

    return newProject;
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

  async createProjectToken(
    tokenData: {
      project_id: string;
      name: string;
      symbol: string;
      description: string;
      twitter_url?: string;
      telegram_url?: string;
      website_url?: string;
      image_url: string;
      allocation_percentage: number;
    },
    client = supabase
  ) {
    console.log("Starting createProjectToken with:", tokenData);

    // First verify the project exists and belongs to the wallet
    const { data: project, error: projectError } = await client
      .from("projects")
      .select("creator_wallet")
      .eq("id", tokenData.project_id)
      .single();

    if (projectError || !project) {
      throw new Error("Project not found or access denied");
    }

    const { data: tokens, error } = await client
      .from("project_tokens")
      .insert([tokenData])
      .select();

    console.log("Token creation result:", { tokens, error });

    if (error) {
      console.error("Error creating token:", error);
      throw error;
    }

    if (!tokens || tokens.length === 0) {
      throw new Error("Failed to create token");
    }

    return tokens[0];
  },
};
