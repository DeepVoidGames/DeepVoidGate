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
