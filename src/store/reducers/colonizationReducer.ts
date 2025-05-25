import { Planet } from "@/types/colonization";
import { GameState } from "@/types/gameState";

export const onColonize = (state: GameState, selectedPlanet: Planet) => {
  const updatedState = {
    ...state,
    currentPlanet: selectedPlanet,
    prestigeCount: (state.prestigeCount || 0) + 1,
    galacticKnowledge: selectedPlanet.galacticKnowledge,
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
    technologies: state.technologies.map((tech) => ({
      ...tech,
      isResearched: tech.category === "Advanced" ? tech.isResearched : false,
      researchStartTime: undefined,
    })),
  };

  return updatedState;
};
