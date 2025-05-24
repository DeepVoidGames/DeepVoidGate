import { BuildingData } from "@/types/building";

export interface PopulationState {
  total: number;
  available: number;
}

/**
 * Calculates oxygen and food consumption by the population.
 *
 * The function takes the population state and the current resource state,
 * then calculates how much oxygen and food will be consumed by the entire population
 * based on established consumption rates.
 *
 * @param population - Object representing the population state, including total number of people.
 * @param resources - Object representing resources, including oxygen and food consumption info.
 * @returns Resource object updated with oxygen and food consumption by the entire population.
 */
export const calculatePopulationConsumption = (
  population: PopulationState,
  resources: { oxygen: { consumption: number }; food: { consumption: number } }
): { oxygen: { consumption: number }; food: { consumption: number } } => {
  const newResources = { ...resources };

  // Basic life support - oxygen and food consumption
  const oxygenPerPerson = 0.07;
  const foodPerPerson = 0.07;

  newResources.oxygen.consumption += population.total * oxygenPerPerson;
  newResources.food.consumption += population.total * foodPerPerson;

  return newResources;
};

/**
 * Recalculates the number of available workers based on population and assigned workers in buildings.
 *
 * This function calculates the total number of workers assigned to buildings and subtracts that from the total population
 * to determine how many workers are available for other tasks.
 *
 * @param population - Object representing the population state, including total number of people.
 * @param buildings - Array of objects representing buildings, including the number of assigned workers.
 * @returns New population state object updated with the number of available workers.
 */
export const recalculateAvailableWorkers = (
  population: PopulationState,
  buildings: BuildingData[]
): PopulationState => {
  const totalAssigned = buildings.reduce(
    (total, building) => total + building.assignedWorkers,
    0
  );
  const available = population.total - totalAssigned;

  return {
    ...population,
    available,
  };
};
