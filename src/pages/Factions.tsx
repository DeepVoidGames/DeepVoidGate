import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Users, Cpu, Leaf, Star, Zap, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useGame } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FactionName } from "@/types/factions";
import { IMAGE_PATH } from "@/config";

const FactionsDisplay = () => {
  const { state, dispatch } = useGame();
  const { factions, selectedFaction } = state;

  const handleJoinFaction = (factionName: string) => {
    if (!selectedFaction) {
      dispatch({
        type: "SELECT_FACTION",
        payload: { faction: factionName as FactionName },
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8 mb-20">
      <div className="text-center space-y-2 my-20">
        <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/30 blur-lg" />
            <Users className="w-8 h-8 text-primary animate-pulse relative z-10" />
          </div>
          Galactic Factions
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 glass-panel animate-fade-in p-4">
        {factions.map((faction) => (
          <Card
            key={faction.name}
            className={`relative transition-all ${
              selectedFaction === faction.name
                ? "border-2 border-primary"
                : "opacity-90 hover:opacity-100"
            }`}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div
                  className={`relative w-12 h-12 rounded-lg backdrop-blur-sm border border-primary/30 p-1 hover:scale-105 active:scale-95 transform-gpu transition-all duration-200`}
                >
                  <img
                    className="w-full h-full object-cover rounded-md saturate-80 hover:saturate-100 transition-all duration-300"
                    src={`${IMAGE_PATH}factions_/${faction.id}.png`}
                  />
                </div>

                <span className="text-xl">{faction.name}</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Loyalty</span>
                  <span>{faction.loyalty}%</span>
                </div>
                <Progress
                  value={faction.loyalty}
                  className="h-2 bg-primary/20"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Hostility</span>
                  <span>{faction.hostility}%</span>
                </div>
                <Progress
                  value={faction.hostility}
                  className="h-2 bg-red-600/20"
                  className2="bg-red-600/80"
                />
              </div>

              <div className="space-y-2">
                {selectedFaction === faction.name && (
                  <Alert variant="default" className="bg-muted/20 p-3">
                    <div className="flex items-start gap-2">
                      <Zap className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                      <AlertDescription className="text-sm">
                        {faction.name === "Technocrats" &&
                          "+20% Drones Efficiency"}
                        {faction.name === "Biogenesis" &&
                          "+30% Population Capacity"}
                        {faction.name === "StarUnderstanding" &&
                          "+20% Artifact Power"}
                      </AlertDescription>
                    </div>
                  </Alert>
                )}
              </div>
            </CardContent>

            <CardFooter>
              <Button
                variant={
                  selectedFaction === faction.name ? "default" : "outline"
                }
                className="w-full"
                onClick={() => handleJoinFaction(faction.name)}
                disabled={!!selectedFaction && selectedFaction !== faction.name}
              >
                {selectedFaction === faction.name
                  ? "Active Alliance"
                  : "Join Faction"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {/* Faction Logs Section
      <div className="glass-panel p-6 space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-yellow-500" />
          Faction Relations Log
        </h2>
      </div> */}
    </div>
  );
};

export default FactionsDisplay;
