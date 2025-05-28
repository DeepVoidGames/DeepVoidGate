import React from "react";
import { Stars, Globe } from "lucide-react";
import { useGame } from "@/context/GameContext";
import { formatNumber } from "@/lib/utils";
import { galacticUpgrades } from "@/data/galacticUpgrades";

const GalacticUpgrades = () => {
  const { state, dispatch } = useGame();

  const handlePurchase = (upgradeId: string, cost: number) => {
    if (state.galacticKnowledge >= cost) {
      dispatch({
        type: "PURCHASE_GALACTIC_UPGRADE",
        payload: { upgradeId, cost },
      });
    }
  };

  return (
    <div className="glass-panel p-4 space-y-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-foreground/90 flex items-center gap-2">
          <Globe className="h-5 w-5 text-purple-400" />
          Ascension Nexus
        </h2>
        <div className="flex items-center gap-2 px-4 py-2 bg-background/50 rounded-lg">
          <Stars className="h-5 w-5 text-yellow-400" />
          <span className="text-sm">
            {formatNumber(state.galacticKnowledge)} Knowledge Available
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {galacticUpgrades.map((upgrade) => {
          const isPurchased = state?.galacticUpgrades?.includes(upgrade.id);
          const canAfford = state.galacticKnowledge >= upgrade.cost;

          return (
            <div
              key={upgrade.id}
              className={`p-4 rounded-lg border transition-all flex flex-col justify-between min-h-[220px] ${
                isPurchased
                  ? "border-green-500/30 bg-green-900/20"
                  : "border-muted/30 hover:border-primary/50"
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {upgrade.icon}
                    <h3 className="font-medium">{upgrade.name}</h3>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Stars className="h-4 w-4" />
                    <span className="text-sm">{upgrade.cost}</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-3">
                  {upgrade.description}
                </p>

                <div className="mb-4">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {upgrade.effect}
                  </span>
                </div>
              </div>

              <div className="mt-auto">
                <button
                  onClick={() => handlePurchase(upgrade.id, upgrade.cost)}
                  disabled={isPurchased || !canAfford}
                  className={`w-full py-2 rounded-lg transition-colors ${
                    isPurchased
                      ? "bg-green-800/50 cursor-default"
                      : canAfford
                      ? "bg-primary hover:bg-primary/90"
                      : "bg-muted cursor-not-allowed"
                  }`}
                >
                  {isPurchased
                    ? "Acquired"
                    : canAfford
                    ? "Ascend"
                    : "Insufficient Knowledge"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GalacticUpgrades;
