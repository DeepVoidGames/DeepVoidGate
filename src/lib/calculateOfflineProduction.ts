import { applyArtifactEffect } from "@/store/reducers/artifactsReducer";
import {
  updateResourcesByBuildings,
  evaluateBuildingEfficiency,
} from "@/store/reducers/buildingReducer";
import { ResourcesState } from "@/store/reducers/resourceReducer";
import { BuildingData } from "@/types/building";
import { GameState } from "@/types/gameState";
import { ResourceData, ResourceType } from "@/types/resource";
import { Technology } from "@/types/technology";

export const calculateOfflineProduction = (
  state: GameState,
  buildings: BuildingData[],
  resources: ResourcesState,
  technologies: Technology[],
  elapsedTime: number
): ResourcesState => {
  const MAX_OFFLINE_HOURS = 12; // Maximum time taken into account
  const EFFICIENCY_MULTIPLIER = 0.03; // 3% efficiency
  const OUTPUT_REDUCTION = 1; // Additional output restriction

  const currentResources = structuredClone(resources);

  // Limit offline time to maximum value
  const cappedElapsedTime = Math.min(
    elapsedTime,
    MAX_OFFLINE_HOURS * 60 * 60 * 1000 // 12 hours in milliseconds
  );

  let remainingTime = cappedElapsedTime;

  while (remainingTime > 0) {
    // Calculate efficiency with double constraint
    const efficientBuildings = evaluateBuildingEfficiency(
      buildings,
      currentResources
    ).map((building) => ({
      ...building,
      efficiency: Math.min(
        building.efficiency * EFFICIENCY_MULTIPLIER,
        0.05 // Hard limit 5% even if calculations give more
      ),
    }));

    let tempResources = updateResourcesByBuildings(
      efficientBuildings,
      currentResources
    );

    tempResources = applyArtifactEffect({
      ...state,
      resources: tempResources as {
        oxygen: ResourceData;
        water: ResourceData;
        food: ResourceData;
        energy: ResourceData;
        metals: ResourceData;
        science: ResourceData;
      },
    }).resources;

    // Additional production restriction
    Object.keys(tempResources).forEach((resourceKey) => {
      const res = tempResources[resourceKey as ResourceType];
      // Use additional reducer only for production
      tempResources[resourceKey as ResourceType].production =
        res.production * OUTPUT_REDUCTION;
    });

    // Calculate segment time
    let maxSegmentTime = remainingTime;

    // Check limits only for production (not consumption)
    Object.values(tempResources).forEach((res) => {
      const netRate = res.production - res.consumption;
      if (netRate <= 0) return; // Ignore resources that are not produced (only consumed)

      // Just check the time to reach the capacity limit in production
      const timeToCapacity = ((res.capacity - res.amount) / netRate) * 1000;
      if (timeToCapacity > 0) {
        maxSegmentTime = Math.min(maxSegmentTime, timeToCapacity);
      }
    });

    const segmentTime = Math.min(maxSegmentTime, remainingTime);
    const segmentSeconds = segmentTime / 1000;

    // Update resources
    Object.keys(tempResources).forEach((resourceKey) => {
      const res = tempResources[resourceKey as ResourceType];
      const netRate = res.production - res.consumption;
      let newAmount =
        currentResources[resourceKey as ResourceType].amount +
        netRate * segmentSeconds;

      // Do not exceed the capacity limit when producing
      if (netRate > 0) {
        newAmount = Math.min(newAmount, res.capacity);
      }

      // Never go below zero
      newAmount = Math.max(0, newAmount);

      currentResources[resourceKey as ResourceType].amount = newAmount;
    });

    remainingTime -= segmentTime;
  }

  // Global capping of raw materials, but only for growth (we do not subtract raw materials)
  Object.keys(currentResources).forEach((resourceKey) => {
    const resource = currentResources[resourceKey as ResourceType];
    const originalAmount = resources[resourceKey as ResourceType].amount;

    // Maximum offline profit is 25% of capacity
    const maxGain = resource.capacity * 0.25;

    // Never reduce the amount of resources below the initial value
    if (resource.amount < originalAmount) {
      resource.amount = originalAmount;
    }
    // Limit the maximum growth of resources
    else if (resource.amount > originalAmount + maxGain) {
      resource.amount = originalAmount + maxGain;
    }
  });

  return currentResources;
};
