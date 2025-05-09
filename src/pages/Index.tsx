import React from "react";
import { useGame } from "@/context/GameContext";
import { ResourceDisplay } from "@/components/ResourceDisplay";
import { BuildingManager } from "@/components/Building/BuildingManager";
import { PlanetaryView } from "@/components/PlanetaryView";
import { GameHeader } from "@/components/GameHeader";
import { OfflineProgressModal } from "@/components/OfflineProgressModal";
import { getSettings } from "./Settings";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileTopNav } from "@/components/Navbar";

const Index = () => {
  const { state, dispatch } = useGame();

  const settings = getSettings();
  const isMobile = useIsMobile();

  return (
    <>
      <MobileTopNav />
      <div
        className={`min-h-screen bg-gradient-to-b from-background to-background/90 text-foreground p-4 md:p-6 my-12 ${
          settings?.compactUIOptions?.doubleNavbar ? "mt-[130px]" : ""
        }`}
      >
        {state.showOfflineProgress && state.offlineReport && (
          <OfflineProgressModal
            report={state.offlineReport}
            onClose={() => dispatch({ type: "CLOSE_OFFLINE_MODAL" })}
          />
        )}
        <div className="max-w-7xl mx-auto space-y-4">
          <GameHeader />

          <div className={`grid grid-cols-1 lg:grid-cols-3 gap-4 `}>
            <div className={`lg:col-span-2 space-y-4 `}>
              {!settings?.compactUI ||
              !settings?.compactUIOptions?.compactResourcesView ||
              isMobile ? (
                <ResourceDisplay />
              ) : null}

              <BuildingManager />
            </div>

            <div className="space-y-4">
              {settings?.compactUI &&
              settings?.compactUIOptions?.compactResourcesView &&
              !isMobile ? (
                <div className="sticky top-20 z-10">
                  <ResourceDisplay />
                </div>
              ) : null}
              {settings?.compactUI &&
                !settings?.compactUIOptions?.showPlanetaryView && (
                  <PlanetaryView />
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
