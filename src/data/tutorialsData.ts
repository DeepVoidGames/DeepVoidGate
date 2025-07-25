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
          "Each technology card shows its name, description, research costs, and prerequisites. Green cards are already researched, while others are available or locked. Card with purple colors are a technologie obtaining from expeditions.",
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

export const artifactsTutorials: Tutorial[] = [
  {
    id: "artifacts-basics",
    name: "Ancient Relics System",
    description:
      "Learn how to manage and upgrade ancient artifacts to enhance your colony's capabilities and unlock powerful bonuses",
    category: "artifacts",
    steps: [
      {
        id: "intro",
        title: "Welcome to Ancient Relics",
        content:
          "Ancient artifacts are powerful relics discovered during expeditions that provide permanent bonuses to your colony. These mysterious objects can be upgraded through a star system, with each upgrade tier providing enhanced effects. Collecting and upgrading artifacts is key to advancing your civilization.",
        allowNext: true,
      },
      {
        id: "artifacts-archive",
        title: "Ancient Relics Archive",
        content:
          "This is your artifact collection hub where you can view all discovered relics, check their current upgrade levels, and manage your collection. Each artifact tells a story of ancient civilizations and holds tremendous power.",
        position: "bottom",
        allowNext: true,
      },
      {
        id: "artifact-cards",
        title: "Artifact Information Cards",
        content:
          "Each artifact is displayed as a detailed card showing its name, star rating, description, visual representation, and current effects. These cards contain all the information you need to understand each relic's power and potential.",
        target: ".artifact-cards",
        position: "right",
        allowNext: true,
      },
      {
        id: "star-system",
        title: "Star Rating System",
        content:
          "Artifacts use a 5-star upgrade system. Each star represents a tier of power, with higher tiers providing significantly stronger effects. You can see the current star level next to each artifact's name, displayed as golden stars.",
        target: ".flex.gap-1",
        position: "right",
        allowNext: true,
      },
      {
        id: "artifact-copies",
        title: "Artifact Collection Counter",
        content:
          "The number badge shows how many copies of each artifact you currently possess. You'll need multiple copies of the same artifact to upgrade it to higher star levels. Collect duplicates through expeditions and other exploration activities.",
        target: ".flex.items-center.gap-1.px-2.py-1",
        position: "left",
        allowNext: true,
      },
      {
        id: "artifact-effects",
        title: "Artifact Effects and Bonuses",
        content:
          "Each artifact provides specific bonuses to your colony, such as increased resource production, enhanced research speed, or improved expedition success rates. The effects scale with the artifact's star level, becoming more powerful with each upgrade.",
        target: ".space-y-1:has(.flex.items-start.gap-1)",
        position: "bottom",
        allowNext: true,
      },
      {
        id: "upgrade-requirements",
        title: "Upgrade Requirements",
        content:
          "To upgrade an artifact, you need a specific number of copies: 2 copies for 1→2 stars, 4 copies for 2→3 stars, 8 copies for 3→4 stars, and 16 copies for 4→5 stars. The progress bar shows how close you are to the next upgrade.",
        target:
          ".space-y-1.sm\\:space-y-2:has(.flex.justify-between.items-center)",
        position: "right",
        allowNext: true,
      },
      {
        id: "upgrade-process",
        title: "Upgrading Artifacts",
        content:
          "When you have enough copies, click the Upgrade button to increase the artifact's star level. Upgrading consumes the required copies but permanently enhances the artifact's effects. The upgrade button shows the required number of copies needed.",
        target: ".w-full.h-10",
        position: "bottom",
        allowNext: true,
      },
      {
        id: "locked-artifacts",
        title: "Locked Artifacts",
        content:
          "Some artifacts appear locked and grayed out until you meet specific requirements, such as completing certain expeditions or reaching particular milestones. Locked artifacts show a lock icon and cannot be upgraded until unlocked.",
        allowNext: true,
      },
      {
        id: "max-level-artifacts",
        title: "Maximum Level Artifacts",
        content:
          "Artifacts at 5 stars have reached their maximum power level and cannot be upgraded further. These artifacts display 'MAX' instead of upgrade requirements and provide the strongest possible bonuses to your colony.",
        allowNext: true,
      },
    ],
    canSkip: true,
  },
];

export const factionsTutorials: Tutorial[] = [
  {
    id: "factions-basics",
    name: "Galactic Factions System",
    description:
      "Learn how to manage relationships with galactic factions, build loyalty, manage hostility, and unlock powerful faction bonuses",
    category: "diplomacy",
    steps: [
      {
        id: "intro",
        title: "Welcome to Galactic Diplomacy",
        content:
          "The galaxy is filled with powerful factions, each with their own agendas, technologies, and resources. Building relationships with these factions through loyalty while managing hostility is crucial for your colony's survival and growth. Each faction offers unique bonuses that can dramatically enhance your capabilities.",
        allowNext: true,
      },
      {
        id: "factions-overview",
        title: "Galactic Factions Hub",
        content:
          "This is your diplomatic command center where you can monitor relationships with all known galactic factions. Here you'll track loyalty levels, hostility ratings, available bonuses, and upcoming faction events that may affect your relations.",
        position: "bottom",
        allowNext: true,
      },
      {
        id: "faction-cards",
        title: "Faction Information Cards",
        content:
          "Each faction is represented by a detailed card showing their emblem, name, description, and current relationship status. These cards provide all the essential information you need to understand each faction's role in the galaxy and your standing with them.",
        target: ".grid.grid-cols-1.md\\:grid-cols-3",
        position: "top",
        allowNext: true,
      },
      {
        id: "faction-identity",
        title: "Faction Identity and Lore",
        content:
          "Each faction has a unique emblem, name. Understanding their motivations and goals will help you make better diplomatic decisions and predict their reactions to your actions.",
        target: ".relative.w-12.h-12",
        position: "right",
        allowNext: true,
      },
      {
        id: "loyalty-system",
        title: "Loyalty Levels",
        content:
          "Loyalty represents how much each faction trusts and supports your colony. Higher loyalty levels unlock more powerful bonuses and better diplomatic relations. You can increase loyalty through successful expeditions.",
        target: ".loyalty-system",
        position: "bottom",
        allowNext: true,
      },
      {
        id: "hostility-system",
        title: "Hostility Management",
        content:
          "Hostility measures how antagonistic each faction feels toward your colony. High hostility can lead to attacks, trade restrictions, and blocked access to faction bonuses. Monitor hostility levels carefully and take diplomatic actions to reduce tensions when necessary.",
        target: ".hostility-system",
        position: "bottom",
        allowNext: true,
      },
      {
        id: "faction-bonuses",
        title: "Faction Bonuses and Rewards",
        content:
          "Each faction offers unique bonuses that activate when you reach specific loyalty thresholds. These bonuses can enhance resource production, improve expedition success rates, unlock new technologies, or provide other strategic advantages. The higher your loyalty, the more bonuses become available.",
        target: ".faction-bonuses",
        position: "right",
        allowNext: true,
      },

      {
        id: "faction-events",
        title: "Faction Events",
        content:
          "Special faction events occur periodically that can dramatically impact your relationships. These events may offer opportunities to gain loyalty, present challenges that could increase hostility, or provide unique rewards. The timer shows when the next event will occur.",
        target: ".text-xs.text-gray-400.gap-1",
        position: "right",
        allowNext: true,
      },
    ],
    canSkip: true,
  },
];

export const colonizationTutorials: Tutorial[] = [
  {
    id: "colonization-basics",
    name: "Galactic Expansion System",
    description:
      "Learn how to maximize your colony, unlock new planetary systems, and establish galactic colonies to gain permanent bonuses and Galactic Knowledge",
    category: "expansion",
    steps: [
      {
        id: "intro",
        title: "Welcome to Galactic Expansion",
        content:
          "Once your colony reaches its full potential, you can expand beyond your home planet to colonize new worlds across the galaxy. This process, known as Prestige, allows you to start fresh on a new planet while retaining powerful permanent bonuses and gaining Galactic Knowledge that enhances all future colonies.",
        allowNext: true,
      },
      {
        id: "expansion-hub",
        title: "Galactic Expansion Hub",
        content:
          "This is your command center for interstellar expansion. Here you can monitor your current colony's progress toward maximum development, track your Galactic Knowledge reserves, and manage the colonization of new worlds when you're ready to expand.",
        target: ".glass-panel.max-w-7xl",
        position: "bottom",
        allowNext: true,
      },
      {
        id: "galactic-knowledge",
        title: "Galactic Knowledge Currency",
        content:
          "Galactic Knowledge is a precious resource earned through colonization that persists across all your colonies. This knowledge can be spent on permanent upgrades that benefit every current and future colony, making each new settlement more powerful than the last.",
        target: ".flex.items-center.gap-2.px-4.py-2",
        position: "bottom",
        allowNext: true,
      },
      {
        id: "colony-counter",
        title: "Colony Count Tracking",
        content:
          "Your colony count shows how many worlds you've successfully colonized. Each new colony you establish increases your total count.",
        target: ".text-xs.text-muted-foreground.mb-4",
        position: "bottom",
        allowNext: true,
      },
      {
        id: "progress-tracking",
        title: "Colony Progress Monitoring",
        content:
          "The progress bar shows how close your current colony is to maximum development. To unlock new colonization opportunities, you must fully maximize your current colony by upgrading all buildings to their highest tiers with maximum upgrades and maxium worker assignments.",
        target: ".space-y-4:has(.flex.items-center.justify-between.text-sm)",
        position: "top",
        allowNext: true,
      },
      {
        id: "colony-completed",
        title: "Colony Maximization Achievement",
        content:
          "When your colony reaches maximum development, you'll see this success indicator. This unlocks your ability to choose from available planets for your next colonization venture, marking a major milestone in your galactic expansion journey.",
        target: ".bg-green-900\\/20.border.border-green-800",
        position: "bottom",
        allowNext: true,
      },
      {
        id: "planet-selection",
        title: "Planetary Selection System",
        content:
          "When ready to colonize, you'll be presented with a selection of available planets. Each planet offers different characteristics, bonus multipliers, and Galactic Knowledge rewards. Choose carefully, as each planet will provide different advantages for your expanding empire.",
        target: "",
        position: "top",
        allowNext: true,
      },
      {
        id: "planet-information",
        title: "Planet Details and Characteristics",
        content:
          "Each planet card shows detailed information including its appearance, name, Galactic Knowledge reward, resource bonus multiplier, description, and unique traits. These factors will influence how your new colony develops and what advantages it provides.",
        target: ".group.p-4.rounded-lg.border",
        position: "right",
        allowNext: true,
      },
      {
        id: "galactic-knowledge-rewards",
        title: "Galactic Knowledge Calculation",
        content:
          "The Galactic Knowledge reward shown for each planet increases based on your total colony count. The more colonies you've established, the more knowledge you'll gain from each new colonization, creating a powerful progression system.",
        position: "bottom",
        allowNext: true,
      },
      {
        id: "planet-traits",
        title: "Unique Planet Traits",
        content:
          "Every planet has unique traits that provide special characteristics or bonuses. These traits can affect everything from resource production to building efficiency, making each colonization choice strategically important for your long-term goals.",
        target: ".flex.flex-wrap.gap-2",
        position: "top",
        allowNext: true,
      },
      {
        id: "colonization-process",
        title: "The Colonization Process",
        content:
          "Once you've selected your target planet, use the colonization button to begin the process. This will reset your current colony but transfer you to the new world with all your Galactic Knowledge intact and permanent bonuses active.",
        target: ".w-full.py-3.rounded-lg",
        position: "top",
        allowNext: true,
      },
      {
        id: "galactic-upgrades",
        title: "Galactic Upgrades",
        content:
          "Your Galactic Knowledge can be spent on permanent upgrades that benefit. These upgrades persist through colonization, creating a progression system that rewards expansion.",
        target: ".galactic-upgrades",
        allowNext: true,
      },
    ],
    canSkip: true,
  },
];

export const blackHoleTutorials: Tutorial[] = [
  {
    id: "black-hole-basics",
    name: "Black Hole Management System",
    description:
      "Master the art of black hole manipulation to harness unlimited energy while managing catastrophic risks. Learn to balance mass growth, energy production, and dark matter conversion.",
    category: "advanced",
    steps: [
      {
        id: "intro",
        title: "Welcome to Black Hole Physics",
        content:
          "You've unlocked one of the universe's most powerful phenomena - your very own black hole, Sagittarius A*-2. This cosmic engine can provide unlimited energy for your colony, but mismanagement could lead to catastrophic consequences. Understanding its behavior is crucial for your civilization's survival and advancement.",
        allowNext: true,
      },
      {
        id: "black-hole-header",
        title: "Black Hole Identification",
        content:
          "This is your black hole control panel header, showing the designation 'Sagittarius A*-2' - your artificially created stellar mass black hole. The visualization toggle allows you to switch between basic and advanced physics data depending on your expertise level.",
        position: "bottom",
        allowNext: true,
      },
      {
        id: "visualization",
        title: "Black Hole Visualization",
        content:
          "The central visualization shows your black hole in action. This animated representation helps you monitor its current state and activity. Below it, you can see the black hole's age in millions of years, tracking how long this cosmic phenomenon has existed under your control.",
        target: ".flex.justify-center.mb-6",
        position: "bottom",
        allowNext: true,
      },
      {
        id: "threat-level",
        title: "Critical Threat Assessment",
        content:
          "This is your most important monitoring system. The threat level indicates how close your black hole is to critical mass. Green means safe, yellow requires caution, and red demands immediate action. When threat levels are high, you must convert mass to dark matter to prevent catastrophic energy outbreaks.",
        target: ".p-4.rounded-lg.border-2",
        position: "top",
        allowNext: true,
      },
      {
        id: "mass-tracking",
        title: "Mass Monitoring",
        content:
          "Black hole mass is measured in solar masses (M☉). This panel shows your current mass and growth rate per second. As mass increases, so does energy output, but also the risk of reaching critical mass. Monitor this carefully to maintain optimal balance.",
        target: ".grid.grid-cols-1.md\\:grid-cols-2.gap-4 > div:first-child",
        position: "right",
        allowNext: true,
      },
      {
        id: "dark-matter",
        title: "Dark Matter Production",
        content:
          "Dark matter is a valuable resource produced by your black hole and used for advanced technologies. The amount shown here represents your current dark matter reserves, which can be increased by converting excess black hole mass when threat levels become dangerous.",
        target: ".grid.grid-cols-1.md\\:grid-cols-2.gap-4 > div:nth-child(2)",
        position: "left",
        allowNext: true,
      },
      {
        id: "energy-output",
        title: "Energy Generation System",
        content:
          "Your black hole generates massive amounts of energy per second, shown here along with total cumulative energy produced and emitted energy. This energy powers your entire colony's advanced systems and can support unlimited growth when properly managed.",
        target: ".grid.grid-cols-1.md\\:grid-cols-2.gap-4 > div:nth-child(3)",
        position: "right",
        allowNext: true,
      },
      {
        id: "age-tracking",
        title: "Cosmic Age Measurement",
        content:
          "Track how long your black hole has existed in millions of years. Older black holes may have different characteristics and behavior patterns. Age affects various physics calculations and can influence optimal management strategies.",
        target: ".grid.grid-cols-1.md\\:grid-cols-2.gap-4 > div:nth-child(4)",
        position: "left",
        allowNext: true,
      },
      {
        id: "advanced-stats",
        title: "Advanced Physics Panel",
        content:
          "Toggle this view to access detailed physics data including Schwarzschild radius, Hawking temperature, estimated lifetime, growth multipliers, and critical mass thresholds. This information is essential for expert-level black hole management and optimization.",
        target: ".advanced-stats",
        position: "left",
        allowNext: true,
      },
      {
        id: "schwarzschild-radius",
        title: "Event Horizon Size",
        content:
          "The Schwarzschild radius defines your black hole's event horizon - the point of no return. This measurement in kilometers helps you understand the physical scale of your cosmic phenomenon and its gravitational influence zone.",
        target: ".grid.grid-cols-1.md\\:grid-cols-3.gap-4 > div:first-child",
        position: "bottom",
        allowNext: true,
      },
      {
        id: "hawking-temperature",
        title: "Quantum Temperature",
        content:
          "Hawking temperature represents the theoretical temperature of radiation emitted by your black hole due to quantum effects. Smaller black holes have higher temperatures, affecting energy output and evaporation rates in advanced physics calculations.",
        target: ".grid.grid-cols-1.md\\:grid-cols-3.gap-4 > div:nth-child(2)",
        position: "bottom",
        allowNext: true,
      },
      {
        id: "estimated-lifetime",
        title: "Cosmic Longevity",
        content:
          "This shows the estimated lifespan of your black hole in years. While this number may seem impossibly large, it represents the theoretical time until complete evaporation through Hawking radiation, assuming no additional mass input.",
        target: ".grid.grid-cols-1.md\\:grid-cols-3.gap-4 > div:nth-child(3)",
        position: "bottom",
        allowNext: true,
      },
      {
        id: "mass-conversion",
        title: "Emergency Mass Conversion",
        content:
          "When your threat level reaches dangerous levels (above 10%), use this button to convert excess black hole mass into dark matter. This critical safety mechanism prevents catastrophic energy outbreaks while providing valuable resources for your colony.",
        target: ".flex.flex-col.sm\\:flex-row.gap-3 > button:first-child",
        position: "right",
        allowNext: true,
      },
      {
        id: "stabilization",
        title: "Advanced Stabilization (Future Technology)",
        content:
          "This future technology will allow direct black hole stabilization without mass conversion. Currently undiscovered, this represents an advanced research goal that could revolutionize black hole management and safety protocols.",
        target: ".flex.flex-col.sm\\:flex-row.gap-3 > button:nth-child(2)",
        position: "top",
        allowNext: true,
      },
      {
        id: "critical-warning",
        title: "Crisis Management Protocol",
        content:
          "When threat levels exceed 70%, this critical warning system activates. The pulsing red alert indicates immediate danger of energy outbreak. You must act quickly to convert mass to dark matter or risk losing your infinite energy source and potentially your entire colony.",
        target: ".p-4.rounded-lg.bg-red-900\\/20.border-2.border-red-800",
        position: "top",
        allowNext: true,
      },
      {
        id: "upgrades-system",
        title: "Black Hole Enhancement System",
        content:
          "Access specialized black hole upgrades to improve efficiency, safety, and output. These upgrades can enhance mass growth rates, improve energy conversion efficiency, increase dark matter production, and provide better control mechanisms for optimal black hole management.",
        target: ".upgrades-system",
        position: "bottom",
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
  ...artifactsTutorials,
  ...factionsTutorials,
  ...colonizationTutorials,
  ...blackHoleTutorials,
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
