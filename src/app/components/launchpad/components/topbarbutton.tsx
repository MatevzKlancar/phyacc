import { CONSTANTS } from "../../../lib/solana/constants";

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
            <span
              className={`${
                (solBalance ?? 0) >= CONSTANTS.MIN_SOL_BALANCE
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {solBalance?.toFixed(2) || 0} SOL
            </span>
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
          onClick={onSubmitClick}
          className={`px-6 py-2 rounded-lg transition-colors ${
            isEligible
              ? "bg-green-600 hover:bg-green-700"
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
      className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg transition-colors"
      disabled={connecting}
    >
      {connecting ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}
