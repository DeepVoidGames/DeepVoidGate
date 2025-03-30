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
} from "lucide-react";
import { useGame } from "@/context/GameContext";
import { Progress } from "@/components/ui/progress";
import { Milestone } from "@/store/types";

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
];

const MilestonesManager: React.FC = () => {
  const { state } = useGame();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Memoizowane obliczenia progresu
  const { milestonesWithProgress, stats } = useMemo(() => {
    const now = Date.now();
    const ms = state.milestones.map((m) => ({
      ...m,
      progress: Math.min(m.progress(state), 100),
      completed: m.completed || m.progress(state) >= 100,
    }));

    return {
      milestonesWithProgress: ms,
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

  // Filtrowanie i sortowanie
  const filteredMilestones = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();
    return milestonesWithProgress
      .filter(
        (m) =>
          (activeTab === "all" || m.category === activeTab) &&
          (m.name.toLowerCase().includes(searchLower) ||
            m.description.toLowerCase().includes(searchLower))
      )
      .sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return b.progress - a.progress;
      });
  }, [milestonesWithProgress, activeTab, searchQuery]);

  const categories = [
    { id: "all", name: "All", icon: <Trophy className="h-4 w-4" /> },
    ...milestoneCategories,
  ];

  return (
    <div className="glass-panel p-4 space-y-6 animate-fade-in">
      {/* Nagłówek i statystyki */}
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

      {/* Kategorie */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveTab(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
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

      {/* Lista osiągnięć */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-[450px] overflow-y-auto">
        {filteredMilestones.map((milestone) => (
          <div
            key={milestone.id}
            className={`p-4 rounded-lg border transition-all relative ${
              milestone.completed
                ? "bg-green-900/20 border-green-800"
                : "bg-background/50 border-muted/30 hover:border-primary hover:shadow-lg"
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium text-foreground/90 flex items-center gap-2">
                  {milestone.completed ? (
                    <Medal className="h-5 w-5 text-amber-400" />
                  ) : (
                    <Star className="h-5 w-5 text-muted-foreground" />
                  )}
                  {milestone.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {milestone.description}
                </p>
              </div>
            </div>

            <div className="space-y-3 mt-4">
              {!milestone.completed && (
                <>
                  <div className="text-xs text-muted-foreground">
                    Progress: {milestone.progress.toFixed(1)}%
                  </div>
                  <Progress value={milestone.progress} className="h-2" />
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
        ))}
      </div>
    </div>
  );
};

export default MilestonesManager;
