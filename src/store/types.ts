
// Resource types
export type ResourceType = "oxygen" | "food" | "energy" | "metals" | "science";

// Building category types
export type BuildingCategory = "production" | "housing" | "research" | "utility";

// Building types
export type BuildingType =
  | "oxygenGenerator"
  | "hydroponicFarm"
  | "solarPanel"
  | "metalMine"
  | "researchLab"
  | "housing";

// Resource data structure
export interface ResourceData {
  amount: number;
  production: number;
  consumption: number;
  capacity: number;
  icon: string;
  color: string;
}

// Building data structure
export interface BuildingData {
  id: string;
  type: BuildingType;
  category: BuildingCategory;
  name: string;
  description: string;
  level: number;
  workerCapacity: number;
  maxInstances: number;
  assignedWorkers: number;
  efficiency: number;
  baseCost: {
    [key in ResourceType]?: number;
  };
  baseProduction: {
    [key in ResourceType]?: number;
  };
  baseConsumption: {
    [key in ResourceType]?: number;
  };
  requirements?: {
    [key in ResourceType]?: number;
  };
  costMultiplier: number;
  productionMultiplier: number;
  functioning?: boolean;
}

// Alert thresholds
export interface ResourceAlertThresholds {
  oxygen?: {
    low: number;
    critical: number;
  };
  food?: {
    low: number;
    critical: number;
  };
  energy?: {
    low: number;
    critical: number;
  };
}

// Game state interface
export interface GameState {
  name: ReactNode;
  resources: {
    [key in ResourceType]: ResourceData;
  };
  buildings: BuildingData[];
  population: {
    total: number;
    available: number;
    maxCapacity: number;
    deathTimer?: number;
  };
  lastUpdate: number;
  paused: boolean;
}
