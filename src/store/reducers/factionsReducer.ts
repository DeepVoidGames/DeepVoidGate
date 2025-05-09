// factionsHelpers.ts
import { FactionName } from "@/types/factions";
import { GameState } from "@/types/gameState";
import { getArtifact } from "@/store/reducers/artifactsReducer";

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
  const artifact = getArtifact("Artifact of Diplomacy", state);
  return {
    ...state,
    factions: state.factions.map((f) => {
      if (f.id === faction) {
        return {
          ...f,
          loyalty: artifact?.isLocked
            ? Math.min(Math.max(f.loyalty + amount, 0), f.maxLoyalty)
            : Math.min(
                Math.max(
                  f.loyalty +
                    amount * (1 + artifact?.effect[0]?.value * artifact?.stars),
                  0
                ),
                f.maxLoyalty
              ),
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
    newState.technologies.find(
      (tech) => tech.id === "singularity_engineering"
    ).locked = false;
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

/**
 * Określa dominującą frakcję na podstawie ich poziomu lojalności.
 * Jeśli lojalność pierwszej i drugiej frakcji jest równa, zwraca trzecią frakcję jako domyślną.
 * W przypadku mniej niż 3 frakcji, zwraca pusty string.
 *
 * @param state - Obiekt reprezentujący aktualny stan gry, zawierający listę frakcji.
 * @returns Identyfikator dominującej frakcji lub pusty string, jeśli nie można określić dominującej frakcji.
 */
export const getDominantFaction = (
  state: GameState,
  isBackground?: boolean,
  opacity: string = ""
): string => {
  if (state.factions.length < 3) return "";
  if (
    state.factions[0].loyalty < 5000 &&
    state.factions[1].loyalty < 5000 &&
    state.factions[2].loyalty < 5000
  )
    return "";

  if (state.factions[0].loyalty > state.factions[1].loyalty) {
    return isBackground ? "bg-blue-600" + opacity : "border-blue-600/30";
  } else if (state.factions[0].loyalty < state.factions[1].loyalty) {
    return isBackground ? "bg-green-600" + opacity : "border-green-600/30";
  } else {
    return isBackground ? "bg-purple-400" + opacity : "border-purple-600/30";
  }
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
        name: "Core of Collapse",
        description:
          "Technocrat Syndicate grants you access to forbidden research on singularity stabilization. Allowing construction of the Singularity Core.",
        loyaltyReq: 1000,
      },
      {
        name: "Hyperindustrial Directive",
        description:
          "Your unwavering loyalty has granted you access to the Syndicate’s advanced automation protocols. All production operations are now enhanced by 25% efficiency.",
        loyaltyReq: 5000,
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
