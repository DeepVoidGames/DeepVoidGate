import React from "react";
import { Button } from "@/components/ui/button";
import { useGame } from "@/context/GameContext";
import { Save, RotateCcw } from "lucide-react";

export const GameControls: React.FC = () => {
  const { dispatch } = useGame();

  const handleSaveGame = () => {
    dispatch({ type: "SAVE_GAME" });
  };

  const handleGameReset = () => {
    dispatch({ type: "RESET_GAME" });
  };

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

      <Button
        variant="outline"
        size="icon"
        className="glass-panel border-white/10"
        onClick={handleGameReset}
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  );
};
