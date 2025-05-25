import { IMAGE_PATH } from "@/config";
import { Planet } from "@/types/colonization";

export const planetPool: Planet[] = [
  {
    id: "alpha-centauri",
    name: "Alpha Centauri Bb",
    image: `${IMAGE_PATH}planets/alpha-centauri.gif`,
    description: "Super-Earth with rare crystalline formations",
    traits: ["Rich Minerals", "Extreme Gravity"],
    bonusMultiplier: 1.5,
  },
  {
    id: "trappist-1e",
    name: "TRAPPIST-1e",
    image: `${IMAGE_PATH}planets/trappist-1e.gif`,
    description: "Temperate ocean world with bioluminescent life",
    traits: ["Abundant Water", "Unique Biology"],
    bonusMultiplier: 2.0,
  },
  {
    id: "kepler-438b",
    name: "Kepler-438b",
    image: `${IMAGE_PATH}planets/kepler-438b.gif`,
    description: "Earth-like planet with dense vegetation",
    traits: ["Habitable", "Advanced Flora"],
    bonusMultiplier: 1.8,
  },
  {
    id: "proxima-b",
    name: "Proxima Centauri b",
    image: `${IMAGE_PATH}planets/proxima-b.gif`,
    description: "Rocky world with exotic magnetic fields",
    traits: ["Stable Climate", "Rare Elements"],
    bonusMultiplier: 2.2,
  },
  {
    id: "luyten-b",
    name: "Luyten b",
    image: `${IMAGE_PATH}planets/luyten-b.gif`,
    description: "Volcanic planet with energy-rich atmosphere",
    traits: ["Geothermal Power", "Molten Resources"],
    bonusMultiplier: 1.7,
  },
];
