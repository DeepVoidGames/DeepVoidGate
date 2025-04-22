import { Artifact, ArtifactEffectType } from "@/types/artifacts";
import { start } from "repl";

export const artifactsData: Artifact[] = [
  {
    name: "Gravity Artifact",
    description:
      "A mysterious artifact that defies the laws of physics. Improves production of all resources.",
    image: "/deepvoidgate/demo/artifacts_/gravity_artifact.png",
    stars: 0,
    class: "D",
    isLocked: true,
    amount: 0,
    expedtionTier: 1,
    effect: [
      {
        type: "production" as ArtifactEffectType,
        description: (starts: number) =>
          `Increases production of all resources by ${(starts + 1) * 10}%`,
        value: 1.1,
      },
    ],
  },
];
