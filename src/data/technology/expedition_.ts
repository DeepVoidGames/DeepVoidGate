import { Technology } from "@/types/technology";

export const technology_expedition: Technology[] = [
  {
    id: "primitive_bioreactor",
    name: "Primitive Bioreactor",
    category: "Production",
    description:
      "Early organic processing using native flora and microbial cultures for sustainable food and oxygen generation.",
    researchCost: { food: 1200, energy: 600, science: 200 },
    prerequisites: [],
    unlocksBuildings: ["myco_grow_chamber"],
    researchDuration: 300, // 5 min
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
    researchCost: { metals: 50000, science: 5000 },
    prerequisites: [],
    unlocksBuildings: [],
    researchDuration: 900, // 15 min
    isResearched: false,
    locked: true,
    expedtionMinTier: 1,
  },
  {
    id: "quantum_metabolism",
    name: "Quantum Metabolism",
    category: "Production",
    description:
      "Quantum uncertainty accelerates nutrient cycles and oxygen production.",
    researchCost: { science: 12000, food: 8000 },
    prerequisites: [],
    unlocksBuildings: ["qmet_biofarm", "qmet_oxyplant"],
    researchDuration: 1200, // 20 min
    isResearched: false,
    locked: true,
    expedtionMinTier: 2,
  },
  {
    id: "harmonic_energy_matrices",
    name: "Harmonic Energy Matrices",
    category: "Energy",
    description:
      "Alien harmonic fields amplify energy generation through resonators.",
    researchCost: { science: 20000, energy: 12000 },
    prerequisites: [],
    unlocksBuildings: ["harmonic_core_generator", "resonant_fabricator"],
    researchDuration: 1500, // 25 min
    isResearched: false,
    locked: true,
    expedtionMinTier: 3,
  },
  {
    id: "symbiotic_processing_units",
    name: "Symbiotic Processing Units",
    category: "Infrastructure",
    description:
      "Bio-mechanical constructs enable co-dependent, ultra-efficient systems.",
    researchCost: { science: 35000, metals: 16000, food: 12000 },
    prerequisites: [],
    unlocksBuildings: ["symbio_colony_hub", "symbio_resource_loop"],
    researchDuration: 1800, // 30 min
    isResearched: false,
    locked: true,
    expedtionMinTier: 4,
  },
  {
    id: "spatial_fabric_manipulation",
    name: "Spatial Fabric Manipulation",
    category: "Production",
    description:
      "Non-Euclidean storage and compression for extreme density production.",
    researchCost: { metals: 120000, science: 80000, energy: 56000 },
    prerequisites: [],
    unlocksBuildings: ["dimensional_refinery", "void_storage_core"],
    researchDuration: 2400, // 40 min
    isResearched: false,
    locked: true,
    expedtionMinTier: 6,
  },
  {
    id: "autonomic_storage_networks",
    name: "Autonomic Storage Networks",
    category: "Infrastructure",
    description:
      "Neural-patterned architecture that self-regulates storage and flow.",
    researchCost: { metals: 140000, science: 90000, energy: 70000 },
    prerequisites: [],
    unlocksBuildings: [
      "smart_resource_matrix",
      "nutrient_reserve_cluster",
      "aeropulse_vault",
    ],
    researchDuration: 2700, // 45 min
    isResearched: false,
    locked: true,
    expedtionMinTier: 7,
  },
  {
    id: "adaptive_matter_engineering",
    name: "Adaptive Matter Engineering",
    category: "Production",
    description:
      "Programmable quantum matter adapts to real-time production needs.",
    researchCost: { science: 200000, metals: 90000, energy: 100000 },
    prerequisites: [],
    unlocksBuildings: ["morpho_core", "nutri_flux_hub"],
    researchDuration: 3000, // 50 min
    isResearched: false,
    locked: true,
    expedtionMinTier: 8,
  },
  {
    id: "temporal_acceleration",
    name: "Temporal Acceleration",
    category: "Production",
    description:
      "Stabilizing spacetime fields speeds up production without loss.",
    researchCost: { science: 400000, metals: 180000, energy: 200000 },
    prerequisites: [],
    unlocksBuildings: ["chrono_forge", "biosurge_chamber"],
    researchDuration: 3600, // 1h
    isResearched: false,
    locked: true,
    expedtionMinTier: 9,
  },
  {
    id: "matter_synthesis",
    name: "Matter Synthesis",
    category: "Production",
    description:
      "Zero-point manipulation enables creation of matter from energy.",
    researchCost: {
      science: 800000,
      energy: 600000,
      metals: 400000,
    },
    prerequisites: ["temporal_acceleration"],
    unlocksBuildings: ["quantum_forge_array", "bio_reconstruction_vat"],
    researchDuration: 7200, // 2h
    isResearched: false,
    locked: true,
    expedtionMinTier: 10,
  },
];
