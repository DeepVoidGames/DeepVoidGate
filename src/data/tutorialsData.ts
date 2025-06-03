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

export const technologyTutorials: Tutorial[] = [
  {
    id: "technologies-basics",
    name: "Technology Research",
    description:
      "Learn how to research technologies and advance your colony's capabilities",
    category: "research",
    steps: [
      {
        id: "intro",
        title: "Welcome to Technology Research",
        content:
          "Technology research is crucial for advancing your colony. New technologies unlock better buildings, improved efficiency, and advanced capabilities. Let's explore how the research system works.",
        allowNext: true,
      },
      {
        id: "tech-categories",
        title: "Technology Categories",
        content:
          "Technologies are organized into five categories: Infrastructure (storage and more), Energy (power systems), Production (resource generation), Research (scientific advancement), and Advanced (more features).",
        target: ".tech-categories",
        position: "bottom",
        allowNext: true,
      },
      {
        id: "search-technologies",
        title: "Finding Technologies",
        content:
          "Use the search bar to quickly find specific technologies by name or description. This is helpful when looking for particular upgrades.",
        target: ".search-technologies",
        position: "bottom",
        action: "input",
        allowNext: true,
      },
      {
        id: "tech-cards",
        title: "Technology Cards",
        content:
          "Each technology card shows its name, description, research costs, and prerequisites. Green cards are already researched, while others are available or locked.",
        target: ".tech-cards",
        position: "top",
        allowNext: true,
      },
      {
        id: "research-costs",
        title: "Research Requirements",
        content:
          "Before researching a technology, check its resource costs. You need sufficient resources to start research. Red numbers indicate insufficient resources.",
        target: ".research-costs",
        position: "top",
        allowNext: true,
      },
      {
        id: "prerequisites",
        title: "Technology Prerequisites",
        content:
          "Some technologies require others to be researched first. Look for the lock icon and 'Requires:' text to see what you need to unlock first.",
        position: "top",
        allowNext: true,
      },
      {
        id: "starting-research",
        title: "Starting Research",
        content:
          "Click 'Start Research' on any available technology to begin. Only one technology can be researched at a time, so choose wisely based on your colony's needs.",
        position: "top",
        action: "click",
        allowNext: true,
      },
      {
        id: "research-progress",
        title: "Tracking Progress",
        content:
          "Once research begins, you'll see a progress bar and remaining time. Research continues automatically - no need to babysit the process.",
        position: "top",
        allowNext: true,
      },
      {
        id: "completed-research",
        title: "Completed Technologies",
        content:
          "Researched technologies are marked with a green background and checkmark. Use the show/hide toggle to manage your view of completed research.",
        position: "left",
        allowNext: true,
      },
      {
        id: "research-strategy",
        title: "Research Strategy Tips",
        content:
          "Focus on technologies that support your colony's immediate needs. Infrastructure and Energy techs are often good early choices, while Advanced techs provide powerful late-game benefits.",
        allowNext: true,
      },
    ],
    canSkip: true,
  },
];

export const milestoneTutorials: Tutorial[] = [
  {
    id: "milestones-basics",
    name: "Milestones System",
    description:
      "Learn how to track your colony's progress and unlock achievements through the milestones system",
    category: "progress",
    steps: [
      {
        id: "intro",
        title: "Welcome to Milestones",
        content:
          "Milestones are achievements that track your colony's progress across different areas. They provide goals to work towards and often unlock rewards or new content. Let's explore how the milestone system works.",
        allowNext: true,
      },
      {
        id: "milestone-overview",
        title: "Progress Overview",
        content:
          "The header shows your overall milestone completion rate and progress bar. This gives you a quick view of how many achievements you've unlocked out of the total available.",
        target: ".milestone-overview",
        position: "bottom",
        allowNext: true,
      },
      {
        id: "search-milestones",
        title: "Finding Milestones",
        content:
          "Use the search bar to quickly find specific milestones by name or description. This is helpful when looking for particular achievements or tracking specific goals.",
        target: ".search-milestones",
        position: "bottom",
        action: "input",
        allowNext: true,
      },
      {
        id: "milestone-categories",
        title: "Milestone Categories",
        content:
          "Milestones are organized into six categories: Resources (production goals), Buildings (construction achievements), Population (colony growth), Technology (research progress), Expeditions (exploration goals), and Artifacts (discovery rewards).",
        target: ".milestone-categories",
        position: "bottom",
        allowNext: true,
      },
      {
        id: "milestone-cards",
        title: "Individual Milestones",
        content:
          "Each milestone card shows its name, description, and current progress. Green cards with gold medals are completed achievements, while others show your progress towards completion.",
        target: ".milestone-cards",
        position: "top",
        allowNext: true,
      },
      {
        id: "progress-tracking",
        title: "Progress Indicators",
        content:
          "Active milestones show a progress bar and percentage completion. The progress updates automatically as you play, so you can see how close you are to unlocking each achievement.",
        target: ".progress-tracking",
        position: "top",
        allowNext: true,
      },
      {
        id: "tiered-milestones",
        title: "Tiered Achievement Groups",
        content:
          "Some milestones come in tiers (I, II, III, etc.) representing increasing difficulty levels. The card shows overall progress through all tiers, with the current active goal highlighted.",
        target: ".tiered-milestones",
        position: "top",
        allowNext: true,
      },
      {
        id: "tier-progress",
        title: "Tier Visualization",
        content:
          "The colored bars at the bottom of tiered milestone cards show your progress: green for completed tiers, blue for the current active tier, and gray for future tiers.",
        target: ".tier-progress",
        position: "bottom",
        allowNext: true,
      },
      {
        id: "milestone-strategy",
        title: "Achievement Strategy",
        content:
          "Milestones provide natural goals to guide your colony development. Focus on categories that align with your current priorities - early game might emphasize Resources and Buildings, while late game might focus on Technology and Artifacts.",
        allowNext: true,
      },
    ],
    canSkip: true,
  },
];

export const hubTutorials: Tutorial[] = [
  {
    id: "hub-basics",
    name: "Hub Navigation",
    description:
      "Learn how to navigate the Hub and access different game features as they become available",
    category: "navigation",
    steps: [
      {
        id: "intro",
        title: "Welcome to the Hub",
        content:
          "The Hub is your central command center where you can access all major game features. Different sections unlock as you progress through research and galactic upgrades. Let's explore what's available to you.",
        allowNext: true,
      },
      {
        id: "hub-overview",
        title: "Hub Layout",
        content:
          "The Hub displays available features as interactive cards in a grid layout. Each card represents a different game system you can access, from expeditions to faction management.",
        target: ".hub-grid",
        position: "top",
        allowNext: true,
      },
      {
        id: "feature-cards",
        title: "Feature Cards",
        content:
          "Each feature card shows a preview image, name, and sometimes a description. Click on any unlocked card to access that game system. The visual design helps you quickly identify different areas.",
        target: ".feature-card",
        position: "bottom",
        allowNext: true,
      },
      {
        id: "unlocked-features",
        title: "Available Features",
        content:
          "Unlocked features appear bright and clear with hover effects. These are systems you can currently access. Click on any unlocked card to enter that feature area.",
        target: ".feature-card",
        position: "bottom",
        allowNext: true,
      },
      {
        id: "locked-features",
        title: "Locked Content",
        content:
          "Locked features appear blurred with a lock icon overlay. These systems become available as you research specific technologies or achieve galactic upgrades. The lock indicates content you'll unlock later.",
        target: ".locked-feature",
        position: "bottom",
        allowNext: true,
      },
      {
        id: "navigation-strategy",
        title: "Hub Strategy",
        content:
          "Use the Hub as your planning center. Check regularly for newly unlocked features as you progress. Early game focuses on basic systems like Factions and Colonization, while advanced features require significant technological progress.",
        allowNext: true,
      },
    ],
    canSkip: true,
  },
];

export const expeditionTutorials: Tutorial[] = [
  {
    id: "expedition-basics",
    name: "Expedition System",
    description:
      "Learn how to launch expeditions to explore new frontiers, gather resources, and discover technologies for your colony",
    category: "exploration",
    steps: [
      {
        id: "intro",
        title: "Welcome to Expeditions",
        content:
          "Expeditions allow you to send crew members on dangerous missions to explore unknown territories, gather resources, artifacts and discover new technologies. These missions require careful planning and resource management, but offer valuable rewards for your colony's growth.",
        allowNext: true,
      },
      {
        id: "expedition-overview",
        title: "Expedition Management Hub",
        content:
          "This is your expedition command center where you can plan new missions and monitor active ones.",
        target: ".expedition-header",
        position: "bottom",
        allowNext: true,
      },
      {
        id: "expedition-types",
        title: "Mission Types",
        content:
          "There are different types of expeditions available: Scientific expeditions focus on discovering new technologies while Mining expeditions focus on rare artifacts. Each type offers unique rewards and challenges.",
        target: ".expedition-types",
        position: "right",
        allowNext: true,
      },
      {
        id: "expedition-tiers",
        title: "Mission Difficulty Tiers",
        content:
          "Expeditions come in different difficulty tiers. Higher tiers require more crew members but offer better rewards and longer durations. Choose your tier based on your available population and desired risk level.",
        target: ".expedition-tiers",
        position: "left",
        allowNext: true,
      },
      {
        id: "mission-summary",
        title: "Mission Planning",
        content:
          "The mission summary shows all details about your planned expedition: duration, crew requirements, expected rewards. Review this information carefully before launching.",
        target: ".mission-summary",
        position: "bottom",
        allowNext: true,
      },
      {
        id: "crew-requirements",
        title: "Crew Management",
        content:
          "Each expedition requires a specific number of crew members based on the tier selected. Make sure you have enough available population before launching a mission. Crew members will be unavailable for other tasks during the expedition.",
        target: ".crew-requirements",
        position: "bottom",
        allowNext: true,
      },
      {
        id: "active-missions",
        title: "Monitoring Active Expeditions",
        content:
          "The Active Missions panel shows all your ongoing expeditions. Each card displays the mission type, progress, remaining time, and current status. You can track multiple expeditions simultaneously.",
        target: ".active-missions",
        position: "top",
        allowNext: true,
      },
      {
        id: "expedition-progress",
        title: "Mission Progress Tracking",
        content:
          "Each active expedition shows a progress bar and countdown timer. The mission will automatically complete when the timer reaches zero, and you'll receive your rewards based on the expedition's success.",
        target: ".expedition-progress",
        position: "bottom",
        allowNext: true,
      },
      {
        id: "expedition-events",
        title: "Random Events",
        content:
          "During expeditions, random events may occur that can affect the outcome. These events can provide bonus rewards, present challenges, or offer choices that impact your mission's success rate.",
        target: ".expedition-events",
        position: "top",
        allowNext: true,
      },
      {
        id: "mission-completion",
        title: "Completing Expeditions",
        content:
          "When an expedition completes, you'll receive rewards such as resources, technologies, or artifacts. Successful missions return all crew members safely, while failed missions may result in casualties.",
        target: ".mission-completion",
        position: "top",
        allowNext: true,
      },
      {
        id: "expedition-strategy",
        title: "Strategic Planning",
        content:
          "Plan your expeditions based on your colony's needs: launch Scientific expeditions when you need new technologies, and Mining expeditions when you need artifacts. Balance risk and reward by choosing appropriate tiers, and always ensure you have backup population for essential colony functions.",
        allowNext: true,
      },
      {
        id: "advanced-tips",
        title: "Advanced Expedition Tips",
        content:
          "Keep multiple expeditions running to maximize efficiency. Higher-tier expeditions have better reward-to-time ratios but require more crew. Monitor your population carefully - don't send all your people on expeditions and leave your colony understaffed!",
        allowNext: true,
      },
    ],
    canSkip: true,
  },
];

export const allTutorials: Tutorial[] = [
  ...buildingTutorials,
  ...technologyTutorials,
  ...milestoneTutorials,
  ...hubTutorials,
  ...expeditionTutorials,
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
