import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ConstructionSection = ({
  categories,
  buildingConfig,
  initialBuildings,
  buildings,
  canAffordResource,
  ResourcesIcon,
  formatNumber,
  resources,
  constructBuilding,
  canAffordBuilding,
  technologies,
}) => {
  // Funkcja sprawdzająca dostępność budynku
  const isBuildingUnlocked = (buildingType) => {
    const building = initialBuildings.find((b) => b.type === buildingType);
    if (!building?.requiredTechnology) return true; // Budynki bez wymagań są zawsze dostępne

    return technologies.some(
      (tech) => tech.id === building.requiredTechnology && tech.isResearched
    );
  };

  return (
    <div className="space-y-4 my-5">
      {/* Construction Section */}
      <div className="glass-panel p-4">
        <h2 className="text-lg font-medium text-foreground/90 mb-4">
          Construct New Buildings
        </h2>

        <Tabs defaultValue="production">
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

          {categories.slice(1).map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
                {buildingConfig
                  .filter((b) => b.category === category.id)
                  .filter(({ type }) => isBuildingUnlocked(type))
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
                        <CardHeader className="p-2 pb-1">
                          <div className="flex items-center space-x-3">
                            {buildingConfig.find((b) => b.type === type)?.icon}
                            <CardTitle className="text-xs font-semibold">
                              {
                                buildingConfig.find((b) => b.type === type)
                                  ?.name
                              }
                            </CardTitle>
                          </div>
                        </CardHeader>

                        <CardContent className="p-2 pt-0 flex-1 space-y-2">
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
                                      !canAffordBuilding(type, resources)
                                        ? "bg-red-900/20 text-red-400"
                                        : "bg-green-900/20 text-green-400"
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
                            {Object.entries(template?.baseProduction || {})
                              .length > 0 && (
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

                            {/* Storage Cap */}
                            {Object.entries(template?.storageBonus || {})
                              .length > 0 && (
                              <div className="space-y-2">
                                <h4 className="text-xs font-medium text-foreground/80">
                                  Storage
                                </h4>
                                <div className="grid grid-cols-2 gap-2">
                                  {Object.entries(template.storageBonus).map(
                                    ([resource, amount]) => (
                                      <div
                                        key={resource}
                                        className="flex items-center space-x-2 px-2 py-1.5 rounded-md bg-green-900/20 text-green-400"
                                      >
                                        <span>{resources[resource]?.icon}</span>
                                        <span className="text-xs font-medium">
                                          +{formatNumber(Number(amount))}
                                        </span>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                            {Object.entries(template?.baseConsumption || {})
                              .length > 0 && (
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

                        <CardFooter className="p-2 pt-0 mt-auto">
                          <Button
                            size="sm"
                            onClick={() => constructBuilding(type)}
                            disabled={!canAffordBuilding(type, resources)}
                            className="w-full button-primary h-9 font-medium transition-all"
                            variant={
                              canAffordBuilding(type, resources)
                                ? "default"
                                : "secondary"
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

export default ConstructionSection;
