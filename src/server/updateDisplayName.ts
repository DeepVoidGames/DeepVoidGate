import { Session } from "@heroiclabs/nakama-js";
import { client } from "./AuthContext"; // Twój klient Nakama

/**
 * Aktualizuje Display Name użytkownika w Nakama.
 * @param session - aktualna sesja użytkownika
 * @param displayName - nowa nazwa wyświetlana
 */
export async function updateDisplayName(session: Session, displayName: string) {
  if (!session) throw new Error("User not authenticated");

  try {
    const updatedAccount = await client.updateAccount(session, {
      display_name: displayName,
    });
    return updatedAccount;
  } catch (error) {
    console.error("Failed to update display name:", error);
    throw error;
  }
}
