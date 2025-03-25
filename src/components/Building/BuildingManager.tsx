import React, { useCallback, useMemo, useState } from "react";
import {
  Home,
  Droplets,
  Leaf,
  Zap,
  Pickaxe,
  FlaskConical,
  Users,
  Clock,
  Factory,
  Microscope,
  Building,
  Search,
  Package,
  Warehouse,
} from "lucide-react";
import { useGame } from "@/context/GameContext";
import { formatNumber } from "@/lib/utils";
import { BuildingType, BuildingCategory, ResourceType } from "@/store/types";
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

// Centralna konfiguracja budynków
//TODO Przenisnie tego do osobnego pliku najlepiej data/buildings.json
export const buildingConfig = [
  {
    type: "oxygenGenerator" as BuildingType,
    name: "Oxygen Generator",
    category: "production" as BuildingCategory,
    icon: <Droplets className="h-5 w-5 text-cyan-400" />,
  },
  {
    type: "hydroponicFarm" as BuildingType,
    name: "Hydroponic Farm",
    category: "production" as BuildingCategory,
    icon: <Leaf className="h-5 w-5 text-green-400" />,
  },
  {
    type: "solarPanel" as BuildingType,
    name: "Solar Panel",
    category: "production" as BuildingCategory,
    icon: <Zap className="h-5 w-5 text-yellow-400" />,
  },
  {
    type: "metalMine" as BuildingType,
    name: "Metal Mine",
    category: "production" as BuildingCategory,
    icon: <Pickaxe className="h-5 w-5 text-zinc-400" />,
  },
  {
    type: "researchLab" as BuildingType,
    name: "Research Lab",
    category: "research" as BuildingCategory,
    icon: <FlaskConical className="h-5 w-5 text-purple-400" />,
  },
  {
    type: "housing" as BuildingType,
    name: "Basic House",
    category: "housing" as BuildingCategory,
    icon: <Home className="h-5 w-5 text-blue-400" />,
  },
  {
    type: "basicStorage" as BuildingType,
    name: "Basic Storage",
    category: "storage" as BuildingCategory,
    icon: <Package className="h-5 w-5 text-orange-400" />,
  },
  {
    type: "advancedStorage" as BuildingType,
    name: "Advanced Storage",
    category: "storage" as BuildingCategory,
    icon: <Warehouse className="h-5 w-5 text-blue-400" />,
  },
  {
    type: "basicBattery" as BuildingType,
    name: "Basic Battery",
    category: "storage" as BuildingCategory,
    icon: <Zap className="h-5 w-5 text-yellow-400" />,
  },
  {
    type: "advancedMetalExtractor" as BuildingType,
    name: "Advanced Metal Extractor",
    category: "production" as BuildingCategory,
    icon: <Pickaxe className="h-5 w-5 text-zinc-400" />,
  },
  {
    type: "highYieldMetalFracturer" as BuildingType,
    name: "High-Yield Metal Fracturer",
    category: "production" as BuildingCategory,
    icon: <Pickaxe className="h-5 w-5 text-zinc-400" />,
  },
  {
    type: "plasmaCoreMetalSynthesizer" as BuildingType,
    name: "Plasma Core Metal Synthesizer",
    category: "production" as BuildingCategory,
    icon: <Pickaxe className="h-5 w-5 text-zinc-400" />,
  },
];

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
    .sort((a, b) => a.type.localeCompare(b.type));

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
