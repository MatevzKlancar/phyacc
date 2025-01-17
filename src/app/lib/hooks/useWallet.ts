"use client";

import { useState, useEffect } from "react";

export interface PhantomWindow extends Window {
  phantom?: {
    solana?: {
      connect(): Promise<{ publicKey: { toString(): string } }>;
      disconnect(): Promise<void>;
      isConnected: boolean;
      publicKey?: { toString(): string };
      on(
        event: "connect" | "disconnect",
        callback: (publicKey: { toString(): string }) => void
      ): void;
      removeAllListeners(event: "connect" | "disconnect"): void;
    };
  };
}

export const useWallet = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  // Check initial connection state
  useEffect(() => {
    const checkWalletConnection = async () => {
      const window = globalThis.window as PhantomWindow;
      if (window.phantom?.solana) {
        try {
          if (
            window.phantom.solana.isConnected &&
            window.phantom.solana.publicKey
          ) {
            setWalletAddress(window.phantom.solana.publicKey.toString());
          } else {
            // If not connected, ensure we're properly disconnected
            await window.phantom.solana.disconnect();
            setWalletAddress(null);
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
          // On any error, ensure we're disconnected
          setWalletAddress(null);
        }
      }
    };

    checkWalletConnection();
  }, []);

  const connectWallet = async () => {
    try {
      setConnecting(true);
      const window = globalThis.window as PhantomWindow;

      if (!window.phantom?.solana) {
        throw new Error("Phantom wallet not found! Please install it.");
      }

      // Ensure we're disconnected before attempting to connect
      if (window.phantom.solana.isConnected) {
        await window.phantom.solana.disconnect();
        setWalletAddress(null);
      }

      // Now attempt to connect
      const { publicKey } = await window.phantom.solana.connect();
      setWalletAddress(publicKey.toString());
      return publicKey.toString();
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setWalletAddress(null);
      throw error;
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      const window = globalThis.window as PhantomWindow;
      if (window.phantom?.solana) {
        await window.phantom.solana.disconnect();
        setWalletAddress(null);

        // Force a clean disconnect state
        if (window.phantom.solana.isConnected) {
          await window.phantom.solana.disconnect();
        }
      }
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      // Even on error, reset the local state
      setWalletAddress(null);
    }
  };

  // Listen for wallet connection changes
  useEffect(() => {
    const window = globalThis.window as PhantomWindow;
    if (window.phantom?.solana) {
      const handleConnect = (publicKey: { toString(): string }) => {
        setWalletAddress(publicKey.toString());
      };

      const handleDisconnect = () => {
        setWalletAddress(null);
      };

      window.phantom.solana.on("connect", handleConnect);
      window.phantom.solana.on("disconnect", handleDisconnect);

      // Cleanup listeners on unmount
      return () => {
        if (window.phantom?.solana) {
          window.phantom.solana.removeAllListeners("connect");
          window.phantom.solana.removeAllListeners("disconnect");
        }
      };
    }
  }, []);

  return {
    walletAddress,
    connecting,
    connectWallet,
    disconnectWallet,
  };
};
