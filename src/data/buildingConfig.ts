import { BuildingCategory, BuildingType } from "@/store/types";
import {
  Home,
  Droplets,
  Leaf,
  Zap,
  Pickaxe,
  FlaskConical,
  Users,
  Clock,
  Factory,
  Microscope,
  Building,
  Search,
  Package,
  Warehouse,
} from "lucide-react";
import React from "react";

export const buildingConfig = [
  {
    type: "oxygenGenerator" as BuildingType,
    name: "Oxygen Generator",
    category: "production" as BuildingCategory,
    icon: React.createElement(Droplets, { className: "h-5 w-5 text-cyan-400" }),
  },
  {
    type: "hydroponicFarm" as BuildingType,
    name: "Hydroponic Farm",
    category: "production" as BuildingCategory,
    icon: React.createElement(Leaf, { className: "h-5 w-5 text-green-400" }),
  },
  {
    type: "solarPanel" as BuildingType,
    name: "Solar Panel",
    category: "production" as BuildingCategory,
    icon: React.createElement(Zap, { className: "h-5 w-5 text-yellow-400" }),
  },
  {
    type: "metalMine" as BuildingType,
    name: "Metal Mine",
    category: "production" as BuildingCategory,
    icon: React.createElement(Pickaxe, { className: "h-5 w-5 text-zinc-400" }),
  },
  {
    type: "researchLab" as BuildingType,
    name: "Research Lab",
    category: "research" as BuildingCategory,
    icon: React.createElement(FlaskConical, {
      className: "h-5 w-5 text-purple-400",
    }),
  },
  {
    type: "housing" as BuildingType,
    name: "Basic House",
    category: "housing" as BuildingCategory,
    icon: React.createElement(Home, { className: "h-5 w-5 text-blue-400" }),
  },
  {
    type: "basicStorage" as BuildingType,
    name: "Basic Storage",
    category: "storage" as BuildingCategory,
    icon: React.createElement(Package, {
      className: "h-5 w-5 text-orange-400",
    }),
  },
  {
    type: "advancedStorage" as BuildingType,
    name: "Advanced Storage",
    category: "storage" as BuildingCategory,
    icon: React.createElement(Warehouse, {
      className: "h-5 w-5 text-blue-400",
    }),
  },
  {
    type: "basicBattery" as BuildingType,
    name: "Basic Battery",
    category: "storage" as BuildingCategory,
    icon: React.createElement(Zap, { className: "h-5 w-5 text-yellow-400" }),
  },
  {
    type: "advancedMetalExtractor" as BuildingType,
    name: "Advanced Metal Extractor",
    category: "production" as BuildingCategory,
    icon: React.createElement(Pickaxe, { className: "h-5 w-5 text-zinc-400" }),
  },
  {
    type: "highYieldMetalFracturer" as BuildingType,
    name: "High-Yield Metal Fracturer",
    category: "production" as BuildingCategory,
    icon: React.createElement(Pickaxe, { className: "h-5 w-5 text-zinc-400" }),
  },
  {
    type: "plasmaCoreMetalSynthesizer" as BuildingType,
    name: "Plasma Core Metal Synthesizer",
    category: "production" as BuildingCategory,
    icon: React.createElement(Pickaxe, { className: "h-5 w-5 text-zinc-400" }),
  },
  {
    type: "geothermalPlant" as BuildingType,
    name: "Geothermal Plant",
    category: "production" as BuildingCategory,
    icon: React.createElement(Zap, { className: "h-5 w-5 text-yellow-400" }),
  },
  {
    type: "fissionReactor" as BuildingType,
    name: "Fission Reactor",
    category: "production" as BuildingCategory,
    icon: React.createElement(Zap, { className: "h-5 w-5 text-yellow-400" }),
  },
  {
    type: "fusionReactor" as BuildingType,
    name: "Fusion Reactor",
    category: "production" as BuildingCategory,
    icon: React.createElement(Zap, { className: "h-5 w-5 text-yellow-400" }),
  },
];
