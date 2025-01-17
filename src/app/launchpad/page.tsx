"use client";

import { useEffect, useState } from "react";
import { projectsService } from "../lib/supabase";
import { Project } from "../lib/supabase";

import { useWallet } from "../lib/hooks/useWallet";
import { useWalletEligibility } from "../lib/hooks/useWalletEligibility";
import { ProjectSubmissionModal } from "../components/ProjectSubmissionModal";
import { CONSTANTS } from "../lib/solana/constants";

export default function LaunchpadPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { walletAddress, connecting, connectWallet, disconnectWallet } =
    useWallet();
  const {
    isEligible,
    solBalance,
    tokenBalance,
    loading: checkingEligibility,
    error: eligibilityError,
  } = useWalletEligibility(walletAddress);

  const loadProjects = async () => {
    try {
      const data = await projectsService.getAllProjects();
      setProjects(data);
    } catch (error) {
      console.error("Error loading projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleProjectSubmitted = () => {
    loadProjects();
  };

  const handleSubmitClick = async () => {
    if (!walletAddress) {
      try {
        await connectWallet();
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    } else if (!isEligible) {
      const requirements = [
        `${CONSTANTS.MIN_SOL_BALANCE} SOL (Current: ${
          solBalance?.toFixed(2) || 0
        } SOL)`,
        CONSTANTS.TOKEN_MINT_ADDRESS &&
          `${CONSTANTS.MIN_TOKEN_BALANCE} tokens (Current: ${
            tokenBalance?.toFixed(2) || 0
          })`,
      ].filter(Boolean);

      alert(`Insufficient balance. You need:\n${requirements.join("\n")}`);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleWalletClick = async () => {
    if (walletAddress) {
      await disconnectWallet();
    } else {
      await connectWallet();
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <ProjectSubmissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitSuccess={handleProjectSubmitted}
        walletAddress={walletAddress}
        isEligible={isEligible}
      />

      {/* Stats Bar */}
      <div className="border-b border-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-cyan-400">
              PHY/ACC LAUNCHPAD
            </h1>
            <p className="text-gray-400">
              Discover or Build the Next AI Revolution.
            </p>
          </div>
          <div className="flex gap-8 items-center">
            <div>
              <p className="text-gray-400">Total raised</p>
              <p className="text-xl font-bold">
                {projects.reduce((acc, p) => acc + (p.funding_goal || 0), 0)}{" "}
                SOL
              </p>
            </div>
            <div>
              <p className="text-gray-400">Projects submitted</p>
              <p className="text-xl font-bold">{projects.length}</p>
            </div>
            {walletAddress ? (
              <div className="flex gap-4 items-center">
                <div className="flex flex-col">
                  <button
                    onClick={handleWalletClick}
                    className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
                    title="Click to disconnect"
                  >
                    {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
                  </button>
                  {walletAddress && (
                    <div className="flex flex-col text-sm">
                      <span
                        className={`${
                          (solBalance ?? 0) >= CONSTANTS.MIN_SOL_BALANCE
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {solBalance?.toFixed(2) || 0} SOL
                      </span>
                      {CONSTANTS.TOKEN_MINT_ADDRESS && (
                        <span
                          className={`${
                            (tokenBalance || 0) >= CONSTANTS.MIN_TOKEN_BALANCE
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {tokenBalance?.toFixed(2) || 0} tokens
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleSubmitClick}
                  className={`px-6 py-2 rounded-lg transition-colors ${
                    isEligible
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-600 cursor-not-allowed"
                  }`}
                  disabled={!isEligible || checkingEligibility}
                >
                  {checkingEligibility ? "Checking..." : "Submit your project"}
                </button>
              </div>
            ) : (
              <button
                onClick={handleWalletClick}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg transition-colors"
                disabled={connecting}
              >
                {connecting ? "Connecting..." : "Connect Wallet"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Projects List */}
          <div className="flex-1 space-y-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-gray-900/80 border border-gray-800 rounded-lg p-6 flex gap-6"
              >
                <div className="w-48 h-32 bg-gray-800 rounded-lg overflow-hidden">
                  {project.image_url && (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold">{project.title}</h2>
                      <p className="text-gray-400">{project.description}</p>
                    </div>
                    <div className="text-gray-400">12 days left</div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between mb-2">
                      <span>{project.funding_goal} SOL raised</span>
                      <span>69% funded</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full w-[69%] bg-cyan-500"></div>
                    </div>
                  </div>
                  <button className="mt-4 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors">
                    Back this project
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="w-80 space-y-6">
            <div className="bg-gray-900/80 border border-gray-800 rounded-lg p-4">
              <input
                type="text"
                placeholder="Search projects"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
              />
            </div>
            <div className="bg-gray-900/80 border border-gray-800 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Sort by</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="radio" name="sort" defaultChecked />
                  <span>Trending</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="sort" />
                  <span>New</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="sort" />
                  <span>Top rated</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="sort" />
                  <span>Most raised</span>
                </label>
              </div>
            </div>
            <div className="bg-gray-900/80 border border-gray-800 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Category</h3>
              <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2">
                <option>Select a category</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
