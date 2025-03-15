import React from "react";
import { useGame } from "@/context/GameContext";
import { ResourceDisplay } from "@/components/ResourceDisplay";
import { BuildingManager } from "@/components/Building/BuildingManager";
import { PlanetaryView } from "@/components/PlanetaryView";
import { GameHeader } from "@/components/GameHeader";
import { OfflineProgressModal } from "@/components/OfflineProgressModal";

const Index = () => {
  const { state, dispatch } = useGame();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90 text-foreground p-4 md:p-6 my-12">
      {state.showOfflineProgress && state.offlineReport && (
        <OfflineProgressModal
          report={state.offlineReport}
          onClose={() => dispatch({ type: "CLOSE_OFFLINE_MODAL" })}
        />
      )}
      <div className="max-w-7xl mx-auto space-y-4">
        <GameHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <ResourceDisplay />
            <BuildingManager />
          </div>

          <div className="space-y-4">
            <PlanetaryView />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
