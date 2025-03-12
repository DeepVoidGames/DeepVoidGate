
import { BuildingData, ResourceType } from './types';

// Generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Initial building configurations
export const initialBuildings: Omit<BuildingData, 'id'>[] = [
  {
    type: 'oxygenGenerator',
    name: 'Oxygen Generator',
    description: 'Produces oxygen from the planet\'s thin atmosphere',
    level: 0,
    workerCapacity: 2,
    assignedWorkers: 0,
    efficiency: 0,
    baseCost: {
      metals: 50,
      energy: 20,
    },
    baseProduction: {
      oxygen: 1,
    },
    baseConsumption: {
      energy: 0.5,
    },
    costMultiplier: 1.5,
    productionMultiplier: 1.2,
  },
  {
    type: 'hydroponicFarm',
    name: 'Hydroponic Farm',
    description: 'Grows nutritious food in controlled environments',
    level: 0,
    workerCapacity: 3,
    assignedWorkers: 0,
    efficiency: 0,
    baseCost: {
      metals: 40,
      energy: 15,
      oxygen: 10,
    },
    baseProduction: {
      food: 1,
    },
    baseConsumption: {
      oxygen: 0.2,
      energy: 0.3,
    },
    costMultiplier: 1.4,
    productionMultiplier: 1.2,
  },
  {
    type: 'solarPanel',
    name: 'Solar Array',
    description: 'Captures energy from the nearby star',
    level: 0,
    workerCapacity: 1,
    assignedWorkers: 0,
    efficiency: 0,
    baseCost: {
      metals: 60,
    },
    baseProduction: {
      energy: 2,
    },
    baseConsumption: {},
    costMultiplier: 1.6,
    productionMultiplier: 1.3,
  },
  {
    type: 'metalMine',
    name: 'Metal Extractor',
    description: 'Extracts metal ores from the planetary crust',
    level: 0,
    workerCapacity: 4,
    assignedWorkers: 0,
    efficiency: 0,
    baseCost: {
      energy: 30,
    },
    baseProduction: {
      metals: 0.8,
    },
    baseConsumption: {
      energy: 0.8,
      oxygen: 0.1,
    },
    costMultiplier: 1.5,
    productionMultiplier: 1.2,
  },
  {
    type: 'researchLab',
    name: 'Research Lab',
    description: 'Scientists work to advance colony technology',
    level: 0,
    workerCapacity: 2,
    assignedWorkers: 0,
    efficiency: 0,
    baseCost: {
      metals: 80,
      energy: 40,
    },
    baseProduction: {
      science: 0.5,
    },
    baseConsumption: {
      energy: 1,
      oxygen: 0.3,
    },
    costMultiplier: 1.7,
    productionMultiplier: 1.3,
  },
  {
    type: 'housing',
    name: 'Habitat Dome',
    description: 'Living quarters for the colony\'s population',
    level: 0,
    workerCapacity: 1,
    assignedWorkers: 0,
    efficiency: 0,
    baseCost: {
      metals: 100,
      energy: 20,
    },
    baseProduction: {},
    baseConsumption: {
      oxygen: 0.2,
      energy: 0.3,
    },
    costMultiplier: 1.6,
    productionMultiplier: 1,
  },
];

export const initialResourcesState = {
  oxygen: {
    amount: 50,
    production: 0,
    consumption: 0,
    capacity: 100,
    icon: 'O₂',
    color: 'cyan',
  },
  food: {
    amount: 50,
    production: 0,
    consumption: 0,
    capacity: 100,
    icon: '🌱',
    color: 'green',
  },
  energy: {
    amount: 100,
    production: 0,
    consumption: 0,
    capacity: 200,
    icon: '⚡',
    color: 'yellow',
  },
  metals: {
    amount: 100,
    production: 0,
    consumption: 0,
    capacity: 200,
    icon: '⛏️',
    color: 'zinc',
  },
  science: {
    amount: 0,
    production: 0,
    consumption: 0,
    capacity: 100,
    icon: '🔬',
    color: 'purple',
  },
};

export const initialPopulationState = {
  total: 10,
  available: 10,
  maxCapacity: 10,
};
