"use client"

import { useEffect, useState } from "react"
import { Connection, PublicKey } from "@solana/web3.js"
import { ProjectCard } from "@/componentsxd/launchpadv2/project-card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
} from "@/components/ui/select"
import { projectsService } from "@/app/lib/supabase"
import type { Project } from "@/app/lib/supabase"
import { useWallet } from "@/app/lib/hooks/useWallet"
import { useWalletEligibility } from "@/app/lib/hooks/useWalletEligibility"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Info } from "lucide-react"

interface ProjectWithFunding extends Project {
  balance?: number
  fundingPercentage?: number
}

const mockProjects = [
  {
    id: "1",
    title: "Project Alpha",
    description: "A revolutionary project that aims to change the world.",
    image_url: "https://t3.ftcdn.net/jpg/05/59/87/12/360_F_559871209_pbXlOVArUal3mk6Ce60JuP13kmuIRCth.jpg",
    wallet_address: "ABC1234567890DEF1234567890ABC1234567890",
    funding_goal: 1000,
    balance: 500,
    fundingPercentage: 50,
    creator_wallet: "CREATOR_WALLET_1",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Project Beta",
    description: "I will add AI agent to arduino and he will pass the butter",
    image_url: "https://t3.ftcdn.net/jpg/05/59/87/12/360_F_559871209_pbXlOVArUal3mk6Ce60JuP13kmuIRCth.jpg",
    wallet_address: "DEF1234567890ABC1234567890DEF1234567890",
    funding_goal: 2000,
    balance: 1500,
    fundingPercentage: 75,
    creator_wallet: "CREATOR_WALLET_2",
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Project Gamma",
    description: "A community-driven initiative for sustainable energy.",
    image_url: "https://t3.ftcdn.net/jpg/05/59/87/12/360_F_559871209_pbXlOVArUal3mk6Ce60JuP13kmuIRCth.jpg",
    wallet_address: "GHI1234567890ABC1234567890GHI1234567890",
    funding_goal: 3000,
    balance: 2500,
    fundingPercentage: 83.33,
    creator_wallet: "CREATOR_WALLET_3",
    created_at: new Date().toISOString(),
  },

];

export default function Home() {
  const [projects, setProjects] = useState<ProjectWithFunding[]>([])
  const [loading, setLoading] = useState(true)
  const { walletAddress } = useWallet()
  const { isEligible } = useWalletEligibility(walletAddress)
  const [connection] = useState(
    new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "")
  )

  const loadProjects = async () => {
    try {
      const fetchedProjects = await projectsService.getAllProjects()
      
      const publicKeys = fetchedProjects.map(
        (project) => new PublicKey(project.wallet_address)
      )

      const balances = await connection.getMultipleAccountsInfo(publicKeys)

      const projectsWithFunding = fetchedProjects.map((project, index) => {
        const balance = (balances[index]?.lamports || 0) / 1e9
        const fundingPercentage = (balance / project.funding_goal) * 100

        return {
          ...project,
          balance,
          fundingPercentage: Math.min(fundingPercentage, 100),
        }
      })

      // Combine real projects with mock projects
      setProjects([...projectsWithFunding, ...mockProjects])
    } catch (error) {
      console.error("Error loading projects:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
    const interval = setInterval(loadProjects, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 0.15,
          transition: { duration: 2 }
        }}
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(0, 255, 255, 0.1) 0%, transparent 50%)',
          filter: 'blur(100px)'
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
            <Button 
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black flex items-center justify-center gap-2 mt-4"
            >
              <Info className="w-4 h-4" />
              Platform Information
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

