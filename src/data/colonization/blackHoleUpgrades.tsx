import React from "react";
import { Atom, Battery, Maximize, TrendingUp } from "lucide-react";
import { BlackHoleUpgrades } from "@/types/blackHole";

export const blackHoleUpgrades: BlackHoleUpgrades[] = [
  {
    id: "mass_capacity",
    name: "Gravitational Amplifier",
    description: "Increases maximum black hole mass capacity",
    icon: <Maximize className="w-8 h-8 text-blue-400" />,
    level: 0,
    baseCost: 10,
    effect: "+1000 M☉ Max Mass",
    maxLevel: 1000,
  },
  {
    id: "growth_rate",
    name: "Hawking Accelerator",
    description: "Increases black hole mass growth rate",
    icon: <TrendingUp className="w-8 h-8 text-blue-400" />,
    level: 0,
    baseCost: 50,
    effect: "+15% Growth Rate",
    maxLevel: 800,
  },
  {
    id: "dark_matter_gen",
    name: "Dark Matter Synthesizer",
    description: "Generates dark matter over time",
    icon: <Atom className="w-8 h-8 text-purple-400" />,
    level: 0,
    baseCost: 5,
    effect: "+0.05 Dark Matter/s",
    maxLevel: 1500,
  },
  {
    id: "energy_capacity",
    name: "Quantum Battery",
    description: "Increases energy storage capacity",
    icon: <Battery className="w-8 h-8 text-yellow-400" />,
    level: 0,
    baseCost: 5,
    effect: "+1M Energy Cap",
    maxLevel: 2000,
  },
];
