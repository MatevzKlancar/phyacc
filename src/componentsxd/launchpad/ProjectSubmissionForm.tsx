"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { storageService } from "@/app/lib/supabase";
import { CONSTANTS } from "@/app/lib/solana/constants";
import { projectsService } from "@/app/lib/supabase";

interface ProjectSubmissionFormProps {
  walletAddress: string | null;
  isEligible: boolean;
  onSubmitSuccess: () => void;
}

interface Milestone {
  title: string;
  description: string;
  target_date: string;
  order_index: number;
}

export function ProjectSubmissionForm({
  walletAddress,
  isEligible,
  onSubmitSuccess,
}: ProjectSubmissionFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [fundingGoal, setFundingGoal] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const addMilestone = () => {
    setMilestones([
      ...milestones,
      {
        title: "",
        description: "",
        target_date: "",
        order_index: milestones.length,
      },
    ]);
  };

  const removeMilestone = (index: number) => {
    setMilestones(
      milestones
        .filter((_, i) => i !== index)
        .map((m, i) => ({ ...m, order_index: i }))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress || !isEligible) return;

    if (milestones.length === 0) {
      setError("Please add at least one milestone");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      let finalImageUrl = imageUrl;

      if (selectedImage) {
        finalImageUrl = await storageService.uploadImage(selectedImage);
      }

      const goal = parseFloat(fundingGoal);
      if (isNaN(goal) || goal <= 0) {
        throw new Error("Please enter a valid funding goal");
      }

      // Create project without milestones
      const project = await projectsService.createProject({
        title,
        description,
        image_url: finalImageUrl,
        funding_goal: goal,
        creator_wallet: walletAddress,
        wallet_address: walletAddress,
      });

      // Create milestones for the project
      await Promise.all(
        milestones.map((milestone) =>
          projectsService.createProjectMilestone({
            ...milestone,
            project_id: project.id,
          })
        )
      );

      onSubmitSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit project");
    } finally {
      setSubmitting(false);
    }
  };

  if (!walletAddress || !isEligible) {
    return (
      <div className="text-center p-6">
        <p className="text-red-500">
          Please connect your wallet and ensure you meet the eligibility requirements:
        </p>
        <ul className="list-disc list-inside mt-4 text-gray-400">
          <li>Connect your wallet</li>
          {CONSTANTS.MIN_TOKEN_BALANCE > 0 && (
            <li>Minimum {CONSTANTS.MIN_TOKEN_BALANCE} SOL balance</li>
          )}
          {CONSTANTS.MIN_TOKEN_BALANCE > 0 && (
            <li>Minimum {CONSTANTS.MIN_TOKEN_BALANCE} token balance</li>
          )}
        </ul>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-red-500">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium">
          Project Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
          placeholder="Enter project title"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 min-h-[100px]"
          placeholder="Describe your project"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="projectImage" className="block text-sm font-medium">
          Project Image
        </label>
        <input
          type="file"
          id="projectImage"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
        />
        <p className="text-sm text-gray-500">Or provide an image URL below</p>
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="fundingGoal" className="block text-sm font-medium">
          Funding Goal (SOL)
        </label>
        <input
          type="number"
          id="fundingGoal"
          value={fundingGoal}
          onChange={(e) => setFundingGoal(e.target.value)}
          required
          min="0"
          step="0.1"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
          placeholder="Enter funding goal in SOL"
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Project Milestones</h3>
          <button
            type="button"
            onClick={addMilestone}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-md text-white transition-colors"
          >
            Add Milestone
          </button>
        </div>

        {milestones.map((milestone, index) => (
          <div
            key={index}
            className="p-4 bg-gray-800 border border-gray-700 rounded-lg space-y-3"
          >
            <div className="flex justify-between items-start">
              <h4>Milestone {index + 1}</h4>
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
                const newMilestones = [...milestones];
                newMilestones[index].title = e.target.value;
                setMilestones(newMilestones);
              }}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md"
            />
            <textarea
              placeholder="Milestone Description"
              required
              value={milestone.description}
              onChange={(e) => {
                const newMilestones = [...milestones];
                newMilestones[index].description = e.target.value;
                setMilestones(newMilestones);
              }}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md"
            />
            <input
              type="date"
              required
              value={milestone.target_date}
              onChange={(e) => {
                const newMilestones = [...milestones];
                newMilestones[index].target_date = e.target.value;
                setMilestones(newMilestones);
              }}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md"
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-gradient-to-r from-[#3D6153] to-[#57A769] hover:bg-opacity-80 py-3 rounded-lg transition-colors"
      >
        {submitting ? "Submitting..." : "Submit Project"}
      </button>
    </form>
  );
}
