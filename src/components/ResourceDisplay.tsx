
import React from 'react';
import { useGame } from '@/context/GameContext';
import { Progress } from '@/components/ui/progress';
import { formatNumber } from '@/lib/utils';
import { ResourceType } from '@/store/types';

export const ResourceDisplay: React.FC = () => {
  const { state } = useGame();
  const { resources } = state;
  
  const resourceOrder: ResourceType[] = ['oxygen', 'food', 'energy', 'metals', 'science'];
  
  return (
    <div className="glass-panel p-4 space-y-3 animate-fade-in">
      <h2 className="text-lg font-medium text-foreground/90 mb-2">Resources</h2>
      
      <div className="grid grid-cols-1 gap-3">
        {resourceOrder.map((resourceKey) => {
          const resource = resources[resourceKey];
          const percentFull = Math.min(100, (resource.amount / resource.capacity) * 100);
          const netRate = resource.production - resource.consumption;
          
          return (
            <div key={resourceKey} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`resource-badge resource-badge-${resourceKey}`}>
                    {resource.icon}
                  </span>
                  <span className="font-medium capitalize">{resourceKey}</span>
                </div>
                <div className="text-sm font-mono">
                  <span className={netRate >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {netRate > 0 && '+'}{formatNumber(netRate)}/s
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Progress 
                  value={percentFull} 
                  className={`progress-bar flex-grow h-2 bg-${resource.color}-500/20`}
                />
                <div className="text-xs font-mono min-w-[90px] text-right">
                  {formatNumber(resource.amount)} / {formatNumber(resource.capacity)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
