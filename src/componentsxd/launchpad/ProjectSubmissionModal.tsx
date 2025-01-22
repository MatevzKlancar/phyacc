"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { storageService, projectsService } from "@/app/lib/supabase";

interface Milestone {
  title: string;
  description: string;
  target_date: string;
  order_index: number;
}

interface ProjectSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
  walletAddress: string | null;
  isEligible: boolean;
}

export const ProjectSubmissionModal = ({
  isOpen,
  onClose,
  onSubmitSuccess,
  walletAddress,
  isEligible,
}: ProjectSubmissionModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    wallet_address: "",
    creator_wallet: walletAddress || "",
    funding_goal: 0,
    milestones: [] as Milestone[],
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      creator_wallet: walletAddress || "",
    }));
  }, [walletAddress]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const addMilestone = () => {
    setFormData((prev) => ({
      ...prev,
      milestones: [
        ...prev.milestones,
        {
          title: "",
          description: "",
          target_date: "",
          order_index: prev.milestones.length,
        },
      ],
    }));
  };

  const removeMilestone = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      milestones: prev.milestones
        .filter((_, i) => i !== index)
        .map((m, i) => ({ ...m, order_index: i })),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEligible) {
      setError("You are not eligible to submit a project");
      return;
    }

    if (formData.milestones.length === 0) {
      setError("Please add at least one milestone");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      let imageUrl = formData.image_url;

      if (selectedImage) {
        imageUrl = await storageService.uploadImage(selectedImage);
      }

      // Create project without milestones
      const { milestones, ...projectData } = formData;
      const project = await projectsService.createProject({
        ...projectData,
        image_url: imageUrl,
      });

      // Create milestones for the project
      await Promise.all(
        formData.milestones.map((milestone) =>
          projectsService.createProjectMilestone({
            ...milestone,
            project_id: project.id,
          })
        )
      );

      onSubmitSuccess();
      onClose();
      setFormData({
        title: "",
        description: "",
        image_url: "",
        wallet_address: "",
        creator_wallet: "",
        funding_goal: 0,
        milestones: [],
      });
      setSelectedImage(null);
    } catch (err) {
      setError("Failed to submit project. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gray-900 rounded-lg w-full max-w-2xl mx-4 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-400"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-6">
            Submit Your Project
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Project Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Project Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
              />
              <p className="text-sm text-gray-500 mt-1">
                Or provide an image URL below
              </p>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) =>
                  setFormData({ ...formData, image_url: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
                className="w-full mt-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Funding Goal (SOL)
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.1"
                value={formData.funding_goal}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    funding_goal: parseFloat(e.target.value),
                  })
                }
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">
                  Project Milestones
                </h3>
                <button
                  type="button"
                  onClick={addMilestone}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-md text-white transition-colors"
                >
                  Add Milestone
                </button>
              </div>

              {formData.milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-800 border border-gray-700 rounded-lg space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="text-white">Milestone {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeMilestone(index)}
                      className="text-red-500 hover:text-red-400"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Milestone Title"
                    required
                    value={milestone.title}
                    onChange={(e) => {
                      const newMilestones = [...formData.milestones];
                      newMilestones[index].title = e.target.value;
                      setFormData({ ...formData, milestones: newMilestones });
                    }}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  />
                  <textarea
                    placeholder="Milestone Description"
                    required
                    value={milestone.description}
                    onChange={(e) => {
                      const newMilestones = [...formData.milestones];
                      newMilestones[index].description = e.target.value;
                      setFormData({ ...formData, milestones: newMilestones });
                    }}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  />
                  <input
                    type="date"
                    required
                    value={milestone.target_date}
                    onChange={(e) => {
                      const newMilestones = [...formData.milestones];
                      newMilestones[index].target_date = e.target.value;
                      setFormData({ ...formData, milestones: newMilestones });
                    }}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  />
                </div>
              ))}
            </div>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting || !isEligible}
              className={`w-full py-2 px-4 rounded-md transition-colors ${
                isEligible
                  ? "bg-cyan-500 hover:bg-cyan-600 text-white"
                  : "bg-gray-600 cursor-not-allowed text-gray-400"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit Project"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
