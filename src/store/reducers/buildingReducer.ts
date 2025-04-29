import { toast } from "@/components/ui/use-toast";
import { GameAction } from "../actions";
import { BuildingData, BuildingType, ResourceType, Technology } from "../types";
import {
  generateId,
  initialBuildings,
  initialResourcesState,
  initialTechnologies,
  resourceAlertThresholds,
} from "../initialData";
import { canAffordCost, applyResourceCost } from "./resourceReducer";
import { ResourcesState } from "./resourceReducer";
import { getArtifact } from "./artifactsReducer";

// Calculate building efficiency based on worker assignment and resource requirements
export const calculateBuildingEfficiency = (
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

// Apply building effects
export const applyBuildingEffects = (
  buildings: BuildingData[],
  resources: ResourcesState
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

  buildings.forEach((building) => {
    if (!building || building.efficiency <= 0) return;
    if ((building.type as BuildingType) == "housing") return;

    // Produkcja z uwzględnieniem bonusów
    if (building.baseProduction) {
      Object.entries(building.baseProduction).forEach(([resource, amount]) => {
        const resourceKey = resource as ResourceType;

        newResources[resourceKey].production += getProductionByResource(
          building,
          resource,
          resources
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
    const storageBonus = calculateBuildingStorage(building);
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
            const bonusValue = Number(bonus) || 0;
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

// Handle upgrade of an existing building
export const upgradeBuilding = (
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
  const upgradeCosts = getBuildingUpgradeCost(building);

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

// Check if can afford building
export const canAffordBuilding = (
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

// Check if can afford cost
export const canAffordResource = (
  resources: ResourcesState,
  resourceType: ResourceType,
  amount: number
): boolean => {
  const resource = resources[resourceType];
  if (!resource) return false;
  return resource.amount >= amount;
};

// Check if can upgrade building
export const canUpgradeBuilding = (
  building: BuildingData,
  resources: ResourcesState,
  costs: Record<ResourceType, number>
): boolean => {
  if (building.tier >= 5 && building.upgrades >= 10) return false;
  return Object.entries(costs).every(
    ([resource, cost]) => resources[resource as ResourceType].amount >= cost
  );
};

// Get production by resource with reduced output
export const getProductionByResource = (
  building: BuildingData,
  resource: string,
  resources: ResourcesState
): number => {
  const resourceKey = resource as ResourceType;
  const baseValue = Number(building.baseProduction[resourceKey]) || 0;
  const productionMultiplier = building.productionMultiplier || 1;
  const upgrades = building.upgrades || 0;
  const efficiency = building.efficiency || 1;

  const tierBonus = (building.tier - 1) * 10 * baseValue * productionMultiplier;

  // Zmniejszenie efektu ulepszeń przez zastosowanie funkcji logarytmicznej
  // Math.log10(upgrades + 1) daje wartość 0 dla 0 ulepszeń, 1 dla 10 ulepszeń
  const upgradeBonus =
    Math.log10(upgrades + 1) * 10 * baseValue * productionMultiplier;

  // Całkowita produkcja bazowa
  let production = baseValue + tierBonus + upgradeBonus;

  // Zastosowanie pierwiastka kwadratowego do całkowitej produkcji aby zredukować duże wartości
  production = Math.sqrt(production) * baseValue;

  // Obliczenie bonusu za maksymalny poziom - również zredukowane
  let uniqueBonus = 0;
  if (building.tier === building?.maxTier && building.uniqueBonus?.production) {
    // Redukujemy wartość unikalnego bonusu o połowę
    uniqueBonus = (building.uniqueBonus?.production[resourceKey] || 0) * 0.5;
  }

  // Sprawdzenie kryzysu energetycznego
  const hasEnergyCrisis =
    resourceAlertThresholds.energy &&
    resources.energy?.amount < resourceAlertThresholds.energy.critical;
  const consumesEnergy = Boolean(building.baseConsumption?.energy);

  if (hasEnergyCrisis && consumesEnergy) {
    production = production * 0.1;
  }

  // Zastosowanie efektywności i dodanie bonusu za maksymalny poziom
  return production * efficiency + uniqueBonus;
};

// Get building upgrade cost
export const getBuildingUpgradeCost = (
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

// Get capacity by resource
export const getCapacityByResource = (
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

export const calculateEfficiency = (
  building: BuildingData,
  resources: ResourcesState
) => {
  let workerEfficiency =
    building.assignedWorkers > 0
      ? building.assignedWorkers / building.workerCapacity
      : 0.1;

  if (workerEfficiency < 0.1) workerEfficiency = 0.1; // 10% efficiency with no workers

  return Math.min(workerEfficiency, 1);
};

export const calculateBuildingStorage = (
  building: BuildingData
): BuildingData["storageBonus"] => {
  // Bonusy do magazynowania z poziomu budynku (niezależne od T5)
  if (!building.storageBonus) return {};

  const tierBonus = (baseValue) => (building.tier - 1) * 10 * baseValue;
  let storageBonus = {} as BuildingData["storageBonus"];

  Object.entries(building.storageBonus).forEach(([resource, bonus]) => {
    const resourceKey = resource as ResourceType;
    const baseValue = Number(bonus) || 0;
    const value =
      baseValue + tierBonus(baseValue) + building.upgrades * baseValue;
    storageBonus[resourceKey] = value;
  });

  return storageBonus;
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

// Dodaj nowe funkcje do buildingReducer.ts

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
  let upgradesApplied = 0;
  let tier = building.tier;
  let upgrades = building.upgrades;

  while (true) {
    if (
      simulatedBuilding.tier >= simulatedBuilding.maxTier &&
      simulatedBuilding.upgrades >= 10
    )
      break;

    const nextCost = getBuildingUpgradeCost(simulatedBuilding);
    if (!canAffordCost(simulatedResources, nextCost)) break;

    Object.entries(nextCost).forEach(([resource, amount]) => {
      const res = resource as ResourceType;
      totalCost[res] = (totalCost[res] || 0) + amount;
    });

    simulatedResources = applyResourceCost(simulatedResources, nextCost);

    simulatedBuilding.upgrades += 1;
    upgradesApplied++;
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

export const canUpgradeMax = (
  building: BuildingData,
  resources: ResourcesState
): boolean => {
  if (building.tier >= building.maxTier && building.upgrades >= 10)
    return false;

  const upgradeCost = getBuildingUpgradeCost(building);
  return canAffordCost(resources, upgradeCost);
};

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

    const nextCost = getBuildingUpgradeCost(simulatedBuilding);
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

export const upgradeBuildingMax = (
  buildings: BuildingData[],
  resources: ResourcesState,
  buildingId: string
) => {
  const buildingIndex = buildings.findIndex((b) => b.id === buildingId);
  if (buildingIndex === -1) return { buildings, resources, success: false };

  const originalBuilding = buildings[buildingIndex];
  let simulatedBuilding = { ...originalBuilding };
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

    const nextCost = getBuildingUpgradeCost(simulatedBuilding);
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
