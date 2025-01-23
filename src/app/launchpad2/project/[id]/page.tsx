"use client";

import { useEffect, useState } from "react";

import { Connection, PublicKey } from "@solana/web3.js";
import { useParams } from "next/navigation";
import { projectsService } from "@/app/lib/supabase/services/projects";
import { ProjectDetails } from "@/componentsxd/launchpad/ProjectDetails";
export default function ProjectDetailPage() {
  const params = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [connection] = useState(
    new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "")
  );

  useEffect(() => {
    const loadProject = async () => {
      // Check if params.id exists and is a string
      if (!params?.id || typeof params.id !== "string") {
        setLoading(false);
        return;
      }

      try {
        const fetchedProject = await projectsService.getProjectById(params.id);
        if (fetchedProject) {
          // Get project balance
          const publicKey = new PublicKey(fetchedProject.wallet_address);
          const accountInfo = await connection.getAccountInfo(publicKey);
          const balance = (accountInfo?.lamports || 0) / 1e9;
          const fundingPercentage =
            (balance / fetchedProject.funding_goal) * 100;

          setProject({
            ...fetchedProject,
            balance,
            fundingPercentage: Math.min(fundingPercentage, 100),
          });
        }
      } catch (error) {
        console.error("Error loading project:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [params?.id, connection]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="container mx-auto px-4 py-8">
        <a
          href="/launchpad"
          className="text-gray-400 hover:text-white inline-block mb-8"
        >
          ← Back to projects
        </a>
        <ProjectDetails project={project} />
      </div>
    </main>
  );
}
