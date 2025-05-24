import { Session } from "@heroiclabs/nakama-js";
import { client } from "./AuthContext";
import { GameState } from "@/types/gameState";

/**
 * Saves the game state to the cloud using the Nakama storage API.
 *
 * Uploads the current `gameState` to the "saves" collection under the key "savegame".
 * In case of an error, it logs the error to the console and rethrows the exception.
 *
 * @param session - The user session object logged into Nakama.
 * @param gameState - The object representing the current game state to be saved.
 *
 * @throws Throws an error if the cloud save operation fails.
 */
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
