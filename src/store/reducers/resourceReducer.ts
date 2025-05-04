import { ResourceData, ResourceType } from "@/types/resource";

// Define ResourcesState as a type rather than an interface with mapped type
export type ResourcesState = Record<ResourceType, ResourceData>;

/**
 * Calculates the changes in resource amounts over time based on their production and consumption rates.
 *
 * This function updates the resource amounts in the state, adjusting for production and consumption over a given period (`deltaTime`).
 * The new resource amounts are limited by their respective capacities, and changes are calculated with precision to 4 decimal places.
 *
 * @param resources - Obiekt stanu zasobów, zawierający informacje o produkcji, konsumpcji, ilości i pojemności dla każdego zasobu.
 * @param deltaTime - Czas, w którym obliczana jest zmiana zasobów (w sekundach).
 * @returns Nowy stan zasobów zaktualizowany o zmiany w ilości zasobów.
 */
export const calculateResourceChanges = (
  resources: ResourcesState,
  deltaTime: number
): ResourcesState => {
  const newResources = { ...resources };

  Object.keys(newResources).forEach((key) => {
    const resourceKey = key as ResourceType;
    const resource = newResources[resourceKey];

    // Oblicz zmianę z uwzględnieniem czasu
    const netRate = resource.production - resource.consumption;
    let delta = 0;
    if (resource.amount < resource.capacity) {
      delta = netRate * deltaTime;
    }
    // Oblicz nową ilość z uwzględnieniem pojemności
    const newAmount = resource.amount + delta;

    // Zastosuj limity (0 < amount < capacity)
    // newAmount = Math.max(0, Math.min(newAmount, resource.capacity));

    // Aktualizuj stan tylko jeśli jest zmiana
    if (Math.abs(delta) > 0.0001) {
      newResources[resourceKey] = {
        ...resource,
        amount: parseFloat(newAmount.toFixed(4)), // Zaokrąglij do 4 miejsc po przecinku
      };
    }
  });

  return newResources;
};

/**
 * Resets the production and consumption counters for all resources to their default values.
 *
 * This function resets the production rate to 1 and the consumption rate to 0 for all resources in the provided state.
 * It is useful when you want to restart or reconfigure the resource management system to a default state.
 *
 * @param resources - Obiekt stanu zasobów, zawierający informacje o produkcji, konsumpcji, ilości i pojemności dla każdego zasobu.
 * @returns Nowy stan zasobów, w którym liczniki produkcji i konsumpcji zostały zresetowane.
 */
export const resetProductionCounters = (
  resources: ResourcesState
): ResourcesState => {
  const newResources = { ...resources };

  Object.keys(newResources).forEach((key) => {
    const resourceKey = key as ResourceType;
    newResources[resourceKey] = {
      ...newResources[resourceKey],
      production: 1,
      consumption: 0,
    };
  });

  return newResources;
};

/**
 * Applies a cost to the specified resources by subtracting the given amount from each resource's available amount.
 *
 * This function will reduce the amount of each resource based on the provided costs. The resource amounts
 * will not go below zero, ensuring that no negative values occur. It is useful for applying resource consumption
 * during actions like building or expedition launches.
 *
 * @param resources - Obiekt stanu zasobów, który zawiera informacje o dostępnych ilościach zasobów.
 * @param costs - Obiekt zawierający koszty w zasobach, gdzie kluczami są typy zasobów, a wartościami są liczby oznaczające koszt.
 *
 * @returns Nowy stan zasobów, gdzie koszt został zastosowany do odpowiednich zasobów.
 */
export const applyResourceCost = (
  resources: ResourcesState,
  costs: Partial<Record<ResourceType, number>>
): ResourcesState => {
  const newResources = { ...resources };

  Object.entries(costs).forEach(([resource, cost]) => {
    const resourceKey = resource as ResourceType;
    if (cost && newResources[resourceKey]) {
      const newAmount = newResources[resourceKey].amount - cost;
      newResources[resourceKey] = {
        ...newResources[resourceKey],
        amount: Math.max(0, newAmount), // Nigdy poniżej zera
      };
    }
  });

  return newResources;
};

/**
 * Sprawdza, czy dostępne zasoby wystarczają na pokrycie podanych kosztów.
 *
 * Funkcja przechodzi przez wszystkie wymagane zasoby i sprawdza, czy dostępna ilość zasobów
 * jest większa lub równa wymaganej wartości. Jeśli jakikolwiek zasób jest niewystarczający,
 * funkcja zwraca `false`. W przeciwnym razie, zwraca `true`.
 *
 * @param resources - Obiekt stanu zasobów, zawierający aktualne ilości zasobów.
 * @param costs - Obiekt zawierający koszty w zasobach, gdzie kluczami są typy zasobów, a wartościami są liczby oznaczające wymagany koszt.
 *
 * @returns `true` jeśli wszystkie wymagane zasoby są dostępne w wystarczającej ilości, w przeciwnym razie `false`.
 */
export const canAffordCost = (
  resources: ResourcesState,
  costs: Partial<Record<ResourceType, number>>
): boolean => {
  return Object.entries(costs).every(([resource, cost]) => {
    const resourceKey = resource as ResourceType;
    const currentAmount = resources[resourceKey]?.amount || 0;

    // Logi diagnostyczne
    if (cost && currentAmount < cost) {
      // console.warn(
      //   `Insufficient ${resource}: ${currentAmount.toFixed(2)} < ${cost}`
      // );
      return false;
    }
    return true;
  });
};
