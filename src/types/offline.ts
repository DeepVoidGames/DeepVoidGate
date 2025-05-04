import { ResourceType } from "@/types/resource";

export interface OfflineReport {
  elapsedTime: number;
  resourceChanges: Record<ResourceType, number>;
}
