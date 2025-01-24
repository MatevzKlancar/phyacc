"use client";

import { useWallet } from "@/app/lib/hooks/useWallet";
import { useWalletEligibility } from "@/app/lib/hooks/useWalletEligibility";
import { useWalletAuth } from "@/app/lib/hooks/useWalletAuth";
import { useRouter } from "next/navigation";
import ProjectSubmissionForm from "@/components/launchpad/project-submission-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NewProjectPage() {
  const router = useRouter();
  const { walletAddress } = useWallet();
  const { isEligible, loading: eligibilityLoading } =
    useWalletEligibility(walletAddress);
  const { isAuthenticated, authLoading, signIn } = useWalletAuth();

  const handleSubmitSuccess = () => {
    router.push("/launchpad");
  };

  if (eligibilityLoading || authLoading) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-400">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>Checking wallet status...</span>
      </div>
    );
  }

  if (!walletAddress) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 mb-4">
          Please connect your wallet to submit a project.
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center p-8">
        <p className="text-yellow-500 mb-4">
          Please authenticate your wallet to submit a project.
        </p>
        <Button onClick={signIn}>Authenticate Wallet</Button>
      </div>
    );
  }

  if (!isEligible) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">
          You need to have sufficient coins to submit a project.
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="container mx-auto px-4 py-8">
        <a
          href="/launchpad"
          className="text-gray-400 hover:text-white inline-block mb-8"
        >
          ← Back to projects
        </a>
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Submit Your Project</h1>
          <ProjectSubmissionForm
            walletAddress={walletAddress}
            isEligible={isEligible}
            onSubmitSuccess={handleSubmitSuccess}
          />
        </div>
      </div>
    </main>
  );
}
