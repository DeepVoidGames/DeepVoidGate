import React from "react";
import { Card } from "../ui/card";
import { AlertTriangle, Book, Clock, Info, Package, Users } from "lucide-react";
import {
  calculateExpeditionDuration,
  calculateRequiredCrew,
  getBaseExpeditionReward,
  getPossibleTechnologies,
} from "@/store/reducers/expeditionReducer";
import { Tooltip, TooltipTrigger } from "../ui/tooltip";
import { IMAGE_PATH, ResourcesIcon } from "@/config";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";
import { GameState } from "@/types/gameState";
import { ExpeditionType } from "@/types/expedition";
import { ResourceType } from "@/types/resource";
import { getDominantFactionTheme } from "@/store/reducers/factionsReducer";
import { TutorialHighlight } from "@/components/Tutorial/TutorialHighlight";

type SummaryExpeditionPanelProps = {
  formatDuration: (minutes: number) => string;
  formatNumber: (num: number) => string;
  state: GameState;
  selectedTier: number;
  selectedType: ExpeditionType;
  handleStartExpedition: () => void;
  error: string;
};

function SummaryExpeditionPanel({
  formatDuration,
  formatNumber,
  state,
  selectedTier,
  selectedType,
  handleStartExpedition,
  error,
}: SummaryExpeditionPanelProps) {
  return (
    <Card
      className={`glass-panel p-4 sm:p-6 space-y-3 animate-fade-in bg-secondary/40 ${getDominantFactionTheme(
        state,
        { styleType: "border", opacity: 0.8 }
      )}`}
    >
      <div className="flex flex-col min-[849px]:flex-row items-center justify-between gap-4 sm:gap-6">
        <div className="space-y-2 w-full">
          <h3 className="text-lg sm:text-xl font-semibold">
            Expedition Summary
          </h3>
          <div className="flex flex-col min-[849px]:flex-row items-start sm:items-center gap-3 sm:gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="whitespace-nowrap">
                Duration:{" "}
                {formatDuration(
                  calculateExpeditionDuration(selectedTier, state)
                )}
              </span>
            </div>

            <TutorialHighlight
              stepId="crew-requirements"
              tutorialId="expedition-basics"
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="break-words">
                  Crew: {calculateRequiredCrew(selectedTier)} | Available{" "}
                  {state.population.available}
                </span>
              </div>
            </TutorialHighlight>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <div className="flex items-center gap-1">
                <Package className="w-4 h-4" />
                <Tooltip>
                  <TooltipTrigger className="flex items-center gap-1">
                    <span>Rewards:</span>
                    <Info className="w-3 h-3" />
                  </TooltipTrigger>
                  {/* TooltipContent remains unchanged */}
                </Tooltip>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(
                  getBaseExpeditionReward(selectedType, selectedTier)
                ).map(([resource, amount]) => (
                  <span
                    key={resource}
                    className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded"
                  >
                    <ResourcesIcon resource={resource as ResourceType} />
                    <span className="text-xs sm:text-sm">
                      {formatNumber(amount)}
                    </span>
                  </span>
                ))}
              </div>
            </div>

            {selectedType == "scientific" ? (
              <div className="flex items-center gap-2">
                <img
                  src={`${IMAGE_PATH}factions_/StarUnderstanding.png`}
                  className="w-8 h-8"
                  alt="Scientific Expedition"
                />
                <span className="text-sm text-gray-500">{"+ ?"}</span>

                <img
                  src={`${IMAGE_PATH}factions_/Biogenesis.png`}
                  className="w-7 h-7"
                  alt="Biogenesis"
                />
                <span className="text-sm text-gray-500">{"+ ?"}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <img
                  src={`${IMAGE_PATH}factions_/Technocrats.png`}
                  className="w-7 h-7"
                  alt="Technocrats"
                />
                <span className="text-sm text-gray-500">{"+ ?"}</span>
              </div>
            )}
          </div>
        </div>

        <Button
          onClick={handleStartExpedition}
          className="w-full sm:w-auto h-10 sm:h-12 px-4 sm:px-8 text-sm sm:text-lg mt-2 sm:mt-0"
          disabled={!!error}
        >
          Create Expedition
        </Button>
      </div>

      <div className="mt-4 p-3 sm:p-4 bg-muted/10 rounded-lg">
        {selectedType === "scientific" && (
          <h4 className="font-medium flex items-center gap-2 mb-2 text-sm sm:text-base">
            <Book className="w-4 h-4 text-blue-500" />
            Possible Technologies -{" "}
            <span className="text-xs sm:text-sm text-gray-400">
              Technologies can be unlocked from expedition events only
            </span>
          </h4>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Technologie */}
          {selectedType === "scientific" &&
            getPossibleTechnologies(selectedType, state.technologies).map(
              (tech) =>
                (tech?.expedtionMinTier || 0) <= selectedTier && (
                  <div
                    key={tech.id}
                    className="p-2 sm:p-3 bg-background/50 rounded-lg border text-sm"
                  >
                    <div className="font-medium text-sm sm:text-base">
                      {tech.name}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                      {tech.description}
                    </div>
                  </div>
                )
            )}
        </div>

        {selectedType === "mining" && (
          <h4 className="font-medium flex items-center gap-2 mb-2 text-sm sm:text-base">
            <Package className="w-4 h-4 text-amber-500" />
            Possible Artifacts -{" "}
            <span className="text-xs sm:text-sm text-gray-400">
              Artifacts can drop after complete of expedition
            </span>
          </h4>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
          {selectedType === "mining" &&
            state.artifacts.map(
              (artifact) =>
                artifact?.expedtionTier == selectedTier && (
                  <div
                    key={artifact.name}
                    className="flex items-center justify-center p-2 bg-background/50 rounded-lg border text-xs sm:text-sm max-w-[300px]"
                  >
                    <img
                      src={artifact.image}
                      alt={artifact.name}
                      className="w-6 h-6 mr-2"
                    />
                    <span className="font-medium text-sm sm:text-base">
                      {artifact.name}
                    </span>
                    <span className="text-xs sm:text-sm text-muted-foreground ml-1">
                      1-5 copies
                    </span>
                  </div>
                )
            )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mt-4 text-sm">
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription className="text-xs sm:text-sm">
            {error}
          </AlertDescription>
        </Alert>
      )}
    </Card>
  );
}

export default SummaryExpeditionPanel;
