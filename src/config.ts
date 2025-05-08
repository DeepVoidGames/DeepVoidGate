export const ResourcesIcon = ({ resource }: { resource: string }) => {
  const icons = {
    oxygen: "O₂",
    water: "💧",
    food: "🌱",
    energy: "⚡",
    metals: "⛏️",
    science: "🔬",
  };
  return icons[resource] || "?";
};

// /deepvoidgate/demo/
export const IMAGE_PATH = "/";

export const BUILDID = "406a2f32442848d16b9ce6ed4298e1c16ff3632d";
