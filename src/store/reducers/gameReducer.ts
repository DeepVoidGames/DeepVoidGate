import { toast } from "@/components/ui/use-toast";
import { GameAction } from "../actions";
import { GameState, ResourceType } from "../types";
import {
  initialResourcesState,
  initialPopulationState,
  initialBuildings,
  resourceAlertThresholds,
  initialTechnologies,
} from "../initialData";
import { generateId } from "../initialData";
import {
  resetProductionCounters,
  calculateResourceChanges,
  applyResourceCost,
  canAffordCost,
} from "./resourceReducer";
import {
  calculateBuildingEfficiency,
  applyBuildingEffects,
  constructBuilding,
  upgradeBuilding,
  assignWorker,
} from "./buildingReducer";
import {
  calculatePopulationConsumption,
  recalculateAvailableWorkers,
} from "./populationReducer";
import { researchTechnology, updateResearches } from "./technologyReducer";
import { stat } from "fs";
import { calculateOfflineProduction } from "@/lib/calculateOfflineProduction";
import {
  CURRENT_GAME_VERSION,
  migrateGameState,
} from "@/migrations/migrateGameState";

// Initialize the game state
export const initialState: GameState = {
  version: CURRENT_GAME_VERSION,
  resources: initialResourcesState,
  buildings: [],
  population: initialPopulationState,
  technologies: initialTechnologies,
  lastUpdate: Date.now(),
  paused: false,
  name: undefined,
  showOfflineProgress: undefined,
  offlineReport: undefined,
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

      const { currentTime } = action.payload;
      const deltaTime = (currentTime - state.lastUpdate) / 1000; // in seconds

      // Reset production and consumption rates
      let newResources = resetProductionCounters(state.resources);

      // Calculate efficiency for each building
      const buildings = calculateBuildingEfficiency(
        state.buildings,
        newResources
      );

      // Apply building effects to resources
      newResources = applyBuildingEffects(buildings, newResources);

      // Apply population consumption
      newResources = calculatePopulationConsumption(
        state.population,
        newResources
      );

      // Calculate resource changes based on production/consumption
      newResources = calculateResourceChanges(newResources, deltaTime);

      // Check for critical resource shortages (with cooldown to prevent spam)
      const currentTime_ms = Date.now();
      const warningCooldown = 60000; // 1 minute cooldown

      // Death timer logic - check if oxygen or food is critically low
      let newPopulation = { ...state.population };
      const hasOxygenShortage =
        newResources.oxygen.amount <=
        (resourceAlertThresholds.oxygen?.critical || 0);
      const hasFoodShortage =
        newResources.food.amount <=
        (resourceAlertThresholds.food?.critical || 0);

      if (hasOxygenShortage || hasFoodShortage) {
        // Start or continue death timer
        if (!newPopulation.deathTimer) {
          newPopulation.deathTimer = DEATH_TIMER_START;

          toast({
            title: hasOxygenShortage
              ? "CRITICAL: Oxygen Depletion!"
              : "CRITICAL: Starvation Imminent!",
            description: `Life support critical! Colonists will start dying in ${Math.floor(
              DEATH_TIMER_START / 60
            )} minutes if not resolved.`,
            variant: "destructive",
          });
        } else {
          // Decrease timer
          newPopulation.deathTimer -= deltaTime;

          // 1 minute warning
          if (
            newPopulation.deathTimer <= DEATH_TIMER_WARNING &&
            newPopulation.deathTimer > DEATH_TIMER_WARNING - 10
          ) {
            toast({
              title: "EMERGENCY: Colonist Death Imminent!",
              description: `First colonist will die in ${Math.floor(
                newPopulation.deathTimer
              )} seconds!`,
              variant: "destructive",
            });
          }

          // If timer reaches zero, kill a colonist
          if (newPopulation.deathTimer <= 0) {
            newPopulation.total = Math.max(0, newPopulation.total - 1);
            newPopulation.available = Math.max(0, newPopulation.available - 1);
            newPopulation.deathTimer = DEATH_TIMER_START; // Reset timer for next colonist

            toast({
              title: "Colony Disaster: Colonist Lost",
              description:
                "A colonist has died due to critical life support failure.",
              variant: "destructive",
            });

            // If all colonists are dead, game over
            if (newPopulation.total === 0) {
              toast({
                title: "GAME OVER",
                description:
                  "All colonists have perished. The colony has failed.",
                variant: "destructive",
              });
            }
          }
        }
      } else {
        // If resources are restored, clear death timer
        if (newPopulation.deathTimer) {
          newPopulation.deathTimer = undefined;

          toast({
            title: "Life Support Restored",
            description:
              "Critical resources restored to safe levels. Colonists are safe for now.",
          });
        }
      }

      // Check oxygen levels
      if (resourceAlertThresholds.oxygen) {
        const oxygenLevel = newResources.oxygen.amount;
        const oxygenNet =
          newResources.oxygen.production - newResources.oxygen.consumption;

        if (
          oxygenLevel <= resourceAlertThresholds.oxygen.critical &&
          oxygenNet < 0
        ) {
          if (
            currentTime_ms - resourceWarnings.oxygen.lastWarned >
            warningCooldown
          ) {
            toast({
              title: "CRITICAL: Oxygen Shortage!",
              description:
                "Your colony is suffocating. Build more oxygen generators immediately!",
              variant: "destructive",
            });
            resourceWarnings.oxygen.lastWarned = currentTime_ms;
          }
        } else if (
          oxygenLevel <= resourceAlertThresholds.oxygen.low &&
          oxygenNet < 0
        ) {
          if (
            currentTime_ms - resourceWarnings.oxygen.lastWarned >
            warningCooldown
          ) {
            toast({
              title: "Warning: Low Oxygen",
              description:
                "Oxygen levels are dangerously low. Increase production.",
              variant: "destructive",
            });
            resourceWarnings.oxygen.lastWarned = currentTime_ms;
          }
        }
      }

      // Check food levels
      if (resourceAlertThresholds.food) {
        const foodLevel = newResources.food.amount;
        const foodNet =
          newResources.food.production - newResources.food.consumption;

        if (foodLevel <= resourceAlertThresholds.food.critical && foodNet < 0) {
          if (
            currentTime_ms - resourceWarnings.food.lastWarned >
            warningCooldown
          ) {
            toast({
              title: "CRITICAL: Food Shortage!",
              description:
                "Your colonists are starving. Increase food production immediately!",
              variant: "destructive",
            });
            resourceWarnings.food.lastWarned = currentTime_ms;
          }
        } else if (
          foodLevel <= resourceAlertThresholds.food.low &&
          foodNet < 0
        ) {
          if (
            currentTime_ms - resourceWarnings.food.lastWarned >
            warningCooldown
          ) {
            toast({
              title: "Warning: Low Food",
              description:
                "Food supplies are running low. Increase production.",
              variant: "destructive",
            });
            resourceWarnings.food.lastWarned = currentTime_ms;
          }
        }
      }

      // Check energy levels
      if (resourceAlertThresholds.energy) {
        const energyLevel = newResources.energy.amount;
        const energyNet =
          newResources.energy.production - newResources.energy.consumption;

        if (
          energyLevel <= resourceAlertThresholds.energy.critical &&
          energyNet < 0
        ) {
          if (
            currentTime_ms - resourceWarnings.energy.lastWarned >
            warningCooldown
          ) {
            toast({
              title: "CRITICAL: Energy Shortage!",
              description:
                "Your colony is losing power. Build more energy generators!",
              variant: "destructive",
            });
            resourceWarnings.energy.lastWarned = currentTime_ms;
          }
        } else if (
          energyLevel <= resourceAlertThresholds.energy.low &&
          energyNet < 0
        ) {
          if (
            currentTime_ms - resourceWarnings.energy.lastWarned >
            warningCooldown
          ) {
            toast({
              title: "Warning: Low Energy",
              description:
                "Energy reserves are running low. Increase production.",
              variant: "destructive",
            });
            resourceWarnings.energy.lastWarned = currentTime_ms;
          }
        }
      }

      return {
        ...state,
        resources: newResources,
        buildings,
        population: newPopulation,
        lastUpdate: currentTime,
      };
    }

    case "CONSTRUCT_BUILDING": {
      const { buildingType } = action.payload;
      const result = constructBuilding(
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
      const result = upgradeBuilding(
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
      const result = assignWorker(
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
        techId
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

    case "SAVE_GAME": {
      try {
        const stateToSave = {
          ...state,
          version: CURRENT_GAME_VERSION, // Zawsze zapisuj z aktualną wersją
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

        // Jeśli nie było progresu, zaktualizuj tylko timestamp
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
          description: "There was an error loading your saved game.",
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
