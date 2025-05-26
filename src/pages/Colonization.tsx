import React, { useState, useEffect } from "react";
import {
  Rocket,
  Globe,
  Star,
  CheckCircle,
  Zap,
  TrendingUp,
} from "lucide-react";
import { useGame } from "@/context/GameContext";
import { formatNumber } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { getDominantFactionTheme } from "@/store/reducers/factionsReducer";
import { Planet } from "@/types/colonization";
import { planetPool } from "@/data/planets";
import { initialBuildings } from "@/store/initialData";
import GalacticUpgrades from "@/components/GalacticUpgrades";

const Colonization = () => {
  const { state, dispatch } = useGame();
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [availablePlanets, setAvailablePlanets] = useState<Planet[]>([]);

  const [maxProgress, setMaxProgress] = useState(state.buildings.length);
  const [currentProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    if (currentProgress >= maxProgress) {
      const randomPlanets = [...planetPool]
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);
      setAvailablePlanets(randomPlanets);
    }
  }, [currentProgress, maxProgress]);

  useEffect(() => {
    setMaxProgress(initialBuildings.length);

    setCurrentProgress(
      state.buildings.reduce((acc, building) => {
        return (
          acc +
          (building.tier === building.maxTier &&
          building.upgrades >= 10 &&
          building.workerCapacity >= building.assignedWorkers
            ? 1
            : 0)
        );
      }, 0)
    );
  }, [state.buildings]);

  const handleColonize = () => {
    if (selectedPlanet) {
      dispatch({
        type: "PRESTIGE",
        payload: { selectedPlanet },
      });
      setSelectedPlanet(null);
    }
  };

  const isColonyMaxed = () => {
    return currentProgress >= maxProgress && availablePlanets.length > 0;
  };

  return (
    <div
      className={`max-w-7xl mx-auto p-4 space-y-8 mt-20  ${getDominantFactionTheme(
        state,
        { styleType: "border", opacity: 0.8 }
      )}`}
    >
      <div className="glass-panel max-w-7xl mx-auto p-4 space-y-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-foreground/90 flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-400" />
              Galactic Expansion
            </h2>
            <div className="flex items-center gap-2 px-4 py-2 bg-background/50 rounded-lg">
              <Star className="h-5 w-5 text-yellow-400" />
              <span className="text-sm">
                {formatNumber(state?.galacticKnowledge)} Galactic Knowledge
              </span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground mb-4 flex items-center">
            <Globe className="inline mr-2 h-4 w-4" />
            Colony Amount: {state.prestigeCount || 0}
          </div>
        </div>

        {!isColonyMaxed() ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Current Colony Progress
              </span>
              <span>
                {formatNumber(currentProgress)}/{formatNumber(maxProgress)}
              </span>
            </div>
            <Progress
              value={(currentProgress / maxProgress) * 100}
              className="h-3"
            />
            <div className="text-center text-sm text-muted-foreground mt-2">
              <Zap className="inline mr-2 h-4 w-4" />
              Maximize colony progress to unlock new planetary systems
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-green-900/20 border border-green-800 rounded-lg p-4 text-center">
              <CheckCircle className="h-6 w-6 text-green-400 inline-block mb-2" />
              <h3 className="font-medium mb-2">Colony Maximized!</h3>
              <p className="text-sm text-muted-foreground">
                Choose a new planet to colonize and gain Galactic Knowledge
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availablePlanets.map((planet) => (
                <div
                  key={planet.id}
                  onClick={() => setSelectedPlanet(planet)}
                  className={`group p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedPlanet?.id === planet.id
                      ? "border-primary bg-primary/10"
                      : "border-muted/30 hover:border-primary/50"
                  }`}
                >
                  <div className="relative h-40 mb-4 rounded-lg overflow-hidden">
                    <img
                      src={planet.image}
                      alt={planet.name}
                      className="w-full h-full object-contain transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <h3 className="absolute bottom-2 left-2 font-medium text-lg">
                      {planet.name}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="h-4 w-4" />
                      {formatNumber(planet.galacticKnowledge)}{" "}
                    </div>
                    <div>
                      <span className="text-sm text-green-500/80">
                        <TrendingUp className="inline h-4 w-4 mr-1" />x
                        {planet.bonusMultiplier} Resource Gain
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {planet.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {planet.traits.map((trait) => (
                      <span
                        key={trait}
                        className="px-2 py-1 bg-background/50 rounded-full text-xs"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleColonize}
              disabled={!selectedPlanet}
              className={`w-full py-3 rounded-lg transition-transform ${
                selectedPlanet
                  ? "bg-primary hover:bg-primary/90"
                  : "bg-muted cursor-not-allowed"
              }`}
            >
              <Rocket className="inline mr-2 h-5 w-5" />
              {selectedPlanet
                ? `Colonize ${selectedPlanet.name}`
                : "Select a Planet"}
            </button>
          </div>
        )}

        <div className="text-xs text-muted-foreground text-center">
          <span className=" italic">
            *<TrendingUp className="inline mr-1 h-4 w-4" /> Each new colony
            permanently increases resource gains{" "}
          </span>
        </div>
      </div>

      <GalacticUpgrades />
    </div>
  );
};

export default Colonization;
