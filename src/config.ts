export const ResourcesIcon = ({ resource }) => {
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
