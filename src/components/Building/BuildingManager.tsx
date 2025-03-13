import React, { useState } from "react";
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
import { BuildingType, BuildingCategory } from "@/store/types";
import { initialBuildings } from "@/store/initialData";
import ConstructionSection from "./ConstructionSection";
import ExistingBuildings from "./ExistingBuildings";

// Centralna konfiguracja budynków
//TODO Przenisnie tego do osobnego pliku najlepiej data/buildings.json
const buildingConfig = [
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
];

// Konfiguracja kategorii
const categories = [
  {
    id: "all" as BuildingCategory | "all",
    name: "All",
    icon: <Building className="h-4 w-4" />,
  },
  {
    id: "production" as BuildingCategory,
    name: "Production",
    icon: <Factory className="h-4 w-4" />,
  },
  {
    id: "research" as BuildingCategory,
    name: "Reasearch",
    icon: <Microscope className="h-4 w-4" />,
  },
  {
    id: "housing" as BuildingCategory,
    name: "Housing",
    icon: <Home className="h-4 w-4" />,
  },
];

const ResourcesIcon = ({ resource }) => {
  const icons = {
    oxygen: "O₂",
    food: "🌱",
    energy: "⚡",
    metals: "⛏️",
    science: "🔬",
  };
  return icons[resource] || "?";
};

export const BuildingManager: React.FC = () => {
  const { state, dispatch } = useGame();
  const { buildings, resources, population } = state;
  const [expandedBuilding, setExpandedBuilding] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Building icons mapping
  const buildingIcons: Record<BuildingType, React.ReactNode> = {
    oxygenGenerator: <Droplets className="h-5 w-5 text-cyan-400" />,
    hydroponicFarm: <Leaf className="h-5 w-5 text-green-400" />,
    solarPanel: <Zap className="h-5 w-5 text-yellow-400" />,
    metalMine: <Pickaxe className="h-5 w-5 text-zinc-400" />,
    researchLab: <FlaskConical className="h-5 w-5 text-purple-400" />,
    housing: <Home className="h-5 w-5 text-blue-400" />,
  };

  // Function to construct a new building
  const constructBuilding = (buildingType: BuildingType) => {
    dispatch({ type: "CONSTRUCT_BUILDING", payload: { buildingType } });
  };

  // Function to upgrade a building
  const upgradeBuilding = (buildingId: string) => {
    dispatch({ type: "UPGRADE_BUILDING", payload: { buildingId } });
  };

  // Function to assign or remove workers
  const adjustWorkers = (buildingId: string, count: number) => {
    dispatch({ type: "ASSIGN_WORKER", payload: { buildingId, count } });
  };

  // Check if we can afford to build a new building
  const canAffordBuilding = (buildingType: BuildingType) => {
    const buildingTemplate = initialBuildings.find(
      (b) => b.type === buildingType
    );

    if (!buildingTemplate) return false;

    // Check each resource cost
    for (const [resource, cost] of Object.entries(buildingTemplate.baseCost)) {
      if (resources[resource as keyof typeof resources].amount < Number(cost)) {
        return false;
      }
    }

    return true;
  };

  // Check if resource is affordable
  const canAffordResource = (resourceType: string, amount: number) => {
    return resources[resourceType as keyof typeof resources].amount >= amount;
  };

  // Get construction costs for display
  const getConstructionCosts = (buildingType: BuildingType) => {
    const buildingTemplate = initialBuildings.find(
      (b) => b.type === buildingType
    );
    if (!buildingTemplate) return {};

    return buildingTemplate.baseCost;
  };

  // Get upgrade costs for a building
  const getUpgradeCosts = (building: (typeof buildings)[0]) => {
    const costs: Record<string, number> = {};

    for (const [resource, baseCost] of Object.entries(building.baseCost)) {
      costs[resource] = Math.floor(
        Number(baseCost) *
          Math.pow(Number(building.costMultiplier), Number(building.level))
      );
    }

    return costs;
  };

  // Check if we can afford to upgrade a building
  const canUpgrade = (building: (typeof buildings)[0]) => {
    const costs = getUpgradeCosts(building);

    for (const [resource, cost] of Object.entries(costs)) {
      if (resources[resource as keyof typeof resources].amount < Number(cost)) {
        return false;
      }
    }

    return true;
  };

  // Sort buildings by type
  const sortedBuildings = [...buildings].sort((a, b) => {
    const order: BuildingType[] = [
      "oxygenGenerator",
      "hydroponicFarm",
      "solarPanel",
      "metalMine",
      "researchLab",
      "housing",
    ];

    return order.indexOf(a.type) - order.indexOf(b.type);
  });

  // Group buildings by type
  const buildingsByType: Record<BuildingType, typeof buildings> = {
    oxygenGenerator: [],
    hydroponicFarm: [],
    solarPanel: [],
    metalMine: [],
    researchLab: [],
    housing: [],
  };

  // Group buildings by category
  const buildingsByCategory: Record<BuildingCategory, typeof buildings> = {
    production: [],
    housing: [],
    research: [],
    utility: [],
  };

  sortedBuildings.forEach((building) => {
    buildingsByType[building.type].push(building);
    buildingsByCategory[building.category].push(building);
  });

  // Filtrowanie budynków
  const filteredBuildings = buildings
    .filter(
      (building) =>
        activeTab === "all" ||
        buildingConfig.find((b) => b.type === building.type)?.category ===
          activeTab
    )
    .filter((building) => {
      const search = searchQuery.toLowerCase();
      return (
        building.name.toLowerCase().includes(search) ||
        building.description.toLowerCase().includes(search)
      );
    })
    .sort((a, b) => a.type.localeCompare(b.type));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Existing Buildings Section */}
      <div className="glass-panel p-4">
        <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-medium text-foreground/90">
              Colony Buildings
            </h2>
            <div className="hidden md:flex items-center space-x-2 text-sm">
              <Users className="h-4 w-4 text-blue-400" />
              <span>
                {population.available} / {population.total} workers available
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
          canUpgrade={canUpgrade}
          getUpgradeCosts={getUpgradeCosts}
          formatNumber={formatNumber}
          ResourcesIcon={ResourcesIcon}
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
        />
      </div>
    </div>
  );
};
