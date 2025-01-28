"use client";

import { useEffect, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { ProjectCard } from "@/components/launchpad/project-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
} from "@/components/ui/select";
import { projectsService } from "@/app/lib/supabase";
import type { Project } from "@/app/lib/supabase";
import { useWallet } from "@/app/lib/hooks/useWallet";
import { useWalletEligibility } from "@/app/lib/hooks/useWalletEligibility";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Info } from "lucide-react";

interface ProjectWithFunding extends Project {
  balance?: number;
  fundingPercentage?: number;
}

export default function Home() {
  const [projects, setProjects] = useState<ProjectWithFunding[]>([]);
  const [loading, setLoading] = useState(true);
  const { walletAddress } = useWallet();
  const { isEligible } = useWalletEligibility(walletAddress);
  const [connection] = useState(
    new Connection(
      process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
        "https://greatest-dark-sailboat.solana-mainnet.quiknode.pro/6f2eaa507400683ee6aaf8e436cc279d77c13288/"
    )
  );

  const loadProjects = async () => {
    try {
      const fetchedProjects = await projectsService.getAllProjects();

      const publicKeys = fetchedProjects.map(
        (project) => new PublicKey(project.wallet_address)
      );

      const balances = await connection.getMultipleAccountsInfo(publicKeys);

      const projectsWithFunding = fetchedProjects.map((project, index) => {
        const balance = (balances[index]?.lamports || 0) / 1e9;
        const fundingPercentage = (balance / project.funding_goal) * 100;

        return {
          ...project,
          balance,
          fundingPercentage: Math.min(fundingPercentage, 100),
        };
      });

      // Combine real projects with mock projects
      setProjects([...projectsWithFunding]);
    } catch (error) {
      console.error("Error loading projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
    const interval = setInterval(loadProjects, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 0.15,
          transition: { duration: 2 },
        }}
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(0, 255, 255, 0.1) 0%, transparent 50%)",
          filter: "blur(100px)",
        }}
      />
      <div className="flex flex-col lg:flex-row gap-8 relative z-10">
        <div className="lg:w-3/4 flex flex-col items-start">
          <div className="flex flex-wrap justify-start gap-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
        <div className="lg:w-1/4 space-y-6">
          <Input type="text" placeholder="Search projects" />
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Sort by: Trending" />
            </SelectTrigger>
            <SelectContent className="bg-black">
              <SelectItem value="new">Sort by: New</SelectItem>
              <SelectItem value="top-rated">Sort by: Top rated</SelectItem>
              <SelectItem value="most-raised">Sort by: Most raised</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent className="bg-black">
              <SelectItem value="new">Sort by: New</SelectItem>
              <SelectItem value="top-rated">Sort by: Top rated</SelectItem>
              <SelectItem value="most-raised">Sort by: Most raised</SelectItem>
            </SelectContent>
          </Select>

          <Link href="/launchpad/info">
            <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black flex items-center justify-center gap-2 mt-4">
              <Info className="w-4 h-4" />
              Platform Information
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
