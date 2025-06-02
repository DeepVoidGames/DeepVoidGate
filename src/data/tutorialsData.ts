import { Tutorial } from "@/types/tutorials";

export const buildingTutorials: Tutorial[] = [
  {
    id: "buildings-basics",
    name: "Building Basics",
    description: "Learn how to construct and manage buildings in your colony",
    category: "buildings",
    steps: [
      {
        id: "intro",
        title: "Welcome to Building Management",
        content:
          "Buildings are the foundation of your colony. They provide resources, house your population, and enable research. Let's learn how to manage them effectively.",
        allowNext: true,
      },
      {
        id: "building-categories",
        title: "Building Categories",
        content:
          "Buildings are organized into categories: Production (generates resources), Research (unlocks technologies), Housing (accommodates colonists), and Storage (increases capacity).",
        target: ".existing-buildings",
        position: "bottom",
        allowNext: true,
      },
      {
        id: "existing-buildings",
        title: "Your Current Buildings",
        content:
          "Here you can see all buildings you've constructed. Each building shows its level, production, and worker assignment.",
        target: ".existing-buildings",
        position: "top",
        allowNext: true,
      },
      {
        id: "worker-assignment",
        title: "Worker Management",
        content:
          "Most buildings require workers to operate. You can see your available workers in the top-right corner. Assign workers to maximize efficiency.",
        target: ".worker-counter",
        position: "left",
        allowNext: true,
      },
      {
        id: "search-buildings",
        title: "Finding Buildings",
        content:
          "Use the search bar to quickly find specific buildings by name or description.",
        target: 'input[placeholder="Search buildings..."]',
        position: "bottom",
        action: "input",
        allowNext: true,
      },
      {
        id: "upgrading",
        title: "Upgrading Buildings",
        content:
          "Upgrade buildings to increase their efficiency. Check if you have enough resources before upgrading.",
        target: ".upgrade-button",
        position: "top",
        allowNext: true,
      },
      {
        id: "construction-new",
        title: "Building Construction",
        content:
          "Scroll down to the Construction section to build new structures. Each building has different requirements and benefits.",
        target: ".construction-section",
        position: "top",
        allowNext: true,
      },
    ],
    canSkip: true,
  },
  {
    id: "production-buildings",
    name: "Production Buildings",
    description: "Master the art of resource production",
    category: "buildings",
    prerequisites: ["buildings-basics"],
    steps: [
      {
        id: "production-intro",
        title: "Resource Production",
        content:
          "Production buildings generate the resources your colony needs to survive and thrive. Let's explore the different types.",
        allowNext: true,
      },
      {
        id: "oxygen-production",
        title: "Oxygen Generation",
        content:
          "Oxygen is vital for survival. Build Oxygen Generators and Life Support Systems to keep your colonists breathing.",
        target: '[data-building-tag="oxygen"]',
        position: "right",
        allowNext: true,
      },
      {
        id: "food-production",
        title: "Food Production",
        content:
          "Colonists need food to survive. Farms and Food Processing plants will keep your population fed.",
        target: '[data-building-tag="food"]',
        position: "right",
        allowNext: true,
      },
      {
        id: "energy-production",
        title: "Power Generation",
        content:
          "Energy powers your colony's systems. Solar Arrays and Fusion Reactors provide the electricity you need.",
        target: '[data-building-tag="energy"]',
        position: "right",
        allowNext: true,
      },
      {
        id: "metal-production",
        title: "Metal Extraction",
        content:
          "Metals are used for construction and upgrades. Mining Facilities extract valuable materials from the planet.",
        target: '[data-building-tag="metals"]',
        position: "right",
        allowNext: true,
      },
      {
        id: "production-efficiency",
        title: "Maximizing Efficiency",
        content:
          "Assign more workers to increase production. Upgrade buildings to improve their base output. Balance your workforce across different resources.",
        allowNext: true,
      },
    ],
    canSkip: true,
  },
  {
    id: "worker-management",
    name: "Worker Management",
    description: "Learn to efficiently assign and manage your workforce",
    category: "buildings",
    prerequisites: ["buildings-basics"],
    steps: [
      {
        id: "worker-basics",
        title: "Understanding Workers",
        content:
          "Workers are the backbone of your colony. They operate buildings, conduct research, and maintain your settlement.",
        allowNext: true,
      },
      {
        id: "available-workers",
        title: "Available Workforce",
        content:
          "Your available workers are shown here. This number decreases as you assign workers to buildings.",
        target: ".worker-counter",
        position: "bottom",
        allowNext: true,
      },
      {
        id: "assigning-workers",
        title: "Assigning Workers",
        content:
          "Click the + (Arrow UP) and - (Arrow Down) buttons next to buildings to assign or remove workers. More workers generally mean higher production.",
        target: ".worker-controls",
        position: "top",
        allowNext: true,
      },
      {
        id: "worker-limits",
        title: "Worker Capacity",
        content:
          "Each building has a maximum worker capacity. You can't assign more workers than the building can accommodate.",
        allowNext: true,
      },
      {
        id: "housing-workers",
        title: "Housing Requirements",
        content:
          "Build Housing structures to increase your maximum population and accommodate more workers.",
        target: '[data-category="housing"]',
        position: "right",
        allowNext: true,
      },
      {
        id: "oxygen-timer",
        title: "Oxygen Emergency",
        content:
          "If oxygen runs low, this timer shows how long your colonists can survive. Prioritize oxygen production!",
        target: ".oxygen-timer",
        position: "bottom",
        allowNext: true,
      },
    ],
    canSkip: true,
  },
];

export const allTutorials: Tutorial[] = [
  ...buildingTutorials,
  // Add other tutorial categories here
];

// Helper functions
export const getTutorialById = (id: string): Tutorial | undefined => {
  return allTutorials.find((tutorial) => tutorial.id === id);
};

export const getTutorialsByCategory = (category: string): Tutorial[] => {
  return allTutorials.filter((tutorial) => tutorial.category === category);
};

export const getAvailableTutorials = (
  completedTutorials: string[]
): Tutorial[] => {
  return allTutorials.filter((tutorial) => {
    if (!tutorial.prerequisites) return true;
    return tutorial.prerequisites.every((prereq) =>
      completedTutorials.includes(prereq)
    );
  });
};
