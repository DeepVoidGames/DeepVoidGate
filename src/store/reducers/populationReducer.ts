import { BuildingData } from "@/types/building";

export interface PopulationState {
  total: number;
  available: number;
}

/**
 * Oblicza zużycie tlenu i jedzenia przez populację.
 *
 * Funkcja przyjmuje stan populacji oraz aktualny stan zasobów, a następnie oblicza, ile tlenu i jedzenia zostanie zużyte przez całą populację na podstawie ustalonych wskaźników.
 *
 * @param population - Obiekt reprezentujący stan populacji, zawierający m.in. całkowitą liczbę osób.
 * @param resources - Obiekt reprezentujący zasoby, w tym informacje o zużyciu tlenu i jedzenia.
 * @returns Obiekt zasobów zaktualizowany o zużycie tlenu i jedzenia przez całą populację.
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
 * This function calculates the total number of workers assigned to buildings and subtracts that from the total population to determine how many workers are available for other tasks.
 *
 * @param population - Obiekt reprezentujący stan populacji, w tym całkowitą liczbę ludzi.
 * @param buildings - Tablica obiektów reprezentujących budynki, w tym liczbę przypisanych pracowników.
 * @returns Nowy obiekt stanu populacji zaktualizowany o liczbę dostępnych pracowników.
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
