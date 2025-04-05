import { ExpeditionType, MissionType, ResourceType } from "@/store/types";

export interface ExpeditionConfig {
  type: ExpeditionType;
  name: string;
  icon: string;
  description: string;
  unlockRequirement?: {
    technology?: string;
    milestoneId?: string;
    resourceAmount?: Record<ResourceType, number>;
  };
  baseStats: {
    duration: number; // in seconds
    successChance: number;
    baseRewardMultiplier: number;
  };
  missions: MissionConfig[];
}

export interface MissionConfig {
  type: MissionType;
  name: string;
  icon: string;
  description: string;
  imageUrl?: string;
  requirements: {
    resources: Partial<Record<ResourceType, number>>;
    personnel: number;
    equipment?: Record<string, number>;
    technology?: string[];
  };
  rewards: {
    guaranteed: Partial<Record<ResourceType, number>>;
    random: Array<{
      resource: ResourceType;
      min: number;
      max: number;
      chance: number; // 0-100%
    }>;
    rareTechnology?: Array<{
      id: string;
      chance: number; // 0-100%
    }>;
    equipment?: Array<{
      id: string;
      chance: number; // 0-100%
    }>;
  };
  eventChance: number; // Chance of an event occurring during the expedition (0-100%)
  eventPool: string[]; // IDs of potential events that can occur during this mission
}
