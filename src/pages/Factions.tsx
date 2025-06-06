import React, { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Zap, Eye, EyeOff, Clock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useGame } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { IMAGE_PATH } from "@/config";
import { formatNumber, formatTimeRemaining } from "@/lib/utils";
import { isExpedtionUnlocked } from "@/store/reducers/expeditionReducer";
import { getDominantFactionTheme } from "@/store/reducers/factionsReducer";
import { TutorialButton } from "@/components/Tutorial/TutorialButton";
import { TutorialHighlight } from "@/components/Tutorial/TutorialHighlight";
import { useTutorialIntegration } from "@/hooks/useTutorialIntegration";

const FactionsDisplay = () => {
  const { state } = useGame();

  if (!isExpedtionUnlocked(state)) return;

  const { factions } = state;

  const [hiddenBonuses, setHiddenBonuses] = React.useState<Set<string>>(
    new Set()
  );

  const { isInTutorial, currentTutorial } = useTutorialIntegration();

  const toggleBonuses = (factionId: string) => {
    setHiddenBonuses((prev) => {
      const next = new Set(prev);
      if (next.has(factionId)) {
        next.delete(factionId);
      } else {
        next.add(factionId);
      }
      return next;
    });
  };

  const eventTiming = useMemo(() => {
    // Check if there's an active event
    if (state.factionEvent && state.factionEvent.activeUntil > Date.now()) {
      return {
        type: "active",
        time: state.factionEvent.activeUntil,
        title: state.factionEvent.title,
      };
    }

    // If no active event, check when the next one is scheduled
    if (state.nextFactionEventAt && state.nextFactionEventAt > Date.now()) {
      return {
        type: "scheduled",
        time: state.nextFactionEventAt,
      };
    }

    return null;
  }, [state.factionEvent, state.nextFactionEventAt]);

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8 mb-20">
      <div className="text-center space-y-2 my-20">
        <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/30 blur-lg" />
            <Users className="w-8 h-8 text-primary animate-pulse relative z-10" />
          </div>
          Galactic Factions
          <TutorialButton tutorialId={"factions-basics"} />
        </h1>
      </div>
      <div
        className={`grid grid-cols-1 md:grid-cols-3 gap-6 glass-panel animate-fade-in p-4 ${getDominantFactionTheme(
          state,
          { styleType: "border", opacity: 0.8 }
        )}`}
      >
        {factions.map((faction) => (
          <Card
            key={faction.id}
            className={`relative transition-all ${"opacity-90 hover:opacity-100"}`}
          >
            <CardHeader>
              <CardTitle className="flex flex-col gap-3">
                <div>
                  <div
                    className={`relative w-12 h-12 rounded-lg backdrop-blur-sm b p-1 transform-gpu transition-all duration-200`}
                  >
                    <img
                      className="w-full h-full object-cover rounded-md saturate-80 hover:saturate-100 transition-all duration-300"
                      src={`${IMAGE_PATH}factions_/${faction.id}.png`}
                    />
                  </div>

                  <span className="text-xl">{faction.name}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {faction.description}
                </span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <TutorialHighlight
                stepId="loyalty-system"
                tutorialId="factions-basics"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Loyalty</span>
                    <span>
                      {faction.loyalty} / {faction.maxLoyalty}
                    </span>
                  </div>
                  <Progress
                    value={(faction.loyalty / faction.maxLoyalty) * 100}
                    className="h-2 bg-primary/20"
                  />
                </div>
              </TutorialHighlight>

              <TutorialHighlight
                stepId="hostility-system"
                tutorialId="factions-basics"
              >
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
              </TutorialHighlight>

              <TutorialHighlight
                stepId="faction-bonuses"
                tutorialId="factions-basics"
              >
                <div className="space-y-2">
                  <div className="w-full flex justify-between items-center">
                    <h2>Faction Bonuses</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400/80 hover:bg-transparent hover:text-gray-200 flex items-center gap-1"
                      onClick={() => toggleBonuses(faction.id)}
                    >
                      {hiddenBonuses.has(faction.id) ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                      {hiddenBonuses.has(faction.id) ? "Show" : "Hide"}
                    </Button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {!hiddenBonuses.has(faction.id) &&
                      faction.bonuses?.map((bonus) => (
                        <Alert
                          key={bonus.name}
                          variant="default"
                          className={`bg-muted/20 p-3 transition-all ${
                            faction.loyalty >= bonus.loyaltyReq
                              ? "opacity-100"
                              : "opacity-80 grayscale"
                          }`}
                        >
                          <div className="flex items-center gap-2 w-full">
                            <Zap className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <span className="font-medium text-sm text-primary">
                                  {bonus.name}
                                </span>
                              </div>
                            </div>
                          </div>
                          <AlertDescription className="text-[12px] text-gray-400/80 mt-1">
                            {bonus.description}
                          </AlertDescription>

                          <div className="flex items-center justify-end w-full p-2">
                            <span className="text-xs px-2 py-1 bg-muted rounded-full">
                              Loyalty {formatNumber(bonus.loyaltyReq)}+ required
                            </span>
                          </div>
                        </Alert>
                      ))}
                  </div>
                </div>
              </TutorialHighlight>
            </CardContent>
          </Card>
        ))}

        {/* Next event timing indicator */}
        {eventTiming && (
          <div className="text-xs text-gray-400 gap-1 flex items-center">
            <Clock className="w-3 h-3" />
            <span>
              Next faction event: {formatTimeRemaining(eventTiming.time)}
            </span>
          </div>
        )}
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
