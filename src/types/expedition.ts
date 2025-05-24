import { ReactNode } from "react";
import { ResourceType } from "./resource";

export type ExpeditionType = "scientific" | "mining" | string;

export interface ExpeditionEvent {
  id: string;
  title: string;
  description: string;
  image?: string;
  options: ExpeditionEventOption[];
  weight?: number; 
  type?: ExpeditionType[]; 
  minTier?: number; 
  maxTier?: number; 
}

export interface ExpeditionEventOption {
  text: string;
  effects: ExpeditionEventEffect[];
  weight?: number; 
}

export interface ExpeditionEventEffect {
  type: "time" | "resources" | "crew" | "reward" | "fail" | "technology";
  value:
    | number
    | ResourceAmount
    | ((expedition: Expedition) => number | ResourceAmount);
  resourceType?: ResourceType;
  technologyId?: string;
}

export interface Expedition {
  id: string;
  type: ExpeditionType;
  tier: number;
  duration: number; 
  elapsed: number;
  crew: number; 
  status: "preparing" | "in_progress" | "completed" | "failed";
  events: ExpeditionEventLog[]; 
  nextEventTime: number;
  rewards?: ResourceAmount; 
  unlockedTechnologies?: string[];
  rewardsCollected?: boolean; 
}

export interface ExpeditionEventLog {
  id?: string; 
  eventId: string;
  chosenOptionIndex: number;
  time: number; 
}

export interface ResourceAmount {
  [key: string]: number;
}

export interface ExpeditionTypes {
  type: string;
  label: string;
  icon: ReactNode;
  color: string;
  desc: string;
}
