import { generateId } from "../initialData";
import {
  Expedition,
  ExpeditionEvent,
  ExpeditionEventEffect,
  ExpeditionType,
  ResourceAmount,
} from "@/types/expedition";
import { expeditionEvents } from "@/data/expeditionEvents";
import { toast } from "@/components/ui/use-toast";
import {
  addArtifactCopies,
  getArtifact,
  getArtifactsByExpeditionTier,
} from "./artifactsReducer";
import { updateFactionLoyalty } from "./factionsReducer";
import { FactionName } from "@/types/factions";
import { GameState } from "@/types/gameState";
import { ResourceType } from "@/types/resource";
import { Technology } from "@/types/technology";
import { gameEvent } from "@/server/analytics";
import { galacticUpgrades } from "@/data/colonization/galacticUpgrades";

// Constants for expedition calculations
export const CREW_PER_TIER = 5; //  5 crew members required for the first tier, increases by 5 for each additional tier
export const TIER_MULTIPLIER = 1.65; //  1.5x multiplier for each tier of expedition

const BASE_REWARDS: Record<ExpeditionType, ResourceAmount> = {
  mining: { metals: 9e4 },
  scientific: { science: 9e4 },
  void: {},
};

/**
 * Calculates the base reward for an expedition of a given type and tier.
 *
 * The reward is scaled exponentially based on the expedition tier using the `TIER_MULTIPLIER` constant.
 *
 * @param type - The type of expedition (e.g., planetary, cosmic).
 * @param tier - The expedition tier (0+), which affects reward scaling.
 * @returns An object containing the amounts of rewards (resources) assigned to the expedition.
 */
export const getBaseExpeditionReward = (
  type: ExpeditionType,
  tier: number,
  state: GameState
): ResourceAmount => {
  const baseRewards = BASE_REWARDS[type];
  const multipliedRewards: ResourceAmount = {};
  const bonus = state?.galacticUpgrades?.includes("quantum_disproportion")
    ? galacticUpgrades.find((g) => g.id === "quantum_disproportion").multiplier
    : 1;

  for (const [resource, amount] of Object.entries(baseRewards)) {
    multipliedRewards[resource as ResourceType] = Math.round(
      amount * Math.pow(TIER_MULTIPLIER, tier) * bonus
    );
  }

  return multipliedRewards;
};

/**
 * Returns the expected range of rewards for an expedition of a given type and tier.
 *
 * Based on the base reward, it additionally returns the minimum (0×) and maximum (3×) possible reward values.
 *
 * - The base reward is multiplied by 0 (minimum), 1 (base), and 3 (maximum).
 * - The return value includes three objects: `minReward`, `baseReward`, and `maxReward`, each containing resource amounts.
 *
 * @param type - The type of expedition (e.g., 'planetary', 'cosmic').
 * @param tier - The expedition tier (integer ≥ 0), which affects reward amounts.
 * @returns An object with three properties: `minReward`, `baseReward`, `maxReward`, each an object with resources and their amounts.
 */
export const getExpectedExpeditionRewards = (
  type: ExpeditionType,
  tier: number,
  state: GameState
) => {
  const base = getBaseExpeditionReward(type, tier, state);
  return {
    base: base,
    min: Object.fromEntries(
      Object.entries(base).map(([res, val]) => [res, Math.round(val * 0)])
    ),
    max: Object.fromEntries(
      Object.entries(base).map(([res, val]) => [res, Math.round(val * 3)])
    ),
  };
};

/**
 * Returns the current rewards for an ongoing expedition.
 *
 * Combines the base rewards based on the expedition's type and tier with the currently saved expedition rewards.
 * If the expedition had modifiers (e.g., from events), they are included in `expedition.rewards`.
 *
 * @param expedition - The object representing the expedition.
 * @returns The total rewards (base + modified) as a resource map.
 */
export const getCurrentExpeditionRewards = (
  expedition: Expedition,
  state: GameState
): ResourceAmount => {
  return {
    ...getBaseExpeditionReward(expedition.type, expedition.tier, state),
    ...expedition.rewards,
  };
};

/**
 * Returns a list of technologies that can be discovered during a scientific expedition.
 *
 * The function filters technologies that:
 * - have not yet been researched (`!tech.isResearched`),
 * - are locked (`tech.locked === true`),
 * - have all prerequisite technologies met (`prerequisites`) by already researched technologies.
 *
 * Works only for expeditions of type `"scientific"`, otherwise returns an empty array.
 *
 * @param type - The expedition type (e.g., "scientific").
 * @param technologies - The list of all technologies in the game.
 * @returns An array of technologies that can be discovered.
 */
export const getPossibleTechnologies = (
  type: ExpeditionType,
  technologies: Technology[]
): Technology[] => {
  if (type !== "scientific") return [];
  return technologies.filter(
    (tech) =>
      !tech.isResearched &&
      tech.locked === true &&
      tech.expedtionMinTier != null
  );
};

/**
 * Calculates the reward for an expedition based on its type and tier.
 *
 * The reward is computed from the base resource values for the given expedition type and tier,
 * with a random multiplier ranging from 0.2 to 2.0 applied.
 * The reward for each resource cannot be less than 20% of the base value.
 *
 * @param type - The type of expedition (e.g., "scientific", "planetary").
 * @param tier - The expedition tier, which affects the base reward value.
 * @returns A `ResourceAmount` object containing the resource rewards (e.g., `oxygen`, `water`).
 */
export const calculateReward = (
  type: ExpeditionType,
  tier: number,
  state: GameState
): ResourceAmount => {
  const base = getBaseExpeditionReward(type, tier, state);
  const rewards: ResourceAmount = {};

  for (const [resource, amount] of Object.entries(base)) {
    // Zapewniamy, że nagroda nie będzie zerowa (min. 20% bazowej wartości)
    const minAmount = Math.round(amount * 0.2);
    const randomMultiplier = 0.2 + Math.random() * 1.8; // Od 0.2 do 2.0
    rewards[resource as ResourceType] = Math.max(
      minAmount,
      Math.round(amount * randomMultiplier)
    );
  }

  return rewards;
};

/**
 * Formats resource rewards for UI display.
 *
 * This function takes a `rewards` object containing resource types and their amounts,
 * filters out resources with amounts greater than zero, and formats the amounts
 * as localized strings using `toLocaleString()`.
 *
 * @param rewards - An object containing resources and their amounts.
 * @returns An array of objects, each containing the resource type and the formatted amount as a string.
 */
export const formatRewardsForUI = (rewards: ResourceAmount) => {
  return (
    Object.entries(rewards)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, amount]) => amount > 0)
      .map(([resource, amount]) => ({
        type: resource as ResourceType,
        amount: amount.toLocaleString(),
      }))
  );
};

/**
 * Processes expedition rewards and updates the game state.
 *
 * This function checks if the rewards have already been granted for the expedition,
 * then adds the rewards to the player's resources. Additionally, it processes technologies,
 * crew members, artifacts, and factions related to the expedition type.
 *
 * @param expedition - The expedition from which the rewards originate.
 * @param state - The current game state to be updated based on the expedition rewards.
 * @returns The updated game state after applying the expedition rewards.
 */
export const getReward = (
  expedition: Expedition,
  state: GameState
): GameState => {
  let newState = { ...state };

  if (expedition.rewardsCollected) return newState;

  const totalRewards: ResourceAmount = calculateReward(
    expedition.type,
    expedition.tier,
    state
  );

  if (expedition.rewards) {
    Object.entries(expedition.rewards).forEach(([resource, amount]) => {
      const resourceType = resource as ResourceType;
      totalRewards[resourceType] = (totalRewards[resourceType] || 0) + amount;
    });
  }

  for (const [resource, amount] of Object.entries(totalRewards)) {
    const resourceType = resource as ResourceType;
    const numAmount = Number(amount);
    if (
      newState.resources[resourceType] &&
      !isNaN(numAmount) &&
      numAmount > 0
    ) {
      newState.resources[resourceType].amount += numAmount;
    }
  }

  const unlockedTechnologies: string[] = [];

  if (expedition.unlockedTechnologies) {
    expedition.unlockedTechnologies.forEach((techId) => {
      const techIndex = newState.technologies.findIndex((t) => t.id === techId);
      if (techIndex !== -1) {
        newState.technologies[techIndex] = {
          ...newState.technologies[techIndex],
          isResearched: true,
        };
        unlockedTechnologies.push(techId);
      }
    });
  }

  newState.population.available += expedition.crew;

  const expeditionIndex = newState.expeditions.findIndex(
    (e) => e.id === expedition.id
  );

  if (expeditionIndex > -1) {
    newState.expeditions[expeditionIndex] = {
      ...expedition,
      rewards: undefined,
      rewardsCollected: true,
    };
  }

  let foundArtifact: string | undefined;
  if (expedition.type === "mining" && Math.random() < 0.45) {
    const artifacts = getArtifactsByExpeditionTier(newState, expedition.tier);
    const artifactIndex = Math.floor(Math.random() * artifacts.length);
    const artifact = artifacts[artifactIndex];
    const artifactAmount = Math.floor(Math.random() * 5) + 1;
    if (artifact && artifact.name) {
      foundArtifact = artifact.name;
      newState = addArtifactCopies(artifact.name, artifactAmount, newState);
      toast({
        title: "Artifact Found!",
        description: `You have found an ${artifact.name}`,
      });
    }
  }

  const affectedFactions: { factionId: string; loyaltyChange: number }[] = [];

  if (expedition.type === "scientific") {
    for (const id of ["StarUnderstanding", "Biogenesis"]) {
      const faction = newState.factions.find((f) => f.id === id);
      if (faction) {
        affectedFactions.push({
          factionId: faction.id,
          loyaltyChange: 10 * (expedition.tier + 1),
        });
        newState = updateFactionLoyalty(
          newState,
          faction.id as FactionName,
          10 * (expedition.tier + 1)
        );
      }
    }
  } else if (expedition.type === "mining") {
    const faction = newState.factions.find((f) => f.id === "Technocrats");
    if (faction) {
      affectedFactions.push({
        factionId: faction.id,
        loyaltyChange: 10 * (expedition.tier + 1),
      });
      newState = updateFactionLoyalty(
        newState,
        faction.id as FactionName,
        10 * (expedition.tier + 1)
      );
    }
  }

  gameEvent("expedition_reward_collected", {
    expeditionId: expedition.id,
    type: expedition.type,
    tier: expedition.tier,
    rewards: totalRewards,
    artifact: foundArtifact,
    unlockedTechnologies:
      unlockedTechnologies.length > 0
        ? JSON.stringify(unlockedTechnologies)
        : undefined,
    affectedFactions:
      affectedFactions.length > 0
        ? JSON.stringify(affectedFactions)
        : undefined,
  });

  toast({
    title: "Expedition Completed",
    description: `Your ${expedition.type} expedition has returned with resources!`,
  });

  return newState;
};



/**
 * Calculates the required number of crew members based on the expedition tier.
 *
 * The number of crew members is calculated using the constant `CREW_PER_TIER`
 * multiplied by the expedition tier (`tier`). The required crew increases
 * proportionally with the expedition tier.
 *
 * @param tier - The expedition tier influencing the required crew size.
 * @returns The required number of crew members for the given expedition tier.
 */
export const calculateRequiredCrew = (tier: number): number => {
  return CREW_PER_TIER + tier * CREW_PER_TIER;
};



/**
 * Applies event effects to the expedition and game state.
 *
 * Processes a list of effects that may impact expedition duration,
 * resources, crew size, rewards, technology discoveries, or expedition status.
 * Effects are applied based on their type, and appropriate changes are made
 * to both the expedition and game state.
 *
 * @param effects - List of effects to be applied to the expedition.
 * @param expedition - The expedition object to which effects will be applied.
 * @param state - The current game state object that will be updated based on effects.
 * @returns An object containing the updated expedition and game state.
 */
const applyEventEffects = (
  effects: ExpeditionEventEffect[],
  expedition: Expedition,
  state: GameState
): { expedition: Expedition; state: GameState } => {
  const newExpedition = { ...expedition };
  const newState = { ...state };

  for (const effect of effects) {
    const value =
      typeof effect.value === "function"
        ? effect.value(expedition)
        : effect.value;

    switch (effect.type) {


      case "resources": {
        const resourceType = effect.resourceType as ResourceType;
        if (newState.resources[resourceType]) {
          newState.resources[resourceType].amount += value as number;
        }
        break;
      }

      case "crew": {
        const crewChange = value as number;
        const originalCrew = newExpedition.crew;
        newExpedition.crew = Math.max(1, newExpedition.crew + crewChange);

        // Oblicz ilość straconych kolonistów
        const crewLost = originalCrew - newExpedition.crew;
        if (crewLost > 0) {
          // Aktualizuj globalną populację
          newState.population.total = Math.max(
            0,
            newState.population.total - crewLost
          );
          newState.population.available = Math.max(
            0,
            newState.population.available - crewLost
          );

          toast({
            title: "Crew Members Lost",
            description: `${crewLost} colonists have perished during the expedition.`,
            variant: "destructive",
          });
        }
        break;
      }

      case "reward": {
        if (!newExpedition.rewards) newExpedition.rewards = {};
        const rewards = value as ResourceAmount;
        for (const [res, amount] of Object.entries(rewards)) {
          newExpedition.rewards[res] =
            (newExpedition.rewards[res] || 0) + amount;
        }
        break;
      }

      case "technology": {
        const techId = effect.technologyId;
        if (!techId) break;

        const techIndex = newState.technologies.findIndex(
          (t) => t.id === techId
        );
        if (techIndex === -1) break;

        if (!newState.technologies[techIndex].isResearched) {
          // Odblokuj technologię nawet bez spełnienia wymagań
          newState.technologies[techIndex] = {
            ...newState.technologies[techIndex],
            isResearched: true,
            researchStartTime: undefined,
            locked: false,
          };

          toast({
            title: "Technology Discovered!",
            description: `Acquired ${newState.technologies[techIndex].name} technology`,
          });
        }
        break;
      }

      case "fail":
        newExpedition.status = "failed";
        break;
    }
  }

  return { expedition: newExpedition, state: newState };
};

/**
 * Starts a new expedition after checking if the player has enough available colonists,
 * then updates the game state based on the outcome.
 *
 * The function performs the following operations:
 * - Checks if the player has enough available colonists to send on the expedition.
 * - If the number of colonists is insufficient, displays an error message.
 * - Calculates the required expedition duration and rewards.
 * - Creates a new expedition object and adds it to the game state.
 * - Decreases the number of available colonists in the population.
 *
 * @param state - The object representing the current game state.
 * @param type - The type of expedition to start.
 * @param tier - The expedition tier, defining its difficulty and rewards.
 * @returns The updated game state after starting the expedition.
 */
export const startExpedition = (
  state: GameState,
  type: ExpeditionType,
  tier: number
): GameState => {
  // Sprawdź czy gracz ma wystarczającą liczbę dostępnych kolonistów
  const requiredCrew = calculateRequiredCrew(tier);
  if (state.population.available < requiredCrew) {
    toast({
      title: "Not Enough Crew",
      description: `You need at least ${requiredCrew} available colonists for this expedition.`,
      variant: "destructive",
    });
    return state;
  }

  const newExpedition: Expedition = {
    id: generateId(),
    type,
    tier,
    crew: requiredCrew,
    status: "awaiting_action",
    eventHistory: [],
    currentEventId:
      type === "scientific"
        ? "start_scientific_expedition"
        : type === "mining"
          ? "start_mining_expedition"
          : null, // Assuming 'void' might have a different start or dynamically assigned
    eventChain: [], // Initialize as empty, will be populated by event choices
    rewards: calculateReward(type, tier, state),
  };

  gameEvent("expedition_started", {
    type,
    tier,
    crew: requiredCrew,
  });

  // Zatwierdź ekspedycję (zmniejsz liczbę dostępnych kolonistów)
  return {
    ...state,
    expeditions: [...state.expeditions, newExpedition],
    population: {
      ...state.population,
      available: state.population.available - requiredCrew,
    },
  };
};





/**
 * Handles the player's choice of option in an expedition event.
 * Updates the expedition and game state based on the selected option,
 * applying effects associated with that option.
 *
 * The function performs the following operations:
 * - Finds the expedition in the game state by its identifier.
 * - Checks if the event exists and if the selected option is valid.
 * - Applies the effects of the chosen option to the expedition and game state.
 * - Updates the expedition's event log, marking the selected option.
 * - Returns the updated game state with new expedition data.
 *
 * @param state - The object representing the current game state.
 * @param expeditionId - The identifier of the expedition whose event was selected.
 * @param eventIndex - The index of the selected event within the expedition.
 * @param optionIndex - The index of the selected option within the event.
 * @returns The updated game state after processing the event option choice.
 */
export const handleExpeditionEventChoice = (
  state: GameState,
  expeditionId: string,
  optionIndex: number
): GameState => {
  const expeditionIndex = state.expeditions.findIndex(
    (e) => e.id === expeditionId
  );
  if (expeditionIndex === -1) return state;

  let expedition = { ...state.expeditions[expeditionIndex] };
  let newState = { ...state };

  if (expedition.status !== "awaiting_action" || !expedition.currentEventId) {
    console.warn(
      `Expedition ${expeditionId} not awaiting action or no current event.`
    );
    return state;
  }

  const currentEvent = expeditionEvents.find(
    (e) => e.id === expedition.currentEventId
  );
  if (!currentEvent || optionIndex >= currentEvent.options.length) {
    console.error(
      `Invalid current event (${expedition.currentEventId}) or option index (${optionIndex}) for expedition ${expeditionId}.`
    );
    return state;
  }

  const chosenOption = currentEvent.options[optionIndex];
  if (!chosenOption) {
    console.error(`chosenOption is undefined for expedition ${expeditionId}, event ${expedition.currentEventId}, option ${optionIndex}.`);
    return state;
  }

  // Apply effects of the chosen option
  const result = applyEventEffects(
    chosenOption.effects,
    expedition,
    newState
  );
  expedition = result.expedition;
  newState = result.state;

  // Record the event and choice in history
  expedition.eventHistory = [
    ...expedition.eventHistory,
    {
      eventId: currentEvent.id,
      chosenOptionIndex: optionIndex,
      time: Date.now(), // Use current timestamp for event resolution
    },
  ];

  // Determine the next event or complete the expedition
  if (chosenOption.nextEventId) {
    expedition.currentEventId = chosenOption.nextEventId;
    // Keep status as awaiting_action for the next event
  } else {
    // No next event, expedition completed
    expedition.status = "completed";
    expedition.currentEventId = null;
    newState = getReward(expedition, newState); // Process rewards upon completion
  }

  // Update the expedition in the state
  const newExpeditions = [...newState.expeditions];
  newExpeditions[expeditionIndex] = expedition;

  gameEvent("expedition_event_choice", {
    expeditionId,
    eventId: currentEvent.id,
    optionIndex,
    nextEventId: chosenOption.nextEventId,
    expeditionStatus: expedition.status,
  });

  return {
    ...newState,
    expeditions: newExpeditions,
  };
};

/**
 * Cancels an expedition, returning crew members to the available pool.
 * The expedition must be in the "preparing" state to be canceled.
 *
 * The function performs the following operations:
 * - Checks if the expedition with the given identifier exists in the game state.
 * - If the expedition is in the "preparing" state, returns crew members to available.
 * - Removes the expedition from the list.
 * - Returns the updated game state with the expedition removed and updated available crew count.
 *
 * @param state - The object representing the current game state.
 * @param expeditionId - The identifier of the expedition to be canceled.
 * @returns The updated game state after canceling the expedition.
 */
export const cancelExpedition = (
  state: GameState,
  expeditionId: string
): GameState => {
  const expeditionIndex = state.expeditions.findIndex(
    (e) => e.id === expeditionId
  );
  if (expeditionIndex === -1) return state;

  const expedition = state.expeditions[expeditionIndex];
  if (expedition.status === "completed" || expedition.status === "failed")
    return state;

  // Zwróć załogantów
  const newPopulation = {
    ...state.population,
    available: state.population.available + expedition.crew,
  };

  // Usuń ekspedycję
  const newExpeditions = state.expeditions.filter((e) => e.id !== expeditionId);

  toast({
    title: "Expedition Canceled",
    description:
      "The expedition has been canceled and crew members have returned.",
  });

  return {
    ...state,
    expeditions: newExpeditions,
    population: newPopulation,
  };
};

/**
 * Checks if the expedition is unlocked based on the "advanced_hub_integration" technology.
 * The expedition is unlocked if the technology with the ID "advanced_hub_integration" has been researched.
 *
 * @param state - The object representing the current game state.
 * @returns `true` if the "advanced_hub_integration" technology has been researched, otherwise `false`.
 */
export const isExpedtionUnlocked = (state) => {
  return state.technologies.some(
    (tech) => tech.id === "advanced_hub_integration" && tech.isResearched
  );
};
