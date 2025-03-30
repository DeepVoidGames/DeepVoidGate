import { initialMilestones } from "@/data/milestonesData";
import {
  generateId,
  initialBuildings,
  initialTechnologies,
} from "@/store/initialData";
import { initialState } from "@/store/reducers/gameReducer";
import { ResourcesState } from "@/store/reducers/resourceReducer";
import { GameState, ResourceData } from "@/store/types";
import { stat } from "fs";

// TODO Add sync milestones data with save

export const CURRENT_GAME_VERSION = 3; // Aktualna wersja gry

export const migrateGameState = (savedState: any): GameState => {
  let currentState = { ...savedState };

  // Migracje wersji
  if (typeof currentState.version === "string") currentState.version = 0;
  if (currentState.version === undefined || currentState.version === 0) {
    currentState = migrateV0ToV1(currentState);
  }
  if (currentState.version === 1) {
    currentState = migrateV1ToV2(currentState);
  }

  // Merge technologii (bez zmian)
  const mergedTechnologies = initialTechnologies.map((tech) => ({
    ...tech,
    ...currentState.technologies.find((t: any) => t.id === tech.id),
  }));

  // Poprawiony mechanizm dla budynków:
  const initialBuildings = initialState.buildings;

  // Krok 1: Stwórz mapę budynków initial po 'type'
  const initialBuildingsMap = new Map(initialBuildings.map((b) => [b.type, b]));

  // Krok 2: Przepisz zapisane budynki, łącząc z initial (po 'type')
  const mergedSavedBuildings = (currentState.buildings || []).map(
    (savedBldg) => ({
      ...initialBuildingsMap.get(savedBldg.type), // Nadpisuje domyślne wartości
      ...savedBldg, // Zachowuje zapisane wartości
    })
  );

  if (currentState.userID == null) currentState.userID = generateId(16);

  // Krok 3: Dodaj nowe budynki z initial, których nie ma w zapisie
  const newInitialBuildings = initialBuildings.filter(
    (initialBldg) =>
      !(currentState.buildings || []).some(
        (savedBldg) => savedBldg.type === initialBldg.type
      )
  );

  const finalBuildings = [...mergedSavedBuildings, ...newInitialBuildings];

  const tech = migrateTechnologiesStats(mergedTechnologies);
  const resources = migrateResources(currentState.resources);

  const mergedMilestones = initialMilestones.map((initialMs) => {
    const savedMs = savedState.milestones?.find(
      (m: any) => m.id === initialMs.id
    );
    return savedMs
      ? {
          ...initialMs,
          completed: savedMs.completed,
        }
      : initialMs;
  });

  return {
    ...initialState,
    ...currentState,
    buildings: migrateBuildingsStats(finalBuildings),
    resources: resources,
    technologies: tech,
    milestones: mergedMilestones,
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

const migrateBuildingsStats = (savedBuildings: any[]): any[] => {
  return savedBuildings.map((building) => {
    // Znajdź szablon budynku
    const template =
      initialBuildings.find((ib) => ib.type === building.type) || {};

    return {
      ...template, // Wartości domyślne z szablonu
      ...building, // Nadpisujemy wartościami z zapisanego stanu
      name: template.name || building.name,
      description: template.description || building.description,
      workerCapacity: template.workerCapacity ?? building.workerCapacity,
      baseCost: template.baseCost || building.baseCost,
      baseProduction: template.baseProduction || building.baseProduction,
      baseConsumption: template.baseConsumption || building.baseConsumption,
      storageBonus: template.storageBonus || building.storageBonus,
      requirements: template.requirements || building.requirements,
      costMultiplier: template.costMultiplier ?? building.costMultiplier,
      productionMultiplier:
        template.productionMultiplier ?? building.productionMultiplier,
      maxInstances: template.maxInstances ?? building.maxInstances,
      maxTier: template.maxTier ?? building.maxTier,
      uniqueBonus: template.uniqueBonus || building.uniqueBonus,
    };
  });
};

const migrateTechnologiesStats = (savedTechnologies: any[]): any[] => {
  return savedTechnologies.map((tech) => {
    // Znajdź szablon technologii
    const template = initialTechnologies.find((it) => it.id === tech.id) || {};

    return {
      ...template, // Wartości domyślne z szablonu
      ...tech, // Nadpisujemy wartościami z zapisanego stanu
      name: template.name || tech.name,
      description: template.description || tech.description,
      researchCost: template.researchCost || tech.researchCost,
      prerequisites: template.prerequisites || tech.prerequisites,
      unlocksBuildings: template.unlocksBuildings || tech.unlocksBuildings,
      researchDuration: template.researchDuration || tech.researchDuration,
    };
  });
};

const migrateResources = (
  savedResources: ResourcesState
): Record<string, any> => {
  const migratedResources: Record<string, any> = {};

  // Iterujemy po wszystkich zasobach z initialState
  Object.entries(initialState.resources).forEach(([key, defaultResource]) => {
    const savedResource = savedResources[key as keyof ResourceData];

    // Łączymy domyślne wartości z zapisanymi (jeśli istnieją)
    migratedResources[key] = {
      ...defaultResource,
      ...savedResource,
      amount: savedResource?.amount ?? defaultResource.amount,
      production: savedResource?.production ?? defaultResource.production,
      consumption: savedResource?.consumption ?? defaultResource.consumption,
      capacity: savedResource?.capacity ?? defaultResource.capacity,
      bonusCapacity:
        savedResource?.bonusCapacity ?? (defaultResource.bonusCapacity || 0),
    };
  });

  return migratedResources;
};
