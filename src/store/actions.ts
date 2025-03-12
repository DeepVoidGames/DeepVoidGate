
import { BuildingType, ResourceType } from './types';

export type GameAction =
  | { type: 'TICK'; payload: { currentTime: number } }
  | { type: 'CONSTRUCT_BUILDING'; payload: { buildingType: BuildingType } }
  | { type: 'UPGRADE_BUILDING'; payload: { buildingId: string } }
  | { type: 'ASSIGN_WORKER'; payload: { buildingId: string; count: number } }
  | { type: 'SAVE_GAME' }
  | { type: 'LOAD_GAME' }
  | { type: 'RESET_GAME' };
