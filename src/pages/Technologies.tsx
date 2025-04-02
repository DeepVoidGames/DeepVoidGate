import React from "react";
import { GameProvider } from "@/context/GameContext";
import { ResourceDisplay } from "@/components/ResourceDisplay";
import { PlanetaryView } from "@/components/PlanetaryView";
import { GameHeader } from "@/components/GameHeader";
import TechnologiesManager from "@/components/Technologies/TechnologiesManager";
import { getSettings } from "@/pages/Settings";
import { MobileTopNav } from "@/components/Navbar";

const Index = () => {
  const settings = getSettings();

  return (
    <>
      <MobileTopNav />
      <div
        className={`min-h-screen bg-gradient-to-b from-background to-background/90 text-foreground p-4 md:p-6 my-12 ${
          settings?.compactUIOptions?.doubleNavbar ? "mt-[130px]" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto space-y-4">
          <GameHeader />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              <TechnologiesManager />
            </div>

            <div className="space-y-4">
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
