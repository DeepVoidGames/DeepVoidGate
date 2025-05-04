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
  prerequisites: string[]; // IDs technologii wymaganych do odblokowania
  unlocksBuildings: BuildingType[];
  isResearched: boolean;
  researchDuration: number; // w sekundach
  researchStartTime?: number;
  locked?: boolean; // czy technologia jest zablokowana
  expedtionMinTier?: number; // minimalny poziom technologii do odblokowania
}
