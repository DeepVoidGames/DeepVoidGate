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
  // Nowe ograniczenia
  const MAX_OFFLINE_HOURS = 12; // Maksymalny czas brany pod uwagę
  const EFFICIENCY_MULTIPLIER = 0.03; // 3% efektywności
  const OUTPUT_REDUCTION = 1; // Dodatkowe ograniczenie wyjścia

  let currentResources = structuredClone(resources);

  // Ogranicz czas offline do maksymalnej wartości
  const cappedElapsedTime = Math.min(
    elapsedTime,
    MAX_OFFLINE_HOURS * 60 * 60 * 1000 // 12 godzin w milisekundach
  );

  let remainingTime = cappedElapsedTime;

  while (remainingTime > 0) {
    // Oblicz efektywność z podwójnym ograniczeniem
    const efficientBuildings = calculateBuildingEfficiency(
      buildings,
      currentResources
    ).map((building) => ({
      ...building,
      efficiency: Math.min(
        building.efficiency * EFFICIENCY_MULTIPLIER,
        0.05 // Hard limit 5% nawet jeśli obliczenia dadzą więcej
      ),
    }));

    const tempResources = applyBuildingEffects(
      efficientBuildings,
      currentResources
    );

    // Dodatkowe ograniczenie produkcji
    Object.keys(tempResources).forEach((resourceKey) => {
      const res = tempResources[resourceKey as ResourceType];

      // Zastosuj dodatkowy reduktor tylko dla produkcji
      tempResources[resourceKey as ResourceType].production =
        res.production * OUTPUT_REDUCTION;
    });

    // Reszta logiki czasowej pozostaje bez zmian
    let maxSegmentTime = remainingTime;
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

  // Globalne kapsowanie surowców
  Object.keys(currentResources).forEach((resourceKey) => {
    const resource = currentResources[resourceKey as ResourceType];

    // Maksymalny zysk offline to 25% pojemności
    const maxGain = resource.capacity * 0.25;
    if (
      resource.amount >
      resources[resourceKey as ResourceType].amount + maxGain
    ) {
      resource.amount = resources[resourceKey as ResourceType].amount + maxGain;
    }
  });

  return currentResources;
};
