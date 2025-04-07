// expeditionReducer.ts
import { generateId } from "../initialData";
import { GameState, ResourceType } from "../types";
import {
  Expedition,
  ExpeditionEvent,
  ExpeditionEventEffect,
  ExpeditionType,
  ResourceAmount,
} from "@/types/expedition";
import { expeditionEvents } from "@/data/expeditionEvents";
import { toast } from "@/components/ui/use-toast";

// Stałe
const BASE_EXPEDITION_TIME = 30; // 30 minut dla tier 0
const TIME_PER_TIER = 15; // +15 minut na każdy tier
const CREW_PER_TIER = 1; // +1 załogant na każdy tier
const EVENT_INTERVAL = 10; // zdarzenie co 10 minut

// Helpery
const calculateExpeditionDuration = (tier: number): number => {
  return BASE_EXPEDITION_TIME + tier * TIME_PER_TIER;
};

const calculateRequiredCrew = (tier: number): number => {
  return 2 + tier * CREW_PER_TIER; // min 2 załogantów
};

const getRandomEvent = (expedition: Expedition): ExpeditionEvent => {
  const possibleEvents = expeditionEvents.filter((event) => {
    // Filtruj po typie ekspedycji jeśli określono
    if (event.type && !event.type.includes(expedition.type)) return false;

    // Filtruj po tierze jeśli określono
    if (event.minTier !== undefined && expedition.tier < event.minTier)
      return false;
    if (event.maxTier !== undefined && expedition.tier > event.maxTier)
      return false;

    return true;
  });

  // Ważone losowanie
  const totalWeight = possibleEvents.reduce(
    (sum, event) => sum + (event.weight || 1),
    0
  );
  let random = Math.random() * totalWeight;
  let selectedEvent: ExpeditionEvent = possibleEvents[0];

  for (const event of possibleEvents) {
    random -= event.weight || 1;
    if (random <= 0) {
      selectedEvent = event;
      break;
    }
  }

  return selectedEvent;
};

const applyEventEffects = (
  effects: ExpeditionEventEffect[],
  expedition: Expedition,
  state: GameState
): { expedition: Expedition; state: GameState } => {
  let newExpedition = { ...expedition };
  let newState = { ...state };

  for (const effect of effects) {
    const value =
      typeof effect.value === "function"
        ? effect.value(expedition)
        : effect.value;

    switch (effect.type) {
      case "time":
        newExpedition.duration += value as number;
        break;

      case "resources":
        const resourceType = effect.resourceType as ResourceType;
        if (newState.resources[resourceType]) {
          newState.resources[resourceType].amount += value as number;
        }
        break;

      case "crew":
        newExpedition.crew = Math.max(
          1,
          newExpedition.crew + (value as number)
        );
        break;

      case "reward":
        if (!newExpedition.rewards) newExpedition.rewards = {};
        const rewards = value as ResourceAmount;
        for (const [res, amount] of Object.entries(rewards)) {
          newExpedition.rewards[res] =
            (newExpedition.rewards[res] || 0) + amount;
        }
        break;

      case "fail":
        newExpedition.status = "failed";
        break;
    }
  }

  return { expedition: newExpedition, state: newState };
};

// Główne funkcje
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
    duration: calculateExpeditionDuration(tier),
    elapsed: 0,
    crew: requiredCrew,
    status: "preparing",
    events: [],
    nextEventTime: EVENT_INTERVAL, // pierwsze zdarzenie po 10 minutach
  };

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

export const launchExpedition = (
  state: GameState,
  expeditionId: string
): GameState => {
  const expeditionIndex = state.expeditions.findIndex(
    (e) => e.id === expeditionId
  );
  if (expeditionIndex === -1) return state;

  const expedition = state.expeditions[expeditionIndex];
  if (expedition.status !== "preparing") return state;

  const updatedExpedition: Expedition = {
    ...expedition,
    status: "in_progress",
  };

  const newExpeditions = [...state.expeditions];
  newExpeditions[expeditionIndex] = updatedExpedition;

  toast({
    title: "Expedition Launched",
    description: `Your ${expedition.type} expedition has begun!`,
  });

  return {
    ...state,
    expeditions: newExpeditions,
  };
};

export const handleExpeditionTick = (
  state: GameState,
  deltaTime: number // w sekundach
): GameState => {
  if (state.expeditions.length === 0) return state;

  const deltaMinutes = deltaTime / 60;
  let newState = { ...state };
  let updatedExpeditions = [...state.expeditions];

  for (let i = 0; i < updatedExpeditions.length; i++) {
    const expedition = updatedExpeditions[i];

    // Pomijaj nieaktywne ekspedycje
    if (expedition.status !== "in_progress") continue;

    let newExpedition = { ...expedition };

    // Sprawdź czy są nierozwiązane zdarzenia
    const hasPendingEvents = newExpedition.events.some(
      (e) => e.chosenOptionIndex === -1
    );

    // Aktualizuj czas TYLKO jeśli nie ma oczekujących zdarzeń
    if (!hasPendingEvents) {
      newExpedition.elapsed += deltaMinutes;
      newExpedition.nextEventTime -= deltaMinutes;

      // Sprawdź czy nadszedł czas na nowe zdarzenie
      if (newExpedition.nextEventTime <= 0) {
        const event = getRandomEvent(newExpedition);
        newExpedition.events.push({
          eventId: event.id,
          chosenOptionIndex: -1, // oznacza wymagającą akcji gracza
          time: newExpedition.elapsed,
        });
        newExpedition.nextEventTime = EVENT_INTERVAL; // reset timer

        // Zatrzymaj ekspedycję do czasu reakcji gracza
        toast({
          title: "Expedition Event!",
          description: "New event requires your attention",
        });
      }
    }

    // Sprawdź czy ekspedycja się zakończyła
    if (newExpedition.elapsed >= newExpedition.duration) {
      newExpedition.status = "completed";

      // Dodaj nagrody
      if (newExpedition.rewards) {
        for (const [res, amount] of Object.entries(newExpedition.rewards)) {
          if (newState.resources[res as ResourceType]) {
            newState.resources[res as ResourceType].amount += Number(amount);
          }
        }
      }

      // Zwróć załogantów
      newState.population.available += newExpedition.crew;

      toast({
        title: "Expedition Completed",
        description: `Your ${newExpedition.type} expedition has returned!`,
      });
    }

    updatedExpeditions[i] = newExpedition;
  }

  // Usuń zakończone ekspedycje po minucie (dla efektu wizualnego)
  if (state.lastUpdate % 60 === 0) {
    updatedExpeditions = updatedExpeditions.filter(
      (e) =>
        e.status === "preparing" ||
        e.status === "in_progress" ||
        (e.status === "completed" && e.elapsed - e.duration < 1) ||
        (e.status === "failed" && e.elapsed - e.duration < 1)
    );
  }

  return {
    ...newState,
    expeditions: updatedExpeditions,
  };
};

export const handleExpeditionEventChoice = (
  state: GameState,
  expeditionId: string,
  eventIndex: number,
  optionIndex: number
): GameState => {
  const expeditionIndex = state.expeditions.findIndex(
    (e) => e.id === expeditionId
  );
  if (expeditionIndex === -1) return state;

  const expedition = state.expeditions[expeditionIndex];
  if (eventIndex >= expedition.events.length) return state;

  // Znajdź oryginalne zdarzenie z definicji
  const eventLog = expedition.events[eventIndex];
  const originalEvent = expeditionEvents.find((e) => e.id === eventLog.eventId);
  if (!originalEvent || optionIndex >= originalEvent.options.length)
    return state;

  const chosenOption = originalEvent.options[optionIndex];

  // Zastosuj efekty wybranej opcji
  let newExpedition = { ...expedition };
  let newState = { ...state };

  const result = applyEventEffects(
    chosenOption.effects,
    newExpedition,
    newState
  );
  newExpedition = result.expedition;
  newState = result.state;

  // Zaktualizuj log zdarzenia
  newExpedition.events = [...newExpedition.events];
  newExpedition.events[eventIndex] = {
    ...newExpedition.events[eventIndex],
    chosenOptionIndex: optionIndex,
  };

  // Zaktualizuj stan
  const newExpeditions = [...newState.expeditions];
  newExpeditions[expeditionIndex] = newExpedition;

  return {
    ...newState,
    expeditions: newExpeditions,
  };
};

export const cancelExpedition = (
  state: GameState,
  expeditionId: string
): GameState => {
  const expeditionIndex = state.expeditions.findIndex(
    (e) => e.id === expeditionId
  );
  if (expeditionIndex === -1) return state;

  const expedition = state.expeditions[expeditionIndex];
  if (expedition.status !== "preparing") return state;

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
