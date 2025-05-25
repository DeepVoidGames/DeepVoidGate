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
export const IMAGE_PATH = "/";
export const BASE_NAME = "/deepvoidgate/demo/";

// https://github.com/DeepVoidGames/DeepVoidGate/tree/${BUILDID}
export const BUILDID = "215c0a5d44f6318ad7e7c94bbf7956650c9138a4";
// Last Build ID = 6d5659b8c17635f43151b4ae24c872a1e9d61cf6
