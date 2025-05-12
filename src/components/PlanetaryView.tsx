import React, { memo } from "react";
import { useGame } from "@/context/GameContext";
import { IMAGE_PATH } from "@/config";
import { getDominantFactionTheme } from "@/store/reducers/factionsReducer";

export const PlanetaryView: React.FC = memo(() => {
  const { state } = useGame();

  return (
    <div
      className={`glass-panel p-4 relative animate-fade-in ${getDominantFactionTheme(
        state,
        {
          styleType: "border",
          opacity: 0.8,
        }
      )}`}
    >
      <h2 className="text-lg font-medium text-foreground/90 mb-2">
        Planetary View
      </h2>

      <div className="flex items-center justify-center">
        <div className="relative">
          <img src={`${IMAGE_PATH}planet.gif`} />
        </div>
      </div>

      <div className="text-center mt-4 text-sm text-muted-foreground">
        Colony: 新大陸 • Buildings: {state.buildings.length} • Population:{" "}
        {state.population.total}
      </div>
    </div>
  );
});

PlanetaryView.displayName = "PlanetaryView";
