
import React, { useState } from 'react';
import { 
  Home, 
  Droplets, 
  Leaf, 
  Zap, 
  Pickaxe, 
  FlaskConical,
  ArrowUp,
  ArrowDown,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BuildingType, useGame } from '@/context/GameContext';
import { formatNumber } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

export const BuildingManager: React.FC = () => {
  const { state, dispatch } = useGame();
  const { buildings, resources, population } = state;
  const [expandedBuilding, setExpandedBuilding] = useState<string | null>(null);
  
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
    dispatch({ type: 'CONSTRUCT_BUILDING', payload: { buildingType } });
  };
  
  // Function to upgrade a building
  const upgradeBuilding = (buildingId: string) => {
    dispatch({ type: 'UPGRADE_BUILDING', payload: { buildingId } });
  };
  
  // Function to assign or remove workers
  const adjustWorkers = (buildingId: string, count: number) => {
    dispatch({ type: 'ASSIGN_WORKER', payload: { buildingId, count } });
  };
  
  // Check if we can afford to build a new building
  const canAffordBuilding = (buildingType: BuildingType) => {
    const template = buildings.find(b => b.type === buildingType && b.level === 1);
    
    if (!template) return false;
    
    for (const [resource, cost] of Object.entries(template.baseCost)) {
      if (resources[resource as keyof typeof resources].amount < cost) {
        return false;
      }
    }
    
    return true;
  };
  
  // Get construction costs for display
  const getConstructionCosts = (buildingType: BuildingType) => {
    // Find a level 1 building of this type to use as a template
    const template = buildings.find(b => b.type === buildingType && b.level === 1);
    if (!template) return {};
    
    return template.baseCost;
  };
  
  // Get upgrade costs for a building
  const getUpgradeCosts = (building: typeof buildings[0]) => {
    const costs: Record<string, number> = {};
    
    for (const [resource, baseCost] of Object.entries(building.baseCost)) {
      costs[resource] = Math.floor(baseCost * Math.pow(building.costMultiplier, building.level));
    }
    
    return costs;
  };
  
  // Check if we can afford to upgrade a building
  const canUpgrade = (building: typeof buildings[0]) => {
    const costs = getUpgradeCosts(building);
    
    for (const [resource, cost] of Object.entries(costs)) {
      if (resources[resource as keyof typeof resources].amount < cost) {
        return false;
      }
    }
    
    return true;
  };
  
  // Sort buildings by type
  const sortedBuildings = [...buildings].sort((a, b) => {
    const order: BuildingType[] = [
      'oxygenGenerator',
      'hydroponicFarm',
      'solarPanel',
      'metalMine',
      'researchLab',
      'housing',
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
  
  sortedBuildings.forEach(building => {
    buildingsByType[building.type].push(building);
  });
  
  // Building types to display in construction menu
  const buildingTypes: BuildingType[] = [
    'oxygenGenerator',
    'hydroponicFarm',
    'solarPanel',
    'metalMine',
    'researchLab',
    'housing',
  ];
  
  // Friendly names for building types
  const buildingNames: Record<BuildingType, string> = {
    oxygenGenerator: 'Oxygen Generator',
    hydroponicFarm: 'Hydroponic Farm',
    solarPanel: 'Solar Array',
    metalMine: 'Metal Extractor',
    researchLab: 'Research Lab',
    housing: 'Habitat Dome',
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass-panel p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-foreground/90">Colony Buildings</h2>
          <div className="flex items-center space-x-2 text-sm">
            <Users className="h-4 w-4 text-blue-400" />
            <span>{population.available} / {population.total} workers available</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {sortedBuildings.map(building => {
            const isExpanded = expandedBuilding === building.id;
            const costs = getUpgradeCosts(building);
            
            return (
              <Card 
                key={building.id} 
                className={`neo-panel overflow-hidden transition-all duration-300 ${
                  isExpanded ? 'border-primary/30' : 'border-border/10'
                }`}
              >
                <CardHeader className="p-4 pb-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {buildingIcons[building.type]}
                      <CardTitle className="text-base">{building.name}</CardTitle>
                    </div>
                    <div className="text-sm font-medium">
                      Lvl {building.level}
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
                      <span>{building.assignedWorkers} / {building.workerCapacity} workers</span>
                    </div>
                    <div className={`
                      ${building.efficiency >= 0.9 ? 'text-green-400' : 
                        building.efficiency >= 0.5 ? 'text-yellow-400' : 'text-red-400'}
                    `}>
                      {Math.round(building.efficiency * 100)}% Efficiency
                    </div>
                  </div>
                  
                  <div className="flex justify-between gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => adjustWorkers(building.id, 1)}
                      disabled={population.available <= 0}
                      className="flex-1 border-green-800/30 bg-green-950/30 hover:bg-green-900/20"
                    >
                      <ArrowUp className="h-4 w-4 mr-1" /> Assign
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => adjustWorkers(building.id, -1)}
                      disabled={building.assignedWorkers <= 0}
                      className="flex-1 border-red-800/30 bg-red-950/30 hover:bg-red-900/20"
                    >
                      <ArrowDown className="h-4 w-4 mr-1" /> Remove
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setExpandedBuilding(isExpanded ? null : building.id)}
                      className="border-blue-800/30 bg-blue-950/30 hover:bg-blue-900/20"
                    >
                      {isExpanded ? 'Less' : 'More'}
                    </Button>
                  </div>
                  
                  {isExpanded && (
                    <div className="mt-4 space-y-3 animate-fade-in">
                      <div className="space-y-1">
                        <h4 className="text-xs text-foreground/70">Production per level:</h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {Object.entries(building.baseProduction).map(([resource, amount]) => (
                            <div key={resource} className="flex items-center space-x-1">
                              <span className={`resource-badge resource-badge-${resource}`}>
                                {resources[resource as keyof typeof resources]?.icon}
                              </span>
                              <span className="text-green-400">
                                +{formatNumber(amount * building.level * building.efficiency)}/s
                              </span>
                            </div>
                          ))}
                          {Object.entries(building.baseConsumption).map(([resource, amount]) => (
                            <div key={resource} className="flex items-center space-x-1">
                              <span className={`resource-badge resource-badge-${resource}`}>
                                {resources[resource as keyof typeof resources]?.icon}
                              </span>
                              <span className="text-red-400">
                                -{formatNumber(amount * building.level * building.efficiency)}/s
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <Button
                          size="sm"
                          onClick={() => upgradeBuilding(building.id)}
                          disabled={!canUpgrade(building)}
                          className="w-full button-primary"
                        >
                          Upgrade to Level {building.level + 1}
                        </Button>
                        
                        <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                          {Object.entries(costs).map(([resource, cost]) => (
                            <div 
                              key={resource} 
                              className={`flex items-center space-x-1 ${
                                resources[resource as keyof typeof resources].amount < cost 
                                  ? 'text-red-400' : 'text-foreground/70'
                              }`}
                            >
                              <span>{resource}:</span>
                              <span>{formatNumber(cost)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {buildings.length === 0 && (
          <div className="text-center text-muted-foreground py-6">
            No buildings yet. Start building your colony!
          </div>
        )}
      </div>
      
      <div className="glass-panel p-4">
        <h2 className="text-lg font-medium text-foreground/90 mb-4">Construct New Buildings</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {buildingTypes.map(buildingType => {
            const count = buildingsByType[buildingType].length;
            const costs = getConstructionCosts(buildingType);
            
            return (
              <Card key={buildingType} className="neo-panel border-border/10">
                <CardHeader className="p-3 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {buildingIcons[buildingType]}
                      <CardTitle className="text-sm">{buildingNames[buildingType]}</CardTitle>
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
                          resources[resource as keyof typeof resources].amount < cost 
                            ? 'text-red-400' : 'text-foreground/70'
                        }`}
                      >
                        <span>{resource}:</span>
                        <span>{formatNumber(cost)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                
                <CardFooter className="p-3 pt-0">
                  <Button
                    size="sm"
                    onClick={() => constructBuilding(buildingType)}
                    disabled={!canAffordBuilding(buildingType)}
                    className="w-full button-primary text-xs py-1"
                  >
                    Construct
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
