import { toast } from "@/components/ui/use-toast";
import {
  generateId,
  initialBuildings,
  resourceAlertThresholds,
} from "../initialData";
import { canAffordCost, applyResourceCost } from "./resourceReducer";
import { ResourcesState } from "./resourceReducer";
import { BuildingData, BuildingType } from "@/types/building";
import { ResourceType } from "@/types/resource";
import { Technology } from "@/types/technology";
import { GameState } from "@/types/gameState";
import { galacticUpgrades } from "@/data/galacticUpgrades";

/**
 * Calculates the efficiency of buildings based on the number of assigned workers and resource availability.
 *
 * - Worker efficiency depends on the ratio of assigned workers to the worker capacity (`workerCapacity`),
 *   with a minimum efficiency of 10%, even if there are no workers.
 * - Resource efficiency depends on whether the required resources (`requirements`) are available in sufficient amounts.
 * - The building stops functioning (`functioning = false`) if any required resource is completely unavailable.
 * - Total efficiency (`efficiency`) equals the worker efficiency if the building is functioning, otherwise 0.
 *
 * @param buildings - The list of buildings to recalculate.
 * @param resources - The current state of the player's resources.
 * @returns A new list of buildings with recalculated efficiency and functioning status.
 */
export const evaluateBuildingEfficiency = (
  buildings: BuildingData[],
  resources: ResourcesState
): BuildingData[] => {
  return buildings.map((building) => {
    // First calculate worker efficiency - minimum 10% if no workers
    let workerEfficiency =
      building.assignedWorkers > 0
        ? building.assignedWorkers / building.workerCapacity
        : 0.1; // 10% efficiency with no workers

    // Check if all required resources are available
    let resourceEfficiency = 1;
    let functioning = true;

    if (building.baseConsumption) {
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
    if (workerEfficiency < 0.1) workerEfficiency = 0.1;

    const efficiency = functioning ? workerEfficiency : 0;

    return {
      ...building,
      efficiency,
      functioning,
    };
  });
};

/**
 * Applies the effects of active buildings to the resource state, modifying their production, consumption, and capacity.
 *
 * - Resets production, consumption, and capacity of all resources to their base values.
 * - Considers the efficiency of each building when calculating its impact on resources.
 * - Adds production and consumption from `baseProduction` and `baseConsumption`.
 * - Increases resource capacity based on storage effects (`calculateBuildingStorage`).
 * - Applies unique bonuses (`uniqueBonus`) for buildings at maximum tier.
 * - Water production is additionally increased by a fixed value of 10.
 *
 * @param buildings - The list of active player buildings.
 * @param resources - The current state of resources.
 * @returns A new resource state with all building effects applied.
 */
export const updateResourcesByBuildings = (
  buildings: BuildingData[],
  resources: ResourcesState,
  state: GameState
): ResourcesState => {
  // Inicjalizacja nowego stanu zasobów
  const newResources = Object.keys(resources).reduce(
    (acc, key) => ({
      ...acc,
      [key]: {
        ...resources[key as ResourceType],
        production:
          (key as ResourceType) == "water" || (key as ResourceType) == "science"
            ? 0
            : 1, // Ustaw produkcję na 1 dla wody i tlenu, 0 dla innych zasobów
        consumption: 0,
        capacity:
          resources[key as ResourceType].baseCapacity +
          (resources[key as ResourceType]?.bonusCapacity || 0), // Resetuj pojemność do wartości bazowej
      },
    }),
    {} as ResourcesState
  );

  if (state?.galacticUpgrades?.includes("void_storage")) {
    Object.keys(newResources).forEach((resourceKey) => {
      newResources[resourceKey].capacity += 1e8;
    });
  }

  buildings.forEach((building) => {
    if (!building || building.efficiency <= 0) return;
    if ((building.type as BuildingType) == "housing") return;

    // Produkcja z uwzględnieniem bonusów
    if (building.baseProduction) {
      Object.entries(building.baseProduction).forEach(([resource]) => {
        const resourceKey = resource as ResourceType;

        newResources[resourceKey].production +=
          calculateBuildingResourceProduction(
            building,
            resource,
            resources,
            state
          );
      });
    }

    // Konsumpcja
    if (building.baseConsumption) {
      Object.entries(building.baseConsumption).forEach(([resource, amount]) => {
        const resourceKey = resource as ResourceType;
        const consumption = Number(amount) || 0;
        newResources[resourceKey].consumption +=
          (consumption + consumption * building.tier * 0.1) *
          building.efficiency;
      });
    }

    // Magazynowanie
    const storageBonus = calculateStorageBonus(building);
    if (storageBonus) {
      Object.entries(storageBonus).forEach(([resource, amount]) => {
        const resourceKey = resource as ResourceType;
        const bonus = Number(amount) || 0;
        newResources[resourceKey].capacity += bonus;
      });
    }

    // Bonusy maksymalnego tieru
    if (building.tier === building.maxTier && building.uniqueBonus) {
      // Bonusy do produkcji
      if (building.uniqueBonus.production) {
        Object.entries(building.uniqueBonus.production).forEach(
          ([resource, bonus]) => {
            const resourceKey = resource as ResourceType;
            const bonusValue = Number(bonus) || 0;
            newResources[resourceKey].production +=
              bonusValue * building.efficiency;
          }
        );
      }

      // Bonusy do magazynowania
      if (building.uniqueBonus.storage) {
        Object.entries(building.uniqueBonus.storage).forEach(
          ([resource, bonus]) => {
            const resourceKey = resource as ResourceType;
            // const bonusValue = Number(bonus) || 0;
            newResources[resourceKey].capacity += bonus;
          }
        );
      }
    }
  });

  //! Hard coded water porduction to 10
  if (newResources.water) {
    newResources.water.production += 10;
  }

  return newResources;
};

/**
 * Constructs a new building, checking all requirements such as technology availability, instance limits, and resources.
 *
 * - Checks if a building template exists for the given type.
 * - Verifies if the technology unlocking the building is available.
 * - Checks if the maximum number of instances for the building has not been reached.
 * - Checks if the player has sufficient resources for construction.
 * - If conditions are met, subtracts the required resources, creates a new building, and adds it to the building list.
 * - Otherwise, returns the current game state unchanged.
 *
 * @param buildings - The list of the player's current buildings.
 * @param resources - The player's resource state.
 * @param buildingType - The type of building the player wants to construct.
 * @param technologies - The list of unlocked technologies.
 * @returns An object containing the updated building list, resource state, and a success flag.
 */
export const buildNewBuilding = (
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
    tier: 1,
    upgrades: 0,
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

/**
 * Upgrades a building by checking resource availability, maximum upgrade level, and required costs.
 *
 * - Finds the building by its identifier.
 * - Checks if the building exists and has not reached the maximum upgrade level.
 * - Calculates the upgrade cost based on the building's current level.
 * - If the player has sufficient resources, deducts the required resources and updates the building level.
 * - If the building reaches 10 upgrades, it advances to a higher tier.
 * - Returns the updated building list, resources, and a success flag.
 *
 * @param buildings - The player's list of buildings.
 * @param resources - The current state of the player's resources.
 * @param buildingId - The identifier of the building to upgrade.
 * @returns An object containing the updated building list, resources, and a success flag.
 */
export const upgradeBuildingLevel = (
  buildings: BuildingData[],
  resources: ResourcesState,
  buildingId: string
) => {
  //  Znajdź indeks budynku
  const buildingIndex = buildings.findIndex((b) => b.id === buildingId);
  // Sprawdź czy budynek istnieje
  if (buildingIndex === -1) return { buildings, resources, success: false };

  // Pobierz budynek
  const building = buildings[buildingIndex];

  // Sprawdź maksymalny poziom
  if (building.tier >= 5 && building.upgrades >= 10) {
    return { buildings, resources, success: false };
  }

  // Oblicz koszt z uwzględnieniem progresji
  const upgradeCosts = calculateBuildingUpgradeCost(building);

  // Sprawdź czy stać na ulepszenie
  if (!canAffordCost(resources, upgradeCosts)) {
    toast({
      title: "Insufficient Resources",
      description: `You don't have enough resources to upgrade ${building.name}.`,
      variant: "destructive",
    });
    return { buildings, resources, success: false };
  }

  // Odejmij koszt ulepszenia
  const newResources = applyResourceCost(resources, upgradeCosts);
  const newBuildings = [...buildings];

  // Aktualizuj progres
  let newTier = building.tier;
  let newUpgrades = building.upgrades + 1;

  // Jeśli osiągnięto 10 ulepszeń, przejdź do następnego tieru
  if (newUpgrades >= 10 && newTier < building.maxTier) {
    newTier++;
    newUpgrades = 0;
  }

  // Aktualizuj budynek
  newBuildings[buildingIndex] = {
    ...building,
    tier: newTier,
    upgrades: newUpgrades,
  };

  return { buildings: newBuildings, resources: newResources, success: true };
};

/**
 * Checks if the player has sufficient resources to build a building of the given type.
 *
 * - Finds the building template based on the provided type.
 * - Checks if the player has enough of each required resource.
 * - Returns `true` if the player has sufficient resources to build the building, otherwise `false`.
 *
 * @param buildingType - The type of building the player wants to construct.
 * @param resources - The current state of the player's resources.
 * @returns `true` if the player has sufficient resources, otherwise `false`.
 */
export const canAffordBuildingCost = (
  buildingType: BuildingType,
  resources: ResourcesState
): boolean => {
  // Znajdź szablon budynku
  const template = initialBuildings.find((b) => b.type === buildingType);
  if (!template) return false;

  // Sprawdź każdy wymagany zasób
  return Object.entries(template.baseCost).every(([resource, cost]) => {
    const resourceData = resources[resource as ResourceType];

    // Jeśli zasób nie istnieje lub jego ilość jest niewystarczająca
    if (!resourceData || resourceData.amount < Number(cost)) {
      return false;
    }

    return true;
  });
};

/**
 * Checks if the player has a sufficient amount of a specified resource.
 *
 * - Finds the resource of the given type in the resource state.
 * - Checks if the player has enough of that resource.
 * - Returns `true` if the player has the required amount, otherwise `false`.
 *
 * @param resources - The current state of the player's resources.
 * @param resourceType - The type of resource to check.
 * @param amount - The required amount of the resource.
 * @returns `true` if the player has a sufficient amount of the resource, otherwise `false`.
 */
export const canAffordResourceAmount = (
  resources: ResourcesState,
  resourceType: ResourceType,
  amount: number
): boolean => {
  const resource = resources[resourceType];
  if (!resource) return false;
  return resource.amount >= amount;
};

/**
 * Checks if the player has sufficient resources and if the building can be upgraded.
 *
 * - Checks if the building has reached the maximum upgrade level (tier 5 and 10 upgrades).
 * - Verifies if the player has enough resources to upgrade the building.
 * - Returns `true` if the building can be upgraded, otherwise `false`.
 *
 * @param building - The building the player wants to upgrade.
 * @param resources - The current state of the player's resources.
 * @param costs - The upgrade costs (required resources).
 * @returns `true` if the player has sufficient resources to upgrade the building, otherwise `false`.
 */
export const checkBuildingUpgradeAffordability = (
  building: BuildingData,
  resources: ResourcesState,
  costs: Record<ResourceType, number>
): boolean => {
  if (building.tier >= 5 && building.upgrades >= 10) return false;
  return Object.entries(costs).every(
    ([resource, cost]) => resources[resource as ResourceType].amount >= cost
  );
};

/**
 * Calculates the production of a resource by a building, considering various factors such as upgrades, building level, efficiency, and energy crisis.
 *
 * - Takes into account the base production value, multipliers, building level, efficiency, upgrade bonuses, and unique bonuses.
 * - Reduces production during an energy crisis if the building consumes energy.
 * - Applies logarithmic and square root functions to adjust production to avoid excessively large values.
 *
 * @param building - The building for which production is being calculated.
 * @param resource - The type of resource whose production is to be calculated.
 * @param resources - The current state of resources in the game.
 * @returns The total resource production by the building considering all factors.
 */
export const calculateBuildingResourceProduction = (
  building: BuildingData,
  resource: string,
  resources: ResourcesState,
  state: GameState
): number => {
  const resourceKey = resource as ResourceType;
  const baseValue = Number(building.baseProduction[resourceKey]) || 0;
  const productionMultiplier = building.productionMultiplier || 1;
  const upgrades = building.upgrades || 0;
  const efficiency = building.efficiency || 1;

  const tierBonus = (building.tier - 1) * 10 * baseValue * productionMultiplier;

  //reducing the effect of the upgrade by using a logarithmic function
  // Math.log10(upgrades + 1) gives a value of 0 for 0 upgrades, 1 for 10 upgrades
  const upgradeBonus =
    Math.log10(upgrades + 1) * 10 * baseValue * productionMultiplier;

  // Total Base Production
  let production = baseValue + tierBonus + upgradeBonus;

  // Applying the square root to the total production to reduce large values
  production = Math.sqrt(production) * baseValue;

  // Max level bonus calculation - also reduced
  let uniqueBonus = 0;
  if (building.tier === building?.maxTier && building.uniqueBonus?.production) {
    // Redukujemy wartość unikalnego bonusu o połowę
    uniqueBonus = (building.uniqueBonus?.production[resourceKey] || 0) * 0.5;
  }

  // Energy crisis check
  const hasEnergyCrisis =
    resourceAlertThresholds.energy &&
    resources.energy?.amount < resourceAlertThresholds.energy.critical;
  const consumesEnergy = Boolean(building.baseConsumption?.energy);

  if (hasEnergyCrisis && consumesEnergy) {
    production = production * 0.1;
  }

  production = production * efficiency;

  let resProdMultiplier = 1;

  if (state?.currentPlanet?.bonusMultiplier) {
    resProdMultiplier = state.currentPlanet.bonusMultiplier;
  }

  if (state?.galacticUpgrades?.includes("quantum_production")) {
    resProdMultiplier +=
      galacticUpgrades.find((u) => u.id === "quantum_production").multiplier ||
      0;
  }

  return production * resProdMultiplier + uniqueBonus;
};

/**
 * Calculates the cost of upgrading a building, taking into account the building's level, cost multiplier, and number of upgrades.
 *
 * - The cost is calculated based on the building's base cost, cost multiplier, and current upgrade level.
 * - Exponential growth is applied to account for cost progression at higher levels.
 *
 * @param building - The building for which the upgrade cost is being calculated.
 * @returns The upgrade cost as an object, where keys are resource types and values are the required amounts of those resources.
 */
export const calculateBuildingUpgradeCost = (
  building: BuildingData
): Record<ResourceType, number> => {
  return Object.entries(building.baseCost).reduce(
    (acc, [resource, baseCost]) => {
      const cost = Math.floor(
        Number(baseCost) *
          Math.pow(building.costMultiplier, building.tier) *
          (1 + building.upgrades * 0.1)
      );
      acc[resource as ResourceType] = cost;
      return acc;
    },
    {} as Record<ResourceType, number>
  );
};

/**
 * Calculates the storage capacity for a resource in a given building, taking into account bonuses from building level, upgrades, and unique bonuses.
 *
 * - Each building tier adds a 30% bonus.
 * - Each upgrade adds a 6% bonus.
 * - Unique bonuses are applied if the building has reached its maximum level.
 *
 * @param building - The building for which the storage bonus is being calculated.
 * @param amount - The base storage capacity of the resource.
 * @param resource - Optional parameter to include bonuses specific to a particular resource.
 * @returns The total storage capacity including all applicable bonuses.
 */
export const calculateCapacityByResource = (
  building: BuildingData,
  amount: number,
  resource?: string
): number => {
  const tierBonus = 1 + (building.tier - 1) * 0.3; // 30% bonus za każdy tier
  const upgradeBonus = 1 + building.upgrades * 0.06; // 10% bonus za każde ulepszenie
  const totalBonus = tierBonus * upgradeBonus;

  let bonus = 0;
  if (building.tier === building.maxTier && building.uniqueBonus.storage) {
    bonus = building.uniqueBonus.storage[resource];
  }
  return amount + amount * totalBonus + bonus;
};

/**
 * Calculates the efficiency of a building based on the number of assigned workers.
 *
 * - If the building has assigned workers, efficiency is calculated as the ratio of workers to worker capacity.
 * - If the number of assigned workers is 0, a minimum efficiency of 10% is used.
 * - Efficiency is capped at 100% (1).
 *
 * @param building - The building for which the efficiency is being calculated.
 * @returns The efficiency of the building, ranging from 0.1 to 1.
 */
export const calculateWorkerEfficiency = (building: BuildingData) => {
  let workerEfficiency =
    building.assignedWorkers > 0
      ? building.assignedWorkers / building.workerCapacity
      : 0.1;

  if (workerEfficiency < 0.1) workerEfficiency = 0.1; // 10% efficiency with no workers

  return Math.min(workerEfficiency, 1);
};

/**
 * Calculates storage bonuses for a building based on its level, upgrades, and resource-specific bonuses.
 *
 * - Storage bonuses are derived from the building's tier level, number of upgrades, and any assigned resource-specific bonuses.
 * - Bonuses are applied regardless of whether the building has reached the maximum tier (T5).
 *
 * @param building - The building for which the storage bonuses are calculated.
 * @returns An object containing storage bonuses for each resource type.
 */
export const calculateStorageBonus = (
  building: BuildingData
): BuildingData["storageBonus"] => {
  // Bonusy do magazynowania z poziomu budynku (niezależne od T5)
  if (!building.storageBonus) return {};

  const tierBonus = (baseValue) => (building.tier - 1) * 10 * baseValue;
  const storageBonus = {} as BuildingData["storageBonus"];

  Object.entries(building.storageBonus).forEach(([resource, bonus]) => {
    const resourceKey = resource as ResourceType;
    const baseValue = Number(bonus) || 0;
    const value =
      baseValue + tierBonus(baseValue) + building.upgrades * baseValue;
    storageBonus[resourceKey] = value;
  });

  return storageBonus;
};

/**
 * Assigns workers to a building, considering the building's capacity and available worker pool.
 *
 * - Workers are assigned to the specified building, but the number cannot exceed the building's worker capacity or the number of available workers.
 * - The number of available workers is dynamically updated after each assignment operation.
 *
 * @param buildings - Array of buildings to which workers are assigned.
 * @param population - Object containing the total population, available workers, and maximum population capacity.
 * @param buildingId - Identifier of the building to which workers should be assigned.
 * @param count - Number of workers to assign.
 * @returns An object containing the updated list of buildings, available workers, and the result of the operation.
 */
export const assignWorkersToBuilding = (
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

/**
 * Simulates the maximum possible upgrade level for a given building, based on available resources.
 *
 * The function iterates through potential upgrades, checking whether the resources are sufficient for each subsequent upgrade,
 * until the building reaches its maximum level (tier 5 and 10 upgrades per tier).
 *
 * @param building - The building object to simulate upgrades for.
 * @param resources - The current resource pool available for upgrades.
 * @returns An object containing the final achievable tier and number of upgrades for the building.
 */
export const getBuildingMaxUpgrade = (
  building: BuildingData,
  resources: ResourcesState
): {
  tier: number;
  upgrades: number;
} => {
  const simulatedBuilding = { ...building };
  let simulatedResources = JSON.parse(JSON.stringify(resources)); // Głęboka kopia
  const totalCost: Record<ResourceType, number> = {
    oxygen: 0,
    water: 0,
    food: 0,
    energy: 0,
    metals: 0,
    science: 0,
  };

  let tier = building.tier;
  let upgrades = building.upgrades;

  while (true) {
    if (
      simulatedBuilding.tier >= simulatedBuilding.maxTier &&
      simulatedBuilding.upgrades >= 10
    )
      break;

    const nextCost = calculateBuildingUpgradeCost(simulatedBuilding);
    if (!canAffordCost(simulatedResources, nextCost)) break;

    Object.entries(nextCost).forEach(([resource, amount]) => {
      const res = resource as ResourceType;
      totalCost[res] = (totalCost[res] || 0) + amount;
    });

    simulatedResources = applyResourceCost(simulatedResources, nextCost);

    simulatedBuilding.upgrades += 1;

    if (
      simulatedBuilding.upgrades >= 10 &&
      simulatedBuilding.tier < simulatedBuilding.maxTier
    ) {
      tier = simulatedBuilding.tier + 1;
      upgrades = 0;
      simulatedBuilding.tier += 1;
      simulatedBuilding.upgrades = 0;
    } else {
      tier = simulatedBuilding.tier;
      upgrades = simulatedBuilding.upgrades;
    }
  }
  return {
    tier,
    upgrades,
  };
};

/**
 * Checks whether a building can be upgraded to the next level based on the current resources.
 *
 * Upgrade is not possible if the building has reached the maximum tier (`maxTier`) and has 10 upgrades.
 * Also verifies if the player has sufficient resources for the upgrade cost.
 *
 * @param building - The building that is considered for an upgrade.
 * @param resources - The player's currently available resources.
 * @returns `true` if the building can be upgraded (not at max level and sufficient resources), otherwise `false`.
 */
export const canUpgradeMax = (
  building: BuildingData,
  resources: ResourcesState
): boolean => {
  if (building.tier >= building.maxTier && building.upgrades >= 10)
    return false;

  const upgradeCost = calculateBuildingUpgradeCost(building);
  return canAffordCost(resources, upgradeCost);
};

/**
 * Calculates the total cost of all possible upgrades for a building based on the player's current resources.
 *
 * Simulates successive building upgrades until either the upgrade cap is reached (maximum tier and 10 upgrades)
 * or the resources are insufficient to proceed.
 *
 * @param building - The building to be upgraded.
 * @param resources - The player's current resource state.
 * @returns An object containing the cumulative costs per resource type required to reach the maximum possible upgrade.
 */
export const getBuildingMaxUpgradeCost = (
  building: BuildingData,
  resources: ResourcesState
): Record<ResourceType, number> => {
  const simulatedBuilding = { ...building };
  let simulatedResources = JSON.parse(JSON.stringify(resources)); // Głęboka kopia
  const totalCost: Record<ResourceType, number> = {
    oxygen: 0,
    water: 0,
    food: 0,
    energy: 0,
    metals: 0,
    science: 0,
  };

  while (true) {
    if (
      simulatedBuilding.tier >= simulatedBuilding.maxTier &&
      simulatedBuilding.upgrades >= 10
    )
      break;

    const nextCost = calculateBuildingUpgradeCost(simulatedBuilding);
    if (!canAffordCost(simulatedResources, nextCost)) break;

    // Akumuluj koszty
    Object.entries(nextCost).forEach(([resource, amount]) => {
      const res = resource as ResourceType;
      totalCost[res] = (totalCost[res] || 0) + amount;
    });

    // Zaktualizuj symulowane zasoby
    simulatedResources = applyResourceCost(simulatedResources, nextCost);

    // Wykonaj ulepszenie
    simulatedBuilding.upgrades += 1;
    if (
      simulatedBuilding.upgrades >= 10 &&
      simulatedBuilding.tier < simulatedBuilding.maxTier
    ) {
      simulatedBuilding.tier += 1;
      simulatedBuilding.upgrades = 0;
    }
  }

  return totalCost;
};

/**
 * Upgrades a given building as many times as possible based on the current resource state.
 *
 * Simulates successive upgrades, accumulates the total cost, and then performs the actual upgrade operation
 * and resource deduction if the player can afford all of them. Stops once the maximum tier and upgrade cap
 * (10 upgrades per tier) is reached.
 *
 * @param buildings - The list of all player's buildings.
 * @param resources - The player's current resource state.
 * @param buildingId - The ID of the building to be upgraded.
 * @returns An object containing the updated buildings, resources, a success status, and the number of upgrades applied.
 */
export const upgradeBuildingMax = (
  buildings: BuildingData[],
  resources: ResourcesState,
  buildingId: string
) => {
  const buildingIndex = buildings.findIndex((b) => b.id === buildingId);
  if (buildingIndex === -1) return { buildings, resources, success: false };

  const originalBuilding = buildings[buildingIndex];
  const simulatedBuilding = { ...originalBuilding };
  let simulatedResources = JSON.parse(JSON.stringify(resources));
  const totalCost: Record<ResourceType, number> = {
    oxygen: 0,
    water: 0,
    food: 0,
    energy: 0,
    metals: 0,
    science: 0,
  };
  let upgradesApplied = 0;

  while (true) {
    if (
      simulatedBuilding.tier >= simulatedBuilding.maxTier &&
      simulatedBuilding.upgrades >= 10
    )
      break;

    const nextCost = calculateBuildingUpgradeCost(simulatedBuilding);
    if (!canAffordCost(simulatedResources, nextCost)) break;

    Object.entries(nextCost).forEach(([resource, amount]) => {
      const res = resource as ResourceType;
      totalCost[res] = (totalCost[res] || 0) + amount;
    });

    simulatedResources = applyResourceCost(simulatedResources, nextCost);

    simulatedBuilding.upgrades += 1;
    if (
      simulatedBuilding.upgrades >= 10 &&
      simulatedBuilding.tier < simulatedBuilding.maxTier
    ) {
      simulatedBuilding.tier += 1;
      simulatedBuilding.upgrades = 0;
    }

    upgradesApplied++;
  }

  if (upgradesApplied === 0 || !canAffordCost(resources, totalCost)) {
    return { buildings, resources, success: false };
  }

  const newResources = applyResourceCost(resources, totalCost);
  const newBuildings = [...buildings];
  newBuildings[buildingIndex] = simulatedBuilding;

  toast({
    title: "Mass Upgrade Successful",
    description: `Applied ${upgradesApplied} upgrades to ${originalBuilding.name}`,
  });

  return {
    buildings: newBuildings,
    resources: newResources,
    success: true,
    upgradesApplied,
  };
};
