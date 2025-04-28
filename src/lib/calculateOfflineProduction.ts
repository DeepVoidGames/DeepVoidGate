import { applyArtifactEffect } from "@/store/reducers/artifactsReducer";
import {
  applyBuildingEffects,
  calculateBuildingEfficiency,
} from "@/store/reducers/buildingReducer";
import { ResourcesState } from "@/store/reducers/resourceReducer";
import {
  BuildingData,
  GameState,
  ResourceType,
  Technology,
} from "@/store/types";
import { stat } from "fs";

export const calculateOfflineProduction = (
  state: GameState,
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

    let tempResources = applyBuildingEffects(
      efficientBuildings,
      currentResources
    );
    console.log("Temp resources after building effects:", tempResources);

    tempResources = applyArtifactEffect({
      ...state,
      resources: tempResources,
    }).resources;

    console.log("Temp resources after artifact effects:", tempResources);

    // Dodatkowe ograniczenie produkcji
    Object.keys(tempResources).forEach((resourceKey) => {
      const res = tempResources[resourceKey as ResourceType];
      // Zastosuj dodatkowy reduktor tylko dla produkcji
      tempResources[resourceKey as ResourceType].production =
        res.production * OUTPUT_REDUCTION;
    });

    // Oblicz czas segmentu
    let maxSegmentTime = remainingTime;

    // Sprawdzaj limity tylko dla produkcji (nie dla konsumpcji)
    Object.values(tempResources).forEach((res) => {
      const netRate = res.production - res.consumption;
      if (netRate <= 0) return; // Ignoruj surowce, które nie są produkowane (tylko konsumowane)

      // Sprawdź tylko czas do osiągnięcia limitu pojemności przy produkcji
      const timeToCapacity = ((res.capacity - res.amount) / netRate) * 1000;
      if (timeToCapacity > 0) {
        maxSegmentTime = Math.min(maxSegmentTime, timeToCapacity);
      }
    });

    const segmentTime = Math.min(maxSegmentTime, remainingTime);
    const segmentSeconds = segmentTime / 1000;

    // Aktualizuj surowce
    Object.keys(tempResources).forEach((resourceKey) => {
      const res = tempResources[resourceKey as ResourceType];
      const netRate = res.production - res.consumption;
      let newAmount =
        currentResources[resourceKey as ResourceType].amount +
        netRate * segmentSeconds;

      // Przy produkcji nie przekraczaj limitu pojemności
      if (netRate > 0) {
        newAmount = Math.min(newAmount, res.capacity);
      }

      // Nigdy nie spadaj poniżej zera
      newAmount = Math.max(0, newAmount);

      currentResources[resourceKey as ResourceType].amount = newAmount;
    });

    remainingTime -= segmentTime;
  }

  // Globalne kapsowanie surowców, ale tylko dla przyrostu (nie odejmujemy surowców)
  Object.keys(currentResources).forEach((resourceKey) => {
    const resource = currentResources[resourceKey as ResourceType];
    const originalAmount = resources[resourceKey as ResourceType].amount;

    // Maksymalny zysk offline to 25% pojemności
    const maxGain = resource.capacity * 0.25;

    // Nigdy nie zmniejszaj ilości surowców poniżej początkowej wartości
    if (resource.amount < originalAmount) {
      resource.amount = originalAmount;
    }
    // Ogranicz maksymalny przyrost surowców
    else if (resource.amount > originalAmount + maxGain) {
      resource.amount = originalAmount + maxGain;
    }
  });

  return currentResources;
};
