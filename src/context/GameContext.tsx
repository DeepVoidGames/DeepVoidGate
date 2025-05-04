import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { GameAction } from "@/store/actions";
import { gameReducer, initialState } from "@/store/reducers/gameReducer";
import { GameState } from "@/types/gameState";

// Create the game context
interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Game provider component
interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Game tick effect - runs every 100ms
  useEffect(() => {
    const tickInterval = setInterval(() => {
      dispatch({ type: "TICK", payload: { currentTime: Date.now() } });
    }, 100);

    // Auto-save every minute
    const saveInterval = setInterval(() => {
      dispatch({ type: "SAVE_GAME" });
    }, 60000);

    // Try to load saved game on first mount
    const savedState = localStorage.getItem("deepvoidgate_save");
    if (savedState) {
      dispatch({ type: "LOAD_GAME" });
    } else {
      // Start with some initial buildings for new game
      console.log("Initial buildings:", state.buildings);
    }

    return () => {
      clearInterval(tickInterval);
      clearInterval(saveInterval);
    };
  }, []);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the game context
export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
