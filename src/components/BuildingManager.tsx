import React, { useState } from "react";
import {
  Home,
  Droplets,
  Leaf,
  Zap,
  Pickaxe,
  FlaskConical,
  ArrowUp,
  ArrowDown,
  Users,
  AlertTriangle,
  X,
  Clock,
  Lightbulb,
  Factory,
  Microscope,
  Building,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGame } from "@/context/GameContext";
import { formatNumber } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { BuildingType, BuildingCategory } from "@/store/types";
import { initialBuildings } from "@/store/initialData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

// Extract BuildingCard component to improve maintainability and scalability
const BuildingCard = ({
  building,
  onUpgrade,
  onAdjustWorkers,
  onToggleExpand,
  isExpanded,
  resources,
  canUpgrade,
  getUpgradeCosts,
}) => {
  const buildingIcons = {
    oxygenGenerator: <Droplets className="h-5 w-5 text-cyan-400" />,
    hydroponicFarm: <Leaf className="h-5 w-5 text-green-400" />,
    solarPanel: <Zap className="h-5 w-5 text-yellow-400" />,
    metalMine: <Pickaxe className="h-5 w-5 text-zinc-400" />,
    researchLab: <FlaskConical className="h-5 w-5 text-purple-400" />,
    housing: <Home className="h-5 w-5 text-blue-400" />,
  };

  const costs = getUpgradeCosts(building);

  return (
    <Card
      key={building.id}
      className={`neo-panel overflow-hidden transition-all duration-300 ${
        isExpanded ? "border-primary/30" : "border-border/10"
      } ${!building.functioning ? "bg-red-950/10 border-red-800/30" : ""}`}
    >
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {buildingIcons[building.type]}
            <CardTitle className="text-base">{building.name}</CardTitle>
          </div>
          <div className="text-sm font-medium flex items-center gap-2">
            {!building.functioning && (
              <div
                className="flex items-center text-red-400 tooltip"
                title="Building not functioning"
              >
                <AlertTriangle className="h-4 w-4 mr-1" />
                <span>Not Working</span>
              </div>
            )}
            <span>Lvl {building.level}</span>
          </div>
        </div>
        <CardDescription className="mt-1 text-xs">
          {building.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 pt-2">
        <div className="flex items-center justify-between text-sm mb-2">
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4 text-blue-400" />
            <span>
              {building.assignedWorkers} / {building.workerCapacity} workers
            </span>
          </div>
          <div
            className={`
            ${
              building.functioning
                ? building.efficiency >= 0.9
                  ? "text-green-400"
                  : building.efficiency >= 0.5
                  ? "text-yellow-400"
                  : "text-red-400"
                : "text-red-400"
            }
          `}
          >
            {building.functioning ? (
              `${Math.round(building.efficiency * 100)}% Efficiency`
            ) : (
              <span className="flex items-center">
                <X className="h-4 w-4 mr-1" /> Disabled
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-between gap-2 mt-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onAdjustWorkers(building.id, 1)}
            className="flex-1 border-green-800/30 bg-green-950/30 hover:bg-green-900/20"
          >
            <ArrowUp className="h-4 w-4 mr-1" /> Assign
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onAdjustWorkers(building.id, -1)}
            className="flex-1 border-red-800/30 bg-red-950/30 hover:bg-red-900/20"
          >
            <ArrowDown className="h-4 w-4 mr-1" /> Remove
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onToggleExpand(building.id)}
            className="border-blue-800/30 bg-blue-950/30 hover:bg-blue-900/20"
          >
            {isExpanded ? "Less" : "More"}
          </Button>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-3 animate-fade-in">
            <div className="space-y-1">
              <h4 className="text-xs text-foreground/70">
                Production & Consumption:
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(building.baseProduction).map(
                  ([resource, amount]) => (
                    <div key={resource} className="flex items-center space-x-1">
                      <span
                        className={`resource-badge resource-badge-${resource}`}
                      >
                        {resources[resource]?.icon}
                      </span>
                      <span
                        className={
                          building.functioning
                            ? "text-green-400"
                            : "text-gray-400"
                        }
                      >
                        +
                        {formatNumber(
                          Number(amount) *
                            Number(building.level) *
                            Number(building.efficiency)
                        )}
                        /s
                        {!building.functioning && " (disabled)"}
                      </span>
                    </div>
                  )
                )}
                {Object.entries(building.baseConsumption).map(
                  ([resource, amount]) => (
                    <div key={resource} className="flex items-center space-x-1">
                      <span
                        className={`resource-badge resource-badge-${resource}`}
                      >
                        {resources[resource]?.icon}
                      </span>
                      <span
                        className={
                          building.functioning
                            ? "text-red-400"
                            : "text-gray-400"
                        }
                      >
                        -
                        {formatNumber(
                          Number(amount) *
                            Number(building.level) *
                            Number(building.efficiency)
                        )}
                        /s
                        {!building.functioning && " (disabled)"}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="pt-2">
              <Button
                size="sm"
                onClick={() => onUpgrade(building.id)}
                disabled={!canUpgrade(building)}
                className="w-full button-primary"
              >
                Upgrade to Level {building.level + 1}
              </Button>

              <div className="space-y-1 mt-2">
                <h4 className="text-xs text-foreground/70">
                  Resource Requirements:
                </h4>
                <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                  {Object.entries(costs).map(([resource, cost]) => (
                    <div
                      key={resource}
                      className={`flex items-center space-x-1 ${
                        resources[resource].amount < Number(cost)
                          ? "text-red-400"
                          : "text-foreground/70"
                      }`}
                    >
                      <span>{ResourcesIcon({ resource })}</span>
                      <span>{resource}:</span>
                      <span>{formatNumber(Number(cost))}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs text-foreground/70">
                    Production & Consumption:
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(building.baseProduction).map(
                      ([resource, amount]) => (
                        <div
                          key={resource}
                          className="flex items-center space-x-1"
                        >
                          <span
                            className={`resource-badge resource-badge-${resource}`}
                          >
                            {resources[resource]?.icon}
                          </span>
                          <span
                            className={
                              building.functioning
                                ? "text-green-400"
                                : "text-gray-400"
                            }
                          >
                            +
                            {formatNumber(
                              Number(amount) *
                                Number(building.level + 1) *
                                Number(building.efficiency)
                            )}
                            /s
                            {!building.functioning && " (disabled)"}
                          </span>
                        </div>
                      )
                    )}
                    {Object.entries(building.baseConsumption).map(
                      ([resource, amount]) => (
                        <div
                          key={resource}
                          className="flex items-center space-x-1"
                        >
                          <span
                            className={`resource-badge resource-badge-${resource}`}
                          >
                            {resources[resource]?.icon}
                          </span>
                          <span
                            className={
                              building.functioning
                                ? "text-red-400"
                                : "text-gray-400"
                            }
                          >
                            -
                            {formatNumber(
                              Number(amount) *
                                Number(building.level + 1) *
                                Number(building.efficiency)
                            )}
                            /s
                            {!building.functioning && " (disabled)"}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Extract ConstructionCard component
const ConstructionCard = ({
  buildingType,
  count,
  costs,
  canAfford,
  onConstruct,
  buildingName,
  buildingIcon,
}) => {
  return (
    <Card key={buildingType} className="neo-panel border-border/10">
      <CardHeader className="p-3 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {buildingIcon}
            <CardTitle className="text-sm">{buildingName}</CardTitle>
          </div>
          <div className="text-xs text-muted-foreground">Owned: {count}</div>
        </div>
      </CardHeader>

      <CardContent className="p-3 pt-1">
        <div className="grid grid-cols-2 gap-1 text-xs mb-3">
          {Object.entries(costs).map(([resource, cost]) => (
            <div
              key={resource}
              className={`flex items-center space-x-1 ${
                !canAfford(resource, Number(cost))
                  ? "text-red-400"
                  : "text-foreground/70"
              }`}
            >
              <span>{ResourcesIcon({ resource })}</span>
              <span>{resource}:</span>
              <span>{formatNumber(Number(cost))}</span>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-3 pt-0">
        <Button
          size="sm"
          onClick={() => onConstruct(buildingType)}
          disabled={!canAfford()}
          className="w-full button-primary text-xs py-1"
        >
          Construct
        </Button>
      </CardFooter>
    </Card>
  );
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

  // Grupowanie typów budynków do konstrukcji
  const availableBuildings = buildingConfig.reduce((acc, config) => {
    const template = initialBuildings.find((b) => b.type === config.type);
    if (template) {
      acc[config.category] = [...(acc[config.category] || []), template];
    }
    return acc;
  }, {} as Record<BuildingCategory, typeof initialBuildings>);

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
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex items-center justify-center gap-2"
              >
                {category.icon}
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {/*  Building cards */}
          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="m-0">
              <div className="grid grid-cols-1 gap-4">
                {filteredBuildings
                  .filter(
                    (building) =>
                      category.id === "all" ||
                      buildingConfig.find((b) => b.type === building.type)
                        ?.category === category.id
                  )
                  .map((building) => (
                    <BuildingCard
                      key={building.id}
                      building={building}
                      isExpanded={expandedBuilding === building.id}
                      onUpgrade={upgradeBuilding}
                      onAdjustWorkers={adjustWorkers}
                      onToggleExpand={(id) =>
                        setExpandedBuilding(id === expandedBuilding ? null : id)
                      }
                      resources={resources}
                      canUpgrade={canUpgrade}
                      getUpgradeCosts={getUpgradeCosts}
                    />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Construction Section */}
      <div className="glass-panel p-4">
        <h2 className="text-lg font-medium text-foreground/90 mb-4">
          Construct New Buildings
        </h2>

        <Tabs defaultValue="production">
          <TabsList className="grid grid-cols-2 md:grid-cols-3 gap-2 w-full">
            {categories.slice(1).map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex items-center justify-center gap-2"
              >
                {category.icon}
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.slice(1).map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
                {buildingConfig
                  .filter((b) => b.category === category.id)
                  .map(({ type }) => {
                    const template = initialBuildings.find(
                      (b) => b.type === type
                    );
                    if (!template) return null;

                    const count = buildings.filter(
                      (b) => b.type === type
                    ).length;
                    if (count >= template.maxInstances) return null;

                    return (
                      <Card
                        key={type}
                        className="h-full flex flex-col border-border/20 shadow-sm neo-panel"
                      >
                        <CardHeader className="p-4 pb-2">
                          <div className="flex items-center space-x-3">
                            {buildingConfig.find((b) => b.type === type)?.icon}
                            <CardTitle className="text-sm font-semibold">
                              {
                                buildingConfig.find((b) => b.type === type)
                                  ?.name
                              }
                            </CardTitle>
                          </div>
                        </CardHeader>

                        <CardContent className="p-4 pt-0 flex-1 space-y-4">
                          {/* Construction Costs */}
                          <div className="space-y-2">
                            <h4 className="text-xs font-medium text-foreground/80">
                              Construction Cost
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                              {Object.entries(template.baseCost).map(
                                ([resource, cost]) => (
                                  <div
                                    key={resource}
                                    className={`flex items-center space-x-2 px-2 py-1.5 rounded-md ${
                                      !canAffordResource(resource, Number(cost))
                                        ? "bg-red-900/20 text-red-400"
                                        : "bg-background/50 text-foreground/80"
                                    }`}
                                  >
                                    <span className="text-sm">
                                      {ResourcesIcon({ resource })}
                                    </span>
                                    <span className="text-xs font-medium">
                                      {formatNumber(Number(cost))}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>

                          {/* Production & Consumption */}
                          <div className="space-y-3">
                            {Object.entries(template.baseProduction).length >
                              0 && (
                              <div className="space-y-2">
                                <h4 className="text-xs font-medium text-foreground/80">
                                  Production
                                </h4>
                                <div className="grid grid-cols-2 gap-2">
                                  {Object.entries(template.baseProduction).map(
                                    ([resource, amount]) => (
                                      <div
                                        key={resource}
                                        className="flex items-center space-x-2 px-2 py-1.5 rounded-md bg-green-900/20 text-green-400"
                                      >
                                        <span>{resources[resource]?.icon}</span>
                                        <span className="text-xs font-medium">
                                          +{formatNumber(Number(amount))}/s
                                        </span>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                            {Object.entries(template.baseConsumption).length >
                              0 && (
                              <div className="space-y-2">
                                <h4 className="text-xs font-medium text-foreground/80">
                                  Consumption
                                </h4>
                                <div className="grid grid-cols-2 gap-2">
                                  {Object.entries(template.baseConsumption).map(
                                    ([resource, amount]) => (
                                      <div
                                        key={resource}
                                        className="flex items-center space-x-2 px-2 py-1.5 rounded-md bg-red-900/20 text-red-400"
                                      >
                                        <span>{resources[resource]?.icon}</span>
                                        <span className="text-xs font-medium">
                                          -{formatNumber(Number(amount))}/s
                                        </span>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>

                        <CardFooter className="p-4 pt-0 mt-auto">
                          <Button
                            size="sm"
                            onClick={() => constructBuilding(type)}
                            disabled={!canAffordBuilding(type)}
                            className="w-full button-primary h-9 font-medium transition-all"
                            variant={
                              canAffordBuilding(type) ? "default" : "secondary"
                            }
                          >
                            <span className="truncate">Construct</span>
                            {count > 0 && (
                              <span className="ml-2 text-xs opacity-80">
                                ({count} built)
                              </span>
                            )}
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};
