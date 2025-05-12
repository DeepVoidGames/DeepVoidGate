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
import { useGame } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { isExpedtionUnlocked } from "@/store/reducers/expeditionReducer";
import { getDominantFactionTheme } from "@/store/reducers/factionsReducer";

const ArtifactsDisplay = () => {
  const { state, dispatch } = useGame();

  if (!isExpedtionUnlocked(state)) return;

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
    <div className="max-w-7xl mx-auto p-4 space-y-8 mb-20">
      <div className="text-center space-y-2 my-20">
        <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/30 blur-lg" />
            <Scan className="w-8 h-8 text-primary animate-pulse relative z-10" />
          </div>
          Ancient Relics Archive
        </h1>
      </div>

      <div
        className={`flex flex-wrap gap-3 justify-center glass-panel animate-fade-in p-2 sm:p-4 ${getDominantFactionTheme(
          state,
          { styleType: "border", opacity: 0.8 }
        )}`}
      >
        {state?.artifacts?.map((artifact) => {
          const requiredCopies = Math.pow(2, artifact.stars);
          const canUpgrade =
            !artifact.isLocked &&
            artifact.amount >= requiredCopies &&
            artifact.stars < 5;

          return (
            <Card
              key={artifact.name}
              className={`relative transition-transform w-full max-w-[320px] sm:max-w-[450px] h-[580px] sm:h-[740px] ${
                artifact.isLocked ? "opacity-60 grayscale" : ""
              }`}
            >
              {artifact.isLocked && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-30 rounded-md">
                  <Lock className="w-8 h-8 sm:w-12 sm:h-12 text-primary" />
                </div>
              )}

              <CardHeader className="pb-1 sm:pb-2">
                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between items-start">
                  <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-1">
                    <span className="text-base sm:text-lg font-medium">
                      {artifact.name}
                    </span>
                    <div className="flex gap-1">
                      {[...Array(artifact.stars)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 stroke-yellow-500"
                        />
                      ))}
                    </div>
                  </CardTitle>

                  <div className="flex items-center gap-1 px-2 py-1 bg-muted rounded-full text-xs sm:text-sm">
                    <Package className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                    <span>{artifact.amount}</span>
                  </div>
                </div>
              </CardHeader>

              <div className="flex-1 flex flex-col justify-between h-[calc(100%-100px)]">
                <CardContent className="space-y-2 sm:space-y-4">
                  <div className="rounded-lg overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20 h-[200px] sm:h-[350px] min-h-[200px] relative">
                    {artifact.image ? (
                      <img
                        src={artifact.image}
                        alt={artifact.name}
                        className="w-full h-full object-cover object-center"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground p-2 text-xs sm:text-base">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3">
                      {artifact.description}
                    </p>

                    <div className="space-y-1 sm:space-y-2">
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Next Tier</span>
                        </span>
                        <span className="text-right">
                          {artifact.stars < 5 ? (
                            <span className="text-xs sm:text-sm">
                              {requiredCopies}
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-xs">
                              MAX
                            </span>
                          )}
                        </span>
                      </div>
                      <Progress
                        value={(artifact.amount / requiredCopies) * 100}
                        className="h-1.5 sm:h-2 bg-primary/20"
                      />
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span>Tier</span>
                        <span>{artifact.stars}★</span>
                      </div>
                      <div className="space-y-1">
                        {artifact.effect?.map((effect, index) => (
                          <Alert
                            key={index}
                            variant="default"
                            className="bg-muted/20 text-muted-foreground p-2 sm:p-3"
                          >
                            <div className="flex items-start gap-1 sm:gap-2">
                              <Zap className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                              <AlertDescription className="text-xs sm:text-sm whitespace-normal">
                                {effect.description?.(artifact.stars) ||
                                  effect.value}
                              </AlertDescription>
                            </div>
                          </Alert>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-2">
                  <Button
                    variant="default"
                    className="w-full h-10 sm:h-12 rounded-lg text-xs sm:text-sm"
                    size="lg"
                    disabled={!canUpgrade}
                    onClick={() => handleUpgrade(artifact.name)}
                  >
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    {artifact.stars >= 5 ? (
                      "MAX"
                    ) : (
                      <>
                        Upgrade
                        <span className="hidden sm:inline ml-1">
                          ({requiredCopies})
                        </span>
                      </>
                    )}
                  </Button>
                </CardFooter>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ArtifactsDisplay;
