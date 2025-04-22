// src/data/milestonesData.ts
import { Milestone, GameState, TechnologyCategory } from "@/store/types";
import { stat } from "fs";
import { FastForward } from "lucide-react";

// Define a new type for tiered milestones
export interface TierDefinition {
  tier: number;
  target: number;
  rewardAmount: number;
  description: string;
}

// Helper function to create tiered milestones
export const createTieredMilestone = (
  id: string,
  name: string,
  category: string,
  resourceKey: string,
  tiers: TierDefinition[]
): Milestone[] => {
  return tiers.map((tierDef) => ({
    id: `${id}_${tierDef.tier}`,
    name: `${name} ${getRomanNumeral(tierDef.tier)}`,
    description:
      tierDef.description ||
      `Collect ${tierDef.target.toLocaleString()} ${resourceKey}`,
    rewardDescription: `+${tierDef.rewardAmount.toLocaleString()} ${resourceKey} Storage Capacity`,
    category,
    progress: (state: GameState) =>
      (state.resources[resourceKey].amount / tierDef.target) * 100,
    condition: (state: GameState) =>
      state.resources[resourceKey].amount >= tierDef.target,
    reward: (state: GameState) => ({
      ...state,
      resources: {
        ...state.resources,
        [resourceKey]: {
          ...state.resources[resourceKey],
          bonusCapacity:
            state.resources[resourceKey].bonusCapacity + tierDef.rewardAmount,
        },
      },
    }),
    completed: false,
    tier: tierDef.tier,
    // Add an optional prerequisite for tiers > 1
    prerequisiteId: tierDef.tier > 1 ? `${id}_${tierDef.tier - 1}` : undefined,
  }));
};

// Helper function to convert numbers to Roman numerals for tiers
function getRomanNumeral(num: number): string {
  const romanNumerals = [
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X",
  ];
  return num <= 10 ? romanNumerals[num - 1] : `Tier ${num}`;
}

// Define the Metal Magnate milestone tiers
const metalMagnateTiers: TierDefinition[] = [
  {
    tier: 1,
    target: 10000,
    rewardAmount: 1000,
    description: "Collect 10,000 metal",
  },
  {
    tier: 2,
    target: 50000,
    rewardAmount: 5000,
    description: "Collect 50,000 metal",
  },
  {
    tier: 3,
    target: 100000,
    rewardAmount: 10000,
    description: "Collect 100,000 metal",
  },
  {
    tier: 4,
    target: 1000000,
    rewardAmount: 50000,
    description: "Collect 1,000,000 metal",
  },
  {
    tier: 5,
    target: 10000000,
    rewardAmount: 100000,
    description: "Collect 10,000,000 metal",
  },
];

const oxygenTiers: TierDefinition[] = [
  {
    tier: 1,
    target: 10000,
    rewardAmount: 1000,
    description: "Collect 10,000 oxygen",
  },
  {
    tier: 2,
    target: 50000,
    rewardAmount: 5000,
    description: "Collect 50,000 oxygen",
  },
  {
    tier: 3,
    target: 100000,
    rewardAmount: 10000,
    description: "Collect 100,000 oxygen",
  },
  {
    tier: 4,
    target: 1000000,
    rewardAmount: 50000,
    description: "Collect 1,000,000 oxygen",
  },
  {
    tier: 5,
    target: 10000000,
    rewardAmount: 100000,
    description: "Collect 10,000,000 oxygen",
  },
];

const waterTiers: TierDefinition[] = [
  // {
  //   tier: 1,
  //   target: 10000,
  //   rewardAmount: 1000,
  //   description: "Collect 10,000 water",
  // },
  // {
  //   tier: 2,
  //   target: 50000,
  //   rewardAmount: 5000,
  //   description: "Collect 50,000 water",
  // },
  // {
  //   tier: 3,
  //   target: 100000,
  //   rewardAmount: 10000,
  //   description: "Collect 100,000 water",
  // },
  // {
  //   tier: 4,
  //   target: 1000000,
  //   rewardAmount: 50000,
  //   description: "Collect 1,000,000 water",
  // },
];

const foodTiers: TierDefinition[] = [
  {
    tier: 1,
    target: 10000,
    rewardAmount: 1000,
    description: "Collect 10,000 food",
  },
  {
    tier: 2,
    target: 50000,
    rewardAmount: 5000,
    description: "Collect 50,000 food",
  },
  {
    tier: 3,
    target: 100000,
    rewardAmount: 10000,
    description: "Collect 100,000 food",
  },
  {
    tier: 4,
    target: 1000000,
    rewardAmount: 50000,
    description: "Collect 1,000,000 food",
  },
  {
    tier: 5,
    target: 10000000,
    rewardAmount: 100000,
    description: "Collect 10,000,000 food",
  },
];

const energyTiers: TierDefinition[] = [
  {
    tier: 1,
    target: 10000,
    rewardAmount: 1000,
    description: "Generate 10,000 energy",
  },
  {
    tier: 2,
    target: 50000,
    rewardAmount: 5000,
    description: "Generate 50,000 energy",
  },
  {
    tier: 3,
    target: 100000,
    rewardAmount: 10000,
    description: "Generate 100,000 energy",
  },
  {
    tier: 4,
    target: 1000000,
    rewardAmount: 50000,
    description: "Generate 1,000,000 energy",
  },
  {
    tier: 5,
    target: 10000000,
    rewardAmount: 100000,
    description: "Generate 10,000,000 energy",
  },
];

const scienceTiers: TierDefinition[] = [
  {
    tier: 1,
    target: 10000,
    rewardAmount: 1000,
    description: "Research 10,000 science",
  },
  {
    tier: 2,
    target: 50000,
    rewardAmount: 5000,
    description: "Research 50,000 science",
  },
  {
    tier: 3,
    target: 100000,
    rewardAmount: 10000,
    description: "Research 100,000 science",
  },
  {
    tier: 4,
    target: 1000000,
    rewardAmount: 50000,
    description: "Research 1,000,000 science",
  },
  {
    tier: 5,
    target: 10000000,
    rewardAmount: 100000,
    description: "Research 10,000,000 science",
  },
];

// Define initial milestones using the helper function
export const initialMilestones: Milestone[] = [
  ...createTieredMilestone(
    "oxygen_collector",
    "Oxygen Collector",
    "resources",
    "oxygen",
    oxygenTiers
  ),
  ...createTieredMilestone(
    "water_supplier",
    "Water Supplier",
    "resources",
    "water",
    waterTiers
  ),
  ...createTieredMilestone(
    "food_provider",
    "Food Provider",
    "resources",
    "food",
    foodTiers
  ),
  ...createTieredMilestone(
    "energy_generator",
    "Energy Generator",
    "resources",
    "energy",
    energyTiers
  ),
  ...createTieredMilestone(
    "metal_magnate",
    "Metal Magnate",
    "resources",
    "metals",
    metalMagnateTiers
  ),
  ...createTieredMilestone(
    "science_breakthrough",
    "Science Breakthrough",
    "resources",
    "science",
    scienceTiers
  ),
  {
    id: "population_foundation",
    name: "The foundation of the colony",
    description:
      "As the first settlers arrive, the foundation of the colony is laid.",
    condition: function (state: GameState): boolean {
      if (state.population.total >= 50) return true;
    },
    progress: function (state: GameState): number {
      return (state.population.total / 50) * 100;
    },
    completed: false,
    category: "population",
  },
  {
    id: "population_horizons",
    name: "Expanding Horizons",
    description:
      "With a growing population, the colony takes its first steps toward a thriving settlement.",
    condition: function (state: GameState): boolean {
      if (state.population.total >= 80) return true;
    },
    progress: function (state: GameState): number {
      return (state.population.total / 80) * 100;
    },
    completed: false,
    category: "population",
  },
  {
    id: "population_thriving_community",
    name: "Thriving Community",
    description:
      "The colony has reached a significant milestone, becoming a bustling hub of activity and growth.",
    condition: function (state: GameState): boolean {
      return state.population.total >= 150;
    },
    progress: function (state: GameState): number {
      return Math.min((state.population.total / 150) * 100, 100);
    },
    completed: false,
    category: "population",
  },

  {
    id: "oxygen_building",
    name: "Oxygen Production Facilities",
    description:
      "Unlock all oxygen production facilities to ensure a steady supply of oxygen for the colony.",
    condition: function (state: GameState): boolean {
      const maxCount = state.buildings.filter(
        (building) => building.tag === "oxygen"
      ).length;

      const count = state.buildings.filter(
        (building) => building.tag === "oxygen" && building.upgrades >= 1
      ).length;

      return count >= maxCount;
    },
    progress: function (state: GameState): number {
      const maxCount = state.buildings.filter(
        (building) => building.tag === "oxygen"
      ).length;

      const count = state.buildings.filter(
        (building) => building.tag === "oxygen" && building.upgrades >= 1
      ).length;

      return Math.min((count / maxCount) * 100, 100);
    },
    completed: false,
    category: "buildings",
  },
  {
    id: "oxygen_building_maxed",
    name: "Oxygen Production Facilities Maxed",
    description:
      "Max out all oxygen production facilities to ensure a steady supply of oxygen for the colony.",
    condition: function (state: GameState): boolean {
      const maxCount = state.buildings.filter(
        (building) => building.tag === "oxygen"
      ).length;

      const count = state.buildings.filter(
        (building) =>
          building.tag === "oxygen" &&
          building.upgrades >= 10 &&
          building.tier == building.maxTier
      ).length;

      return count >= maxCount;
    },
    progress: function (state: GameState): number {
      const maxCount = state.buildings.filter(
        (building) => building.tag === "oxygen"
      ).length;

      const count = state.buildings.filter(
        (building) => building.tag === "oxygen" && building.upgrades >= 5
      ).length;

      return Math.min((count / maxCount) * 100, 100);
    },
    completed: false,
    category: "buildings",
  },

  {
    id: "food_building",
    name: "Food Production Facilities",
    description:
      "Unlock all food production facilities to ensure a steady supply of food for the colony.",
    condition: function (state: GameState): boolean {
      const maxCount = state.buildings.filter(
        (building) => building.tag === "food"
      ).length;

      const count = state.buildings.filter(
        (building) => building.tag === "food" && building.upgrades >= 1
      ).length;

      return count >= maxCount;
    },
    progress: function (state: GameState): number {
      const maxCount = state.buildings.filter(
        (building) => building.tag === "food"
      ).length;

      const count = state.buildings.filter(
        (building) => building.tag === "food" && building.upgrades >= 1
      ).length;

      return Math.min((count / maxCount) * 100, 100);
    },
    completed: false,
    category: "buildings",
  },
  {
    id: "food_building_maxed",
    name: "Food Production Facilities Maxed",
    description:
      "Max out all food production facilities to ensure a steady supply of food for the colony.",
    condition: function (state: GameState): boolean {
      const maxCount = state.buildings.filter(
        (building) => building.tag === "food"
      ).length;

      const count = state.buildings.filter(
        (building) =>
          building.tag === "food" &&
          building.upgrades >= 10 &&
          building.tier == building.maxTier
      ).length;

      return count >= maxCount;
    },
    progress: function (state: GameState): number {
      const maxCount = state.buildings.filter(
        (building) => building.tag === "food"
      ).length;

      const count = state.buildings.filter(
        (building) => building.tag === "food" && building.upgrades >= 5
      ).length;

      return Math.min((count / maxCount) * 100, 100);
    },
    completed: false,
    category: "buildings",
  },

  // energy
  {
    id: "energy_building",
    name: "Energy Production Facilities",
    description:
      "Unlock all energy production facilities to ensure a steady supply of energy for the colony.",
    condition: function (state: GameState): boolean {
      const maxCount = state.buildings.filter(
        (building) => building.tag === "energy"
      ).length;

      const count = state.buildings.filter(
        (building) => building.tag === "energy" && building.upgrades >= 1
      ).length;

      return count >= maxCount;
    },

    progress: function (state: GameState): number {
      const maxCount = state.buildings.filter(
        (building) => building.tag === "energy"
      ).length;

      const count = state.buildings.filter(
        (building) => building.tag === "energy" && building.upgrades >= 1
      ).length;

      return Math.min((count / maxCount) * 100, 100);
    },
    completed: false,
    category: "buildings",
  },

  {
    id: "energy_building_maxed",
    name: "Energy Production Facilities Maxed",
    description:
      "Max out all energy production facilities to ensure a steady supply of energy for the colony.",
    condition: function (state: GameState): boolean {
      const maxCount = state.buildings.filter(
        (building) => building.tag === "energy"
      ).length;

      const count = state.buildings.filter(
        (building) =>
          building.tag === "energy" &&
          building.upgrades >= 10 &&
          building.tier == building.maxTier
      ).length;

      return count >= maxCount;
    },
    progress: function (state: GameState): number {
      const maxCount = state.buildings.filter(
        (building) => building.tag === "energy"
      ).length;

      const count = state.buildings.filter(
        (building) => building.tag === "energy" && building.upgrades >= 5
      ).length;

      return Math.min((count / maxCount) * 100, 100);
    },
    completed: false,
    category: "buildings",
  },

  {
    id: "metal_building",
    name: "Metal Production Facilities",
    description:
      "Unlock all metal production facilities to ensure a steady supply of metal for the colony.",
    condition: function (state: GameState): boolean {
      const maxCount = state.buildings.filter(
        (building) => building.tag === "metals"
      ).length;

      const count = state.buildings.filter(
        (building) => building.tag === "metals" && building.upgrades >= 1
      ).length;

      return count >= maxCount;
    },
    progress: function (state: GameState): number {
      const maxCount = state.buildings.filter(
        (building) => building.tag === "metals"
      ).length;

      const count = state.buildings.filter(
        (building) => building.tag === "metals" && building.upgrades >= 1
      ).length;

      return Math.min((count / maxCount) * 100, 100);
    },
    completed: false,
    category: "buildings",
  },

  {
    id: "metal_building_maxed",
    name: "Metal Production Facilities Maxed",
    description:
      "Max out all metal production facilities to ensure a steady supply of metal for the colony.",
    condition: function (state: GameState): boolean {
      const maxCount = state.buildings.filter(
        (building) => building.tag === "metals"
      ).length;

      const count = state.buildings.filter(
        (building) =>
          building.tag === "metals" &&
          building.upgrades >= 10 &&
          building.tier == building.maxTier
      ).length;

      return count >= maxCount;
    },
    progress: function (state: GameState): number {
      const maxCount = state.buildings.filter(
        (building) => building.tag === "metals"
      ).length;

      const count = state.buildings.filter(
        (building) => building.tag === "metals" && building.upgrades >= 5
      ).length;

      return Math.min((count / maxCount) * 100, 100);
    },
    completed: false,
    category: "buildings",
  },

  {
    id: "science_building",
    name: "Science Production Facilities",
    description:
      "Unlock all science production facilities to ensure a steady supply of science for the colony.",
    condition: function (state: GameState): boolean {
      const maxCount = state.buildings.filter(
        (building) => building.tag === "science"
      ).length;

      const count = state.buildings.filter(
        (building) => building.tag === "science" && building.upgrades >= 1
      ).length;

      return count >= maxCount;
    },
    progress: function (state: GameState): number {
      const maxCount = state.buildings.filter(
        (building) => building.tag === "science"
      ).length;

      const count = state.buildings.filter(
        (building) => building.tag === "science" && building.upgrades >= 1
      ).length;

      return Math.min((count / maxCount) * 100, 100);
    },
    completed: false,
    category: "buildings",
  },

  {
    id: "science_building_maxed",
    name: "Science Production Facilities Maxed",
    description:
      "Max out all science production facilities to ensure a steady supply of science for the colony.",
    condition: function (state: GameState): boolean {
      const maxCount = state.buildings.filter(
        (building) => building.tag === "science"
      ).length;

      const count = state.buildings.filter(
        (building) =>
          building.tag === "science" &&
          building.upgrades >= 10 &&
          building.tier == building.maxTier
      ).length;

      return count >= maxCount;
    },
    progress: function (state: GameState): number {
      const maxCount = state.buildings.filter(
        (building) => building.tag === "science"
      ).length;

      const count = state.buildings.filter(
        (building) => building.tag === "science" && building.upgrades >= 5
      ).length;

      return Math.min((count / maxCount) * 100, 100);
    },
    completed: false,
    category: "buildings",
  },
  {
    id: "technology_infrastructure",
    name: "Technology Infrastructure",
    description:
      "Unlock all technology infrastructure to ensure a steady supply of technology for the colony.",
    condition: function (state: GameState): boolean {
      const maxCount = state.technologies.filter(
        (technology) =>
          technology.category === ("infrastructure" as TechnologyCategory)
      );

      const count = state.technologies.filter(
        (technology) =>
          technology.category === ("infrastructure" as TechnologyCategory) &&
          technology.isResearched
      ).length;

      return count >= maxCount.length;
    },
    progress: function (state: GameState): number {
      const maxCount = state.technologies.filter(
        (technology) =>
          technology.category === ("infrastructure" as TechnologyCategory)
      );

      const count = state.technologies.filter(
        (technology) =>
          technology.category === ("infrastructure" as TechnologyCategory) &&
          technology.isResearched
      ).length;

      return Math.min((count / maxCount.length) * 100, 100);
    },
    completed: false,
    category: "technology",
  },
  {
    id: "technology_energy",
    name: "Energy Technology",
    description:
      "Unlock all energy technology to ensure a steady supply of energy for the colony.",

    condition: function (state: GameState): boolean {
      const maxCount = state.technologies.filter(
        (technology) => technology.category === ("energy" as TechnologyCategory)
      );

      const count = state.technologies.filter(
        (technology) =>
          technology.category === ("energy" as TechnologyCategory) &&
          technology.isResearched
      ).length;

      return count >= maxCount.length;
    },
    progress: function (state: GameState): number {
      const maxCount = state.technologies.filter(
        (technology) => technology.category === ("energy" as TechnologyCategory)
      );

      const count = state.technologies.filter(
        (technology) =>
          technology.category === ("energy" as TechnologyCategory) &&
          technology.isResearched
      ).length;

      return Math.min((count / maxCount.length) * 100, 100);
    },
    completed: false,
    category: "technology",
  },
  // production
  {
    id: "technology_production",
    name: "Production Technology",
    description:
      "Unlock all production technology to ensure a steady supply of production for the colony.",

    condition: function (state: GameState): boolean {
      const maxCount = state.technologies.filter(
        (technology) =>
          technology.category === ("production" as TechnologyCategory)
      );

      const count = state.technologies.filter(
        (technology) =>
          technology.category === ("production" as TechnologyCategory) &&
          technology.isResearched
      ).length;

      return count >= maxCount.length;
    },
    progress: function (state: GameState): number {
      const maxCount = state.technologies.filter(
        (technology) =>
          technology.category === ("production" as TechnologyCategory)
      );

      const count = state.technologies.filter(
        (technology) =>
          technology.category === ("production" as TechnologyCategory) &&
          technology.isResearched
      ).length;

      return Math.min((count / maxCount.length) * 100, 100);
    },
    completed: false,
    category: "technology",
  },
  {
    id: "technology_research",
    name: "Research Technology",
    description:
      "Unlock all research technology to ensure a steady supply of research for the colony.",

    condition: function (state: GameState): boolean {
      const maxCount = state.technologies.filter(
        (technology) =>
          technology.category === ("research" as TechnologyCategory)
      );

      const count = state.technologies.filter(
        (technology) =>
          technology.category === ("research" as TechnologyCategory) &&
          technology.isResearched
      ).length;

      return count >= maxCount.length;
    },
    progress: function (state: GameState): number {
      const maxCount = state.technologies.filter(
        (technology) =>
          technology.category === ("research" as TechnologyCategory)
      );

      const count = state.technologies.filter(
        (technology) =>
          technology.category === ("research" as TechnologyCategory) &&
          technology.isResearched
      ).length;

      return Math.min((count / maxCount.length) * 100, 100);
    },
    completed: false,
    category: "technology",
  },
  {
    id: "technology_advanced",
    name: "Advanced Technology",
    description:
      "Unlock all advanced technology to ensure a steady supply of advanced technology for the colony.",

    condition: function (state: GameState): boolean {
      const maxCount = state.technologies.filter(
        (technology) =>
          technology.category === ("advanced" as TechnologyCategory)
      );

      const count = state.technologies.filter(
        (technology) =>
          technology.category === ("advanced" as TechnologyCategory) &&
          technology.isResearched
      ).length;

      return count >= maxCount.length;
    },
    progress: function (state: GameState): number {
      const maxCount = state.technologies.filter(
        (technology) =>
          technology.category === ("advanced" as TechnologyCategory)
      );

      const count = state.technologies.filter(
        (technology) =>
          technology.category === ("advanced" as TechnologyCategory) &&
          technology.isResearched
      ).length;

      return Math.min((count / maxCount.length) * 100, 100);
    },
    completed: false,
    category: "technology",
  },
  // Expedtion Tier 0
  {
    id: "expedition_tier_0",
    name: "Expedition Tier 0",
    description: "Finish the 0 expedition tier.",
    condition: function (state: GameState): boolean {
      return (
        state.expeditions.filter((expedition) => expedition.tier === 0).length >
        0
      );
    },
    progress: function (state: GameState): number {
      const expeditionCount = state.expeditions.filter(
        (expedition) => expedition.tier === 0
      ).length;
      return Math.min((expeditionCount / 1) * 100, 100);
    },
    completed: false,
    category: "expeditions",
  },
  // 1

  {
    id: "expedition_tier_1",
    name: "Expedition Tier 1",
    description: "Finish the 1 expedition tier.",
    condition: function (state: GameState): boolean {
      return (
        state.expeditions.filter((expedition) => expedition.tier === 1).length >
        0
      );
    },
    progress: function (state: GameState): number {
      const expeditionCount = state.expeditions.filter(
        (expedition) => expedition.tier === 1
      ).length;
      return Math.min((expeditionCount / 1) * 100, 100);
    },
    completed: false,
    category: "expeditions",
  },

  // 2
  {
    id: "expedition_tier_2",
    name: "Expedition Tier 2",
    description: "Finish the 2 expedition tier.",
    condition: function (state: GameState): boolean {
      return (
        state.expeditions.filter((expedition) => expedition.tier === 2).length >
        0
      );
    },
    progress: function (state: GameState): number {
      const expeditionCount = state.expeditions.filter(
        (expedition) => expedition.tier === 2
      ).length;
      return Math.min((expeditionCount / 1) * 100, 100);
    },
    completed: false,
    category: "expeditions",
  },

  // 3
  {
    id: "expedition_tier_3",
    name: "Expedition Tier 3",
    description: "Finish the 3 expedition tier.",
    condition: function (state: GameState): boolean {
      return (
        state.expeditions.filter((expedition) => expedition.tier === 3).length >
        0
      );
    },
    progress: function (state: GameState): number {
      const expeditionCount = state.expeditions.filter(
        (expedition) => expedition.tier === 3
      ).length;
      return Math.min((expeditionCount / 1) * 100, 100);
    },
    completed: false,
    category: "expeditions",
  },

  // 4
  {
    id: "expedition_tier_4",
    name: "Expedition Tier 4",
    description: "Finish the 4 expedition tier.",
    condition: function (state: GameState): boolean {
      return (
        state.expeditions.filter((expedition) => expedition.tier === 4).length >
        0
      );
    },
    progress: function (state: GameState): number {
      const expeditionCount = state.expeditions.filter(
        (expedition) => expedition.tier === 4
      ).length;
      return Math.min((expeditionCount / 1) * 100, 100);
    },
    completed: false,
    category: "expeditions",
  },

  // 5
  {
    id: "expedition_tier_5",
    name: "Expedition Tier 5",
    description: "Finish the 5 expedition tier.",
    condition: function (state: GameState): boolean {
      return (
        state.expeditions.filter((expedition) => expedition.tier === 5).length >
        0
      );
    },
    progress: function (state: GameState): number {
      const expeditionCount = state.expeditions.filter(
        (expedition) => expedition.tier === 5
      ).length;
      return Math.min((expeditionCount / 1) * 100, 100);
    },
    completed: false,
    category: "expeditions",
  },

  // 6
  {
    id: "expedition_tier_6",
    name: "Expedition Tier 6",
    description: "Finish the 6 expedition tier.",
    condition: function (state: GameState): boolean {
      return (
        state.expeditions.filter((expedition) => expedition.tier === 6).length >
        0
      );
    },
    progress: function (state: GameState): number {
      const expeditionCount = state.expeditions.filter(
        (expedition) => expedition.tier === 6
      ).length;
      return Math.min((expeditionCount / 1) * 100, 100);
    },
    completed: false,
    category: "expeditions",
  },

  // 7
  {
    id: "expedition_tier_7",
    name: "Expedition Tier 7",
    description: "Finish the 7 expedition tier.",
    condition: function (state: GameState): boolean {
      return (
        state.expeditions.filter((expedition) => expedition.tier === 7).length >
        0
      );
    },
    progress: function (state: GameState): number {
      const expeditionCount = state.expeditions.filter(
        (expedition) => expedition.tier === 7
      ).length;
      return Math.min((expeditionCount / 1) * 100, 100);
    },
    completed: false,
    category: "expeditions",
  },

  // 8
  {
    id: "expedition_tier_8",
    name: "Expedition Tier 8",
    description: "Finish the 8 expedition tier.",
    condition: function (state: GameState): boolean {
      return (
        state.expeditions.filter((expedition) => expedition.tier === 8).length >
        0
      );
    },
    progress: function (state: GameState): number {
      const expeditionCount = state.expeditions.filter(
        (expedition) => expedition.tier === 8
      ).length;
      return Math.min((expeditionCount / 1) * 100, 100);
    },
    completed: false,
    category: "expeditions",
  },

  // 9
  {
    id: "expedition_tier_9",
    name: "Expedition Tier 9",
    description: "Finish the 9 expedition tier.",
    condition: function (state: GameState): boolean {
      return (
        state.expeditions.filter((expedition) => expedition.tier === 9).length >
        0
      );
    },
    progress: function (state: GameState): number {
      const expeditionCount = state.expeditions.filter(
        (expedition) => expedition.tier === 9
      ).length;
      return Math.min((expeditionCount / 1) * 100, 100);
    },
    completed: false,
    category: "expeditions",
  },

  // 10
  {
    id: "expedition_tier_10",
    name: "Expedition Tier 10",
    description: "Finish the 10 expedition tier.",
    condition: function (state: GameState): boolean {
      return (
        state.expeditions.filter((expedition) => expedition.tier === 10)
          .length > 0
      );
    },
    progress: function (state: GameState): number {
      const expeditionCount = state.expeditions.filter(
        (expedition) => expedition.tier === 10
      ).length;
      return Math.min((expeditionCount / 1) * 100, 100);
    },
    completed: false,
    category: "expeditions",
  },

  {
    id: "artifacts_gravity",
    name: "Gravity Artifact",
    description:
      "Discover the secrets of gravity manipulation and unlock new possibilities.",
    condition: function (state: GameState): boolean {
      return (
        state.artifacts.filter(
          (artifact) =>
            artifact.name === "Gravity Artifact" && !artifact.isLocked
        ).length > 0
      );
    },
    progress: function (state: GameState): number {
      const artifactCount = state.artifacts.filter(
        (artifact) => artifact.name === "Gravity Artifact" && !artifact.isLocked
      ).length;
      return Math.min((artifactCount / 1) * 100, 100);
    },
    completed: false,
    category: "artifacts",
  },

  // Max artifact
  {
    id: "artifacts_gravity_max",
    name: "Gravity Artifact Max",
    description: "Max out the Gravity Artifact to unlock its full potential.",
    condition: function (state: GameState): boolean {
      return (
        state.artifacts.filter(
          (artifact) =>
            artifact.name === "Gravity Artifact" &&
            artifact.stars >= 5 &&
            !artifact.isLocked
        ).length > 0
      );
    },
    progress: function (state: GameState): number {
      const artifactCount = state.artifacts.filter(
        (artifact) =>
          artifact.name === "Gravity Artifact" &&
          artifact.stars >= 5 &&
          !artifact.isLocked
      ).length;
      return Math.min((artifactCount / 1) * 100, 100);
    },
    completed: false,
    category: "artifacts",
  },
];

// Export the tier definitions for reuse in other parts of the code
export const milestoneDefinitions = {
  metalMagnate: metalMagnateTiers,
  // Add more milestone definitions as needed
};
