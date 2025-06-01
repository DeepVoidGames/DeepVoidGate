import { Technology } from "@/types/technology";

export const technology_advanced: Technology[] = [
  {
    id: "advanced_hub_integration",
    name: "Advanced Hub Integration",
    category: "Advanced",
    description:
      "Advanced integration of the central hub systems, enabling expansion with operational modules, including expedition planning and management, and other advanced functionalities.",
    researchCost: {
      metals: 5e4,
      science: 8.5e4,
      energy: 5e4,
    },
    prerequisites: [],
    unlocksBuildings: [],
    researchDuration: 360,
    isResearched: false,
  },
  {
    id: "intra_planetary_expeditions_enablement",
    name: "Intra-Planetary Expeditions Enablement",
    category: "Advanced",
    description:
      "Integration of advanced sub-orbital and orbital transport, scanning, and logistical systems with the Operations Hub.",
    researchCost: {
      metals: 8e4,
      science: 1e5,
      energy: 8e4,
    },
    prerequisites: ["advanced_hub_integration"],
    researchDuration: 720,
    isResearched: false,
    unlocksBuildings: [],
  },
];
