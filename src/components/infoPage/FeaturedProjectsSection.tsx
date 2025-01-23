"use client";

import { Github, ExternalLink } from "lucide-react";

export const FeaturedProjectsSection = () => {
  return (
    <section id="projects" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-12 text-center">
          Featured Projects
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Phy/Acc Project Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all duration-300 border border-cyan-500/30">
            <div
              className="h-48 bg-gray-200"
              style={{
                backgroundImage: "url('/phyacc.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-black">Phy/Acc</h3>
              <p className="text-gray-600 mb-4">
                We are a community-run project that helps with the development
                and funding of the new era of AI, which is Physical AI.
              </p>
              <div className="flex justify-between items-center">
                <a
                  href="https://x.com/i/communities/1877722245616861227"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 flex items-center"
                >
                  Learn more <ExternalLink className="w-4 h-4 ml-1" />
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* AntroOne Project Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all duration-300 border border-cyan-500/30">
            <div
              className="h-48 bg-gray-200"
              style={{
                backgroundImage: "url('/antroOne.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-black">
                AntroOne
              </h3>
              <p className="text-gray-600 mb-4">
                STAGE 2 of an experiment on human-robot interaction based on
                heavily modified InMoov.
              </p>
              <div className="flex justify-between items-center">
                <a
                  href="https://x.com/AntroOne"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 flex items-center"
                >
                  Learn more <ExternalLink className="w-4 h-4 ml-1" />
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Pythia Project Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all duration-300 border border-cyan-500/30">
            <div
              className="h-48 bg-gray-200"
              style={{
                backgroundImage: "url('/pythia.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-black">Pythia</h3>
              <p className="text-gray-600 mb-4">
                Bridging neurobiology, AI & future. Licensed under the Animal
                Ethics Committee Approval Certificate.
              </p>
              <div className="flex justify-between items-center">
                <a
                  href="https://x.com/neirylab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 flex items-center"
                >
                  Learn more <ExternalLink className="w-4 h-4 ml-1" />
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
