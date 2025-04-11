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
    minTier: 3,
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
];
