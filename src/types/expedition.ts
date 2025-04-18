import { ResourceType } from "@/store/types";

// types.ts
export type ExpeditionType = "scientific" | "mining" | string; // string dla przyszłych typów

export interface ExpeditionEvent {
  id: string;
  title: string;
  description: string;
  image?: string;
  options: ExpeditionEventOption[];
  weight?: number; // do losowania zdarzeń
  type?: ExpeditionType[]; // typy ekspedycji, w których może wystąpić
  minTier?: number; // minimalny tier ekspedycji
  maxTier?: number; // maksymalny tier ekspedycji
}

export interface ExpeditionEventOption {
  text: string;
  effects: ExpeditionEventEffect[];
  weight?: number; // dla efektów losowych
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
  duration: number; // w minutach
  elapsed: number; // czas już upłynięty
  crew: number; // liczba załogantów
  status: "preparing" | "in_progress" | "completed" | "failed";
  events: ExpeditionEventLog[]; // zdarzenia, które już wystąpiły
  nextEventTime: number; // czas do następnego zdarzenia (w minutach)
  rewards?: ResourceAmount; // nagrody za ukończenie
  unlockedTechnologies?: string[];
  rewardsCollected?: boolean; // czy nagrody zostały już odebrane
}

export interface ExpeditionEventLog {
  id?: string; // id zdarzenia, jeśli jest dostępne
  eventId: string;
  chosenOptionIndex: number;
  time: number; // czas ekspedycji, w którym wystąpiło zdarzenie
}

export interface ResourceAmount {
  [key: string]: number;
}
