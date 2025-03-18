import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BuildingCard from "@/components/Building/BuildingCard";
import { UpgradeData } from "@/store/types";

// Dodajemy interfejs dla propsów
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
}) => {
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

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-4">
            <div className="grid grid-cols-1 gap-4">
              {filteredBuildings
                .filter(
                  (building) =>
                    category.id === "all" ||
                    buildingConfig.find((b) => b.type === building.type)
                      ?.category === category.id
                )
                .map((building) => {
                  const isMaxTier =
                    building.tier >= 5 && building.upgrades >= 10;
                  const upgradeData = getUpgradeData[building.id];

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
        ))}
      </Tabs>
    </div>
  );
};

export default ExistingBuildings;
