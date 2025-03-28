import React, { useCallback, useMemo, useState } from "react";
import {
  Home,
  Users,
  Clock,
  Factory,
  Microscope,
  Search,
  Package,
} from "lucide-react";
import { useGame } from "@/context/GameContext";
import { formatNumber } from "@/lib/utils";
import {
  BuildingType,
  BuildingCategory,
  ResourceType,
  BuildingTags,
} from "@/store/types";
import { initialBuildings, initialTechnologies } from "@/store/initialData";
import ConstructionSection from "./ConstructionSection";
import ExistingBuildings from "./ExistingBuildings";
import { ResourcesIcon } from "@/config";
import {
  canAffordBuilding,
  canAffordResource,
  canUpgradeBuilding,
  getBuildingUpgradeCost,
} from "@/store/reducers/buildingReducer";
import { buildingConfig } from "@/data/buildingConfig";

// Centralna konfiguracja budynków
//TODO Przenisnie tego do osobnego pliku najlepiej data/buildings.json

// Konfiguracja kategorii
const categories = [
  {
    id: "production" as BuildingCategory,
    name: "Production",
    icon: <Factory className="h-4 w-4" />,
  },
  {
    id: "research" as BuildingCategory,
    name: "Research",
    icon: <Microscope className="h-4 w-4" />,
  },
  {
    id: "housing" as BuildingCategory,
    name: "Housing",
    icon: <Home className="h-4 w-4" />,
  },
  {
    id: "storage" as BuildingCategory,
    name: "Storage",
    icon: <Package className="h-4 w-4" />,
  },
];

export const BuildingManager: React.FC = () => {
  const { state, dispatch } = useGame();
  const { buildings, resources, population } = state;
  const [expandedBuilding, setExpandedBuilding] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("production");
  const [searchQuery, setSearchQuery] = useState("");

  // Handlers
  const constructBuilding = useCallback(
    (buildingType: BuildingType) => {
      dispatch({ type: "CONSTRUCT_BUILDING", payload: { buildingType } });
    },
    [dispatch]
  );

  const upgradeBuilding = (buildingId: string) => {
    dispatch({ type: "UPGRADE_BUILDING", payload: { buildingId } });
  };

  const adjustWorkers = (buildingId: string, count: number) => {
    dispatch({ type: "ASSIGN_WORKER", payload: { buildingId, count } });
  };

  // Sort buildings by type
  const sortedBuildings = [...buildings].sort((a, b) => {
    const categoryOrder: BuildingCategory[] = [
      "production",
      "storage",
      "research",
      "housing",
      "utility",
    ];
    const categoryComparison =
      categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);

    if (categoryComparison !== 0) return categoryComparison;

    return a.name.localeCompare(b.name);
  });

  // Group buildings by category
  const buildingsByCategory: Record<BuildingCategory, typeof buildings> = {
    production: [],
    research: [],
    housing: [],
    storage: [],
    utility: [],
  };

  sortedBuildings.forEach((building) => {
    buildingsByCategory[building.category] =
      buildingsByCategory[building.category] || [];
    buildingsByCategory[building.category].push(building);
  });

  // Filtrowanie budynków
  const filteredBuildings = buildings
    .filter((building) => {
      const buildingConfigEntry = buildingConfig.find(
        (b) => b.type === building.type
      );
      return buildingConfigEntry?.category === activeTab;
    })
    .filter((building) => {
      const search = searchQuery.toLowerCase();
      return (
        building.name.toLowerCase().includes(search) ||
        building.description.toLowerCase().includes(search)
      );
    })
    .sort((a, b) => {
      // Special sorting only for "production" category
      if (activeTab === "production") {
        const order: BuildingTags[] = [
          "oxygen",
          "food",
          "energy",
          "metals",
          "science",
        ];
        const indexA = order.indexOf(a.tag); // Make sure `a.tag` is of type `BuildingTags`
        const indexB = order.indexOf(b.tag); // Same for `b.tag`

        // Sort first by tag order
        if (indexA !== -1 && indexB !== -1 && indexA !== indexB) {
          return indexA - indexB;
        }

        // Then sort by production (choose a resource, e.g., 'energy')
        const productionA = a.baseProduction.energy ?? 0; // Using nullish coalescing for safety
        const productionB = b.baseProduction.energy ?? 0;
        return productionB - productionA;
      }

      // Default sorting for other categories (e.g., by name)
      return a.type.localeCompare(b.type);
    });

  // Get costs and check affordability
  const getUpgradeData = useMemo(
    () =>
      buildings.reduce((acc, building) => {
        const costs = getBuildingUpgradeCost(building);
        acc[building.id] = {
          costs,
          canUpgrade: canUpgradeBuilding(building, resources, costs),
        };
        return acc;
      }, {} as Record<string, { costs: Record<ResourceType, number>; canUpgrade: boolean }>),
    [buildings, resources]
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Existing Buildings Section */}
      <div className="glass-panel p-4 w-full">
        <div className="flex flex-col md:flex-row justify-between mb-4 gap-4 w-full">
          <div className="grid grid-cols-2 w-full">
            <h2 className="text-lg font-medium text-foreground/90">
              Colony Buildings
            </h2>
            <div className="flex items-center justify-endm., space-x-2 text-xs md:text-sm">
              <Users className="h-5 w-5 md:h-4 md:w-4 text-blue-400" />
              <span>
                {population.available} / {population.maxCapacity}{" "}
                <span>workers available</span>
              </span>
              {population.deathTimer && (
                <div className="flex items-center text-red-400 ml-2">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>
                    Oxygen depletion in: {Math.floor(population.deathTimer)}s
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search input */}
        <div className="relative max-w-md w-full mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search buildings..."
            className="w-full pl-10 pr-4 py-2 bg-background/90 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Existing buildings */}
        <ExistingBuildings
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          categories={categories}
          filteredBuildings={filteredBuildings}
          buildingConfig={buildingConfig}
          expandedBuilding={expandedBuilding}
          upgradeBuilding={upgradeBuilding}
          adjustWorkers={adjustWorkers}
          setExpandedBuilding={setExpandedBuilding}
          resources={resources}
          formatNumber={formatNumber}
          ResourcesIcon={ResourcesIcon}
          getUpgradeData={getUpgradeData}
        />

        {/* Construction Section */}
        <ConstructionSection
          categories={categories}
          buildingConfig={buildingConfig}
          initialBuildings={initialBuildings}
          buildings={buildings}
          canAffordResource={canAffordResource}
          ResourcesIcon={ResourcesIcon}
          formatNumber={formatNumber}
          resources={resources}
          constructBuilding={constructBuilding}
          canAffordBuilding={canAffordBuilding}
          technologies={state.technologies}
        />
      </div>
    </div>
  );
};
export { buildingConfig };
