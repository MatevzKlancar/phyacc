// components/ProjectUpdates.tsx
import { ProjectUpdate, projectsService } from "@/app/lib/supabase";
import { useState } from "react";

interface ProjectUpdateProps {
  projectId: string;
  creatorWallet: string;
  currentWallet: string | null;
  updates: ProjectUpdate[];
  onUpdateAdded: () => void;
}

export function ProjectUpdates({
  projectId,
  creatorWallet,
  currentWallet,
  updates,
  onUpdateAdded,
}: ProjectUpdateProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isCreator = currentWallet === creatorWallet;

  const handleSubmitUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCreator) return;

    setIsSubmitting(true);
    try {
      await projectsService.createProjectUpdate({
        project_id: projectId,
        creator_wallet: creatorWallet,
        title,
        content,
      });
      setTitle("");
      setContent("");
      onUpdateAdded();
    } catch (error) {
      console.error("Error creating update:", error);
      alert("Failed to create update");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Project Updates</h3>

      {isCreator && (
        <form onSubmit={handleSubmitUpdate} className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Update Title"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Update Content"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 h-32"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
          >
            {isSubmitting ? "Posting..." : "Post Update"}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {updates.map((update) => (
          <div key={update.id} className="bg-gray-800 rounded-lg p-4">
            <h4 className="font-semibold">{update.title}</h4>
            <p className="text-gray-400">{update.content}</p>
            <span className="text-sm text-gray-500">
              {new Date(update.created_at).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
