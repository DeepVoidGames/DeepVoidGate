// milestonesReducer.ts
import { GameState, ResourceType, BuildingType, Technology } from "../types";
import { toast } from "@/components/ui/use-toast";

// Check and update milestones
export const checkMilestones = (state: GameState): GameState => {
  let newState = { ...state };
  let hasNewMilestone = false;

  const updatedMilestones = newState.milestones.map((milestone) => {
    if (!milestone.completed && milestone.condition(newState)) {
      hasNewMilestone = true;

      // Apply reward if exists
      if (milestone.reward) {
        newState = milestone.reward(newState);
      }

      // Show notification
      toast({
        title: `Osiągnięcie odblokowane: ${milestone.name}`,
        description: milestone.description,
      });

      return { ...milestone, completed: true };
    }
    return milestone;
  });

  return { ...newState, milestones: updatedMilestones };
};

// Helper functions for conditions
export const getBuildingCount = (state: GameState, type: BuildingType) =>
  state.buildings.filter((b) => b.type === type).length;

export const getResourceAmount = (state: GameState, resource: ResourceType) =>
  state.resources[resource].amount;

export const isTechnologyResearched = (state: GameState, techId: string) =>
  state.technologies.some((t) => t.id === techId && t.isResearched);
