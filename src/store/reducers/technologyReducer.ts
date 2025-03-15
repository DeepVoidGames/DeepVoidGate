import { toast } from "@/components/ui/use-toast";
import { Technology, TechnologyCategory } from "../types";
import { canAffordCost, applyResourceCost } from "./resourceReducer";
import { ResourcesState } from "./resourceReducer";
import { BuildingType } from "../types";

const checkPrerequisites = (
  technology: Technology,
  researchedTechIds: string[]
) => {
  return technology.prerequisites.every((prereq) =>
    researchedTechIds.includes(prereq)
  );
};

export const researchTechnology = (
  technologies: Technology[],
  resources: ResourcesState,
  techId: string
): {
  technologies: Technology[];
  resources: ResourcesState;
  success: boolean;
} => {
  const tech = technologies.find((t) => t.id === techId);

  if (!tech) {
    toast({
      title: "Technology Error",
      description: "Technology does not exist",
      variant: "destructive",
    });
    return { technologies, resources, success: false };
  }

  if (tech.isResearched) {
    toast({
      title: "Already Researched",
      description: "This technology has already been researched",
    });
    return { technologies, resources, success: false };
  }

  if (tech.researchStartTime) {
    toast({
      title: "Research in Progress",
      description: "This technology is already being researched",
    });
    return { technologies, resources, success: false };
  }

  if (
    !checkPrerequisites(
      tech,
      technologies.filter((t) => t.isResearched).map((t) => t.id)
    )
  ) {
    toast({
      title: "Prerequisites Not Met",
      description: "Required prerequisites are not met",
      variant: "destructive",
    });
    return { technologies, resources, success: false };
  }

  if (!canAffordCost(resources, tech.researchCost)) {
    toast({
      title: "Insufficient Resources",
      description: "Not enough resources to start research",
      variant: "destructive",
    });
    return { technologies, resources, success: false };
  }

  const newResources = applyResourceCost(resources, tech.researchCost);
  const newTechs = technologies.map((t) =>
    t.id === techId
      ? {
          ...t,
          researchStartTime: Date.now(),
          researchDuration: tech.researchDuration,
        }
      : t
  );

  toast({
    title: "Research Started",
    description: `Started researching: ${tech.name} (Duration: ${tech.researchDuration}s)`,
  });

  return {
    technologies: newTechs,
    resources: newResources,
    success: true,
  };
};

export const getUnlockedBuildings = (
  technologies: Technology[]
): BuildingType[] => {
  return technologies
    .filter((t) => t.isResearched)
    .flatMap((t) => t.unlocksBuildings);
};

// Helper function to check completed researches (should be called periodically)
export const updateResearches = (technologies: Technology[]): Technology[] => {
  const now = Date.now();
  return technologies.map((tech) => {
    if (tech.researchStartTime && !tech.isResearched) {
      const elapsed = (now - tech.researchStartTime) / 1000;
      if (elapsed >= tech.researchDuration) {
        toast({
          title: "Research Completed",
          description: `Successfully researched: ${tech.name}`,
        });
        return { ...tech, isResearched: true, researchStartTime: undefined };
      }
    }
    return tech;
  });
};
