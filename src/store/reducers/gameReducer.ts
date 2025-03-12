
import { toast } from '@/components/ui/use-toast';
import { GameAction } from '../actions';
import { GameState } from '../types';
import { initialResourcesState, initialPopulationState, initialBuildings, resourceAlertThresholds } from '../initialData';
import { generateId } from '../initialData';
import { 
  resetProductionCounters, 
  calculateResourceChanges, 
  applyResourceCost, 
  canAffordCost 
} from './resourceReducer';
import { 
  calculateBuildingEfficiency, 
  applyBuildingEffects, 
  constructBuilding, 
  upgradeBuilding, 
  assignWorker 
} from './buildingReducer';
import { calculatePopulationConsumption, recalculateAvailableWorkers } from './populationReducer';

// Initialize the game state
export const initialState: GameState = {
  resources: initialResourcesState,
  buildings: [],
  population: initialPopulationState,
  lastUpdate: Date.now(),
  paused: false,
};

// Track resource warnings to avoid spamming
const resourceWarnings = {
  oxygen: { lastWarned: 0 },
  food: { lastWarned: 0 },
  energy: { lastWarned: 0 }
};

// Game reducer function
export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'TICK': {
      if (state.paused) return state;

      const { currentTime } = action.payload;
      const deltaTime = (currentTime - state.lastUpdate) / 1000; // in seconds
      
      // Reset production and consumption rates
      let newResources = resetProductionCounters(state.resources);
      
      // Calculate efficiency for each building
      const buildings = calculateBuildingEfficiency(state.buildings, newResources);
      
      // Apply building effects to resources
      newResources = applyBuildingEffects(buildings, newResources);
      
      // Apply population consumption
      newResources = calculatePopulationConsumption(state.population, newResources);
      
      // Calculate resource changes based on production/consumption
      newResources = calculateResourceChanges(newResources, deltaTime);
      
      // Check for critical resource shortages (with cooldown to prevent spam)
      const currentTime_ms = Date.now();
      const warningCooldown = 60000; // 1 minute cooldown
      
      // Check oxygen levels
      if (resourceAlertThresholds.oxygen) {
        const oxygenLevel = newResources.oxygen.amount;
        const oxygenNet = newResources.oxygen.production - newResources.oxygen.consumption;
        
        if (oxygenLevel <= resourceAlertThresholds.oxygen.critical && oxygenNet < 0) {
          if (currentTime_ms - resourceWarnings.oxygen.lastWarned > warningCooldown) {
            toast({
              title: "CRITICAL: Oxygen Shortage!",
              description: "Your colony is suffocating. Build more oxygen generators immediately!",
              variant: "destructive"
            });
            resourceWarnings.oxygen.lastWarned = currentTime_ms;
          }
        } else if (oxygenLevel <= resourceAlertThresholds.oxygen.low && oxygenNet < 0) {
          if (currentTime_ms - resourceWarnings.oxygen.lastWarned > warningCooldown) {
            toast({
              title: "Warning: Low Oxygen",
              description: "Oxygen levels are dangerously low. Increase production.",
              variant: "destructive"
            });
            resourceWarnings.oxygen.lastWarned = currentTime_ms;
          }
        }
      }
      
      // Check food levels
      if (resourceAlertThresholds.food) {
        const foodLevel = newResources.food.amount;
        const foodNet = newResources.food.production - newResources.food.consumption;
        
        if (foodLevel <= resourceAlertThresholds.food.critical && foodNet < 0) {
          if (currentTime_ms - resourceWarnings.food.lastWarned > warningCooldown) {
            toast({
              title: "CRITICAL: Food Shortage!",
              description: "Your colonists are starving. Increase food production immediately!",
              variant: "destructive"
            });
            resourceWarnings.food.lastWarned = currentTime_ms;
          }
        } else if (foodLevel <= resourceAlertThresholds.food.low && foodNet < 0) {
          if (currentTime_ms - resourceWarnings.food.lastWarned > warningCooldown) {
            toast({
              title: "Warning: Low Food",
              description: "Food supplies are running low. Increase production.",
              variant: "destructive"
            });
            resourceWarnings.food.lastWarned = currentTime_ms;
          }
        }
      }
      
      // Check energy levels
      if (resourceAlertThresholds.energy) {
        const energyLevel = newResources.energy.amount;
        const energyNet = newResources.energy.production - newResources.energy.consumption;
        
        if (energyLevel <= resourceAlertThresholds.energy.critical && energyNet < 0) {
          if (currentTime_ms - resourceWarnings.energy.lastWarned > warningCooldown) {
            toast({
              title: "CRITICAL: Energy Shortage!",
              description: "Your colony is losing power. Build more energy generators!",
              variant: "destructive"
            });
            resourceWarnings.energy.lastWarned = currentTime_ms;
          }
        } else if (energyLevel <= resourceAlertThresholds.energy.low && energyNet < 0) {
          if (currentTime_ms - resourceWarnings.energy.lastWarned > warningCooldown) {
            toast({
              title: "Warning: Low Energy",
              description: "Energy reserves are running low. Increase production.",
              variant: "destructive"
            });
            resourceWarnings.energy.lastWarned = currentTime_ms;
          }
        }
      }
      
      return {
        ...state,
        resources: newResources,
        buildings,
        lastUpdate: currentTime,
      };
    }
    
    case 'CONSTRUCT_BUILDING': {
      const { buildingType } = action.payload;
      const result = constructBuilding(state.buildings, state.resources, buildingType);
      
      if (!result.success) return state;
      
      return {
        ...state,
        resources: result.resources,
        buildings: result.buildings,
      };
    }
    
    case 'UPGRADE_BUILDING': {
      const { buildingId } = action.payload;
      const result = upgradeBuilding(state.buildings, state.resources, buildingId);
      
      if (!result.success) return state;
      
      return {
        ...state,
        resources: result.resources,
        buildings: result.buildings,
      };
    }
    
    case 'ASSIGN_WORKER': {
      const { buildingId, count } = action.payload;
      const result = assignWorker(state.buildings, state.population, buildingId, count);
      
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
    
    case 'SAVE_GAME': {
      try {
        localStorage.setItem('deepvoidgate_save', JSON.stringify(state));
        toast({
          title: "Game Saved",
          description: "Your progress has been saved successfully."
        });
      } catch (error) {
        console.error('Failed to save game:', error);
        toast({
          title: "Save Failed",
          description: "There was an error saving your game.",
          variant: "destructive"
        });
      }
      return state;
    }
    
    case 'LOAD_GAME': {
      try {
        const savedState = localStorage.getItem('deepvoidgate_save');
        if (!savedState) {
          toast({
            title: "No Saved Game",
            description: "No saved game was found. Starting a new game.",
            variant: "destructive"
          });
          return initialState;
        }
        
        const parsedState = JSON.parse(savedState) as GameState;
        toast({
          title: "Game Loaded",
          description: "Your saved game has been loaded successfully."
        });
        return {
          ...parsedState,
          lastUpdate: Date.now(),
        };
      } catch (error) {
        console.error('Failed to load game:', error);
        toast({
          title: "Load Failed",
          description: "There was an error loading your saved game.",
          variant: "destructive"
        });
        return state;
      }
    }
    
    case 'RESET_GAME': {
      localStorage.removeItem('deepvoidgate_save');
      toast({
        title: "Game Reset",
        description: "Your game has been reset. Starting a new game."
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
