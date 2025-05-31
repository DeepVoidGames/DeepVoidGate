import { galacticUpgrades } from "@/data/colonization/galacticUpgrades";
import { gameEvent } from "@/server/analytics";
import { Planet } from "@/types/colonization";
import { GameState } from "@/types/gameState";

export const onColonize = (state: GameState, selectedPlanet: Planet) => {
  const newTech = state.technologies.map((tech) => ({
    ...tech,
    isResearched: tech.category === "Advanced" ? tech.isResearched : false,
    researchStartTime: undefined,
  }));

  const newPrestige = (state.prestigeCount || 0) + 1;
  const newKnowledge = selectedPlanet.galacticKnowledge * newPrestige;

  gameEvent("colonized_planet", {
    planetName: selectedPlanet.name,
    prestigeCount: newPrestige,
    newKnowledge,
  });

  const updatedState = {
    ...state,
    currentPlanet: selectedPlanet,
    prestigeCount: (state.prestigeCount || 0) + 1,
    galacticKnowledge:
      selectedPlanet.galacticKnowledge * ((state?.prestigeCount ?? 0) + 1),
    buildings: [],
    population: {
      total: 10,
      available: 10,
      maxCapacity: 0,
      deathTimer: undefined,
    },
    resources: {
      oxygen: {
        ...state.resources.oxygen,
        amount: state.resources.oxygen.amount * 0.03,
      },
      water: {
        ...state.resources.water,
        amount: state.resources.water.amount * 0.03,
      },
      food: {
        ...state.resources.food,
        amount: state.resources.food.amount * 0.03,
      },
      energy: {
        ...state.resources.energy,
        amount: state.resources.energy.amount * 0.03,
      },
      metals: {
        ...state.resources.metals,
        amount: state.resources.metals.amount * 0.03,
      },
      science: {
        ...state.resources.science,
        amount: state.resources.science.amount * 0.03,
      },
    },
    technologies: newTech,
  };

  return updatedState;
};

export const onGalacticUpgradePurchase = (
  state: GameState,
  upgradeId: string
) => {
  const upgrade = galacticUpgrades.find((u) => u.id === upgradeId);

  if (state.galacticUpgrades == undefined) {
    console.warn("Galactic upgrades not initialized in state");
    state.galacticUpgrades = [];
  }

  if (!upgrade || state.galacticUpgrades.includes(upgradeId)) {
    return state; // Upgrade not found or already purchased
  }

  if (state.galacticKnowledge < upgrade.cost) {
    return state; // Not enough galactic knowledge
  }

  const updatedKnowledge = state.galacticKnowledge - upgrade.cost;
  const updatedUpgrades = [...state.galacticUpgrades, upgradeId];

  const updatedState = {
    ...state,
    galacticKnowledge: updatedKnowledge,
    galacticUpgrades: updatedUpgrades,
  };

  gameEvent("galactic_upgrade_purchased", {
    id: upgradeId,
    cost: upgrade.cost,
  });

  return updatedState;
};
