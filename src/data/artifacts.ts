import { IMAGE_PATH } from "@/config";
import { Artifact, ArtifactEffectType } from "@/types/artifacts";

export const artifactsData: Artifact[] = [
  {
    name: "Gravity Artifact",
    description: "A mysterious artifact that defies the laws of physics. ",
    image: `${IMAGE_PATH}artifacts_/gravity_artifact.png`,
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
    image: `${IMAGE_PATH}artifacts_/quantum_cube.png`,
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
  {
    name: "Time Crystal",
    description: "A crystal that can manipulate time itself.",
    image: `${IMAGE_PATH}artifacts_/time_crystal.png`,
    stars: 0,
    class: "D",
    isLocked: true,
    amount: 0,
    expedtionTier: 3,
    effect: [
      {
        type: "expeditionTime" as ArtifactEffectType,
        description: (starts: number) =>
          `Decreases expedition base time by ${((starts + 1) / 2) * 10}%`,
        value: 0.05,
      },
    ],
  },
  {
    name: "Artifact of Diplomacy",
    description: "A crystal that can manipulate time itself.",
    image: `${IMAGE_PATH}artifacts_/artifact_of_diplomacy.png`,
    stars: 0,
    class: "E",
    isLocked: true,
    amount: 0,
    expedtionTier: 4,
    effect: [
      {
        type: "loyalty" as ArtifactEffectType,
        description: (starts: number) =>
          `Increases loyalty gain by ${((starts + 1) / 2) * 10}%`,
        value: 0.05,
      },
    ],
  },
];
