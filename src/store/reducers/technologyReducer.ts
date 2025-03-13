import { toast } from "@/components/ui/use-toast";
import { Technology, TechnologyCategory } from "../types";
import { canAffordCost, applyResourceCost } from "./resourceReducer";
import { ResourcesState } from "./resourceReducer";
import { BuildingType } from "../types";

// Sprawdź czy wszystkie wymagania technologiczne są spełnione
const checkPrerequisites = (
  technology: Technology,
  researchedTechIds: string[]
) => {
  return technology.prerequisites.every((prereq) =>
    researchedTechIds.includes(prereq)
  );
};

// Główna funkcja reduktora dla technologii
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
      title: "Błąd technologii",
      description: "Technologia nie istnieje",
      variant: "destructive",
    });
    return { technologies, resources, success: false };
  }

  if (tech.isResearched) {
    toast({
      title: "Już zbadane",
      description: "Ta technologia została już przebadana",
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
      title: "Wymagania nie spełnione",
      description: "Nie spełniono wymaganych warunków wstępnych",
      variant: "destructive",
    });
    return { technologies, resources, success: false };
  }

  if (!canAffordCost(resources, tech.researchCost)) {
    toast({
      title: "Brak zasobów",
      description: "Niewystarczające zasoby do badań",
      variant: "destructive",
    });
    return { technologies, resources, success: false };
  }

  const newResources = applyResourceCost(resources, tech.researchCost);
  const newTechs = technologies.map((t) =>
    t.id === techId ? { ...t, isResearched: true } : t
  );

  toast({
    title: "Technologia Odblokowana!",
    description: `Pomyślnie zbadano: ${tech.name}`,
  });

  return {
    technologies: newTechs,
    resources: newResources,
    success: true,
  };
};

// Pomocnicza funkcja do sprawdzania dostępnych budynków
export const getUnlockedBuildings = (
  technologies: Technology[]
): BuildingType[] => {
  return technologies
    .filter((t) => t.isResearched)
    .flatMap((t) => t.unlocksBuildings);
};
