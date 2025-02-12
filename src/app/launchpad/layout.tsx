"use client"

import { Jura } from "next/font/google"
import "./styles.css"
import { motion } from "framer-motion"
import { ConnectWalletButton } from "@/components/launchpad/connect-wallet-button"
import { SubmitProjectButton } from "@/components/launchpad/submit-project-button"
import { useWallet } from "@/app/lib/hooks/useWallet"
import { useWalletEligibility } from "@/app/lib/hooks/useWalletEligibility"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

const jura = Jura({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jura",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { walletAddress, connecting, connectWallet, disconnectWallet } = useWallet()
  const { isEligible, loading: checkingEligibility } = useWalletEligibility(walletAddress)
  const [isNavVisible, setIsNavVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setIsNavVisible(false)
      } else {
        setIsNavVisible(true)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const getWalletDisplay = () => {
    if (!walletAddress) return ""
    return `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
  }

  return (
    <div className={`${jura.className} bg-black text-white min-h-screen flex flex-col relative`}>
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
      <nav className={`sticky top-0 z-50 backdrop-blur-sm bg-black/50 border-b border-white/10 ${isNavVisible ? 'block' : 'hidden'}`}>
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <a
              href="/launchpad"
              className="text-xl md:text-2xl font-black tracking-wider text-white [text-shadow:_0_0_22px_rgb(255_255_255_/_80%),_0_0_60px_rgb(255_255_255/_100%)]"
            >
              PHY/ACC LAUNCHPAD
            </a>
            <div className="flex items-center gap-2 md:gap-4">
              <div className="hidden md:flex items-center space-x-8">
                <div>
                  <span className="text-lg font-medium">150 SOL</span>
                  <span className="text-xs text-zinc-400 block">Total raised</span>
                </div>
                <div>
                  <span className="text-lg font-medium">0</span>
                  <span className="text-xs text-zinc-400 block">Projects submitted</span>
                </div>
              </div>
              {walletAddress ? (
                <div className="flex items-center gap-2 md:gap-4">
                  <Button
                    onClick={disconnectWallet}
                    variant="ghost"
                    className="text-white hover:text-white/80 text-xs md:text-sm"
                  >
                    {getWalletDisplay()}
                  </Button>
                  <SubmitProjectButton
                    walletAddress={walletAddress}
                    isEligible={isEligible}
                    checkingEligibility={checkingEligibility}
                  />
                </div>
              ) : (
                <ConnectWalletButton
                  walletAddress={walletAddress}
                  connecting={connecting}
                  onConnect={connectWallet}
                  onDisconnect={disconnectWallet}
                />
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-grow relative z-10">{children}</main>
    </div>
  )
}

