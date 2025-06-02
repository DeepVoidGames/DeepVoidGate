import React, { useState } from "react";
import {
  BookOpen,
  Play,
  Check,
  Lock,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useTutorial } from "./TutorialManager";
import { getTutorialsByCategory, allTutorials } from "../../data/tutorialData";

export const TutorialMenu: React.FC = () => {
  const { state, startTutorial, isAvailable } = useTutorial();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    "buildings",
  ]);

  const categories = [...new Set(allTutorials.map((t) => t.category))];

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const getTutorialStatus = (tutorialId: string) => {
    if (state.completedTutorials.includes(tutorialId)) return "completed";
    if (!isAvailable(tutorialId)) return "locked";
    return "available";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <Check className="h-4 w-4 text-green-500" />;
      case "locked":
        return <Lock className="h-4 w-4 text-gray-400" />;
      default:
        return <Play className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "border-green-500 bg-green-50 dark:bg-green-900/20";
      case "locked":
        return "border-gray-300 bg-gray-50 dark:bg-gray-800";
      default:
        return "border-blue-500 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-800/30";
    }
  };

  return (
    <div className="relative">
      {/* Tutorial Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
      >
        <BookOpen className="h-4 w-4" />
        <span>Tutorials</span>
        {state.activeTutorial && (
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
        )}
      </button>

      {/* Tutorial Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu Panel */}
          <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-20 max-h-96 overflow-y-auto">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Available Tutorials
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Learn the game mechanics step by step
              </p>
            </div>

            <div className="p-2">
              {categories.map((category) => {
                const categoryTutorials = getTutorialsByCategory(category);
                const isExpanded = expandedCategories.includes(category);
                const completedCount = categoryTutorials.filter((t) =>
                  state.completedTutorials.includes(t.id)
                ).length;

                return (
                  <div key={category} className="mb-2">
                    {/* Category Header */}
                    <button
                      onClick={() => toggleCategory(category)}
                      className="w-full flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-500" />
                        )}
                        <span className="font-medium text-gray-900 dark:text-white capitalize">
                          {category}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {completedCount}/{categoryTutorials.length}
                      </span>
                    </button>

                    {/* Category Tutorials */}
                    {isExpanded && (
                      <div className="ml-6 space-y-1">
                        {categoryTutorials.map((tutorial) => {
                          const status = getTutorialStatus(tutorial.id);
                          const canStart =
                            status === "available" && !state.activeTutorial;

                          return (
                            <div
                              key={tutorial.id}
                              className={`p-3 rounded-md border transition-colors ${getStatusColor(
                                status
                              )}`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    {getStatusIcon(status)}
                                    <h4 className="font-medium text-sm text-gray-900 dark:text-white">
                                      {tutorial.name}
                                    </h4>
                                  </div>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                    {tutorial.description}
                                  </p>

                                  {tutorial.prerequisites &&
                                    tutorial.prerequisites.length > 0 && (
                                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                        Prerequisites:{" "}
                                        {tutorial.prerequisites
                                          .map((prereq) => {
                                            const prereqTutorial =
                                              allTutorials.find(
                                                (t) => t.id === prereq
                                              );
                                            return prereqTutorial?.name;
                                          })
                                          .join(", ")}
                                      </div>
                                    )}
                                </div>

                                {canStart && (
                                  <button
                                    onClick={() => {
                                      startTutorial(tutorial.id);
                                      setIsOpen(false);
                                    }}
                                    className="ml-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-md transition-colors"
                                  >
                                    Start
                                  </button>
                                )}
                              </div>

                              {status === "locked" &&
                                tutorial.prerequisites && (
                                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                    Complete prerequisite tutorials to unlock
                                  </div>
                                )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Progress Summary */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Progress
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {state.completedTutorials.length}/{allTutorials.length}{" "}
                  completed
                </span>
              </div>
              <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${
                      (state.completedTutorials.length / allTutorials.length) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
