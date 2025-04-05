import { generateId } from "@/store/initialData";
import {
  ResourceType,
  ExpeditionState as Expedition,
  ExpeditionEvent,
  GameState,
  ExpeditionType,
  MissionType,
} from "../types";
import {
  canAffordCost,
  applyResourceCost,
  ResourcesState,
} from "./resourceReducer";
import { toast } from "@/components/ui/use-toast";
import { GameAction } from "../actions";
import { expeditionTypes } from "@/data/expeditions/expeditionData";
import { expeditionEvents } from "@/data/expeditions/expeditionEvents";

export const handleExpeditions = (
  state: GameState,
  action: GameAction
): GameState => {
  switch (action.type) {
    case "START_EXPEDITION": {
      const { expeditionType, missionType } = action.payload;

      // Find expedition config
      const expeditionConfig = expeditionTypes.find(
        (e) => e.type === expeditionType
      );
      if (!expeditionConfig) {
        toast({ title: "Invalid expedition type", variant: "destructive" });
        return state;
      }

      // Find mission config
      const missionConfig = expeditionConfig.missions.find(
        (m) => m.type === missionType
      );
      if (!missionConfig) {
        toast({ title: "Invalid mission type", variant: "destructive" });
        return state;
      }

      // Check technology requirements
      if (expeditionConfig.unlockRequirement?.technology) {
        const requiredTech = expeditionConfig.unlockRequirement.technology;
        const hasTech = state.technologies.some(
          (t) => t.id === requiredTech && t.isResearched
        );
        if (!hasTech) {
          toast({
            title: "Missing required technology",
            variant: "destructive",
          });
          return state;
        }
      }

      // Check milestone requirements
      if (expeditionConfig.unlockRequirement?.milestoneId) {
        const requiredMilestone =
          expeditionConfig.unlockRequirement.milestoneId;
        const hasMilestone = state.milestones.some(
          (m) => m.id === requiredMilestone && m.completed
        );
        if (!hasMilestone) {
          toast({
            title: "Required milestone not completed",
            variant: "destructive",
          });
          return state;
        }
      }

      // Check resource requirements
      if (
        !canAffordCost(state.resources, missionConfig.requirements.resources)
      ) {
        toast({ title: "Insufficient Resources", variant: "destructive" });
        return state;
      }

      // Check personnel requirements
      if (state.population.available < missionConfig.requirements.personnel) {
        toast({ title: "Not Enough Personnel", variant: "destructive" });
        return state;
      }

      // Check equipment requirements if any
      if (missionConfig.requirements.equipment) {
        // This would need to be implemented with an equipment system
        // For now, we'll assume equipment requirements are met
      }

      // Check technology requirements for the mission
      if (missionConfig.requirements.technology?.length) {
        const hasTechs = missionConfig.requirements.technology.every((techId) =>
          state.technologies.some((t) => t.id === techId && t.isResearched)
        );
        if (!hasTechs) {
          toast({
            title: "Missing required technologies for this mission",
            variant: "destructive",
          });
          return state;
        }
      }

      // Deduct resources
      const newResources = applyResourceCost(
        state.resources,
        missionConfig.requirements.resources
      );

      // Assign personnel
      const newPopulation = {
        ...state.population,
        available:
          state.population.available - missionConfig.requirements.personnel,
      };

      // Generate events for the expedition
      const events = generateExpeditionEvents(
        expeditionType,
        missionType,
        missionConfig.eventChance,
        missionConfig.eventPool
      );

      // Calculate potential rewards
      const rewards = calculateExpeditionRewards(missionConfig);

      // Create new expedition
      const newExpedition: Expedition = {
        id: generateId(),
        type: expeditionType,
        mission: missionType,
        duration: expeditionConfig.baseStats.duration,
        timeLeft: expeditionConfig.baseStats.duration,
        status: "active",
        assignedResources: missionConfig.requirements.resources,
        assignedPersonnel: missionConfig.requirements.personnel,
        events: events,
        rewards: rewards,
        successChance: expeditionConfig.baseStats.successChance,
        missionName: missionConfig.name,
        missionIcon: missionConfig.icon,
      };

      return {
        ...state,
        resources: newResources,
        population: newPopulation,
        expeditions: [...state.expeditions, newExpedition],
      };
    }

    case "UPDATE_EXPEDITIONS": {
      const { currentTime } = action.payload;
      const deltaTime = (currentTime - state.lastUpdate) / 1000;

      let newResources = { ...state.resources };
      let newPopulation = { ...state.population };
      let completedExpeditions = [];

      const updatedExpeditions = state.expeditions.map((expedition) => {
        if (expedition.status !== "active") return expedition;

        const newTimeLeft = Math.max(0, expedition.timeLeft - deltaTime);
        let newStatus = expedition.status;

        // Check if expedition is completed
        if (newTimeLeft <= 0) {
          newStatus = determineExpeditionOutcome(expedition);

          // If expedition was successful, add rewards
          if (newStatus === "completed") {
            newResources = addExpeditionRewards(
              newResources,
              expedition.rewards
            );
            completedExpeditions.push({
              name: expedition.missionName,
              rewards: expedition.rewards,
            });
          }

          // Return personnel to available pool
          newPopulation = {
            ...newPopulation,
            available: newPopulation.available + expedition.assignedPersonnel,
          };

          // Check for events that should trigger
          if (
            expedition.events.length > 0 &&
            Math.random() * 100 < expedition.eventChance
          ) {
            return {
              ...expedition,
              timeLeft: 0,
              status: "event_pending",
              currentEvent: expedition.events[0],
            };
          }
        }

        return {
          ...expedition,
          timeLeft: newTimeLeft,
          status: newStatus,
        };
      });

      // Show toast notifications for completed expeditions
      completedExpeditions.forEach((exp) => {
        toast({
          title: `Expedition completed: ${exp.name}`,
          description: `Your team has returned with resources!`,
          variant: "default",
        });
      });

      return {
        ...state,
        expeditions: updatedExpeditions,
        resources: newResources,
        population: newPopulation,
      };
    }

    case "HANDLE_EXPEDITION_EVENT": {
      const { expeditionId, choiceId } = action.payload;

      const expedition = state.expeditions.find((e) => e.id === expeditionId);
      if (!expedition || !expedition.currentEvent) return state;

      const event = expedition.currentEvent;
      const choice = event.choices.find((c) => c.id === choiceId);
      if (!choice) return state;

      // Check if requirements for this choice are met
      if (choice.requiresResource) {
        if (!canAffordCost(state.resources, choice.requiresResource)) {
          toast({
            title: "Insufficient resources for this choice",
            variant: "destructive",
          });
          return state;
        }
      }

      if (
        choice.requiresPersonnel &&
        state.population.available < choice.requiresPersonnel
      ) {
        toast({
          title: "Not enough available personnel for this choice",
          variant: "destructive",
        });
        return state;
      }

      // Determine outcome based on probabilities
      const randomValue = Math.random() * 100;
      let outcomeType: string | null = null;
      let cumulativeProbability = 0;

      for (const [type, probability] of Object.entries(choice.outcomeChances)) {
        cumulativeProbability += probability || 0;
        if (randomValue <= cumulativeProbability) {
          outcomeType = type;
          break;
        }
      }

      if (!outcomeType) outcomeType = "failure"; // Default to failure if no outcome is selected

      // Find the outcome object
      const outcomeKey = `${choice.id}_${outcomeType}`;
      const outcome = event.outcomes[outcomeKey];

      if (!outcome) {
        toast({
          title: "Error processing event outcome",
          variant: "destructive",
        });
        return state;
      }

      // Apply resource costs from choice if any
      let newResources = { ...state.resources };
      if (choice.requiresResource) {
        newResources = applyResourceCost(newResources, choice.requiresResource);
      }

      // Apply outcome effects
      if (outcome.effects.resources) {
        for (const [resource, amount] of Object.entries(
          outcome.effects.resources
        )) {
          if (amount) {
            const resourceType = resource as ResourceType;
            newResources[resourceType] = {
              ...newResources[resourceType],
              amount: Math.max(0, newResources[resourceType].amount + amount),
            };
          }
        }
      }

      // Apply personnel changes
      let newPopulation = { ...state.population };
      if (outcome.effects.personnel) {
        newPopulation = {
          ...newPopulation,
          available: Math.max(
            0,
            newPopulation.available + outcome.effects.personnel
          ),
        };
      }

      // Apply expedition modifiers
      const updatedExpeditions = state.expeditions.map((exp) => {
        if (exp.id !== expeditionId) return exp;

        let updatedExpedition = { ...exp };

        // Remove current event
        delete updatedExpedition.currentEvent;

        // Apply time modifier if any
        if (outcome.effects.expedition?.timeModifier) {
          const modifier = outcome.effects.expedition.timeModifier / 100;
          updatedExpedition.timeLeft =
            updatedExpedition.timeLeft * (1 + modifier);
        }

        // Apply success chance modifier if any
        if (outcome.effects.expedition?.successChanceModifier) {
          updatedExpedition.successChance +=
            outcome.effects.expedition.successChanceModifier;
        }

        // Continue expedition
        updatedExpedition.status = "active";

        return updatedExpedition;
      });

      // Show notification with outcome
      toast({
        title: event.title,
        description: outcome.description,
        variant:
          outcome.type === "critical_failure" ? "destructive" : "default",
      });

      // Unlock new event if specified
      if (outcome.effects.unlockEvent) {
        // Logic to unlock new event would go here
        // This might involve adding to a player's "discovered events" list
      }

      return {
        ...state,
        resources: newResources,
        population: newPopulation,
        expeditions: updatedExpeditions,
      };
    }

    case "RECALL_EXPEDITION": {
      const { expeditionId } = action.payload;

      return {
        ...state,
        expeditions: state.expeditions.map((expedition) => {
          if (expedition.id !== expeditionId) return expedition;

          // If expedition is active, set it to "returning" status
          if (expedition.status === "active") {
            // Calculate return time (typically half the original duration)
            const returnTime = expedition.duration * 0.5;

            return {
              ...expedition,
              status: "returning",
              timeLeft: returnTime,
              // Reduce rewards based on completion percentage
              rewards: reduceRewardsByCompletion(
                expedition.rewards,
                1 - expedition.timeLeft / expedition.duration
              ),
            };
          }

          return expedition;
        }),
      };
    }

    case "DISMISS_EXPEDITION": {
      const { expeditionId } = action.payload;

      // Find the expedition to dismiss
      const expedition = state.expeditions.find((e) => e.id === expeditionId);
      if (!expedition || expedition.status === "active") return state;

      // Return personnel to available pool
      const newPopulation = {
        ...state.population,
        available: state.population.available + expedition.assignedPersonnel,
      };

      return {
        ...state,
        population: newPopulation,
        expeditions: state.expeditions.filter((e) => e.id !== expeditionId),
      };
    }

    default:
      return state;
  }
};

// Helper functions
const generateExpeditionEvents = (
  expeditionType: ExpeditionType,
  missionType: MissionType,
  eventChance: number,
  eventPool: string[]
): ExpeditionEvent[] => {
  // Check if an event should occur at all
  if (Math.random() * 100 > eventChance) {
    return [];
  }

  // Filter available events based on expedition type and mission type
  const availableEvents = expeditionEvents.filter((event) => {
    // Check if event ID is in the event pool
    if (!eventPool.includes(event.id)) return false;

    // Check application conditions
    const conditions = event.applicationConditions;
    if (!conditions) return true;

    // Check expedition type condition
    if (
      conditions.expeditionTypes &&
      !conditions.expeditionTypes.includes(expeditionType)
    ) {
      return false;
    }

    // Check mission type condition
    if (
      conditions.missionTypes &&
      !conditions.missionTypes.includes(missionType)
    ) {
      return false;
    }

    // Apply event chance
    return conditions.chance ? Math.random() * 100 < conditions.chance : true;
  });

  // If no events match criteria, return empty array
  if (availableEvents.length === 0) return [];

  // Select a random event from available ones
  const selectedEvent =
    availableEvents[Math.floor(Math.random() * availableEvents.length)];

  return [selectedEvent];
};

const calculateExpeditionRewards = (
  missionConfig: any
): Partial<Record<ResourceType, number>> => {
  const rewards: Partial<Record<ResourceType, number>> = {};

  // Add guaranteed rewards
  if (missionConfig.rewards.guaranteed) {
    Object.entries(missionConfig.rewards.guaranteed).forEach(
      ([resource, amount]) => {
        rewards[resource as ResourceType] = amount as number;
      }
    );
  }

  // Add random rewards based on chance
  if (missionConfig.rewards.random) {
    missionConfig.rewards.random.forEach((rewardConfig: any) => {
      if (Math.random() * 100 < rewardConfig.chance) {
        const resource = rewardConfig.resource as ResourceType;
        const amount = Math.floor(
          rewardConfig.min +
            Math.random() * (rewardConfig.max - rewardConfig.min)
        );

        rewards[resource] = (rewards[resource] || 0) + amount;
      }
    });
  }

  return rewards;
};

const determineExpeditionOutcome = (
  expedition: Expedition
): "completed" | "failed" => {
  // Base success chance from expedition
  const baseChance = expedition.successChance || 75;

  // Calculate actual success chance based on any modifiers
  const actualChance = Math.min(100, Math.max(0, baseChance));

  // Determine if expedition succeeded
  return Math.random() * 100 < actualChance ? "completed" : "failed";
};

const addExpeditionRewards = (
  resources: ResourcesState,
  rewards?: Partial<Record<ResourceType, number>>
): ResourcesState => {
  if (!rewards) return resources;

  return Object.entries(rewards).reduce((acc, [resource, amount]) => {
    const resourceType = resource as ResourceType;

    // Check if resource type exists
    if (!acc[resourceType]) return acc;

    // Calculate new amount, respecting capacity
    const newAmount = Math.min(
      acc[resourceType].amount + (amount || 0),
      acc[resourceType].capacity
    );

    return {
      ...acc,
      [resourceType]: {
        ...acc[resourceType],
        amount: newAmount,
      },
    };
  }, resources);
};

const reduceRewardsByCompletion = (
  rewards?: Partial<Record<ResourceType, number>>,
  completionPercentage = 0
): Partial<Record<ResourceType, number>> => {
  if (!rewards) return {};

  return Object.entries(rewards).reduce(
    (acc, [resource, amount]) => ({
      ...acc,
      [resource]: Math.floor((amount || 0) * completionPercentage),
    }),
    {} as Partial<Record<ResourceType, number>>
  );
};
