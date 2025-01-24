import { useState, useEffect } from "react";
import { useWallet } from "./useWallet";
import { supabase } from "../supabase/client";
import * as bs58 from "bs58";

// Define the possible signature response types
type SignatureResponse =
  | {
      signature: Uint8Array;
      publicKey: any;
    }
  | Uint8Array;

export const useWalletAuth = () => {
  const { walletAddress, provider } = useWallet();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  const generateAuthMessage = (walletAddress: string) => {
    // Use a consistent message format that doesn't rely on nonces
    return `Sign in to the app with wallet: ${walletAddress}`;
  };

  const signIn = async () => {
    if (!walletAddress || !provider) return false;

    setAuthLoading(true);
    try {
      // Create a consistent message based on wallet address
      const message = generateAuthMessage(walletAddress);
      const messageBytes = new TextEncoder().encode(message);

      // Sign the message
      const signedMessage = (await provider.signMessage(
        messageBytes
      )) as SignatureResponse;

      // Convert signature to the correct format
      let signatureBytes: Uint8Array;
      if (signedMessage instanceof Uint8Array) {
        signatureBytes = signedMessage;
      } else if ("signature" in signedMessage) {
        signatureBytes = signedMessage.signature;
      } else {
        throw new Error("Unexpected signature format");
      }

      // Create deterministic password from signature
      const fullSignature = bs58.encode(signatureBytes);
      const password = fullSignature.slice(0, 72); // Take first 72 characters
      const email = `${walletAddress}@phantom.wallet`;

      // Try to sign in first (most common case)
      const signInResult = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // If sign in fails, try to sign up
      if (
        signInResult.error &&
        signInResult.error.message === "Invalid login credentials"
      ) {
        const signUpResult = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              wallet_address: walletAddress,
              full_signature: fullSignature,
            },
          },
        });

        if (signUpResult.error) {
          throw signUpResult.error;
        }

        // Try signing in again after successful signup
        const finalSignInResult = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (finalSignInResult.error) {
          throw finalSignInResult.error;
        }
      } else if (signInResult.error) {
        // If it's any other error, throw it
        throw signInResult.error;
      }

      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Authentication error:", error);
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
  };

  // Handle session refresh
  useEffect(() => {
    const refreshSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (!session || error) {
        setIsAuthenticated(false);
        return;
      }

      if (session.refresh_token) {
        const { data, error: refreshError } =
          await supabase.auth.refreshSession();

        if (refreshError) {
          setIsAuthenticated(false);
          return;
        }

        setIsAuthenticated(true);
      }
    };

    refreshSession();
    const interval = setInterval(refreshSession, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    isAuthenticated,
    authLoading,
    signIn,
    signOut,
  };
};
