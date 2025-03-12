
import { GameAction } from '../actions';
import { ResourceType, ResourceData } from '../types';

export interface ResourcesState {
  [key in ResourceType]: ResourceData;
}

// Calculate resource changes based on production/consumption rates and time delta
export const calculateResourceChanges = (
  resources: ResourcesState,
  deltaTime: number
): ResourcesState => {
  const newResources = { ...resources };
  
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
  
  return newResources;
};

// Reset production and consumption counters
export const resetProductionCounters = (resources: ResourcesState): ResourcesState => {
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
  costs: { [key in ResourceType]?: number }
): ResourcesState => {
  const newResources = { ...resources };
  
  Object.entries(costs).forEach(([resource, cost]) => {
    const resourceKey = resource as ResourceType;
    if (cost && newResources[resourceKey]) {
      newResources[resourceKey] = {
        ...newResources[resourceKey],
        amount: newResources[resourceKey].amount - cost
      };
    }
  });
  
  return newResources;
};

// Check if resources are sufficient for costs
export const canAffordCost = (
  resources: ResourcesState,
  costs: { [key in ResourceType]?: number }
): boolean => {
  let canAfford = true;
  
  Object.entries(costs).forEach(([resource, cost]) => {
    const resourceKey = resource as ResourceType;
    if (cost && resources[resourceKey].amount < cost) {
      canAfford = false;
    }
  });
  
  return canAfford;
};
