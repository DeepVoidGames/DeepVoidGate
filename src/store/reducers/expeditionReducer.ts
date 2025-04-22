// expeditionReducer.ts
import { generateId } from "../initialData";
import { GameState, ResourceType, Technology } from "../types";
import {
  Expedition,
  ExpeditionEvent,
  ExpeditionEventEffect,
  ExpeditionType,
  ResourceAmount,
} from "@/types/expedition";
import { expeditionEvents } from "@/data/expeditionEvents";
import { toast } from "@/components/ui/use-toast";
import { addArtifact, getArtifactsByExpeditionsTier } from "./artifactsReducer";

// Stałe
export const BASE_EXPEDITION_TIME = 15; // 30 minut dla tier 0
export const TIME_PER_TIER = 15; // +15 minut na każdy tier
export const CREW_PER_TIER = 5; // +5 załogant na każdy tier
export const EVENT_INTERVAL = 10; // zdarzenie co 10 minut
export const TIER_MULTIPLIER = 1.5; // mnożnik dla nagród za każdy tier

const BASE_REWARDS: Record<ExpeditionType, ResourceAmount> = {
  mining: { metals: 5000 },
  scientific: { science: 5000 },
};

export const getBaseExpeditionReward = (
  type: ExpeditionType,
  tier: number
): ResourceAmount => {
  const baseRewards = BASE_REWARDS[type];
  const multipliedRewards: ResourceAmount = {};

  for (const [resource, amount] of Object.entries(baseRewards)) {
    multipliedRewards[resource as ResourceType] = Math.round(
      amount * Math.pow(TIER_MULTIPLIER, tier)
    );
  }

  return multipliedRewards;
};

export const getExpectedExpeditionRewards = (
  type: ExpeditionType,
  tier: number
) => {
  const base = getBaseExpeditionReward(type, tier);
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

export const getCurrentExpeditionRewards = (
  expedition: Expedition
): ResourceAmount => {
  return {
    ...getBaseExpeditionReward(expedition.type, expedition.tier),
    ...expedition.rewards,
  };
};

export const getPossibleTechnologies = (
  type: ExpeditionType,
  technologies: Technology[]
): Technology[] => {
  if (type !== "scientific") return [];

  return technologies.filter(
    (tech) =>
      !tech.isResearched &&
      tech.locked === true &&
      tech.prerequisites.every((prereq) =>
        technologies.some((t) => t.id === prereq && t.isResearched)
      )
  );
};

export const calculateReward = (
  type: ExpeditionType,
  tier: number
): ResourceAmount => {
  const base = getBaseExpeditionReward(type, tier);
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

export const formatRewardsForUI = (rewards: ResourceAmount) => {
  return Object.entries(rewards)
    .filter(([_, amount]) => amount > 0)
    .map(([resource, amount]) => ({
      type: resource as ResourceType,
      amount: amount.toLocaleString(),
    }));
};

const getReward = (expedition: Expedition, state: GameState): GameState => {
  let newState = { ...state };

  // Sprawdź czy nagroda została już przyznana
  if (expedition.rewardsCollected) {
    return newState;
  }

  // Zbierz wszystkie nagrody - zarówno bazowe jak i z eventów
  const totalRewards: ResourceAmount = calculateReward(
    expedition.type,
    expedition.tier
  );

  // Połącz z nagrodami z wydarzeń (jeśli istnieją)
  if (expedition.rewards) {
    Object.entries(expedition.rewards).forEach(([resource, amount]) => {
      const resourceType = resource as ResourceType;
      totalRewards[resourceType] = (totalRewards[resourceType] || 0) + amount;
    });
  }

  // Logowanie dla debugowania
  // console.log("Expedition rewards to add:", totalRewards);
  // console.log("Before adding rewards:", newState.resources);

  // Dodaj nagrody do stanu gry
  for (const [resource, amount] of Object.entries(totalRewards)) {
    const resourceType = resource as ResourceType;
    if (newState.resources[resourceType]) {
      const numAmount = Number(amount);
      if (!isNaN(numAmount) && numAmount > 0) {
        newState.resources[resourceType].amount += numAmount;
        console.log(`Adding ${numAmount} to ${resourceType}`);
      }
    }
  }

  console.log("After adding rewards:", newState.resources);

  if (expedition.unlockedTechnologies) {
    expedition.unlockedTechnologies.forEach((techId) => {
      const techIndex = newState.technologies.findIndex((t) => t.id === techId);
      if (techIndex !== -1) {
        newState.technologies[techIndex] = {
          ...newState.technologies[techIndex],
          isResearched: true,
        };
      }
    });
  }

  // Zwróć załogantów
  newState.population.available += expedition.crew;

  // Oznacz ekspedycję jako przetworzoną
  const expeditionIndex = newState.expeditions.findIndex(
    (e) => e.id === expedition.id
  );

  if (expeditionIndex > -1) {
    newState.expeditions[expeditionIndex] = {
      ...expedition,
      rewards: undefined,
      rewardsCollected: true, // dodana flaga
    };
  }

  // Artefkaty
  if (expedition.type === "mining") {
    const rng = Math.random();
    // 10% szans na artefakt

    if (rng < 0.1) {
      const artifacts = getArtifactsByExpeditionsTier(
        newState,
        expedition.tier
      );

      const artifactIndex = Math.floor(Math.random() * artifacts.length);
      const artifact = artifacts[artifactIndex];
      const artifactAmount = Math.floor(Math.random() * 5) + 1; // 1-5 sztuk
      const artifactName = artifact.name;
      newState = addArtifact(artifactName, artifactAmount, newState);
      toast({
        title: "Artifact Found!",
        description: `You have found an ${artifact.name}`,
      });
    }
  }

  toast({
    title: "Expedition Completed",
    description: `Your ${expedition.type} expedition has returned with resources!`,
  });

  return newState;
};

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

      case "reward":
        if (!newExpedition.rewards) newExpedition.rewards = {};
        const rewards = value as ResourceAmount;
        for (const [res, amount] of Object.entries(rewards)) {
          newExpedition.rewards[res] =
            (newExpedition.rewards[res] || 0) + amount;
        }
        break;

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
    rewards: calculateReward(type, tier),
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
  let expeditionsToProcess = [];

  // Najpierw aktualizujemy stan wszystkich ekspedycji
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

      if (newExpedition.nextEventTime <= 0) {
        const event = getRandomEvent(newExpedition);
        newExpedition.events.push({
          id: generateId(), // Dodajemy unikalne ID dla każdego wydarzenia
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
    } else {
      newExpedition.events = newExpedition.events.map((event) => {
        if (!event.id) {
          return { ...event, id: generateId() };
        }
        return event;
      });
    }

    // Sprawdź czy ekspedycja się zakończyła
    if (
      newExpedition.elapsed >= newExpedition.duration &&
      newExpedition.status === "in_progress"
    ) {
      newExpedition.status = "completed";
      // Dodaj do listy ekspedycji do przetworzenia
      expeditionsToProcess.push(newExpedition);
    }

    updatedExpeditions[i] = newExpedition;
  }

  // Zaktualizuj ekspedycje w stanie
  newState = {
    ...newState,
    expeditions: updatedExpeditions,
  };

  // Teraz przetwórz zakończone ekspedycje
  for (const expedition of expeditionsToProcess) {
    if (!expedition.rewardsCollected) {
      newState = getReward(expedition, newState);
    }
  }

  // Usuń zakończone ekspedycje po minucie (dla efektu wizualnego)
  if (state.lastUpdate % 60 === 0) {
    const newExpeditions = newState.expeditions.filter(
      (e) =>
        e.status === "preparing" ||
        e.status === "in_progress" ||
        (e.status === "completed" && e.elapsed - e.duration < 1) ||
        (e.status === "failed" && e.elapsed - e.duration < 1)
    );

    newState = {
      ...newState,
      expeditions: newExpeditions,
    };
  }

  return newState;
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
  console.log("Expedition index:", expeditionIndex);
  console.log("Event index:", eventIndex);

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

export const isExpedtionUnlocked = (state) => {
  return state.technologies.some(
    (tech) => tech.id === "advanced_hub_integration" && tech.isResearched
  );
};
