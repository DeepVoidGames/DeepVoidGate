import { BuildingType, ResourceType } from "./types";

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
  | { type: "RESET_GAME" };
