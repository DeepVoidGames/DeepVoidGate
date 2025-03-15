import { toast } from "@/components/ui/use-toast";
import { GameAction } from "../actions";
import { BuildingData, BuildingType, ResourceType, Technology } from "../types";
import {
  generateId,
  initialBuildings,
  initialTechnologies,
} from "../initialData";
import { canAffordCost, applyResourceCost } from "./resourceReducer";
import { ResourcesState } from "./resourceReducer";

// Calculate building efficiency based on worker assignment and resource requirements
export const calculateBuildingEfficiency = (
  buildings: BuildingData[],
  resources: ResourcesState
): BuildingData[] => {
  return buildings.map((building) => {
    // First calculate worker efficiency - minimum 10% if no workers
    let workerEfficiency =
      building.assignedWorkers > 0
        ? Math.min(1, building.assignedWorkers / building.workerCapacity)
        : 0.1; // 10% efficiency with no workers

    // Check if all required resources are available
    let resourceEfficiency = 1;
    let functioning = true;

    if (building.requirements) {
      // Check resource requirements
      for (const [resourceKey, amount] of Object.entries(
        building.requirements
      )) {
        const resource = resources[resourceKey as ResourceType];
        if (resource && resource.amount < amount) {
          // If any required resource is completely missing, building stops functioning
          if (resource.amount <= 0) {
            functioning = false;
            resourceEfficiency = 0;
            break;
          }
          // Otherwise, building can't operate at full capacity due to resource shortage
          const availableRatio = resource.amount / amount;
          resourceEfficiency = Math.min(resourceEfficiency, availableRatio);
        }
      }
    }

    // Final efficiency is the minimum of both but only if building is functioning
    const efficiency = functioning
      ? Math.min(workerEfficiency, resourceEfficiency)
      : 0;

    return {
      ...building,
      efficiency,
      functioning,
    };
  });
};

// Apply building effects to resource production/consumption
export const applyBuildingEffects = (
  buildings: BuildingData[],
  resources: ResourcesState
): ResourcesState => {
  const newResources = { ...resources };

  // Reset capacity to base values before applying bonuses
  Object.keys(newResources).forEach((resourceKey) => {
    newResources[resourceKey as ResourceType].capacity =
      resources[resourceKey as ResourceType].baseCapacity;
  });

  buildings.forEach((building) => {
    if (building.efficiency <= 0) return; // Skip inactive buildings

    // Apply production effects
    if (building.baseProduction != null)
      Object.entries(building.baseProduction).forEach(([resource, amount]) => {
        const resourceKey = resource as ResourceType;
        if (newResources[resourceKey]) {
          // Use Number to ensure we're using numeric values
          const productionAmount =
            Number(amount) *
            Number(building.level) *
            Number(building.efficiency);
          newResources[resourceKey].production += productionAmount;
        }
      });

    // Apply consumption effects
    if (building.baseConsumption != null)
      Object.entries(building.baseConsumption).forEach(([resource, amount]) => {
        const resourceKey = resource as ResourceType;
        if (newResources[resourceKey]) {
          // Use Number to ensure we're using numeric values
          const consumptionAmount =
            Number(amount) *
            Number(building.level) *
            Number(building.efficiency);
          newResources[resourceKey].consumption += consumptionAmount;
        }
      });

    // Apply resource requirements
    if (building.requirements && building.efficiency > 0) {
      Object.entries(building.requirements).forEach(([resource, amount]) => {
        const resourceKey = resource as ResourceType;
        if (newResources[resourceKey]) {
          // Requirements are ongoing consumption - use Number to ensure numeric values
          const requiredAmount = Number(amount) * Number(building.level);
          newResources[resourceKey].consumption += requiredAmount;
        }
      });
    }

    // Apply storage bonus effects
    if (building.storageBonus) {
      Object.entries(building.storageBonus).forEach(([resource, amount]) => {
        const resourceKey = resource as ResourceType;
        if (newResources[resourceKey]) {
          const storageBonusAmount = Number(amount) * Number(building.level);
          newResources[resourceKey].capacity += storageBonusAmount;
        }
      });
    }
  });

  return newResources;
};

// Handle construction of a new building
export const constructBuilding = (
  buildings: BuildingData[],
  resources: ResourcesState,
  buildingType: BuildingType,
  technologies: Technology[]
): {
  buildings: BuildingData[];
  resources: ResourcesState;
  success: boolean;
} => {
  // Find the building template
  const buildingTemplate = initialBuildings.find(
    (b) => b.type === buildingType
  );
  if (!buildingTemplate) {
    toast({
      title: "Building error",
      description: `Could not find template for ${buildingType}.`,
      variant: "destructive",
    });
    return { buildings, resources, success: false };
  }

  // Sprawdź czy technologia jest odblokowana
  if (buildingTemplate.requiredTechnology) {
    const requiredTech = technologies.find(
      (t) => t.id === buildingTemplate.requiredTechnology
    );

    if (!requiredTech || !requiredTech.isResearched) {
      const unlockingTechs = technologies
        .filter((t) => t.unlocksBuildings.includes(buildingType))
        .map((t) => t.name);

      toast({
        title: "Technology Required",
        description: `Required technology: ${
          requiredTech?.name || buildingTemplate.requiredTechnology
        }\n
      This building can be unlocked by: ${unlockingTechs.join(", ") || "none"}`,
        variant: "destructive",
      });
      return { buildings, resources, success: false };
    }
  }

  // Check instance limit
  const existingCount = buildings.filter((b) => b.type === buildingType).length;
  if (existingCount >= buildingTemplate.maxInstances) {
    toast({
      title: "Maximum reached",
      description: `You can build a maximum of ${buildingTemplate.maxInstances} ${buildingTemplate.name}.`,
      variant: "destructive",
    });
    return { buildings, resources, success: false };
  }

  // Check if we can afford the building
  if (!canAffordCost(resources, buildingTemplate.baseCost)) {
    toast({
      title: "Insufficient Resources",
      description: `You don't have enough resources to build a ${buildingTemplate.name}.`,
      variant: "destructive",
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
    functioning: true,
  };

  toast({
    title: "Building Constructed",
    description: `You've built a new ${newBuilding.name}!`,
  });

  return {
    buildings: [...buildings, newBuilding],
    resources: newResources,
    success: true,
  };
};

// Handle upgrade of an existing building
export const upgradeBuilding = (
  buildings: BuildingData[],
  resources: ResourcesState,
  buildingId: string
): {
  buildings: BuildingData[];
  resources: ResourcesState;
  success: boolean;
} => {
  // Find the building
  const buildingIndex = buildings.findIndex((b) => b.id === buildingId);
  if (buildingIndex === -1) {
    return { buildings, resources, success: false };
  }

  const building = buildings[buildingIndex];

  // Calculate upgrade cost based on the building's level
  const upgradeCosts = Object.entries(building.baseCost).reduce(
    (acc, [resource, baseCost]) => {
      const cost = Math.floor(
        Number(baseCost) * Math.pow(building.costMultiplier, building.level)
      );
      acc[resource as ResourceType] = cost;
      return acc;
    },
    {} as Record<ResourceType, number>
  );

  // Check if we can afford the upgrade
  if (!canAffordCost(resources, upgradeCosts)) {
    toast({
      title: "Insufficient Resources",
      description: `You don't have enough resources to upgrade this ${building.name}.`,
      variant: "destructive",
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
    workerCapacity: Math.floor(Number(building.workerCapacity) * 1.2),
  };

  toast({
    title: "Building Upgraded",
    description: `You've upgraded your ${building.name} to level ${
      building.level + 1
    }!`,
  });

  return {
    buildings: newBuildings,
    resources: newResources,
    success: true,
  };
};

// Handle worker assignment
export const assignWorker = (
  buildings: BuildingData[],
  population: { total: number; available: number; maxCapacity: number },
  buildingId: string,
  count: number
): { buildings: BuildingData[]; available: number; success: boolean } => {
  // Find the building
  const buildingIndex = buildings.findIndex((b) => b.id === buildingId);
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
  const totalAssigned = newBuildings.reduce(
    (total, b) => total + b.assignedWorkers,
    0
  );
  const available = population.total - totalAssigned;

  return {
    buildings: newBuildings,
    available,
    success: true,
  };
};
