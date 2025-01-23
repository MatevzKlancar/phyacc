"use client";

import { useWallet } from "@/app/lib/hooks/useWallet";
import { useWalletEligibility } from "@/app/lib/hooks/useWalletEligibility";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ProjectSubmissionForm from "@/components/launchpad/project-submission-form"; 

export default function NewProjectPage() {
  const router = useRouter();
  const { walletAddress } = useWallet();
  const { isEligible } = useWalletEligibility(walletAddress);

  const handleSubmitSuccess = () => {
    router.push('/launchpadv2');
  };

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
          {isEligible ? (
            <ProjectSubmissionForm
              walletAddress={walletAddress}
              isEligible={isEligible}
              onSubmitSuccess={handleSubmitSuccess}
            />
          ) : (
            <p className="text-red-500">You need to connect a wallet and have sufficient coins to submit a project.</p>
          )}
        </div>
      </div>
    </main>
  );
}
