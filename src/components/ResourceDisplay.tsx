import React from "react";
import { useGame } from "@/context/GameContext";
import { Progress } from "@/components/ui/progress";
import { formatNumber } from "@/lib/utils";
import { ResourceType } from "@/store/types";
import { Clock, AlertTriangle } from "lucide-react";

export const ResourceDisplay: React.FC = () => {
  const { state } = useGame();
  const { resources, population } = state;

  const resourceOrder: ResourceType[] = [
    "oxygen",
    "food",
    "energy",
    "metals",
    "science",
  ];

  return (
    <div className="glass-panel p-4 space-y-3 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-foreground/90">Resources</h2>

        {population.deathTimer && (
          <div className="flex items-center text-red-500 font-medium gap-1">
            <AlertTriangle className="h-4 w-4" />
            <Clock className="h-4 w-4" />
            <span>
              Colony in danger! {Math.floor(population.deathTimer)}s until death
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3">
        {resourceOrder.map((resourceKey) => {
          const resource = resources[resourceKey];
          const percentFull = Math.min(
            100,
            (resource.amount / resource.capacity) * 100
          );
          const netRate = resource.production - resource.consumption;

          // Determine critical status for coloring
          let resourceStatus = "normal";
          if (
            resourceKey === "oxygen" ||
            resourceKey === "food" ||
            resourceKey === "energy"
          ) {
            if (resource.amount <= 5) {
              resourceStatus = "critical";
            } else if (resource.amount <= 20) {
              resourceStatus = "low";
            }
          }

          return (
            <div key={resourceKey} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`resource-badge`}>{resource.icon}</span>
                  <span
                    className={`font-medium capitalize ${
                      resourceStatus === "critical"
                        ? "text-red-500"
                        : resourceStatus === "low"
                        ? "text-yellow-500"
                        : ""
                    }`}
                  >
                    {resourceKey}
                    {resourceStatus === "critical" && (
                      <AlertTriangle className="h-3 w-3 inline ml-1 text-red-500" />
                    )}
                  </span>
                </div>
                <div className="text-sm font-mono">
                  <div className="relative inline-block group">
                    <span
                      className={`cursor-pointer ${
                        netRate >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {netRate > 0 && "+"}
                      {formatNumber(netRate)}/s
                    </span>
                    {/* Tooltip with production and consumption */}
                    <div className="absolute hidden group-hover:flex flex-col gap-1 bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs p-2 rounded-md shadow-lg z-10">
                      <span className="text-green-400 whitespace-nowrap">
                        +{formatNumber(resource.production)}/s
                      </span>
                      <span className="text-red-400 whitespace-nowrap">
                        -{formatNumber(resource.consumption)}/s
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Progress
                  value={percentFull}
                  className={`progress-bar flex-grow h-2 ${
                    resourceStatus === "critical"
                      ? "bg-red-500/20"
                      : resourceStatus === "low"
                      ? "bg-yellow-500/20"
                      : `bg-${resource.color}-500/20`
                  }`}
                />
                <div className="text-xs font-mono min-w-[95px] text-right">
                  {formatNumber(resource.amount)} /{" "}
                  {formatNumber(resource.capacity)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
