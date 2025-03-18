import { initialBuildings, initialTechnologies } from "@/store/initialData";
import { initialState } from "@/store/reducers/gameReducer";
import { ResourcesState } from "@/store/reducers/resourceReducer";
import { GameState, ResourceData } from "@/store/types";

export const CURRENT_GAME_VERSION = 2; // Aktualna wersja gry

export const migrateGameState = (savedState: any): GameState => {
  let migratedState = { ...savedState };

  // Dodaj brakujące pola dla nowych instalacji
  if (!migratedState.buildings) migratedState.buildings = [];
  if (!migratedState.resources)
    migratedState.resources = initialState.resources;

  // Etapowa migracja wersji
  try {
    if (migratedState.version === undefined) {
      migratedState = migrateV0ToV1(migratedState);
    }
    if (migratedState.version === 2) {
      migratedState = migrateV1ToV2(migratedState);
    }
  } catch (error) {
    console.error("Migration failed:", error);
    return initialState;
  }

  return {
    ...initialState,
    ...migratedState,
    version: CURRENT_GAME_VERSION,
  };
};

// Migracja z wersji 0 (brak wersji)
const migrateV0ToV1 = (state: any) => {
  return {
    ...state,
    version: 1,
    technologies: state.technologies || initialTechnologies,
  };
};

const migrateV1ToV2 = (state: any) => {
  console.log("Migrating from V1 to V2...");

  return {
    ...state,
    version: 2,
    buildings: (state.buildings || []).map((b: any) => {
      console.log("Processing building:", { id: b.id, type: b.type });

      if (b.tier !== undefined && b.upgrades !== undefined) {
        console.log(
          "Building already has tier and upgrades, skipping migration"
        );
        return {
          ...b,
          level: undefined,
        };
      }

      console.log("Migrating building from level-based to tier system");
      const template = initialBuildings.find((ib) => ib.type === b.type) || {};
      const oldLevel = b.level || 1;

      const totalUpgrades = oldLevel - 1;
      const tier = Math.min(Math.floor(totalUpgrades / 10) + 1, 5);
      let upgrades = totalUpgrades % 10;

      if (tier === 5) {
        const t5Upgrades = totalUpgrades - 40;
        upgrades = Math.min(Math.max(t5Upgrades, 0), 10);
      }

      return {
        ...template,
        ...b,
        tier,
        upgrades,
        level: undefined,
        efficiency: Number(b.efficiency) || 0,
      };
    }),
  };
};
