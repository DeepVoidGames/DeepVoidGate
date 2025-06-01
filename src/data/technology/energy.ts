import { Technology } from "@/types/technology";

export const technology_energy: Technology[] = [
  {
    id: "basic_energy",
    name: "Basic Energy",
    category: "Energy",
    description: "Unlocks essential energy storage",
    researchCost: { energy: 500, metals: 100 },
    prerequisites: [],
    unlocksBuildings: ["basicBattery"],
    isResearched: false,
    researchDuration: 600, // 10 min
  },
  {
    id: "geothermal_energy",
    name: "Geothermal Energy",
    category: "Energy",
    description: "Harness geothermal energy from the planet's core.",
    researchCost: { energy: 1200, metals: 300, science: 250 },
    prerequisites: ["basic_energy"],
    unlocksBuildings: ["geothermalPlant"],
    isResearched: false,
    researchDuration: 900, // 15 min
  },
  {
    id: "nuclear_fission",
    name: "Nuclear Fission",
    category: "Energy",
    description: "Nuclear fission reactors for high-energy output.",
    researchCost: { energy: 3500, metals: 900, science: 800 },
    prerequisites: ["geothermal_energy"],
    unlocksBuildings: ["fissionReactor"],
    isResearched: false,
    researchDuration: 1200, // 20 min
  },
  {
    id: "fusion_energy",
    name: "Fusion Energy",
    category: "Energy",
    description: "Sustainable fusion energy.",
    researchCost: { energy: 10000, metals: 2000, science: 2000 },
    prerequisites: ["nuclear_fission", "plasma_refining"],
    unlocksBuildings: ["fusionReactor"],
    isResearched: false,
    researchDuration: 1800, // 30 min
  },
  {
    id: "chrono_synchronization",
    name: "Chrono Synchronization",
    category: "Energy",
    description: "Time-based synchronization for system efficiency.",
    researchCost: { science: 25000, energy: 18000, metals: 12000 },
    prerequisites: [],
    unlocksBuildings: ["chrono_turbine"],
    researchDuration: 2400, // 40 min
    isResearched: false,
    locked: true,
    expedtionMinTier: 5,
  },
  {
    id: "antimatter_storage",
    name: "Antimatter Storage",
    category: "Energy",
    description: "Antimatter containment systems.",
    researchCost: { energy: 35000, metals: 15000, science: 10000 },
    prerequisites: ["quantum_storage"],
    unlocksBuildings: ["antimatterCell"],
    isResearched: false,
    researchDuration: 2700, // 45 min
  },
  {
    id: "void_singularity",
    name: "Void Singularity",
    category: "Energy",
    description: "Harness singularities for energy.",
    researchCost: { energy: 90000, metals: 30000, science: 25000 },
    prerequisites: ["antimatter_storage"],
    unlocksBuildings: ["voidCore"],
    isResearched: false,
    researchDuration: 3000, // 50 min
  },
  {
    id: "temporal_engineering",
    name: "Temporal Engineering",
    category: "Energy",
    description: "Extract energy from spacetime.",
    researchCost: { energy: 200000, science: 60000 },
    prerequisites: ["fusion_energy"],
    unlocksBuildings: ["chrono_turbine_mk2"],
    researchDuration: 3300, // 55 min
    isResearched: false,
  },
  {
    id: "quantum_temporal_manipulation",
    name: "Quantum Temporal Manipulation",
    description: "Controlled exploitation of anomalies.",
    researchCost: { energy: 500000, science: 160000 },
    prerequisites: ["temporal_engineering", "quantum_singularity"],
    unlocksBuildings: ["quantum_flux_generator"],
    researchDuration: 3450, // 57.5 min
    isResearched: false,
    category: "Energy",
  },
  {
    id: "quantum_energy_harnessing",
    name: "Quantum Energy Harnessing",
    description: "Quantum Core Reactor breakthrough.",
    researchCost: { energy: 1500000, science: 500000 },
    prerequisites: ["quantum_temporal_manipulation"],
    unlocksBuildings: ["quantum_core"],
    researchDuration: 3600, // 1h (max)
    isResearched: false,
    locked: true,
    category: "Energy",
  },
];
