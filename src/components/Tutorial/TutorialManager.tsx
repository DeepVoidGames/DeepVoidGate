import React, { createContext, useContext, useReducer, useEffect } from "react";
import { getTutorialById, allTutorials } from "@/data/tutorialsData";
import { TutorialState } from "@/types/tutorials";
import { TutorialOverlay } from "@/components/Tutorial/TutorialOverlay";

interface TutorialContextType {
  state: TutorialState;
  startTutorial: (tutorialId: string) => void;
  nextStep: () => void;
  previousStep: () => void;
  closeTutorial: () => void;
  skipTutorial: () => void;
  completeTutorial: (tutorialId: string) => void;
  isAvailable: (tutorialId: string) => boolean;
}

const TutorialContext = createContext<TutorialContextType | null>(null);

type TutorialAction =
  | { type: "START_TUTORIAL"; payload: { tutorialId: string } }
  | { type: "NEXT_STEP" }
  | { type: "PREVIOUS_STEP" }
  | { type: "CLOSE_TUTORIAL" }
  | { type: "COMPLETE_TUTORIAL"; payload: { tutorialId: string } }
  | { type: "SET_POSITION"; payload: { x: number; y: number } };

const initialState: TutorialState = {
  activeTutorial: null,
  currentStep: 0,
  completedTutorials: JSON.parse(
    localStorage.getItem("completedTutorials") || "[]"
  ),
  isVisible: false,
  position: { x: 0, y: 0 },
};

const tutorialReducer = (
  state: TutorialState,
  action: TutorialAction
): TutorialState => {
  switch (action.type) {
    case "START_TUTORIAL":
      return {
        ...state,
        activeTutorial: action.payload.tutorialId,
        currentStep: 0,
        isVisible: true,
      };

    case "NEXT_STEP":
      const currentTutorial = state.activeTutorial
        ? getTutorialById(state.activeTutorial)
        : null;
      if (!currentTutorial) return state;

      if (state.currentStep >= currentTutorial.steps.length - 1) {
        // Tutorial completed
        return {
          ...state,
          activeTutorial: null,
          currentStep: 0,
          isVisible: false,
          completedTutorials: [...state.completedTutorials, currentTutorial.id],
        };
      }

      return {
        ...state,
        currentStep: state.currentStep + 1,
      };

    case "PREVIOUS_STEP":
      return {
        ...state,
        currentStep: Math.max(0, state.currentStep - 1),
      };

    case "CLOSE_TUTORIAL":
      return {
        ...state,
        activeTutorial: null,
        currentStep: 0,
        isVisible: false,
      };

    case "COMPLETE_TUTORIAL":
      return {
        ...state,
        completedTutorials: [
          ...state.completedTutorials,
          action.payload.tutorialId,
        ],
        activeTutorial: null,
        currentStep: 0,
        isVisible: false,
      };

    case "SET_POSITION":
      return {
        ...state,
        position: action.payload,
      };

    default:
      return state;
  }
};

export const TutorialProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(tutorialReducer, initialState);

  // Save completed tutorials to localStorage
  useEffect(() => {
    localStorage.setItem(
      "completedTutorials",
      JSON.stringify(state.completedTutorials)
    );
  }, [state.completedTutorials]);

  const startTutorial = (tutorialId: string) => {
    dispatch({ type: "START_TUTORIAL", payload: { tutorialId } });
  };

  const nextStep = () => {
    dispatch({ type: "NEXT_STEP" });
  };

  const previousStep = () => {
    dispatch({ type: "PREVIOUS_STEP" });
  };

  const closeTutorial = () => {
    dispatch({ type: "CLOSE_TUTORIAL" });
  };

  const skipTutorial = () => {
    if (state.activeTutorial) {
      dispatch({
        type: "COMPLETE_TUTORIAL",
        payload: { tutorialId: state.activeTutorial },
      });
    }
  };

  const completeTutorial = (tutorialId: string) => {
    dispatch({ type: "COMPLETE_TUTORIAL", payload: { tutorialId } });
  };

  const isAvailable = (tutorialId: string) => {
    const tutorial = getTutorialById(tutorialId);
    if (!tutorial) return false;

    if (!tutorial.prerequisites) return true;

    return tutorial.prerequisites.every((prereq) =>
      state.completedTutorials.includes(prereq)
    );
  };

  const currentTutorial = state.activeTutorial
    ? getTutorialById(state.activeTutorial)
    : null;

  return (
    <TutorialContext.Provider
      value={{
        state,
        startTutorial,
        nextStep,
        previousStep,
        closeTutorial,
        skipTutorial,
        completeTutorial,
        isAvailable,
      }}
    >
      {children}

      {/* Tutorial Overlay */}
      {currentTutorial && state.isVisible && (
        <TutorialOverlay
          tutorial={currentTutorial}
          currentStep={state.currentStep}
          onNext={nextStep}
          onPrevious={previousStep}
          onClose={closeTutorial}
          onSkip={skipTutorial}
          isVisible={state.isVisible}
        />
      )}
    </TutorialContext.Provider>
  );
};

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error("useTutorial must be used within a TutorialProvider");
  }
  return context;
};
