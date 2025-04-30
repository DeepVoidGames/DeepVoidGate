export type Artifact = {
  name: string;
  description: string;
  image: string;
  class: string;
  stars: number;
  amount: number;
  isLocked: boolean;
  expedtionTier?: number;
  effect?: ArtifactEffect[];
};

export type ArtifactEffect = {
  type: ArtifactEffectType;
  description?: (stars: number) => string;
  value: number;
};

export type ArtifactEffectType = "produciton" | "capacity" | "expeditionTime";
