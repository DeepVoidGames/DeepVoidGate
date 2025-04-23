import { Artifact, ArtifactEffectType } from "@/types/artifacts";
import { start } from "repl";

export const artifactsData: Artifact[] = [
  {
    name: "Gravity Artifact",
    description: "A mysterious artifact that defies the laws of physics. ",
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
  {
    name: "Quantum Cube",
    description: "A cube that exists in multiple dimensions at once.",
    image: "/deepvoidgate/demo/artifacts_/quantum_cube.png",
    stars: 0,
    class: "D",
    isLocked: true,
    amount: 0,
    expedtionTier: 2,
    effect: [
      {
        type: "capacity" as ArtifactEffectType,
        description: (starts: number) =>
          `Increases storage capacity of all resources by ${
            (starts + 1) * 10
          }%`,
        value: 0.1,
      },
    ],
  },
];
