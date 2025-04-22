import { stat } from "fs";
import { GameState } from "../types";

export const upgradeArtifact = (
  artifactName: string,
  state: GameState
): GameState => {
  const artifact = state.artifacts.find((a) => a.name === artifactName);

  if (!artifact || artifact.isLocked || artifact.stars >= 5) return state;

  const requiredCopies = Math.pow(2, artifact.stars);

  if (artifact.amount < requiredCopies) return state;

  return {
    ...state,
    artifacts: state.artifacts.map((a) => {
      if (a.name === artifactName) {
        return {
          ...a,
          stars: a.stars + 1,
          amount: a.amount - requiredCopies,
        };
      }
      return a;
    }),
  };
};

export const addArtifact = (
  artifactName: string,
  amount: number,
  state: GameState
): GameState => {
  const artifact = state.artifacts.find((a) => a.name === artifactName);

  if (!artifact) return state;

  return {
    ...state,
    artifacts: state.artifacts.map((a) => {
      if (a.name === artifactName) {
        return {
          ...a,
          amount: a.amount + amount,
          isLocked: false,
        };
      }
      return a;
    }),
  };
};
