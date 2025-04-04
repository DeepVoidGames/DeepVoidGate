import { generateId } from "@/store/initialData";
import {
  ResourceType,
  Expedition,
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

const EXPEDITION_DURATIONS = {
  planetary: 300, // 5 minut
  cosmic: 1800, // 30 minut
};

const MISSION_REQUIREMENTS: Record<
  ExpeditionType,
  Record<
    MissionType,
    { resources: Partial<Record<ResourceType, number>>; personnel: number }
  >
> = {
  planetary: {
    resource: { resources: { energy: 100, water: 50 }, personnel: 3 },
    research: { resources: { energy: 150, metals: 50 }, personnel: 5 },
    combat: { resources: { energy: 200, metals: 30 }, personnel: 8 },
  },
  cosmic: {
    resource: { resources: { energy: 500, metals: 100 }, personnel: 10 },
    research: { resources: { energy: 700, metals: 50 }, personnel: 15 },
    combat: { resources: { energy: 1000, metals: 20 }, personnel: 20 },
  },
};

export const handleExpeditions = (
  state: GameState,
  action: GameAction
): GameState => {
  switch (action.type) {
    case "START_EXPEDITION": {
      const { expeditionType, missionType } = action.payload;
      const requirements = MISSION_REQUIREMENTS[expeditionType][missionType];

      // Sprawdź dostępność zasobów
      if (!canAffordCost(state.resources, requirements.resources)) {
        toast({ title: "Insufficient Resources", variant: "destructive" });
        return state;
      }

      // Sprawdź dostępność personelu
      if (state.population.available < requirements.personnel) {
        toast({ title: "Not Enough Personnel", variant: "destructive" });
        return state;
      }

      // Odejmij koszty
      const newResources = applyResourceCost(
        state.resources,
        requirements.resources
      );
      const newPopulation = {
        ...state.population,
        available: state.population.available - requirements.personnel,
      };

      // Stwórz nową ekspedycję
      const newExpedition: Expedition = {
        id: generateId(),
        type: expeditionType,
        mission: missionType,
        duration: EXPEDITION_DURATIONS[expeditionType],
        timeLeft: EXPEDITION_DURATIONS[expeditionType],
        status: "active",
        assignedResources: requirements.resources,
        assignedPersonnel: requirements.personnel,
        events: generateExpeditionEvents(expeditionType),
        rewards: calculateExpeditionRewards(expeditionType, missionType),
      };

      return {
        ...state,
        resources: newResources,
        population: newPopulation,
        expeditions: [...state.expeditions, newExpedition],
      };
    }

    case "UPDATE_EXPEDITION": {
      const { currentTime } = action.payload;
      const deltaTime = (currentTime - state.lastUpdate) / 1000;

      return {
        ...state,
        expeditions: state.expeditions.map((expedition) => {
          if (expedition.status !== "active") return expedition;

          const newTimeLeft = expedition.timeLeft - deltaTime;
          let newStatus = expedition.status;

          if (newTimeLeft <= 0) {
            newStatus = "completed";
            // Dodaj nagrody po zakończeniu
            return {
              ...expedition,
              timeLeft: 0,
              status: newStatus,
              resources: addExpeditionRewards(
                state.resources,
                expedition.rewards
              ),
            };
          }

          return { ...expedition, timeLeft: newTimeLeft };
        }),
      };
    }

    case "HANDLE_EXPEDITION_EVENT": {
      const { expeditionId, choiceIndex } = action.payload;
      return {
        ...state,
        expeditions: state.expeditions.map((expedition) => {
          if (expedition.id !== expeditionId) return expedition;

          const event = expedition.events[0];
          const choice = event.choices[choiceIndex];

          // Zastosuj efekty wyboru
          let newResources = choice.cost
            ? applyResourceCost(state.resources, choice.cost)
            : state.resources;

          if (choice.outcomeEffects) {
            newResources = Object.entries(choice.outcomeEffects).reduce(
              (acc, [resource, value]) => ({
                ...acc,
                [resource]: {
                  ...acc[resource as ResourceType],
                  amount: Math.max(
                    0,
                    acc[resource as ResourceType].amount + (value || 0)
                  ),
                },
              }),
              newResources
            );
          }

          return {
            ...expedition,
            events: expedition.events.slice(1),
            resources: newResources,
          };
        }),
      };
    }

    default:
      return state;
  }
};

// Helper functions
const generateExpeditionEvents = (type: ExpeditionType): ExpeditionEvent[] => {
  const events: ExpeditionEvent[] = [];
  // Logika generowania zdarzeń...
  return events;
};

const calculateExpeditionRewards = (
  type: ExpeditionType,
  mission: MissionType
): Partial<Record<ResourceType, number>> => {
  const rewards: Partial<Record<ResourceType, number>> = {};
  // Logika obliczania nagród...
  return rewards;
};

const addExpeditionRewards = (
  resources: ResourcesState,
  rewards?: Partial<Record<ResourceType, number>>
): ResourcesState => {
  if (!rewards) return resources;

  return Object.entries(rewards).reduce(
    (acc, [resource, amount]) => ({
      ...acc,
      [resource]: {
        ...acc[resource as ResourceType],
        amount: acc[resource as ResourceType].amount + (amount || 0),
      },
    }),
    resources
  );
};
