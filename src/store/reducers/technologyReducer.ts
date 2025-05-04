import { toast } from "@/components/ui/use-toast";
import { canAffordCost, applyResourceCost } from "./resourceReducer";
import { ResourcesState } from "./resourceReducer";
import { Technology } from "@/types/technology";
import { GameState } from "@/types/gameState";
import { BuildingType } from "@/types/building";

/**
 * Sprawdza, czy wszystkie wymagania wstępne danej technologii zostały spełnione.
 *
 * Funkcja porównuje listę wymaganych technologii (`prerequisites`) z listą już zbadanych (`researchedTechIds`).
 * Zwraca `true` tylko wtedy, gdy wszystkie wymagane technologie znajdują się na liście zbadanych.
 *
 * @param technology - Obiekt technologii zawierający listę wymaganych technologii (`prerequisites`).
 * @param researchedTechIds - Tablica identyfikatorów technologii, które zostały już zbadane.
 *
 * @returns `true`, jeśli wszystkie wymagania są spełnione, w przeciwnym razie `false`.
 */
const checkPrerequisites = (
  technology: Technology,
  researchedTechIds: string[]
) => {
  return technology.prerequisites.every((prereq) =>
    researchedTechIds.includes(prereq)
  );
};

/**
 * Rozpoczyna badanie technologii, jeśli spełnione są wszystkie warunki.
 *
 * Funkcja sprawdza, czy technologia istnieje, nie została już zbadana,
 * nie jest w trakcie badania, ma spełnione wymagania wstępne i czy gracz
 * posiada wystarczające zasoby. Jeśli tak, rozpoczyna badanie i odejmuje zasoby.
 * Uwzględnia bonus skracający czas badania od frakcji "StarUnderstanding".
 *
 * @param technologies - Tablica dostępnych technologii.
 * @param resources - Aktualny stan zasobów gracza.
 * @param techId - Identyfikator technologii, którą gracz chce zbadać.
 * @param state - Pełny stan gry, używany m.in. do odczytu lojalności frakcji.
 *
 * @returns Obiekt zawierający:
 * - `technologies`: zaktualizowana lista technologii,
 * - `resources`: zaktualizowany stan zasobów,
 * - `success`: flaga informująca, czy rozpoczęcie badania się powiodło.
 */
export const researchTechnology = (
  technologies: Technology[],
  resources: ResourcesState,
  techId: string,
  state: GameState
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

  const StarUnderstandingFaction = state?.factions?.find(
    (faction) => faction.id === "StarUnderstanding"
  );

  const loyaltyReq =
    StarUnderstandingFaction?.bonuses?.[1]?.loyaltyReq ?? 1000000000;

  const researchDuration =
    StarUnderstandingFaction?.loyalty ?? 0 >= loyaltyReq
      ? tech.researchDuration * 0.5
      : tech.researchDuration;

  const newTechs = technologies.map((t) =>
    t.id === techId
      ? {
          ...t,
          researchStartTime: Date.now(),
          researchDuration: researchDuration,
        }
      : t
  );

  toast({
    title: "Research Started",
    description: `Started researching: ${tech.name} (Duration: ${researchDuration}s)`,
  });

  return {
    technologies: newTechs,
    resources: newResources,
    success: true,
  };
};

/**
 * Zwraca listę typów budynków odblokowanych przez zbadane technologie.
 *
 * Funkcja filtruje technologie, które zostały zbadane (`isResearched === true`)
 * i zbiera wszystkie typy budynków odblokowywanych przez te technologie.
 *
 * @param technologies - Tablica obiektów technologii dostępnych w grze.
 *
 * @returns Tablica typów budynków (`BuildingType[]`), które zostały odblokowane.
 */
export const getUnlockedBuildings = (
  technologies: Technology[]
): BuildingType[] => {
  return technologies
    .filter((t) => t.isResearched)
    .flatMap((t) => t.unlocksBuildings);
};

/**
 * Aktualizuje stan badań technologii, kończąc te, których czas badań już upłynął.
 *
 * Funkcja sprawdza wszystkie technologie, które są w trakcie badań (mają `researchStartTime`)
 * i nie zostały jeszcze zbadane (`!isResearched`). Jeśli czas badań (`researchDuration`)
 * już upłynął, ustawia `isResearched` na `true` i usuwa znacznik czasu rozpoczęcia.
 *
 * @param technologies - Tablica obiektów technologii do zaktualizowania.
 *
 * @returns Zaktualizowana tablica technologii z uwzględnieniem ukończonych badań.
 */
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
