// factionsHelpers.ts
import { GameState, ResourceType } from "../types";
import { generateId } from "../initialData";
import { FactionName } from "@/types/factions";

export const initialFactions = [
  {
    id: "Technocrats" as FactionName,
    name: "Technocrat Syndicate",
    loyalty: 0,
    hostility: 0,
  },
  {
    id: "Biogenesis" as FactionName,
    name: "Biogenesis Coalition",
    loyalty: 0,
    hostility: 0,
  },
  {
    id: "StarUnderstanding" as FactionName,
    name: "Order of Stellar Understanding",
    loyalty: 0,
    hostility: 0,
  },
];

export const handleFactionSelection = (
  state: GameState,
  faction: FactionName
): GameState => {
  return {
    ...state,
    selectedFaction: faction,
    factions: state.factions.map((f) => {
      if (f.name === faction) return { ...f, loyalty: 25 };
      return { ...f, hostility: 50 };
    }),
  };
};

export const updateFactionLoyalty = (
  state: GameState,
  faction: FactionName,
  amount: number
): GameState => {
  return {
    ...state,
    factions: state.factions.map((f) => {
      if (f.id === faction) {
        return {
          ...f,
          loyalty: Math.min(Math.max(f.loyalty + amount, 0), 100),
        };
      }
      return f;
    }),
  };
};

export const applyFactionBonuses = (state: GameState): GameState => {
  if (!state.selectedFaction) return state;

  const faction = state.factions.find((f) => f.name === state.selectedFaction)!;
  let newState = { ...state };

  switch (faction.id) {
    case "Technocrats":
      break;
    case "Biogenesis":
      break;
    case "StarUnderstanding":
      break;
  }

  return newState;
};
