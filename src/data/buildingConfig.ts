import { initialBuildings } from "@/store/initialData";
import {
  BuildingCategory,
  BuildingConfig,
  BuildingType,
} from "@/types/building";
import {
  Home,
  Droplets,
  Leaf,
  Zap,
  Pickaxe,
  FlaskConical,
  Package,
  FileQuestion,
} from "lucide-react";
import React from "react";

export const BuildingIcon = (
  category,
  tag?
): React.ComponentType<{ className?: string }> => {
  const icons = {
    housing: Home,
    research: FlaskConical,
    storage: Package,
  };

  const tagIcons = {
    energy: Zap,
    food: Leaf,
    metals: Pickaxe,
    oxygen: Droplets,
  };

  return icons[category] || tagIcons[tag || ""] || FileQuestion;
};

export const buildingConfig: BuildingConfig[] = [
  ...initialBuildings.map((b) => {
    const colorMap = {
      energy: "text-yellow-400",
      food: "text-green-400",
      metals: "text-gray-400",
      oxygen: "text-blue-400",
    };

    const iconColor = colorMap[b.tag] || "text-cyan-400";

    return {
      type: b.type as BuildingType,
      name: b.name,
      category: b.category as BuildingCategory,
      icon: React.createElement(
        BuildingIcon(b.category, b.tag ? b.tag : null),
        {
          className: `h-5 w-5 ${iconColor}`,
        }
      ),
    };
  }),
];

console.log("Available Building Config", buildingConfig.length);
