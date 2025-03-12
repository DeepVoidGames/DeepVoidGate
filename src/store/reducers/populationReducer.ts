
import { GameAction } from '../actions';
import { BuildingData } from '../types';

export interface PopulationState {
  total: number;
  available: number;
  maxCapacity: number;
}

// Apply population consumption to resources
export const calculatePopulationConsumption = (
  population: PopulationState,
  resources: any
): any => {
  const newResources = { ...resources };
  
  // Basic life support - oxygen and food consumption
  const oxygenPerPerson = 0.05;
  const foodPerPerson = 0.05;
  
  newResources.oxygen.consumption += population.total * oxygenPerPerson;
  newResources.food.consumption += population.total * foodPerPerson;
  
  return newResources;
};

// Recalculate available workers
export const recalculateAvailableWorkers = (
  population: PopulationState,
  buildings: BuildingData[]
): PopulationState => {
  const totalAssigned = buildings.reduce((total, building) => total + building.assignedWorkers, 0);
  const available = population.total - totalAssigned;
  
  return {
    ...population,
    available,
  };
};
