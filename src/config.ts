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
export const BASE_NAME = "/";

// https://github.com/DeepVoidGames/DeepVoidGate/tree/${BUILDID}
export const BUILDID = "b0807075bd1f9e51c1d96a1366296419a7aa92ad;";
// Last Build ID = 0f307c6d1ec59211b714fb6c99ad295c53b70782
