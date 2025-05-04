// factionsHelpers.ts
import { FactionName } from "@/types/factions";
import { GameState } from "@/types/gameState";

/**
 * Aktualizuje lojalność frakcji w grze.
 * Zmienia lojalność frakcji o określoną wartość, zapewniając, że lojalność mieści się w dozwolonym zakresie (od 0 do maxLoyalty).
 *
 * @param state - Obiekt reprezentujący aktualny stan gry.
 * @param faction - Identyfikator frakcji, której lojalność ma zostać zaktualizowana.
 * @param amount - Wartość, o którą ma zostać zmieniona lojalność (może być dodatnia lub ujemna).
 * @returns Zaktualizowany stan gry z nowymi wartościami lojalności frakcji.
 */
export const updateFactionLoyalty = (
  state: GameState,
  faction: FactionName,
  amount: number
): GameState => {
  return {
    ...state,
    factions: state.factions.map((f) => {
      if (f.id === faction) {
        return {
          ...f,
          loyalty: Math.min(Math.max(f.loyalty + amount, 0), f.maxLoyalty),
        };
      }
      return f;
    }),
  };
};

/**
 * Zastosowuje bonusy frakcji na podstawie ich lojalności.
 * Otwiera dostęp do technologii, gdy lojalność frakcji osiągnie wymagany próg.
 *
 * @param state - Obiekt reprezentujący aktualny stan gry.
 * @returns Zaktualizowany stan gry z zastosowanymi bonusami frakcji.
 */
export const applyFactionBonuses = (state: GameState): GameState => {
  const newState = { ...state };

  // Technocrats
  if (state.factions[0].loyalty >= 1000) {
    //
  }

  // Biogenesis
  if (state.factions[1].loyalty >= 1000)
    newState.technologies.find(
      (tech) => tech.id === "genetic_ecoengineering"
    ).locked = false;

  // StarUnderstanding
  if (state.factions[2].loyalty >= 1000)
    newState.technologies.find(
      (tech) => tech.id === "stellar_awareness"
    ).locked = false;

  return newState;
};

export const initialFactions = [
  {
    id: "Technocrats" as FactionName,
    name: "Technocrat Syndicate",
    description: "Production optimization, automation, AI.",
    loyalty: 0,
    maxLoyalty: 10000,
    hostility: 0,
    bonuses: [
      {
        name: "",
        description: "",
        loyaltyReq: 25,
      },
    ],
  },
  {
    id: "Biogenesis" as FactionName,
    name: "Biogenesis Coalition",
    description: "Population development, terraforming, breeding.",
    loyalty: 0,
    maxLoyalty: 10000,
    hostility: 0,
    bonuses: [
      {
        name: "Avatar of Bloom",
        description:
          "Your unwavering devotion to the Biogenesis Coalition grants you access to the Genetic Ecosynth Laboratory a pinnacle of biospheric engineering.",
        loyaltyReq: 1000,
      },
      {
        name: "Biogenesis Coalition",
        description:
          "Focuses on population growth, terraforming and food-oxygen synergy. Unlocks Sentient Growth Core, growth-boosting buildings and eco-based technologies.",
        loyaltyReq: 5000,
      },
    ],
  },
  {
    id: "StarUnderstanding" as FactionName,
    name: "Order of Stellar Understanding",
    description: "Artifacts, cosmic energy, ???",
    loyalty: 0,
    maxLoyalty: 10000,
    hostility: 0,
    bonuses: [
      {
        name: "Embodied Prophet of the Stars",
        description:
          "Gain access to the Forbidden Astral Archives, unlocking the ability to construct the Astral Scriptorium and drastically accelerate your scientific progress.",
        loyaltyReq: 1000,
      },
      {
        name: "Temporal Veil",
        description:
          "The Order envelops your research centers in a temporal veil, reducing the duration of all technological bans by 50%. Forbidden knowledge is forgotten... faster.",
        loyaltyReq: 5000,
      },
    ],
  },
];
