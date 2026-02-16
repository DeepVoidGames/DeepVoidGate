import { toast } from "@/components/ui/use-toast";
import { canAffordCost, applyResourceCost } from "./resourceReducer";
import { ResourcesState } from "./resourceReducer";
import { Technology } from "@/types/technology";
import { GameState } from "@/types/gameState";
import { BuildingType } from "@/types/building";
import { gameEvent } from "@/server/analytics";

export const GLOBAL_RESEARCH_TIME_MULTIPLIER = 0.5;

/**
 * Checks if all the prerequisites for a given technology have been met.
 *
 * The function compares the list of required technologies (`prerequisites`)
 * with the list of already researched ones (`researchedTechIds`).
 * Returns `true` only if all required technologies are found in the researched list.
 *
 * @param technology - The technology object containing the list of prerequisites.
 * @param researchedTechIds - Array of technology IDs that have already been researched.
 *
 * @returns `true` if all prerequisites are met, otherwise `false`.
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
 * Starts researching a technology if all conditions are met.
 *
 * The function checks if the technology exists, has not been researched yet,
 * is not currently being researched, has met all prerequisites, and the player
 * has enough resources. If so, it starts the research and deducts the resources.
 * It also applies a faction bonus that shortens research time if applicable.
 *
 * @param technologies - Array of available technologies.
 * @param resources - Current state of player resources.
 * @param techId - ID of the technology the player wants to research.
 * @param state - The full game state, used among others to read faction loyalty.
 *
 * @returns An object containing:
 * - `technologies`: updated list of technologies,
 * - `resources`: updated resource state,
 * - `success`: a flag indicating whether starting the research succeeded.
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

  const researchDuration = getTechnologyResearchTime(tech, state);

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

  gameEvent("technology_research_started", {
    techId: tech.id,
    techName: tech.name,
    researchDuration,
    factionId: StarUnderstandingFaction?.id,
    factionLoyalty: StarUnderstandingFaction?.loyalty,
  });

  return {
    technologies: newTechs,
    resources: newResources,
    success: true,
  };
};

/**
 * Returns a list of building types unlocked by researched technologies.
 *
 * The function filters technologies that have been researched (`isResearched === true`)
 * and collects all building types unlocked by these technologies.
 *
 * @param technologies - Array of technology objects available in the game.
 *
 * @returns Array of building types (`BuildingType[]`) that have been unlocked.
 */
export const getUnlockedBuildings = (
  technologies: Technology[]
): BuildingType[] => {
  return technologies
    .filter((t) => t.isResearched)
    .flatMap((t) => t.unlocksBuildings);
};

/**
 * Updates the state of technology research by completing those whose research time has elapsed.
 *
 * The function checks all technologies currently being researched (have `researchStartTime`)
 * and not yet researched (`!isResearched`). If the research duration has elapsed,
 * it sets `isResearched` to `true` and clears the start timestamp.
 *
 * @param technologies - Array of technology objects to update.
 *
 * @returns Updated array of technologies reflecting completed researches.
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

/**
 * Checks if a given technology is unlocked in the current game state.
 *
 * The function searches the technology list in the game state and verifies
 * if a technology with the given ID exists and has been researched
 * (has the `isResearched` flag set to `true`).
 *
 * @param technologieId - Unique ID of the technology to check.
 * @param state - The game state object containing the list of technologies.
 *
 * @returns `true` if the technology is unlocked (researched),
 *          `false` otherwise.
 */
export const isTechnologyUnlocked = (
  technologieId: string,
  state: GameState
): boolean => {
  return state.technologies.some(
    (tech) => tech.id === technologieId && tech.isResearched
  );
};

export const getTechnologyResearchTime = (
  tech: Technology,
  state: GameState
) => {
  if (!tech.researchDuration) {
    return 0; // No research duration defined
  }

  if (tech.isResearched) {
    return 0; // Already researched, no duration
  }

  const StarUnderstandingFaction = state?.factions?.find(
    (faction) => faction.id === "StarUnderstanding"
  );

  const loyaltyReq =
    StarUnderstandingFaction?.bonuses?.[1]?.loyaltyReq ?? 1000000000;

  let researchDuration =
    (StarUnderstandingFaction?.loyalty ?? 0 >= loyaltyReq
      ? tech.researchDuration * 0.5
      : tech.researchDuration) * GLOBAL_RESEARCH_TIME_MULTIPLIER;

  if (state?.galacticUpgrades?.includes("quantum_time_refraction")) {
    researchDuration /= 2;
  }

  return researchDuration;
};
