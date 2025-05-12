import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ExpeditionType, ExpeditionTypes } from "@/types/expedition";
import { useGame } from "@/context/GameContext";
import { getDominantFactionTheme } from "@/store/reducers/factionsReducer";

type NewExpeditionPanelProps = {
  expeditionTypes: ExpeditionTypes[];
  setSelectedType: (string) => void;
  setSelectedTier: (number) => void;
  selectedType: ExpeditionType;
  selectedTier: number;
};

function NewExpeditionPanel({
  expeditionTypes,
  setSelectedType,
  setSelectedTier,
  selectedType,
  selectedTier,
}: NewExpeditionPanelProps) {
  const { state } = useGame();

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Expedition Type Selection */}
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
          {expeditionTypes.map(({ type, label, icon, color, desc }) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`w-full p-4 rounded-xl border-2 transition-all flex items-start gap-4 ${
                selectedType === type
                  ? `${getDominantFactionTheme(state, {
                      styleType: "background",
                    })}`
                  : "border-muted hover:border-primary/30"
              }`}
            >
              <div className={`p-3 rounded-lg ${color} text-background`}>
                {icon}
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">{label}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Tier Selection */}
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
            {[...Array(11)].map((_, tier) => {
              return (
                <button
                  key={tier}
                  onClick={() => setSelectedTier(tier)}
                  className={`aspect-square flex flex-col items-center justify-center rounded-lg border-2 transition-all ${
                    selectedTier === tier
                      ? "border-primary bg-primary/10"
                      : "border-muted hover:border-primary/30"
                  }`}
                >
                  <span className="font-bold text-lg">{tier}</span>
                  {/* <span className="text-xs text-muted-foreground">
                        {requiredCrew} <Users className="inline w-3 h-3" />
                      </span> */}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default NewExpeditionPanel;
