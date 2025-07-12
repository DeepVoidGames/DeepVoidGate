import React from "react";
import { Users } from "lucide-react";
import { useGame } from "@/context/GameContext";
import { GameControls } from "./GameControls";
import { getDominantFactionTheme } from "@/store/reducers/factionsReducer";

export const GameHeader: React.FC = () => {
  const { state } = useGame();
  const { population, colonistProgress } = state;
  return (
    <header
      className={`glass-panel p-4 flex items-center justify-between animate-fade-in ${getDominantFactionTheme(
        state,
        {
          styleType: "border",
          opacity: 0.1,
        }
      )}`}
    >
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
            DeepvoidGate
          </span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Colony &quot;新大陸&quot; Space Management
        </p>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center space-x-2 text-sm">
          <Users className="h-4 w-4 text-blue-400" />
          <span className="text-muted-foreground">
            Population:{" "}
            <span className="text-foreground font-medium ">
              {population.total}
            </span>{" "}
          </span>

          {60 - colonistProgress != 60 ? (
            <span className="text-muted-foreground">
              New Colonists in: {(60 - colonistProgress).toFixed(0)}s
            </span>
          ) : null}
        </div>

        <GameControls />
      </div>
    </header>
  );
};
