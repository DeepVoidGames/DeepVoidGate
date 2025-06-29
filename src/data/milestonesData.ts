import { initialBuildings } from "@/store/initialData";
import { GameState } from "@/types/gameState";
import { Milestone } from "@/types/milestone";
import { TechnologyCategory } from "@/types/technology";
import { blackHoleUpgrades } from "@/data/colonization/blackHoleUpgrades";

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
    onlyOneTime: true,
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
  {
    tier: 6,
    target: 50000000,
    rewardAmount: 1000000,
    description: "Collect 50,000,000 metal",
  },
  {
    tier: 7,
    target: 100000000,
    rewardAmount: 10000000,
    description: "Collect 100,000,000 metal",
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
  {
    tier: 6,
    target: 50000000,
    rewardAmount: 1000000,
    description: "Collect 50,000,000 oxygen",
  },
  {
    tier: 7,
    target: 100000000,
    rewardAmount: 1000000,
    description: "Collect 100,000,000 oxygen",
  },
];

const waterTiers: TierDefinition[] = [
  {
    tier: 1,
    target: 10000,
    rewardAmount: 1000,
    description: "Collect 10,000 water",
  },
  {
    tier: 2,
    target: 50000,
    rewardAmount: 5000,
    description: "Collect 50,000 water",
  },
  {
    tier: 3,
    target: 100000,
    rewardAmount: 10000,
    description: "Collect 100,000 water",
  },
  {
    tier: 4,
    target: 1000000,
    rewardAmount: 50000,
    description: "Collect 1,000,000 water",
  },
  {
    tier: 5,
    target: 10000000,
    rewardAmount: 500000,
    description: "Collect 10,000,000 water",
  },
  {
    tier: 6,
    target: 50000000,
    rewardAmount: 1000000,
    description: "Collect 50,000,000 water",
  },
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
  {
    tier: 6,
    target: 50000000,
    rewardAmount: 1000000,
    description: "Collect 50,000,000 food",
  },
  {
    tier: 7,
    target: 100000000,
    rewardAmount: 10000000,
    description: "Collect 100,000,000 food",
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
  {
    tier: 6,
    target: 50000000,
    rewardAmount: 1000000,
    description: "Collect 50,000,000 energy",
  },
  {
    tier: 7,
    target: 100000000,
    rewardAmount: 10000000,
    description: "Collect 100,000,000 energy",
  },
  {
    tier: 8,
    target: 500000000,
    rewardAmount: 50000000,
    description: "Collect 500,000,000 energy",
  },
  {
    tier: 9,
    target: 1000000000,
    rewardAmount: 50000000,
    description: "Collect 1,000,000,000 energy",
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
  {
    tier: 6,
    target: 50000000,
    rewardAmount: 1000000,
    description: "Collect 50,000,000 science",
  },
  {
    tier: 7,
    target: 100000000,
    rewardAmount: 10000000,
    description: "Collect 100,000,000 science",
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
    id: "population_bustling_city",
    name: "Bustling City",
    description:
      "With hundreds of inhabitants, the colony now thrives like a small city, full of energy and opportunity.",
    condition: function (state: GameState): boolean {
      return state.population.total >= 500;
    },
    progress: function (state: GameState): number {
      return Math.min((state.population.total / 500) * 100, 100);
    },
    completed: false,
    category: "population",
  },
  {
    id: "population_metropolis",
    name: "Emerging Metropolis",
    description:
      "The population boom has transformed the colony into a true metropolis, a shining beacon of civilization.",
    condition: function (state: GameState): boolean {
      return state.population.total >= 1000;
    },
    progress: function (state: GameState): number {
      return Math.min((state.population.total / 1000) * 100, 100);
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
      const maxCount = initialBuildings.filter(
        (building) => building.tag === "oxygen"
      ).length;

      const count = state.buildings.filter(
        (building) => building.tag === "oxygen" && building.upgrades >= 1
      ).length;

      return count >= maxCount;
    },
    progress: function (state: GameState): number {
      const maxCount = initialBuildings.filter(
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
      const maxCount = initialBuildings.filter(
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
      const maxCount = initialBuildings.filter(
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
      const maxCount = initialBuildings.filter(
        (building) => building.tag === "food"
      ).length;

      const count = state.buildings.filter(
        (building) => building.tag === "food" && building.upgrades >= 1
      ).length;

      return count >= maxCount;
    },
    progress: function (state: GameState): number {
      const maxCount = initialBuildings.filter(
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
      const maxCount = initialBuildings.filter(
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
      const maxCount = initialBuildings.filter(
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
      const maxCount = initialBuildings.filter(
        (building) => building.tag === "energy"
      ).length;

      const count = state.buildings.filter(
        (building) => building.tag === "energy" && building.upgrades >= 1
      ).length;

      return count >= maxCount;
    },

    progress: function (state: GameState): number {
      const maxCount = initialBuildings.filter(
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
      const maxCount = initialBuildings.filter(
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
      const maxCount = initialBuildings.filter(
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
      const maxCount = initialBuildings.filter(
        (building) => building.tag === "metals"
      ).length;

      const count = state.buildings.filter(
        (building) => building.tag === "metals" && building.upgrades >= 1
      ).length;

      return count >= maxCount;
    },
    progress: function (state: GameState): number {
      const maxCount = initialBuildings.filter(
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
      const maxCount = initialBuildings.filter(
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
      const maxCount = initialBuildings.filter(
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
      const maxCount = initialBuildings.filter(
        (building) => building.tag === "science"
      ).length;

      const count = state.buildings.filter(
        (building) => building.tag === "science" && building.upgrades >= 1
      ).length;

      return count >= maxCount;
    },
    progress: function (state: GameState): number {
      const maxCount = initialBuildings.filter(
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
      const maxCount = initialBuildings.filter(
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
      const maxCount = initialBuildings.filter(
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
          technology.category === ("Infrastructure" as TechnologyCategory)
      );

      const count = state.technologies.filter(
        (technology) =>
          technology.category === ("Infrastructure" as TechnologyCategory) &&
          technology.isResearched
      ).length;

      return count >= maxCount.length;
    },
    progress: function (state: GameState): number {
      const maxCount = state.technologies.filter(
        (technology) =>
          technology.category === ("Infrastructure" as TechnologyCategory)
      );

      const count = state.technologies.filter(
        (technology) =>
          technology.category === ("Infrastructure" as TechnologyCategory) &&
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
        (technology) => technology.category === ("Energy" as TechnologyCategory)
      );

      const count = state.technologies.filter(
        (technology) =>
          technology.category === ("Energy" as TechnologyCategory) &&
          technology.isResearched
      ).length;

      return count >= maxCount.length;
    },
    progress: function (state: GameState): number {
      const maxCount = state.technologies.filter(
        (technology) => technology.category === ("Energy" as TechnologyCategory)
      );

      const count = state.technologies.filter(
        (technology) =>
          technology.category === ("Energy" as TechnologyCategory) &&
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
          technology.category === ("Production" as TechnologyCategory)
      );

      const count = state.technologies.filter(
        (technology) =>
          technology.category === ("Production" as TechnologyCategory) &&
          technology.isResearched
      ).length;

      return count >= maxCount.length;
    },
    progress: function (state: GameState): number {
      const maxCount = state.technologies.filter(
        (technology) =>
          technology.category === ("Production" as TechnologyCategory)
      );

      const count = state.technologies.filter(
        (technology) =>
          technology.category === ("Production" as TechnologyCategory) &&
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
          technology.category === ("Research" as TechnologyCategory)
      );

      const count = state.technologies.filter(
        (technology) =>
          technology.category === ("Research" as TechnologyCategory) &&
          technology.isResearched
      ).length;

      return count >= maxCount.length;
    },
    progress: function (state: GameState): number {
      const maxCount = state.technologies.filter(
        (technology) =>
          technology.category === ("Research" as TechnologyCategory)
      );

      const count = state.technologies.filter(
        (technology) =>
          technology.category === ("Research" as TechnologyCategory) &&
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
          technology.category === ("Advanced" as TechnologyCategory)
      );

      const count = state.technologies.filter(
        (technology) =>
          technology.category === ("Advanced" as TechnologyCategory) &&
          technology.isResearched
      ).length;

      return count >= maxCount.length;
    },
    progress: function (state: GameState): number {
      const maxCount = state.technologies.filter(
        (technology) =>
          technology.category === ("Advanced" as TechnologyCategory)
      );

      const count = state.technologies.filter(
        (technology) =>
          technology.category === ("Advanced" as TechnologyCategory) &&
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
        state.expeditions.filter(
          (expedition) =>
            expedition.tier === 0 && expedition.status === "completed"
        ).length > 0
      );
    },
    progress: function (state: GameState): number {
      const expeditionCount = state.expeditions.filter(
        (expedition) =>
          expedition.tier === 0 && expedition.status === "completed"
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
        state.expeditions.filter(
          (expedition) =>
            expedition.tier === 1 && expedition.status === "completed"
        ).length > 0
      );
    },
    progress: function (state: GameState): number {
      const expeditionCount = state.expeditions.filter(
        (expedition) =>
          expedition.tier === 1 && expedition.status === "completed"
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
        state.expeditions.filter(
          (expedition) =>
            expedition.tier === 2 && expedition.status === "completed"
        ).length > 0
      );
    },
    progress: function (state: GameState): number {
      const expeditionCount = state.expeditions.filter(
        (expedition) =>
          expedition.tier === 2 && expedition.status === "completed"
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
        state.expeditions.filter(
          (expedition) =>
            expedition.tier === 3 && expedition.status === "completed"
        ).length > 0
      );
    },
    progress: function (state: GameState): number {
      const expeditionCount = state.expeditions.filter(
        (expedition) =>
          expedition.tier === 3 && expedition.status === "completed"
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
        state.expeditions.filter(
          (expedition) =>
            expedition.tier === 4 && expedition.status === "completed"
        ).length > 0
      );
    },
    progress: function (state: GameState): number {
      const expeditionCount = state.expeditions.filter(
        (expedition) =>
          expedition.tier === 4 && expedition.status === "completed"
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
        state.expeditions.filter(
          (expedition) =>
            expedition.tier === 5 && expedition.status === "completed"
        ).length > 0
      );
    },
    progress: function (state: GameState): number {
      const expeditionCount = state.expeditions.filter(
        (expedition) =>
          expedition.tier === 5 && expedition.status === "completed"
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
        state.expeditions.filter(
          (expedition) =>
            expedition.tier === 6 && expedition.status === "completed"
        ).length > 0
      );
    },
    progress: function (state: GameState): number {
      const expeditionCount = state.expeditions.filter(
        (expedition) =>
          expedition.tier === 6 && expedition.status === "completed"
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
        state.expeditions.filter(
          (expedition) =>
            expedition.tier === 7 && expedition.status === "completed"
        ).length > 0
      );
    },
    progress: function (state: GameState): number {
      const expeditionCount = state.expeditions.filter(
        (expedition) =>
          expedition.tier === 7 && expedition.status === "completed"
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
        state.expeditions.filter(
          (expedition) =>
            expedition.tier === 8 && expedition.status === "completed"
        ).length > 0
      );
    },
    progress: function (state: GameState): number {
      const expeditionCount = state.expeditions.filter(
        (expedition) =>
          expedition.tier === 8 && expedition.status === "completed"
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
        state.expeditions.filter(
          (expedition) =>
            expedition.tier === 9 && expedition.status === "completed"
        ).length > 0
      );
    },
    progress: function (state: GameState): number {
      const expeditionCount = state.expeditions.filter(
        (expedition) =>
          expedition.tier === 9 && expedition.status === "completed"
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
        state.expeditions.filter(
          (expedition) =>
            expedition.tier === 10 && expedition.status === "completed"
        ).length > 0
      );
    },
    progress: function (state: GameState): number {
      const expeditionCount = state.expeditions.filter(
        (expedition) =>
          expedition.tier === 10 && expedition.status === "completed"
      ).length;
      return Math.min((expeditionCount / 1) * 100, 100);
    },
    completed: false,
    category: "expeditions",
  },

  //artifacts_gravity
  {
    id: "artifacts_gravity",
    name: "Gravity Artifact",
    description:
      "Discover the secrets of gravity manipulation and unlock new possibilities.",
    condition: function (state: GameState): boolean {
      return (
        state?.artifacts?.filter(
          (artifact) =>
            artifact.name === "Gravity Artifact" && !artifact.isLocked
        ).length > 0
      );
    },
    progress: function (state: GameState): number {
      const artifactCount = state?.artifacts?.filter(
        (artifact) => artifact.name === "Gravity Artifact" && !artifact.isLocked
      ).length;
      return Math.min((artifactCount / 1) * 100, 100);
    },
    completed: false,
    category: "artifacts",
  },

  // artifacts_gravity_max
  {
    id: "artifacts_gravity_max",
    name: "Gravity Artifact Max",
    description: "Max out the Gravity Artifact to unlock its full potential.",
    condition: function (state: GameState): boolean {
      return (
        state?.artifacts?.filter(
          (artifact) =>
            artifact.name === "Gravity Artifact" &&
            artifact.stars >= 5 &&
            !artifact.isLocked
        ).length > 0
      );
    },
    progress: function (state: GameState): number {
      const artifactCount = state?.artifacts?.filter(
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

  // artifacts_quantum_cube
  {
    id: "artifacts_quantum_cube",
    name: "Quantum Cube",
    description:
      "Harness the enigmatic power of quantum fluctuations and bend reality to your will.",
    condition: function (state: GameState): boolean {
      return (
        state?.artifacts?.filter(
          (artifact) => artifact.name === "Quantum Cube" && !artifact.isLocked
        ).length > 0
      );
    },
    progress: function (state: GameState): number {
      const artifactCount = state?.artifacts?.filter(
        (artifact) => artifact.name === "Quantum Cube" && !artifact.isLocked
      ).length;
      return Math.min((artifactCount / 1) * 100, 100);
    },
    completed: false,
    category: "artifacts",
  },

  // artifacts_quantum_cube_max
  {
    id: "artifacts_quantum_cube_max",
    name: "Quantum Cube Max",
    description: "Max out the Quantum Cube to unlock its full potential.",
    condition: function (state: GameState): boolean {
      return (
        state?.artifacts?.filter(
          (artifact) =>
            artifact.name === "Quantum Cube" &&
            artifact.stars >= 5 &&
            !artifact.isLocked
        ).length > 0
      );
    },
    progress: function (state: GameState): number {
      const artifactCount = state?.artifacts?.filter(
        (artifact) =>
          artifact.name === "Quantum Cube" &&
          artifact.stars >= 5 &&
          !artifact.isLocked
      ).length;
      return Math.min((artifactCount / 1) * 100, 100);
    },
    completed: false,
    category: "artifacts",
  },

  // artifacts_Time_crystal
  {
    id: "artifacts_Time_crystal",
    name: "Time Crystal",
    description:
      "Unlock the paradox of frozen time—where every moment bends to your command",
    condition: function (state: GameState): boolean {
      return (
        state?.artifacts?.filter(
          (artifact) => artifact.name === "Time Crystal" && !artifact.isLocked
        ).length > 0
      );
    },
    progress: function (state: GameState): number {
      const artifactCount = state?.artifacts?.filter(
        (artifact) => artifact.name === "Time Crystal" && !artifact.isLocked
      ).length;
      return Math.min((artifactCount / 1) * 100, 100);
    },
    completed: false,
    category: "artifacts",
  },

  // artifacts_Time_crystal_max
  {
    id: "artifacts_Time_crystal_max",
    name: "Time Crystal Max",
    description: "Max out the Time Crystal to unlock its full potential.",
    condition: function (state: GameState): boolean {
      return (
        state?.artifacts?.filter(
          (artifact) =>
            artifact.name === "Time Crystal" &&
            artifact.stars >= 5 &&
            !artifact.isLocked
        ).length > 0
      );
    },
    progress: function (state: GameState): number {
      const artifactCount = state?.artifacts?.filter(
        (artifact) =>
          artifact.name === "Time Crystal" &&
          artifact.stars >= 5 &&
          !artifact.isLocked
      ).length;
      return Math.min((artifactCount / 1) * 100, 100);
    },
    completed: false,
    category: "artifacts",
  },

  {
    id: "ascension_nexus_upgrade_1",
    name: "Void Storage",
    description: "Unlock Void Storage ascension nexus upgrade",
    condition: function (state: GameState): boolean {
      return state?.galacticUpgrades?.includes("void_storage");
    },
    progress: function (state: GameState): number {
      return state?.galacticUpgrades?.includes("void_storage") ? 100 : 0;
    },
    completed: false,
    category: "colonization",
  },

  {
    id: "ascension_nexus_upgrade_2",
    name: "Quantum Production",
    description: "Unlock Quantum Production ascension nexus upgrade",
    condition: function (state: GameState): boolean {
      return state?.galacticUpgrades?.includes("quantum_production");
    },
    progress: function (state: GameState): number {
      return state?.galacticUpgrades?.includes("quantum_production") ? 100 : 0;
    },
    completed: false,
    category: "colonization",
  },

  {
    id: "ascension_nexus_upgrade_3",
    name: "Quantum time collapse",
    description: "Unlock Quantum time collapse ascension nexus upgrade",
    condition: function (state: GameState): boolean {
      return state?.galacticUpgrades?.includes("quantum_travel");
    },
    progress: function (state: GameState): number {
      return state?.galacticUpgrades?.includes("quantum_travel") ? 100 : 0;
    },
    completed: false,
    category: "colonization",
  },

  {
    id: "ascension_nexus_upgrade_4",
    name: "Quantum disproportion",
    description: "Unlock Quantum disproportion ascension nexus upgrade",
    condition: function (state: GameState): boolean {
      return state?.galacticUpgrades?.includes("quantum_disproportion");
    },
    progress: function (state: GameState): number {
      return state?.galacticUpgrades?.includes("quantum_disproportion")
        ? 100
        : 0;
    },
    completed: false,
    category: "colonization",
  },

  {
    id: "ascension_nexus_upgrade_5",
    name: "Black Hole",
    description: "Unlock Black Hole ascension nexus upgrade",
    condition: function (state: GameState): boolean {
      return state?.galacticUpgrades?.includes("black_hole_unknow");
    },
    progress: function (state: GameState): number {
      return state?.galacticUpgrades?.includes("black_hole_unknow") ? 100 : 0;
    },
    completed: false,
    category: "colonization",
  },

  {
    id: "black_hole_upgrade_1",
    name: "Gravitational Amplifier Upgrade",
    description: "Max Black hole Gravitational Amplifier Upgrade",
    condition: function (state: GameState): boolean {
      return state?.blackHole?.upgrades?.find((u) => u.id == "mass_capacity")
        ?.level >=
        blackHoleUpgrades.find((u) => u.id == "mass_capacity").maxLevel
        ? true
        : false;
    },
    progress: function (state: GameState): number {
      return Math.min(
        (state?.blackHole?.upgrades?.find((u) => u.id == "mass_capacity")
          ?.level /
          blackHoleUpgrades.find((u) => u.id == "mass_capacity").maxLevel) *
          100,
        100
      );
    },
    completed: false,
    category: "black_hole",
  },

  {
    id: "black_hole_upgrade_2",
    name: "Hawking Accelerator Upgrade",
    description: "Max Black hole Hawking Accelerator Upgrade",
    condition: function (state: GameState): boolean {
      return state?.blackHole?.upgrades?.find((u) => u.id == "growth_rate")
        ?.level >= blackHoleUpgrades.find((u) => u.id == "growth_rate").maxLevel
        ? true
        : false;
    },
    progress: function (state: GameState): number {
      return Math.min(
        (state?.blackHole?.upgrades?.find((u) => u.id == "growth_rate")?.level /
          blackHoleUpgrades.find((u) => u.id == "growth_rate").maxLevel) *
          100,
        100
      );
    },
    completed: false,
    category: "black_hole",
  },

  {
    id: "black_hole_upgrade_3",
    name: "Dark Matter Synthesizer Upgrade",
    description: "Max Black hole Dark Matter Synthesizer Upgrade",
    condition: function (state: GameState): boolean {
      return state?.blackHole?.upgrades?.find((u) => u.id == "dark_matter_gen")
        ?.level >=
        blackHoleUpgrades.find((u) => u.id == "dark_matter_gen").maxLevel
        ? true
        : false;
    },
    progress: function (state: GameState): number {
      return Math.min(
        (state?.blackHole?.upgrades?.find((u) => u.id == "dark_matter_gen")
          ?.level /
          blackHoleUpgrades.find((u) => u.id == "dark_matter_gen").maxLevel) *
          100,
        100
      );
    },
    completed: false,
    category: "black_hole",
  },

  {
    id: "black_hole_upgrade_4",
    name: "Quantum Battery Upgrade",
    description: "Max Black hole Quantum Battery Upgrade",
    condition: function (state: GameState): boolean {
      return state?.blackHole?.upgrades?.find((u) => u.id == "energy_capacity")
        ?.level >=
        blackHoleUpgrades.find((u) => u.id == "energy_capacity").maxLevel
        ? true
        : false;
    },
    progress: function (state: GameState): number {
      return Math.min(
        (state?.blackHole?.upgrades?.find((u) => u.id == "energy_capacity")
          ?.level /
          blackHoleUpgrades.find((u) => u.id == "energy_capacity").maxLevel) *
          100,
        100
      );
    },
    completed: false,
    category: "black_hole",
  },
];

// Export the tier definitions for reuse in other parts of the code
export const milestoneDefinitions = {
  metalMagnate: metalMagnateTiers,
  // Add more milestone definitions as needed
};
