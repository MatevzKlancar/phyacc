"use client";

import { particlesConfig } from "@/app/lib/particlesConfig";
import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export const Footer = () => {
  const particlesInit = useCallback(async (engine: any) => {
    await loadFull(engine);
  }, []);

  return (
    <footer className="relative bg-gray-900 text-white py-12">
      <Particles
        id="tsparticles-footer"
        init={particlesInit}
        options={particlesConfig}
        className="absolute inset-0"
      />
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <p className="text-gray-400">
              Our mission is to bridge the gap between AI and real world
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://x.com/i/communities/1877722245616861227"
                  className="text-gray-400 hover:text-white"
                >
                  Community
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://x.com/i/communities/1877722245616861227"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white"
                >
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; Phy/Acc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
