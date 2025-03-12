import {
  BuildingData,
  ResourceType,
  ResourceAlertThresholds,
  BuildingType,
  BuildingCategory,
} from "./types";
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
    level: 0,
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
  },
  food: {
    amount: 50,
    production: 0,
    consumption: 0,
    capacity: 100,
    icon: "🌱",
    color: "green",
  },
  energy: {
    amount: 100,
    production: 0,
    consumption: 0,
    capacity: 200,
    icon: "⚡",
    color: "yellow",
  },
  metals: {
    amount: 200,
    production: 0,
    consumption: 0,
    capacity: 200,
    icon: "⛏️",
    color: "zinc",
  },
  science: {
    amount: 0,
    production: 0,
    consumption: 0,
    capacity: 100,
    icon: "🔬",
    color: "purple",
  },
};

export const initialPopulationState = {
  total: 10,
  available: 10,
  maxCapacity: 10,
  deathTimer: null,
};
