import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BuildingCard from "@/components/Building/BuildingCard";
import {
  BuildingCategories,
  BuildingConfig,
  BuildingData,
  UpgradeData,
} from "@/types/building";
import { ResourceData } from "@/types/resource";

interface ExistingBuildingsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  categories: BuildingCategories[];
  filteredBuildings: BuildingData[];
  buildingConfig: BuildingConfig[];
  expandedBuilding: string | null;
  upgradeBuilding: (id: string) => void;
  upgradeBuildingMax: (id: string) => void;
  adjustWorkers: (id: string, count: number) => void;
  setExpandedBuilding: (id: string | null) => void;
  resources: {
    oxygen: ResourceData;
    food: ResourceData;
    energy: ResourceData;
    metals: ResourceData;
    water: ResourceData;
    science: ResourceData;
  };
  formatNumber: (num: number) => string;
  ResourcesIcon: ({ resource }: { resource: string }) => string;
  getUpgradeData: Record<string, UpgradeData>;
  showMaxed: boolean;
}

const ExistingBuildings: React.FC<ExistingBuildingsProps> = ({
  activeTab,
  setActiveTab,
  categories,
  filteredBuildings,
  buildingConfig,
  upgradeBuilding,
  upgradeBuildingMax,
  adjustWorkers,
  resources,
  formatNumber,
  ResourcesIcon,
  getUpgradeData,
  showMaxed,
}) => {
  const [selectedResource, setSelectedResource] = useState<string>("oxygen");

  // Colors for each tier
  const tierColors: Record<number, string> = {
    1: "text-gray-400",
    2: "text-blue-400",
    3: "text-green-400",
    4: "text-purple-400",
    5: "text-yellow-400",
  };

  // Progress bar for improvements
  const renderTierProgress = (building: BuildingData) => (
    <div className="w-full mt-2">
      <div className="flex justify-between text-xs mb-1">
        <span className={tierColors[building.tier]}>Tier {building.tier}</span>
        <span>{building.upgrades}/10 upgrades</span>
      </div>
      <div className="h-2 bg-gray-700 rounded-full">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${(building.upgrades / 10) * 100}%` }}
        />
      </div>
    </div>
  );

  const getBuildingCategory = (building: BuildingData): string => {
    if (building.category) return building.category;

    const config = buildingConfig.find((b) => b.type === building.type);
    if (config?.category) return config.category;

    return "all";
  };

  const getResourceType = (building: BuildingData): string | null => {
    if (building.tag) return building.tag;

    if (
      building.baseProduction &&
      Object.keys(building.baseProduction).length > 0
    ) {
      return Object.keys(building.baseProduction)[0];
    }

    if (
      building?.baseProduction &&
      Object.keys(building.baseProduction).length > 0
    ) {
      return Object.keys(building.baseProduction)[0];
    }

    const lowerType = building.type.toLowerCase();
    const resourceTypes = ["oxygen", "food", "energy", "metals"];
    for (const resource of resourceTypes) {
      if (lowerType.includes(resource)) {
        return resource;
      }
    }

    return "oxygen";
  };

  useEffect(() => {
    if (activeTab !== "production") {
      setSelectedResource("oxygen");
      return;
    }

    const productionBuildings = filteredBuildings.filter(
      (building) => getBuildingCategory(building) === "production"
    );

    const availableResources = productionBuildings.reduce(
      (acc: string[], building) => {
        const res = getResourceType(building);
        return res && !acc.includes(res) ? [...acc, res] : acc;
      },
      []
    );

    // Update selectedResource only if necessary
    setSelectedResource((currentSelected) => {
      if (availableResources.length === 0) {
        return currentSelected; // Keep current selection if no resources available
      }
      return currentSelected;
    });
  }, [activeTab, filteredBuildings]); // Removed selectedResource from dependencies

  const shouldDisplayBuilding = (
    building: BuildingData,
    categoryId: string
  ) => {
    const buildingCategory = getBuildingCategory(building);

    const isCategoryMatch =
      categoryId === "all" || buildingCategory === categoryId;

    if (categoryId === "production") {
      const resourceType = getResourceType(building);
      return isCategoryMatch && resourceType === selectedResource;
    }

    return isCategoryMatch;
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 gap-2 w-full h-full py-2 my-2">
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="flex items-center justify-center p-1.5 sm:px-3 sm:py-1.5 gap-1"
            >
              {/* We increase the size of icons on mobile */}
              <div className="text-lg sm:text-base">{category.icon}</div>
              {/* Text visible only on desktops */}
              <span className="hidden sm:inline">{category.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {activeTab === "production" && (
          <div className="grid grid-cols-4 gap-2 w-full h-full py-2 my-2 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
            {["oxygen", "food", "energy", "metals"].map((resource) => (
              <button
                key={resource}
                onClick={() => setSelectedResource(resource)}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm p-1.5 sm:px-3 sm:py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm ${
                  selectedResource === resource
                    ? "bg-background text-white"
                    : ""
                }`}
              >
                {<ResourcesIcon resource={resource} />}
                {/* Text visible only on larger screens*/}
                <span className="hidden sm:inline ml-1">
                  {resource.charAt(0).toUpperCase() + resource.slice(1)}
                </span>
              </button>
            ))}
          </div>
        )}

        {categories.map((category) => {
          const displayableBuildings = filteredBuildings.filter((building) =>
            shouldDisplayBuilding(building, category.id)
          );

          return (
            <TabsContent key={category.id} value={category.id} className="mt-4">
              <div className="grid grid-cols-1 gap-4">
                {displayableBuildings.length === 0 && (
                  <div className="text-center p-4 bg-gray-800 rounded-md">
                    <p>
                      No buildings found for this category.{" "}
                      {category.id === "production"
                        ? `(Resource: ${selectedResource})`
                        : ""}
                    </p>
                  </div>
                )}

                {displayableBuildings.map((building) => {
                  const isMaxTier =
                    building.tier >= building.maxTier &&
                    building.upgrades >= 10;
                  const upgradeData = getUpgradeData[building.id];
                  if (
                    !showMaxed &&
                    isMaxTier &&
                    building.assignedWorkers == building.workerCapacity
                  )
                    return null;

                  return (
                    <BuildingCard
                      key={building.id}
                      building={building}
                      onUpgrade={
                        !isMaxTier && upgradeData?.canUpgrade
                          ? () => upgradeBuilding(building.id)
                          : undefined
                      }
                      onAdjustWorkers={adjustWorkers}
                      resources={resources}
                      canUpgrade={upgradeData?.canUpgrade && !isMaxTier}
                      formatNumber={formatNumber}
                      ResourcesIcon={ResourcesIcon}
                      tierProgress={renderTierProgress(building)}
                      onUpgradeMax={
                        !isMaxTier && upgradeData?.canUpgrade
                          ? () => upgradeBuildingMax(building.id)
                          : undefined
                      }
                    />
                  );
                })}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default ExistingBuildings;
