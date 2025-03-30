// Resource types
export type ResourceType =
  | "oxygen"
  | "water"
  | "food"
  | "energy"
  | "metals"
  | "science";

// Building category types
export type BuildingCategory =
  | "production"
  | "housing"
  | "research"
  | "storage"
  | "utility";

// Building types
export type BuildingType =
  | "oxygenGenerator"
  | "hydroponicFarm"
  | "solarPanel"
  | "metalMine"
  | "researchLab"
  | "housing"
  | "basicStorage"
  | "advancedStorage"
  | "basicBattery"
  | "advancedMetalExtractor"
  | "highYieldMetalFracturer"
  | "plasmaCoreMetalSynthesizer"
  | "geothermalPlant"
  | "fissionReactor"
  | "fusionReactor"
  | "algaeOxygenFarm"
  | "electrolyticOxygenPlant"
  | "plasmaOxygenRefinery"
  | "fungalFarm"
  | "hydroponicTower"
  | "proteinSynthesizer"
  | "dataAnalysisCenter"
  | "quantumComputer"
  | "neuralSimulationLab";

export type TechnologyCategory =
  | "Infrastructure"
  | "Energy"
  | "Production"
  | "Research"
  | "Advanced";

export type BuildingTags = "oxygen" | "food" | "energy" | "metals" | "science";

export interface Technology {
  id: string;
  name: string;
  category: TechnologyCategory;
  description: string;
  researchCost: { [key in ResourceType]?: number };
  prerequisites: string[]; // IDs technologii wymaganych do odblokowania
  unlocksBuildings: BuildingType[];
  isResearched: boolean;
  researchDuration: number; // w sekundach
  researchStartTime?: number;
}

// Resource data structure
export interface ResourceData {
  amount: number;
  production: number;
  consumption: number;
  capacity: number;
  icon: string;
  color: string;
  baseCapacity: number;
}

export interface Resource {
  amount: number;
  production: number;
  consumption: number;
  capacity: number;
  icon: string;
  color: string;
  baseCapacity: number;
}

// Building data structure
export interface BuildingData {
  id?: string;
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
  storageBonus?: {
    [key in ResourceType]?: number;
  };
  requirements?: {
    [key in ResourceType]?: number;
  };
  costMultiplier: number;
  productionMultiplier: number;
  functioning?: boolean;
  technologies: Technology[];
  requiredTechnology?: string;
  image?: string;
  icon?: string;
  tier: number;
  maxTier?: number;
  upgrades: number;
  uniqueBonus?: {
    production?: Partial<Record<ResourceType, number>>;
    storage?: Partial<Record<ResourceType, number>>;
  };
  tag?: BuildingTags;
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

export interface OfflineReport {
  elapsedTime: number;
  resourceChanges: Record<ResourceType, number>;
}

// Game state interface
export interface GameState {
  version: string;
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
  technologies: Technology[];
  paused: boolean;
  lastUpdate: number;
  showOfflineProgress;
  offlineReport;
  colonistProgress: number;
  userID: string;
}

export interface UpgradeData {
  costs: Record<ResourceType, number>;
  canUpgrade: boolean;
}
