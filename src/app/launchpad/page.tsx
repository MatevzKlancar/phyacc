"use client";

import { useEffect, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { projectsService } from "../lib/supabase";
import type { Project } from "../lib/supabase";

import { useWallet } from "../lib/hooks/useWallet";
import { useWalletEligibility } from "../lib/hooks/useWalletEligibility";
import { ProjectSubmissionModal } from "../components/launchpad/ProjectSubmissionModal";
import { CONSTANTS } from "../lib/solana/constants";
import { ProjectMilestones } from "../components/launchpad/ProjectMilestones";
import { Copy } from "lucide-react";
import { ProjectDetails } from "../components/launchpad/ProjectDetails";
import { Pill } from "../components/launchpad/components/pill";
import Link from "next/link";
import { TopBarButton } from "../components/launchpad/components/topbarbutton";

interface ProjectWithFunding extends Project {
  balance?: number;
  fundingPercentage?: number;
}

import { Jura } from 'next/font/google';

const jura = Jura({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export default function LaunchpadPage() {
  const [projects, setProjects] = useState<ProjectWithFunding[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoading, setShowLoading] = useState(true);
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
  const [connection] = useState(
    new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "")
  );

  const loadProjects = async () => {
    try {
      const fetchedProjects = await projectsService.getAllProjects();

      // Batch all balance requests together
      const publicKeys = fetchedProjects.map(
        (project) => new PublicKey(project.wallet_address)
      );

      // Get all balances in a single RPC call
      const balances = await connection.getMultipleAccountsInfo(publicKeys);

      const projectsWithFunding = fetchedProjects.map((project, index) => {
        const balance = (balances[index]?.lamports || 0) / 1e9; // Convert lamports to SOL
        const fundingPercentage = (balance / project.funding_goal) * 100;

        return {
          ...project,
          balance,
          fundingPercentage: Math.min(fundingPercentage, 100), // Cap at 100%
        };
      });

      setProjects(projectsWithFunding);
    } catch (error) {
      console.error("Error loading projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
    // Show loading animation for exactly 3 seconds
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 3000);

    // Refresh every 30 seconds
    const interval = setInterval(loadProjects, 30000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer); // Clean up timer
    };
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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Wallet address copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  if (showLoading)
    return (
      <div className={`${jura.className} min-h-screen bg-[#0a0a0a] flex items-center justify-center`}>
        <img
          src="/loading-animation-desktop.gif"
          alt="Loading..."
          className="object-contain"
        />
      </div>
    );

  return (
    <main className={`${jura.className} min-h-screen bg-[#0a0a0a] text-white launchpad-page`}>
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
          <div className="flex-col items-center gap-4">
            <div className="items-center gap-4 flex-col">
              <img src="/logoweb.svg" alt="Logo" className="h-14 w-122" />
            </div>
          <div className="gap-4">
            <p className="text-gray-400" style={{ paddingLeft: '5px' }}>
              Discover or Build the Next AI Revolution.
            </p>
          </div>
          </div>
          <div className="flex gap-8 items-center">
            <Pill 
              label="Total raised"
              value={`${projects.reduce((acc, p) => acc + (p.funding_goal || 0), 0)} SOL`}
            />
            <Pill
              label="Projects submitted"
              value={projects.length}
            />
            <TopBarButton
              walletAddress={walletAddress}
              connecting={connecting}
              isEligible={isEligible}
              checkingEligibility={checkingEligibility}
              solBalance={solBalance || 0}
              tokenBalance={tokenBalance || 0}
              onWalletClick={handleWalletClick}
              onSubmitClick={handleSubmitClick}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <div className="flex-1 space-y-6">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/launchpad/project/${project.id}`}
                className="block"
              >
                <div className="bg-gray-900/80 border border-gray-800 rounded-lg p-6 flex flex-col gap-6 cursor-pointer hover:border-gray-700 transition-colors">
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
                        <h2 className="text-xl font-semibold">
                          {project.title}
                        </h2>
                        <p className="text-gray-400">{project.description}</p>
                      </div>
                      <div className="text-gray-400">12 days left</div>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between mb-2">
                        <span>{project.balance?.toFixed(2)} SOL raised</span>
                        <span>
                          {project.fundingPercentage?.toFixed(1)}% funded
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div
                          className="bg-cyan-600 h-2.5 rounded-full"
                          style={{ width: `${project.fundingPercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Wallet Address Display */}
                    <div className="flex flex-col gap-2">
                      <p className="text-sm text-gray-400">
                        Project Wallet Address:
                      </p>
                      <div className="flex items-center gap-2 bg-gray-800 p-3 rounded-lg">
                        <code className="text-sm text-gray-300 flex-1 overflow-x-auto">
                          {project.wallet_address}
                        </code>
                        <button
                          onClick={() =>
                            copyToClipboard(project.wallet_address)
                          }
                          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                          title="Copy wallet address"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <button className="mt-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors">
                      Back this project
                    </button>
                  </div>
                  <ProjectMilestones
                    projectId={project.id}
                    creatorWallet={project.creator_wallet}
                    currentWallet={walletAddress}
                    milestones={project.milestones || []}
                    onMilestoneCompleted={loadProjects}
                  />
                </div>
              </Link>
            ))}
          </div>

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
