import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Project } from "../../lib/supabase/types";

interface ProjectDetailsProps {
  project: Project & {
    balance?: number;
    fundingPercentage?: number;
  };
  daysLeft?: number;
  backers?: number;
}

export function ProjectDetails({
  project,
  daysLeft = 34,
  backers = 28,
}: ProjectDetailsProps) {
  const [activeSection, setActiveSection] = useState("campaign");
  const [isNavSticky, setIsNavSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Adjust this value based on when you want the nav to become sticky
      const scrollThreshold = 500;
      setIsNavSticky(window.scrollY > scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative">
      {/* Project Header */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-cyan-400 mb-2">
            {project.title}
          </h1>
          <p className="text-gray-400">{project.description}</p>
        </div>

        {/* Project Image and Stats */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="rounded-lg overflow-hidden bg-gray-800">
              <img
                src={project.image_url}
                alt={project.title}
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-gray-900/80 border border-gray-800 rounded-lg p-6">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
                <div
                  className="bg-cyan-600 h-2.5 rounded-full"
                  style={{ width: `${project.fundingPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-2xl font-bold">
                <span>{project.balance?.toFixed(2)} SOL</span>
                <span className="text-gray-400">
                  pledged of {project.funding_goal} SOL goal
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-4 mb-6">
              <div>
                <div className="text-2xl font-bold">{backers}</div>
                <div className="text-gray-400">backers</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{daysLeft}</div>
                <div className="text-gray-400">days to go</div>
              </div>
            </div>

            {/* Back Project Button */}
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
              Back this project
            </button>

            <p className="text-sm text-gray-400 text-center mt-4">
              All or nothing. This project will only be funded if it reaches its
              goal by the deadline.
            </p>
          </div>
        </div>

        {/* Project Info Cards */}
        <div className="grid grid-cols-3 gap-8 mt-12">
          <div className="text-center p-6 bg-gray-900/50 rounded-lg">
            <p className="text-gray-400">
              PHY/ACC connects visionaries with backers to fund the projects
            </p>
          </div>
          <div className="text-center p-6 bg-gray-900/50 rounded-lg">
            <p className="text-gray-400">
              Rewards aren't guaranteed, but creators must regularly update
              backers.
            </p>
          </div>
          <div className="text-center p-6 bg-gray-900/50 rounded-lg">
            <p className="text-gray-400">
              Creators must deliver on their promises, and backers can vote for
              refunds through a voting system.
            </p>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="flex justify-center mb-8">
        <ChevronDown
          className="w-8 h-8 text-gray-400 animate-bounce cursor-pointer"
          onClick={() => window.scrollTo({ top: 500, behavior: "smooth" })}
        />
      </div>

      {/* Sticky Navigation */}
      <nav
        className={`${
          isNavSticky
            ? "sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800"
            : ""
        } transition-all duration-300`}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveSection("campaign")}
              className={`py-4 px-2 relative ${
                activeSection === "campaign"
                  ? "text-cyan-400"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Campaign
              {activeSection === "campaign" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400"></div>
              )}
            </button>
            <button
              onClick={() => setActiveSection("roadmap")}
              className={`py-4 px-2 relative ${
                activeSection === "roadmap"
                  ? "text-cyan-400"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Roadmap
              {activeSection === "roadmap" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400"></div>
              )}
            </button>
            <button
              className="py-4 px-2 text-gray-600 cursor-not-allowed"
              disabled
            >
              Voting
            </button>
          </div>
        </div>
      </nav>

      {/* Content Sections */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {activeSection === "campaign" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">About the project</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-4 text-gray-300">
                  {project.description}
                </div>
                <div className="bg-gray-900/50 p-6 rounded-lg">
                  <div className="text-center">
                    <img
                      src={project.image_url}
                      alt="Creator"
                      className="w-24 h-24 rounded-full mx-auto mb-4"
                    />
                    <h3 className="text-xl font-bold">AI DEVELOPERS COO</h3>
                    <p className="text-gray-400 mt-2">
                      We are a young startup coming from San Francisco.
                      Established 4 months ago, we aim to change the world
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "roadmap" && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold mb-4">Project Roadmap</h2>
            {/* Add roadmap content here */}
            <div className="space-y-6">
              {project.milestones?.map((milestone, index) => (
                <div
                  key={milestone.id}
                  className="bg-gray-900/50 p-6 rounded-lg border border-gray-800"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-400 mt-2">
                        {milestone.description}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Target:{" "}
                        {new Date(milestone.target_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
