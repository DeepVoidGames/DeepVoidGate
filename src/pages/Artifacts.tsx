import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Star, Lock, Zap, Scan, Package } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Artifact } from "@/types/artifacts";
import { useGame } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const ArtifactsDisplay = () => {
  const { state, dispatch } = useGame();

  const handleUpgrade = (artifactName: string) => {
    const artifact = state.artifacts.find((a) => a.name === artifactName);
    if (!artifact) return;

    const requiredCopies = Math.pow(2, artifact.stars);
    if (artifact.amount >= requiredCopies) {
      dispatch({
        type: "UPGRADE_ARTIFACT",
        payload: { artifactName },
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      <div className="text-center space-y-2 my-20">
        <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/30 blur-lg" />
            <Scan className="w-8 h-8 text-primary animate-pulse relative z-10" />
          </div>
          Ancient Relics Archive
        </h1>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 glass-panel p-4 space-y-6 animate-fade-in">
        {state.artifacts.map((artifact) => {
          const requiredCopies = Math.pow(2, artifact.stars);
          const canUpgrade =
            !artifact.isLocked &&
            artifact.amount >= requiredCopies &&
            artifact.stars < 5;

          return (
            <Card
              key={artifact.name}
              className={`relative overflow-hidden transition-transform w-[400px] ${
                artifact.isLocked ? "opacity-60 grayscale" : ""
              }`}
            >
              {artifact.isLocked && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-30">
                  <Lock className="w-12 h-12 text-primary" />
                </div>
              )}

              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2">
                    {artifact.name}
                    <div className="flex gap-1">
                      {[...Array(artifact.stars)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-400 stroke-yellow-500"
                        />
                      ))}
                    </div>
                  </CardTitle>
                  <div className="flex items-center gap-2 px-2 py-1 bg-muted rounded-full">
                    <Package className="w-4 h-4 text-primary" />
                    <span className="text-sm">{artifact.amount} Copies</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="rounded-lg overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20 h-[350px] relative">
                  {artifact.image ? (
                    <img
                      src={artifact.image}
                      alt={artifact.name}
                      className="w-full h-full object-cover transform transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      No image available
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {artifact.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Zap className="w-4 h-4" />
                        Next Tier Requirement
                      </span>
                      <span>
                        {requiredCopies} {artifact.stars < 5 ? "Copies" : "MAX"}
                      </span>
                    </div>
                    <Progress
                      value={(artifact.amount / requiredCopies) * 100}
                      className="h-2 bg-primary/20"
                    />
                  </div>

                  <div className="grid gap-2">
                    <div className="flex justify-between text-sm">
                      <span>Current Tier</span>
                      <span>{artifact.stars}★</span>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  variant="default"
                  className="w-full"
                  size="lg"
                  disabled={!canUpgrade}
                  onClick={() => handleUpgrade(artifact.name)}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {artifact.stars >= 5 ? (
                    "Max Tier Reached"
                  ) : (
                    <>
                      Upgrade to {artifact.stars + 1}★ ({requiredCopies} Copies)
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ArtifactsDisplay;
