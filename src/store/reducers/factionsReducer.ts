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

  if (state.factions[1].loyalty >= 5000)
    newState.technologies.find(
      (tech) => tech.id === "conscious_biofabrication"
    ).locked = false;

  if (state.factions[1].loyalty >= 8000)
    newState.technologies.find(
      (tech) => tech.id === "stratospheric_processing"
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
export const getDominantFactionTheme = (
  state: GameState,
  options?: {
    styleType?: keyof FactionTheme;
    opacity?: number;
    withHover?: boolean;
    withGradient?: boolean;
  }
): string => {
  return "";
  const {
    styleType = "background",
    opacity = 1,
    withHover = false,
    withGradient = false,
  } = options || {};

  // Znajdź dominującą frakcję
  const dominant = state.factions.reduce((prev, current) =>
    prev.loyalty > current.loyalty ? prev : current
  );

  if (!dominant || dominant.loyalty < 5000) return "";

  // Pobierz motyw
  const theme = FACTION_THEMES[dominant.id] || FACTION_THEMES.neutral;

  // Buduj klasę CSS
  let result = theme[styleType];

  // Dodawanie opcji
  if (opacity < 1) {
    if (styleType !== "border") {
      const opacityValue = Math.round(opacity * 100);
      result += `/${opacityValue}`;
    }
  }

  if (withHover) result += ` ${theme.hover}`;
  if (withGradient && styleType === "background") {
    result = `bg-gradient-to-r ${theme.gradient}`;
  }

  return result.trim();
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
      {
        name: "Unkown",
        description: "Unkown",
        loyaltyReq: 8000,
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
      {
        name: "Orbital Terraforming Initiative",
        description:
          "Pioneers orbital-scale environmental manipulation. Grants access to high-atmosphere extraction, advanced oxygen systems, and infrastructure that supports planetary-scale sustainability.",
        loyaltyReq: 8000,
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
      {
        name: "Unkown",
        description: "Unkown",
        loyaltyReq: 8000,
      },
    ],
  },
];

interface FactionTheme {
  background: string;
  border: string;
  text: string;
  gradient: string;
  hover: string;
}
// Mapa stylów dla różnych frakcji
const FACTION_THEMES: Record<string, FactionTheme> = {
  rebels: {
    background: "bg-sky-500",
    border: "border-blue-600/40",
    text: "text-blue-800",
    gradient: "from-blue-400 to-blue-600",
    hover: "hover:bg-blue-700",
  },
  empire: {
    background: "bg-green-400",
    border: "border-green-600/40",
    text: "text-green-800",
    gradient: "from-green-400 to-green-600",
    hover: "hover:bg-green-700",
  },
  neutral: {
    background: "bg-purple-400",
    border: "border-purple-400/40",
    text: "text-purple-800",
    gradient: "from-purple-400 to-purple-600",
    hover: "hover:bg-purple-700",
  },
};
