import React from "react";
import { Button } from "@/components/ui/button";
import { blackHoleUpgrades } from "@/data/colonization/blackHoleUpgrades";
import { Card, CardContent } from "@/components/ui/card";
import { Atom } from "lucide-react";
import { getUpgradeCost } from "@/store/reducers/blackHoleReducer";
import { useGame } from "@/context/GameContext";
import { formatNumber } from "@/lib/utils";

const BlackHoleUpgrades = () => {
  const { state, dispatch } = useGame();

  const handleUpgrade = (upgradeId: string) => {
    dispatch({
      type: "PURCHASE_BLACK_HOLE_UPGRADE",
      payload: { upgradeId },
    });
  };

  const darkMatter = state?.blackHole?.darkMatterAmount ?? 0;

  return (
    <div className="glass-panel p-6 animate-fade-in border-purple-800/30 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-8 items-center auto-rows-fr">
      {blackHoleUpgrades.map((upgrade) => {
        const userUpgrade = state?.blackHole?.upgrades?.find(
          (u) => u.id === upgrade.id
        );
        const currentLevel = userUpgrade?.level ?? 0;
        const nextLevel = currentLevel + 1;
        const price = getUpgradeCost(nextLevel, upgrade.baseCost);
        const canAfford = darkMatter >= price;
        const isMaxed = currentLevel >= upgrade.maxLevel;

        return (
          <Card
            key={upgrade.id}
            className="border border-muted/30 bg-background/50 text-foreground/90 rounded-lg shadow-sm w-full h-full"
          >
            <CardContent className="p-4 flex flex-col justify-between h-full space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{upgrade.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold">{upgrade.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      Level {currentLevel} / {upgrade.maxLevel}
                    </p>
                  </div>
                </div>

                <p className="text-sm italic text-muted-foreground">
                  {upgrade.description}
                </p>
                <div className="text-sm font-mono text-foreground/80">
                  {upgrade.effect}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="text-sm text-muted-foreground flex gap-2 items-center">
                  Cost: {isMaxed ? "MAXED" : formatNumber(price)}
                  {!isMaxed && (
                    <span className="flex items-center gap-1 text-purple-400">
                      <Atom className="h-4 w-4" /> Dark Matter
                    </span>
                  )}
                </div>

                <Button
                  type="button"
                  onClick={() => handleUpgrade(upgrade.id)}
                  disabled={!canAfford || isMaxed}
                  className={`justify-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                    isMaxed
                      ? "bg-gray-500 cursor-not-allowed"
                      : canAfford
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-blue-400 cursor-not-allowed"
                  }`}
                >
                  {isMaxed ? "Maxed" : "Upgrade"}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default BlackHoleUpgrades;
