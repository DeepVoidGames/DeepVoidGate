import { FactionEvent } from "@/types/factions";

export const factionEventPool: FactionEvent[] = [
  {
    id: "technocratic_shadow",
    title: "Technocratic Shadow",
    description:
      "The Technocrats offer secret upgrades to your energy grid… but Biogenesis warns it'll poison the land.",
    duration: 3600, // 1h
    activeUntil: Date.now() + 3600000,
    options: [
      {
        label: "Accept Help",
        effects: [
          { type: "loyalty", faction: "Technocrats", value: +300 },
          { type: "loyalty", faction: "Biogenesis", value: -150 },
        ],
      },
      {
        label: "Refuse",
        effects: [{ type: "loyalty", faction: "Biogenesis", value: +100 }],
      },
      {
        label: "Mediate",
        effects: [{ type: "resource", target: "science", value: 75000 }],
      },
    ],
  },
  {
    id: "biogenesis_discovery",
    title: "Bioengineered Ecosystem",
    description:
      "Biogenesis researchers have developed a new plant species that can rapidly generate oxygen but requires significant water resources. StarUnderstanding warns of unforeseen consequences.",
    duration: 7200, // 2h
    activeUntil: Date.now() + 7200000,
    options: [
      {
        label: "Implement Colony-Wide",
        effects: [
          { type: "loyalty", faction: "Biogenesis", value: +250 },
          { type: "loyalty", faction: "StarUnderstanding", value: -100 },
          { type: "resource", target: "oxygen", value: 30000 },
          { type: "resource", target: "water", value: 10000 },
        ],
      },
      {
        label: "Reject Proposal",
        effects: [
          { type: "loyalty", faction: "StarUnderstanding", value: +100 },
          { type: "loyalty", faction: "Biogenesis", value: -200 },
        ],
      },
      {
        label: "Limited Test Implementation",
        effects: [
          { type: "resource", target: "oxygen", value: 100000 },
          { type: "resource", target: "science", value: 750000 },
        ],
      },
    ],
  },
  {
    id: "star_understanding_revelation",
    title: "Cosmic Signals",
    description:
      "StarUnderstanding has detected unusual signals from deep space. They seek resources to investigate, but Technocrats argue those resources are needed for immediate colony improvements.",
    duration: 5400, // 1.5h
    activeUntil: Date.now() + 5400000,
    options: [
      {
        label: "Fund Research",
        effects: [
          { type: "loyalty", faction: "StarUnderstanding", value: +200 },
          { type: "loyalty", faction: "Technocrats", value: -150 },
          { type: "resource", target: "energy", value: -20000 },
          { type: "resource", target: "science", value: 250000 },
        ],
      },
      {
        label: "Focus on Colony",
        effects: [
          { type: "loyalty", faction: "Technocrats", value: +175 },
          { type: "loyalty", faction: "StarUnderstanding", value: -125 },
          { type: "resource", target: "energy", value: 100000 },
        ],
      },
      {
        label: "Diplomatic Compromise",
        effects: [
          { type: "loyalty", faction: "StarUnderstanding", value: +50 },
          { type: "loyalty", faction: "Technocrats", value: +50 },
          { type: "resource", target: "science", value: 100000 },
          { type: "resource", target: "energy", value: -50000 },
        ],
      },
    ],
  },
  {
    id: "technocrat_mining_initiative",
    title: "Automated Mining Operation",
    description:
      "The Technocrats propose an automated mining system that would greatly increase metal production but cause environmental damage. Biogenesis strongly opposes this initiative.",
    duration: 10800, // 3h
    activeUntil: Date.now() + 10800000,
    options: [
      {
        label: "Approve Mining",
        effects: [
          { type: "loyalty", faction: "Technocrats", value: +300 },
          { type: "loyalty", faction: "Biogenesis", value: -250 },
          { type: "resource", target: "metals", value: 400000 },
          { type: "resource", target: "energy", value: -10000 },
        ],
      },
      {
        label: "Block Initiative",
        effects: [
          { type: "loyalty", faction: "Biogenesis", value: +200 },
          { type: "loyalty", faction: "Technocrats", value: -200 },
        ],
      },
      {
        label: "Research Alternatives",
        effects: [
          { type: "resource", target: "metals", value: 150 },
          { type: "resource", target: "science", value: 100000 },
          { type: "resource", target: "energy", value: -70000 },
        ],
      },
    ],
  },
  {
    id: "biogenesis_food_revolution",
    title: "Synthetic Food Revolution",
    description:
      "Biogenesis scientists have developed a new method of food production that would dramatically increase output but requires sharing genetic data with them. StarUnderstanding cautions about privacy implications.",
    duration: 4800, // 1.33h
    activeUntil: Date.now() + 4800000,
    options: [
      {
        label: "Adopt New System",
        effects: [
          { type: "loyalty", faction: "Biogenesis", value: +250 },
          { type: "loyalty", faction: "StarUnderstanding", value: -100 },
          { type: "resource", target: "food", value: 350000 },
          { type: "resource", target: "water", value: -10000 },
        ],
      },
      {
        label: "Reject Proposal",
        effects: [
          { type: "loyalty", faction: "StarUnderstanding", value: +150 },
          { type: "loyalty", faction: "Biogenesis", value: -200 },
        ],
      },
      {
        label: "Negotiate Data Sharing Terms",
        effects: [
          { type: "loyalty", faction: "Biogenesis", value: +100 },
          { type: "loyalty", faction: "StarUnderstanding", value: +50 },
          { type: "resource", target: "food", value: 20000 },
          { type: "resource", target: "science", value: 750000 },
        ],
      },
    ],
  },
  {
    id: "star_understanding_water_vision",
    title: "Sacred Water Source",
    description:
      "StarUnderstanding members believe they've located a sacred water source that would provide abundant clean water, but Technocrats argue the area is better used for a new energy facility.",
    duration: 9000, // 2.5h
    activeUntil: Date.now() + 9000000,
    options: [
      {
        label: "Develop Water Source",
        effects: [
          { type: "loyalty", faction: "StarUnderstanding", value: +275 },
          { type: "loyalty", faction: "Technocrats", value: -175 },
          { type: "resource", target: "water", value: 400000 },
        ],
      },
      {
        label: "Build Energy Facility",
        effects: [
          { type: "loyalty", faction: "Technocrats", value: +225 },
          { type: "loyalty", faction: "StarUnderstanding", value: -200 },
          { type: "resource", target: "energy", value: 300000 },
        ],
      },
      {
        label: "Integrated Development",
        effects: [
          { type: "loyalty", faction: "StarUnderstanding", value: +100 },
          { type: "loyalty", faction: "Technocrats", value: +100 },
          { type: "resource", target: "water", value: 200000 },
          { type: "resource", target: "energy", value: 150000 },
          { type: "resource", target: "science", value: 50000 },
        ],
      },
    ],
  },
  {
    id: "renewable_energy_debate",
    title: "Renewable Energy Debate",
    description:
      "The colony needs to expand its energy infrastructure. Technocrats advocate for efficient nuclear solutions while Biogenesis pushes for slower but sustainable solar implementations.",
    duration: 6300, // 1.75h
    activeUntil: Date.now() + 6300000,
    options: [
      {
        label: "Nuclear Power",
        effects: [
          { type: "loyalty", faction: "Technocrats", value: +250 },
          { type: "loyalty", faction: "Biogenesis", value: -200 },
          { type: "resource", target: "energy", value: 350000 },
          { type: "resource", target: "metals", value: -20000 },
        ],
      },
      {
        label: "Solar Arrays",
        effects: [
          { type: "loyalty", faction: "Biogenesis", value: +225 },
          { type: "loyalty", faction: "Technocrats", value: -150 },
          { type: "resource", target: "energy", value: 200000 },
          { type: "resource", target: "metals", value: -10000 },
        ],
      },
      {
        label: "Hybrid Approach",
        effects: [
          { type: "loyalty", faction: "Technocrats", value: +75 },
          { type: "loyalty", faction: "Biogenesis", value: +75 },
          { type: "resource", target: "energy", value: 250000 },
          { type: "resource", target: "metals", value: -10000 },
          { type: "resource", target: "science", value: 70000 },
        ],
      },
    ],
  },
  {
    id: "mysterious_artifact",
    title: "Mysterious Artifact",
    description:
      "An ancient artifact has been discovered near the colony. StarUnderstanding believes it holds cosmic significance, while Technocrats want to dismantle it for research.",
    duration: 8600, // 2.4h
    activeUntil: Date.now() + 8600000,
    options: [
      {
        label: "Preserve for Study",
        effects: [
          { type: "loyalty", faction: "StarUnderstanding", value: +300 },
          { type: "loyalty", faction: "Technocrats", value: -200 },
          { type: "resource", target: "science", value: 150000 },
        ],
      },
      {
        label: "Dismantle for Technology",
        effects: [
          { type: "loyalty", faction: "Technocrats", value: +275 },
          { type: "loyalty", faction: "StarUnderstanding", value: -250 },
          { type: "resource", target: "science", value: 250000 },
          { type: "resource", target: "metals", value: 100000 },
        ],
      },
      {
        label: "Collaborative Investigation",
        effects: [
          { type: "loyalty", faction: "StarUnderstanding", value: +125 },
          { type: "loyalty", faction: "Technocrats", value: +125 },
          { type: "resource", target: "science", value: 200000 },
        ],
      },
    ],
  },
  {
    id: "atmosphere_crisis",
    title: "Atmospheric Crisis",
    description:
      "Oxygen levels are dropping in parts of the colony. Biogenesis proposes a biological solution, while Technocrats favor a mechanical fix.",
    duration: 3900, // 1.08h
    activeUntil: Date.now() + 3900000,
    options: [
      {
        label: "Biological Solution",
        effects: [
          { type: "loyalty", faction: "Biogenesis", value: +250 },
          { type: "loyalty", faction: "Technocrats", value: -125 },
          { type: "resource", target: "oxygen", value: 250000 },
          { type: "resource", target: "water", value: -10000 },
        ],
      },
      {
        label: "Mechanical Fix",
        effects: [
          { type: "loyalty", faction: "Technocrats", value: +225 },
          { type: "loyalty", faction: "Biogenesis", value: -100 },
          { type: "resource", target: "oxygen", value: 250000 },
          { type: "resource", target: "energy", value: -10000 },
          { type: "resource", target: "metals", value: -70000 },
        ],
      },
      {
        label: "Emergency Reserves",
        effects: [
          { type: "resource", target: "oxygen", value: 150000 },
          { type: "resource", target: "science", value: 100000 },
        ],
      },
    ],
  },
  {
    id: "scientific_breakthrough",
    title: "Scientific Breakthrough",
    description:
      "A major scientific breakthrough could revolutionize the colony's capabilities. All three factions have different ideas about how to apply it.",
    duration: 12600, // 3.5h
    activeUntil: Date.now() + 12600000,
    options: [
      {
        label: "Technological Applications",
        effects: [
          { type: "loyalty", faction: "Technocrats", value: +300 },
          { type: "loyalty", faction: "Biogenesis", value: -100 },
          { type: "loyalty", faction: "StarUnderstanding", value: -100 },
          { type: "resource", target: "energy", value: 200000 },
          { type: "resource", target: "metals", value: 150000 },
          { type: "resource", target: "science", value: 100000 },
        ],
      },
      {
        label: "Ecological Applications",
        effects: [
          { type: "loyalty", faction: "Biogenesis", value: +300 },
          { type: "loyalty", faction: "Technocrats", value: -100 },
          { type: "loyalty", faction: "StarUnderstanding", value: -100 },
          { type: "resource", target: "food", value: 200000 },
          { type: "resource", target: "water", value: 150000 },
          { type: "resource", target: "oxygen", value: 200000 },
        ],
      },
      {
        label: "Spiritual Applications",
        effects: [
          { type: "loyalty", faction: "StarUnderstanding", value: +300 },
          { type: "loyalty", faction: "Technocrats", value: -100 },
          { type: "loyalty", faction: "Biogenesis", value: -100 },
          { type: "resource", target: "science", value: 250000 },
        ],
      },
    ],
  },
];
