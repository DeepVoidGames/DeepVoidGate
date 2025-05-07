import { Session } from "@heroiclabs/nakama-js";
import { client } from "./AuthContext";
import { GameState } from "@/types/gameState";

/**
 * Zapisuje stan gry do chmury przy użyciu Nakama storage API.
 *
 * Przesyła bieżący `gameState` do kolekcji "saves" pod kluczem "savegame".
 * W przypadku błędu zapisuje go w konsoli i ponownie wyrzuca wyjątek.
 *
 * @param session - Obiekt sesji użytkownika zalogowanego w Nakama.
 * @param gameState - Obiekt reprezentujący aktualny stan gry do zapisania.
 *
 * @throws Wyrzuca błąd, jeśli zapis do chmury się nie powiedzie.
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
