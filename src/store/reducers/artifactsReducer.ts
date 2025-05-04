import { Artifact, ArtifactEffectType } from "@/types/artifacts";
import { GameState } from "@/types/gameState";

/**
 * Ulepsza artefakt gracza, zwiększając jego poziom gwiazdek, jeśli spełnione są warunki.
 *
 * Warunki ulepszenia:
 * - Artefakt musi istnieć.
 * - Nie może być zablokowany (`isLocked` musi być `false`).
 * - Nie może mieć maksymalnej liczby gwiazdek (maksymalnie 5).
 * - Gracz musi posiadać wystarczającą liczbę kopii artefaktu (wymagana liczba to 2^aktualny_poziom_gwiazdek).
 *
 * @param artifactName - nazwa artefaktu do ulepszenia.
 * @param state - aktualny stan gry, zawierający informacje o artefaktach.
 * @returns Zaktualizowany stan gry z ulepszonym artefaktem lub niezmieniony, jeśli warunki nie zostały spełnione.
 */
export const upgradeArtifactIfPossible = (
  artifactName: string,
  state: GameState
): GameState => {
  const artifact = state.artifacts.find((a) => a.name === artifactName);

  if (!artifact || artifact.isLocked || artifact.stars >= 5) return state;

  const requiredCopies = Math.pow(2, artifact.stars);

  if (artifact.amount < requiredCopies) return state;

  return {
    ...state,
    artifacts: state.artifacts.map((a) => {
      if (a.name === artifactName) {
        return {
          ...a,
          stars: a.stars + 1,
          amount: a.amount - requiredCopies,
        };
      }
      return a;
    }),
  };
};

/**
 * Dodaje określoną liczbę kopii istniejącego artefaktu do stanu gracza.
 *
 * - Jeśli artefakt nie istnieje w kolekcji gracza, stan gry pozostaje niezmieniony.
 * - Jeśli artefakt istnieje, zwiększana jest jego liczba (`amount`) o podaną wartość.
 * - Artefakt zostaje również odblokowany (`isLocked` ustawione na `false`).
 *
 * @param artifactName - Nazwa artefaktu, do którego mają zostać dodane kopie.
 * @param amount - Liczba kopii do dodania (może być ujemna, jeśli to celowe).
 * @param state - Aktualny stan gry.
 * @returns Zaktualizowany stan gry z dodaną liczbą kopii artefaktu lub oryginalny stan, jeśli artefakt nie istnieje.
 */
export const addArtifactCopies = (
  artifactName: string,
  amount: number,
  state: GameState
): GameState => {
  const artifact = state.artifacts.find((a) => a.name === artifactName);

  if (!artifact) return state;

  return {
    ...state,
    artifacts: state.artifacts.map((a) => {
      if (a.name === artifactName) {
        return {
          ...a,
          amount: a.amount + amount,
          isLocked: false,
        };
      }
      return a;
    }),
  };
};

/**
 * Zwraca artefakt o podanej nazwie z aktualnego stanu gry.
 *
 * - Jeśli artefakt o podanej nazwie istnieje, zostaje zwrócony.
 * - Jeśli nie istnieje, zwracana jest wartość `undefined`.
 *
 * @param artifactName - Nazwa szukanego artefaktu.
 * @param state - Aktualny stan gry zawierający listę artefaktów.
 * @returns Artefakt o podanej nazwie lub `undefined`, jeśli nie został znaleziony.
 */
export const getArtifact = (
  artifactName: string,
  state: GameState
): Artifact | undefined => {
  return state.artifacts.find((a) => a.name === artifactName);
};

/**
 * Nakłada efekty aktywnych artefaktów na stan gry, modyfikując produkcję i pojemność zasobów.
 *
 * - Funkcja iteruje po wszystkich artefaktach, które posiadają przypisane efekty (`effect`).
 * - Każdy efekt może zwiększać produkcję (`production`) lub pojemność (`capacity`) zasobów.
 * - Efekty są stosowane tylko, jeśli artefakt nie jest zablokowany (`isLocked === false`).
 * - Wpływ efektu rośnie wraz z poziomem gwiazdek artefaktu (`(stars + 1) / 10`).
 *
 * @param state - Aktualny stan gry, zawierający artefakty i zasoby.
 * @returns Zaktualizowany stan gry z zastosowanymi efektami artefaktów.
 */
export const applyArtifactEffect = (state: GameState): GameState => {
  if (!state.artifacts) return state;
  if (state.artifacts.length === 0) return state;

  state.artifacts.forEach((artifact) => {
    if (artifact.effect) {
      artifact.effect.forEach((effect) => {
        switch (effect.type) {
          case "production" as ArtifactEffectType:
            if (artifact.isLocked) return;
            Object.values(state.resources).forEach((resource) => {
              resource.production =
                resource.production *
                (effect.value + (artifact.stars + 1) / 10);
            });
            break;
          case "capacity" as ArtifactEffectType:
            if (artifact.isLocked) return;

            Object.values(state.resources).forEach((resource) => {
              resource.capacity +=
                resource.capacity * (effect.value + (artifact.stars + 1) / 10);
            });
            break;
          default:
            break;
        }
      });
    }
  });

  return state;
};

/**
 * Zwraca listę artefaktów przypisanych do określonego tieru ekspedycji.
 *
 * - Przeszukuje kolekcję artefaktów gracza i filtruje je na podstawie poziomu ekspedycji (`expedtionTier`).
 *
 * @param state - Aktualny stan gry zawierający artefakty.
 * @param tier - Tier ekspedycji, dla którego mają zostać zwrócone artefakty.
 * @returns Tablica artefaktów należących do podanego tieru ekspedycji.
 */
export const getArtifactsByExpeditionTier = (
  state: GameState,
  tier: number
): Artifact[] => {
  return state.artifacts.filter((artifact) => artifact.expedtionTier === tier);
};
