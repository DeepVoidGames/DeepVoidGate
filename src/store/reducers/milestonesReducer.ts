import { toast } from "@/components/ui/use-toast";
import { BuildingType } from "@/types/building";
import { GameState } from "@/types/gameState";
import { Milestone } from "@/types/milestone";
import { ResourceType } from "@/types/resource";

/**
 * Sprawdza, które kamienie milowe mogą zostać ukończone, a następnie je odblokowuje,
 * stosując odpowiednie nagrody. Sprawdza również, czy należy cofnąć ukończone kamienie milowe,
 * jeśli ich warunki nie są już spełnione.
 *
 * @param state - Obiekt reprezentujący aktualny stan gry.
 * @returns Zaktualizowany stan gry po przetworzeniu kamieni milowych.
 */
export const checkMilestones = (state: GameState): GameState => {
  let newState = { ...state };

  // First pass: Find all milestones that can be completed
  const completableMilestones: Milestone[] = [];
  newState.milestones.forEach((milestone) => {
    if (
      !milestone.completed &&
      milestone.condition(newState) &&
      isPrerequisiteComplete(newState, milestone)
    ) {
      completableMilestones.push(milestone);
    }
  });

  // Second pass: Complete milestones and apply rewards
  if (completableMilestones.length > 0) {
    completableMilestones.sort((a, b) => (a.tier || 0) - (b.tier || 0));

    const updatedMilestones = [...newState.milestones];

    completableMilestones.forEach((milestone) => {
      const index = updatedMilestones.findIndex((m) => m.id === milestone.id);
      if (index !== -1) {
        updatedMilestones[index] = {
          ...updatedMilestones[index],
          completed: true,
        };

        if (milestone.reward) {
          newState = milestone.reward(newState);
        }

        const baseName = milestone.name.replace(/\s+[IVX]+$/, "");
        const tierText = milestone.tier ? ` (Tier ${milestone.tier})` : "";
        toast({
          title: `Milestone Unlocked: ${baseName}${tierText}`,
          description: milestone.description,
        });
      }
    });

    newState = { ...newState, milestones: updatedMilestones };
  }

  // Third pass: Check and revoke milestones iteratively
  let revokedAny;
  do {
    revokedAny = false;
    const completedMilestones = newState.milestones.filter((m) => m.completed);
    const sortedCompleted = [...completedMilestones].sort(
      (a, b) => (a.tier || 0) - (b.tier || 0)
    );

    for (const milestone of sortedCompleted) {
      if (milestone?.onlyOneTime) continue;
      const conditionMet = milestone.condition(newState);
      const prereqMet = isPrerequisiteComplete(newState, milestone);
      if (!conditionMet || !prereqMet) {
        // Revoke the milestone
        const updatedMilestones = newState.milestones.map((m) =>
          m.id === milestone.id ? { ...m, completed: false } : m
        );
        newState = { ...newState, milestones: updatedMilestones };

        // Notification
        // const baseName = milestone.name.replace(/\s+[IVX]+$/, "");
        // const tierText = milestone.tier ? ` (Tier ${milestone.tier})` : "";

        revokedAny = true;
        break; // Restart loop to re-check all milestones
      }
    }
  } while (revokedAny);

  return newState;
};

/**
 * Sprawdza, czy kamień milowy ma ukończony kamień milowy, który jest wymagany jako prerequisit.
 *
 * @param state - Obiekt reprezentujący aktualny stan gry.
 * @param milestone - Kamień milowy, którego wymóg prerequisitu jest sprawdzany.
 * @returns `true`, jeśli kamień milowy nie ma wymaganego prerequisitu lub jeżeli wymagany prerequisit został ukończony; `false` w przeciwnym przypadku.
 */
const isPrerequisiteComplete = (
  state: GameState,
  milestone: Milestone
): boolean => {
  if (!milestone.prerequisiteId) return true;
  const prerequisite = state.milestones.find(
    (m) => m.id === milestone.prerequisiteId
  );
  return prerequisite ? prerequisite.completed : true;
};

/**
 * Zwraca liczbę budynków danego typu w grze.
 *
 * @param state - Obiekt reprezentujący aktualny stan gry.
 * @param type - Typ budynku, którego liczba ma zostać obliczona.
 * @returns Liczba budynków określonego typu w stanie gry.
 */
export const getBuildingCount = (state: GameState, type: BuildingType) =>
  state.buildings.filter((b) => b.type === type).length;

/**
 * Zwraca ilość zasobu o podanym typie w grze.
 *
 * @param state - Obiekt reprezentujący aktualny stan gry.
 * @param resource - Typ zasobu, którego ilość ma zostać pobrana.
 * @returns Ilość zasobu określonego typu w stanie gry.
 */
export const getResourceAmount = (state: GameState, resource: ResourceType) =>
  state.resources[resource].amount;

/**
 * Sprawdza, czy technologia o podanym identyfikatorze została zbadana.
 *
 * @param state - Obiekt reprezentujący aktualny stan gry.
 * @param techId - Identyfikator technologii, którą sprawdzamy.
 * @returns `true` jeśli technologia została zbadana, w przeciwnym razie `false`.
 */
export const isTechnologyResearched = (state: GameState, techId: string) =>
  state.technologies.some((t) => t.id === techId && t.isResearched);
