// expeditionEvents.ts
import { ExpeditionEvent } from "@/types/expedition";

export const expeditionEvents: ExpeditionEvent[] = [
  // Wspólne zdarzenia dla wszystkich typów ekspedycji
  {
    id: "crew_injury",
    title: "Crew Injury",
    description:
      "One of your crew members has been seriously injured during the expedition.",
    image: "crew_injury.png",
    options: [
      {
        text: "Continue without helping (lose 1 crew member)",
        effects: [{ type: "crew", value: -1 }],
      },
      {
        text: "Stop to provide medical care (add 5 minutes to expedition)",
        effects: [{ type: "time", value: 5 }],
      },
    ],
  },

  // Zdarzenia dla ekspedycji górniczych
  {
    id: "cave_in",
    title: "Cave In",
    description:
      "A section of the mine has collapsed, trapping some of your crew.",
    type: ["mining"],
    minTier: 3, // tylko dla trudniejszych ekspedycji
    image: "cave_in.png",
    options: [
      {
        text: "Attempt rescue (lose 5 minutes but save crew)",
        effects: [{ type: "time", value: 5 }],
      },
      {
        text: "Focus on mining (lose 2 crew members but continue)",
        effects: [
          { type: "crew", value: -2 },
          {
            type: "reward",
            value: (expedition) => ({
              metals: 2e5 * (1 + expedition.tier),
            }),
          },
        ],
      },
    ],
  },

  // Zdarzenie z nagrodą zasobów
  {
    id: "resource_bonanza",
    title: "Resource Bonanza",
    description: "You've stumbled upon a rich deposit of resources!",
    type: ["mining"],
    image: "bonanza.png",
    options: [
      {
        text: "Harvest as much as possible (large reward but takes time)",
        effects: [
          { type: "time", value: 5 },
          {
            type: "reward",
            value: (expedition) => ({
              metals: 3e4 * (1 + expedition.tier),
            }),
          },
        ],
      },
      {
        text: "Take what you can carry (small reward)",
        effects: [
          {
            type: "reward",
            value: (expedition) => ({
              metals: 1.5e4 * (1 + expedition.tier),
            }),
          },
        ],
      },
    ],
  },

  // Zdarzenie pogodowe
  {
    id: "sandstorm",
    title: "Sandstorm",
    description: "A massive sandstorm is approaching your location.",
    image: "sandstorm.png",
    options: [
      {
        text: "Seek shelter (expedition takes 5 minutes longer)",
        effects: [{ type: "time", value: 5 }],
      },
      {
        text: "Try to outrun it (50% chance to save time, 50% to lose crew)",
        effects: [
          {
            type: "crew",
            value: Math.random() > 0.5 ? 0 : -2,
          },
          {
            type: "time",
            value: Math.random() > 0.5 ? -10 : 10,
          },
        ],
      },
    ],
  },

  {
    id: "solar_flare",
    title: "Solar Flare",
    description: "Intense radiation bursts threaten your equipment and crew.",
    image: "solar_flare.png",
    minTier: 1,
    options: [
      {
        text: "Reroute power to shields (expedition takes 5 minutes longer)",
        effects: [{ type: "time", value: 5 }],
      },
      {
        text: "Risk proceeding at normal speed (50% chance to lose crew)",
        effects: [
          {
            type: "crew",
            value: Math.random() > 0.5 ? 0 : -3,
          },
        ],
      },
    ],
  },

  {
    id: "meteor_shower",
    title: "Meteor Shower",
    description: "A barrage of space rocks approaches your trajectory.",
    image: "meteor_shower.png",
    minTier: 1,
    options: [
      {
        text: "Take evasive maneuvers (add 5 minutes to ETA)",
        effects: [{ type: "time", value: 5 }],
      },
      {
        text: "Chart risky path through debris (50% save time/50% hull breach)",
        effects: [
          {
            type: "crew",
            value: Math.random() > 0.5 ? 0 : -2,
          },
          {
            type: "time",
            value: Math.random() > 0.5 ? -20 : 10,
          },
        ],
      },
    ],
  },

  {
    id: "plasma_storm",
    title: "Plasma Storm",
    description: "Charged particle clouds disrupt navigation systems.",
    image: "plasma_storm.png",
    minTier: 2,
    options: [
      {
        text: "Divert course around storm (+5 minutes)",
        effects: [{ type: "time", value: 5 }],
      },
      {
        text: "Attempt straight path (50% faster travel/50% crew casualties)",
        effects: [
          {
            type: "crew",
            value: Math.random() > 0.5 ? 0 : -4,
          },
          {
            type: "time",
            value: Math.random() > 0.5 ? -25 : 15,
          },
        ],
      },
    ],
  },

  {
    id: "asteroid_field",
    title: "Asteroid Field",
    description: "Dense cluster of asteroids blocks your path.",
    image: "asteroid_field.png",
    options: [
      {
        text: "Navigate carefully through gaps (+5 minutes)",
        effects: [{ type: "time", value: 5 }],
      },
      {
        text: "Accelerate through dangerous zone (50% gain/lose)",
        effects: [
          {
            type: "crew",
            value: Math.random() > 0.5 ? 0 : -1,
          },
          {
            type: "time",
            value: Math.random() > 0.5 ? -15 : 20,
          },
        ],
      },
    ],
  },

  {
    id: "ion_storm",
    title: "Ion Storm",
    description: "Electromagnetic interference cripples systems.",
    image: "ion_storm.png",
    minTier: 1,
    options: [
      {
        text: "Power down non-essential systems (+5 minutes)",
        effects: [{ type: "time", value: 5 }],
      },
      {
        text: "Risk system overload for speed (50% success chance)",
        effects: [
          {
            type: "crew",
            value: Math.random() > 0.5 ? 0 : -3,
          },
          {
            type: "time",
            value: Math.random() > 0.5 ? -18 : 25,
          },
        ],
      },
    ],
  },

  {
    id: "magnetic_vortex",
    title: "Magnetic Vortex",
    description: "Powerful magnetic fields distort sensors.",
    image: "magnetic_vortex.png",
    minTier: 1,
    options: [
      {
        text: "Recalibrate navigation systems (+5 minutes)",
        effects: [{ type: "time", value: 5 }],
      },
      {
        text: "Fly blind through distortion (50% time save/penalty)",
        effects: [
          {
            type: "crew",
            value: Math.random() > 0.5 ? 0 : -2,
          },
          {
            type: "time",
            value: Math.random() > 0.5 ? -12 : 19,
          },
        ],
      },
    ],
  },

  {
    id: "alien_tech_discovery",
    title: "Ancient Alien Technology",
    description:
      "Your team has discovered remnants of advanced alien technology!",
    type: ["scientific"],
    minTier: 1,
    weight: 5,
    options: [
      {
        text: "Attempt to reverse engineer",
        effects: [
          {
            type: "technology",
            technologyId: "alien_alloys",
            value: 0,
          },
          {
            type: "time",
            value: 5, // +30 minut do czasu misji
          },
        ],
      },
      {
        text: "Destroy dangerous technology",
        effects: [
          {
            type: "reward",
            value: { science: 1e4 },
          },
        ],
      },
    ],
  },
  {
    id: "ancient_fungal_culture",
    title: "Forgotten Fungal Culture",
    description:
      "Your expedition uncovers an ancient cave filled with glowing fungal structures.",
    type: ["scientific"],
    minTier: 0,
    weight: 6,
    options: [
      {
        text: "Study the ecosystem",
        effects: [
          {
            type: "technology",
            technologyId: "primitive_bioreactor",
            value: 0,
          },
          {
            type: "time",
            value: 7,
          },
        ],
      },
      {
        text: "Harvest samples for immediate use",
        effects: [
          {
            type: "reward",
            value: { food: 2e5, oxygen: 5e5 },
          },
        ],
      },
    ],
  },
  {
    id: "quantum_biomass_field",
    title: "Quantum Biomass Field",
    description:
      "Your explorers encounter a field of pulsating biomass, flickering in and out of phase with reality.",
    type: ["scientific"],
    minTier: 2,
    weight: 4,
    options: [
      {
        text: "Study its metabolic cycle",
        effects: [
          {
            type: "technology",
            technologyId: "quantum_metabolism",
            value: 0,
          },
          {
            type: "time",
            value: 9,
          },
        ],
      },
      {
        text: "Harvest biomass",
        effects: [
          {
            type: "reward",
            value: { food: 2e5, science: 5e5 },
          },
        ],
      },
    ],
  },

  {
    id: "resonant_crystal_field",
    title: "Resonant Crystal Field",
    description:
      "Your team encounters a landscape filled with vibrating crystal arrays pulsing with rhythmic energy.",
    type: ["scientific"],
    minTier: 3,
    weight: 4,
    options: [
      {
        text: "Analyze harmonic patterns",
        effects: [
          {
            type: "technology",
            technologyId: "harmonic_energy_matrices",
            value: 0,
          },
          {
            type: "time",
            value: 12,
          },
        ],
      },
      {
        text: "Extract energy pulses",
        effects: [
          {
            type: "reward",
            value: { energy: 4e5, science: 8e5 },
          },
        ],
      },
    ],
  },
  {
    id: "symbiotic_megastructure",
    title: "Symbiotic Megastructure",
    description:
      "An enormous, breathing organism interwoven with alien machinery pulses in sync with planetary rhythms.",
    type: ["scientific"],
    minTier: 4,
    weight: 3,
    options: [
      {
        text: "Interface and observe",
        effects: [
          {
            type: "technology",
            technologyId: "symbiotic_processing_units",
            value: 0,
          },
          {
            type: "time",
            value: 14,
          },
        ],
      },
      {
        text: "Harvest organic material",
        effects: [
          {
            type: "reward",
            value: {
              food: 3e5,
              oxygen: 1.5e5,
              science: 1e5,
            },
          },
        ],
      },
    ],
  },
  {
    id: "time_distortion_field",
    title: "Time Distortion Field",
    description:
      "A temporal anomaly warps space and time, creating a rift where past, present, and future converge.",
    type: ["scientific"],
    minTier: 5,
    weight: 3,
    options: [
      {
        text: "Investigate the anomaly",
        effects: [
          {
            type: "technology",
            technologyId: "chrono_synchronization",
            value: 0,
          },
          {
            type: "time",
            value: 16,
          },
        ],
      },
      {
        text: "Extract temporal energy",
        effects: [
          {
            type: "reward",
            value: {
              energy: 5e5,
              metals: 3e5,
              science: 2e5,
            },
          },
        ],
      },
    ],
  },

  {
    id: "folded_space_ruins",
    title: "Folded Space Ruins",
    description:
      "A collapsing structure appears to exist in multiple dimensions at once. Its geometry warps as you observe it.",
    type: ["scientific"],
    minTier: 6,
    weight: 3,
    options: [
      {
        text: "Stabilize the structure and study it",
        effects: [
          {
            type: "technology",
            technologyId: "spatial_fabric_manipulation",
            value: 0,
          },
          {
            type: "time",
            value: 18,
          },
        ],
      },
      {
        text: "Extract residual resources",
        effects: [
          {
            type: "reward",
            value: {
              science: 1e6,
              energy: 1e6,
              metals: 1e6,
            },
          },
        ],
      },
    ],
  },

  {
    id: "neurostorage_architecture",
    title: "Neural Storage Blueprint",
    description:
      "Your team uncovers a vault embedded with a living AI designed to manage interdimensional supply chains.",
    type: ["scientific"],
    minTier: 7,
    weight: 2,
    options: [
      {
        text: "Integrate the neural systems",
        effects: [
          {
            type: "technology",
            technologyId: "autonomic_storage_networks",
            value: 0,
          },
          {
            type: "time",
            value: 20,
          },
        ],
      },
      {
        text: "Extract the resource data",
        effects: [
          {
            type: "reward",
            value: {
              food: 5e6,
              water: 4e6,
              oxygen: 4e6,
              science: 3e6,
            },
          },
        ],
      },
    ],
  },

  {
    id: "programmable_matter_discovery",
    title: "Programmable Matter Cache",
    description:
      "Your expedition has discovered an alien vault with programmable matter adapting to environmental needs.",
    type: ["scientific"],
    minTier: 8,
    weight: 2,
    options: [
      {
        text: "Harvest and analyze the matter",
        effects: [
          {
            type: "technology",
            technologyId: "adaptive_matter_engineering",
            value: 0,
          },
          {
            type: "time",
            value: 22,
          },
        ],
      },
      {
        text: "Use it for immediate utility",
        effects: [
          {
            type: "reward",
            value: {
              metals: 7e6,
              energy: 5e6,
              food: 4e6,
              oxygen: 3e6,
            },
          },
        ],
      },
    ],
  },

  {
    id: "temporal_relic_site",
    title: "Temporal Relic Site",
    description:
      "A site where time flows differently has been located. Artifacts within may grant unparalleled control over spacetime.",
    type: ["scientific"],
    minTier: 9,
    weight: 2,
    options: [
      {
        text: "Study the artifacts carefully",
        effects: [
          {
            type: "technology",
            technologyId: "temporal_acceleration",
            value: 0,
          },
          {
            type: "time",
            value: 24,
          },
        ],
      },
      {
        text: "Salvage for immediate resources",
        effects: [
          {
            type: "reward",
            value: {
              science: 2e6,
              energy: 1e6,
            },
          },
        ],
      },
    ],
  },

  {
    id: "dimensional_breach",
    title: "Dimensional Breach",
    description:
      "A rift in local spacetime has revealed a source of raw matter potential. Tapping it could revolutionize your entire infrastructure.",
    type: ["scientific"],
    minTier: 10,
    weight: 1,
    options: [
      {
        text: "Engage containment and begin synthesis protocols",
        effects: [
          {
            type: "technology",
            technologyId: "matter_synthesis",
            value: 0,
          },
          {
            type: "time",
            value: 26,
          },
        ],
      },
      {
        text: "Seal the breach, it's too dangerous",
        effects: [
          {
            type: "reward",
            value: {
              science: 5e7,
              energy: 3e7,
            },
          },
        ],
      },
    ],
  },
  {
    id: "stellar_convergence",
    title: "Stellar Convergence",
    description:
      "Anomalous alignment between your orbital station and a nearby pulsar produces stable zones of gravity-suppressed quantum coherence. Within them, megastructural habitation becomes theoretically feasible.",
    type: ["scientific"],
    minTier: 11,
    weight: 1,
    options: [
      {
        text: "Initiate orbital construction and neural imprinting routines",
        effects: [
          {
            type: "technology",
            technologyId: "celestial_neuro_architecture",
            value: 0,
          },
          {
            type: "time",
            value: 26, // minutes until fully analyzed
          },
        ],
      },
      {
        text: "Too unstable. Record data and redirect energy elsewhere",
        effects: [
          {
            type: "reward",
            value: {
              science: 6e7,
              energy: 4e7,
            },
          },
        ],
      },
    ],
  },
];
