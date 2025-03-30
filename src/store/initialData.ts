import {
  BuildingData,
  ResourceType,
  ResourceAlertThresholds,
  BuildingType,
  BuildingCategory,
  Technology,
} from "@/store/types";
import buildingData from "../data/buildings.json";

// Generate a unique ID
export const generateId = (lenght: number = 9): string => {
  return Math.random().toString(36).substr(2, lenght);
};

// Initialize buildings from JSON data
export const initialBuildings: Omit<BuildingData, "id">[] = buildingData.map(
  (building) => ({
    ...building,
    type: building.type as BuildingType,
    category: building.category as BuildingCategory,
    assignedWorkers: 0,
    efficiency: 0,
    functioning: true,
  })
);

// Resource alert thresholds
export const resourceAlertThresholds: ResourceAlertThresholds = {
  oxygen: {
    low: 20,
    critical: 5,
  },
  food: {
    low: 15,
    critical: 5,
  },
  energy: {
    low: 30,
    critical: 10,
  },
};

export const initialResourcesState = {
  oxygen: {
    amount: 50,
    production: 0,
    consumption: 0,
    capacity: 100,
    icon: "O₂",
    color: "cyan",
    baseCapacity: 100,
  },
  water: {
    amount: 50,
    production: 0,
    consumption: 0,
    capacity: 100,
    icon: "💧",
    color: "blue",
    baseCapacity: 100,
  },
  food: {
    amount: 50,
    production: 0,
    consumption: 0,
    capacity: 100,
    icon: "🌱",
    color: "green",
    baseCapacity: 100,
  },
  energy: {
    amount: 100,
    production: 0,
    consumption: 0,
    capacity: 200,
    icon: "⚡",
    color: "yellow",
    baseCapacity: 200,
  },
  metals: {
    amount: 200,
    production: 0,
    consumption: 0,
    capacity: 200,
    icon: "⛏️",
    color: "zinc",
    baseCapacity: 200,
  },
  science: {
    amount: 0,
    production: 0,
    consumption: 0,
    capacity: 100,
    icon: "🔬",
    color: "purple",
    baseCapacity: 100,
  },
};

export const initialPopulationState = {
  total: 10,
  available: 10,
  maxCapacity: 10,
  deathTimer: null,
};

export const initialTechnologies: Technology[] = [
  {
    id: "basic_energy",
    name: "Basic Energy",
    category: "Energy",
    description: "Unlocks essential energy storage",
    researchCost: { metals: 150, science: 75 },
    prerequisites: [],
    unlocksBuildings: [],
    isResearched: false,
    researchDuration: 30,
  },
  {
    id: "deep_core_mining",
    name: "Deep Core Mining",
    category: "Production",
    description: "Enables access to 深层 metal deposits with advanced drills.",
    researchCost: {
      metals: 300,
      science: 150,
    },
    prerequisites: ["basic_energy"],
    unlocksBuildings: [],
    researchDuration: 90,
    isResearched: false,
  },
  {
    id: "seismic_ore_mapping",
    name: "Seismic Ore Mapping",
    category: "Production",
    description: "Detects high-density ore clusters using resonance waves.",
    researchCost: {
      metals: 600,
      science: 300,
      energy: 100,
    },
    prerequisites: ["deep_core_mining"],
    unlocksBuildings: [],
    researchDuration: 180,
    isResearched: false,
  },
  {
    id: "plasma_refining",
    name: "Plasma Refining",
    category: "Production",
    description: "Harnesses plasma to break down ores at the atomic level.",
    researchCost: {
      metals: 1200,
      science: 800,
    },
    prerequisites: ["seismic_ore_mapping"],
    unlocksBuildings: [],
    researchDuration: 300,
    isResearched: false,
  },
  {
    id: "geothermal_energy",
    name: "Geothermal Energy",
    category: "Energy",
    description:
      "Unlocks the ability to harness geothermal energy from the planet's core.",
    researchCost: {
      metals: 600,
      science: 700,
    },
    prerequisites: ["basic_energy"],
    unlocksBuildings: ["geothermalPlant"],
    researchDuration: 160,
    isResearched: false,
  },
  {
    id: "nuclear_fission",
    name: "Nuclear Fission",
    category: "Energy",
    description:
      "Enables the use of nuclear fission reactors for high-energy output.",
    researchCost: {
      metals: 1200,
      science: 950,
      energy: 150,
    },
    prerequisites: ["geothermal_energy"],
    unlocksBuildings: ["fissionReactor"],
    researchDuration: 360,
    isResearched: false,
  },
  {
    id: "fusion_energy",
    name: "Fusion Energy",
    category: "Energy",
    description:
      "Achieves sustainable energy production through nuclear fusion technology.",
    researchCost: {
      metals: 2000,
      science: 1500,
      energy: 300,
    },
    prerequisites: ["nuclear_fission", "plasma_refining"],
    unlocksBuildings: ["fusionReactor"],
    researchDuration: 600,
    isResearched: false,
  },
  {
    id: "electrolytic_processing",
    name: "Electrolytic Processing",
    category: "Production",
    description:
      "Enables large-scale separation of compounds through electrical current.",
    researchCost: {
      metals: 400,
      science: 250,
      energy: 100,
    },
    prerequisites: ["basic_energy"],
    unlocksBuildings: ["electrolyticOxygenPlant"],
    researchDuration: 120,
    isResearched: false,
  },
  {
    id: "basic_agriculture",
    name: "Basic Agriculture",
    category: "Production",
    description:
      "Unlocks foundational food production systems for colony sustainability.",
    researchCost: { metals: 100, science: 50 },
    prerequisites: [],
    unlocksBuildings: ["fungalFarm"],
    researchDuration: 45,
    isResearched: false,
  },
  {
    id: "vertical_farming",
    name: "Vertical Farming",
    category: "Production",
    description:
      "Enables space-efficient stacked growing systems with automated nutrient delivery.",
    researchCost: { metals: 200, science: 100, energy: 30 },
    prerequisites: ["basic_agriculture"],
    unlocksBuildings: ["hydroponicTower"],
    researchDuration: 90,
    isResearched: false,
  },
  {
    id: "biotech_engineering",
    name: "Biotech Engineering",
    category: "Production",
    description:
      "Advanced microbial cultivation and synthetic nutrition technologies.",
    researchCost: { metals: 350, science: 200, food: 50 },
    prerequisites: ["vertical_farming"],
    unlocksBuildings: ["proteinSynthesizer"],
    researchDuration: 180,
    isResearched: false,
  },
  {
    id: "data_processing",
    name: "Data Processing",
    category: "Research",
    description:
      "Enables big data analysis techniques for research optimization",
    researchCost: { metals: 250, science: 100 },
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
    researchCost: { metals: 400, science: 500, energy: 80 },
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
    researchCost: { metals: 600, science: 1000, energy: 150 },
    prerequisites: ["quantum_computing"],
    unlocksBuildings: ["neuralSimulationLab"],
    researchDuration: 300,
    isResearched: false,
  },
];
