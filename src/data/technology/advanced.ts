import { Technology } from "@/types/technology";

export const technology_advanced: Technology[] = [
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
];
