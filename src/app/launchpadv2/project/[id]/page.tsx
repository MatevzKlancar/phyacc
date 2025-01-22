"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { projectsService } from "@/app/lib/supabase"
import { Connection, PublicKey } from "@solana/web3.js"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function ProjectDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('campaign')
  const [connection] = useState(
    new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "")
  )
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const loadProject = async () => {
      if (!params?.id || typeof params.id !== "string") {
        setLoading(false)
        return
      }

      try {
        const fetchedProject = await projectsService.getProjectById(params.id)
        if (fetchedProject) {
          const publicKey = new PublicKey(fetchedProject.wallet_address)
          const accountInfo = await connection.getAccountInfo(publicKey)
          const balance = (accountInfo?.lamports || 0) / 1e9
          const fundingPercentage = (balance / fetchedProject.funding_goal) * 100

          setProject({
            ...fetchedProject,
            balance,
            fundingPercentage: Math.min(fundingPercentage, 100),
          })
        }
      } catch (error) {
        console.error("Error loading project:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProject()
  }, [params?.id, connection])

  if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>
  if (!project) return <div className="container mx-auto px-4 py-8">Project not found</div>

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <Button
          onClick={() => router.back()}
          variant="ghost"
          className="mb-6 text-white hover:text-white/80 -ml-2 text-sm md:text-base"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-zinc-800 mb-6">
              <CardHeader>
                <CardTitle className="text-3xl">{project.title}</CardTitle>
                <p className="text-zinc-400 mt-2">{project.description}</p>
              </CardHeader>
              <CardContent>
                <img
                  src={project.image_url || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-[400px] object-cover rounded-lg"
                />
              </CardContent>
            </Card>

            <Card className="border-zinc-800">
              <CardHeader>
                <CardTitle className="text-xl">Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-zinc-300">{project.description}</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-zinc-800">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-2xl font-bold mb-2">
                      <span>{project.balance} SOL</span>
                      <span className="text-zinc-400 text-lg">
                        pledged of {project.funding_goal} SOL goal
                      </span>
                    </div>
                    <Progress value={project.fundingPercentage} className="h-2 bg-zinc-800" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-bold">28</div>
                      <div className="text-zinc-400">backers</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">34</div>
                      <div className="text-zinc-400">days to go</div>
                    </div>
                  </div>

                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    Back this project
                  </Button>

                  <p className="text-sm text-zinc-400 text-center">
                    All or nothing. This project will only be funded if it reaches its goal.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-zinc-800">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Project Milestones</h3>
                <div className="space-y-4">
                  {project.milestones?.map((milestone: any) => (
                    <div key={milestone.id} className="border-b border-zinc-800 pb-4 last:border-0 last:pb-0">
                      <h4 className="font-medium mb-1">{milestone.title}</h4>
                      <p className="text-sm text-zinc-400">
                        Target: {new Date(milestone.target_date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="border-zinc-800 mt-8 w-full">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-zinc-300">
              <p className="text-center">
                PHY/ACC connects visionaries with backers to fund the projects
              </p>
              <p className="text-center">
                Rewards aren't guaranteed, but creators must regularly update backers.
              </p>
              <p className="text-center">
                Creators must deliver on their promises, and backers can vote for refunds through a voting system.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Sticky Navigation */}
      <nav className={`w-full transition-all duration-300 ${isSticky ? 'sticky top-0 z-50 bg-black/95 backdrop-blur-sm' : ''}`}>
        <div className="border-b border-zinc-800">
          <div className="container mx-auto">
            <div className="flex justify-between items-center py-2">
              <div className="flex">
                {['Campaign', 'Rewards', 'Roadmap', 'Voting'].map((section) => (
                  <Button
                    key={section}
                    variant="ghost"
                    className={`relative py-6 px-8 text-base font-medium ${
                      activeSection === section.toLowerCase() ? 'text-emerald-400' : 'text-zinc-400'
                    }`}
                    onClick={() => setActiveSection(section.toLowerCase())}
                  >
                    {section}
                    {activeSection === section.toLowerCase() && (
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-400" />
                    )}
                  </Button>
                ))}
              </div>
              <Button className="bg-emerald-500 hover:bg-emerald-600 py-6 px-8">
                Back this project
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-zinc-800">
              <CardHeader>
                <CardTitle className="text-xl">About the project</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-zinc-300">
                  We are a student-run development team based out of the University of Miami with a shared passion for fitness and innovation. Through our collective fitness journeys, we realized something: while there are countless wearables and calorie tracker apps available, there's a critical gap in tools designed specifically for gym enthusiasts looking to gain or lose weight effectively. That's weight change for any given day, helping them stay informed and on track with their fitness goals. Here's how it works:
                </p>
                <p className="text-zinc-300">
                  We are a student-run development team based out of the University of Miami with a shared passion for fitness and innovation. Through our collective fitness journeys, we realized something: while there are countless wearables and calorie tracker apps available, there's a critical gap in tools designed specifically for gym enthusiasts looking to gain or lose weight effectively. That's weight change for any given day, helping them stay informed and on track with their fitness goals. Here's how it works:
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-zinc-800">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-zinc-800"></div>
                  <div>
                    <h3 className="font-semibold">AI DEVELOPERS COO</h3>
                    <p className="text-sm text-zinc-400">
                      We are a startup coming from San Francisco.
                      Established 4 months ago, ready to change the world
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}