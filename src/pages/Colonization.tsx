import React, { useState, useEffect } from "react";
import { Rocket, Globe, Star, CheckCircle, Zap } from "lucide-react";
import { useGame } from "@/context/GameContext";
import { formatNumber } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { getDominantFactionTheme } from "@/store/reducers/factionsReducer";

type Planet = {
  id: string;
  name: string;
  description: string;
  traits: string[];
  bonusMultiplier: number;
};

const planetPool: Planet[] = [
  {
    id: "alpha-centauri",
    name: "Alpha Centauri Bb",
    description: "Super-Earth with rare crystalline formations",
    traits: ["Rich Minerals", "Extreme Gravity"],
    bonusMultiplier: 1.5,
  },
  {
    id: "trappist-1e",
    name: "TRAPPIST-1e",
    description: "Temperate ocean world with bioluminescent life",
    traits: ["Abundant Water", "Unique Biology"],
    bonusMultiplier: 2.0,
  },
  {
    id: "kepler-438b",
    name: "Kepler-438b",
    description: "Earth-like planet with dense vegetation",
    traits: ["Habitable", "Advanced Flora"],
    bonusMultiplier: 1.8,
  },
];

const Colonization: React.FC<{
  currentProgress: number;
  maxProgress: number;
  onColonize: (bonusMultiplier: number) => void;
  galacticKnowledge: number;
}> = ({ currentProgress, maxProgress, onColonize, galacticKnowledge }) => {
  const { state } = useGame();
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [availablePlanets, setAvailablePlanets] = useState<Planet[]>([]);

  useEffect(() => {
    if (currentProgress >= maxProgress) {
      const randomPlanets = [...planetPool]
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);
      setAvailablePlanets(randomPlanets);
    }
  }, [currentProgress, maxProgress]);

  const handleColonize = () => {
    if (selectedPlanet) {
      onColonize(selectedPlanet.bonusMultiplier);
      setSelectedPlanet(null);
    }
  };

  const isColonyMaxed = currentProgress >= maxProgress;

  return (
    <div
      className={`glass-panel p-4 space-y-6 animate-fade-in mt-20 m-2 ${getDominantFactionTheme(
        state,
        { styleType: "border", opacity: 0.8 }
      )}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-foreground/90 flex items-center gap-2">
          <Globe className="h-5 w-5 text-blue-400" />
          Galactic Expansion
        </h2>
        <div className="flex items-center gap-2 px-4 py-2 bg-background/50 rounded-lg">
          <Star className="h-5 w-5 text-yellow-400" />
          <span className="text-sm">
            {formatNumber(galacticKnowledge)} Galactic Knowledge
          </span>
        </div>
      </div>

      {!isColonyMaxed ? (
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
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedPlanet?.id === planet.id
                    ? "border-primary bg-primary/10"
                    : "border-muted/30 hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">{planet.name}</h3>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="h-4 w-4" />
                    <span className="text-sm">
                      x{planet.bonusMultiplier} Bonus
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
                ? "bg-primary hover:bg-primary/90 hover:scale-[1.02]"
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
        <Star className="inline mr-1 h-4 w-4" />
        Each new colony permanently increases Galactic Knowledge gains
      </div>
    </div>
  );
};

export default Colonization;
