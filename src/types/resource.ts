export type ResourceType =
  | "oxygen"
  | "water"
  | "food"
  | "energy"
  | "metals"
  | "science";

// Resource data structure
export interface ResourceData {
  amount: number;
  production: number;
  consumption: number;
  capacity: number;
  icon: string;
  color: string;
  baseCapacity: number;
  bonusCapacity?: number;
}

export interface Resource {
  amount: number;
  production: number;
  consumption: number;
  capacity: number;
  icon: string;
  color: string;
  baseCapacity: number;
  bonusCapacity?: number;
}

export interface ResourceAlertThresholds {
  oxygen?: {
    low: number;
    critical: number;
  };
  food?: {
    low: number;
    critical: number;
  };
  energy?: {
    low: number;
    critical: number;
  };
}