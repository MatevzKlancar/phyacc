"use client"

import Image from "next/image"
import phantomLogo from "../../../public/phantom.jpeg"
import { Button } from "@/components/ui/button"

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
      className="px-2 md:px-4 py-1.5 md:py-2 text-xs md:text-sm bg-gray-800 hover:bg-gray-700 text-white flex items-center gap-2"
    >
      <Image 
        src={phantomLogo} 
        alt="Phantom Wallet" 
        width={16} 
        height={16}
        className="rounded-full"
      />
      <span>
        {connecting ? "Connecting..." : "Connect Wallet"}
      </span>
    </Button>
  )
}