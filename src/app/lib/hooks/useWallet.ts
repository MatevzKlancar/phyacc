"use client";

import { useEffect, useState } from "react";

type PhantomEvent = "connect" | "disconnect" | "accountChanged";

interface PhantomProvider {
  connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<void>;
  disconnect: () => Promise<void>;
  on: (event: PhantomEvent, callback: (args: any) => void) => void;
  off: (event: PhantomEvent, callback: (args: any) => void) => void;
  isPhantom: boolean;
  publicKey: { toString: () => string };
  signMessage: (message: Uint8Array, encoding?: string) => Promise<Uint8Array>;
}

const getProvider = (): PhantomProvider | undefined => {
  if (typeof window !== "undefined") {
    if ("phantom" in window) {
      const provider = (window as any).phantom?.solana;
      if (provider?.isPhantom) {
        return provider;
      }
    }
  }
  return undefined;
};

// Helper to detect if we're on mobile
const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

export const useWallet = () => {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [provider, setProvider] = useState<PhantomProvider | undefined>(
    undefined
  );
  const [connecting, setConnecting] = useState<boolean>(false);

  useEffect(() => {
    const provider = getProvider();
    setProvider(provider);

    if (provider) {
      const handleConnect = (publicKey: any) => {
        setWalletAddress(publicKey.toString());
      };

      const handleDisconnect = () => {
        setWalletAddress("");
        localStorage.removeItem("walletConnected");
      };

      const handleAccountChanged = (publicKey: any) => {
        if (publicKey) {
          setWalletAddress(publicKey.toString());
        } else {
          setWalletAddress("");
        }
      };

      provider.on("connect", handleConnect);
      provider.on("disconnect", handleDisconnect);
      provider.on("accountChanged", handleAccountChanged);

      if (localStorage.getItem("walletConnected") === "true") {
        provider.connect({ onlyIfTrusted: true }).catch(() => {
          localStorage.removeItem("walletConnected");
        });
      }

      return () => {
        provider.off("connect", handleConnect);
        provider.off("disconnect", handleDisconnect);
        provider.off("accountChanged", handleAccountChanged);
      };
    }
  }, []);

  const connectWallet = async () => {
    try {
      setConnecting(true);

      // If on mobile and no provider, redirect to Phantom
      if (isMobile() && !provider) {
        // Using universal link
        window.location.href =
          "https://phantom.app/ul/browse/" + window.location.href;
        return;
      }

      // If on desktop and no provider, open download page
      if (!isMobile() && !provider) {
        window.open("https://phantom.app/", "_blank");
        return;
      }

      await provider?.connect();
      localStorage.setItem("walletConnected", "true");
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      localStorage.removeItem("walletConnected");
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      if (provider) {
        await provider.disconnect();
        setWalletAddress("");
        localStorage.removeItem("walletConnected");
      }
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };

  return {
    walletAddress,
    connecting,
    connectWallet,
    disconnectWallet,
    provider,
  };
};
