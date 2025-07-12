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
  applyFactionEventOption,
  generateRandomFactionEvent,
  initialFactions,
  scheduleNextFactionEvent,
  updateFactionLoyalty,
} from "@/store/reducers/factionsReducer";
import { GameState } from "@/types/gameState";
import { ResourceType } from "@/types/resource";
import { onColonize, onGalacticUpgradePurchase } from "./colonizationReducer";
import {
  blackHoleTick,
  convertMassToDarkMatter,
  onBlackHoleUpgradePurchase,
} from "./blackHoleReducer";

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
  galacticKnowledge: 0,
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

      const basicCalculations = calculateBasicValues(state, action);
      if (!basicCalculations) return state;
      const { deltaTime, newSessionLength } = basicCalculations;

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
      newState = blackHoleTick(newState, deltaTime);

      const now = action.payload.currentTime;

      //! === FACTIONAL EVENTS ===
      const activeEvent = newState.factionEvent;
      if (activeEvent && activeEvent.activeUntil <= now) {
        // Event has expired - option may cause "no decision" effect
        newState.factionEvent = undefined;
      }

      if (
        !activeEvent &&
        (!newState.nextFactionEventAt || now >= newState.nextFactionEventAt) &&
        newState.technologies.find((t) => t.id == "advanced_hub_integration")
          .isResearched
      ) {
        const generated = generateRandomFactionEvent();
        newState.factionEvent = {
          ...generated,
          activeUntil: now + generated.duration * 1000,
        };
        newState.nextFactionEventAt = scheduleNextFactionEvent();
      }

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

      const completedTech = updatedTechnologies.find(
        (t) =>
          !state.technologies.some(
            (ot) => ot.id === t.id && ot.isResearched === t.isResearched
          )
      );

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

    case "FACTION_EVENT_CHOICE":
      return applyFactionEventOption(state, action.payload.option);

    case "PRESTIGE":
      return onColonize(state, action.payload.selectedPlanet);

    case "PURCHASE_GALACTIC_UPGRADE":
      return onGalacticUpgradePurchase(state, action.payload.upgradeId);

    case "CONVERT_MASS_TO_DARK_MATTER":
      return convertMassToDarkMatter(state);

    case "PURCHASE_BLACK_HOLE_UPGRADE":
      return onBlackHoleUpgradePurchase(state, action.payload.upgradeId);

    case "SAVE_GAME": {
      try {
        const stateToSave = {
          ...state,
          version: CURRENT_GAME_VERSION,
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
        const elapsedTime = now - migratedState.lastUpdate;

        if (elapsedTime > 5000) {
          const originalResources = { ...migratedState.resources };

          const newResources = calculateOfflineProduction(
            migratedState,
            migratedState.buildings,
            migratedState.resources,
            migratedState.technologies,
            elapsedTime
          );

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

/**
 * Calculates fundamental time-based values required for game state updates.
 * This function determines the time elapsed since the last update and the total session length.
 * It's crucial for time-dependent game mechanics like resource generation, event triggers, etc.
 *
 * @param state - The current game state, including `paused` status and `lastUpdate` timestamp.
 * @param action - The action object, expected to contain `currentTime` in its payload.
 * @returns An object containing `deltaTime` (time elapsed since last update in seconds)
 * and `newSessionLength` (total accumulated session time in seconds),
 * or `null` if the game is paused.
 */
const calculateBasicValues = (state, action) => {
  if (state.paused) return null;
  const { currentTime } = action.payload;
  const deltaTime = (currentTime - state.lastUpdate) / 1000;
  return {
    deltaTime,
    newSessionLength: (state.sessionLength || 0) + deltaTime,
  };
};

/**
 * Updates the game's resource production and consumption based on elapsed time and game elements.
 * This function orchestrates several steps to calculate new resource amounts:
 * 1. Resets production counters for resources.
 * 2. Evaluates the efficiency of buildings.
 * 3. Adds resources generated by buildings.
 * 4. Deducts resources consumed by the population.
 *
 * @param state - The current game state, containing information about resources, buildings, and population.
 * @param deltaTime - The time elapsed since the last update in seconds, used for time-based calculations.
 * @param initialResources - The initial state of resources before applying production and consumption.
 * @returns An object containing the `resources` with updated amounts and the `buildings` with their evaluated efficiencies.
 */
const updateResourceProduction = (state, deltaTime, initialResources) => {
  let newResources = {
    ...initialResources,
    ...resetProductionCounters(state.resources),
  };
  const buildings = evaluateBuildingEfficiency(state.buildings, newResources);
  newResources = updateResourcesByBuildings(buildings, newResources, state);
  newResources = calculatePopulationConsumption(state.population, newResources);
  return { resources: newResources, buildings };
};

/**
 * Manages the calculation of housing capacity, population growth/adjustment, and the arrival of new colonists.
 * This function consolidates the logic for how housing affects population and how new colonists are introduced over time.
 *
 * @param state - The current game state, including information about buildings, population, and colonist progress.
 * @param deltaTime - The time elapsed since the last update in seconds, used to process colonist arrival over time.
 * @returns An object containing the `population` with updated numbers based on housing and colonist arrivals,
 * and `colonistProgress` which tracks the progress towards the next colonist arrival.
 */
const calculateHousingAndColonists = (state, deltaTime) => {
  const totalHousing = calculateHousingCapacity(state.buildings);
  const newPopulation = updatePopulationCapacity(
    state.population,
    totalHousing
  );
  const colonistUpdates = processColonistArrival(
    newPopulation,
    deltaTime,
    state.colonistProgress,
    state
  );
  return {
    population: colonistUpdates.newPopulation,
    colonistProgress: colonistUpdates.progress,
  };
};

/**
 * Manages the processing of game milestones, ongoing expeditions, and the application of artifact effects.
 * This function consolidates time-sensitive logic related to player achievements and exploration.
 *
 * @param state - The current game state, containing information about milestones, expeditions, and artifacts.
 * @param deltaTime - The time elapsed since the last update in seconds, used to advance expedition progress.
 * @returns The updated game state after checking milestones, processing expeditions, and applying artifact effects.
 */
const handleMilestonesAndExpeditions = (state, deltaTime) => {
  const withMilestones = checkMilestones(state);
  const afterExpeditions = handleExpeditionTick(withMilestones, deltaTime);
  return applyArtifactEffect(afterExpeditions);
};

/**
 * Processes changes related to critical resources and their impact on the population,
 * specifically handling resource consumption and potential population decrease due to shortages.
 * This function is vital for simulating survival mechanics where resource scarcity can lead to negative consequences.
 *
 * @param state - The current game state, containing information about `resources` and `population`.
 * @param deltaTime - The time elapsed since the last update in seconds, used for time-dependent calculations.
 * @returns A new game state object with updated `resources` and `population` values after processing critical resource effects.
 */
const processCriticalResources = (state, deltaTime) => {
  const newResources = calculateResourceChanges(state.resources, deltaTime);
  const newPopulation = handleDeathTimer(
    state.population,
    newResources,
    deltaTime
  );
  return { ...state, resources: newResources, population: newPopulation };
};

/**
 * Calculates the total housing capacity provided by all functioning housing buildings.
 * This function considers the base capacity of each housing building, its tier,
 * any specific housing capacity multipliers, and bonuses from upgrades.
 *
 * @param buildings - An array of building objects, each potentially having properties like `category`, `functioning`, `housingCapacityMultiplier`, `tier`, and `upgrades`.
 * @returns The total calculated housing capacity available.
 */
const calculateHousingCapacity = (buildings) => {
  return buildings
    .filter((b) => b.category === "housing" && b.functioning)
    .reduce((sum, building) => {
      const bonus = building?.housingCapacityMultiplier || 0;
      const baseCapacity = (12 + bonus * 10) * building.tier;
      const upgradeBonus = (1 + bonus) * building.upgrades;
      return sum + baseCapacity + upgradeBonus;
    }, 10);
};

/**
 * Updates the maximum population capacity based on the calculated housing capacity.
 * This function essentially caps the total number of individuals the settlement can support.
 *
 * @param population - The current population state object, which will be spread to preserve other properties.
 * @param capacity - The newly calculated total housing capacity from buildings.
 * @returns A new population state object with the `maxCapacity` property updated to the floored housing capacity.
 */
const updatePopulationCapacity = (population, capacity) => ({
  ...population,
  maxCapacity: Math.floor(capacity),
});

/**
 * Manages the arrival of new colonists based on available housing and elapsed time.
 * This function simulates a time-based progression towards adding new population members,
 * but only if there is sufficient housing capacity.
 *
 * @param population - The current population state object, including `total` population and `maxCapacity`.
 * @param deltaTime - The time elapsed since the last update in seconds. This value contributes to the colonist arrival `progress`.
 * @param currentProgress - The current progress (in seconds) accumulated towards the next colonist arrival.
 * @returns An object containing `newPopulation` (updated if a colonist arrives) and `progress` (the updated progress towards the next colonist).
 */
const processColonistArrival = (
  population,
  deltaTime,
  currentProgress,
  state: GameState
) => {
  let progress = currentProgress || 0;
  const canAddColonist = population.total < population.maxCapacity;

  if (canAddColonist) progress += deltaTime;
  else progress = 0;

  const colonistPeriod = 60;
  let colonistPerCycle = 1;

  if (state?.galacticUpgrades?.includes("quantum_cloning")) {
    colonistPerCycle = 2;
  }

  if (progress >= colonistPeriod && canAddColonist) {
    return {
      newPopulation: {
        ...population,
        total: population.total + colonistPerCycle,
        available: population.available + colonistPerCycle,
      },
      progress: 0,
    };
  }
  return { newPopulation: population, progress };
};

/**
 * Manages the "death timer" mechanism, which reduces population due to critical resource shortages.
 * This function checks for severe shortages of essential resources (oxygen, food) and, if present,
 * activates or continues a timer that can lead to population decrease. It also clears the timer
 * if shortages are resolved.
 *
 * @param population - The current population state object, potentially including a `deathTimer` property.
 * @param resources - The current resources state object, containing amounts of `oxygen` and `food`.
 * @param deltaTime - The time elapsed since the last update in seconds, used to advance the death timer.
 * @returns A new population state object, potentially updated due to the death timer.
 */
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

/**
 * Processes the "death timer" when critical resource shortages occur, leading to population decrease.
 * This function initiates a countdown, provides warnings, and ultimately handles the reduction
 * of colonists if the timer runs out due to prolonged resource scarcity.
 *
 * @param population - The current population state, potentially including a `deathTimer` property.
 * @param deltaTime - The time elapsed since the last update in seconds, used to decrement the `deathTimer`.
 * @returns A new population state object, updated based on the death timer's progression.
 */
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

/**
 * Monitors the levels of critical resources and triggers specific checks or events
 * based on their current status. This function acts as a high-level dispatcher
 * for individual resource monitoring.
 *
 * @param state - The current game state, containing all resource information.
 * @returns The (potentially unchanged) game state after resource level checks have been performed.
 */
const monitorResourceLevels = (state) => {
  const currentTime = Date.now();
  checkResourceLevel("oxygen", state, currentTime);
  checkResourceLevel("food", state, currentTime);
  checkResourceLevel("energy", state, currentTime);
  return state;
};

/**
 * Checks the current level of a specific resource and triggers alerts if it falls below predefined thresholds.
 * This function also incorporates a cooldown mechanism to prevent spamming alerts for persistent shortages.
 *
 * @param resource - The identifier of the resource to check (e.g., "oxygen", "food", "energy").
 * @param state - The current game state, containing resource amounts, production, and consumption.
 * @param currentTime - The current timestamp in milliseconds, used for cooldown calculations.
 */
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

/**
 * Displays an immediate, critical alert to the player when a life-threatening resource shortage begins.
 * This serves as the initial warning that the death timer has been activated and colonists are now at risk.
 */
const showCriticalAlert = () => {
  toast({
    title: "CRITICAL: Life Support Failure!",
    description:
      "Colonists will start dying soon if resources aren't restored!",
    variant: "destructive",
  });
};

/**
 * Displays a critical or low resource alert to the player and updates the last warned timestamp for that resource.
 * This function provides specific, localized messages and visual cues to inform the player about resource shortages.
 *
 * @param resource - The identifier of the resource experiencing a shortage (e.g., "oxygen", "food", "energy").
 * @param level - The severity of the shortage, either "critical" or "low".
 */
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

/**
 * Handles the consequences of a colonist dying due to critical resource shortages.
 * This function reduces the population count, resets the death timer, and triggers
 * appropriate in-game notifications, including a game over condition if all colonists are lost.
 *
 * @param population - The current population state object, including `total` and `available` colonists, and an optional `deathTimer`.
 * @returns A new population state object with updated counts and a reset death timer.
 */
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

/**
 * Clears the "death timer" and reassures the player when critical resource shortages have been resolved.
 * This function is called when essential resources return to safe levels, indicating the immediate threat to colonists has passed.
 *
 * @param population - The current population state object, which might still contain a `deathTimer` property.
 * @returns A new population state object with the `deathTimer` removed, signifying the end of the crisis.
 */
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

/**
 * Triggers a warning alert when the death timer for colonists reaches a critical threshold.
 * This function provides a last-chance notification to the player before a colonist perishes due to resource shortages.
 *
 * @param deathTimer - The current value of the death timer in seconds.
 */
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
