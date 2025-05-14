export type FactionName = "Technocrats" | "Biogenesis" | "StarUnderstanding";

export type Faction = {
  id: FactionName;
  name: string;
  description: string;
  loyalty: number;
  maxLoyalty: number;
  hostility: number;
  bonuses: FactionBonuses[];
};

export type FactionBonuses = {
  name: string;
  description: string;
  loyaltyReq: number;
};

export interface FactionEvent {
  id: string;
  title: string;
  description: string;
  options: FactionEventOption[];
  duration: number; // w sekundach
  activeUntil: number; // timestamp końca
}

export interface FactionEventOption {
  label: string;
  effects: FactionEffect[];
  resultText?: string;
}

export interface FactionEffect {
  type: "loyalty" | "resource" | "story" | "unlock" | "catastrophe";
  faction?: FactionName;
  value?: number;
  target?: string; // np. unlock: "some_tech_id"
}
