import { useEffect } from "react";
import { useTutorial } from "@/components/Tutorial/TutorialManager";
import { useGame } from "@/context/GameContext";
import { useLocation } from "react-router-dom";

export const useTutorialIntegration = () => {
  const { state: gameState } = useGame();
  const { startTutorial, state: tutorialState, isAvailable } = useTutorial();
  const location = useLocation();

  // Helper function to check if tutorial should start
  const shouldStartTutorial = (tutorialId: string) => {
    return (
      isAvailable(tutorialId) &&
      !tutorialState.completedTutorials.includes(tutorialId)
    );
  };

  // Auto-start tutorials based on game state
  useEffect(() => {
    if (tutorialState.activeTutorial) return;

    // Start building basics tutorial if player has no buildings
    if (
      gameState.buildings.length === 0 &&
      shouldStartTutorial("buildings-basics")
    ) {
      startTutorial("buildings-basics");
      return;
    }

    // Start production tutorial if player has basic buildings but low resources
    if (
      gameState.buildings.length >= 1 &&
      shouldStartTutorial("worker-management")
    ) {
      startTutorial("worker-management");
      return;
    }

    if (
      location.pathname === "/tech" &&
      shouldStartTutorial("technologies-basics")
    ) {
      startTutorial("technologies-basics");
      return;
    }
  }, [
    gameState,
    tutorialState.activeTutorial,
    tutorialState.completedTutorials,
    startTutorial,
    isAvailable,
  ]);

  return {
    isInTutorial: !!tutorialState.activeTutorial,
    currentTutorial: tutorialState.activeTutorial,
  };
};
