import Image from "next/image";
import phantomLogo from "../../../../public/phantom.jpeg";
import { CONSTANTS } from "@/app/lib/solana/constants";

interface TopBarButtonProps {
  walletAddress: string | null;
  connecting: boolean;
  isEligible: boolean;
  checkingEligibility: boolean;
  solBalance?: number;
  tokenBalance?: number;
  onWalletClick: () => void;
  onSubmitClick: () => void;
}

export function TopBarButton({
  walletAddress,
  connecting,
  isEligible,
  checkingEligibility,
  solBalance,
  tokenBalance,
  onWalletClick,
  onSubmitClick,
}: TopBarButtonProps) {
  if (walletAddress) {
    return (
      <div className="flex gap-4 items-center">
        <div className="flex flex-col">
          <button
            onClick={onWalletClick}
            className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
            title="Click to disconnect"
          >
            {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
          </button>
          <div className="flex flex-col text-sm">
            {CONSTANTS.TOKEN_MINT_ADDRESS && (
              <span
                className={`${
                  (tokenBalance || 0) >= CONSTANTS.MIN_TOKEN_BALANCE
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {tokenBalance?.toFixed(2) || 0} tokens
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => window.location.href = '/launchpad/project/new'}
          className={`w-48 h-12 rounded-lg transition-colors transform ${
            isEligible
              ? "bg-gradient-to-r from-[#3D6153] to-[#57A769] hover:bg-opacity-80 hover:scale-105"
              : "bg-gray-600 cursor-not-allowed"
          }`}
          disabled={!isEligible || checkingEligibility}
        >
          {checkingEligibility ? "Checking..." : "Submit your project"}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onWalletClick}
      className="bg-[#9886e6] border-2 border-transparent hover:border-[#8675d5] text-[#ffffff] w-48 h-12 rounded-lg transition-colors flex items-center justify-center gap-2"
      disabled={connecting}
    >
      <Image 
        src={phantomLogo} 
        alt="Phantom Wallet" 
        width={20} 
        height={20}
        className="align-middle"
      />
      <span className="align-middle" style={{ lineHeight: '1.5' }}>
        {connecting ? "Connecting..." : "Connect Wallet"}
      </span>
    </button>
  );
}
