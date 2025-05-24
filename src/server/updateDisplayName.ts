import { Session } from "@heroiclabs/nakama-js";
import { client } from "./AuthContext"; // Twój klient Nakama

/**
 * Updates the user's Display Name in Nakama.
 * @param session - current user session
 * @param displayName - new display name
 */
export async function updateDisplayName(session: Session, displayName: string) {
  if (!session) throw new Error("User not authenticated");

  try {
    const updatedAccount = await client.updateAccount(session, {
      username: displayName,
    });
    return updatedAccount;
  } catch (error) {
    console.error("Failed to update display name:", error);
    throw error;
  }
}
