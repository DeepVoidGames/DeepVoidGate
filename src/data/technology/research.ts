import { Technology } from "@/types/technology";

export const technology_research: Technology[] = [
  {
    id: "data_processing",
    name: "Data Processing",
    category: "Research",
    description:
      "Enables big data analysis techniques for research optimization",
    researchCost: { science: 400, metals: 300, energy: 200 },
    prerequisites: ["basic_energy"],
    unlocksBuildings: ["dataAnalysisCenter"],
    researchDuration: 300, // 5 min
    isResearched: false,
  },
  {
    id: "quantum_computing",
    name: "Quantum Computing",
    category: "Research",
    description: "Unlocks quantum-based calculation systems",
    researchCost: { science: 1200, metals: 900, energy: 400 },
    prerequisites: ["data_processing"],
    unlocksBuildings: ["quantumComputer"],
    researchDuration: 600, // 10 min
    isResearched: false,
  },
  {
    id: "ai_development",
    name: "AI Development",
    category: "Research",
    description:
      "Advanced neural network architectures for autonomous research",
    researchCost: { science: 3500, metals: 2200, energy: 1200 },
    prerequisites: ["quantum_computing"],
    unlocksBuildings: ["neuralSimulationLab"],
    researchDuration: 1200, // 20 min
    isResearched: false,
  },
  {
    id: "stellar_awareness",
    name: "Stellar Awareness",
    category: "Research",
    description:
      "Through deep communion with the cosmos, researchers unlock higher-dimensional understanding.",
    researchCost: {
      science: 8000,
      energy: 4000,
      oxygen: 2000,
    },
    prerequisites: ["ai_development"],
    unlocksBuildings: ["astral_scriptorium"],
    researchDuration: 1800, // 30 min
    isResearched: false,
    locked: true,
  },
  {
    id: "quantum_cognition",
    name: "Quantum Cognition",
    category: "Research",
    description:
      "Merging human intuition with quantum computation allows scholars to perceive knowledge as probabilistic wavefunctions.",
    researchCost: {
      science: 14000,
      energy: 7000,
      metals: 3500,
    },
    prerequisites: ["ai_development"],
    unlocksBuildings: ["celestial_archive"],
    researchDuration: 2400, // 40 min
    isResearched: false,
  },
  {
    id: "psionic_synthesis",
    name: "Psionic Synthesis",
    category: "Research",
    description:
      "Genetically engineered brain tissue fused with quantum crystals creates a hive-mind capable of solving problems across timelines.",
    researchCost: {
      science: 20000,
      energy: 10000,
      food: 6000,
    },
    prerequisites: ["quantum_cognition"],
    unlocksBuildings: ["neural_oracle"],
    researchDuration: 3000, // 50 min
    isResearched: false,
  },
  {
    id: "singularity_harvesting",
    name: "Singularity Harvesting",
    category: "Research",
    description:
      "Stable quantum singularities act as infinite computation matrices.",
    researchCost: {
      science: 26000,
      energy: 14000,
      food: 6000,
    },
    prerequisites: ["psionic_synthesis", "temporal_engineering"],
    unlocksBuildings: ["singularity_thinktank"],
    researchDuration: 3300, // 55 min
    isResearched: false,
  },
  {
    id: "multiversal_physics",
    name: "Multiversal Physics",
    category: "Research",
    description:
      "Harnessing the unpredictable laws of alternate realities allows for discovery of unreachable knowledge.",
    researchCost: {
      science: 29000,
      energy: 16000,
      food: 8000,
    },
    prerequisites: ["singularity_harvesting"],
    unlocksBuildings: ["multiversal_collider"],
    researchDuration: 3500, // 58 min
    isResearched: false,
  },
  {
    id: "fractal_neurodynamics",
    name: "Fractal Neurodynamics",
    category: "Research",
    description:
      "Fractal thought architectures echo ideas infinitely, revealing truths beyond time.",
    researchCost: {
      science: 32000,
      energy: 18000,
      food: 10000,
    },
    prerequisites: ["multiversal_physics"],
    unlocksBuildings: ["fractal_thought_engine"],
    researchDuration: 3600, // 1h
    isResearched: false,
  },
];
