import { Technology } from "@/types/technology";

export const technology_research: Technology[] = [
  {
    id: "data_processing",
    name: "Data Processing",
    category: "Research",
    description:
      "Enables big data analysis techniques for research optimization",
    researchCost: { science: 800, metals: 800, energy: 500 },
    prerequisites: ["basic_energy"],
    unlocksBuildings: ["dataAnalysisCenter"],
    researchDuration: 90,
    isResearched: false,
  },
  {
    id: "quantum_computing",
    name: "Quantum Computing",
    category: "Research",
    description: "Unlocks quantum-based calculation systems",
    researchCost: { science: 2500, metals: 1800, energy: 850 },
    prerequisites: ["data_processing"],
    unlocksBuildings: ["quantumComputer"],
    researchDuration: 180,
    isResearched: false,
  },
  {
    id: "ai_development",
    name: "AI Development",
    category: "Research",
    description:
      "Advanced neural network architectures for autonomous research",
    researchCost: { science: 8860, metals: 4960, energy: 2870 },
    prerequisites: ["quantum_computing"],
    unlocksBuildings: ["neuralSimulationLab"],
    researchDuration: 300,
    isResearched: false,
  },
  {
    id: "stellar_awareness",
    name: "Stellar Awareness",
    category: "Research",
    description:
      "Through deep communion with the cosmos, researchers unlock higher-dimensional understanding, enabling the interpretation of astral knowledge into scientific applications.",
    researchCost: {
      science: 180000,
      energy: 100000,
      oxygen: 50000,
    },
    prerequisites: [],
    unlocksBuildings: ["astral_scriptorium"],
    researchDuration: 6600, // 1h 50min
    isResearched: false,
    locked: true,
  },
];
