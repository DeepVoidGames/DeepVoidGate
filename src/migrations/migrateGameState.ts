import { initialBuildings, initialTechnologies } from "@/store/initialData";
import { initialState } from "@/store/reducers/gameReducer";
import { ResourcesState } from "@/store/reducers/resourceReducer";
import { GameState, ResourceData } from "@/store/types";
import { stat } from "fs";

export const CURRENT_GAME_VERSION = 3; // Aktualna wersja gry

export const migrateGameState = (savedState: any): GameState => {
  let currentState = { ...savedState };

  // Krok 1: Napraw wersję dla bardzo starych zapisów
  if (typeof currentState.version === "string") {
    currentState.version = 0; // Oznacz jako V0
  }

  // Krok 2: Sekwencyjna migracja
  if (currentState.version === undefined || currentState.version === 0) {
    currentState = migrateV0ToV1(currentState);
  }
  if (currentState.version === 1) {
    currentState = migrateV1ToV2(currentState);
  }

  const mergedTechnologies = initialTechnologies.map((tech) => {
    const savedTech = savedState.technologies.find((t) => t.id === tech.id);
    return savedTech ? { ...tech, ...savedTech } : tech;
  });

  return {
    ...initialState, // Bazowe wartości
    ...currentState, // Nadpisujemy migrowanymi danymi
    technologies: mergedTechnologies,
    version: CURRENT_GAME_VERSION,
  };
};

// Migracja z wersji 0 (brak wersji)
const migrateV0ToV1 = (state: any) => {
  console.log("Migrating from V0 to V1...");
  return {
    ...state,
    version: 1,
    technologies: state.technologies || initialTechnologies,
    resources: state.resources || initialState.resources,
  };
};

const migrateV1ToV2 = (state: any) => {
  console.log("Migrating from V1 to V2...");

  // 1. Naprawiamy surowce
  const resources = state.resources || {};
  const defaultResources = {
    oxygen: {
      amount: 0,
      production: 0,
      consumption: 0,
      capacity: 100,
      icon: "O₂",
      color: "cyan",
      baseCapacity: 100,
    },
    food: {
      amount: 0,
      production: 0,
      consumption: 0,
      capacity: 100,
      icon: "🌱",
      color: "green",
      baseCapacity: 100,
    },
    energy: {
      amount: 0,
      production: 0,
      consumption: 0,
      capacity: 200,
      icon: "⚡",
      color: "yellow",
      baseCapacity: 200,
    },
    metals: {
      amount: 0,
      production: 0,
      consumption: 0,
      capacity: 200,
      icon: "⛏️",
      color: "zinc",
      baseCapacity: 200,
    },
    science: {
      amount: 0,
      production: 0,
      consumption: 0,
      capacity: 100,
      icon: "🔬",
      color: "purple",
      baseCapacity: 100,
    },
  };

  const fixedResources: any = {};
  for (const key in defaultResources) {
    const resource = resources[key] || {};
    const defaultRes = defaultResources[key as keyof typeof defaultResources];

    fixedResources[key] = {
      amount:
        resource.amount != null ? Number(resource.amount) : defaultRes.amount,
      production:
        resource.production != null
          ? Number(resource.production)
          : defaultRes.production,
      consumption:
        resource.consumption != null
          ? Number(resource.consumption)
          : defaultRes.consumption,
      capacity:
        resource.capacity != null
          ? Number(resource.capacity)
          : defaultRes.capacity,
      icon: resource.icon || defaultRes.icon,
      color: resource.color || defaultRes.color,
      baseCapacity:
        resource.baseCapacity != null
          ? Number(resource.baseCapacity)
          : defaultRes.baseCapacity,
    };

    // Dodatkowe sprawdzenie NaN dla pól liczbowych
    for (const numericField of [
      "amount",
      "production",
      "consumption",
      "capacity",
      "baseCapacity",
    ]) {
      if (isNaN(fixedResources[key][numericField])) {
        fixedResources[key][numericField] = defaultRes[numericField];
      }
    }
  }

  // 2. Migracja budynków
  const buildings = (state.buildings || []).map((b: any) => {
    // Jeśli budynek ma już tier i upgrades, pomijamy migrację
    if (b.tier !== undefined && b.upgrades !== undefined) {
      return {
        ...b,
        level: undefined,
      };
    }

    const oldLevel = b.level || 1;
    const totalUpgrades = oldLevel - 1;
    const tier = Math.min(Math.floor(totalUpgrades / 10) + 1, 5);
    let upgrades = totalUpgrades % 10;

    if (tier === 5) {
      const t5Upgrades = totalUpgrades - 40;
      upgrades = Math.min(Math.max(t5Upgrades, 0), 10);
    }

    // Znajdź szablon budynku
    const template = initialBuildings.find((ib) => ib.type === b.type) || {};

    return {
      ...template, // Najpierw wartości z szablonu
      ...b, // Nadpisujemy właściwości z V1
      tier,
      upgrades,
      level: undefined,
      uniqueBonus: template.uniqueBonus || { production: {}, storage: {} },
    };
  });

  // 3. Populacja (dodajemy deathTimer)
  const population = {
    ...state.population,
    deathTimer: null,
  };

  // 4. Zwracamy nowy stan
  return {
    version: 2, // Upewnij się, że wersja jest poprawna!
    resources: fixedResources,
    buildings: buildings,
    population,
    technologies: state.technologies || [],
    lastUpdate: state.lastUpdate || Date.now(),
    paused: state.paused || false,
  };
};
