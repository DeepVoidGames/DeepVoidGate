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

/**
 * Oblicza efektywność działania budynków na podstawie liczby przypisanych pracowników i dostępności zasobów.
 *
 * - Efektywność pracownicza zależy od liczby przypisanych pracowników względem pojemności (`workerCapacity`),
 *   przy minimalnej efektywności 10%, nawet przy braku pracowników.
 * - Efektywność zasobów zależy od tego, czy wymagane zasoby (`requirements`) są dostępne w wystarczającej ilości.
 * - Budynek przestaje działać (`functioning = false`), jeśli którykolwiek wymagany zasób jest całkowicie niedostępny.
 * - Całkowita efektywność (`efficiency`) to efektywność pracownicza, o ile budynek funkcjonuje, inaczej 0.
 *
 * @param buildings - Lista budynków do przeliczenia.
 * @param resources - Aktualny stan zasobów gracza.
 * @returns Nowa lista budynków z przeliczoną efektywnością i statusem działania.
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
 * Nakłada efekty aktywnych budynków na stan zasobów, modyfikując ich produkcję, konsumpcję i pojemność.
 *
 * - Resetuje produkcję, konsumpcję i pojemność wszystkich zasobów do wartości bazowych.
 * - Uwzględnia efektywność każdego budynku przy obliczaniu wpływu na zasoby.
 * - Dodaje produkcję i konsumpcję zasobów z `baseProduction` i `baseConsumption`.
 * - Zwiększa pojemność zasobów na podstawie efektów magazynowania (`calculateBuildingStorage`).
 * - Dla budynków osiągających maksymalny tier stosuje unikalne bonusy (`uniqueBonus`).
 * - Produkcja wody jest dodatkowo zwiększana o wartość 10 (na sztywno).
 *
 * @param buildings - Lista aktywnych budynków gracza.
 * @param resources - Aktualny stan zasobów.
 * @returns Nowy stan zasobów z uwzględnieniem wszystkich efektów budynków.
 */
export const updateResourcesByBuildings = (
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
      Object.entries(building.baseProduction).forEach(([resource]) => {
        const resourceKey = resource as ResourceType;

        newResources[resourceKey].production +=
          calculateBuildingResourceProduction(building, resource, resources);
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
 * Buduje nowy budynek, sprawdzając wszystkie wymagania, takie jak dostępność technologii, limity instancji i zasoby.
 *
 * - Sprawdza, czy istnieje szablon budynku dla podanego typu.
 * - Weryfikuje, czy technologia odblokowująca budynek jest dostępna.
 * - Sprawdza, czy nie osiągnięto maksymalnej liczby instancji danego budynku.
 * - Sprawdza, czy gracz posiada wystarczające zasoby do budowy.
 * - Jeśli warunki są spełnione, odejmuje odpowiednią liczbę zasobów, tworzy nowy budynek i dodaje go do listy budynków.
 * - W przeciwnym razie zwraca aktualny stan gry bez zmian.
 *
 * @param buildings - Lista obecnych budynków gracza.
 * @param resources - Stan zasobów gracza.
 * @param buildingType - Typ budynku, który gracz chce zbudować.
 * @param technologies - Lista odblokowanych technologii.
 * @returns Obiekt zawierający zaktualizowaną listę budynków, stan zasobów oraz informację o powodzeniu operacji.
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
 * Ulepsza budynek, sprawdzając dostępność zasobów, maksymalny poziom ulepszenia oraz wymagane koszty.
 *
 * - Wyszukuje budynek po jego identyfikatorze.
 * - Sprawdza, czy budynek istnieje i czy nie osiągnął maksymalnego poziomu ulepszeń.
 * - Oblicza koszt ulepszenia na podstawie obecnego poziomu budynku.
 * - Jeśli gracz ma wystarczające zasoby, odejmuje wymagane zasoby i aktualizuje poziom budynku.
 * - Jeśli budynek osiągnął 10 ulepszeń, przechodzi do wyższego tieru.
 * - Zwraca zaktualizowaną listę budynków, zasoby oraz informację o powodzeniu operacji.
 *
 * @param buildings - Lista budynków gracza.
 * @param resources - Aktualny stan zasobów gracza.
 * @param buildingId - Identyfikator budynku do ulepszenia.
 * @returns Obiekt zawierający zaktualizowaną listę budynków, zasoby oraz informację o powodzeniu operacji.
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
 * Sprawdza, czy gracz ma wystarczające zasoby do zbudowania budynku o danym typie.
 *
 * - Wyszukuje szablon budynku na podstawie podanego typu.
 * - Sprawdza, czy gracz posiada wystarczającą ilość każdego z wymaganych zasobów.
 * - Zwraca `true`, jeśli gracz ma wystarczające zasoby do zbudowania budynku, w przeciwnym razie `false`.
 *
 * @param buildingType - Typ budynku, który gracz chce zbudować.
 * @param resources - Aktualny stan zasobów gracza.
 * @returns `true`, jeśli gracz ma wystarczające zasoby, w przeciwnym razie `false`.
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
 * Sprawdza, czy gracz ma wystarczającą ilość określonego zasobu.
 *
 * - Wyszukuje zasób o podanym typie w stanie zasobów.
 * - Sprawdza, czy gracz ma wystarczającą ilość tego zasobu.
 * - Zwraca `true`, jeśli gracz posiada wymaganą ilość zasobu, w przeciwnym razie `false`.
 *
 * @param resources - Aktualny stan zasobów gracza.
 * @param resourceType - Typ zasobu, który ma zostać sprawdzony.
 * @param amount - Wymagana ilość zasobu.
 * @returns `true`, jeśli gracz ma wystarczającą ilość zasobu, w przeciwnym razie `false`.
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
 * Sprawdza, czy gracz ma wystarczające zasoby i czy budynek może zostać ulepszony.
 *
 * - Sprawdza, czy budynek osiągnął maksymalny poziom ulepszeń (tier 5 i 10 ulepszeń).
 * - Weryfikuje, czy gracz ma wystarczającą ilość zasobów na ulepszenie budynku.
 * - Zwraca `true`, jeśli budynek może zostać ulepszony, w przeciwnym razie `false`.
 *
 * @param building - Budynek, który gracz chce ulepszyć.
 * @param resources - Aktualny stan zasobów gracza.
 * @param costs - Koszty ulepszenia budynku (wymagane zasoby).
 * @returns `true`, jeśli gracz ma wystarczające zasoby do ulepszenia budynku, w przeciwnym razie `false`.
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
 * Oblicza produkcję zasobu przez budynek, uwzględniając różne czynniki, takie jak ulepszenia, poziom budynku, efektywność, i kryzys energetyczny.
 *
 * - Uwzględnia podstawową wartość produkcji, mnożniki, poziom budynku, efektywność, oraz bonusy za ulepszenia i unikalne bonusy.
 * - Redukuje produkcję w przypadku kryzysu energetycznego, jeśli budynek zużywa energię.
 * - Zastosowuje funkcje logarytmiczne i pierwiastkowe w celu dostosowania produkcji, aby uniknąć zbyt dużych wartości.
 *
 * @param building - Budynek, dla którego obliczana jest produkcja.
 * @param resource - Typ zasobu, którego produkcja ma zostać obliczona.
 * @param resources - Aktualny stan zasobów w grze.
 * @returns Całkowita produkcja zasobu przez budynek uwzględniająca wszystkie czynniki.
 */
export const calculateBuildingResourceProduction = (
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

/**
 * Oblicza koszt ulepszenia budynku, uwzględniając poziom budynku, mnożnik kosztów oraz liczbę ulepszeń.
 *
 * - Koszt obliczany jest na podstawie podstawowego kosztu budynku, mnożnika kosztów oraz poziomu ulepszeń.
 * - Zastosowane jest podniesienie do potęgi dla uwzględnienia progresji kosztów przy wyższych poziomach.
 *
 * @param building - Budynek, dla którego obliczany jest koszt ulepszenia.
 * @returns Koszt ulepszenia budynku w postaci obiektu, gdzie kluczami są typy zasobów, a wartościami są wymagane ilości tych zasobów.
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
 * Oblicza pojemność magazynową dla zasobu w danym budynku, uwzględniając bonusy za poziom budynku, ulepszenia i unikalne bonusy.
 *
 * - Poziom budynku dodaje 30% bonusu za każdy tier.
 * - Ulepszenia budynku dodają 6% bonusu za każde ulepszenie.
 * - Unikalne bonusy są dodawane, jeśli budynek osiągnął maksymalny poziom.
 *
 * @param building - Budynek, dla którego obliczany jest bonus magazynowy.
 * @param amount - Początkowa pojemność zasobu.
 * @param resource - Opcjonalny parametr, który pozwala na uwzględnienie bonusu dla konkretnego zasobu.
 * @returns Całkowita pojemność magazynowa uwzględniająca wszystkie bonusy.
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
 * Oblicza efektywność budynku na podstawie liczby przypisanych pracowników.
 *
 * - Jeśli budynek ma przypisanych pracowników, efektywność jest obliczana na podstawie proporcji pracowników do pojemności.
 * - Jeśli liczba przypisanych pracowników wynosi 0, ustawiana jest minimalna efektywność na poziomie 10%.
 * - Efektywność nie może przekroczyć 100% (1).
 *
 * @param building - Budynek, dla którego obliczana jest efektywność.
 * @returns Efektywność budynku w zakresie 0.1 - 1.
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
 * Oblicza bonusy magazynowania dla budynku na podstawie jego poziomu, ulepszeń i bonusów.
 *
 * - Bonusy magazynowania są obliczane na podstawie poziomu budynku, ulepszeń i bonusów przypisanych do poszczególnych zasobów.
 * - Bonusy są stosowane niezależnie od osiągnięcia maksymalnego poziomu budynku (T5).
 *
 * @param building - Budynek, dla którego obliczane są bonusy magazynowania.
 * @returns Obiekt zawierający bonusy magazynowania dla poszczególnych zasobów.
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
 * Przypisuje pracowników do budynku, uwzględniając limit pojemności budynku i dostępnych pracowników.
 *
 * - Pracownicy są przypisywani do budynku, ale nie mogą przekroczyć pojemności budynku ani dostępnej liczby pracowników.
 * - Liczba dostępnych pracowników jest dynamicznie aktualizowana po każdej operacji przypisania.
 *
 * @param buildings - Tablica budynków, w której pracownicy są przypisywani.
 * @param population - Obiekt zawierający całkowitą liczbę mieszkańców, dostępnych do przypisania oraz maksymalną pojemność.
 * @param buildingId - Identyfikator budynku, do którego mają zostać przypisani pracownicy.
 * @param count - Liczba pracowników do przypisania.
 * @returns Obiekt zawierający zaktualizowaną listę budynków, liczbę dostępnych pracowników oraz wynik operacji.
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
 * Symuluje maksymalny możliwy poziom ulepszenia dla danego budynku, uwzględniając dostępne zasoby.
 *
 * Funkcja iteruje przez możliwe ulepszenia budynku, sprawdzając, czy zasoby są wystarczające do kolejnych ulepszeń, aż do osiągnięcia maksymalnego poziomu.
 *
 * @param building - Obiekt zawierający dane budynku do ulepszenia.
 * @param resources - Obiekt zasobów dostępnych do użycia przy ulepszaniu.
 * @returns Obiekt zawierający docelowy poziom (tier) oraz liczbę ulepszeń dla budynku.
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
 * Sprawdza, czy budynek może zostać ulepszony do następnego poziomu na podstawie aktualnych zasobów.
 *
 * Ulepszenie nie jest możliwe, jeśli budynek osiągnął maksymalny poziom (`maxTier`) i ma 10 ulepszeń.
 *
 * @param building - Budynek, który chcemy ulepszyć.
 * @param resources - Dostępne zasoby gracza.
 * @returns `true`, jeśli zasoby są wystarczające do ulepszenia budynku i nie osiągnął on maksymalnego poziomu. W przeciwnym razie `false`.
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
 * Oblicza łączny koszt wszystkich możliwych ulepszeń budynku przy aktualnych zasobach gracza.
 *
 * Symuluje kolejne ulepszenia budynku aż do osiągnięcia limitu (maksymalny tier i 10 ulepszeń) lub wyczerpania zasobów.
 *
 * @param building - Budynek, który chcemy ulepszyć.
 * @param resources - Aktualny stan zasobów gracza.
 * @returns Obiekt zawierający skumulowane koszty dla każdego zasobu wymagane do maksymalnego możliwego ulepszenia budynku.
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
 * Ulepsza dany budynek maksymalną możliwą liczbę razy, biorąc pod uwagę aktualny stan zasobów.
 *
 * Symuluje kolejne ulepszenia, akumuluje koszty, a następnie dokonuje rzeczywistej aktualizacji budynku i zasobów,
 * o ile gracza stać na wszystkie ulepszenia. Przerywa po osiągnięciu limitu tierów i ulepszeń (10 na tier).
 *
 * @param buildings - Lista wszystkich budynków gracza.
 * @param resources - Aktualny stan zasobów gracza.
 * @param buildingId - ID budynku, który ma zostać ulepszony.
 * @returns Obiekt zawierający zaktualizowane budynki, zasoby, status sukcesu oraz liczbę zastosowanych ulepszeń.
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
