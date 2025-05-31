import {
  FactionEvent,
  FactionEventOption,
  FactionName,
} from "@/types/factions";
import { GameState } from "@/types/gameState";
import { getArtifact } from "@/store/reducers/artifactsReducer";
import { factionEventPool } from "@/data/factionEvents";
import { gameEvent } from "@/server/analytics";

/**
 * Selects a random faction event from a predefined pool of events.
 * It ensures that a deep copy of the selected event is returned,
 * preventing direct modification of the original event objects in the pool.
 *
 * @returns A randomly selected `FactionEvent` object.
 */
export const generateRandomFactionEvent = (): FactionEvent => {
  const index = Math.floor(Math.random() * factionEventPool.length);
  return JSON.parse(JSON.stringify(factionEventPool[index])); // deep copy
};

/**
 * Schedules the timestamp for the next faction event to occur.
 * The event is scheduled to happen randomly between 1 and 3 hours from the current time.
 * This introduces an element of unpredictability to when new faction events will appear.
 *
 * @returns The timestamp (in milliseconds since epoch) when the next faction event is scheduled.
 */
export const scheduleNextFactionEvent = (): number => {
  const nextIn = 3600 * 1000 + Math.random() * 7200 * 1000; // 1–3h
  return Date.now() + nextIn;
};

/**
 * Applies the effects of a chosen option from a faction event to the game state.
 * This function iterates through a list of effects associated with the chosen option
 * and modifies the game state accordingly. After applying all effects, it clears
 * the current faction event and schedules the next one.
 *
 * @param state - The current game state object.
 * @param option - The chosen option from a faction event, containing a list of effects to apply.
 * @returns A new game state object with the applied effects and updated event schedule.
 */
export const applyFactionEventOption = (
  state: GameState,
  option: FactionEventOption
): GameState => {
  let newState = { ...state };

  for (const effect of option.effects) {
    switch (effect.type) {
      case "loyalty":
        newState = updateFactionLoyalty(
          newState,
          effect.faction!,
          effect.value!
        );
        break;
      case "resource":
        // Handle resource modifications
        if (effect.target && effect.value !== undefined) {
          newState = {
            ...newState,
            resources: {
              ...newState.resources,
              [effect.target]: {
                ...newState.resources[effect.target],
                amount: Math.max(
                  0,
                  newState.resources[effect.target].amount + effect.value
                ),
              },
            },
          };
        }
        break;
      case "story":
        //
        break;
      case "unlock":
        // Unlock specified technology
        if (effect.target) {
          newState = {
            ...newState,
            technologies: newState.technologies.map((tech) =>
              tech.id === effect.target ? { ...tech, locked: false } : tech
            ),
          };
        }
        break;
      case "catastrophe":
        // np. zwiększ ryzyko zdarzenia losowego
        break;
    }
  }

  return {
    ...newState,
    factionEvent: null,
    nextFactionEventAt: scheduleNextFactionEvent(),
  };
};

/**
 * Updates the loyalty of a faction in the game.
 * Changes the faction's loyalty by a specified amount, ensuring the loyalty stays within the allowed range (0 to maxLoyalty).
 *
 * @param state - The object representing the current game state.
 * @param faction - The identifier of the faction whose loyalty is to be updated.
 * @param amount - The amount by which to change the loyalty (can be positive or negative).
 * @returns Updated game state with new faction loyalty values.
 */
export const updateFactionLoyalty = (
  state: GameState,
  faction: FactionName,
  amount: number
): GameState => {
  const artifact = getArtifact("Artifact of Diplomacy", state);

  let adjustedAmount = amount;
  if (artifact && !artifact.isLocked) {
    adjustedAmount =
      amount * (1 + (artifact.effect[0]?.value ?? 0) * artifact.stars);
  }

  let newState = {
    ...state,
    factions: state.factions.map((f) => {
      if (f.id === faction) {
        const newLoyalty = Math.min(
          Math.max(f.loyalty + adjustedAmount, 0),
          f.maxLoyalty
        );
        return {
          ...f,
          loyalty: newLoyalty,
        };
      }
      return f;
    }),
  };

  const updatedFaction = newState.factions.find((f) => f.id === faction);
  const newLoyalty = updatedFaction ? updatedFaction.loyalty : 0;

  gameEvent("faction_loyalty_updated", {
    factionId: faction,
    amount,
    adjustedAmount,
    newLoyalty,
    artifactUsed: !!artifact && !artifact.isLocked,
  });

  return newState;
};

/**
 * Applies faction bonuses based on their loyalty levels.
 * Unlocks technologies when a faction's loyalty reaches the required threshold.
 *
 * @param state - The object representing the current game state.
 * @returns Updated game state with applied faction bonuses.
 */
export const applyFactionBonuses = (state: GameState): GameState => {
  const newState = { ...state };

  // Technocrats
  if (state.factions[0].loyalty >= 1000) {
    newState.technologies.find(
      (tech) => tech.id === "singularity_engineering"
    ).locked = false;
  }
  if (state.factions[0].loyalty >= 8000) {
    newState.technologies.find(
      (tech) => tech.id === "core_drilling_tech"
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

  if (state.factions[2].loyalty >= 8000)
    newState.technologies.find(
      (tech) => tech.id === "quantum_energy_harnessing"
    ).locked = false;

  return newState;
};

/**
 * Determines the dominant faction based on their loyalty levels.
 * If the loyalty of the first and second faction is equal, returns the third faction as default.
 * If there are fewer than 3 factions, returns an empty string.
 *
 * @param state - The object representing the current game state, containing the list of factions.
 * @returns The ID of the dominant faction or an empty string if the dominant faction cannot be determined.
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

// Inittial factions data
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
        name: "Crust Breach Initiative",
        description:
          "Marks the beginning of extreme-depth planetary extraction. Unlocks the Deep Core Extractor — a facility capable of reaching previously untapped metal reserves. A defining leap in industrial-scale mining.",
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
        name: "Singularity Protocol",
        description:
          "Initiates the transition into quantum-level resource control. Unlocks the Quantum Core Reactor — a next-generation facility capable of producing massive energy outputs by tapping into quantum fields. A milestone in limitless energy generation.",
        loyaltyReq: 8000,
      },
    ],
  },
];

//TODO move to a separate file
interface FactionTheme {
  background: string;
  border: string;
  text: string;
  gradient: string;
  hover: string;
}

//TODO move to a separate file
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
