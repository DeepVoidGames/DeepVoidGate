import { BuildingType } from "@/types/building";
import { Planet } from "@/types/colonization";
import { ExpeditionType } from "@/types/expedition";
import { FactionEventOption, FactionName } from "@/types/factions";

export type GameAction =
  | { type: "TICK"; payload: { currentTime: number } }
  | { type: "CONSTRUCT_BUILDING"; payload: { buildingType: BuildingType } }
  | { type: "UPGRADE_BUILDING"; payload: { buildingId: string } }
  | { type: "ASSIGN_WORKER"; payload: { buildingId: string; count: number } }
  | { type: "RESEARCH_TECHNOLOGY"; payload: { techId: string } }
  | { type: "CHECK_RESEARCH_PROGRESS" }
  | { type: "SAVE_GAME" }
  | { type: "LOAD_GAME" }
  | { type: "CLOSE_OFFLINE_MODAL" }
  | { type: "RESET_GAME" }
  | {
      type: "START_EXPEDITION";
      payload: { type: ExpeditionType; tier: number };
    }
  | { type: "LAUNCH_EXPEDITION"; payload: { expeditionId: string } }
  | {
      type: "HANDLE_EXPEDITION_EVENT";
      payload: {
        expeditionId: string;
        eventIndex: number;
        optionIndex: number;
      };
    }
  | { type: "CANCEL_EXPEDITION"; payload: { expeditionId: string } }
  | { type: "UPGRADE_ARTIFACT"; payload: { artifactName: string } }
  | { type: "UPGRAGE_BUILDING_MAX"; payload: { buildingId: string } }
  | { type: "SELECT_FACTION"; payload: { faction: FactionName } }
  | {
      type: "UPDATE_LOYALTY";
      payload: { faction: FactionName; amount: number };
    }
  | { type: "FACTION_EVENT_CHOICE"; payload: { option: FactionEventOption } }
  | { type: "PRESTIGE"; payload: { selectedPlanet: Planet } }
  | {
      type: "PURCHASE_GALACTIC_UPGRADE";
      payload: { upgradeId: string; cost: number };
    }
  | {
      type: "CONVERT_MASS_TO_DARK_MATTER";
    };

//
