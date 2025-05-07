import React from "react";
import { Button } from "@/components/ui/button";
import { useGame } from "@/context/GameContext";
import { Save } from "lucide-react";
import { useAuth } from "@/server/AuthContext";
import { cloudSaveGameState } from "@/server/cloudSaveGameState";

export const GameControls: React.FC = () => {
  const { dispatch, state } = useGame();
  const { session } = useAuth();

  const handleSaveGame = async () => {
    dispatch({ type: "SAVE_GAME" });

    if (!session) {
      console.warn("User not authenticated");
      return;
    }

    await cloudSaveGameState(session, state);
  };

  // const handleGameReset = () => {
  //   dispatch({ type: "RESET_GAME" });
  // };

  return (
    <div className="flex items-center space-x-2 animate-fade-in-right">
      <Button
        variant="outline"
        size="icon"
        className="glass-panel border-white/10"
        onClick={handleSaveGame}
      >
        <Save className="h-4 w-4" />
      </Button>

      {/* <Button
        variant="outline"
        size="icon"
        className="glass-panel border-white/10"
        onClick={handleGameReset}
      >
        <RotateCcw className="h-4 w-4" />
      </Button> */}
    </div>
  );
};
