"use client";

import { motion } from "framer-motion";

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-16 md:py-24 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
          Features
        </h2>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <div className="bg-gray-900/80 p-6 rounded-lg border border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-2 text-white">
              Join Our Community
            </h3>
            <p className="text-gray-300 mb-4">
              Join our discussions on Telegram to connect with other community
              members and stay updated on the latest developments.
            </p>
            <a
              href="https://t.me/Phyacc"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300"
            >
              Join Telegram
            </a>
          </div>
          <div className="bg-gray-900/80 p-6 rounded-lg border border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-2 text-white">
              Premium Channel for Token Holders
            </h3>
            <p className="text-gray-300 mb-4">
              If you're a holder of at least 5 million tokens, you are invited
              to our premium channel where you can get exclusive information and
              discuss with like-minded individuals.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
