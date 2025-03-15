export const ResourcesIcon = ({ resource }) => {
  const icons = {
    oxygen: "O₂",
    food: "🌱",
    energy: "⚡",
    metals: "⛏️",
    science: "🔬",
  };
  return icons[resource] || "?";
};
