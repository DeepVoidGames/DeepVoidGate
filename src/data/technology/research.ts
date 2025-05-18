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
  {
    id: "quantum_cognition",
    name: "Quantum Cognition",
    category: "Research",
    description:
      "Merging human intuition with quantum computation allows scholars to perceive knowledge as probabilistic wavefunctions, collapsing them into breakthroughs.",
    researchCost: {
      science: 324000,
      energy: 180000,
      metals: 90000,
    },
    prerequisites: ["ai_development"],
    unlocksBuildings: ["celestial_archive"],
    researchDuration: 11880, // 3h 18min (1.8x dłużej niż przykład)
    isResearched: false,
  },
  {
    id: "psionic_synthesis",
    name: "Psionic Synthesis",
    category: "Research",
    description:
      "Genetically engineered brain tissue fused with quantum crystals creates a hive-mind capable of solving problems across alternate timelines.",
    researchCost: {
      science: 583200,
      energy: 324000,
      food: 120000,
    },
    prerequisites: ["quantum_cognition"],
    unlocksBuildings: ["neural_oracle"],
    researchDuration: 21384, // 5h 56min (3.24x dłużej)
    isResearched: false,
  },
  {
    id: "singularity_harvesting",
    name: "Singularity Harvesting",
    category: "Research",
    description:
      "Stable quantum singularities act as infinite computation matrices. Each collapsed universe within yields fragments of ultimate truth.",
    researchCost: {
      science: 1049760,
      energy: 583200,
      food: 120000,
    },
    prerequisites: ["psionic_synthesis", "temporal_engineering"],
    unlocksBuildings: ["singularity_thinktank"],
    researchDuration: 21384, // 10h 41min (5.83x dłużej)
    isResearched: false,
  },
  {
    id: "multiversal_physics",
    name: "Multiversal Physics",
    category: "Research",
    description:
      "Harnessing the unpredictable laws of alternate realities allows for the discovery of knowledge unreachable in our own universe.",
    researchCost: {
      science: 2084000,
      energy: 1126800,
      food: 248000,
    },
    prerequisites: ["singularity_harvesting"],
    unlocksBuildings: ["multiversal_collider"],
    researchDuration: 24384, // ~15h 35min
    isResearched: false,
  },
];
