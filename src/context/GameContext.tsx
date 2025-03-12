
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';

// Resource types
export type ResourceType = 'oxygen' | 'food' | 'energy' | 'metals' | 'science';

// Building types
export type BuildingType = 'oxygenGenerator' | 'hydroponicFarm' | 'solarPanel' | 'metalMine' | 'researchLab' | 'housing';

// Resource data structure
export interface ResourceData {
  amount: number;
  production: number;
  consumption: number;
  capacity: number;
  icon: string;
  color: string;
}

// Building data structure
export interface BuildingData {
  id: string;
  type: BuildingType;
  name: string;
  description: string;
  level: number;
  workerCapacity: number;
  assignedWorkers: number;
  efficiency: number;
  baseCost: {
    [key in ResourceType]?: number;
  };
  baseProduction: {
    [key in ResourceType]?: number;
  };
  baseConsumption: {
    [key in ResourceType]?: number;
  };
  costMultiplier: number;
  productionMultiplier: number;
}

// Game state interface
export interface GameState {
  resources: {
    [key in ResourceType]: ResourceData;
  };
  buildings: BuildingData[];
  population: {
    total: number;
    available: number;
    maxCapacity: number;
  };
  lastUpdate: number;
  paused: boolean;
}

// Action types
type Action =
  | { type: 'TICK'; payload: { currentTime: number } }
  | { type: 'CONSTRUCT_BUILDING'; payload: { buildingType: BuildingType } }
  | { type: 'UPGRADE_BUILDING'; payload: { buildingId: string } }
  | { type: 'ASSIGN_WORKER'; payload: { buildingId: string; count: number } }
  | { type: 'TOGGLE_PAUSE' }
  | { type: 'SAVE_GAME' }
  | { type: 'LOAD_GAME' }
  | { type: 'RESET_GAME' };

// Initial building configurations
const initialBuildings: Omit<BuildingData, 'id'>[] = [
  {
    type: 'oxygenGenerator',
    name: 'Oxygen Generator',
    description: 'Produces oxygen from the planet\'s thin atmosphere',
    level: 0,
    workerCapacity: 2,
    assignedWorkers: 0,
    efficiency: 0,
    baseCost: {
      metals: 50,
      energy: 20,
    },
    baseProduction: {
      oxygen: 1,
    },
    baseConsumption: {
      energy: 0.5,
    },
    costMultiplier: 1.5,
    productionMultiplier: 1.2,
  },
  {
    type: 'hydroponicFarm',
    name: 'Hydroponic Farm',
    description: 'Grows nutritious food in controlled environments',
    level: 0,
    workerCapacity: 3,
    assignedWorkers: 0,
    efficiency: 0,
    baseCost: {
      metals: 40,
      energy: 15,
      oxygen: 10,
    },
    baseProduction: {
      food: 1,
    },
    baseConsumption: {
      oxygen: 0.2,
      energy: 0.3,
    },
    costMultiplier: 1.4,
    productionMultiplier: 1.2,
  },
  {
    type: 'solarPanel',
    name: 'Solar Array',
    description: 'Captures energy from the nearby star',
    level: 0,
    workerCapacity: 1,
    assignedWorkers: 0,
    efficiency: 0,
    baseCost: {
      metals: 60,
    },
    baseProduction: {
      energy: 2,
    },
    baseConsumption: {},
    costMultiplier: 1.6,
    productionMultiplier: 1.3,
  },
  {
    type: 'metalMine',
    name: 'Metal Extractor',
    description: 'Extracts metal ores from the planetary crust',
    level: 0,
    workerCapacity: 4,
    assignedWorkers: 0,
    efficiency: 0,
    baseCost: {
      energy: 30,
    },
    baseProduction: {
      metals: 0.8,
    },
    baseConsumption: {
      energy: 0.8,
      oxygen: 0.1,
    },
    costMultiplier: 1.5,
    productionMultiplier: 1.2,
  },
  {
    type: 'researchLab',
    name: 'Research Lab',
    description: 'Scientists work to advance colony technology',
    level: 0,
    workerCapacity: 2,
    assignedWorkers: 0,
    efficiency: 0,
    baseCost: {
      metals: 80,
      energy: 40,
    },
    baseProduction: {
      science: 0.5,
    },
    baseConsumption: {
      energy: 1,
      oxygen: 0.3,
    },
    costMultiplier: 1.7,
    productionMultiplier: 1.3,
  },
  {
    type: 'housing',
    name: 'Habitat Dome',
    description: 'Living quarters for the colony\'s population',
    level: 0,
    workerCapacity: 1,
    assignedWorkers: 0,
    efficiency: 0,
    baseCost: {
      metals: 100,
      energy: 20,
    },
    baseProduction: {},
    baseConsumption: {
      oxygen: 0.2,
      energy: 0.3,
    },
    costMultiplier: 1.6,
    productionMultiplier: 1,
  },
];

// Initialize the game state
const initialState: GameState = {
  resources: {
    oxygen: {
      amount: 50,
      production: 0,
      consumption: 0,
      capacity: 100,
      icon: 'O₂',
      color: 'cyan',
    },
    food: {
      amount: 50,
      production: 0,
      consumption: 0,
      capacity: 100,
      icon: '🌱',
      color: 'green',
    },
    energy: {
      amount: 100,
      production: 0,
      consumption: 0,
      capacity: 200,
      icon: '⚡',
      color: 'yellow',
    },
    metals: {
      amount: 100,
      production: 0,
      consumption: 0,
      capacity: 200,
      icon: '⛏️',
      color: 'zinc',
    },
    science: {
      amount: 0,
      production: 0,
      consumption: 0,
      capacity: 100,
      icon: '🔬',
      color: 'purple',
    },
  },
  buildings: [],
  population: {
    total: 10,
    available: 10,
    maxCapacity: 10,
  },
  lastUpdate: Date.now(),
  paused: false,
};

// Generate a unique ID
const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Game reducer function
const gameReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case 'TICK': {
      if (state.paused) return state;

      const { currentTime } = action.payload;
      const deltaTime = (currentTime - state.lastUpdate) / 1000; // in seconds
      
      // Reset production and consumption rates
      const newResources = { ...state.resources };
      Object.keys(newResources).forEach((key) => {
        const resourceKey = key as ResourceType;
        newResources[resourceKey] = {
          ...newResources[resourceKey],
          production: 0,
          consumption: 0,
        };
      });
      
      // Calculate efficiency and resource production/consumption for each building
      const buildings = state.buildings.map(building => {
        const efficiency = Math.min(1, building.assignedWorkers / building.workerCapacity);
        
        // Apply production and consumption effects based on efficiency
        Object.entries(building.baseProduction).forEach(([resource, amount]) => {
          const resourceKey = resource as ResourceType;
          if (newResources[resourceKey]) {
            newResources[resourceKey].production += amount * building.level * efficiency;
          }
        });
        
        Object.entries(building.baseConsumption).forEach(([resource, amount]) => {
          const resourceKey = resource as ResourceType;
          if (newResources[resourceKey]) {
            newResources[resourceKey].consumption += amount * building.level * efficiency;
          }
        });
        
        return {
          ...building,
          efficiency,
        };
      });
      
      // Update resource amounts
      Object.keys(newResources).forEach((key) => {
        const resourceKey = key as ResourceType;
        const resource = newResources[resourceKey];
        const netProduction = resource.production - resource.consumption;
        
        // Apply resource delta
        let newAmount = resource.amount + (netProduction * deltaTime);
        
        // Enforce resource limits
        newAmount = Math.max(0, Math.min(newAmount, resource.capacity));
        
        newResources[resourceKey] = {
          ...resource,
          amount: newAmount,
        };
      });
      
      // Calculate population consumption
      // Basic life support - oxygen and food consumption
      const oxygenPerPerson = 0.05;
      const foodPerPerson = 0.05;
      
      newResources.oxygen.consumption += state.population.total * oxygenPerPerson;
      newResources.food.consumption += state.population.total * foodPerPerson;
      
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
      
      // Update resource amounts with consumption
      Object.keys(newResources).forEach((key) => {
        const resourceKey = key as ResourceType;
        const resource = newResources[resourceKey];
        const netProduction = resource.production - resource.consumption;
        
        // Apply resource delta
        let newAmount = resource.amount + (netProduction * deltaTime);
        
        // Enforce resource limits
        newAmount = Math.max(0, Math.min(newAmount, resource.capacity));
        
        newResources[resourceKey] = {
          ...resource,
          amount: newAmount,
        };
      });
      
      // Calculate available population (not assigned to buildings)
      const assignedWorkers = buildings.reduce((total, building) => total + building.assignedWorkers, 0);
      const availableWorkers = state.population.total - assignedWorkers;
      
      return {
        ...state,
        resources: newResources,
        buildings,
        population: {
          ...state.population,
          available: availableWorkers
        },
        lastUpdate: currentTime,
      };
    }
    
    case 'CONSTRUCT_BUILDING': {
      const { buildingType } = action.payload;
      
      // Find the building template
      const buildingTemplate = initialBuildings.find(b => b.type === buildingType);
      if (!buildingTemplate) return state;
      
      // Check if we can afford the building
      let canAfford = true;
      const newResources = { ...state.resources };
      
      Object.entries(buildingTemplate.baseCost).forEach(([resource, cost]) => {
        const resourceKey = resource as ResourceType;
        if (newResources[resourceKey].amount < cost) {
          canAfford = false;
        }
      });
      
      if (!canAfford) {
        toast({
          title: "Insufficient Resources",
          description: `You don't have enough resources to build a ${buildingTemplate.name}.`,
          variant: "destructive"
        });
        return state;
      }
      
      // Subtract resources
      Object.entries(buildingTemplate.baseCost).forEach(([resource, cost]) => {
        const resourceKey = resource as ResourceType;
        newResources[resourceKey] = {
          ...newResources[resourceKey],
          amount: newResources[resourceKey].amount - cost
        };
      });
      
      // Create new building
      const newBuilding: BuildingData = {
        ...buildingTemplate,
        id: generateId(),
        level: 1,
      };
      
      toast({
        title: "Building Constructed",
        description: `You've built a new ${newBuilding.name}!`,
      });
      
      return {
        ...state,
        resources: newResources,
        buildings: [...state.buildings, newBuilding],
      };
    }
    
    case 'UPGRADE_BUILDING': {
      const { buildingId } = action.payload;
      
      // Find the building
      const buildingIndex = state.buildings.findIndex(b => b.id === buildingId);
      if (buildingIndex === -1) return state;
      
      const building = state.buildings[buildingIndex];
      
      // Calculate upgrade cost based on the building's level
      const upgradeCosts: { [key in ResourceType]?: number } = {};
      
      Object.entries(building.baseCost).forEach(([resource, baseCost]) => {
        const resourceKey = resource as ResourceType;
        const cost = Math.floor(baseCost * Math.pow(building.costMultiplier, building.level));
        upgradeCosts[resourceKey] = cost;
      });
      
      // Check if we can afford the upgrade
      let canAfford = true;
      const newResources = { ...state.resources };
      
      Object.entries(upgradeCosts).forEach(([resource, cost]) => {
        const resourceKey = resource as ResourceType;
        if (cost && newResources[resourceKey].amount < cost) {
          canAfford = false;
        }
      });
      
      if (!canAfford) {
        toast({
          title: "Insufficient Resources",
          description: `You don't have enough resources to upgrade this ${building.name}.`,
          variant: "destructive"
        });
        return state;
      }
      
      // Subtract resources
      Object.entries(upgradeCosts).forEach(([resource, cost]) => {
        const resourceKey = resource as ResourceType;
        if (cost) {
          newResources[resourceKey] = {
            ...newResources[resourceKey],
            amount: newResources[resourceKey].amount - cost
          };
        }
      });
      
      // Upgrade building
      const newBuildings = [...state.buildings];
      newBuildings[buildingIndex] = {
        ...building,
        level: building.level + 1,
        workerCapacity: Math.floor(building.workerCapacity * 1.2),
      };
      
      toast({
        title: "Building Upgraded",
        description: `You've upgraded your ${building.name} to level ${building.level + 1}!`,
      });
      
      return {
        ...state,
        resources: newResources,
        buildings: newBuildings,
      };
    }
    
    case 'ASSIGN_WORKER': {
      const { buildingId, count } = action.payload;
      
      // Find the building
      const buildingIndex = state.buildings.findIndex(b => b.id === buildingId);
      if (buildingIndex === -1) return state;
      
      const building = state.buildings[buildingIndex];
      
      // Calculate current assigned workers across all buildings
      const currentAssigned = state.buildings.reduce(
        (total, b) => total + (b.id !== buildingId ? b.assignedWorkers : 0),
        0
      );
      
      // Determine new worker assignment for this building
      let newAssignment = building.assignedWorkers + count;
      
      // Cannot assign more workers than capacity
      newAssignment = Math.min(newAssignment, building.workerCapacity);
      
      // Cannot assign more workers than available
      const maxPossibleAssignment = state.population.total - currentAssigned;
      newAssignment = Math.min(newAssignment, maxPossibleAssignment);
      
      // Cannot have negative workers
      newAssignment = Math.max(0, newAssignment);
      
      // If no change, return current state
      if (newAssignment === building.assignedWorkers) {
        return state;
      }
      
      // Update building
      const newBuildings = [...state.buildings];
      newBuildings[buildingIndex] = {
        ...building,
        assignedWorkers: newAssignment,
      };
      
      // Recalculate available workers
      const totalAssigned = newBuildings.reduce((total, b) => total + b.assignedWorkers, 0);
      const available = state.population.total - totalAssigned;
      
      return {
        ...state,
        buildings: newBuildings,
        population: {
          ...state.population,
          available,
        },
      };
    }
    
    case 'TOGGLE_PAUSE': {
      return {
        ...state,
        paused: !state.paused,
        lastUpdate: Date.now()
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

// Create the game context
interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<Action>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Game provider component
interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  // Game tick effect - runs every 100ms
  useEffect(() => {
    const tickInterval = setInterval(() => {
      dispatch({ type: 'TICK', payload: { currentTime: Date.now() } });
    }, 100);
    
    // Auto-save every minute
    const saveInterval = setInterval(() => {
      dispatch({ type: 'SAVE_GAME' });
    }, 60000);
    
    // Try to load saved game on first mount
    const savedState = localStorage.getItem('deepvoidgate_save');
    if (savedState) {
      dispatch({ type: 'LOAD_GAME' });
    } else {
      // Start with some initial buildings for new game
      dispatch({ type: 'CONSTRUCT_BUILDING', payload: { buildingType: 'oxygenGenerator' } });
      dispatch({ type: 'CONSTRUCT_BUILDING', payload: { buildingType: 'hydroponicFarm' } });
      dispatch({ type: 'CONSTRUCT_BUILDING', payload: { buildingType: 'solarPanel' } });
    }
    
    return () => {
      clearInterval(tickInterval);
      clearInterval(saveInterval);
    };
  }, []);
  
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the game context
export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
