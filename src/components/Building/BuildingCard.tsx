import { AlertTriangle, ArrowDown, ArrowUp, Users, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  calculateStorageBonus,
  calculateWorkerEfficiency,
  getBuildingMaxUpgrade,
  calculateBuildingUpgradeCost,
  calculateBuildingResourceProduction,
} from "@/store/reducers/buildingReducer";
import { buildingConfig } from "./BuildingManager";
import React from "react";

type BuildingCardProps = {
  building;
  formatNumber;
  onAdjustWorkers;
  resources;
  onUpgrade;
  onUpgradeMax;
  canUpgrade;
  ResourcesIcon;
  tierProgress;
};

const BuildingCard = ({
  building,

  formatNumber,
  onAdjustWorkers,
  resources,
  onUpgrade,
  onUpgradeMax,
  canUpgrade,
  ResourcesIcon,
  tierProgress,
}: BuildingCardProps) => {
  const [maxUpgrade, setMaxUpgrade] = React.useState({ tier: 0, upgrades: 0 });

  // Kolory dla tierów
  const tierColors: Record<number, string> = {
    1: "bg-gray-400 text-gray-800",
    2: "bg-blue-400 text-blue-800",
    3: "bg-green-400 text-green-800",
    4: "bg-purple-400 text-purple-800",
    5: "bg-yellow-400 text-yellow-800",
    6: "bg-red-400 text-red-800",
    7: "bg-cyan-400 text-cyan-800",
    8: "bg-pink-400 text-pink-800",
    9: "bg-orange-400 text-orange-800",
    10: "bg-indigo-400 text-indigo-800",
  };

  const hasStorageBonus =
    building.storageBonus && Object.keys(building.storageBonus).length > 0;

  const isMaxTier =
    building.tier >= building.maxTier && building.upgrades >= 10;

  // Obliczanie efektywności z uwzględnieniem tieru

  const currentEfficiency = calculateWorkerEfficiency(building);

  const getUpgrademaxData = () => {
    //getBuildingMaxUpgrade
    const a = getBuildingMaxUpgrade(building, resources);
    setMaxUpgrade(a);
  };

  React.useEffect(() => {
    getUpgrademaxData();
  }, [building, resources]);

  return (
    <Card
      className={`neo-panel overflow-hidden transition-all duration-300 border-primary/30 relative ${
        !building.functioning ? "bg-red-950/10 border-red-800/30" : ""
      }`}
    >
      {/* <img src={`/deepvoidgate/demo/buildings/${building.type}.jpg`} /> */}
      {/* <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img
          src={`/deepvoidgate/demo/buildings/${building.type}.png`}
          alt="Placeholder"
          className="w-full h-1/3 object-cover blur-sm opacity-25"
        />
      </div> */}
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {buildingConfig.find((b) => b.type === building.type)?.icon}
            <CardTitle className="text-base max-[400px]:text-[14px]">
              {building.name}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              className={`${
                tierColors[building.tier]
              } h-[22px] w-[60px] items-center justify-center`}
            >
              <span className="">Tier {building.tier}</span>
            </Badge>
            {!building.functioning && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                <span>Disabled</span>
              </Badge>
            )}
          </div>
        </div>
        <CardDescription className="mt-1 text-xs">
          {building.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 pt-2">
        <div className="flex items-center justify-between text-sm mb-2">
          <div className="flex items-center space-x-1">
            {building.workerCapacity > 0 && (
              <>
                <Users className="h-4 w-4 text-blue-400" />
                <span>
                  {building.assignedWorkers} / {building.workerCapacity} workers
                </span>
                {/* Przeniesione i zmodyfikowane przyciski */}
                <div className="flex gap-2 ml-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAdjustWorkers(building.id, 1)}
                    className="p-1 h-7 w-7 border-green-800/30 bg-green-950/30 hover:bg-green-900/20"
                  >
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAdjustWorkers(building.id, -1)}
                    className="p-1 h-7 w-7 border-red-800/30 bg-red-950/30 hover:bg-red-900/20"
                  >
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                </div>
              </>
            )}
          </div>
          <div
            className={
              building.functioning
                ? currentEfficiency >= 0.9
                  ? "text-green-400"
                  : currentEfficiency >= 0.5
                  ? "text-yellow-400"
                  : "text-red-400"
                : "text-red-400"
            }
          >
            {building.functioning ? (
              `${Math.round(currentEfficiency * 100)}% Efficiency`
            ) : (
              <span className="flex items-center">
                <X className="h-4 w-4 mr-1" /> Disabled
              </span>
            )}
          </div>
        </div>

        {tierProgress && (
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span>Upgrade Progress</span>
              <span>{building.upgrades}/10 upgrades</span>
            </div>
            <Progress
              value={(building.upgrades / 10) * 100}
              className="h-2 bg-gray-700"
            />
          </div>
        )}

        {/* Przyciski do obsługi */}
        <div className="flex justify-between gap-2 mt-3">
          <div className="flex gap-2 flex-1"></div>

          {/* <Button
            size="sm"
            variant="outline"
            onClick={() => onToggleExpand(building.id)}
            className="px-2 sm:px-3 h-8 sm:h-9 border-blue-800/30 bg-blue-950/30 hover:bg-blue-900/20"
          >
            <span className="text-xs sm:text-sm">
              {isExpanded ? "Less" : "More"}
            </span>
          </Button> */}
        </div>

        <div className="mt-4 space-y-3 animate-fade-in">
          {/* Sekcja Storage Bonus */}
          <div className="space-y-1">
            {hasStorageBonus ||
            (building?.uniqueBonus?.storage &&
              building?.tier === building?.maxTier) ? (
              <h4 className="text-xs text-foreground/70">Storage Capacity:</h4>
            ) : null}

            {(hasStorageBonus ||
              (building?.uniqueBonus?.storage &&
                building?.tier === building?.maxTier)) &&
              (() => {
                const bonuses = hasStorageBonus
                  ? calculateStorageBonus(building)
                  : building.uniqueBonus.storage;

                return (
                  <div className="grid grid-cols-2 gap-2 text-xs text-cyan-400">
                    {Object.entries(bonuses).map(([resource, bonus]) => (
                      <div
                        key={resource}
                        className="flex items-center space-x-1"
                      >
                        <span>
                          {Number(bonus) > 0 ||
                          (Number(building?.uniqueBonus?.storage[resource]) >
                            0 &&
                            building?.tier === building?.maxTier)
                            ? ResourcesIcon({ resource })
                            : null}
                        </span>
                        <span>
                          {hasStorageBonus &&
                          building?.uniqueBonus?.storage &&
                          building?.tier === building?.maxTier
                            ? formatNumber(
                                Number(
                                  building?.uniqueBonus?.storage[resource] || 0
                                ) + Number(bonus)
                              )
                            : Number(bonus) > 0 && `+${formatNumber(bonus)}`}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })()}
          </div>

          {/* Sekcja Production/Consumption */}
          <div className="space-y-1">
            <h4 className="text-xs text-foreground/70">
              Production & Consumption:
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {/* Production */}
              {Object.entries(building.baseProduction).map(([resource]) => {
                const total = calculateBuildingResourceProduction(
                  building,
                  resource,
                  resources
                );
                return (
                  <div
                    key={resource}
                    className="flex items-center space-x-1 justify-start w-full"
                  >
                    <span>{ResourcesIcon({ resource })}</span>
                    <span className="text-xs text-foreground/70">
                      {resource}
                    </span>
                    <span className="text-green-400">
                      +{formatNumber(total)}/s
                    </span>
                    {/* {tier5Bonus > 0 && (
                        <Badge className="ml-1 bg-yellow-800/30 text-yellow-400">
                          T5 Bonus
                        </Badge>
                      )} */}
                  </div>
                );
              })}
              {/* Consumption */}
              {Object.entries(building.baseConsumption).map(
                ([resource, amount]) => (
                  <div key={resource} className="w-full">
                    <div className="flex items-center space-x-1">
                      <span>{resources[resource]?.icon}</span>
                      <span className="text-xs text-foreground/70">
                        {resource}
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
                          Number(amount) * building.tier * building.efficiency
                        )}
                        /s
                        {!building.functioning && " (disabled)"}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Przycisk i wymagania ulepszenia */}
          <div className="pt-2">
            <div className="flex justify-between items-center gap-2 max-[475px]:flex-col">
              {/* Przycisk pojedynczego ulepszenia */}
              <div className="w-[60%] max-[475px]:w-full">
                <Button
                  size="sm"
                  onClick={() => onUpgrade(building.id)}
                  disabled={isMaxTier || !canUpgrade}
                  className="w-full button-primary"
                >
                  {isMaxTier
                    ? "Max Tier Reached"
                    : `Upgrade to ${building.upgrades + 1}/10 (Tier ${
                        building.tier
                      })`}
                </Button>
              </div>

              {/* Przycisk maksymalnego ulepszenia */}
              <div className="w-[40%] max-[475px]:w-full">
                <Button
                  size="sm"
                  onClick={() => onUpgradeMax(building.id)}
                  disabled={isMaxTier || !canUpgrade}
                  className="w-full  bg-purple-800 hover:bg-purple-900 border-purple-800"
                >
                  {isMaxTier
                    ? "Max Tier Reached"
                    : `Upgrade to ${maxUpgrade?.upgrades}/10 (Tier ${maxUpgrade?.tier})`}
                </Button>
              </div>
            </div>

            {!isMaxTier && (
              <div className="space-y-1 mt-2">
                <h4 className="text-xs text-foreground/70">
                  Upgrade Requirements:
                </h4>
                <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                  {Object.entries(calculateBuildingUpgradeCost(building)).map(
                    ([resource, cost]) => (
                      <div
                        key={resource}
                        className={`flex items-center space-x-1 ${
                          resources[resource]?.amount < Number(cost)
                            ? "text-red-400"
                            : "text-foreground/70"
                        }`}
                      >
                        <span>{ResourcesIcon({ resource })}</span>
                        <span>{resource}</span>
                        <span>{formatNumber(Number(cost))}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BuildingCard;
