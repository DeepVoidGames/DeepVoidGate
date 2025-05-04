import { ResourceType } from "@/types/resource";
import { BuildingType } from "@/types/building";
import { GameState } from "@/types/gameState";

export type MilestoneProgressConfig = {
  type: "resource" | "count" | "technology" | "tier";
  resource?: ResourceType;
  target?: number;
  buildingType?: BuildingType;
  techId?: string;
};

export type Milestone = {
  id: string;
  name: string;
  description: string;
  condition: (state: GameState) => boolean;
  progress: (state: GameState) => number; // Nowe pole
  reward?: (state: GameState) => GameState;
  completed: boolean;
  category: string;
  rewardDescription?: string;
  tier?: number;
  prerequisiteId?: string;
  onlyOneTime?: boolean;
};
