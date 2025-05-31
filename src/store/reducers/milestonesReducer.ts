import { toast } from "@/components/ui/use-toast";
import { gameEvent } from "@/server/analytics";
import { BuildingType } from "@/types/building";
import { GameState } from "@/types/gameState";
import { Milestone } from "@/types/milestone";
import { ResourceType } from "@/types/resource";

/**
 * Checks which milestones can be completed and unlocks them,
 * applying the appropriate rewards. Also checks if any completed milestones
 * should be reverted if their conditions are no longer met.
 *
 * @param state - The object representing the current game state.
 * @returns Updated game state after processing milestones.
 */
export const checkMilestones = (state: GameState): GameState => {
  let newState = { ...state };

  // First pass: Find all milestones that can be completed
  const completableMilestones: Milestone[] = [];
  newState.milestones.forEach((milestone) => {
    if (
      !milestone.completed &&
      milestone.condition(newState) &&
      isPrerequisiteComplete(newState, milestone)
    ) {
      completableMilestones.push(milestone);
    }
  });

  // Second pass: Complete milestones and apply rewards
  if (completableMilestones.length > 0) {
    completableMilestones.sort((a, b) => (a.tier || 0) - (b.tier || 0));

    const updatedMilestones = [...newState.milestones];

    completableMilestones.forEach((milestone) => {
      const index = updatedMilestones.findIndex((m) => m.id === milestone.id);
      if (index !== -1) {
        updatedMilestones[index] = {
          ...updatedMilestones[index],
          completed: true,
        };

        if (milestone.reward) {
          newState = milestone.reward(newState);
        }

        const baseName = milestone.name.replace(/\s+[IVX]+$/, "");
        const tierText = milestone.tier ? ` (Tier ${milestone.tier})` : "";
        toast({
          title: `Milestone Unlocked: ${baseName}${tierText}`,
          description: milestone.description,
        });
        gameEvent("milestone_unlocked", {
          milestoneId: milestone.id,
          milestoneName: baseName,
          tier: milestone.tier,
        });
      }
    });

    newState = { ...newState, milestones: updatedMilestones };
  }

  // Third pass: Check and revoke milestones iteratively
  let revokedAny;
  do {
    revokedAny = false;
    const completedMilestones = newState.milestones.filter((m) => m.completed);
    const sortedCompleted = [...completedMilestones].sort(
      (a, b) => (a.tier || 0) - (b.tier || 0)
    );

    for (const milestone of sortedCompleted) {
      if (milestone?.onlyOneTime) continue;
      const conditionMet = milestone.condition(newState);
      const prereqMet = isPrerequisiteComplete(newState, milestone);
      if (!conditionMet || !prereqMet) {
        // Revoke the milestone
        const updatedMilestones = newState.milestones.map((m) =>
          m.id === milestone.id ? { ...m, completed: false } : m
        );
        newState = { ...newState, milestones: updatedMilestones };

        // Notification
        const baseName = milestone.name.replace(/\s+[IVX]+$/, "");
        // const tierText = milestone.tier ? ` (Tier ${milestone.tier})` : "";
        gameEvent("milestone_revoked", {
          milestoneId: milestone.id,
          milestoneName: baseName,
          tier: milestone.tier,
        });
        revokedAny = true;
        break; // Restart loop to re-check all milestones
      }
    }
  } while (revokedAny);

  return newState;
};

/**
 * Checks if the milestone has a prerequisite milestone that is completed.
 *
 * @param state - The object representing the current game state.
 * @param milestone - The milestone whose prerequisite requirement is being checked.
 * @returns `true` if the milestone has no prerequisite or if the required prerequisite milestone is completed; `false` otherwise.
 */
const isPrerequisiteComplete = (
  state: GameState,
  milestone: Milestone
): boolean => {
  if (!milestone.prerequisiteId) return true;
  const prerequisite = state.milestones.find(
    (m) => m.id === milestone.prerequisiteId
  );
  return prerequisite ? prerequisite.completed : true;
};

/**
 * Returns the number of buildings of a given type in the game.
 *
 * @param state - The object representing the current game state.
 * @param type - The building type for which the count should be calculated.
 * @returns The number of buildings of the specified type in the game state.
 */
export const getBuildingCount = (state: GameState, type: BuildingType) =>
  state.buildings.filter((b) => b.type === type).length;

/**
 * Returns the amount of a resource of the given type in the game.
 *
 * @param state - The object representing the current game state.
 * @param resource - The type of resource whose amount should be retrieved.
 * @returns The amount of the specified resource type in the game state.
 */
export const getResourceAmount = (state: GameState, resource: ResourceType) =>
  state.resources[resource].amount;

/**
 * Checks if the technology with the given ID has been researched.
 *
 * @param state - The object representing the current game state.
 * @param techId - The ID of the technology to check.
 * @returns `true` if the technology has been researched, otherwise `false`.
 */
export const isTechnologyResearched = (state: GameState, techId: string) =>
  state.technologies.some((t) => t.id === techId && t.isResearched);
