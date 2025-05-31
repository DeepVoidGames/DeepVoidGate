import { gameEvent } from "@/server/analytics";
import { Artifact, ArtifactEffectType } from "@/types/artifacts";
import { GameState } from "@/types/gameState";

/**
 * Upgrades the player's artifact by increasing its star level if certain conditions are met.
 *
 * Upgrade conditions:
 * - The artifact must exist.
 * - It must not be locked (`isLocked` must be `false`).
 * - It must not have the maximum number of stars (maximum is 5).
 * - The player must have a sufficient number of copies of the artifact (required amount is 2^current_star_level).
 *
 * @param artifactName - The name of the artifact to upgrade.
 * @param state - The current game state, containing artifact information.
 * @returns The updated game state with the upgraded artifact, or unchanged if the conditions were not met.
 */
export const upgradeArtifactIfPossible = (
  artifactName: string,
  state: GameState
): GameState => {
  const artifact = state.artifacts.find((a) => a.name === artifactName);

  if (!artifact || artifact.isLocked || artifact.stars >= 5) return state;

  const requiredCopies = Math.pow(2, artifact.stars);

  if (artifact.amount < requiredCopies) return state;

  const newStars = artifact.stars + 1;

  gameEvent("artifact_upgraded", {
    name: artifact.name,
    fromStars: artifact.stars,
    toStars: newStars,
    copiesUsed: requiredCopies,
  });

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

/**
 * Adds a specified number of copies of an existing artifact to the player's state.
 *
 * - If the artifact does not exist in the player's collection, the game state remains unchanged.
 * - If the artifact exists, its `amount` is increased by the given value.
 * - The artifact is also unlocked (`isLocked` is set to `false`).
 *
 * @param artifactName - The name of the artifact to which copies should be added.
 * @param amount - The number of copies to add (can be negative if intentional).
 * @param state - The current game state.
 * @returns The updated game state with the added artifact copies, or the original state if the artifact does not exist.
 */
export const addArtifactCopies = (
  artifactName: string,
  amount: number,
  state: GameState
): GameState => {
  const artifact = state.artifacts.find((a) => a.name === artifactName);

  if (!artifact) return state;

  const newAmount = artifact.amount + amount;
  gameEvent("artifact_copies_added", {
    name: artifact.name,
    amount,
    newTotal: newAmount,
  });

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

/**
 * Returns the artifact with the given name from the current game state.
 *
 * - If an artifact with the specified name exists, it is returned.
 * - If it does not exist, `undefined` is returned.
 *
 * @param artifactName - The name of the artifact to find.
 * @param state - The current game state containing the list of artifacts.
 * @returns The artifact with the given name, or `undefined` if not found.
 */
export const getArtifact = (
  artifactName: string,
  state: GameState
): Artifact | undefined => {
  return state.artifacts.find((a) => a.name === artifactName);
};

/**
 * Applies the effects of active artifacts to the game state, modifying resource production and capacity.
 *
 * - The function iterates over all artifacts that have assigned effects (`effect`).
 * - Each effect can increase resource `production` or `capacity`.
 * - Effects are applied only if the artifact is not locked (`isLocked === false`).
 * - The effect's strength scales with the artifact's star level (`(stars + 1) / 10`).
 *
 * @param state - The current game state, containing artifacts and resources.
 * @returns The updated game state with artifact effects applied.
 */
export const applyArtifactEffect = (state: GameState): GameState => {
  if (!state.artifacts) return state;
  if (state.artifacts.length === 0) return state;

  state.artifacts.forEach((artifact) => {
    if (artifact.effect) {
      artifact.effect.forEach((effect) => {
        switch (effect.type) {
          case "production" as ArtifactEffectType:
            if (artifact.isLocked) return;
            Object.values(state.resources).forEach((resource) => {
              let bonus = effect.value + (artifact.stars + 1) / 10;
              if (
                state?.factions[0]?.loyalty >=
                state?.factions[0]?.bonuses[1]?.loyaltyReq
              )
                bonus += 0.25;
              resource.production = resource.production * bonus;
            });
            break;
          case "capacity" as ArtifactEffectType:
            if (artifact.isLocked) return;

            Object.values(state.resources).forEach((resource) => {
              resource.capacity +=
                resource.capacity * (effect.value + (artifact.stars + 1) / 10);
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

/**
 * Returns a list of artifacts assigned to a specific expedition tier.
 *
 * - Searches the player's artifact collection and filters them based on the expedition tier (`expeditionTier`).
 *
 * @param state - The current game state containing artifacts.
 * @param tier - The expedition tier for which artifacts should be returned.
 * @returns An array of artifacts belonging to the specified expedition tier.
 */
export const getArtifactsByExpeditionTier = (
  state: GameState,
  tier: number
): Artifact[] => {
  return state.artifacts.filter((artifact) => artifact.expedtionTier === tier);
};
