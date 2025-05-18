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

//!
// Web build = /deepvoidgate/demo/
// Android build = /
export const IMAGE_PATH = "/deepvoidgate/demo/";
export const BASE_NAME = "/deepvoidgate/demo/";

// https://github.com/DeepVoidGames/DeepVoidGate/tree/${BUILDID}
export const BUILDID = "6d5659b8c17635f43151b4ae24c872a1e9d61cf6";
// Last Build ID = d2e57d0d003720d1a9b9f7d13054a3b3227a20f6
