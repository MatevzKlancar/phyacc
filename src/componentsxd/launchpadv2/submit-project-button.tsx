"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

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
      onClick={() => router.push('/launchpadv2/project/new')}
      disabled={!isEligible || checkingEligibility}
      className="px-2 md:px-4 py-1.5 md:py-2 text-xs md:text-sm bg-gray-800 hover:bg-gray-700 text-white transition-colors"
    >
      {checkingEligibility ? "Checking..." : "Submit project"}
    </Button>
  )
}