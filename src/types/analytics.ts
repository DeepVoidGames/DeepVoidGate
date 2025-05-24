import { GameState } from "@/types/gameState";

// types/analyticsTypes.ts
export interface AnalyticsState {
  sessionStart: number;
  totalPlaytime: number; 
  sessionLength: number;
  state: GameState;
}

export type AnalyticsAction =
  | { type: "INCREMENT_PLAYTIME"; payload: number }
  | { type: "START_SESSION" }
  | { type: "RESET_ANALYTICS" };
