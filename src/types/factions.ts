export type FactionName = "Technocrats" | "Biogenesis" | "StarUnderstanding";

export type Faction = {
  id: FactionName;
  name: string;
  loyalty: number;
  maxLoyalty: number;
  hostility: number;
};
