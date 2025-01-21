import { useState } from "react";
import { projectsService } from "../lib/supabase";
import type { ProjectMilestone } from "../lib/supabase/types";

interface ProjectMilestonesProps {
  projectId: string;
  creatorWallet: string;
  currentWallet: string | null;
  milestones: ProjectMilestone[];
  onMilestoneCompleted: () => void;
}

export function ProjectMilestones({
  projectId,
  creatorWallet,
  currentWallet,
  milestones,
  onMilestoneCompleted,
}: ProjectMilestonesProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const isCreator = currentWallet === creatorWallet;

  const handleCompleteMilestone = async (milestoneId: string) => {
    if (!isCreator) return;

    setIsUpdating(true);
    try {
      await projectsService.completeMilestone(milestoneId);
      onMilestoneCompleted();
    } catch (error) {
      console.error("Error completing milestone:", error);
      alert("Failed to complete milestone");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Project Roadmap</h3>
      <div className="space-y-4">
        {milestones
          .sort((a, b) => a.order_index - b.order_index)
          .map((milestone) => (
            <div
              key={milestone.id}
              className={`p-4 rounded-lg ${
                milestone.completed_at
                  ? "bg-green-900/20 border border-green-500"
                  : "bg-gray-800 border border-gray-700"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{milestone.title}</h4>
                  <p className="text-gray-400 mt-1">{milestone.description}</p>
                  <div className="flex gap-4 mt-2 text-sm text-gray-500">
                    <span>
                      Target:{" "}
                      {new Date(milestone.target_date).toLocaleDateString()}
                    </span>
                    {milestone.completed_at && (
                      <span className="text-green-500">
                        ✓ Completed:{" "}
                        {new Date(milestone.completed_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                {isCreator && !milestone.completed_at && (
                  <button
                    onClick={() => handleCompleteMilestone(milestone.id)}
                    disabled={isUpdating}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors disabled:opacity-50"
                  >
                    {isUpdating ? "Updating..." : "Mark Complete"}
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
