// milestonesReducer.ts
import {
  GameState,
  ResourceType,
  BuildingType,
  Technology,
  Milestone,
} from "../types";
import { toast } from "@/components/ui/use-toast";

// Check and update milestones with tiered support
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

    // Sort by tier to ensure lower tiers are completed first
    completableMilestones.sort((a, b) => (a.tier || 0) - (b.tier || 0));

    const updatedMilestones = [...newState.milestones];

    // Apply each milestone
    completableMilestones.forEach((milestone) => {
      // Find and update the milestone in our state
      const index = updatedMilestones.findIndex((m) => m.id === milestone.id);
      if (index !== -1) {
        updatedMilestones[index] = {
          ...updatedMilestones[index],
          completed: true,
        };

        // Apply reward if exists
        if (milestone.reward) {
          newState = milestone.reward(newState);
        }

        // Extract the base name (without roman numerals) for notification
        const baseName = milestone.name.replace(/\s+[IVX]+$/, "");
        const tierText = milestone.tier ? ` (Tier ${milestone.tier})` : "";

        // Show notification
        toast({
          title: `Milestone Unlocked: ${baseName}${tierText}`,
          description: milestone.description,
        });
      }
    });

    newState = { ...newState, milestones: updatedMilestones };
  }

  return newState;
};

// Helper function to check if prerequisite milestones are completed
const isPrerequisiteComplete = (
  state: GameState,
  milestone: Milestone
): boolean => {
  if (!milestone.prerequisiteId) {
    return true; // No prerequisite needed
  }

  const prerequisite = state.milestones.find(
    (m) => m.id === milestone.prerequisiteId
  );
  return prerequisite ? prerequisite.completed : true;
};

// Helper functions for conditions
export const getBuildingCount = (state: GameState, type: BuildingType) =>
  state.buildings.filter((b) => b.type === type).length;

export const getResourceAmount = (state: GameState, resource: ResourceType) =>
  state.resources[resource].amount;

export const isTechnologyResearched = (state: GameState, techId: string) =>
  state.technologies.some((t) => t.id === techId && t.isResearched);
