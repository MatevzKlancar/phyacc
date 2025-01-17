"use client";

import { HeroSection } from "./components/HeroSection";
import { Navigation } from "./components/Navigation";
import { FeaturedProjectsSection } from "./components/FeaturedProjectsSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { RoadmapSection } from "./components/RoadmapSection";
import { Footer } from "./components/Footer";

const ProjectWebsite = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <div className="relative bg-white z-10">
        <FeaturedProjectsSection />
        <FeaturesSection />
        <RoadmapSection />
      </div>
      <Footer />
    </div>
  );
};

export default ProjectWebsite;
