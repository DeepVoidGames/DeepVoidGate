import { useEffect } from "react";
import { useTutorial } from "../components/Tutorial/TutorialManager";
import { useGame } from "../context/GameContext";

export const useTutorialIntegration = () => {
  const { state: gameState } = useGame();
  const { startTutorial, state: tutorialState, isAvailable } = useTutorial();

  // Auto-start tutorials based on game state
  useEffect(() => {
    if (tutorialState.activeTutorial) return;

    // // Start building basics tutorial if player has no buildings
    // if (gameState.buildings.length === 0 && isAvailable("buildings-basics")) {
    //   startTutorial("buildings-basics");
    //   return;
    // }

    // // Start production tutorial if player has basic buildings but low resources
    // if (
    //   gameState.buildings.length > 2 &&
    //   gameState.resources.oxygen.amount < 100 &&
    //   isAvailable("production-buildings")
    // ) {
    //   startTutorial("production-buildings");
    //   return;
    // }

    // // Start worker management tutorial if population is growing
    // if (
    //   gameState.population.total > 5 &&
    //   gameState.population.available > 3 &&
    //   isAvailable("worker-management")
    // ) {
    //   startTutorial("worker-management");
    //   return;
    // }
  }, [gameState, tutorialState.activeTutorial, startTutorial, isAvailable]);

  return {
    isInTutorial: !!tutorialState.activeTutorial,
    currentTutorial: tutorialState.activeTutorial,
  };
};
