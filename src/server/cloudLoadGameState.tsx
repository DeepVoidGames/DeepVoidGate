import { client } from "@/server/AuthContext";
import { GameState } from "@/types/gameState";

export const cloudLoadGameState = async (
  state: GameState,
  customId: string
) => {
  try {
    // Save new customId to localStorage
    localStorage.setItem("custom_id", customId);
    // Re-authentication with new customId
    const session = await client.authenticateCustom(customId);
    try {
      const objects = await client.listStorageObjects(
        session,
        "saves",
        session.user_id
      );
      if (objects?.objects.length === 0) {
        console.log("No storage objects found");
        return null;
      }
      console.log(objects.objects);
      // We return the content of the first object

      if (objects?.objects[0]?.value != null)
        localStorage.setItem(
          "deepvoidgate_save",
          JSON.stringify(objects?.objects[0]?.value)
        );

      return objects?.objects[0]?.value;
    } catch (error) {
      console.error("Failed to read storage:", error);
      return null;
    }

    //LOAD DATA
  } catch (error) {
    console.warn("Failed to load save:", error);
  }
};
