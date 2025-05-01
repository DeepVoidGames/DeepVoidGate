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
