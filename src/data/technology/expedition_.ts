import { Technology } from "@/types/technology";

export const technology_expedition: Technology[] = [
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
    prerequisites: [],
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
    prerequisites: [],
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
    prerequisites: [],
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
    prerequisites: [],
    unlocksBuildings: ["chrono_forge", "biosurge_chamber"],
    researchDuration: 4800, // 80 minut
    isResearched: false,
    locked: true,
    expedtionMinTier: 9,
  },
  {
    id: "matter_synthesis",
    name: "Matter Synthesis",
    category: "Production",
    description:
      "Unlocking zero-point field manipulation enables the direct creation of matter from energy. Resource limitations become obsolete.",
    researchCost: {
      science: 200000,
      energy: 150000,
      metals: 100000,
    },
    prerequisites: ["temporal_acceleration"],
    unlocksBuildings: ["quantum_forge_array", "bio_reconstruction_vat"],
    researchDuration: 7200, // 2 godziny
    isResearched: false,
    locked: true,
    expedtionMinTier: 10,
  },
];
