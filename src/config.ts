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
export const IMAGE_PATH = "/deepvoidgate/demo/";
export const BASE_NAME = "/deepvoidgate/demo/";

// https://github.com/DeepVoidGames/DeepVoidGate/tree/${BUILDID}
export const BUILDID = "d2e57d0d003720d1a9b9f7d13054a3b3227a20f6";
// Last Build ID =
