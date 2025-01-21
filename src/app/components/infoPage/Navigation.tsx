"use client";

import { useState } from "react";
import Link from "next/link";
import { MenuIcon, X, Github } from "lucide-react";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-800">
              Phy/Acc
            </Link>
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
            {/* <Link
              href="/launchpad"
              className="text-gray-600 hover:text-gray-900"
            >
              Launchpad
            </Link>*/}
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
            {/* <Link
              href="/launchpad"
              className="block px-3 py-2 text-gray-600 hover:text-gray-900 w-full text-left"
            >
              Launchpad
            </Link> */}
          </div>
        </div>
      )}
    </nav>
  );
};
