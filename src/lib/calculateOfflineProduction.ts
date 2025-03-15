import {
  applyBuildingEffects,
  calculateBuildingEfficiency,
} from "@/store/reducers/buildingReducer";
import { ResourcesState } from "@/store/reducers/resourceReducer";
import { BuildingData, ResourceType, Technology } from "@/store/types";

export const calculateOfflineProduction = (
  buildings: BuildingData[],
  resources: ResourcesState,
  technologies: Technology[],
  elapsedTime: number
): ResourcesState => {
  let currentResources = structuredClone(resources);
  let remainingTime = elapsedTime;

  while (remainingTime > 0) {
    // Oblicz efektywność budynków z 10% wydajności
    const efficientBuildings = calculateBuildingEfficiency(
      buildings,
      currentResources
    ).map((building) => ({
      ...building,
      efficiency: building.efficiency * 0.001, // Redukcja do 5%
    }));

    const tempResources = applyBuildingEffects(
      efficientBuildings,
      currentResources
    );

    let maxSegmentTime = remainingTime;

    // Oblicz czas do następnej zmiany stanu
    Object.values(tempResources).forEach((res) => {
      const netRate = res.production - res.consumption;
      if (netRate === 0) return;

      const timeToChange =
        netRate > 0
          ? ((res.capacity - res.amount) / netRate) * 1000
          : (res.amount / -netRate) * 1000;

      if (timeToChange > 0) {
        maxSegmentTime = Math.min(maxSegmentTime, timeToChange);
      }
    });

    const segmentTime = Math.min(maxSegmentTime, remainingTime);
    const segmentSeconds = segmentTime / 1000;

    // Aktualizuj zasoby z ograniczoną wydajnością
    Object.keys(tempResources).forEach((resourceKey) => {
      const res = tempResources[resourceKey as ResourceType];
      const delta = (res.production - res.consumption) * segmentSeconds;

      currentResources[resourceKey as ResourceType].amount = Math.max(
        0,
        Math.min(
          currentResources[resourceKey as ResourceType].amount + delta,
          res.capacity
        )
      );
    });

    remainingTime -= segmentTime;
  }

  return currentResources;
};
