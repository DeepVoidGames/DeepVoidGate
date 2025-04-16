import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BuildingCard from "@/components/Building/BuildingCard";
import { ResourceType, UpgradeData } from "@/store/types";

interface ExistingBuildingsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  categories: any[];
  filteredBuildings: any[];
  buildingConfig: any[];
  expandedBuilding: string | null;
  upgradeBuilding: (id: string) => void;
  adjustWorkers: (id: string, count: number) => void;
  setExpandedBuilding: (id: string | null) => void;
  resources: any;
  formatNumber: (num: number) => string;
  ResourcesIcon: any;
  getUpgradeData: Record<string, UpgradeData>;
  showMaxed: boolean;
}

const ExistingBuildings: React.FC<ExistingBuildingsProps> = ({
  activeTab,
  setActiveTab,
  categories,
  filteredBuildings,
  buildingConfig,
  expandedBuilding,
  upgradeBuilding,
  adjustWorkers,
  setExpandedBuilding,
  resources,
  formatNumber,
  ResourcesIcon,
  getUpgradeData,
  showMaxed,
}) => {
  const [selectedResource, setSelectedResource] = useState<string>("oxygen");

  // Kolory dla poszczególnych tierów
  const tierColors: Record<number, string> = {
    1: "text-gray-400",
    2: "text-blue-400",
    3: "text-green-400",
    4: "text-purple-400",
    5: "text-yellow-400",
  };

  // Progress bar dla ulepszeń
  const renderTierProgress = (building: any) => (
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

  // Funkcja, która znajduje kategorię budynku
  const getBuildingCategory = (building: any): string => {
    // Najpierw spróbuj znaleźć w building
    if (building.category) return building.category;

    // Jeśli nie ma, sprawdź w buildingConfig
    const config = buildingConfig.find((b) => b.type === building.type);
    if (config?.category) return config.category;

    // Domyślnie zwróć 'all'
    return "all";
  };

  // Funkcja określająca typ zasobu dla budynku
  const getResourceType = (building: any): string | null => {
    // Sprawdź tag w budynku
    if (building.tag) return building.tag;

    // Sprawdź w konfiguracji
    const config = buildingConfig.find((b) => b.type === building.type);
    if (config?.tag) return config.tag;

    // Sprawdź baseProduction w budynku
    if (
      building.baseProduction &&
      Object.keys(building.baseProduction).length > 0
    ) {
      return Object.keys(building.baseProduction)[0];
    }

    // Sprawdź baseProduction w konfiguracji
    if (
      config?.baseProduction &&
      Object.keys(config.baseProduction).length > 0
    ) {
      return Object.keys(config.baseProduction)[0];
    }

    // Próba określenia na podstawie nazwy typu
    const lowerType = building.type.toLowerCase();
    const resourceTypes = ["oxygen", "food", "energy", "metals"];
    for (const resource of resourceTypes) {
      if (lowerType.includes(resource)) {
        return resource;
      }
    }

    // Domyślnie zwróć oxygen
    return "oxygen";
  };

  useEffect(() => {
    if (activeTab !== "production") {
      setSelectedResource("oxygen");
    } else {
      // Filtruj budynki produkcyjne
      const productionBuildings = filteredBuildings.filter(
        (building) => getBuildingCategory(building) === "production"
      );

      if (productionBuildings.length > 0) {
        const availableResources = productionBuildings.reduce(
          (acc, building) => {
            const res = getResourceType(building);
            return res && !acc.includes(res) ? [...acc, res] : acc;
          },
          [] as string[]
        );

        if (
          availableResources.length > 0 &&
          !availableResources.includes(selectedResource)
        ) {
          setSelectedResource(availableResources[0]);
        }
      }
    }
  }, [activeTab, filteredBuildings, selectedResource]);

  // Funkcja sprawdzająca, czy budynek powinien być wyświetlony
  const shouldDisplayBuilding = (building: any, categoryId: string) => {
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
        <TabsList className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 w-full h-full py-2 my-2">
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

        {activeTab === "production" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 w-full h-full py-2 my-2 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
            {["oxygen", "food", "energy", "metals"].map((resource) => (
              <button
                key={resource}
                onClick={() => setSelectedResource(resource)}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm ${
                  selectedResource === resource
                    ? "bg-background text-white"
                    : ""
                }`}
              >
                {<ResourcesIcon resource={resource} />}{" "}
                {resource.charAt(0).toUpperCase() + resource.slice(1)}
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
                        ? `(Zasób: ${selectedResource})`
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
                      isExpanded={expandedBuilding === building.id}
                      onUpgrade={
                        !isMaxTier && upgradeData?.canUpgrade
                          ? () => upgradeBuilding(building.id)
                          : undefined
                      }
                      onAdjustWorkers={adjustWorkers}
                      onToggleExpand={(id) =>
                        setExpandedBuilding(id === expandedBuilding ? null : id)
                      }
                      resources={resources}
                      canUpgrade={upgradeData?.canUpgrade && !isMaxTier}
                      upgradeCosts={upgradeData?.costs || {}}
                      formatNumber={formatNumber}
                      ResourcesIcon={ResourcesIcon}
                      tierProgress={renderTierProgress(building)}
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
