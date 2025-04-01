// src/data/milestonesData.ts
import { Milestone, GameState } from "@/store/types";

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
  // {
  //   tier: 4,
  //   target: 1000000,
  //   rewardAmount: 50000,
  //   description: "Collect 1,000,000 metal",
  // },
];

const oxygenTiers: TierDefinition[] = [
  {
    tier: 1,
    target: 10000,
    rewardAmount: 1000,
    description: "Collect 10,000 oxygen",
  },
  // {
  //   tier: 2,
  //   target: 50000,
  //   rewardAmount: 5000,
  //   description: "Collect 50,000 oxygen",
  // },
  // {
  //   tier: 3,
  //   target: 100000,
  //   rewardAmount: 10000,
  //   description: "Collect 100,000 oxygen",
  // },
  // {
  //   tier: 4,
  //   target: 1000000,
  //   rewardAmount: 50000,
  //   description: "Collect 1,000,000 oxygen",
  // },
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
  // {
  //   tier: 2,
  //   target: 50000,
  //   rewardAmount: 5000,
  //   description: "Collect 50,000 food",
  // },
  // {
  //   tier: 3,
  //   target: 100000,
  //   rewardAmount: 10000,
  //   description: "Collect 100,000 food",
  // },
  // {
  //   tier: 4,
  //   target: 1000000,
  //   rewardAmount: 50000,
  //   description: "Collect 1,000,000 food",
  // },
];

const energyTiers: TierDefinition[] = [
  {
    tier: 1,
    target: 10000,
    rewardAmount: 1000,
    description: "Generate 10,000 energy",
  },
  // {
  //   tier: 2,
  //   target: 50000,
  //   rewardAmount: 5000,
  //   description: "Generate 50,000 energy",
  // },
  // {
  //   tier: 3,
  //   target: 100000,
  //   rewardAmount: 10000,
  //   description: "Generate 100,000 energy",
  // },
  // {
  //   tier: 4,
  //   target: 1000000,
  //   rewardAmount: 50000,
  //   description: "Generate 1,000,000 energy",
  // },
];

const scienceTiers: TierDefinition[] = [
  {
    tier: 1,
    target: 10000,
    rewardAmount: 1000,
    description: "Research 10,000 science",
  },
  // {
  //   tier: 2,
  //   target: 50000,
  //   rewardAmount: 5000,
  //   description: "Research 50,000 science",
  // },
  // {
  //   tier: 3,
  //   target: 100000,
  //   rewardAmount: 10000,
  //   description: "Research 100,000 science",
  // },
  // {
  //   tier: 4,
  //   target: 1000000,
  //   rewardAmount: 50000,
  //   description: "Research 1,000,000 science",
  // },
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
];

// Export the tier definitions for reuse in other parts of the code
export const milestoneDefinitions = {
  metalMagnate: metalMagnateTiers,
  // Add more milestone definitions as needed
};
