import React, { useContext, useState } from "react";
import { useGame } from "@/context/GameContext";
import { ExpeditionType } from "@/types/expedition";
import { expeditionEvents } from "@/data/expeditionEvents";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Rocket,
  FlaskConical,
  Pickaxe,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  Package,
  Book,
} from "lucide-react";
import { MobileTopNav } from "@/components/Navbar";
import {
  BASE_EXPEDITION_TIME,
  CREW_PER_TIER,
  getBaseExpeditionReward,
  getExpectedExpeditionRewards,
  getPossibleTechnologies,
  isExpedtionUnlocked,
  TIME_PER_TIER,
} from "@/store/reducers/expeditionReducer";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ResourceType } from "@/store/types";
import { formatNumber } from "@/lib/utils";
import { ResourcesIcon } from "@/config";

const Expedition = () => {
  const { state, dispatch } = useGame();
  const [selectedType, setSelectedType] =
    useState<ExpeditionType>("scientific");
  const [selectedTier, setSelectedTier] = useState(0);
  const [error, setError] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);

  if (!isExpedtionUnlocked(state)) return;

  const expeditionTypes = [
    {
      type: "scientific",
      label: "Scientific",
      icon: <FlaskConical className="w-5 h-5" />,
      color: "bg-purple-500",
      desc: "Discover new technologies and rare artifacts",
    },
    {
      type: "mining",
      label: "Mining",
      icon: <Pickaxe className="w-5 h-5" />,
      color: "bg-amber-500",
      desc: "Gather rare minerals and raw materials",
    },
  ];

  const handleStartExpedition = () => {
    const requiredCrew = CREW_PER_TIER + selectedTier * 1;
    if (state.population.available < requiredCrew) {
      setError(`Not enough crew members! Required: ${requiredCrew}`);
      return;
    }

    dispatch({
      type: "START_EXPEDITION",
      payload: { type: selectedType, tier: selectedTier },
    });
    setError("");
  };

  const formatDuration = (minutes: number) => {
    const totalSeconds = Math.floor(minutes * 60);
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(hours)}:${pad(mins)}:${pad(secs)}`;
  };

  const toggleCompleted = () => {
    setShowCompleted(!showCompleted);
  };

  return (
    <>
      <MobileTopNav />
      <div className="max-w-6xl mx-auto p-4 space-y-8 mb-24 mt-20">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
            <Rocket className="w-8 h-8 text-primary" /> Expedition Management
          </h1>
          <p className="text-muted-foreground">
            Explore new frontiers and gather valuable resources
          </p>
        </div>

        {/* New Expedition Wizard */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Expedition Type Selection */}
          <Card className="glass-panel p-6 space-y-3 animate-fade-in bg-secondary/40">
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
                      ? "border-primary bg-primary/10"
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
          <Card className="glass-panel p-6 space-y-3 animate-fade-in bg-secondary/40">
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

        {/* Summary & Launch */}
        <Card className="glass-panel p-6 space-y-3 animate-fade-in bg-secondary/40">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Expedition Summary</h3>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    Duration:{" "}
                    {formatDuration(
                      BASE_EXPEDITION_TIME + selectedTier * TIME_PER_TIER
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>
                    Crew: {CREW_PER_TIER + selectedTier * CREW_PER_TIER} |{" "}
                    Available Crew {state.population.available}{" "}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1">
                      <span>Rewards:</span>
                      <Info className="w-3 h-3" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="grid gap-2">
                        {Object.entries(
                          getBaseExpeditionReward(selectedType, selectedTier)
                        ).map(([resource, amount]) => {
                          const rewards = getExpectedExpeditionRewards(
                            selectedType,
                            selectedTier
                          );
                          return (
                            <div
                              key={resource}
                              className="flex justify-between gap-4"
                            >
                              <span className="flex items-center gap-2">
                                <ResourcesIcon
                                  resource={resource as ResourceType}
                                />
                                {resource}:
                              </span>
                              <div className="text-right">
                                <div className="text-sm text-muted-foreground">
                                  Bonus: Min{" "}
                                  {rewards.min[resource].toLocaleString()} - Max{" "}
                                  {rewards.max[resource].toLocaleString()}
                                </div>
                                <div>Base: {amount.toLocaleString()}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                  <div className="flex gap-2">
                    {Object.entries(
                      getBaseExpeditionReward(selectedType, selectedTier)
                    ).map(([resource, amount]) => (
                      <span key={resource} className="flex items-center gap-1">
                        <ResourcesIcon resource={resource as ResourceType} />
                        {formatNumber(amount)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <Button
              onClick={handleStartExpedition}
              className="h-12 px-8 text-lg"
              disabled={!!error}
            >
              Create Expedition
            </Button>
          </div>

          <div className="mt-4 p-4 bg-muted/10 rounded-lg">
            {selectedType === "scientific" ? (
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <Book className="w-4 h-4 text-blue-500" />
                Possible Technologies
              </h4>
            ) : (
              ""
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedType === "scientific"
                ? getPossibleTechnologies(selectedType, state.technologies).map(
                    (tech) =>
                      (tech?.expedtionMinTier || 0) <= selectedTier ? (
                        <div
                          key={tech.id}
                          className="p-3 bg-background/50 rounded-lg border"
                        >
                          <div className="font-medium">{tech.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {tech.description}
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {/* {Object.entries(tech.researchCost).map(
                        ([resource, amount]) => (
                          <span
                            key={resource}
                            className="text-xs flex items-center gap-1 px-2 py-1 bg-muted rounded"
                          >
                            <ResourcesIcon
                              resource={resource as ResourceType}
                            />
                            {amount}
                          </span>
                        )
                      )} */}
                          </div>
                        </div>
                      ) : null
                  )
                : ""}
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </Card>

        {/* Ongoing Expeditions */}
        <div className="glass-panel p-6 space-y-3 animate-fade-in bg-secondary/40 mb-24">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Active Missions</h2>
            <button
              className="text-sm text-muted-foreground hover:text-primary"
              onClick={toggleCompleted}
            >
              {showCompleted ? "Hide Completed" : "Show Completed"}
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {state.expeditions
              .filter(
                (expedition) =>
                  showCompleted ||
                  (expedition.status !== "completed" &&
                    expedition.status !== "failed")
              )
              .map((expedition) => (
                <Card key={expedition.id} className="relative bg-secondary/80">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        {expedition.type === "scientific" ? (
                          <FlaskConical className="w-5 h-5 text-purple-500" />
                        ) : (
                          <Pickaxe className="w-5 h-5 text-amber-500" />
                        )}
                        <span className="capitalize">
                          {expedition.type} Mission
                        </span>
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <span className="text-sm bg-muted px-2 py-1 rounded-full">
                          <Users className="inline w-4 h-4 mr-1" />
                          {expedition.crew}
                        </span>
                        <span className="text-sm bg-muted px-2 py-1 rounded-full">
                          Tier {expedition.tier}
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Progress Section */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDuration(expedition.elapsed)}
                        </span>
                        <span>{formatDuration(expedition.duration)}</span>
                      </div>
                      <Progress
                        value={(expedition.elapsed / expedition.duration) * 100}
                        className="h-2"
                      />
                    </div>

                    {/* Nagrody */}
                    {expedition.rewards &&
                      Object.keys(expedition.rewards).length > 0 && (
                        <div className="p-4 bg-muted/10 rounded-lg">
                          <h4 className="font-medium flex items-center gap-2 mb-2">
                            Expected Rewards
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(expedition.rewards).map(
                              ([resource, amount]) => (
                                <div
                                  key={resource}
                                  className="flex items-center gap-1 px-2 py-1 bg-background rounded text-sm"
                                >
                                  <ResourcesIcon resource={resource} />
                                  <span>
                                    {Number(amount)} {resource}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {expedition.unlockedTechnologies &&
                      expedition.unlockedTechnologies.length > 0 && (
                        <div className="p-4 bg-muted/10 rounded-lg">
                          <h4 className="font-medium flex items-center gap-2 mb-2">
                            <FlaskConical className="w-4 h-4" />
                            Unlocked Technologies
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {expedition.unlockedTechnologies.map((techId) => {
                              const tech = state.technologies.find(
                                (t) => t.id === techId
                              );
                              return tech ? (
                                <div
                                  key={techId}
                                  className="flex items-center gap-1 px-2 py-1 bg-background rounded text-sm"
                                >
                                  <Book className="w-4 h-4 text-blue-500" />
                                  <span>{tech.name}</span>
                                </div>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}
                    {/* Events */}
                    {expedition.events
                      .filter((event) => event.chosenOptionIndex === -1)
                      .map((event, index) => {
                        const eventDef = expeditionEvents.find(
                          (e) => e.id === event.eventId
                        );
                        if (!eventDef) return null;

                        return (
                          <div
                            key={index}
                            className="p-4 bg-muted/10 rounded-lg"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="w-4 h-4 text-yellow-500" />
                              <h4 className="font-medium">{eventDef.title}</h4>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                              {eventDef.description}
                            </p>

                            {event.chosenOptionIndex === -1 ? (
                              <div className="space-y-2">
                                {eventDef.options.map((option, optionIndex) => (
                                  <Button
                                    key={optionIndex}
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() =>
                                      dispatch({
                                        type: "HANDLE_EXPEDITION_EVENT",
                                        payload: {
                                          expeditionId: expedition.id,
                                          eventIndex: index,
                                          optionIndex: optionIndex,
                                        },
                                      })
                                    }
                                  >
                                    {option.text}
                                  </Button>
                                ))}
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-sm text-green-500">
                                <CheckCircle2 className="w-4 h-4" />
                                {eventDef.options[event.chosenOptionIndex].text}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </CardContent>

                  {/* Przyciski akcji */}
                  {expedition.status === "preparing" && (
                    <CardFooter className="flex gap-2 pt-4">
                      <Button
                        variant="default"
                        className="flex-1"
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
                        className="flex-1"
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
                  <div className="absolute top-4 right-4">
                    {expedition.status === "completed" && (
                      <div className="flex items-center gap-1 bg-green-500/90 text-green-100 px-3 py-1 rounded-full text-sm">
                        <CheckCircle2 className="w-4 h-4" /> Completed
                      </div>
                    )}
                    {expedition.status === "failed" && (
                      <div className="flex items-center gap-1 bg-red-500/20 text-red-500 px-3 py-1 rounded-full text-sm">
                        <XCircle className="w-4 h-4" /> Failed
                      </div>
                    )}
                  </div>
                </Card>
              ))}
          </div>

          {state.expeditions.length === 0 && (
            <div className="text-center py-12 space-y-4">
              <div className="text-muted-foreground">
                No active missions. Launch your first expedition to begin
                exploration!
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Expedition;
