import React from "react";
import { Atom, Stars } from "lucide-react";

export const galacticUpgrades = [
  {
    id: "quantum_production",
    name: "Quantum Production",
    icon: <Atom className="h-6 w-6 text-purple-400" />,
    description: "Enhance matter replication at quantum level",
    effect: "All production ×1.8",
    cost: 10,
    multiplier: 1.8,
  },
  {
    id: "black_hole_unknow",
    name: "Black Hole",
    icon: <Stars className="h-6 w-6 text-yellow-400" />,
    description: "Unlock the mysteries of black holes, harness their power",
    effect: "???Unlock black hole???",
    cost: 20,
    multiplier: 0,
  },
];
