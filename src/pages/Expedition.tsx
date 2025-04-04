import React, { useCallback } from "react";
import {
  Globe,
  Rocket,
  Clock,
  Zap,
  Users,
  Gem,
  Skull,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useGame } from "@/context/GameContext";
import { formatNumber, formatTime } from "@/lib/utils";
import { Expedition, ExpeditionType, MissionType } from "@/store/types";
import { toast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { MobileTopNav } from "@/components/Navbar";

const expeditionTypes = [
  {
    type: "planetary",
    name: "Planetary Expeditions",
    icon: <Globe className="h-5 w-5 text-green-400" />,
    missions: [
      {
        type: "resource",
        name: "Resource Gathering",
        icon: <Gem className="h-4 w-4" />,
      },
      {
        type: "research",
        name: "Anomaly Research",
        icon: <AlertTriangle className="h-4 w-4" />,
      },
      {
        type: "combat",
        name: "Colony Defense",
        icon: <Skull className="h-4 w-4" />,
      },
    ],
  },
  {
    type: "cosmic",
    name: "Cosmic Expeditions",
    icon: <Rocket className="h-5 w-5 text-purple-400" />,
    missions: [
      {
        type: "resource",
        name: "Asteroid Mining",
        icon: <Gem className="h-4 w-4" />,
      },
      {
        type: "research",
        name: "Alien Artifacts",
        icon: <AlertTriangle className="h-4 w-4" />,
      },
      {
        type: "combat",
        name: "Pirate Defense",
        icon: <Skull className="h-4 w-4" />,
      },
    ],
  },
];

const ExpeditionStatusBadge = ({
  status,
}: {
  status: Expedition["status"];
}) => {
  const statusConfig = {
    pending: {
      color: "bg-yellow-500/20",
      text: "Pending",
      icon: <Clock className="h-4 w-4" />,
    },
    active: {
      color: "bg-blue-500/20",
      text: "In Progress",
      icon: <Clock className="h-4 w-4" />,
    },
    completed: {
      color: "bg-green-500/20",
      text: "Completed",
      icon: <CheckCircle className="h-4 w-4" />,
    },
    failed: {
      color: "bg-red-500/20",
      text: "Failed",
      icon: <XCircle className="h-4 w-4" />,
    },
  };

  return (
    <div
      className={`${statusConfig[status].color} px-3 py-1 rounded-full flex items-center gap-2 w-fit`}
    >
      {statusConfig[status].icon}
      <span className="text-sm">{statusConfig[status].text}</span>
    </div>
  );
};

const ExpeditionCard = ({ expedition }: { expedition: Expedition }) => {
  const { dispatch } = useGame();

  const handleEventChoice = (choiceIndex: number) => {
    dispatch({
      type: "HANDLE_EXPEDITION_EVENT",
      payload: { expeditionId: expedition.id, choiceIndex },
    });
  };

  return (
    <div className="glass-panel p-4 rounded-lg border border-muted/30 hover:border-primary transition-colors">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-lg flex items-center gap-2">
            {expedition.type === "planetary" ? (
              <Globe className="h-5 w-5" />
            ) : (
              <Rocket className="h-5 w-5" />
            )}
            {expedition.mission.toUpperCase()} MISSION
          </h3>
          <ExpeditionStatusBadge status={expedition.status} />
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{formatTime(expedition.timeLeft)} remaining</span>
        </div>
      </div>

      {expedition.status === "active" && (
        <div className="my-4">
          <Progress
            value={(1 - expedition.timeLeft / expedition.duration) * 100}
            className="h-2"
          />
        </div>
      )}

      {expedition.events.length > 0 && (
        <div className="mb-4 p-3 bg-background/50 rounded-lg">
          <p className="text-sm mb-3">{expedition.events[0].description}</p>
          <div className="space-y-2">
            {expedition.events[0].choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleEventChoice(index)}
                className="w-full p-2 text-left rounded-lg bg-background hover:bg-accent transition-colors"
              >
                <div className="flex justify-between items-center">
                  <span>{choice.text}</span>
                  {choice.cost && (
                    <div className="flex items-center gap-2">
                      {Object.entries(choice.cost).map(([resource, amount]) => (
                        <span
                          key={resource}
                          className="flex items-center gap-1"
                        >
                          {resource === "energy" && (
                            <Zap className="h-4 w-4 text-yellow-400" />
                          )}
                          {resource === "personnel" && (
                            <Users className="h-4 w-4 text-blue-400" />
                          )}
                          {formatNumber(amount)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-blue-400" />
          <span>{expedition.assignedPersonnel} Personnel</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-yellow-400" />
          <span>
            {formatNumber(expedition.assignedResources.energy || 0)} Energy
          </span>
        </div>
      </div>
    </div>
  );
};

const NewExpeditionPanel = ({ type }: { type: ExpeditionType }) => {
  const { state, dispatch } = useGame();
  const { resources, population } = state;

  const startExpedition = (missionType: MissionType) => {
    dispatch({
      type: "START_EXPEDITION",
      payload: { expeditionType: type, missionType },
    });
  };

  return (
    <div className="glass-panel p-4 rounded-lg border border-dashed border-muted/30">
      <h3 className="font-medium mb-4 flex items-center gap-2">
        {type === "planetary" ? (
          <Globe className="h-5 w-5" />
        ) : (
          <Rocket className="h-5 w-5" />
        )}
        {type.toUpperCase()} MISSIONS
      </h3>

      <div className="space-y-4">
        {expeditionTypes
          .find((et) => et.type === type)
          ?.missions.map((mission) => {
            const requirements =
              type === "planetary"
                ? { energy: 100, personnel: 3 }
                : { energy: 500, personnel: 10 };

            const canAfford =
              resources.energy.amount >= requirements.energy &&
              population.available >= requirements.personnel;

            return (
              <div
                key={mission.type}
                className="p-3 bg-background/50 rounded-lg"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    {mission.icon}
                    <span className="font-medium">{mission.name}</span>
                  </div>
                  <button
                    onClick={() => startExpedition(mission.type)}
                    disabled={!canAfford}
                    className={`px-4 py-2 rounded-lg ${
                      canAfford
                        ? "bg-primary hover:bg-primary/90"
                        : "bg-muted cursor-not-allowed"
                    }`}
                  >
                    Launch
                  </button>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Zap className="h-4 w-4" />
                    {formatNumber(requirements.energy)} Energy
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {requirements.personnel} Personnel
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

const ExpeditionUI = () => {
  const { state } = useGame();
  const { expeditions } = state;

  const activeExpeditions = expeditions.filter((e) => e.status === "active");
  const completedExpeditions = expeditions.filter((e) =>
    ["completed", "failed"].includes(e.status)
  );

  return (
    <>
      <MobileTopNav />
      <div className="space-y-6 p-4 animate-fade-in mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {expeditionTypes.map((type) => (
            <NewExpeditionPanel
              key={type.type}
              type={type.type as ExpeditionType}
            />
          ))}
        </div>

        {activeExpeditions.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-medium flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Active Expeditions ({activeExpeditions.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeExpeditions.map((expedition) => (
                <ExpeditionCard key={expedition.id} expedition={expedition} />
              ))}
            </div>
          </div>
        )}

        {completedExpeditions.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-medium flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Completed Expeditions ({completedExpeditions.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedExpeditions.map((expedition) => (
                <ExpeditionCard key={expedition.id} expedition={expedition} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ExpeditionUI;
