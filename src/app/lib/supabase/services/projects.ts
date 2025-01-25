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

  async createProject(projectData: {
    title: string;
    description: string;
    image_url: string;
    creator_wallet: string;
    funding_goal: number;
    wallet_address: string;
  }) {
    const { data, error } = await supabase
      .from("projects")
      .insert([projectData])
      .select()
      .single();

    if (error) throw error;
    return data as Project;
  },

  async getProjectById(id: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from("projects")
      .select(
        `
        *,
        project_tokens (*)
      `
      )
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
