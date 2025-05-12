import React, { useState } from "react";
import { useGame } from "@/context/GameContext";
import { ExpeditionType, ExpeditionTypes } from "@/types/expedition";
import { expeditionEvents } from "@/data/expeditionEvents";

import { Rocket, FlaskConical, Pickaxe } from "lucide-react";
import { MobileTopNav } from "@/components/Navbar";
import {
  CREW_PER_TIER,
  isExpedtionUnlocked,
} from "@/store/reducers/expeditionReducer";

import { formatNumber } from "@/lib/utils";

import NewExpeditionPanel from "@/components/Expedition/NewExpeditionPanel";
import SummaryExpeditionPanel from "@/components/Expedition/SummaryExpeditionPanel";
import ExpeditionCard from "@/components/Expedition/ExpeditionCard";
import { getDominantFaction } from "@/store/reducers/factionsReducer";

const Expedition = () => {
  const { state, dispatch } = useGame();
  const [selectedType, setSelectedType] =
    useState<ExpeditionType>("scientific");
  const [selectedTier, setSelectedTier] = useState(0);
  const [error, setError] = useState("");
  const [showCompleted] = useState(false);

  if (!isExpedtionUnlocked(state)) return;

  const expeditionTypes: ExpeditionTypes[] = [
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
    const requiredCrew = CREW_PER_TIER + selectedTier * CREW_PER_TIER;
    if (state.population.available < requiredCrew) {
      setError(
        `Not enough crew members! Required: ${requiredCrew}. Need ${
          requiredCrew - state.population.available
        } more.`
      );
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

  // const toggleCompleted = () => {
  //   setShowCompleted(!showCompleted);
  // };

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

        <NewExpeditionPanel
          expeditionTypes={expeditionTypes}
          setSelectedType={setSelectedType}
          setSelectedTier={setSelectedTier}
          selectedType={selectedType}
          selectedTier={selectedTier}
        />

        <SummaryExpeditionPanel
          formatDuration={formatDuration}
          formatNumber={formatNumber}
          state={state}
          selectedTier={selectedTier}
          selectedType={selectedType}
          handleStartExpedition={handleStartExpedition}
          error={error}
        />

        {/* Ongoing Expeditions */}
        <div
          className={`glass-panel p-6 space-y-3 animate-fade-in bg-secondary/40 mb-24 w-full ${getDominantFaction(
            state
          )}`}
        >
          <div className="flex items-center justify-between mb-4 w-full">
            <h2 className="text-2xl font-bold">Active Missions</h2>
            {/* <button
              className="text-sm text-muted-foreground hover:text-primary"
              onClick={toggleCompleted}
            >
              {showCompleted ? "Hide Completed" : "Show Completed"}
            </button> */}
          </div>

          <div className="grid md:grid-cols-2 gap-4 w-full">
            {state.expeditions
              .filter(
                (expedition) =>
                  showCompleted ||
                  (expedition.status !== "completed" &&
                    expedition.status !== "failed")
              )
              .map((expedition) => (
                <ExpeditionCard
                  key={expedition?.id}
                  expedition={expedition}
                  formatDuration={formatDuration}
                  state={state}
                  expeditionEvents={expeditionEvents}
                  dispatch={dispatch}
                />
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
