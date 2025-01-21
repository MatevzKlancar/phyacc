"use client";

import { useWallet } from "@/app/lib/hooks/useWallet";
import { useWalletEligibility } from "@/app/lib/hooks/useWalletEligibility";
import { ProjectSubmissionForm } from "@/app/components/launchpad/ProjectSubmissionForm";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NewProjectPage() {
  const router = useRouter();
  const { walletAddress } = useWallet();
  const { isEligible } = useWalletEligibility(walletAddress);

  const handleSubmitSuccess = () => {
    router.push('/launchpad');
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
