import {
  BuildingData,
  ResourceType,
  ResourceAlertThresholds,
  BuildingType,
  BuildingCategory,
  Technology,
  ExpeditionState as Expedition,
} from "@/store/types";

import oxygenBuildingData from "@/data/buildings/p_oxygen.json";
import foodBuildingData from "@/data/buildings/p_food.json";
import energyBuildingData from "@/data/buildings/p_energy.json";
import metalsBuildingData from "@/data/buildings/p_metals.json";
import scienceBuildingData from "@/data/buildings/s_science.json";
import housingBuildingData from "@/data/buildings/h_housing.json";
import storageBuildingData from "@/data/buildings/s_storage.json";

// Generate a unique ID
export const generateId = (lenght: number = 9): string => {
  return Math.random().toString(36).substr(2, lenght);
};

// Połącz obie tablice danych budynków
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
  {
    id: "basic_energy",
    name: "Basic Energy",
    category: "Energy",
    description: "Unlocks essential energy storage",
    researchCost: { energy: 1500, metals: 200 },
    prerequisites: [],
    unlocksBuildings: ["basicBattery"],
    isResearched: false,
    researchDuration: 30,
  },
  {
    id: "deep_core_mining",
    name: "Deep Core Mining",
    category: "Production",
    description: "Enables access to 深层 metal deposits with advanced drills.",
    researchCost: {
      energy: 510,
      metals: 1900,
      science: 500,
    },
    prerequisites: ["basic_energy"],
    unlocksBuildings: ["advancedMetalExtractor"],
    researchDuration: 90,
    isResearched: false,
  },
  {
    id: "seismic_ore_mapping",
    name: "Seismic Ore Mapping",
    category: "Production",
    description: "Detects high-density ore clusters using resonance waves.",
    researchCost: {
      energy: 870,
      metals: 3080,
      science: 870,
    },
    prerequisites: ["deep_core_mining"],
    unlocksBuildings: ["highYieldMetalFracturer"],
    researchDuration: 180,
    isResearched: false,
  },
  {
    id: "plasma_refining",
    name: "Plasma Refining",
    category: "Production",
    description: "Harnesses plasma to break down ores at the atomic level.",
    researchCost: {
      energy: 1480,
      science: 1480,
      metals: 5000,
    },
    prerequisites: ["seismic_ore_mapping"],
    unlocksBuildings: ["plasmaCoreMetalSynthesizer"],
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
      energy: 900,
      metals: 450,
      science: 450,
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
      energy: 1350,
      metals: 670,
      science: 50,
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
      energy: 2700,
      metals: 1350,
      science: 1000,
    },
    prerequisites: ["nuclear_fission", "plasma_refining"],
    unlocksBuildings: ["fusionReactor"],
    researchDuration: 600,
    isResearched: false,
  },
  {
    id: "electrolytic_processing",
    name: "Electrolytic Processing",
    category: "Production",
    description:
      "Enables large-scale separation of compounds through electrical current.",
    researchCost: {
      oxygen: 1120,
      energy: 450,
      science: 500,
    },
    prerequisites: ["basic_energy"],
    unlocksBuildings: ["electrolyticOxygenPlant"],
    researchDuration: 120,
    isResearched: false,
  },
  {
    id: "basic_agriculture",
    name: "Basic Agriculture",
    category: "Production",
    description:
      "Unlocks foundational food production systems for colony sustainability.",
    researchCost: { food: 300, energy: 150, science: 50 },
    prerequisites: [],
    unlocksBuildings: ["fungalFarm"],
    researchDuration: 45,
    isResearched: false,
  },
  {
    id: "vertical_farming",
    name: "Vertical Farming",
    category: "Production",
    description:
      "Enables space-efficient stacked growing systems with automated nutrient delivery.",
    researchCost: { food: 3000, energy: 1800, science: 300 },
    prerequisites: ["basic_agriculture"],
    unlocksBuildings: ["hydroponicTower"],
    researchDuration: 90,
    isResearched: false,
  },
  {
    id: "biotech_engineering",
    name: "Biotech Engineering",
    category: "Production",
    description:
      "Advanced microbial cultivation and synthetic nutrition technologies.",
    researchCost: { food: 9900, energy: 5930, science: 600 },
    prerequisites: ["vertical_farming"],
    unlocksBuildings: ["proteinSynthesizer"],
    researchDuration: 180,
    isResearched: false,
  },
  {
    id: "data_processing",
    name: "Data Processing",
    category: "Research",
    description:
      "Enables big data analysis techniques for research optimization",
    researchCost: { science: 800, metals: 800, energy: 500 },
    prerequisites: ["basic_energy"],
    unlocksBuildings: ["dataAnalysisCenter"],
    researchDuration: 90,
    isResearched: false,
  },
  {
    id: "quantum_computing",
    name: "Quantum Computing",
    category: "Research",
    description: "Unlocks quantum-based calculation systems",
    researchCost: { science: 2500, metals: 1800, energy: 850 },
    prerequisites: ["data_processing"],
    unlocksBuildings: ["quantumComputer"],
    researchDuration: 180,
    isResearched: false,
  },
  {
    id: "ai_development",
    name: "AI Development",
    category: "Research",
    description:
      "Advanced neural network architectures for autonomous research",
    researchCost: { science: 8860, metals: 4960, energy: 2870 },
    prerequisites: ["quantum_computing"],
    unlocksBuildings: ["neuralSimulationLab"],
    researchDuration: 300,
    isResearched: false,
  },
  {
    id: "industrial_automation",
    name: "Industrial Automation",
    category: "Infrastructure",
    description:
      "Automated storage management systems for bulk material handling",
    researchCost: {
      metals: 5630,
      oxygen: 2810,
      energy: 1400,
      food: 1000,
      science: 500,
    },
    prerequisites: ["basic_energy"],
    unlocksBuildings: ["modularStorageHub"],
    researchDuration: 60,
    isResearched: false,
  },
  {
    id: "composite_alloys",
    name: "Composite Alloys",
    category: "Infrastructure",
    description: "Advanced metal compression and stacking techniques",
    researchCost: { metals: 5630, energy: 1400, science: 500 },
    prerequisites: ["deep_core_mining"],
    unlocksBuildings: ["metallicCompactionVault"],
    researchDuration: 75,
    isResearched: false,
  },
  {
    id: "quantum_storage",
    name: "Quantum Storage",
    category: "Infrastructure",
    description: "Subatomic compression fields for mass storage solutions",
    researchCost: {
      metals: 5630,
      oxygen: 15100,
      energy: 1400,
      food: 1000,
      science: 500,
    },
    prerequisites: ["quantum_computing"],
    unlocksBuildings: ["cryoUniversalDepot", "quantumCapacitor"],
    researchDuration: 120,
    isResearched: false,
  },
  {
    id: "quantum_tunneling_synthesis",
    name: "Quantum Tunneling Synthesis",
    category: "Production",
    description:
      "Quantum tunneling manipulation to extract metals from quantum vacuum.",
    researchCost: {
      energy: 1650,
      metals: 4500,
      science: 500,
    },
    prerequisites: ["plasma_refining"],
    unlocksBuildings: ["quantumFluxMetalForge"],
    researchDuration: 320,
    isResearched: false,
  },
  {
    id: "mhd_fusion_confinement",
    name: "MHD Fusion Confinement",
    category: "Production",
    description:
      "Plasma stabilization under extreme pressure conditions for the synthesis of metallic isotopes.",
    researchCost: {
      energy: 1350,
      metals: 5200,
      science: 1000,
    },
    prerequisites: ["quantum_tunneling_synthesis"],
    unlocksBuildings: ["fusionEdgeMetallizer"],
    researchDuration: 440,
    isResearched: false,
  },
  {
    id: "nano_scale_dismantling",
    name: "Nanoscale Dismantling",
    category: "Production",
    description:
      "Programmable nanobot swarms to deconstruct matter at the atomic level.",
    researchCost: {
      energy: 1800,
      metals: 4800,
      science: 2000,
    },
    prerequisites: ["mhd_fusion_confinement"],
    unlocksBuildings: ["nanoDismantlerFoundry"],
    researchDuration: 580,
    isResearched: false,
  },
  {
    id: "advanced_hub_integration",
    name: "Advanced Hub Integration",
    category: "Advanced",
    description:
      "Advanced integration of the central hub systems, enabling expansion with operational modules, including expedition planning and management, and other advanced functionalities.",
    researchCost: {
      metals: 42000,
      science: 8500,
      energy: 500,
    },
    prerequisites: [],
    unlocksBuildings: [],
    researchDuration: 1200,
    isResearched: false,
  },
  {
    id: "intra_planetary_expeditions_enablement",
    name: "Intra-Planetary Expeditions Enablement",
    category: "Advanced",
    description:
      "Integration of advanced sub-orbital and orbital transport, scanning, and logistical systems with the Operations Hub.",
    researchCost: {
      metals: 60000,
      science: 3000,
      energy: 600,
    },
    prerequisites: ["advanced_hub_integration"],
    researchDuration: 1200,
    isResearched: false,
    unlocksBuildings: [],
  },
  {
    id: "primitive_bioreactor",
    name: "Primitive Bioreactor",
    category: "Production",
    description:
      "Early organic processing using native flora and microbial cultures for sustainable food and oxygen generation.",
    researchCost: {
      food: 1120,
      energy: 580,
      science: 150,
    },
    prerequisites: [],
    unlocksBuildings: ["myco_grow_chamber"],
    researchDuration: 120, // 2 min
    isResearched: false,
    locked: true,
    expedtionMinTier: 0,
  },
  {
    id: "alien_alloys",
    name: "Alien Alloys",
    category: "Production",
    description:
      "Reverse-engineered from extraterrestrial artifacts, these advanced materials offer unprecedented strength-to-weight ratios.",
    researchCost: {
      metals: 25000,
      science: 1500,
    },
    prerequisites: [], // Wymaga badań nad obcymi
    unlocksBuildings: [], // Specjalny budynek do produkcji
    researchDuration: 600, // 10 minut - długa bo skomplikowana
    isResearched: false,
    locked: true, // Na początku zablokowane
    expedtionMinTier: 1,
  },

  {
    id: "quantum_metabolism",
    name: "Quantum Metabolism",
    category: "Production",
    description:
      "Harnessing quantum uncertainty in biological systems leads to radically accelerated nutrient cycles and oxygen production.",
    researchCost: {
      science: 5000,
      food: 3000,
    },
    prerequisites: [],
    unlocksBuildings: ["qmet_biofarm", "qmet_oxyplant"],
    researchDuration: 900, // 15 minut
    isResearched: false,
    locked: true,
    expedtionMinTier: 2,
  },
  {
    id: "harmonic_energy_matrices",
    name: "Harmonic Energy Matrices",
    category: "Energy",
    description:
      "Utilizing alien harmonic fields to amplify energy generation and resource efficiency via synchronized quantum resonators.",
    researchCost: {
      science: 9000,
      energy: 6000,
    },
    prerequisites: [],
    unlocksBuildings: ["harmonic_core_generator", "resonant_fabricator"],
    researchDuration: 1200, // 20 minut
    isResearched: false,
    locked: true,
    expedtionMinTier: 3,
  },
  {
    id: "symbiotic_processing_units",
    name: "Symbiotic Processing Units",
    category: "Advanced",
    description:
      "Integrates bio-mechanical constructs with industrial systems to enable co-dependent, ultra-efficient resource generation.",
    researchCost: {
      science: 14000,
      metals: 6000,
      food: 5000,
    },
    prerequisites: [],
    unlocksBuildings: ["symbio_colony_hub", "symbio_resource_loop"],
    researchDuration: 1500, // 25 minut
    isResearched: false,
    locked: true,
    expedtionMinTier: 4,
  },
  {
    id: "chrono_synchronization",
    name: "Chrono Synchronization",
    category: "Energy",
    description:
      "Advanced manipulation of time itself allows for synchronized production cycles, dramatically increasing efficiency across all systems.",
    researchCost: {
      science: 20000,
      energy: 8000,
      metals: 7000,
    },
    prerequisites: [],
    unlocksBuildings: ["chrono_turbine"],
    researchDuration: 1800, // 30 minut
    isResearched: false,
    locked: true,
    expedtionMinTier: 5,
  },
  {
    id: "hydrostatic_architecture",
    name: "Hydrostatic Megastructure Theory",
    category: "Infrastructure",
    description:
      "Revolutionary approach to stabilizing dynamic marine environments using corrosion-resistant metamaterials and kilometer-scale pressure management systems. Enables construction of permanent oceanic settlements.",
    researchCost: {
      metals: 11000,
      energy: 4000,
      food: 1500,
      oxygen: 1250,
      science: 2000,
    },
    prerequisites: [],
    unlocksBuildings: ["floating_habitat"],
    researchDuration: 2400,
    isResearched: false,
  },
  {
    id: "myco_structural_engineering",
    name: "Myco-Structural Ecosystem Synthesis",
    category: "Infrastructure",
    description:
      "Engineering of living mycelium networks as structural frameworks, integrating photosynthetic lichens and adaptive gas exchange membranes for self-regulating organic habitats.",
    researchCost: {
      metals: 15000,
      energy: 6000,
      food: 2500,
      oxygen: 2250,
      science: 3000,
    },
    prerequisites: ["hydrostatic_architecture", "quantum_tunneling_synthesis"],
    unlocksBuildings: ["bio_caverns"],
    researchDuration: 3200,
    isResearched: false,
  },
  {
    id: "spatial_fabric_manipulation",
    name: "Spatial Fabric Manipulation",
    category: "Production",
    description:
      "Control over localized space-time enables folding, compressing, and storing resources in non-Euclidean spaces, unlocking extreme production density.",
    researchCost: {
      metals: 60000,
      science: 40000,
      energy: 28000,
    },
    prerequisites: ["chrono_synchronization"],
    unlocksBuildings: ["dimensional_refinery", "void_storage_core"],
    researchDuration: 2100,
    isResearched: false,
    locked: true,
    expedtionMinTier: 6,
  },
  {
    id: "autonomic_storage_networks",
    name: "Autonomic Storage Networks",
    category: "Infrastructure",
    description:
      "A self-regulating resource storage architecture based on neural patterns that actively optimize flow, minimize waste, and accelerate distribution.",
    researchCost: {
      metals: 60000,
      science: 40000,
      energy: 28000,
    },
    prerequisites: ["spatial_fabric_manipulation"],
    unlocksBuildings: [
      "smart_resource_matrix",
      "nutrient_reserve_cluster",
      "aeropulse_vault",
    ],
    researchDuration: 2400, // 40 minut
    isResearched: false,
    locked: true,
    expedtionMinTier: 7,
  },
  {
    id: "antimatter_storage",
    name: "Antimatter Storage",
    category: "Energy",
    description:
      "Enables storage of vast energy through antimatter-based containment.",
    researchCost: {
      energy: 20000,
      metals: 4700,
      science: 2000,
    },
    prerequisites: ["quantum_storage"],
    unlocksBuildings: ["antimatterCell"],
    isResearched: false,
    researchDuration: 90,
  },
  {
    id: "void_singularity",
    name: "Void Singularity",
    category: "Energy",
    description:
      "Harness singularities to store unimaginable quantities of energy.",
    researchCost: {
      energy: 25000,
      metals: 5700,
      science: 3000,
    },
    prerequisites: ["antimatter_storage"],
    unlocksBuildings: ["voidCore"],
    isResearched: false,
    researchDuration: 150,
  },
  {
    id: "adaptive_matter_engineering",
    name: "Adaptive Matter Engineering",
    category: "Production",
    description:
      "Harnessing quantum-bound programmable matter that reshapes itself to fulfill immediate production needs.",
    researchCost: {
      science: 50000,
      metals: 20000,
      energy: 30000,
    },
    prerequisites: ["autonomic_storage_networks"],
    unlocksBuildings: ["morpho_core", "nutri_flux_hub"],
    researchDuration: 3000,
    isResearched: false,
    locked: true,
    expedtionMinTier: 8,
  },
  {
    id: "temporal_acceleration",
    name: "Temporal Acceleration",
    category: "Production",
    description:
      "By stabilizing localized spacetime fields, production cycles are significantly accelerated without material degradation.",
    researchCost: {
      science: 100000,
      metals: 60000,
      energy: 80000,
    },
    prerequisites: ["adaptive_matter_engineering"],
    unlocksBuildings: ["chrono_forge", "biosurge_chamber"],
    researchDuration: 4800, // 80 minut
    isResearched: false,
    locked: true,
    expedtionMinTier: 9,
  },
];

export const initialExpeditions: Expedition[] = [];
