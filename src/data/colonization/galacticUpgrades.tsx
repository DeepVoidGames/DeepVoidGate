import React from "react";
import { Atom, Stars } from "lucide-react";

export const galacticUpgrades = [
  {
    id: "void_storage",
    name: "Void Storage",
    icon: <Stars className="h-6 w-6 text-black" />,
    description: "Increase resources storage exponentially",
    effect: "All storage +100m",
    cost: 5,
    multiplier: 0,
  },
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
    id: "quantum_travel",
    name: "Quantum time collapse",
    icon: <Atom className="h-6 w-6 text-white" />,
    description:
      "Quantum time refraction distorts time in the eye which causes time dilation relative to the observer.",
    effect: "Reduce expedition duration time by half",
    cost: 5,
    multiplier: 2,
  },
  {
    id: "quantum_disproportion",
    name: "Quantum disproportion",
    icon: <Atom className="h-6 w-6 text-blue-500" />,
    description:
      "Quantum disproportion, multiplies the resources acquired from the expedition",
    effect: "Expedtion reward x2.5",
    cost: 5,
    multiplier: 2.5,
  },
  {
    id: "quantum_time_refraction",
    name: "Quantum time refraction",
    icon: <Atom className="h-6 w-6 text-blue-200" />,
    description:
      "Quantum time refraction distorts time in the eye which causes time dilation relative to the observer.",
    effect: "Reduce resarch time by half",
    cost: 5,
    multiplier: 2,
  },
  {
    id: "quantum_cloning",
    name: "Quantum cloning",
    icon: <Atom className="h-6 w-6 text-blue-500" />,
    description:
      "Quantum cloning provides an increase in human power by cloning an object and giving it a new identity independent of the object from which it was cloned. Along with early DNA modification, it provides two independent entities. But is it ethical? Who is God?",
    effect: "Gives 2 colonists per cycle",
    cost: 5,
    multiplier: 2,
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
