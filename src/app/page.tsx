"use client";

import { HeroSection } from "./components/infoPage/HeroSection";
import { FeaturedProjectsSection } from "./components/infoPage/FeaturedProjectsSection";
import { FeaturesSection } from "./components/infoPage/FeaturesSection";
import { RoadmapSection } from "./components/infoPage/RoadmapSection";
import { Footer } from "./components/infoPage/Footer";
import { Navigation } from "./components/infoPage/Navigation";

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
