
import { toast } from '@/components/ui/use-toast';
import { GameAction } from '../actions';
import { BuildingData, BuildingType, ResourceType } from '../types';
import { generateId, initialBuildings } from '../initialData';
import { canAffordCost, applyResourceCost } from './resourceReducer';
import { ResourcesState } from './resourceReducer';

// Calculate building efficiency based on worker assignment
export const calculateBuildingEfficiency = (buildings: BuildingData[]): BuildingData[] => {
  return buildings.map(building => {
    const efficiency = Math.min(1, building.assignedWorkers / building.workerCapacity);
    return { ...building, efficiency };
  });
};

// Apply building effects to resource production/consumption
export const applyBuildingEffects = (
  buildings: BuildingData[],
  resources: ResourcesState
): ResourcesState => {
  const newResources = { ...resources };
  
  buildings.forEach(building => {
    // Apply production effects
    Object.entries(building.baseProduction).forEach(([resource, amount]) => {
      const resourceKey = resource as ResourceType;
      if (newResources[resourceKey]) {
        newResources[resourceKey].production += amount * building.level * building.efficiency;
      }
    });
    
    // Apply consumption effects
    Object.entries(building.baseConsumption).forEach(([resource, amount]) => {
      const resourceKey = resource as ResourceType;
      if (newResources[resourceKey]) {
        newResources[resourceKey].consumption += amount * building.level * building.efficiency;
      }
    });
  });
  
  return newResources;
};

// Handle construction of a new building
export const constructBuilding = (
  buildings: BuildingData[],
  resources: ResourcesState,
  buildingType: BuildingType
): { buildings: BuildingData[], resources: ResourcesState, success: boolean } => {
  // Find the building template
  const buildingTemplate = initialBuildings.find(b => b.type === buildingType);
  if (!buildingTemplate) {
    return { buildings, resources, success: false };
  }
  
  // Check if we can afford the building
  if (!canAffordCost(resources, buildingTemplate.baseCost)) {
    toast({
      title: "Insufficient Resources",
      description: `You don't have enough resources to build a ${buildingTemplate.name}.`,
      variant: "destructive"
    });
    return { buildings, resources, success: false };
  }
  
  // Subtract resources
  const newResources = applyResourceCost(resources, buildingTemplate.baseCost);
  
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
    buildings: [...buildings, newBuilding],
    resources: newResources,
    success: true
  };
};

// Handle upgrade of an existing building
export const upgradeBuilding = (
  buildings: BuildingData[],
  resources: ResourcesState,
  buildingId: string
): { buildings: BuildingData[], resources: ResourcesState, success: boolean } => {
  // Find the building
  const buildingIndex = buildings.findIndex(b => b.id === buildingId);
  if (buildingIndex === -1) {
    return { buildings, resources, success: false };
  }
  
  const building = buildings[buildingIndex];
  
  // Calculate upgrade cost based on the building's level
  const upgradeCosts: { [key in ResourceType]?: number } = {};
  
  Object.entries(building.baseCost).forEach(([resource, baseCost]) => {
    const resourceKey = resource as ResourceType;
    const cost = Math.floor(baseCost * Math.pow(building.costMultiplier, building.level));
    upgradeCosts[resourceKey] = cost;
  });
  
  // Check if we can afford the upgrade
  if (!canAffordCost(resources, upgradeCosts)) {
    toast({
      title: "Insufficient Resources",
      description: `You don't have enough resources to upgrade this ${building.name}.`,
      variant: "destructive"
    });
    return { buildings, resources, success: false };
  }
  
  // Subtract resources
  const newResources = applyResourceCost(resources, upgradeCosts);
  
  // Upgrade building
  const newBuildings = [...buildings];
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
    buildings: newBuildings,
    resources: newResources,
    success: true
  };
};

// Handle worker assignment
export const assignWorker = (
  buildings: BuildingData[],
  population: { total: number, available: number, maxCapacity: number },
  buildingId: string,
  count: number
): { buildings: BuildingData[], available: number, success: boolean } => {
  // Find the building
  const buildingIndex = buildings.findIndex(b => b.id === buildingId);
  if (buildingIndex === -1) {
    return { buildings, available: population.available, success: false };
  }
  
  const building = buildings[buildingIndex];
  
  // Calculate current assigned workers across all buildings
  const currentAssigned = buildings.reduce(
    (total, b) => total + (b.id !== buildingId ? b.assignedWorkers : 0),
    0
  );
  
  // Determine new worker assignment for this building
  let newAssignment = building.assignedWorkers + count;
  
  // Cannot assign more workers than capacity
  newAssignment = Math.min(newAssignment, building.workerCapacity);
  
  // Cannot assign more workers than available
  const maxPossibleAssignment = population.total - currentAssigned;
  newAssignment = Math.min(newAssignment, maxPossibleAssignment);
  
  // Cannot have negative workers
  newAssignment = Math.max(0, newAssignment);
  
  // If no change, return current state
  if (newAssignment === building.assignedWorkers) {
    return { buildings, available: population.available, success: false };
  }
  
  // Update building
  const newBuildings = [...buildings];
  newBuildings[buildingIndex] = {
    ...building,
    assignedWorkers: newAssignment,
  };
  
  // Recalculate available workers
  const totalAssigned = newBuildings.reduce((total, b) => total + b.assignedWorkers, 0);
  const available = population.total - totalAssigned;
  
  return {
    buildings: newBuildings,
    available,
    success: true
  };
};
