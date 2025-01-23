"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Rocket } from "lucide-react"

interface SubmitProjectButtonProps {
  walletAddress: string | null
  isEligible: boolean
  checkingEligibility: boolean
}

export function SubmitProjectButton({
  walletAddress,
  isEligible,
  checkingEligibility,
}: SubmitProjectButtonProps) {
  const router = useRouter()

  if (!walletAddress) return null

  return (
    <Button
      onClick={() => router.push('/launchpad/project/new')}
      disabled={!isEligible || checkingEligibility}
      className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
    >
      <Rocket className="w-4 h-4" />
      {checkingEligibility ? "Checking..." : "Submit project"}
    </Button>
  )
}