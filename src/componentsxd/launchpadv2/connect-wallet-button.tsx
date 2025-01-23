"use client"

import Image from "next/image"
import phantomLogo from "../../../public/phantom.jpeg"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"

interface ConnectWalletButtonProps {
  walletAddress: string | null
  connecting: boolean
  onConnect: () => Promise<void>
  onDisconnect: () => Promise<void>
}

export function ConnectWalletButton({
  connecting,
  onConnect,
}: ConnectWalletButtonProps) {
  return (
    <Button
      onClick={onConnect}
      disabled={connecting}
      className="bg-cyan-600 hover:bg-cyan-700 text-white flex items-center gap-2"
    >
      <Wallet className="w-4 h-4" />
      <span>
        {connecting ? "Connecting..." : "Connect Wallet"}
      </span>
    </Button>
  )
}