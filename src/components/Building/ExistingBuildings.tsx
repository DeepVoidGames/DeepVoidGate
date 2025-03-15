import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BuildingCard from "@/components/Building/BuildingCard";

const ExistingBuildings = ({
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
  canUpgrade,
  getUpgradeCosts,
  formatNumber,
  ResourcesIcon,
}) => {
  return (
    <div>
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
                    formatNumber={formatNumber}
                    ResourcesIcon={ResourcesIcon}
                    buildings={buildingConfig}
                  />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ExistingBuildings;
