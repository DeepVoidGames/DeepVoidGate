import React, { useCallback, useState, useEffect } from "react";
import {
  Zap,
  FlaskConical,
  Microscope,
  Rocket,
  Network,
  Search,
  Lock,
  CheckCircle,
  Clock,
  Eye,
  EyeOff,
} from "lucide-react";
import { useGame } from "@/context/GameContext";
import { formatNumber } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Technology } from "@/types/technology";
import { getDominantFactionTheme } from "@/store/reducers/factionsReducer";
import { useTutorialIntegration } from "@/hooks/useTutorialIntegration";
import { TutorialHighlight } from "@/components/Tutorial/TutorialHighlight";
import { TutorialButton } from "@/components/Tutorial/TutorialButton";
import { ResourcesIcon } from "@/config";

const techCategories = [
  {
    id: "Infrastructure",
    name: "Infrastructure",
    icon: <Network className="h-4 w-4 text-green-400" />,
  },
  {
    id: "Energy",
    name: "Energy",
    icon: <Zap className="h-4 w-4 text-yellow-400" />,
  },
  {
    id: "Production",
    name: "Production",
    icon: <FlaskConical className="h-4 w-4 text-blue-400" />,
  },
  {
    id: "Research",
    name: "Research",
    icon: <Microscope className="h-4 w-4 text-purple-400" />,
  },
  {
    id: "Advanced",
    name: "Advanced",
    icon: <Rocket className="h-4 w-4 text-red-400" />,
  },
];

const TechnologiesManager: React.FC = () => {
  const { state, dispatch } = useGame();
  const { isInTutorial, currentTutorial } = useTutorialIntegration();
  const { resources, technologies } = state;
  const [activeTab, setActiveTab] = useState<string>("Infrastructure");
  const [searchQuery, setSearchQuery] = useState("");
  const [showResearched, setShowResearched] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    dispatch({ type: "CHECK_RESEARCH_PROGRESS" });
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
    .sort((a, b) => {
      const aIsPrerequisite = technologies.some((tech) =>
        tech.prerequisites.includes(a.id)
      );
      const bIsPrerequisite = technologies.some((tech) =>
        tech.prerequisites.includes(b.id)
      );

      if (aIsPrerequisite && !bIsPrerequisite) return -1;
      if (!aIsPrerequisite && bIsPrerequisite) return 1;

      return a.researchCost.science - b.researchCost.science;
    });

  return (
    <div
      className={`glass-panel p-4 space-y-6 animate-fade-in ${getDominantFactionTheme(
        state,
        { styleType: "border", opacity: 0.8 }
      )}`}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-medium text-foreground/90">
            Technology Tree
          </h2>
          <TutorialButton
            tutorialId="technologies-basics"
            size="md"
            variant="ghost"
          />
        </div>
        <TutorialHighlight
          tutorialId="technologies-basics"
          stepId="search-technologies"
        >
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
        </TutorialHighlight>
      </div>

      {/* Hide/Show */}
      <TutorialHighlight
        tutorialId="technologies-basics"
        stepId="completed-research"
      >
        <div className="flex items-center justify-end mb-4 w-full">
          <button
            onClick={() => setShowResearched((prev) => !prev)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors`}
          >
            {showResearched ? (
              <Eye className="h-4 w-4 text-muted-foreground" />
            ) : (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="text-muted-foreground text-sm">
              {showResearched ? "Hide Researched" : "Show Researched"}
            </span>
          </button>
        </div>
      </TutorialHighlight>

      {/* Categories */}
      <TutorialHighlight
        tutorialId="technologies-basics"
        stepId="tech-categories"
      >
        <div className="flex flex-wrap gap-2 mb-6 w-full">
          {techCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`flex items-center min-w-0 justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg transition-colors flex-1 basis-[calc(50%-4px)] sm:basis-auto sm:w-full md:w-fit ${
                activeTab === category.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-background/50 hover:bg-accent"
              }`}
            >
              <div className="flex-shrink-0 text-xl sm:text-base">
                {category.icon}
              </div>
              <span className="min-w-0 overflow-hidden whitespace-nowrap text-ellipsis text-sm sm:text-base">
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </TutorialHighlight>

      {/* Technology Grid */}
      <TutorialHighlight tutorialId="technologies-basics" stepId="tech-cards">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-[450px]overflow-y-auto">
          {filteredTechnologies.map((tech) => {
            const isResearched = tech.isResearched;
            const canResearch = canResearchTech(tech);
            const progressInfo = getResearchProgress(tech);
            const isInProgress = !!progressInfo;

            if (!showResearched && isResearched) return null;

            return (
              <div
                key={tech.id}
                className={`p-4 rounded-lg border transition-all duration-200 h-[350px] relative ${
                  isResearched
                    ? "bg-green-900/20 border-green-800"
                    : `bg-background/50 border-muted/30 ${
                        canResearch
                          ? "hover:border-primary hover:shadow-lg"
                          : ""
                      }`
                } `}
              >
                {tech?.locked ? (
                  <div className="absolute inset-0 bg-black/90 rounded-lg backdrop-blur-sm">
                    <div className="absolute inset-0 flex items-center justify-center text-white text-lg font-bold">
                      <Lock className="w-8" />
                    </div>
                  </div>
                ) : null}

                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-foreground/90 text-sm">
                      {tech.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {tech.description}
                    </p>
                  </div>
                </div>

                {!isResearched ? (
                  <TutorialHighlight
                    tutorialId="technologies-basics"
                    stepId="research-costs"
                  >
                    <div className="flex flex-wrap gap-2 mb-3">
                      {Object.entries(tech.researchCost).map(
                        ([resource, cost]) => {
                          const hasEnough =
                            resources[resource as keyof typeof resources]
                              .amount >= cost;
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
                        }
                      )}
                    </div>
                  </TutorialHighlight>
                ) : null}

                <div
                  className={`bottom-0 left-0 right-0 absolute p-4 rounded-b-lg ${
                    tech?.locked ? "hidden" : ""
                  }`}
                >
                  {tech.prerequisites.length > 0 && (
                    <div className="text-xs text-[10px] text-muted-foreground mb-3">
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
                      className={`w-full py-2 rounded-lg transition-colors justify-end ${
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
              </div>
            );
          })}
        </div>
      </TutorialHighlight>
    </div>
  );
};

export default TechnologiesManager;
