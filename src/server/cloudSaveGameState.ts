import { GameState } from "@/store/types";
import { Client, Session } from "@heroiclabs/nakama-js";
import { client } from "./AuthContext";

export async function cloudSaveGameState(
  session: Session,
  gameState: GameState
) {
  try {
    await client.writeStorageObjects(session, [
      {
        collection: "saves",
        key: "savegame",
        value: gameState,
      },
    ]);
    console.log("Game saved successfully");
  } catch (error) {
    console.error("Failed to save game:", error);
    throw error;
  }
}
