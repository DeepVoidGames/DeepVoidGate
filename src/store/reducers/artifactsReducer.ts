import { stat } from "fs";
import { GameState } from "../types";
import { Artifact, ArtifactEffectType } from "@/types/artifacts";

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

export const getArtifact = (
  artifactName: string,
  state: GameState
): Artifact | undefined => {
  return state.artifacts.find((a) => a.name === artifactName);
};

export const applyArtifactEffect = (state: GameState): GameState => {
  if (!state.artifacts) return state;
  if (state.artifacts.length === 0) return state;

  state.artifacts.forEach((artifact) => {
    if (artifact.effect) {
      artifact.effect.forEach((effect) => {
        switch (effect.type) {
          case "production" as ArtifactEffectType:
            Object.values(state.resources).forEach((resource) => {
              resource.production =
                resource.production *
                (effect.value + (artifact.stars + 1) / 10);
            });
            break;
          default:
            break;
        }
      });
    }
  });

  return state;
};
