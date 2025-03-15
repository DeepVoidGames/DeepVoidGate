import React, { useCallback, useState, useEffect } from "react";
import {
  Zap,
  FlaskConical,
  Microscope,
  Rocket,
  Cpu,
  Atom,
  Network,
  Shield,
  Search,
  Lock,
  CheckCircle,
  Clock,
} from "lucide-react";
import { GameProvider, useGame } from "@/context/GameContext";
import { formatNumber } from "@/lib/utils";
import { Technology, TechnologyCategory } from "@/store/types";
import { initialTechnologies } from "@/store/initialData";
import { toast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

const techCategories = [
  {
    id: "Energy",
    name: "Energy",
    icon: <Zap className="h-4 w-4 text-yellow-400" />,
  },
  {
    id: "Computing",
    name: "Computing",
    icon: <Cpu className="h-4 w-4 text-blue-400" />,
  },
  {
    id: "Aerospace",
    name: "Aerospace",
    icon: <Rocket className="h-4 w-4 text-red-400" />,
  },
  {
    id: "Materials",
    name: "Materials",
    icon: <Atom className="h-4 w-4 text-purple-400" />,
  },
];

const ResourcesIcon = ({ resource }) => {
  const icons = {
    oxygen: "O₂",
    food: "🌱",
    energy: "⚡",
    metals: "⛏️",
    science: "🔬",
  };
  return icons[resource] || "?";
};

const TechnologiesManager: React.FC = () => {
  const { state, dispatch } = useGame();
  const { resources, technologies } = state;
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    // Natychmiastowe sprawdzenie postępu
    dispatch({ type: "CHECK_RESEARCH_PROGRESS" });

    // Codzienne aktualizacje
    const interval = setInterval(() => {
      dispatch({ type: "CHECK_RESEARCH_PROGRESS" });
    }, 1000);

    return () => clearInterval(interval);
  }, [dispatch]);

  // Update current time every second for progress calculation
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const researchTech = useCallback(
    (techId: string) => {
      dispatch({ type: "RESEARCH_TECHNOLOGY", payload: { techId } });
    },
    [dispatch]
  );

  const canResearchTech = (tech: Technology) => {
    const isResearchInProgress = technologies.some(
      (t) => t.researchStartTime && !t.isResearched
    );

    const canAfford = Object.entries(tech.researchCost).every(
      ([resource, cost]) =>
        resources[resource as keyof typeof resources].amount >= cost
    );

    const hasPrerequisites = tech.prerequisites.every((prereqId) =>
      technologies.some((t) => t.id === prereqId && t.isResearched)
    );

    return (
      canAfford &&
      hasPrerequisites &&
      !tech.isResearched &&
      !isResearchInProgress
    );
  };

  const getPrerequisiteNames = (tech: Technology) => {
    return tech.prerequisites
      .map(
        (prereqId) =>
          technologies.find((t) => t.id === prereqId)?.name ||
          "Unknown technology"
      )
      .join(", ");
  };

  const getResearchProgress = (tech: Technology) => {
    if (!tech.researchStartTime || tech.isResearched) return null;

    const elapsed = now - tech.researchStartTime;
    const totalDuration = tech.researchDuration * 1000;

    // Zabezpieczenie przed ujemnym czasem
    if (elapsed >= totalDuration) {
      return {
        progress: 100,
        remaining: "0:00",
      };
    }

    const progress = (elapsed / totalDuration) * 100;
    const remainingSeconds = Math.ceil((totalDuration - elapsed) / 1000);
    const minutes = Math.max(0, Math.floor(remainingSeconds / 60));
    const seconds = Math.max(0, remainingSeconds % 60);

    return {
      progress,
      remaining: `${minutes}:${seconds.toString().padStart(2, "0")}`,
    };
  };

  const filteredTechnologies = technologies
    .filter((tech) => {
      return tech.category === activeTab;
    })
    .filter((tech) => {
      const search = searchQuery.toLowerCase();
      return (
        tech.name.toLowerCase().includes(search) ||
        tech.description?.toLowerCase().includes(search)
      );
    })
    .sort((a, b) => a.researchCost.science - b.researchCost.science);

  return (
    <div className="glass-panel p-4 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <h2 className="text-lg font-medium text-foreground/90">
          Technology Tree
        </h2>

        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search technologies..."
            className="w-full pl-10 pr-4 py-2 bg-background/90 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {techCategories.map((category) => (
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTechnologies.map((tech) => {
          const isResearched = tech.isResearched;
          const canResearch = canResearchTech(tech);
          const progressInfo = getResearchProgress(tech);
          const isInProgress = !!progressInfo;

          return (
            <div
              key={tech.id}
              className={`p-4 rounded-lg border transition-all duration-200 ${
                isResearched
                  ? "bg-green-900/20 border-green-800"
                  : `bg-background/50 border-muted/30 ${
                      canResearch ? "hover:border-primary hover:shadow-lg" : ""
                    }`
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium text-foreground/90">
                    {tech.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {tech.description}
                  </p>
                </div>
              </div>

              {!isResearched ? (
                <div className="flex flex-wrap gap-2 mb-3">
                  {Object.entries(tech.researchCost).map(([resource, cost]) => {
                    const hasEnough =
                      resources[resource as keyof typeof resources].amount >=
                      cost;
                    return (
                      <div
                        key={resource}
                        className="flex items-center gap-1 px-2 py-1 bg-background rounded text-sm"
                      >
                        <ResourcesIcon resource={resource} />
                        <span
                          className={
                            hasEnough ? "text-green-400" : "text-red-400"
                          }
                        >
                          {formatNumber(cost)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : null}

              {tech.prerequisites.length > 0 && (
                <div className="text-xs text-muted-foreground mb-3">
                  <Lock className="inline mr-1 h-3 w-3" />
                  Requires: {getPrerequisiteNames(tech)}
                </div>
              )}

              {isInProgress ? (
                <div className="space-y-2">
                  <Progress value={progressInfo.progress} className="h-2" />
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Remaining: {progressInfo.remaining}</span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => researchTech(tech.id)}
                  disabled={!canResearch || isResearched}
                  className={`w-full py-2 rounded-lg transition-colors ${
                    isResearched
                      ? "bg-green-800/50 cursor-default"
                      : canResearch
                      ? "bg-primary hover:bg-primary/90"
                      : "bg-muted cursor-not-allowed"
                  }`}
                >
                  {isResearched ? (
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Researched
                    </div>
                  ) : (
                    "Start Research"
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TechnologiesManager;
