import React from "react";
import { useGame } from "@/context/GameContext";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Zap, AlertTriangle, Lock, BookOpen } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { DialogTitle } from "@radix-ui/react-dialog";
import { IMAGE_PATH, ResourcesIcon } from "@/config";

const FactionEventModal = () => {
  const { state, dispatch } = useGame();
  const event = state.factionEvent;

  if (!event) return null;

  const handleOptionClick = (option) => {
    dispatch({ type: "FACTION_EVENT_CHOICE", payload: { option } });
  };

  return (
    <Dialog open>
      <DialogContent
        className="max-w-xl space-y-4 glass-panel"
        aria-describedby={undefined}
      >
        <DialogTitle></DialogTitle>
        <div className="space-y-1 min-[800px]:space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="min-[800px]:text-2xl font-bold">{event.title}</h2>
            <div className="flex space-x-2">
              {extractFactions(event).map((faction: string) => (
                <div key={faction} className="relative group">
                  <img
                    src={`${IMAGE_PATH}factions_/${faction}.png`}
                    alt={faction}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {faction}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <span className="text-gray-400 text-xs min-[800px]:text-sm">
            {event.description}
          </span>
        </div>

        <div className="space-y-1 min-[800px]:space-y-4 min-[800px]:mt-4 min-[1280px]:max-h-[600px] max-h-[400px] overflow-y-auto">
          {event.options.map((option, idx) => (
            <div
              key={idx}
              className="p-2 min-[800px]:p-4 bg-muted/10 rounded-lg hover:bg-muted/20 transition-all border border-muted/30"
            >
              <p className="text-sm text-gray-200 mb-1 min-[800px]:mb-3 font-medium">
                {option.label}
              </p>
              <div className="space-y-1 min-[800px]:space-y-2">
                {option.effects.map((effect, i) => (
                  <div
                    key={i}
                    className="text-xs text-gray-400 flex items-center gap-1 min-[800px]:gap-2"
                  >
                    {getEffectIcon(effect)}
                    {renderEffect(effect)}
                  </div>
                ))}
              </div>
              <Button
                className="mt-4 w-full bg-background/50 hover:bg-primary/40"
                size="sm"
                onClick={() => handleOptionClick(option)}
              >
                Choose
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Extract all unique factions mentioned in the event
const extractFactions = (event) => {
  const factions = new Set();

  event.options.forEach((option) => {
    option.effects.forEach((effect) => {
      if (effect.type === "loyalty" && effect.faction) {
        factions.add(effect.faction);
      }
    });
  });

  return Array.from(factions);
};

// Get appropriate icon for each effect type
const getEffectIcon = (effect) => {
  switch (effect.type) {
    case "loyalty":
      return (
        <img
          className="w-4 h-4"
          src={`${IMAGE_PATH}factions_/${effect.faction}.png`}
          alt={effect.target}
        />
      );
    case "resource":
      return ResourcesIcon({ resource: effect.target });
    case "catastrophe":
      return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    case "unlock":
      return <Lock className="w-4 h-4 text-blue-500" />;
    case "story":
      return <BookOpen className="w-4 h-4 text-purple-500" />;
    default:
      return <Zap className="w-4 h-4 text-primary" />;
  }
};

// Util: effect description renderer
const renderEffect = (effect) => {
  switch (effect.type) {
    case "loyalty":
      return (
        <span>
          <span
            className={effect.value > 0 ? "text-green-400" : "text-red-400"}
          >
            {effect.value > 0 ? "+" : ""}
            {formatNumber(effect.value)}
          </span>{" "}
          loyalty for{" "}
          <span
            className={`font-medium 
              ${effect.faction == "Technocrats" && "text-blue-600"} 
              ${effect.faction == "Biogenesis" && "text-green-600"} 
              ${effect.faction == "StarUnderstanding" && "text-purple-600"}
              `}
          >
            {effect.faction}
          </span>
        </span>
      );
    case "resource":
      return (
        <span>
          <span
            className={effect.value > 0 ? "text-green-400" : "text-red-400"}
          >
            {effect.value > 0
              ? `+${formatNumber(effect.value)}`
              : formatNumber(effect.value)}
          </span>{" "}
          {effect.target}
        </span>
      );
    case "catastrophe":
      return (
        <span className="text-amber-400">Risk of catastrophe increased</span>
      );
    case "unlock":
      return <span className="text-blue-400">Unlock: {effect.unlockId}</span>;
    case "story":
      return <span className="text-purple-400">Story branch changed</span>;
    default:
      return null;
  }
};

export default FactionEventModal;
