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
  project_tokens?: ProjectToken[];
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

export interface ProjectToken {
  id: string;
  project_id: string;
  name: string;
  symbol: string;
  description: string;
  twitter_url?: string;
  telegram_url?: string;
  website_url?: string;
  image_url: string;
  allocation_percentage: number;
  created_at: string;
  wallet_address?: string;
  api_key?: string;
  is_created: boolean;
}
