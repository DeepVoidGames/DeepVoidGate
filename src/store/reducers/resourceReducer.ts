import { GameAction } from "../actions";
import { ResourceType, ResourceData } from "../types";

// Define ResourcesState as a type rather than an interface with mapped type
export type ResourcesState = Record<ResourceType, ResourceData>;

// Calculate resource changes based on production/consumption rates and time delta
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
    let newAmount = resource.amount + delta;

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

// Reset production and consumption counters
export const resetProductionCounters = (
  resources: ResourcesState
): ResourcesState => {
  const newResources = { ...resources };

  Object.keys(newResources).forEach((key) => {
    const resourceKey = key as ResourceType;
    newResources[resourceKey] = {
      ...newResources[resourceKey],
      production: 0,
      consumption: 0,
    };
  });

  return newResources;
};

// Update resource based on cost
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

// Check if resources are sufficient for costs
export const canAffordCost = (
  resources: ResourcesState,
  costs: Partial<Record<ResourceType, number>>
): boolean => {
  return Object.entries(costs).every(([resource, cost]) => {
    const resourceKey = resource as ResourceType;
    const currentAmount = resources[resourceKey]?.amount || 0;

    // Logi diagnostyczne
    if (cost && currentAmount < cost) {
      console.warn(
        `Insufficient ${resource}: ${currentAmount.toFixed(2)} < ${cost}`
      );
      return false;
    }
    return true;
  });
};
