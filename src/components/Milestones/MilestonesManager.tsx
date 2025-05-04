import React, { useMemo, useState } from "react";
import {
  Trophy,
  Medal,
  Star,
  Zap,
  Search,
  CheckCircle,
  Factory,
  User,
  Microscope,
  FlaskConical,
} from "lucide-react";
import { useGame } from "@/context/GameContext";
import { Progress } from "@/components/ui/progress";
import { Milestone } from "@/types/milestone";

const milestoneCategories = [
  {
    id: "resources",
    name: "Resources",
    icon: <Zap className="h-4 w-4 text-yellow-400" />,
  },
  {
    id: "buildings",
    name: "Buildings",
    icon: <Factory className="h-4 w-4 text-blue-400" />,
  },
  {
    id: "population",
    name: "Population",
    icon: <User className="h-4 w-4 text-green-400" />,
  },
  {
    id: "technology",
    name: "Technology",
    icon: <Microscope className="h-4 w-4 text-purple-400" />,
  },
  {
    id: "expeditions",
    name: "Expeditions",
    icon: <FlaskConical className="h-4 w-4 text-orange-400" />,
  },
  {
    id: "artifacts",
    name: "Artifacts",
    icon: <Trophy className="h-4 w-4 text-pink-400" />,
  },
];

const groupMilestonesByBase = (milestones) => {
  const groups = {};

  milestones.forEach((milestone) => {
    const baseId = milestone.id.replace(/_\d+$/, "");

    if (!groups[baseId]) {
      groups[baseId] = [];
    }

    groups[baseId].push(milestone);
  });

  Object.keys(groups).forEach((baseId) => {
    groups[baseId].sort((a, b) => (a.tier || 1) - (b.tier || 1));
  });

  return groups;
};

const MilestonesManager = () => {
  const { state } = useGame();
  const [activeTab, setActiveTab] = useState("resources");
  const [searchQuery, setSearchQuery] = useState("");

  const { stats, groupedMilestones } = useMemo(() => {
    const ms = state.milestones.map((m) => ({
      ...m,
      progress: Math.min(m.progress(state), 100),
      completed: m.completed || m.progress(state) >= 100,
    }));

    return {
      milestonesWithProgress: ms,
      groupedMilestones: groupMilestonesByBase(ms),
      stats: ms.reduce(
        (acc, m) => {
          acc.total++;
          if (m.completed) acc.completed++;
          return acc;
        },
        { total: 0, completed: 0 }
      ),
    };
  }, [state]);

  const filteredGroupedMilestones = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();
    const result: { [id: string]: Milestone[] } = {};

    Object.keys(groupedMilestones).forEach((baseId) => {
      const milestones = groupedMilestones[baseId];

      const matchingMilestones = milestones.filter(
        (m) =>
          (activeTab === "all" || m.category === activeTab) &&
          (m.name.toLowerCase().includes(searchLower) ||
            m.description.toLowerCase().includes(searchLower))
      );

      if (matchingMilestones.length > 0) {
        result[baseId] = matchingMilestones;
      }
    });

    return result;
  }, [groupedMilestones, activeTab, searchQuery]);

  return (
    <div className="glass-panel p-4 space-y-6 animate-fade-in">
      {/* ... (Header and Statistics) ... */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <div className="space-y-2">
          <h2 className="text-lg font-medium text-foreground/90 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-400" />
            Milestones
          </h2>
          <div className="text-sm text-muted-foreground">
            Completed: {stats.completed}/{stats.total} (
            {((stats.completed / stats.total) * 100 || 0).toFixed(1)}%)
          </div>
          <Progress
            value={(stats.completed / stats.total) * 100 || 0}
            className="h-2 w-48"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search milestones..."
              className="w-full pl-10 pr-4 py-2 bg-background/90 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ... (Categories) ... */}
      <div className="flex flex-wrap gap-2 mb-6">
        {milestoneCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveTab(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors w-[150px] ${
              activeTab === category.id
                ? "bg-primary text-primary-foreground"
                : "bg-background/50 hover:bg-accent"
            }`}
          >
            {category.icon}
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {/* Milestone List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto">
        {Object.entries(filteredGroupedMilestones).map(
          ([baseId, milestones]) => {
            if (milestones.some((m) => !m.tier)) {
              // Display milestones without tiers in a simple list
              return milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className={`p-4 rounded-lg border transition-all relative max-h-[300px] ${
                    milestone.completed
                      ? "bg-green-900/20 border-green-800"
                      : "bg-background/50 border-muted/30 hover:border-primary hover:shadow-lg"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="grid">
                      <div className="h-[50px]">
                        <h3 className="font-medium text-foreground/90 flex items-center gap-2">
                          {milestone.completed ? (
                            <Medal className="h-5 w-5 text-amber-400" />
                          ) : (
                            <Star className="h-5 w-5 text-muted-foreground" />
                          )}
                          {milestone.name}
                        </h3>
                      </div>
                      <div className="h-[50px]">
                        <p className="text-xs text-muted-foreground mt-1">
                          {milestone.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mt-4">
                    {!milestone.completed && (
                      <>
                        <div className="mt-2">
                          <div className="text-xs text-muted-foreground flex justify-between">
                            <span>
                              Progress:{" "}
                              {typeof milestone?.progress === "function"
                                ? milestone.progress(state).toFixed(1)
                                : Number(milestone?.progress).toFixed(1) || 0}
                              %
                            </span>
                          </div>
                          <Progress
                            value={
                              typeof milestone?.progress === "function"
                                ? milestone.progress(state)
                                : Number(milestone?.progress) || 0
                            }
                            className="h-1.5 mt-1"
                          />
                        </div>
                      </>
                    )}

                    {milestone.completed && (
                      <div className="mt-4 pt-2 border-t border-muted/30">
                        <div className="text-xs text-green-400 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>Reward unlocked!</span>
                        </div>
                        {milestone.rewardDescription && (
                          <div className="text-xs text-muted-foreground mt-2">
                            {milestone.rewardDescription}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ));
            } else {
              // Display milestones with tiers in the grouped view
              const completedTiers = milestones.filter(
                (m) => m.completed
              ).length;
              const activeTier =
                milestones.find((m) => !m.completed) ||
                milestones[milestones.length - 1];
              const groupName = milestones[0].name.replace(/\s+[IVX]+$/, "");

              return (
                <div
                  key={baseId}
                  className="p-4 rounded-lg border bg-background/50 border-muted/30 hover:border-primary hover:shadow-lg h-[300px]"
                >
                  {/* ... (Grouped milestone display logic) ... */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium text-foreground/90 flex items-center gap-2">
                        {completedTiers === milestones.length ? (
                          <Medal className="h-5 w-5 text-amber-400" />
                        ) : (
                          <Star className="h-5 w-5 text-muted-foreground" />
                        )}
                        {groupName}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Progress: {completedTiers}/{milestones.length} tiers
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 space-y-4">
                    <Progress
                      value={(completedTiers / milestones.length) * 100}
                      className="h-2"
                    />

                    {activeTier && !milestones.every((m) => m.completed) && (
                      <div className="p-3 bg-accent/30 rounded border-l-4 border-primary">
                        <div className="text-sm font-medium">
                          Current Goal: {activeTier.name}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {activeTier.description}
                        </div>
                        <div className="mt-2">
                          <div className="text-xs text-muted-foreground flex justify-between">
                            <span>
                              Progress:{" "}
                              {typeof activeTier?.progress === "function"
                                ? activeTier.progress(state).toFixed(1)
                                : Number(activeTier?.progress).toFixed(1) || 0}
                              %
                            </span>
                          </div>
                          <Progress
                            value={
                              typeof activeTier?.progress === "function"
                                ? activeTier.progress(state)
                                : Number(activeTier?.progress) || 0
                            }
                            className="h-1.5 mt-1"
                          />
                        </div>
                      </div>
                    )}

                    {completedTiers === milestones.length && (
                      <div className="text-xs text-green-400 flex items-center gap-2 mt-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>All tiers completed!</span>
                      </div>
                    )}

                    <div className="grid grid-cols-5 gap-1 mt-2">
                      {milestones.map((m, index) => (
                        <div
                          key={m.id}
                          className={`h-2 rounded ${
                            m.completed
                              ? "bg-green-500"
                              : index === completedTiers
                              ? "bg-blue-500 animate-pulse"
                              : "bg-gray-300"
                          }`}
                          title={`Tier ${m.tier}: ${m.description}`}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }
          }
        )}
      </div>
    </div>
  );
};

export default MilestonesManager;
