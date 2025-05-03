import { Artifact } from "@/types/artifacts";
import { Expedition } from "@/types/expedition";
import { Faction, FactionName } from "@/types/factions";
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
  | "nanoDismantlerFoundry"
  | "myco_grow_chamber"
  | "exoforge_foundry"
  | "quantum_alloy_energy_core"
  | "xeno_carbon_agro_complex"
  | "qmet_biofarm"
  | "qmet_oxyplant"
  | "harmonic_core_generator"
  | "resonant_fabricator"
  | "symbio_colony_hub"
  | "symbio_resource_loop"
  | "chrono_turbine"
  | "floating_habitat"
  | "bio_caverns"
  | "dimensional_refinery"
  | "void_storage_core"
  | "smart_resource_matrix"
  | "nutrient_reserve_cluster"
  | "aeropulse_vault"
  | "quantumCapacitor"
  | "antimatterCell"
  | "voidCore"
  | "morpho_core"
  | "nutri_flux_hub"
  | "aeroponicFarm"
  | "advancedSolarPanel"
  | "deepMetalMine"
  | "chrono_forge"
  | "biosurge_chamber"
  | "quantum_forge_array"
  | "bio_reconstruction_vat"
  | "astral_scriptorium"
  | "genetic_ecosynth_laboratory"
  | "sentient_growth_core";

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
  locked?: boolean; // czy technologia jest zablokowana
  expedtionMinTier?: number; // minimalny poziom technologii do odblokowania
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
  housingCapacityMultiplier?: number;
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
  onlyOneTime?: boolean;
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
  expeditions: Expedition[];
  playtime: number; // w sekundach
  sessionLength: number; // w sekundach
  artifacts: Artifact[];
  factions: Faction[];
  selectedFaction: FactionName | null;
}

export interface UpgradeData {
  costs: Record<ResourceType, number>;
  canUpgrade: boolean;
}
