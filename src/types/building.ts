import { ResourceType } from "@/types/resource";
import { Technology } from "@/types/technology";
import { ReactNode } from "react";

export type BuildingTags = "oxygen" | "food" | "energy" | "metals" | "science";

export type BuildingCategory =
  | "production"
  | "housing"
  | "research"
  | "storage"
  | "utility";

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

export interface UpgradeData {
  costs: Record<ResourceType, number>;
  canUpgrade: boolean;
}

export type BuildingCategories = {
  id: BuildingCategory;
  name: string;
  icon: ReactNode;
};

export type BuildingConfig = {
  type: BuildingType;
  name: string;
  category: BuildingCategory;
  icon: ReactNode;
};
