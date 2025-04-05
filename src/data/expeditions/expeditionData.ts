import { ExpeditionConfig } from "./expeditionTypes";

export const expeditionTypes: ExpeditionConfig[] = [
  {
    type: "planetary",
    name: "Planetary Expeditions",
    icon: "Globe",
    description: "Explore and utilize resources from your home planet.",
    baseStats: {
      duration: 300, // 5 minutes
      successChance: 90,
      baseRewardMultiplier: 1.0,
    },
    missions: [
      {
        type: "resource",
        name: "Resource Gathering",
        icon: "Gem",
        description: "Search for rare metals, crystals, and water sources.",
        imageUrl: "/images/expeditions/resource-gathering.jpg",
        requirements: {
          resources: { energy: 100, water: 50 },
          personnel: 3,
        },
        rewards: {
          guaranteed: { metals: 50 },
          random: [
            { resource: "metals", min: 20, max: 100, chance: 80 },
            { resource: "water", min: 10, max: 50, chance: 60 },
            { resource: "energy", min: 5, max: 30, chance: 40 },
          ],
        },
        eventChance: 60,
        eventPool: [
          "resource_vein",
          "cave_in",
          "weather_storm",
          "ancient_ruins",
        ],
      },
      {
        type: "research",
        name: "Anomaly Research",
        icon: "AlertTriangle",
        description:
          "Investigate strange phenomena and gather scientific data.",
        imageUrl: "/images/expeditions/anomaly-research.jpg",
        requirements: {
          resources: { energy: 150, metals: 50 },
          personnel: 5,
          technology: ["basic_sensors"],
        },
        rewards: {
          guaranteed: { science: 100 },
          random: [
            { resource: "science", min: 50, max: 200, chance: 90 },
            { resource: "metals", min: 10, max: 40, chance: 30 },
          ],
          rareTechnology: [
            { id: "alien_materials", chance: 5 },
            { id: "advanced_alloys", chance: 10 },
          ],
        },
        eventChance: 80,
        eventPool: [
          "strange_readings",
          "abandoned_lab",
          "hostile_wildlife",
          "energy_anomaly",
        ],
      },
      {
        type: "combat",
        name: "Colony Defense",
        icon: "Shield",
        description: "Protect your colony from natural and biological threats.",
        imageUrl: "/images/expeditions/colony-defense.jpg",
        requirements: {
          resources: { energy: 200, metals: 100 },
          personnel: 8,
          equipment: { defense_drones: 2 },
        },
        rewards: {
          guaranteed: { metals: 30, energy: 20 },
          random: [
            { resource: "metals", min: 20, max: 80, chance: 70 },
            { resource: "energy", min: 10, max: 50, chance: 50 },
          ],
          equipment: [
            { id: "advanced_weapon", chance: 15 },
            { id: "defense_shield", chance: 10 },
          ],
        },
        eventChance: 90,
        eventPool: [
          "predator_attack",
          "territorial_dispute",
          "natural_disaster",
          "security_breach",
        ],
      },
    ],
  },
  {
    type: "cosmic",
    name: "Cosmic Expeditions",
    icon: "Rocket",
    description: "Explore cosmic anomalies and distant celestial bodies.",
    unlockRequirement: {
      technology: "space_travel",
      milestoneId: "first_satellite",
    },
    baseStats: {
      duration: 1800, // 30 minutes
      successChance: 75,
      baseRewardMultiplier: 2.5,
    },
    missions: [
      {
        type: "resource",
        name: "Asteroid Mining",
        icon: "Gem",
        description: "Extract valuable resources from nearby asteroids.",
        imageUrl: "/images/expeditions/asteroid-mining.jpg",
        requirements: {
          resources: { energy: 500, metals: 100 },
          personnel: 10,
          equipment: { mining_drones: 3 },
        },
        rewards: {
          guaranteed: { metals: 200 },
          random: [
            { resource: "metals", min: 100, max: 500, chance: 90 },
            { resource: "energy", min: 50, max: 200, chance: 40 },
            { resource: "water", min: 20, max: 100, chance: 30 },
          ],
          rareTechnology: [{ id: "asteroid_composition", chance: 20 }],
        },
        eventChance: 70,
        eventPool: [
          "dense_asteroid_field",
          "space_debris",
          "asteroid_collision",
          "hidden_ore_vein",
        ],
      },
      {
        type: "research",
        name: "Alien Artifacts",
        icon: "Zap",
        description:
          "Search for and study remnants of ancient alien civilizations.",
        imageUrl: "/images/expeditions/alien-artifacts.jpg",
        requirements: {
          resources: { energy: 700, metals: 150 },
          personnel: 15,
          technology: ["advanced_sensors", "xenobiology"],
        },
        rewards: {
          guaranteed: { science: 300 },
          random: [
            { resource: "science", min: 200, max: 800, chance: 95 },
            { resource: "energy", min: 50, max: 150, chance: 40 },
          ],
          rareTechnology: [
            { id: "alien_technology", chance: 15 },
            { id: "advanced_propulsion", chance: 10 },
            { id: "quantum_physics", chance: 5 },
          ],
        },
        eventChance: 85,
        eventPool: [
          "alien_signal",
          "derelict_ship",
          "dimensional_rift",
          "ancient_technology",
        ],
      },
      {
        type: "combat",
        name: "Pirate Defense",
        icon: "Skull",
        description:
          "Protect your space assets from rival factions and pirates.",
        imageUrl: "/images/expeditions/pirate-defense.jpg",
        requirements: {
          resources: { energy: 1000, metals: 200 },
          personnel: 20,
          equipment: { combat_drones: 5, defense_shields: 2 },
        },
        rewards: {
          guaranteed: { metals: 150, energy: 100 },
          random: [
            { resource: "metals", min: 100, max: 400, chance: 80 },
            { resource: "energy", min: 50, max: 300, chance: 70 },
          ],
          equipment: [
            { id: "pirate_weapon", chance: 25 },
            { id: "advanced_shield", chance: 15 },
            { id: "stealth_module", chance: 10 },
          ],
        },
        eventChance: 95,
        eventPool: [
          "pirate_ambush",
          "distress_signal",
          "smuggler_hideout",
          "rogue_ai",
        ],
      },
    ],
  },
];
