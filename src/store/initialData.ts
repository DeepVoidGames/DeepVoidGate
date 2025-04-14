import {
  BuildingData,
  ResourceType,
  ResourceAlertThresholds,
  BuildingType,
  BuildingCategory,
  Technology,
  ExpeditionState as Expedition,
} from "@/store/types";
import buildingData from "../data/buildings.json";
import buildingExpeditionData from "../data/buildingExpeditions.json";

// Generate a unique ID
export const generateId = (lenght: number = 9): string => {
  return Math.random().toString(36).substr(2, lenght);
};

// Połącz obie tablice danych budynków
const allBuildingsData = [...buildingData, ...buildingExpeditionData];

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
    production: 0,
    consumption: 0,
    capacity: 100,
    icon: "O₂",
    color: "cyan",
    baseCapacity: 100,
  },
  water: {
    amount: 50,
    production: 0,
    consumption: 0,
    capacity: 100,
    icon: "💧",
    color: "blue",
    baseCapacity: 100,
  },
  food: {
    amount: 50,
    production: 0,
    consumption: 0,
    capacity: 100,
    icon: "🌱",
    color: "green",
    baseCapacity: 100,
  },
  energy: {
    amount: 100,
    production: 0,
    consumption: 0,
    capacity: 200,
    icon: "⚡",
    color: "yellow",
    baseCapacity: 200,
  },
  metals: {
    amount: 200,
    production: 0,
    consumption: 0,
    capacity: 200,
    icon: "⛏️",
    color: "zinc",
    baseCapacity: 200,
  },
  science: {
    amount: 0,
    production: 0,
    consumption: 0,
    capacity: 100,
    icon: "🔬",
    color: "purple",
    baseCapacity: 100,
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
    researchCost: { metals: 150, science: 75 },
    prerequisites: [],
    unlocksBuildings: [],
    isResearched: false,
    researchDuration: 30,
  },
  {
    id: "deep_core_mining",
    name: "Deep Core Mining",
    category: "Production",
    description: "Enables access to 深层 metal deposits with advanced drills.",
    researchCost: {
      metals: 300,
      science: 150,
    },
    prerequisites: ["basic_energy"],
    unlocksBuildings: [],
    researchDuration: 90,
    isResearched: false,
  },
  {
    id: "seismic_ore_mapping",
    name: "Seismic Ore Mapping",
    category: "Production",
    description: "Detects high-density ore clusters using resonance waves.",
    researchCost: {
      metals: 600,
      science: 300,
      energy: 100,
    },
    prerequisites: ["deep_core_mining"],
    unlocksBuildings: [],
    researchDuration: 180,
    isResearched: false,
  },
  {
    id: "plasma_refining",
    name: "Plasma Refining",
    category: "Production",
    description: "Harnesses plasma to break down ores at the atomic level.",
    researchCost: {
      metals: 1200,
      science: 800,
    },
    prerequisites: ["seismic_ore_mapping"],
    unlocksBuildings: [],
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
      metals: 600,
      science: 700,
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
      metals: 1200,
      science: 950,
      energy: 150,
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
      metals: 2000,
      science: 1500,
      energy: 300,
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
      metals: 400,
      science: 250,
      energy: 100,
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
    researchCost: { metals: 100, science: 50 },
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
    researchCost: { metals: 200, science: 100, energy: 30 },
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
    researchCost: { metals: 350, science: 200, food: 50 },
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
    researchCost: { metals: 250, science: 100 },
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
    researchCost: { metals: 400, science: 500, energy: 80 },
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
    researchCost: { metals: 600, science: 1000, energy: 150 },
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
    researchCost: { metals: 180, science: 80 },
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
    researchCost: { metals: 250, science: 120 },
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
    researchCost: { metals: 400, science: 250, energy: 150 },
    prerequisites: ["quantum_computing"],
    unlocksBuildings: ["cryoUniversalDepot"],
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
      metals: 2600,
      science: 950,
      energy: 200,
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
      metals: 2450,
      science: 1100,
      energy: 180,
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
      metals: 5750,
      science: 1300,
      energy: 250,
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
      science: 200,
      food: 500,
    },
    prerequisites: [],
    unlocksBuildings: [],
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
];

export const initialExpeditions: Expedition[] = [];
