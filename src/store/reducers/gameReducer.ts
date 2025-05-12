import { toast } from "@/components/ui/use-toast";
import { GameAction } from "@/store/actions";
import {
  initialResourcesState,
  initialPopulationState,
  resourceAlertThresholds,
  initialTechnologies,
  initialBuildings,
} from "@/store/initialData";
import {
  resetProductionCounters,
  calculateResourceChanges,
} from "@/store/reducers/resourceReducer";
import {
  evaluateBuildingEfficiency,
  updateResourcesByBuildings,
  buildNewBuilding,
  upgradeBuildingLevel,
  assignWorkersToBuilding,
  upgradeBuildingMax,
} from "@/store/reducers/buildingReducer";
import { calculatePopulationConsumption } from "@/store/reducers/populationReducer";
import {
  researchTechnology,
  updateResearches,
} from "@/store/reducers/technologyReducer";
import { calculateOfflineProduction } from "@/lib/calculateOfflineProduction";
import {
  CURRENT_GAME_VERSION,
  migrateGameState,
} from "@/migrations/migrateGameState";
import { initialMilestones } from "@/data/milestonesData";
import { checkMilestones } from "@/store/reducers/milestonesReducer";
import {
  startExpedition,
  launchExpedition,
  handleExpeditionTick,
  handleExpeditionEventChoice,
  cancelExpedition,
} from "@/store/reducers/expeditionReducer";
import { artifactsData } from "@/data/artifacts";
import {
  applyArtifactEffect,
  upgradeArtifactIfPossible,
} from "@/store/reducers/artifactsReducer";
import {
  applyFactionBonuses,
  initialFactions,
  updateFactionLoyalty,
} from "@/store/reducers/factionsReducer";
import { GameState } from "@/types/gameState";
import { ResourceType } from "@/types/resource";

// Initialize the game state
export const initialState: GameState = {
  version: CURRENT_GAME_VERSION.toString(),
  resources: initialResourcesState,
  buildings: [],
  population: initialPopulationState,
  technologies: initialTechnologies,
  lastUpdate: Date.now(),
  paused: false,
  name: undefined,
  showOfflineProgress: undefined,
  offlineReport: undefined,
  colonistProgress: 0,
  userID: null,
  milestones: initialMilestones,
  expeditions: [],
  playtime: 0,
  sessionLength: 0,
  artifacts: artifactsData,
  factions: initialFactions,
};

// Constants for death timer
const DEATH_TIMER_START = 120; // 2 minutes until death
const DEATH_TIMER_WARNING = 60; // 1 minute warning

// Track resource warnings to avoid spamming
const resourceWarnings = {
  oxygen: { lastWarned: 0 },
  food: { lastWarned: 0 },
  energy: { lastWarned: 0 },
};

// Game reducer function
export const gameReducer = (
  state: GameState,
  action: GameAction
): GameState => {
  switch (action.type) {
    case "TICK": {
      if (state.paused) return state;

      // Obliczenia podstawowe
      const basicCalculations = calculateBasicValues(state, action);
      if (!basicCalculations) return state;
      const { deltaTime, newSessionLength } = basicCalculations;

      // Aktualizacja stanu przez kolejne moduły
      let newState = {
        ...state,
        ...updateResourceProduction(state, deltaTime, initialResourcesState),
        ...calculateHousingAndColonists(state, deltaTime),
        sessionLength: newSessionLength,
      };

      newState = handleMilestonesAndExpeditions(newState, deltaTime);
      newState = processCriticalResources(newState, deltaTime);
      newState = monitorResourceLevels(newState);
      newState = applyFactionBonuses({
        ...newState,
        resources: {
          ...initialResourcesState,
          ...newState.resources,
        },
      });

      return {
        ...newState,
        lastUpdate: action.payload.currentTime,
      };
    }

    case "CONSTRUCT_BUILDING": {
      const { buildingType } = action.payload;
      const result = buildNewBuilding(
        state.buildings,
        state.resources,
        buildingType,
        state.technologies
      );

      if (!result.success) return state;

      return {
        ...state,
        resources: result.resources,
        buildings: result.buildings,
      };
    }

    case "UPGRADE_BUILDING": {
      const { buildingId } = action.payload;
      const result = upgradeBuildingLevel(
        state.buildings,
        state.resources,
        buildingId
      );

      if (!result.success) return state;

      return {
        ...state,
        resources: result.resources,
        buildings: result.buildings,
      };
    }

    case "UPGRAGE_BUILDING_MAX": {
      const { buildingId } = action.payload;
      const result = upgradeBuildingMax(
        state.buildings,
        state.resources,
        buildingId
      );

      if (!result.success) return state;

      return {
        ...state,
        resources: result.resources,
        buildings: result.buildings,
      };
    }

    case "ASSIGN_WORKER": {
      const { buildingId, count } = action.payload;
      console.log("ASSIGN_WORKER", buildingId, count);
      const result = assignWorkersToBuilding(
        state.buildings,
        state.population,
        buildingId,
        count
      );

      if (!result.success) return state;

      return {
        ...state,
        buildings: result.buildings,
        population: {
          ...state.population,
          available: result.available,
        },
      };
    }

    case "RESEARCH_TECHNOLOGY": {
      const { techId } = action.payload;
      const result = researchTechnology(
        state.technologies,
        state.resources,
        techId,
        state
      );

      if (!result.success) return state;

      return {
        ...state,
        technologies: result.technologies,
        resources: result.resources,
      };
    }

    case "CHECK_RESEARCH_PROGRESS": {
      const updatedTechnologies = updateResearches(state.technologies);

      // Sprawdź czy jakieś technologie zostały ukończone
      const completedTech = updatedTechnologies.find(
        (t) =>
          !state.technologies.some(
            (ot) => ot.id === t.id && ot.isResearched === t.isResearched
          )
      );

      // Jeśli znaleziono ukończoną technologię, zaktualizuj stan
      if (completedTech) {
        return {
          ...state,
          technologies: updatedTechnologies,
        };
      }

      return state;
    }

    case "START_EXPEDITION": {
      const { type, tier } = action.payload;
      return startExpedition(state, type, tier);
    }

    case "LAUNCH_EXPEDITION": {
      const { expeditionId } = action.payload;
      return launchExpedition(state, expeditionId);
    }

    case "HANDLE_EXPEDITION_EVENT": {
      const { expeditionId, eventIndex, optionIndex } = action.payload;
      return handleExpeditionEventChoice(
        state,
        expeditionId,
        eventIndex,
        optionIndex
      );
    }

    case "CANCEL_EXPEDITION": {
      const { expeditionId } = action.payload;
      return cancelExpedition(state, expeditionId);
    }

    case "UPGRADE_ARTIFACT": {
      const { artifactName } = action.payload;
      return upgradeArtifactIfPossible(artifactName, state);
    }

    case "UPDATE_LOYALTY":
      return updateFactionLoyalty(
        state,
        action.payload.faction,
        action.payload.amount
      );

    case "SAVE_GAME": {
      try {
        const stateToSave = {
          ...state,
          version: CURRENT_GAME_VERSION, // Zawsze zapisuj z aktualną wersją
          playtime: (state.playtime || 0) + (state.sessionLength || 0),
          sessionLength: 0,
          lastUpdate: Date.now(),
        };

        localStorage.setItem("deepvoidgate_save", JSON.stringify(stateToSave));
        toast({
          title: "Game Saved",
          description: "Your progress has been saved successfully.",
        });
      } catch (error) {
        console.error("Failed to save game:", error);
        toast({
          title: "Save Failed",
          description: "There was an error saving your game.",
          variant: "destructive",
        });
      }
      return state;
    }

    case "LOAD_GAME": {
      try {
        const savedState = localStorage.getItem("deepvoidgate_save");
        if (!savedState) {
          toast({
            title: "No Saved Game",
            description: "No saved game was found. Starting a new game.",
            variant: "destructive",
          });
          return initialState;
        }

        const parsedState = JSON.parse(savedState) as GameState;
        const migratedState = migrateGameState(parsedState);

        toast({
          title: "Game Loaded",
          description: "Your saved game has been loaded successfully.",
        });

        const now = Date.now();
        const elapsedTime = now - migratedState.lastUpdate; // Używamy czasu z załadowanego zapisu

        if (elapsedTime > 5000) {
          // Stwórz kopię surowców z załadowanego stanu
          const originalResources = { ...migratedState.resources };

          // Oblicz progres używając załadowanych budynków i technologii
          const newResources = calculateOfflineProduction(
            migratedState,
            migratedState.buildings,
            migratedState.resources,
            migratedState.technologies,
            elapsedTime
          );

          // Oblicz zmiany w surowcach
          const resourceChanges = Object.keys(newResources).reduce(
            (acc, key) => {
              const resourceType = key as ResourceType;
              acc[resourceType] =
                newResources[resourceType].amount -
                originalResources[resourceType].amount;
              return acc;
            },
            {} as Record<ResourceType, number>
          );

          const types1 = initialBuildings.map((item) => item.type);
          const types2 = migratedState.buildings.map((item) => item.type);
          const onlyIn1 = types1.filter((type) => !types2.includes(type));

          // Typy, które są w array2, a nie ma ich w array1
          const onlyIn2 = types2.filter((type) => !types1.includes(type));

          console.log("Only in initialBuildings:", onlyIn1);
          console.log("Only in  migratedState.buildings:", onlyIn2);

          return {
            ...migratedState,
            resources: newResources,
            lastUpdate: now,
            showOfflineProgress: true,
            offlineReport: {
              elapsedTime,
              resourceChanges,
            },
          };
        }

        return {
          ...migratedState,
          lastUpdate: now,
          showOfflineProgress: false,
          offlineReport: null,
        };
      } catch (error) {
        console.error("Failed to load game:", error);
        toast({
          title: "Load Failed",
          description: error.message || "There was an error loading your game.",
          variant: "destructive",
        });
        return state;
      }
    }

    case "CLOSE_OFFLINE_MODAL":
      return {
        ...state,
        showOfflineProgress: false,
        offlineReport: null,
      };

    case "RESET_GAME": {
      localStorage.removeItem("deepvoidgate_save");
      toast({
        title: "Game Reset",
        description: "Your game has been reset. Starting a new game.",
      });
      return {
        ...initialState,
        lastUpdate: Date.now(),
      };
    }

    default:
      return state;
  }
};

// Helper functions
const calculateBasicValues = (state, action) => {
  if (state.paused) return null;
  const { currentTime } = action.payload;
  const deltaTime = (currentTime - state.lastUpdate) / 1000;
  return {
    deltaTime,
    newSessionLength: (state.sessionLength || 0) + deltaTime,
  };
};

const updateResourceProduction = (state, deltaTime, initialResources) => {
  let newResources = {
    ...initialResources,
    ...resetProductionCounters(state.resources),
  };
  const buildings = evaluateBuildingEfficiency(state.buildings, newResources);
  newResources = updateResourcesByBuildings(buildings, newResources);
  newResources = calculatePopulationConsumption(state.population, newResources);
  return { resources: newResources, buildings };
};

const calculateHousingAndColonists = (state, deltaTime) => {
  const totalHousing = calculateHousingCapacity(state.buildings);
  const newPopulation = updatePopulationCapacity(
    state.population,
    totalHousing
  );
  const colonistUpdates = processColonistArrival(
    newPopulation,
    deltaTime,
    state.colonistProgress
  );
  return {
    population: colonistUpdates.newPopulation,
    colonistProgress: colonistUpdates.progress,
  };
};

const handleMilestonesAndExpeditions = (state, deltaTime) => {
  const withMilestones = checkMilestones(state);
  const afterExpeditions = handleExpeditionTick(withMilestones, deltaTime);
  return applyArtifactEffect(afterExpeditions);
};

const processCriticalResources = (state, deltaTime) => {
  const newResources = calculateResourceChanges(state.resources, deltaTime);
  const newPopulation = handleDeathTimer(
    state.population,
    newResources,
    deltaTime
  );
  return { ...state, resources: newResources, population: newPopulation };
};

// Szczegółowe funkcje pomocnicze
const calculateHousingCapacity = (buildings) => {
  return buildings
    .filter((b) => b.category === "housing" && b.functioning)
    .reduce((sum, building) => {
      const bonus = building?.housingCapacityMultiplier || 0;
      const baseCapacity = (12 + bonus * 10) * building.tier;
      const upgradeBonus = (1 + bonus) * building.upgrades;
      return sum + baseCapacity + upgradeBonus;
    }, 10); // +10 jako podstawowa pojemność
};

const updatePopulationCapacity = (population, capacity) => ({
  ...population,
  maxCapacity: Math.floor(capacity),
});

const processColonistArrival = (population, deltaTime, currentProgress) => {
  let progress = currentProgress || 0;
  const canAddColonist = population.total < population.maxCapacity;

  if (canAddColonist) progress += deltaTime;
  else progress = 0;

  if (progress >= 75 && canAddColonist) {
    return {
      newPopulation: {
        ...population,
        total: population.total + 1,
        available: population.available + 1,
      },
      progress: 0,
    };
  }
  return { newPopulation: population, progress };
};

const handleDeathTimer = (population, resources, deltaTime) => {
  const hasOxygenShortage =
    resources.oxygen.amount <= (resourceAlertThresholds.oxygen?.critical || 0);
  const hasFoodShortage =
    resources.food.amount <= (resourceAlertThresholds.food?.critical || 0);
  let newPopulation = { ...population };

  // Logika timeru śmierci
  if (hasOxygenShortage || hasFoodShortage) {
    newPopulation = processDeathTimer(newPopulation, deltaTime);
  } else if (newPopulation.deathTimer) {
    newPopulation = clearDeathTimer(newPopulation);
  }
  return newPopulation;
};

const processDeathTimer = (population, deltaTime) => {
  let newPop = { ...population };
  if (!newPop.deathTimer) {
    newPop.deathTimer = DEATH_TIMER_START;
    showCriticalAlert();
  } else {
    newPop.deathTimer -= deltaTime;
    checkDeathTimerWarning(newPop.deathTimer);

    if (newPop.deathTimer <= 0) {
      newPop = handleColonistDeath(newPop);
    }
  }
  return newPop;
};

const monitorResourceLevels = (state) => {
  const currentTime = Date.now();
  checkResourceLevel("oxygen", state, currentTime);
  checkResourceLevel("food", state, currentTime);
  checkResourceLevel("energy", state, currentTime);
  return state;
};

const checkResourceLevel = (resource, state, currentTime) => {
  const { amount, production, consumption } = state.resources[resource];
  const thresholds = resourceAlertThresholds[resource];
  const warnings = resourceWarnings[resource];
  const net = production - consumption;

  if (!thresholds || net >= 0) return;

  if (
    amount <= thresholds.critical &&
    currentTime - warnings.lastWarned > 60000
  ) {
    showResourceAlert(resource, "critical");
  } else if (
    amount <= thresholds.low &&
    currentTime - warnings.lastWarned > 60000
  ) {
    showResourceAlert(resource, "low");
  }
};

// Notification functions
const showCriticalAlert = () => {
  toast({
    title: "CRITICAL: Life Support Failure!",
    description:
      "Colonists will start dying soon if resources aren't restored!",
    variant: "destructive",
  });
};

const showResourceAlert = (resource: string, level: "critical" | "low") => {
  const titles = {
    oxygen: {
      critical: "CRITICAL: Oxygen Depletion!",
      low: "Warning: Low Oxygen",
    },
    food: {
      critical: "CRITICAL: Starvation Imminent!",
      low: "Warning: Low Food",
    },
    energy: {
      critical: "CRITICAL: Energy Shortage!",
      low: "Warning: Low Energy",
    },
  };

  const descriptions = {
    oxygen: {
      critical: "Build more oxygen generators immediately!",
      low: "Oxygen levels are dangerously low. Increase production.",
    },
    food: {
      critical:
        "Your colonists are starving. Increase food production immediately!",
      low: "Food supplies are running low. Increase production.",
    },
    energy: {
      critical: "Your colony is losing power. Build more energy generators!",
      low: "Energy reserves are running low. Increase production.",
    },
  };

  toast({
    title: titles[resource][level],
    description: descriptions[resource][level],
    variant: "destructive",
  });

  // Update last warning time
  resourceWarnings[resource].lastWarned = Date.now();
};

// Population management
const handleColonistDeath = (population: {
  total: number;
  available: number;
  deathTimer?: number;
}): { total: number; available: number; deathTimer?: number } => {
  const newPopulation = {
    ...population,
    total: Math.max(0, population.total - 1),
    available: Math.max(0, population.available - 1),
    deathTimer: DEATH_TIMER_START,
  };

  toast({
    title: "Colony Disaster: Colonist Lost",
    description: "A colonist has died due to critical life support failure.",
    variant: "destructive",
  });

  if (newPopulation.total === 0) {
    toast({
      title: "GAME OVER",
      description: "All colonists have perished. The colony has failed.",
      variant: "destructive",
    });
  }

  return newPopulation;
};

const clearDeathTimer = (population: {
  total: number;
  available: number;
  deathTimer?: number;
}): { total: number; available: number; deathTimer?: number } => {
  toast({
    title: "Life Support Restored",
    description:
      "Critical resources restored to safe levels. Colonists are safe for now.",
  });

  const newPopulation = { ...population };
  delete newPopulation.deathTimer;
  return newPopulation;
};

// Timer warnings
const checkDeathTimerWarning = (deathTimer: number) => {
  if (
    deathTimer <= DEATH_TIMER_WARNING &&
    deathTimer > DEATH_TIMER_WARNING - 10
  ) {
    toast({
      title: "EMERGENCY: Colonist Death Imminent!",
      description: `First colonist will die in ${Math.floor(
        deathTimer
      )} seconds!`,
      variant: "destructive",
    });
  }
};
