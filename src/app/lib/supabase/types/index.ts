export interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  wallet_address: string; // Project's escrow wallet where funds are stored
  creator_wallet: string; // Project creator's personal wallet
  funding_goal: number;
  created_at: string;
  milestones?: ProjectMilestone[];
  updates?: ProjectUpdate[];
}

export interface ProjectMilestone {
  id: string;
  project_id: string;
  title: string;
  description: string;
  target_date: string;
  completed_at?: string | null;
  order_index: number; // To maintain milestone order
  created_at: string;
}

export interface ProjectUpdate {
  id: string;
  project_id: string;
  creator_wallet: string;
  milestone_id?: string; // Optional reference to the completed milestone
  title: string;
  content: string;
  created_at: string;
}
