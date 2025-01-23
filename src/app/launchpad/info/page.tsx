"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Rocket, Shield, Users, Coins } from "lucide-react";
import Link from "next/link";

export default function InfoPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to Phy/Acc Launchpad
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Whether you're an investor looking to back revolutionary projects or a
            visionary ready to bring your ideas to life, you're in the right place.
          </p>
        </motion.div>

        {/* For Investors Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="border-zinc-800 bg-black/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Users className="h-6 w-6 text-cyan-400" />
                For Investors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-cyan-400">
                  Why Invest with Us?
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Curated selection of innovative Physical AI projects</li>
                  <li>• Transparent milestone-based funding system</li>
                  <li>• Direct communication with project teams</li>
                  <li>• Community-driven development and governance</li>
                </ul>

                <h3 className="text-lg font-semibold text-cyan-400 pt-4">
                  Investment Process
                </h3>
                <ol className="space-y-2 text-gray-300">
                  <li>1. Connect your Solana wallet</li>
                  <li>2. Browse available projects</li>
                  <li>3. Review project milestones and roadmap</li>
                  <li>4. Contribute SOL to back your chosen projects</li>
                </ol>

                <Link href="/launchpad">
                  <Button className="w-full mt-4 bg-cyan-600 hover:bg-cyan-700">
                    Browse Projects
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* For Project Leaders Section */}
          <Card className="border-zinc-800 bg-black/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Rocket className="h-6 w-6 text-emerald-400" />
                For Project Leaders
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-emerald-400">
                  Why Launch with Us?
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Access to a community of Physical AI enthusiasts</li>
                  <li>• Structured funding through milestone achievements</li>
                  <li>• Technical and marketing support</li>
                  <li>• Integration with Solana ecosystem</li>
                </ul>

                <h3 className="text-lg font-semibold text-emerald-400 pt-4">
                  Submission Requirements
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Detailed project description and roadmap</li>
                  <li>• Clear milestone definitions</li>
                  <li>• Minimum 5M token holding</li>
                  <li>• Technical implementation plan</li>
                </ul>

                <Link href="/launchpad/project/new">
                  <Button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700">
                    Submit Your Project
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-zinc-800 bg-black/50 backdrop-blur">
            <CardContent className="pt-6">
              <Shield className="h-12 w-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
              <p className="text-gray-400">
                Built on Solana with transparent smart contracts and milestone-based
                releases.
              </p>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-black/50 backdrop-blur">
            <CardContent className="pt-6">
              <Users className="h-12 w-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Active Community</h3>
              <p className="text-gray-400">
                Join our vibrant community of innovators, developers, and
                investors.
              </p>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-black/50 backdrop-blur">
            <CardContent className="pt-6">
              <Coins className="h-12 w-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Token Utilities</h3>
              <p className="text-gray-400">
                Stake tokens for voting rights and exclusive access to premium
                features.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
