export type Artifact = {
  name: string;
  description: string;
  image: string;
  class: string;
  stars: number;
  amount: number;
  isLocked: boolean;
  expedtionTier?: number;
};
