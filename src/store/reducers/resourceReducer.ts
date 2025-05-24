import { ResourceData, ResourceType } from "@/types/resource";

// Define ResourcesState as a type rather than an interface with mapped type
export type ResourcesState = Record<ResourceType, ResourceData>;

/**
 * Calculates the changes in resource amounts over time based on their production and consumption rates.
 *
 * This function updates the resource amounts in the state, adjusting for production and consumption over a given period (`deltaTime`).
 * The new resource amounts are limited by their respective capacities, and changes are calculated with precision to 4 decimal places.
 *
 * @param resources - Resource state object containing information about production, consumption, amount, and capacity for each resource.
 * @param deltaTime - Time period over which the resource change is calculated (in seconds).
 * @returns New resource state updated with the changes in resource amounts.
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
 * @param resources - Resource state object containing information about production, consumption, amount, and capacity for each resource.
 * @returns New resource state with production and consumption counters reset.
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
 * @param resources - Resource state object containing information about available resource amounts.
 * @param costs - Object containing resource costs, where keys are resource types and values are the cost amounts.
 *
 * @returns New resource state with the costs applied to the corresponding resources.
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
 * Checks if available resources are sufficient to cover the given costs.
 *
 * The function iterates over all required resources and verifies if the available amount
 * is greater than or equal to the required value. If any resource is insufficient,
 * the function returns `false`. Otherwise, it returns `true`.
 *
 * @param resources - Resource state object containing current resource amounts.
 * @param costs - Object containing resource costs, where keys are resource types and values are the required costs.
 *
 * @returns `true` if all required resources are available in sufficient amounts, otherwise `false`.
 */
export const canAffordCost = (
  resources: ResourcesState,
  costs: Partial<Record<ResourceType, number>>
): boolean => {
  return Object.entries(costs).every(([resource, cost]) => {
    const resourceKey = resource as ResourceType;
    const currentAmount = resources[resourceKey]?.amount || 0;

    // Diagnostic log
    if (cost && currentAmount < cost) {
      // console.warn(
      //   `Insufficient ${resource}: ${currentAmount.toFixed(2)} < ${cost}`
      // );
      return false;
    }
    return true;
  });
};
