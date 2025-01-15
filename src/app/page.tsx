"use client";

import React, { useState, useCallback } from "react";
import { MenuIcon, X, Github, ExternalLink, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import type { Container, Engine } from "tsparticles-engine";
import { ISourceOptions } from "tsparticles-engine";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const ProjectWebsite = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  const particlesInit = useCallback(async (engine: any): Promise<void> => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: any): Promise<void> => {
    console.log("Particles loaded:", container);
  }, []);

  const particlesConfig: ISourceOptions = {
    particles: {
      number: {
        value: 80,
        density: { enable: true, area: 800 },
      },
      color: {
        value: "#ffffff",
      },
      opacity: {
        value: 0.5,
      },
      size: {
        value: 3,
      },
      links: {
        enable: true,
        distance: 150,
        color: "#ffffff",
        opacity: 0.4,
        width: 1,
      },
      move: {
        enable: true,
        speed: 2,
        direction: "none" as const,
        random: false,
        straight: false,
        outModes: {
          default: "out",
        },
      },
    },
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "repulse",
        },
      },
    },
    background: {
      color: "transparent",
    },
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-gray-800">Phy/Acc</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection("projects")}
                className="text-gray-600 hover:text-gray-900"
              >
                Projects
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="text-gray-600 hover:text-gray-900"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("roadmap")}
                className="text-gray-600 hover:text-gray-900"
              >
                Roadmap
              </button>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <MenuIcon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
              <button
                onClick={() => scrollToSection("projects")}
                className="block px-3 py-2 text-gray-600 hover:text-gray-900 w-full text-left"
              >
                Projects
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="block px-3 py-2 text-gray-600 hover:text-gray-900 w-full text-left"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("roadmap")}
                className="block px-3 py-2 text-gray-600 hover:text-gray-900 w-full text-left"
              >
                Roadmap
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section with Particles */}
      <section className="pt-20 pb-16 md:pt-32 md:pb-24 relative bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <Particles
          id="tsparticles-hero"
          init={particlesInit}
          loaded={particlesLoaded}
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
            <h1
              className="text-4xl md:text-6xl font-bold text-white mb-6 
                         bg-clip-text text-transparent bg-gradient-to-r 
                         from-cyan-400 to-blue-500"
            >
              Physical Accelerationism
            </h1>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Physical AI, or Generative Physical AI, refers to the use of
              artificial intelligence to simulate and understand physical
              systems and processes. It combines the principles of physics with
              advanced computational techniques to create models that can
              predict how physical objects behave in the real world. This
              technology can be applied in various fields, including robotics,
              engineering, and environmental science, enabling more efficient
              designs and solutions by accurately modeling complex physical
              interactions.
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

      {/* Add a wrapper div with solid background for all middle sections */}
      <div className="relative bg-white z-10">
        {/* Featured Projects Section */}
        <section id="projects" className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-12 text-center">
              Featured Projects
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Phy/Acc Project Card */}
              <div
                className="bg-white rounded-lg shadow-md overflow-hidden 
                            hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] 
                            transition-all duration-300 
                            border border-cyan-500/30"
              >
                <div
                  className="h-48 bg-gray-200"
                  style={{
                    backgroundImage: "url('/phyacc.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-black">
                    Phy/Acc
                  </h3>
                  <p className="text-gray-600 mb-4">
                    We are a community-run project that helps with the
                    development and funding of the new era of AI, which is
                    Physical AI. Our mission is to advance the understanding and
                    application of AI in physical systems, enabling innovative
                    solutions across various fields.
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
              <div
                className="bg-white rounded-lg shadow-md overflow-hidden 
                            hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] 
                            transition-all duration-300 
                            border border-cyan-500/30"
              >
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
              <div
                className="bg-white rounded-lg shadow-md overflow-hidden 
                            hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] 
                            transition-all duration-300 
                            border border-cyan-500/30"
              >
                <div
                  className="h-48 bg-gray-200"
                  style={{
                    backgroundImage: "url('/pythia.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-black">
                    Pythia
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Bridging neurobiology, AI & future. Licensed under the
                    Animal Ethics Committee Approval Certificate. Creator of
                    Pythia.
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

              {/* Add more project cards here in the future */}
            </div>
          </div>
        </section>

        {/* Features Section */}
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
              <div
                className="bg-gray-900/80 p-6 rounded-lg 
                            border border-cyan-500/30 
                            hover:border-cyan-400 
                            transition-all duration-300
                            backdrop-blur-sm"
              >
                <h3 className="text-xl font-semibold mb-2 text-white">
                  Join Our Community
                </h3>
                <p className="text-gray-300 mb-4">
                  Join our discussions on Telegram to connect with other
                  community members and stay updated on the latest developments.
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
              <div
                className="bg-gray-900/80 p-6 rounded-lg 
                            border border-cyan-500/30 
                            hover:border-cyan-400 
                            transition-all duration-300
                            backdrop-blur-sm"
              >
                <h3 className="text-xl font-semibold mb-2 text-white">
                  Premium Channel for Token Holders
                </h3>
                <p className="text-gray-300 mb-4">
                  If you're a holder of at least 5 million tokens, you are
                  invited to our premium channel where you can get exclusive
                  information and discuss with like-minded individuals.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Roadmap Section */}
        <section id="roadmap" className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Roadmap
            </h2>
            <div className="space-y-8">
              <div className="relative pl-8 border-l-2 border-cyan-500">
                <div
                  className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-cyan-500
                              shadow-[0_0_10px_rgba(0,255,255,0.5)]
                              animate-pulse"
                ></div>
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    Launch
                  </h3>
                  <p className="text-gray-600">
                    Officially launch the Phy/Acc project, introducing our
                    vision and goals to the community and stakeholders.
                  </p>
                </div>
              </div>
              <div className="relative pl-8 border-l-2 border-cyan-500">
                <div
                  className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-cyan-500
                              shadow-[0_0_10px_rgba(0,255,255,0.5)]
                              animate-pulse"
                ></div>
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    Network Development (Ongoing)
                  </h3>
                  <p className="text-gray-600">
                    Continuously develop and enhance our network, focusing on
                    building partnerships and collaborations within the
                    industry.
                  </p>
                </div>
              </div>
              <div className="relative pl-8 border-l-2 border-cyan-500">
                <div
                  className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-cyan-500
                              shadow-[0_0_10px_rgba(0,255,255,0.5)]
                              animate-pulse"
                ></div>
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    Transition into DAO
                  </h3>
                  <p className="text-gray-600">
                    Begin the transition to a decentralized autonomous
                    organization (DAO), empowering the community to participate
                    in decision-making.
                  </p>
                </div>
              </div>
              <div className="relative pl-8 border-l-2 border-cyan-500">
                <div
                  className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-cyan-500
                              shadow-[0_0_10px_rgba(0,255,255,0.5)]
                              animate-pulse"
                ></div>
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    Accelerator Program
                  </h3>
                  <p className="text-gray-600">
                    Launch an accelerator program to support startups and
                    projects that align with our mission, providing resources
                    and mentorship.
                  </p>
                </div>
              </div>
              <div className="relative pl-8 border-l-2 border-cyan-500">
                <div
                  className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-cyan-500
                              shadow-[0_0_10px_rgba(0,255,255,0.5)]
                              animate-pulse"
                ></div>
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    Research Community
                  </h3>
                  <p className="text-gray-600">
                    Foster a research community focused on advancing the field
                    of Physical AI, encouraging collaboration and knowledge
                    sharing.
                  </p>
                </div>
              </div>
              <div className="relative pl-8 border-l-2 border-cyan-500">
                <div
                  className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-cyan-500
                              shadow-[0_0_10px_rgba(0,255,255,0.5)]
                              animate-pulse"
                ></div>
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    Builders Fund
                  </h3>
                  <p className="text-gray-600">
                    Establish a Builders Fund to provide financial support for
                    innovative projects and initiatives within the Phy/Acc
                    ecosystem.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-black mb-6">
            Join Our Community
          </h2>
          <p className="text-gray-600 mb-4">
            Connect with other community members and stay updated on the latest
            developments.
          </p>
          <a
            href="https://x.com/i/communities/1877722245616861227"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700"
          >
            Community
          </a>
          <div className="mt-4">
            <a
              href="https://t.me/Phyacc"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700"
            >
              Join Telegram
            </a>
          </div>
        </div>
      </section>

      {/* Footer with Particles */}
      <footer className="relative bg-gray-900 text-white py-12">
        <Particles
          id="tsparticles-footer"
          init={particlesInit}
          loaded={particlesLoaded}
          options={particlesConfig}
          className="absolute inset-0"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About</h3>
              <p className="text-gray-400">
                Our mission is to bridge the gap between Ai and real world
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
                <li>
                  <a
                    href="https://x.com/UykaZaBonje"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white"
                  >
                    Developer Contact
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
    </div>
  );
};

export default ProjectWebsite;
