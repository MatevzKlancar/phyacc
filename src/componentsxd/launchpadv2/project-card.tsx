import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { Copy } from "lucide-react"
import type { Project } from "@/app/lib/supabase"
import { Button } from "@/components/ui/button"

interface ProjectCardProps {
  project: Project & {
    balance?: number
    fundingPercentage?: number
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  const copyToClipboard = async (e: React.MouseEvent, text: string) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(text)
      alert("Wallet address copied to clipboard!")
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <Link href={`/launchpadv2/project/${project.id}`} className="w-[300px]">
      <Card className="border-t border-zinc-800 rounded-t-lg hover:border-zinc-700 transition-colors h-full flex flex-col w-[88%] hover:shadow-lg hover:shadow-zinc-500/50 rounded-t-lg"> {/* Set width to 88%, add glowing effect on hover, and rounded top corners */}
        <CardHeader className="p-0 rounded-t-lg">
          <img
            src={project.image_url || "@robotai.png"}
            alt={project.title}
            className="h-32 w-128 object-cover"
          />
        </CardHeader>
        <CardContent className="p-4 flex-1 flex flex-col">
          <div className="flex-1">
            <h2 className="text-lg md:text-xl font-semibold mb-2 line-clamp-2 overflow-hidden text-ellipsis whitespace-nowrap">
              {project.title}
            </h2>
            <p className="text-zinc-400 text-sm md:text-base mb-4 line-clamp-2 overflow-hidden text-ellipsis whitespace-nowrap">
              {project.description}
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>{project.balance?.toFixed(2)} SOL raised</span>
                <span>{project.fundingPercentage?.toFixed(1)}% funded</span>
              </div>
              <Progress 
                value={project.fundingPercentage} 
                className="h-1.5 bg-zinc-800"
              />
            </div>

            <div className="flex items-center gap-2 bg-zinc-900 p-2 rounded-lg text-sm">
              <code className="text-zinc-300 flex-1 overflow-x-auto whitespace-nowrap">
                {project.wallet_address}
              </code>
              <button
                onClick={(e) => copyToClipboard(e, project.wallet_address)}
                className="p-1 hover:bg-zinc-800 rounded transition-colors"
                title="Copy wallet address"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}