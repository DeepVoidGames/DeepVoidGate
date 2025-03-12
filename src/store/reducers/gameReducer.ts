
import { toast } from '@/components/ui/use-toast';
import { GameAction } from '../actions';
import { GameState } from '../types';
import { initialResourcesState, initialPopulationState, initialBuildings } from '../initialData';
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
      const buildings = calculateBuildingEfficiency(state.buildings);
      
      // Apply building effects to resources
      newResources = applyBuildingEffects(buildings, newResources);
      
      // Apply population consumption
      newResources = calculatePopulationConsumption(state.population, newResources);
      
      // Calculate resource changes based on production/consumption
      newResources = calculateResourceChanges(newResources, deltaTime);
      
      // Check for critical resource shortages
      const oxygenNet = newResources.oxygen.production - newResources.oxygen.consumption;
      const foodNet = newResources.food.production - newResources.food.consumption;
      
      if (newResources.oxygen.amount <= 0 && oxygenNet < 0) {
        toast({
          title: "Critical Oxygen Shortage!",
          description: "Your colony is suffocating. Build more oxygen generators immediately!",
          variant: "destructive"
        });
      }
      
      if (newResources.food.amount <= 0 && foodNet < 0) {
        toast({
          title: "Critical Food Shortage!",
          description: "Your colonists are starving. Increase food production immediately!",
          variant: "destructive"
        });
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
