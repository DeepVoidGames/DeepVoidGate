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
  | "housing"
  | "subterranean_arcology"
  | "floating_habitat"
  | "bio_caverns"
  | "solarPanel"
  | "advancedSolarPanel"
  | "geothermalPlant"
  | "fissionReactor"
  | "quantum_alloy_energy_core"
  | "harmonic_core_generator"
  | "symbio_resource_loop"
  | "chrono_turbine"
  | "hydroponicFarm"
  | "aeroponicFarm"
  | "fungalFarm"
  | "myco_grow_chamber"
  | "hydroponicTower"
  | "proteinSynthesizer"
  | "xeno_carbon_agro_complex"
  | "qmet_biofarm"
  | "symbio_colony_hub"
  | "nutri_flux_hub"
  | "biosurge_chamber"
  | "bio_reconstruction_vat"
  | "genetic_ecosynth_laboratory"
  | "sentient_growth_core"
  | "metalMine"
  | "deepMetalMine"
  | "advancedMetalExtractor"
  | "highYieldMetalFracturer"
  | "plasmaCoreMetalSynthesizer"
  | "quantumFluxMetalForge"
  | "fusionEdgeMetallizer"
  | "nanoDismantlerFoundry"
  | "exoforge_foundry"
  | "resonant_fabricator"
  | "dimensional_refinery"
  | "morpho_core"
  | "chrono_forge"
  | "quantum_forge_array"
  | "oxygenGenerator"
  | "algaeOxygenFarm"
  | "electrolyticOxygenPlant"
  | "plasmaOxygenRefinery"
  | "qmet_oxyplant"
  | "researchLab"
  | "dataAnalysisCenter"
  | "quantumComputer"
  | "neuralSimulationLab"
  | "astral_scriptorium"
  | "basicStorage"
  | "advancedStorage"
  | "basicBattery"
  | "modularStorageHub"
  | "metallicCompactionVault"
  | "cryoUniversalDepot"
  | "quantumCapacitor"
  | "antimatterCell"
  | "voidCore"
  | "void_storage_core"
  | "smart_resource_matrix"
  | "nutrient_reserve_cluster"
  | "aeropulse_vault"
  | "singularity_core"
  | "fusionReactor"
  | "photo_reactor"
  | "atmo_forge"
  | "chrono_turbine_mk2"
  | "quantum_flux_generator"
  | "celestial_archive"
  | "neural_oracle"
  | "singularity_thinktank";

export interface BuildingData {
  id?: string;
  type: BuildingType;
  category: BuildingCategory;
  name: string;
  description: string;
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
  isFromExpedition?: boolean;
  isBuild: boolean;
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
