import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  AlertTriangle,
  Book,
  CheckCircle2,
  Clock,
  FlaskConical,
  Pickaxe,
  Users,
  XCircle,
} from "lucide-react";
import { Progress } from "../ui/progress";
import { ResourcesIcon } from "@/config";
import { formatNumber } from "@/lib/utils";
import { Button } from "../ui/button";
import { Expedition, ExpeditionEvent } from "@/types/expedition";
import { GameState } from "@/types/gameState";
import { GameAction } from "@/store/actions";

type ExpeditionCardProps = {
  expedition: Expedition;
  formatDuration: (minutes: number) => string;
  state: GameState;
  expeditionEvents: ExpeditionEvent[];
  dispatch: React.Dispatch<GameAction>;
};

function ExpeditionCard({
  expedition,
  formatDuration,
  state,
  expeditionEvents,
  dispatch,
}: ExpeditionCardProps) {
  return (
    <Card
      key={expedition.id}
      className="relative bg-secondary/80 sm:bg-secondary/80 mx-2 max-w-[calc(100vw-5rem)]"
    >
      <CardHeader className="pb-2 sm:pb-4 px-3 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-base sm:text-xl">
            {expedition.type === "scientific" ? (
              <FlaskConical className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
            ) : (
              <Pickaxe className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
            )}
            <span className="capitalize">{expedition.type} Mission</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm bg-muted px-2 py-1 rounded-full">
              <Users className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              {expedition.crew}
            </span>
            <span className="text-xs sm:text-sm bg-muted px-2 py-1 rounded-full">
              Tier {expedition.tier}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6">
        {/* Progress Section */}
        <div className="space-y-0.5 w-full max-w-[95%] mx-auto">
          <div className="flex justify-between items-center text-[10px] sm:text-xs gap-1">
            <span className="flex items-center gap-0.5 truncate">
              <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
              <span className="truncate">
                {formatDuration(expedition.elapsed)}
              </span>
            </span>
            <span className="truncate">
              {formatDuration(expedition.duration)}
            </span>
          </div>
          <Progress
            value={(expedition.elapsed / expedition.duration) * 100}
            className="h-0.5 sm:h-1.5 w-full"
          />
        </div>

        {/* Nagrody */}
        {expedition.rewards && Object.keys(expedition.rewards).length > 0 && (
          <div className="p-2 sm:p-4 rounded-lg">
            <h4 className="font-medium flex items-center gap-2 mb-1 sm:mb-2 text-sm sm:text-base">
              Expected Rewards
            </h4>
            <div className="flex flex-wrap  sm:flex-wrap gap-1 sm:gap-2">
              {Object.entries(expedition.rewards).map(([resource, amount]) => (
                <div
                  key={resource}
                  className="flex items-center gap-1 px-2 py-1 rounded text-xs sm:text-sm"
                >
                  <ResourcesIcon resource={resource} />
                  <span>{formatNumber(Number(amount))}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Unlocked Technologies */}
        {expedition.unlockedTechnologies &&
          expedition.unlockedTechnologies.length > 0 && (
            <div className="p-2 sm:p-4 bg-muted/10 rounded-lg">
              <h4 className="font-medium flex items-center gap-2 mb-1 sm:mb-2 text-sm sm:text-base">
                <FlaskConical className="w-3 h-3 sm:w-4 sm:h-4" />
                Unlocked Tech
              </h4>
              <div className="flex flex-col sm:flex-wrap gap-1 sm:gap-2">
                {expedition.unlockedTechnologies.map((techId) => {
                  const tech = state.technologies.find((t) => t.id === techId);
                  return tech ? (
                    <div
                      key={techId}
                      className="flex items-center gap-1 px-2 py-1 bg-background rounded text-xs sm:text-sm"
                    >
                      <Book className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                      <span className="truncate">{tech.name}</span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          )}

        {/* Events */}
        {expedition.events
          .filter((event) => event.chosenOptionIndex === -1)
          .map((event) => {
            const eventDef = expeditionEvents.find(
              (e) => e.id === event.eventId
            );
            if (!eventDef) return null;

            return (
              <div
                key={event.id}
                className="p-2 sm:p-4 bg-muted/10 rounded-lg mb-2 sm:mb-3"
              >
                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                  <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                  <h4 className="font-medium text-sm sm:text-base">
                    {eventDef.title}
                  </h4>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-4 line-clamp-3">
                  {eventDef.description}
                </p>

                <div className="space-y-1 sm:space-y-2 max-h-[300px] overflow-y-auto">
                  {eventDef.options.map((option, optionIndex) => (
                    <Button
                      key={optionIndex}
                      variant="outline"
                      className="w-full justify-start h-auto min-h-[40px] px-2 sm:px-4 text-xs sm:text-sm text-left break-words whitespace-normal"
                      onClick={() => {
                        dispatch({
                          type: "HANDLE_EXPEDITION_EVENT",
                          payload: {
                            expeditionId: expedition.id,
                            eventIndex: expedition.events.findIndex(
                              (e) => e.id === event.id
                            ),
                            optionIndex: optionIndex,
                          },
                        });
                      }}
                    >
                      <span className="line-clamp-3 sm:line-clamp-4">
                        {option.text}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
            );
          })}
      </CardContent>

      {/* Przyciski akcji */}
      {expedition.status === "preparing" && (
        <CardFooter className="flex flex-col sm:flex-row gap-2 pt-2 sm:pt-4 px-3 sm:px-6">
          <Button
            variant="default"
            className="w-full sm:flex-1 h-9 sm:h-10 text-sm"
            onClick={() =>
              dispatch({
                type: "LAUNCH_EXPEDITION",
                payload: { expeditionId: expedition.id },
              })
            }
          >
            Launch Now
          </Button>
          <Button
            variant="destructive"
            className="w-full sm:flex-1 h-9 sm:h-10 text-sm"
            onClick={() =>
              dispatch({
                type: "CANCEL_EXPEDITION",
                payload: { expeditionId: expedition.id },
              })
            }
          >
            Cancel
          </Button>
        </CardFooter>
      )}

      {/* Status Badge */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
        {expedition.status === "completed" && (
          <div className="flex items-center gap-1 bg-green-500/90 text-green-100 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm">
            <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" /> Completed
          </div>
        )}
        {expedition.status === "failed" && (
          <div className="flex items-center gap-1 bg-red-500/20 text-red-500 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm">
            <XCircle className="w-3 h-3 sm:w-4 sm:h-4" /> Failed
          </div>
        )}
      </div>
    </Card>
  );
}

export default ExpeditionCard;
