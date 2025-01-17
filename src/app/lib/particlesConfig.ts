import { ISourceOptions } from "tsparticles-engine";

export const particlesConfig: ISourceOptions = {
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
