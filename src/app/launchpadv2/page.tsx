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

interface ProjectWithFunding extends Project {
  balance?: number
  fundingPercentage?: number
}

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

      setProjects(projectsWithFunding)
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-3/4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
            <SelectContent>
              <SelectItem value="new">Sort by: New</SelectItem>
              <SelectItem value="top-rated">Sort by: Top rated</SelectItem>
              <SelectItem value="most-raised">Sort by: Most raised</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>{/* Add categories as needed */}</SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

