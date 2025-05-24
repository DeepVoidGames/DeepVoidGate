import { ResourceType } from "@/types/resource";
import { BuildingType } from "@/types/building";

export type TechnologyCategory =
  | "Infrastructure"
  | "Energy"
  | "Production"
  | "Research"
  | "Advanced";

export interface Technology {
  id: string;
  name: string;
  category: TechnologyCategory;
  description: string;
  researchCost: { [key in ResourceType]?: number };
  prerequisites: string[]; 
  unlocksBuildings: BuildingType[];
  isResearched: boolean;
  researchDuration: number;
  researchStartTime?: number;
  locked?: boolean; 
  expedtionMinTier?: number;
}
