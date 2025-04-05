import { ReactNode } from "react";

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
  | "neuralSimulationLab"
  | "modularStorageHub"
  | "metallicCompactionVault"
  | "cryoUniversalDepot"
  | "quantumFluxMetalForge"
  | "fusionEdgeMetallizer"
  | "nanoDismantlerFoundry";

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
  bonusCapacity?: number;
}

export interface Resource {
  amount: number;
  production: number;
  consumption: number;
  capacity: number;
  icon: string;
  color: string;
  baseCapacity: number;
  bonusCapacity?: number;
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

export type MilestoneProgressConfig = {
  type: "resource" | "count" | "technology" | "tier";
  resource?: ResourceType;
  target?: number;
  buildingType?: BuildingType;
  techId?: string;
};

export type Milestone = {
  id: string;
  name: string;
  description: string;
  condition: (state: GameState) => boolean;
  progress: (state: GameState) => number; // Nowe pole
  reward?: (state: GameState) => GameState;
  completed: boolean;
  category: string;
  rewardDescription?: string;
  tier?: number;
  prerequisiteId?: string;
};

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
  milestones: Milestone[];
  expeditions: ExpeditionState[];
}

export interface UpgradeData {
  costs: Record<ResourceType, number>;
  canUpgrade: boolean;
}

export type EventOutcomeType =
  | "success"
  | "partial_success"
  | "failure"
  | "critical_failure"
  | "critical_success";

export interface EventChoice {
  id: string;
  text: string;
  requiresSkill?: {
    skill: string;
    level: number;
  };
  requiresEquipment?: {
    itemId: string;
    consumed?: boolean;
  };
  requiresResource?: Partial<Record<ResourceType, number>>;
  requiresPersonnel?: number;
  outcomeChances: {
    [key in EventOutcomeType]?: number; // Probability of this outcome (0-100)
  };
}

export interface EventOutcome {
  type: EventOutcomeType;
  description: string;
  effects: {
    resources?: Partial<Record<ResourceType, number>>;
    personnel?: number; // Negative for losses
    equipment?: {
      gain?: { [key: string]: number };
      loss?: { [key: string]: number };
    };
    expedition?: {
      timeModifier?: number; // Percentage (e.g., -20 means expedition is 20% shorter)
      successChanceModifier?: number; // Percentage points (e.g., -10 means success chance is 10pp lower)
    };
    unlockEvent?: string; // ID of an event that becomes available after this outcome
  };
}

export interface ExpeditionEvent {
  id: string;
  title: string;
  description: string;
  image?: string;
  applicationConditions?: {
    expeditionTypes?: string[];
    missionTypes?: string[];
    requiredTechnology?: string[];
    minDuration?: number;
    personnelCount?: { min?: number; max?: number };
    resourcesRequired?: Partial<Record<ResourceType, number>>;
    chance?: number; // Percentage chance this event occurs when eligible
  };
  choices: EventChoice[];
  outcomes: Record<string, EventOutcome>; // Map of choiceId_outcomeType to outcome
}

export interface ExpeditionConfig {
  type: ExpeditionType;
  name: string;
  icon: string;
  description: string;
  unlockRequirement?: {
    technology?: string;
    milestoneId?: string;
    resourceAmount?: Record<ResourceType, number>;
  };
  baseStats: {
    duration: number; // in seconds
    successChance: number;
    baseRewardMultiplier: number;
  };
  missions: MissionConfig[];
}

export interface MissionConfig {
  type: MissionType;
  name: string;
  icon: string;
  description: string;
  imageUrl?: string;
  requirements: {
    resources: Partial<Record<ResourceType, number>>;
    personnel: number;
    equipment?: Record<string, number>;
    technology?: string[];
  };
  rewards: {
    guaranteed: Partial<Record<ResourceType, number>>;
    random: Array<{
      resource: ResourceType;
      min: number;
      max: number;
      chance: number; // 0-100%
    }>;
    rareTechnology?: Array<{
      id: string;
      chance: number; // 0-100%
    }>;
    equipment?: Array<{
      id: string;
      chance: number; // 0-100%
    }>;
  };
  eventChance: number; // Chance of an event occurring during the expedition (0-100%)
  eventPool: string[]; // IDs of potential events that can occur during this mission
}

export type ExpeditionType = "planetary" | "cosmic";
export type MissionType = "resource" | "research" | "combat";

export interface ExpeditionState {
  id: string;
  type: ExpeditionType;
  mission: MissionType;
  duration: number;
  timeLeft: number;
  status:
    | "pending"
    | "active"
    | "completed"
    | "failed"
    | "returning"
    | "event_pending";
  assignedResources: Partial<Record<ResourceType, number>>;
  assignedPersonnel: number;
  events: ExpeditionEvent[];
  currentEvent?: ExpeditionEvent;
  rewards?: Partial<Record<ResourceType, number>>;
  successChance: number;
  missionName: string;
  missionIcon: string;
  eventChance?: number;
}
