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
        text: "Stop to provide medical care (add 15 minutes to expedition)",
        effects: [{ type: "time", value: 15 }],
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
        text: "Attempt rescue (lose 30 minutes but save crew)",
        effects: [{ type: "time", value: 30 }],
      },
      {
        text: "Focus on mining (lose 2 crew members but continue)",
        effects: [
          { type: "crew", value: -2 },
          {
            type: "reward",
            value: (expedition) => ({
              metals: 200 * (1 + expedition.tier),
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
          { type: "time", value: 25 },
          {
            type: "reward",
            value: (expedition) => ({
              metals: 300 * (1 + expedition.tier),
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
              metals: 150 * (1 + expedition.tier),
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
        text: "Seek shelter (expedition takes 20 minutes longer)",
        effects: [{ type: "time", value: 20 }],
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
        text: "Reroute power to shields (expedition takes 15 minutes longer)",
        effects: [{ type: "time", value: 15 }],
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
        text: "Take evasive maneuvers (add 25 minutes to ETA)",
        effects: [{ type: "time", value: 25 }],
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
        text: "Divert course around storm (+30 minutes)",
        effects: [{ type: "time", value: 30 }],
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
        text: "Navigate carefully through gaps (+18 minutes)",
        effects: [{ type: "time", value: 18 }],
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
        text: "Power down non-essential systems (+22 minutes)",
        effects: [{ type: "time", value: 22 }],
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
        text: "Recalibrate navigation systems (+17 minutes)",
        effects: [{ type: "time", value: 17 }],
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
            value: 30, // +30 minut do czasu misji
          },
        ],
      },
      {
        text: "Destroy dangerous technology",
        effects: [
          {
            type: "reward",
            value: { science: 1000 },
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
            value: 10,
          },
        ],
      },
      {
        text: "Harvest samples for immediate use",
        effects: [
          {
            type: "reward",
            value: { food: 200, oxygen: 50 },
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
            value: 45,
          },
        ],
      },
      {
        text: "Harvest biomass",
        effects: [
          {
            type: "reward",
            value: { food: 2000, science: 500 },
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
            value: 60,
          },
        ],
      },
      {
        text: "Extract energy pulses",
        effects: [
          {
            type: "reward",
            value: { energy: 4000, science: 800 },
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
            value: 60,
          },
        ],
      },
      {
        text: "Harvest organic material",
        effects: [
          {
            type: "reward",
            value: {
              food: 3000,
              oxygen: 1500,
              science: 1000,
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
            value: 90,
          },
        ],
      },
      {
        text: "Extract temporal energy",
        effects: [
          {
            type: "reward",
            value: {
              energy: 5000,
              metals: 3000,
              science: 2000,
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
            value: 120,
          },
        ],
      },
      {
        text: "Extract residual resources",
        effects: [
          {
            type: "reward",
            value: {
              science: 4000,
              energy: 5000,
              metals: 3000,
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
            value: 150,
          },
        ],
      },
      {
        text: "Extract the resource data",
        effects: [
          {
            type: "reward",
            value: {
              food: 5000,
              water: 4000,
              oxygen: 4000,
              science: 3000,
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
            value: 180,
          },
        ],
      },
      {
        text: "Use it for immediate utility",
        effects: [
          {
            type: "reward",
            value: {
              metals: 7000,
              energy: 5000,
              food: 4000,
              oxygen: 3000,
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
            value: 240,
          },
        ],
      },
      {
        text: "Salvage for immediate resources",
        effects: [
          {
            type: "reward",
            value: {
              science: 20000,
              energy: 15000,
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
            value: 300,
          },
        ],
      },
      {
        text: "Seal the breach, it's too dangerous",
        effects: [
          {
            type: "reward",
            value: {
              science: 50000,
              energy: 30000,
            },
          },
        ],
      },
    ],
  },
];
