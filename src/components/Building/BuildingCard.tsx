import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Droplets,
  FlaskConical,
  Home,
  Leaf,
  Package,
  Pickaxe,
  Users,
  Warehouse,
  X,
  Zap,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const BuildingCard = ({
  building,
  getUpgradeCosts,
  isExpanded,
  formatNumber,
  onAdjustWorkers,
  onToggleExpand,
  resources,
  onUpgrade,
  canUpgrade,
  ResourcesIcon,
  buildings, // Nowa prop z listą wszystkich budynków
}) => {
  const buildingIcons = {
    oxygenGenerator: <Droplets className="h-5 w-5 text-cyan-400" />,
    hydroponicFarm: <Leaf className="h-5 w-5 text-green-400" />,
    solarPanel: <Zap className="h-5 w-5 text-yellow-400" />,
    metalMine: <Pickaxe className="h-5 w-5 text-zinc-400" />,
    researchLab: <FlaskConical className="h-5 w-5 text-purple-400" />,
    housing: <Home className="h-5 w-5 text-blue-400" />,
    basicStorage: <Package className="h-5 w-5 text-orange-400" />,
    advancedStorage: <Warehouse className="h-5 w-5 text-blue-400" />,
  };

  const costs = getUpgradeCosts(building);

  const hasStorageBonus =
    building.storageBonus && Object.keys(building.storageBonus).length > 0;

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
                className="flex items-center text-red-400"
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
            className={
              building.functioning
                ? building.efficiency >= 0.9
                  ? "text-green-400"
                  : building.efficiency >= 0.5
                  ? "text-yellow-400"
                  : "text-red-400"
                : "text-red-400"
            }
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
            {hasStorageBonus && (
              <div className="space-y-1">
                <h4 className="text-xs text-foreground/70">
                  Storage Capacity:
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-cyan-400">
                  {Object.entries(building.storageBonus).map(
                    ([resource, bonus]) => (
                      <div
                        key={resource}
                        className="flex items-center space-x-1"
                      >
                        <span>{ResourcesIcon({ resource })}</span>
                        <span>
                          +{formatNumber(Number(bonus) * building.level)}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

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
                          Number(amount) * building.level * building.efficiency
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
                          Number(amount) * building.level * building.efficiency
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
                  Upgrade Requirements:
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
                <div className="mt-2 text-xs text-muted-foreground">
                  {building.maxInstances > 1 &&
                    `Can build: ${
                      buildings.filter((b) => b.type === building.type).length
                    }/${building.maxInstances}`}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BuildingCard;
