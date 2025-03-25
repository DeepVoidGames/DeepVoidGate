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
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
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
    prerequisites: ["seismic_ore_mapping", "nanotech_refining"],
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
];
