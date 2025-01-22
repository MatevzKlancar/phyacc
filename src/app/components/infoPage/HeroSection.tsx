"use client";

import { useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { particlesConfig } from "@/app/lib/particlesConfig";

export const HeroSection = () => {
  const particlesInit = useCallback(async (engine: any) => {
    await loadFull(engine);
  }, []);

  return (
    <section className="pt-20 pb-16 md:pt-32 md:pb-24 relative bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <Particles
        id="tsparticles-hero"
        init={particlesInit}
        options={particlesConfig}
        className="absolute inset-0"
      />
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            Physical Accelerationism
          </h1>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Physical AI, or Generative Physical AI, refers to the use of
            artificial intelligence to simulate and understand physical systems
            and processes. It combines the principles of physics with advanced
            computational techniques to create models that can predict how
            physical objects behave in the real world.
          </p>
          <div className="flex justify-center mb-8">
            <img
              src="/robotai2.png"
              alt="Robot AI"
              className="w-full h-auto max-w-md"
            />
          </div>
          <div className="flex justify-center space-x-4">
            <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
              Get Started
            </button>
            <button className="border border-white text-white px-6 py-2 rounded-lg font-medium hover:bg-white/10 transition-colors">
              Learn More
            </button>
          </div>
        </motion.div>
      </div>
      <div className="text-center mt-12">
        <ChevronDown className="w-8 h-8 text-white/80 mx-auto animate-bounce" />
      </div>
    </section>
  );
};
