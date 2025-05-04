import { Technology } from "@/types/technology";

export const technology_energy: Technology[] = [
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
];
