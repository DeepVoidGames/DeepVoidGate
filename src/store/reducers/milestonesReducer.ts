// milestonesReducer.ts
import {
  GameState,
  ResourceType,
  BuildingType,
  Technology,
  Milestone,
} from "../types";
import { toast } from "@/components/ui/use-toast";

// Check and update milestones with tiered support and revocation
export const checkMilestones = (state: GameState): GameState => {
  let newState = { ...state };
  let hasChanges = false;

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
    hasChanges = true;

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
        const tierText = milestone.tier ? ` (Tier ${milestone.tier})` : "";

        hasChanges = true;
        revokedAny = true;
        break; // Restart loop to re-check all milestones
      }
    }
  } while (revokedAny);

  return newState;
};

// Helper function to check prerequisites remains the same
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

// Helper functions remain unchanged
export const getBuildingCount = (state: GameState, type: BuildingType) =>
  state.buildings.filter((b) => b.type === type).length;

export const getResourceAmount = (state: GameState, resource: ResourceType) =>
  state.resources[resource].amount;

export const isTechnologyResearched = (state: GameState, techId: string) =>
  state.technologies.some((t) => t.id === techId && t.isResearched);
