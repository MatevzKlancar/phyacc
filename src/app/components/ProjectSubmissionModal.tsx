"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { projectsService } from "../lib/supabase";
import { storageService } from "../lib/supabase";

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
    wallet_address: walletAddress || "",
    funding_goal: 0,
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      wallet_address: walletAddress || "",
    }));
  }, [walletAddress]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEligible) {
      setError("You are not eligible to submit a project");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      let imageUrl = formData.image_url;

      // If there's a selected image, upload it first
      if (selectedImage) {
        imageUrl = await storageService.uploadImage(selectedImage);
      }

      await projectsService.createProject({
        ...formData,
        image_url: imageUrl,
      });

      onSubmitSuccess();
      onClose();
      setFormData({
        title: "",
        description: "",
        image_url: "",
        wallet_address: "",
        funding_goal: 0,
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
      <div className="bg-white rounded-lg w-full max-w-md mx-4 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Submit Your Project
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wallet Address
              </label>
              <input
                type="text"
                required
                value={formData.wallet_address}
                disabled={true}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting || !isEligible}
              className={`w-full py-2 px-4 rounded-md transition-colors ${
                isEligible
                  ? "bg-cyan-500 hover:bg-cyan-600 text-white"
                  : "bg-gray-300 cursor-not-allowed text-gray-500"
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
