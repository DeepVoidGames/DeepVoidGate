import { Technology } from "@/types/technology";

export const technology_infrastructure: Technology[] = [
  {
    id: "industrial_automation",
    name: "Industrial Automation",
    category: "Infrastructure",
    subCategory: "Storage",
    description:
      "Automated storage management systems for bulk material handling",
    researchCost: {
      metals: 6000,
      oxygen: 3000,
      energy: 1500,
      food: 1200,
      science: 800,
    },
    prerequisites: ["basic_energy"],
    unlocksBuildings: ["modularStorageHub"],
    researchDuration: 300, // 5 min
    isResearched: false,
  },
  {
    id: "composite_alloys",
    name: "Composite Alloys",
    subCategory: "Storage",
    category: "Infrastructure",
    description: "Advanced metal compression and stacking techniques",
    researchCost: {
      metals: 12000,
      energy: 3000,
      science: 1500,
    },
    prerequisites: ["industrial_automation"],
    unlocksBuildings: ["metallicCompactionVault"],
    researchDuration: 600, // 10 min
    isResearched: false,
  },
  {
    id: "quantum_storage",
    name: "Quantum Storage",
    category: "Infrastructure",
    subCategory: "Storage",
    description: "Subatomic compression fields for mass storage solutions",
    researchCost: {
      metals: 18000,
      oxygen: 8000,
      energy: 4000,
      food: 2500,
      science: 3000,
    },
    prerequisites: ["composite_alloys"],
    unlocksBuildings: ["cryoUniversalDepot", "quantumCapacitor"],
    researchDuration: 900, // 15 min
    isResearched: false,
  },
  {
    id: "hydrostatic_architecture",
    name: "Hydrostatic Megastructure Theory",
    category: "Infrastructure",
    subCategory: "Housing",
    description:
      "Stabilizing dynamic marine environments for permanent oceanic settlements.",
    researchCost: {
      metals: 30000,
      energy: 10000,
      food: 4000,
      oxygen: 4000,
      science: 7000,
    },
    prerequisites: [],
    unlocksBuildings: ["floating_habitat"],
    researchDuration: 1500, // 25 min
    isResearched: false,
  },
  {
    id: "myco_structural_engineering",
    name: "Myco-Structural Ecosystem Synthesis",
    category: "Infrastructure",
    subCategory: "Housing",
    description:
      "Living mycelium networks integrated into organic adaptive habitats.",
    researchCost: {
      metals: 45000,
      energy: 15000,
      food: 8000,
      oxygen: 7000,
      science: 11000,
    },
    prerequisites: ["hydrostatic_architecture"],
    unlocksBuildings: ["bio_caverns"],
    researchDuration: 1800, // 30 min
    isResearched: false,
  },
  {
    id: "neural_ecosymbiosis",
    name: "Neural Eco-Symbiosis",
    category: "Infrastructure",
    subCategory: "Housing",
    description:
      "Neural-responsive materials integrated into self-regulating biodomes.",
    researchCost: {
      science: 20000,
      energy: 18000,
      food: 12000,
      oxygen: 9000,
    },
    prerequisites: ["myco_structural_engineering"],
    unlocksBuildings: ["neuro_bio_domes"],
    researchDuration: 2400, // 40 min
    isResearched: false,
  },
  {
    id: "aetheric_biosystems",
    name: "Aetheric Biosystems",
    category: "Infrastructure",
    subCategory: "Housing",
    description:
      "Aether Spires blend AI, vertical ecosystems, and organic intelligence.",
    researchCost: {
      science: 40000,
      energy: 30000,
      oxygen: 20000,
      food: 18000,
    },
    prerequisites: ["neural_ecosymbiosis"],
    unlocksBuildings: ["aether_spires"],
    researchDuration: 3000, // 50 min
    isResearched: false,
  },
  {
    id: "quantum_storage_field",
    name: "Quantum Storage Field",
    category: "Infrastructure",
    subCategory: "Storage",
    description:
      "Stasis-entangled matter allows near-infinite spatial compression.",
    researchCost: {
      science: 75000,
      energy: 55000,
      food: 25000,
    },
    prerequisites: ["quantum_storage"],
    unlocksBuildings: ["quantum_matter_repository"],
    researchDuration: 3600, // 1h (max)
    isResearched: false,
  },
];
