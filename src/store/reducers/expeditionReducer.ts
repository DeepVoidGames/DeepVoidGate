// expeditionReducer.ts
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

/**
 * Oblicza bazową nagrodę za ekspedycję danego typu i tieru.
 *
 * Nagroda jest skalowana wykładniczo na podstawie tieru ekspedycji z użyciem stałej `TIER_MULTIPLIER`.
 *
 * @param type - Typ ekspedycji (np. planetary, cosmic).
 * @param tier - Tier ekspedycji (0+), wpływa na skalowanie nagrody.
 * @returns Obiekt zawierający ilości nagród (zasobów) przypisanych do ekspedycji.
 */
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

/**
 * Zwraca oczekiwany zakres nagród za ekspedycję danego typu i tieru.
 *
 * Bazuje na nagrodzie podstawowej, zwracając dodatkowo minimalne (0×) i maksymalne (3×) możliwe wartości nagród.
 *
 * @param type - Typ ekspedycji (np. planetary, cosmic).
 * @param tier - Tier ekspedycji (0+), wpływa na wysokość nagród.
 * @returns Obiekt z bazowymi, minimalnymi i maksymalnymi możliwymi nagrodami za ekspedycję.
 */
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

/**
 * Zwraca aktualne nagrody za trwającą ekspedycję.
 *
 * Łączy bazowe nagrody wynikające z typu i tieru ekspedycji z aktualnie zapisanymi nagrodami ekspedycji.
 * Jeśli ekspedycja miała modyfikatory (np. z wydarzeń), są one uwzględnione w `expedition.rewards`.
 *
 * @param expedition - Obiekt reprezentujący ekspedycję.
 * @returns Łączne nagrody (bazowe + zmodyfikowane) jako mapę zasobów.
 */
export const getCurrentExpeditionRewards = (
  expedition: Expedition
): ResourceAmount => {
  return {
    ...getBaseExpeditionReward(expedition.type, expedition.tier),
    ...expedition.rewards,
  };
};

/**
 * Zwraca listę technologii możliwych do odkrycia w trakcie ekspedycji naukowej.
 *
 * Funkcja filtruje technologie, które:
 * - nie zostały jeszcze odkryte (`!tech.isResearched`),
 * - są zablokowane (`tech.locked === true`),
 * - mają wszystkie wymagania wstępne (`prerequisites`) spełnione przez już odkryte technologie.
 *
 * Działa tylko dla ekspedycji typu `"scientific"`, w przeciwnym razie zwraca pustą tablicę.
 *
 * @param type - Typ ekspedycji (np. "scientific").
 * @param technologies - Lista wszystkich technologii w grze.
 * @returns Tablica możliwych do odkrycia technologii.
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
      tech.expedtionMinTier != null &&
      tech.prerequisites.every((prereq) =>
        technologies.some((t) => t.id === prereq && t.isResearched)
      )
  );
};

/**
 * Oblicza nagrodę za ekspedycję na podstawie jej typu i poziomu.
 *
 * Nagroda jest obliczana na podstawie bazowej wartości zasobów dla danego typu i poziomu ekspedycji,
 * z losowym współczynnikiem mnożącym wynik w zakresie od 0.2 do 2.0.
 * Nagroda dla każdego zasobu nie może być mniejsza niż 20% bazowej wartości.
 *
 * @param type - Typ ekspedycji (np. "scientific", "planetary").
 * @param tier - Poziom ekspedycji, który wpływa na bazową wartość nagrody.
 * @returns Obiekt `ResourceAmount` zawierający nagrody w zasobach (np. `oxygen`, `water`).
 */
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

/**
 * Formatuje nagrody w zasobach dla interfejsu użytkownika.
 *
 * Ta funkcja przyjmuje obiekt `rewards` zawierający zasoby i ich ilości,
 * filtruje zasoby z ilościami większymi niż zero oraz formatuje ilości
 * zasobów do postaci tekstowej (z użyciem `toLocaleString()`).
 *
 * @param rewards - Obiekt zawierający zasoby i ich ilości.
 * @returns Tablica obiektów zawierających typ zasobu oraz sformatowaną ilość zasobu.
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
 * Przetwarza nagrody z ekspedycji i aktualizuje stan gry.
 *
 * Ta funkcja sprawdza, czy nagrody zostały już przyznane w ramach ekspedycji,
 * a następnie dodaje nagrody do zasobów gracza. Dodatkowo przetwarza technologie,
 * załogantów, artefakty i frakcje związane z typem ekspedycji.
 *
 * @param expedition - Ekspedycja, z której pochodzą nagrody.
 * @param state - Obecny stan gry, który zostanie zaktualizowany na podstawie nagród z ekspedycji.
 * @returns Zaktualizowany stan gry po przyznaniu nagród z ekspedycji.
 */
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
        // console.log(`Adding ${numAmount} to ${resourceType}`);
      }
    }
  }

  // console.log("After adding rewards:", newState.resources);

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
    // 45% szans na artefakt

    if (rng < 0.45) {
      const artifacts = getArtifactsByExpeditionTier(newState, expedition.tier);

      const artifactIndex = Math.floor(Math.random() * artifacts.length);
      const artifact = artifacts[artifactIndex];
      const artifactAmount = Math.floor(Math.random() * 5) + 1; // 1-5 sztuk
      const artifactName = artifact.name;
      newState = addArtifactCopies(artifactName, artifactAmount, newState);
      toast({
        title: "Artifact Found!",
        description: `You have found an ${artifact.name}`,
      });
    }
  }

  // Frakcje
  if (expedition.type === "scientific") {
    newState = updateFactionLoyalty(
      newState,
      newState.factions.find((f) => f.id == "StarUnderstanding")
        .id as FactionName,
      10 * (expedition.tier + 1)
    );
    newState = updateFactionLoyalty(
      newState,
      newState.factions.find((f) => f.id == "Biogenesis").id as FactionName,
      10 * (expedition.tier + 1)
    );
  } else if (expedition.type === "mining") {
    newState = updateFactionLoyalty(
      newState,
      newState.factions.find((f) => f.id == "Technocrats").id as FactionName,
      10 * (expedition.tier + 1)
    );
  }

  toast({
    title: "Expedition Completed",
    description: `Your ${expedition.type} expedition has returned with resources!`,
  });

  return newState;
};

/**
 * Oblicza czas trwania ekspedycji na podstawie poziomu i stanu gry.
 *
 * Czas trwania ekspedycji zależy od poziomu ekspedycji (`tier`) oraz artefaktów,
 * które mogą skrócić ten czas, np. "Time Crystal". Jeśli artefakt "Time Crystal"
 * jest odblokowany, czas trwania zostaje zmniejszony o określony procent na
 * podstawie liczby gwiazdek artefaktu.
 *
 * @param tier - Poziom ekspedycji, który wpływa na czas trwania.
 * @param state - Obecny stan gry, zawierający informacje o artefaktach.
 * @returns Czas trwania ekspedycji w jednostkach czasu (np. sekundach).
 */
export const calculateExpeditionDuration = (
  tier: number,
  state: GameState
): number => {
  const artifact = getArtifact("Time Crystal", state);

  if (!artifact?.isLocked) {
    const time = BASE_EXPEDITION_TIME + tier * TIME_PER_TIER;
    return time - time * (0.05 * (artifact?.stars + 1));
  }
  return BASE_EXPEDITION_TIME + tier * TIME_PER_TIER;
};

/**
 * Oblicza wymaganą liczbę załogantów na podstawie poziomu ekspedycji.
 *
 * Liczba załogantów jest obliczana na podstawie stałej wartości `CREW_PER_TIER`
 * oraz poziomu ekspedycji (`tier`). Wzrost liczby załogantów jest proporcjonalny
 * do poziomu ekspedycji.
 *
 * @param tier - Poziom ekspedycji, który wpływa na liczbę wymaganych załogantów.
 * @returns Wymagana liczba załogantów dla podanego poziomu ekspedycji.
 */
export const calculateRequiredCrew = (tier: number): number => {
  return CREW_PER_TIER + tier * CREW_PER_TIER;
};

/**
 * Wybiera losowe wydarzenie dla ekspedycji, biorąc pod uwagę typ ekspedycji,
 * poziom oraz wagę wydarzeń.
 *
 * Filtruje dostępne wydarzenia na podstawie typu ekspedycji i poziomu (tier),
 * a następnie wybiera jedno z nich w sposób ważony. Wybór wydarzenia jest
 * uzależniony od określonego typu ekspedycji, poziomu ekspedycji, oraz wagi
 * przypisanej do każdego wydarzenia.
 *
 * @param expedition - Obiekt reprezentujący ekspedycję, dla której generowane
 * wydarzenie (zawiera typ i poziom ekspedycji).
 * @returns Wylosowane wydarzenie pasujące do filtrów, w tym losowe na podstawie wagi.
 */
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

/**
 * Zastosowuje efekty wydarzeń do ekspedycji oraz stanu gry.
 *
 * Funkcja przetwarza efekty z listy, które mogą wpływać na czas trwania ekspedycji,
 * zasoby, liczbę członków załogi, nagrody, odkrywanie technologii, lub status
 * ekspedycji. Efekty są aplikowane na podstawie ich typu, a odpowiednie zmiany są
 * wprowadzane do ekspedycji i stanu gry.
 *
 * @param effects - Lista efektów, które mają zostać zastosowane na ekspedycji.
 * @param expedition - Obiekt reprezentujący ekspedycję, do której stosowane będą efekty.
 * @param state - Obiekt reprezentujący aktualny stan gry, który będzie aktualizowany
 * na podstawie efektów.
 * @returns Obiekt zawierający zaktualizowaną ekspedycję oraz stan gry.
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
      case "time":
        newExpedition.duration += value as number;
        break;

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
 * Rozpoczyna nową ekspedycję, sprawdzając, czy gracz ma wystarczającą liczbę dostępnych kolonistów,
 * a następnie aktualizuje stan gry w zależności od wyniku.
 *
 * Funkcja wykonuje następujące operacje:
 * - Sprawdza, czy gracz ma wystarczającą liczbę dostępnych kolonistów do wysłania na ekspedycję.
 * - Jeśli liczba kolonistów jest niewystarczająca, wyświetla komunikat o błędzie.
 * - Oblicza wymagany czas trwania ekspedycji oraz nagrody.
 * - Tworzy nowy obiekt ekspedycji i dodaje go do stanu gry.
 * - Zmniejsza liczbę dostępnych kolonistów w populacji.
 *
 * @param state - Obiekt reprezentujący aktualny stan gry.
 * @param type - Typ ekspedycji, która ma zostać rozpoczęta.
 * @param tier - Tier ekspedycji, który określa jej trudność oraz nagrody.
 * @returns Zaktualizowany stan gry po rozpoczęciu ekspedycji.
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
    duration: calculateExpeditionDuration(tier, state),
    elapsed: 0,
    crew: requiredCrew,
    status: "in_progress",
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

/**
 * Rozpoczyna ekspedycję, zmieniając jej status na "in_progress" jeśli jest w stanie "preparing".
 * Jeśli ekspedycja nie jest w stanie "preparing", funkcja nic nie zmienia.
 *
 * Funkcja wykonuje następujące operacje:
 * - Sprawdza, czy ekspedycja o podanym ID istnieje w stanie gry.
 * - Jeśli ekspedycja nie jest w stanie "preparing", funkcja nic nie zmienia.
 * - Zmienia status ekspedycji na "in_progress".
 * - Aktualizuje listę ekspedycji w stanie gry.
 * - Wyświetla komunikat o rozpoczęciu ekspedycji.
 *
 * @param state - Obiekt reprezentujący aktualny stan gry.
 * @param expeditionId - ID ekspedycji, którą gracz chce uruchomić.
 * @returns Zaktualizowany stan gry z rozpoczętą ekspedycją.
 */
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

/**
 * Aktualizuje stan ekspedycji w grze na podstawie upływu czasu (deltaTime).
 * Zajmuje się zarówno aktualizacją czasu trwania ekspedycji, jak i obsługą zdarzeń,
 * a także przetwarzaniem zakończonych ekspedycji.
 *
 * Funkcja wykonuje następujące operacje:
 * - Iteruje przez wszystkie aktywne ekspedycje, aktualizując ich stan.
 * - Dla ekspedycji w stanie "in_progress" aktualizuje czas trwania i sprawdza, czy wystąpiły nowe zdarzenia.
 * - Sprawdza, czy ekspedycja osiągnęła pełny czas trwania i zmienia jej status na "completed".
 * - Dodaje nowe wydarzenie do ekspedycji, gdy minął wymagany czas.
 * - Przetwarza zakończone ekspedycje, przyznając nagrody, jeśli nie zostały one jeszcze przyznane.
 * - Usuwa zakończone ekspedycje z listy po upływie minuty, dla efektu wizualnego.
 *
 * @param state - Obiekt reprezentujący aktualny stan gry.
 * @param deltaTime - Czas, który upłynął od ostatniego update'u, wyrażony w sekundach.
 * @returns Zaktualizowany stan gry po przetworzeniu wszystkich ekspedycji.
 */
export const handleExpeditionTick = (
  state: GameState,
  deltaTime: number // w sekundach
): GameState => {
  if (state.expeditions.length === 0) return state;

  const deltaMinutes = deltaTime / 60;
  let newState = { ...state };
  const updatedExpeditions = [...state.expeditions];
  const expeditionsToProcess = [];

  // Najpierw aktualizujemy stan wszystkich ekspedycji
  for (let i = 0; i < updatedExpeditions.length; i++) {
    const expedition = updatedExpeditions[i];

    // Pomijaj nieaktywne ekspedycje
    if (expedition.status !== "in_progress") continue;

    const newExpedition = { ...expedition };

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

/**
 * Obsługuje wybór opcji w zdarzeniu ekspedycji przez gracza.
 * Zaktualizowuje stan ekspedycji i gry na podstawie wybranej opcji,
 * stosując efekty związane z tą opcją.
 *
 * Funkcja wykonuje następujące operacje:
 * - Wyszukuje ekspedycję w stanie gry na podstawie jej identyfikatora.
 * - Sprawdza, czy zdarzenie istnieje oraz czy wybrana opcja jest prawidłowa.
 * - Zastosowuje efekty wybranej opcji na ekspedycji i stanie gry.
 * - Zaktualizowuje log zdarzeń ekspedycji, zaznaczając wybraną opcję.
 * - Zwraca zaktualizowany stan gry z nowymi danymi o ekspedycji.
 *
 * @param state - Obiekt reprezentujący aktualny stan gry.
 * @param expeditionId - Identyfikator ekspedycji, której zdarzenie zostało wybrane.
 * @param eventIndex - Indeks wybranego zdarzenia w ramach ekspedycji.
 * @param optionIndex - Indeks wybranej opcji w ramach zdarzenia.
 * @returns Zaktualizowany stan gry po przetworzeniu wyboru opcji w zdarzeniu.
 */
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
  // console.log("Expedition index:", expeditionIndex);
  // console.log("Event index:", eventIndex);

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

/**
 * Anuluje ekspedycję, zwracając załogantów do dostępnej puli.
 * Ekspedycja musi być w stanie "preparing", aby mogła zostać anulowana.
 *
 * Funkcja wykonuje następujące operacje:
 * - Sprawdza, czy ekspedycja o podanym identyfikatorze istnieje w stanie gry.
 * - Jeśli ekspedycja jest w stanie "preparing", zwraca załogantów do dostępnych.
 * - Usuwa ekspedycję z listy.
 * - Zwraca zaktualizowany stan gry z usuniętą ekspedycją i zaktualizowaną liczbą dostępnych załogantów.
 *
 * @param state - Obiekt reprezentujący aktualny stan gry.
 * @param expeditionId - Identyfikator ekspedycji, którą chcemy anulować.
 * @returns Zaktualizowany stan gry po anulowaniu ekspedycji.
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

/**
 * Sprawdza, czy ekspedycja jest odblokowana na podstawie technologii "advanced_hub_integration".
 * Ekspedycja jest odblokowana, jeśli technologia o identyfikatorze "advanced_hub_integration" została zbadana.
 *
 * @param state - Obiekt reprezentujący aktualny stan gry.
 * @returns `true` jeśli technologia "advanced_hub_integration" została zbadana, w przeciwnym razie `false`.
 */
export const isExpedtionUnlocked = (state) => {
  return state.technologies.some(
    (tech) => tech.id === "advanced_hub_integration" && tech.isResearched
  );
};
