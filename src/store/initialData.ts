import oxygenBuildingData from "@/data/buildings/p_oxygen.json";
import foodBuildingData from "@/data/buildings/p_food.json";
import energyBuildingData from "@/data/buildings/p_energy.json";
import metalsBuildingData from "@/data/buildings/p_metals.json";
import scienceBuildingData from "@/data/buildings/s_science.json";
import housingBuildingData from "@/data/buildings/h_housing.json";
import storageBuildingData from "@/data/buildings/s_storage.json";
import { Expedition } from "@/types/expedition";
import { Technology } from "@/types/technology";
import { technology_infrastructure } from "@/data/technology/infrastructure";
import { technology_energy } from "@/data/technology/energy";
import { technology_production } from "@/data/technology/production";
import { technology_research } from "@/data/technology/research";
import { technology_advanced } from "@/data/technology/advanced";
import { ResourceAlertThresholds } from "@/types/resource";
import { BuildingCategory, BuildingData, BuildingType } from "@/types/building";
import { technology_expedition } from "@/data/technology/expedition_";

// Generate a unique ID
export const generateId = (lenght: number = 9): string => {
  return Math.random().toString(36).substr(2, lenght);
};

const allBuildingsData = [
  ...oxygenBuildingData,
  ...foodBuildingData,
  ...energyBuildingData,
  ...metalsBuildingData,
  ...scienceBuildingData,
  ...housingBuildingData,
  ...storageBuildingData,
];

// Initialize buildings from combined JSON data
export const initialBuildings: Omit<BuildingData, "id">[] =
  allBuildingsData.map((building) => ({
    ...building,
    type: building.type as BuildingType,
    category: building.category as BuildingCategory,
    assignedWorkers: 0,
    efficiency: 0,
    functioning: true,
  }));

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
    production: 1,
    consumption: 0,
    capacity: 100,
    icon: "O₂",
    color: "cyan",
    baseCapacity: 2000,
  },
  water: {
    amount: 50,
    production: 0,
    consumption: 0,
    capacity: 100,
    icon: "💧",
    color: "blue",
    baseCapacity: 2000,
  },
  food: {
    amount: 50,
    production: 1,
    consumption: 0,
    capacity: 100,
    icon: "🌱",
    color: "green",
    baseCapacity: 2000,
  },
  energy: {
    amount: 100,
    production: 0,
    consumption: 0,
    capacity: 200,
    icon: "⚡",
    color: "yellow",
    baseCapacity: 2000,
  },
  metals: {
    amount: 200,
    production: 0,
    consumption: 0,
    capacity: 200,
    icon: "⛏️",
    color: "zinc",
    baseCapacity: 2000,
  },
  science: {
    amount: 0,
    production: 0,
    consumption: 0,
    capacity: 100,
    icon: "🔬",
    color: "purple",
    baseCapacity: 1000,
  },
};

export const initialPopulationState = {
  total: 10,
  available: 10,
  maxCapacity: 10,
  deathTimer: null,
};

export const initialTechnologies: Technology[] = [
  ...technology_infrastructure,
  ...technology_energy,
  ...technology_production,
  ...technology_research,
  ...technology_advanced,
  ...technology_expedition,
];

console.log("Available initialTechnologies", initialTechnologies.length);

export const initialExpeditions: Expedition[] = [];
