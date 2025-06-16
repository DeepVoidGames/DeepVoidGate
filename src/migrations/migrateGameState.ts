//!  THIS FILE IS TOTALY MESS, NEED TO BE REFACTORED
import { artifactsData } from "@/data/artifacts";
import { initialMilestones } from "@/data/milestonesData";
import {
  generateId,
  initialBuildings,
  initialTechnologies,
} from "@/store/initialData";
import { initialFactions } from "@/store/reducers/factionsReducer";
import { initialState } from "@/store/reducers/gameReducer";
import { ResourcesState } from "@/store/reducers/resourceReducer";
import { GameState } from "@/types/gameState";

export const CURRENT_GAME_VERSION = 3;

export const migrateGameState = (savedState: GameState): GameState => {
  let currentState = { ...savedState };

  if (typeof currentState.version === "string") currentState.version = "0";
  if (currentState.version === undefined || currentState.version === "0")
    currentState = migrateV0ToV1(currentState);

  if (currentState.version === "1") currentState = migrateV1ToV2(currentState);

  const mergedTechnologies = initialTechnologies.map((tech) => ({
    ...tech,
    ...currentState.technologies.find((t: any) => t.id === tech.id),
  }));

  if (currentState.userID == null) currentState.userID = generateId(16);

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
    buildings: migrateBuildingsStats(currentState.buildings),
    resources: resources,
    technologies: tech,
    milestones: mergedMilestones,
    version: CURRENT_GAME_VERSION,
    artifacts: migrateArtifactsStats(currentState.artifacts || []),
    factions: migrateFactionsStats(currentState.factions || []),
  };
};

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

  const buildings = (state.buildings || []).map((b: any) => {
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

    const template = initialBuildings.find((ib) => ib.type === b.type) || {};

    return {
      ...template,
      ...b,
      tier,
      upgrades,
      level: undefined,
      uniqueBonus: template.uniqueBonus || { production: {}, storage: {} },
    };
  });

  const population = {
    ...state.population,
    deathTimer: null,
  };

  return {
    version: 2,
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
    const template =
      initialBuildings.find((ib) => ib.type === building.type) || {};
    return {
      ...template,
      ...building,
      id: building.id || generateId(),
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
      tag: template.tag || building.tag,
    };
  });
};

const migrateArtifactsStats = (savedArtifacts: any[]): any[] => {
  const migratedArtifacts = savedArtifacts.map((artifact) => {
    const template = artifactsData.find((a) => a.name === artifact.name) || {};

    return {
      ...template,
      ...artifact,
      name: template.name ?? artifact.name,
      description: template.description ?? artifact.description,
      image: template.image ?? artifact.image,
      stars: artifact.stars ?? template.stars ?? 1,
      isLocked: artifact.isLocked ?? template.isLocked ?? true,
      effect: template.effect ?? artifact.effect,
      expedtionTier: template.expedtionTier ?? -1,
    };
  });

  // Add missing artifacts
  const missingArtifacts = artifactsData.filter(
    (artifact) =>
      !migratedArtifacts.some((a) => a.name === artifact.name) &&
      artifact.isLocked
  );

  if (migratedArtifacts.length === 0) {
    return artifactsData.map((artifact) => ({
      ...artifact,
      stars: 0,
      isLocked: true,
    }));
  }

  return [...migratedArtifacts, ...missingArtifacts];
};

const migrateTechnologiesStats = (savedTechnologies: any[]): any[] => {
  return savedTechnologies.map((tech) => {
    const template = initialTechnologies.find((it) => it.id === tech.id) || {};

    return {
      ...template,
      ...tech,
      name: template.name || tech.name,
      description: template.description || tech.description,
      category: template.category,
      subCategory: template?.subCategory,
      researchCost: template.researchCost || tech.researchCost,
      prerequisites: template.prerequisites || tech.prerequisites,
      unlocksBuildings: template.unlocksBuildings || tech.unlocksBuildings,
      researchDuration: tech.researchDuration || template.researchDuration,
    };
  });
};

const migrateFactionsStats = (savedFactions: any[]): any[] => {
  if (!savedFactions || !Array.isArray(savedFactions)) {
    return initialFactions.map((f) => ({ ...f }));
  }

  const savedFactionsMap = new Map(savedFactions.map((f) => [f.id, f]));

  return initialFactions.map((template) => {
    const savedFaction = savedFactionsMap.get(template.id) || {};

    return {
      id: template.id,
      name: template.name,
      description: template.description,
      loyalty: savedFaction.loyalty || template.loyalty || 0,
      hostility: savedFaction.hostility || template.hostility || 0,
      maxLoyalty: savedFaction.maxLoyalty || template.maxLoyalty || 100,
      bonuses: mergeBonuses(template.bonuses, savedFaction.bonuses),
    };
  });
};

const mergeBonuses = (templateBonuses: any[], savedBonuses: any[] = []) => {
  const bonusMap = new Map(templateBonuses.map((b) => [b.name, { ...b }]));

  savedBonuses.forEach((savedBonus) => {
    const existing = bonusMap.get(savedBonus.name);
    if (existing) {
      bonusMap.set(savedBonus.name, {
        ...existing,
        ...savedBonus,
        unlocked: savedBonus.unlocked || existing.unlocked,
      });
    }
  });

  return templateBonuses.map(
    (templateBonus) => bonusMap.get(templateBonus.name) || templateBonus
  );
};

const migrateResources = (
  savedResources: ResourcesState
): Record<string, any> => {
  const migratedResources: Record<string, any> = {};

  Object.entries(initialState.resources).forEach(([key, defaultResource]) => {
    const savedResource = savedResources[key as keyof ResourceData];

    migratedResources[key] = {
      ...defaultResource,
      ...savedResource,
      amount: savedResource?.amount ?? defaultResource.amount,
      production: savedResource?.production ?? defaultResource.production,
      consumption: savedResource?.consumption ?? defaultResource.consumption,
      capacity: savedResource?.capacity ?? defaultResource.capacity,
      bonusCapacity:
        savedResource?.bonusCapacity ?? (defaultResource.bonusCapacity || 0),
      baseCapacity: defaultResource.baseCapacity || 0,
    };
  });

  return migratedResources;
};
