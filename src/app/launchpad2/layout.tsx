"use client";

import { Jura } from "next/font/google";
import { useState } from "react";
import { useWallet } from "../lib/hooks/useWallet";
import { useWalletEligibility } from "../lib/hooks/useWalletEligibility";
import { CONSTANTS } from "../lib/solana/constants";
import { TopBarButton } from "@/componentsxd/launchpad/components/topbarbutton";
import { Pill } from "@/componentsxd/launchpad/components/pill";
import { usePathname } from "next/navigation";

const jura = Jura({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function LaunchpadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { walletAddress, connecting, connectWallet, disconnectWallet } = useWallet();
  const {
    isEligible,
    solBalance,
    tokenBalance,
    loading: checkingEligibility,
  } = useWalletEligibility(walletAddress);
  const pathname = usePathname();
  const isProjectCreationPage = pathname === "/launchpad/project/new";

  const handleSubmitClick = async () => {
    if (!walletAddress) {
      try {
        await connectWallet();
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    } else if (!isEligible) {
      alert(
        `Insufficient balance. You need: ${
          CONSTANTS.MIN_TOKEN_BALANCE
        } tokens (Current: ${tokenBalance?.toFixed(2) || 0})`
      );
    } else {
      setIsModalOpen(true);
    }
  };

  const handleWalletClick = async () => {
    if (walletAddress) {
      await disconnectWallet();
    } else {
      await connectWallet();
    }
  };

  return (
    <div className={`${jura.className} min-h-screen bg-gradient-to-b from-[#131B2A] to-[#2B3038] text-white`}>
      {/* Stats Bar */}
      <div className="border-b border-gray-800 p-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <div className="flex-col items-center">
              <div className="items-center gap-4 flex-col">
                <img
                  src="/logoweb.svg"
                  alt="Logo"
                  className="h-10 md:h-14 w-auto"
                />
              </div>
              <div className="gap-4">
                <p
                  className="text-gray-400 text-sm md:text-base"
                  style={{ paddingLeft: "5px" }}
                >
                  Discover or Build the Next AI Revolution.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start md:items-center">
              <div className="grid grid-cols-2 md:flex gap-4">
                <Pill
                  label="Total raised"
                  value="150 SOL"
                />
                <Pill label="Projects submitted" value="0" />
              </div>
              {!isProjectCreationPage && (
                <TopBarButton
                  walletAddress={walletAddress}
                  connecting={connecting}
                  isEligible={isEligible}
                  checkingEligibility={checkingEligibility}
                  solBalance={solBalance || 0}
                  tokenBalance={tokenBalance || 0}
                  onWalletClick={handleWalletClick}
                  onSubmitClick={handleSubmitClick}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {children}
    </div>
  );
} 