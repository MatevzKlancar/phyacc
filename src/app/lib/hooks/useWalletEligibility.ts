import { useState, useEffect } from "react";
import { solanaBalance } from "../solana/balance";

interface EligibilityState {
  isEligible: boolean;
  solBalance: number | null;
  tokenBalance: number | null;
  loading: boolean;
  error: string | null;
}

export const useWalletEligibility = (walletAddress: string | null) => {
  const [state, setState] = useState<EligibilityState>({
    isEligible: false,
    solBalance: null,
    tokenBalance: null,
    loading: true,
    error: null,
  });

  const checkEligibility = async () => {
    if (!walletAddress) {
      setState((prev) => ({
        ...prev,
        isEligible: false,
        solBalance: null,
        tokenBalance: null,
        error: null,
        loading: false,
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const { isEligible, solBalance, tokenBalance } =
        await solanaBalance.checkEligibility(walletAddress);

      setState((prev) => ({
        ...prev,
        isEligible,
        solBalance,
        tokenBalance: tokenBalance ?? null,
        loading: false,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isEligible: false,
        error: "Failed to check wallet eligibility",
        loading: false,
      }));
    }
  };

  useEffect(() => {
    setState(prev => ({ ...prev, loading: true }));
    const timer = setTimeout(() => {
      checkEligibility();
    }, 100);

    return () => clearTimeout(timer);
  }, [walletAddress]);

  return {
    ...state,
    checkEligibility,
  };
};
