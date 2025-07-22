import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ExpeditionType, ExpeditionTypes } from "@/types/expedition";
import { useGame } from "@/context/GameContext";
import { getDominantFactionTheme } from "@/store/reducers/factionsReducer";
import { TutorialHighlight } from "@/components/Tutorial/TutorialHighlight";

type NewExpeditionPanelProps = {
  expeditionTypes: ExpeditionTypes[];
  setSelectedType: (string) => void;
  setSelectedTier: (number) => void;
  selectedType: ExpeditionType;
  selectedTier: number;
  handleVoidDiveAnimation: () => void;
};

function NewExpeditionPanel({
  expeditionTypes,
  setSelectedType,
  setSelectedTier,
  selectedType,
  selectedTier,
  handleVoidDiveAnimation,
}: NewExpeditionPanelProps) {
  const { state } = useGame();

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Expedition Type Selection */}
      <TutorialHighlight
        stepId="expedition-types"
        tutorialId="expedition-basics"
      >
        <Card
          className={`glass-panel p-6 space-y-3 animate-fade-in bg-secondary/40 ${getDominantFactionTheme(
            state,
            { styleType: "border", opacity: 0.8 }
          )}`}
        >
          <CardHeader className="p-0 pb-6">
            <CardTitle className="text-xl">1. Select Mission Type</CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            {expeditionTypes.map(
              ({ type, label, icon, color, desc, isSpecial }) => (
                <button
                  key={type}
                  onClick={
                    isSpecial
                      ? () => handleVoidDiveAnimation()
                      : () => setSelectedType(type)
                  }
                  className={`w-full p-4 rounded-xl border-2 transition-all flex items-start gap-4 relative overflow-hidden point ${
                    selectedType === type
                      ? "border-primary bg-primary/10"
                      : "border-muted hover:border-primary/30"
                  } ${
                    isSpecial
                      ? "xanimate-pulse hover:animate-none cursor-not-allowed"
                      : ""
                  }`}
                  disabled={isSpecial}
                >
                  {/* Special void effect overlay */}
                  {isSpecial && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-transparent to-pink-600/10 pointer-events-none" />
                  )}

                  <div
                    className={`p-3 rounded-lg text-background relative z-10 ${
                      isSpecial ? color : color
                    }`}
                  >
                    {icon}
                  </div>
                  <div className="text-left relative z-10">
                    <h3
                      className={`font-semibold text-lg flex items-center gap-2 ${
                        isSpecial
                          ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"
                          : ""
                      }`}
                    >
                      {label}
                      {isSpecial && (
                        <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full border border-purple-500/30 animate-pulse">
                          EXPERIMENTAL
                        </span>
                      )}
                    </h3>
                    <p
                      className={`text-sm ${
                        isSpecial ? "text-purple-200" : "text-muted-foreground"
                      }`}
                    >
                      {desc}
                    </p>
                    {isSpecial && (
                      <div className="mt-2 text-xs text-purple-300 animate-pulse">
                        ⚠️ High-risk dimensional breach required
                      </div>
                    )}
                  </div>

                  {/* Animated border for special expedition */}
                  {isSpecial && selectedType === type && (
                    <div className="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 animate-gradient-x opacity-30 pointer-events-none" />
                  )}
                </button>
              )
            )}
          </CardContent>
        </Card>
      </TutorialHighlight>

      {/* Tier Selection */}
      <TutorialHighlight
        stepId="expedition-tiers"
        tutorialId="expedition-basics"
      >
        <Card
          className={`glass-panel p-6 space-y-3 animate-fade-in bg-secondary/40 ${getDominantFactionTheme(
            state,
            { styleType: "border", opacity: 0.8 }
          )}`}
        >
          <CardHeader className="p-0 pb-6">
            <CardTitle className="text-xl">2. Select Difficulty</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-6 gap-2">
              {[...Array(13)].map((_, tier) => {
                return (
                  <button
                    key={tier}
                    onClick={() => setSelectedTier(tier)}
                    className={`aspect-square flex flex-col items-center justify-center rounded-lg border-2 transition-all relative overflow-hidden ${
                      selectedTier === tier
                        ? "border-primary bg-primary/10"
                        : "border-muted hover:border-primary/30"
                    }`}
                  >
                    <span className={`font-bold text-lg relative z-10`}>
                      {tier}
                    </span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </TutorialHighlight>
    </div>
  );
}

export default NewExpeditionPanel;
