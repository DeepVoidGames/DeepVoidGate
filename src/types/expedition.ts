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
  nextEventId: string | null;
  weight?: number;
}

export interface ExpeditionEventEffect {
  type: "resources" | "crew" | "reward" | "fail" | "technology";
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
  status: "preparing" | "awaiting_action" | "completed" | "failed";
  currentEventId: string | null;
  eventChain: string[];
  eventHistory: ExpeditionEventLog[];
  rewards?: ResourceAmount;
  unlockedTechnologies?: string[];
  rewardsCollected?: boolean;
}

export interface ExpeditionEventLog {
  eventId: string;
  chosenOptionIndex: number;
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
  isSpecial?: boolean;
}
