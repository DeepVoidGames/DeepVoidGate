import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useGame } from "@/context/GameContext";

// --- Interfejsy ---
interface OnlineStats {
  online_count: number;
  last_update: string;
}

interface AnalyticsContextType {
  connected: boolean;
  onlineStats: OnlineStats | null;
  reconnectAttempts: number;
  requestOnlineCount: () => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(
  undefined
);

const WS_URL = "wss://api.fern.fun/deepvoidgate/ws";

interface AnalyticsProviderProps {
  children: ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({
  children,
}) => {
  const socketRef = useRef<WebSocket | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [connected, setConnected] = useState(false);
  const [onlineStats, setOnlineStats] = useState<OnlineStats | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const { state } = useGame();

  const sendWebSocketHeartbeat = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: "heartbeat" }));
      console.log("[AnalyticsContext] WebSocket heartbeat sent");
    }
  }, []);

  const requestOnlineCount = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: "get_online_count" }));
      console.log("[AnalyticsContext] Requested online count via WebSocket");
    }
  }, []);

  const updateOnlineStats = useCallback(
    (newCount: number, timestamp: string | undefined = undefined) => {
      setOnlineStats((prevStats) => {
        if (prevStats && prevStats.online_count === newCount) {
          return prevStats; // Ważne: ZWRACAMY TEN SAM OBIEKT
        }
        return {
          online_count: newCount,
          last_update: timestamp || new Date().toISOString(),
        };
      });
    },
    []
  );

  const connectWebSocket = useCallback(() => {
    if (!state.userID) {
      console.warn(
        "[AnalyticsContext] No userID available, cannot connect WebSocket."
      );
      return;
    }
    if (
      socketRef.current &&
      (socketRef.current.readyState === WebSocket.CONNECTING ||
        socketRef.current.readyState === WebSocket.OPEN)
    ) {
      console.log(
        "[AnalyticsContext] WebSocket already connecting or open, skipping new connection attempt."
      );
      return;
    }

    console.log("[AnalyticsContext] Attempting WebSocket connection...");
    const socket = new WebSocket(`${WS_URL}?user_id=${state.userID}`);
    socketRef.current = socket;

    const connectionTimeout = setTimeout(() => {
      if (socket.readyState === WebSocket.CONNECTING) {
        console.log("[AnalyticsContext] Connection timeout, closing socket.");
        socket.close();
      }
    }, 10000);

    socket.onopen = () => {
      clearTimeout(connectionTimeout);
      setConnected(true);
      setReconnectAttempts(0);
      console.log("[AnalyticsContext] WebSocket connected to server:", WS_URL);

      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      heartbeatIntervalRef.current = setInterval(
        sendWebSocketHeartbeat,
        120000
      );

      requestOnlineCount();
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case "connection_established":
            // Użyj nowej funkcji updateOnlineStats
            updateOnlineStats(data.online_count || 0, data.timestamp);
            if (data.heartbeat_interval && heartbeatIntervalRef.current) {
              clearInterval(heartbeatIntervalRef.current);
              heartbeatIntervalRef.current = setInterval(
                sendWebSocketHeartbeat,
                (data.heartbeat_interval * 1000) / 2
              );
            }
            break;

          case "heartbeat_ack":
            // Użyj nowej funkcji updateOnlineStats
            updateOnlineStats(data.online_count || 0, data.timestamp);
            break;

          case "online_count_update":
            // Użyj nowej funkcji updateOnlineStats
            updateOnlineStats(data.count || 0, data.timestamp);
            break;

          case "online_count_response":
            // Użyj nowej funkcji updateOnlineStats
            updateOnlineStats(data.count || 0, data.timestamp);
            break;

          case "save_status":
            console.log(
              "[AnalyticsContext] Game save status:",
              data.status,
              data.message
            );
            break;

          case "ping":
            socket.send(JSON.stringify({ type: "pong" }));
            break;

          case "error":
            console.error("[AnalyticsContext] Server error:", data.message);
            break;

          default:
            console.log(
              "[AnalyticsContext] Unknown message type:",
              data.type,
              data
            );
        }
      } catch (e) {
        console.warn(
          "[AnalyticsContext] Invalid JSON or message format:",
          event.data,
          e
        );
      }
    };

    socket.onerror = (error) => {
      clearTimeout(connectionTimeout);
      console.error("[AnalyticsContext] WebSocket error:", error);
    };

    socket.onclose = (event) => {
      clearTimeout(connectionTimeout);
      setConnected(false);
      console.log(
        "[AnalyticsContext] WebSocket closed:",
        event.code,
        event.reason
      );

      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }

      const MAX_RECONNECT_ATTEMPTS = 5;
      if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
        console.log(
          `[AnalyticsContext] Reconnecting in ${delay}ms... (attempt ${
            reconnectAttempts + 1
          })`
        );

        reconnectTimeoutRef.current = setTimeout(() => {
          setReconnectAttempts((prev) => prev + 1);
          connectWebSocket();
        }, delay);
      } else {
        console.error(
          `[AnalyticsContext] Max reconnect attempts (${MAX_RECONNECT_ATTEMPTS}) reached. Giving up.`
        );
      }
    };
  }, [
    state.userID,
    reconnectAttempts,
    sendWebSocketHeartbeat,
    requestOnlineCount,
    updateOnlineStats, // Dodano do zależności connectWebSocket
  ]);

  // Główny useEffect do inicjalizacji połączenia
  useEffect(() => {
    if (!state.userID) {
      console.log(
        "[AnalyticsContext] No userID, skipping WebSocket connection."
      );
      setConnected(false);
      setOnlineStats(null); // Tutaj też zresetuj state, a nie twórz nowy obiekt OnlineStats
      setReconnectAttempts(0);
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      return;
    }

    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    setReconnectAttempts(0);
    connectWebSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [state.userID, connectWebSocket]);

  // Hook do obsługi visibility API
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && state.userID && connected) {
        console.log(
          "[AnalyticsContext] Tab became visible, sending immediate heartbeat and requesting online count."
        );
        sendWebSocketHeartbeat();
        requestOnlineCount();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [connected, sendWebSocketHeartbeat, requestOnlineCount, state.userID]);

  // Hook do obsługi beforeunload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(
          JSON.stringify({ type: "disconnecting", userID: state.userID })
        );
        socketRef.current.close();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [state.userID]);

  // Wartości udostępniane przez kontekst
  const contextValue: AnalyticsContextType = React.useMemo(
    () => ({
      connected,
      onlineStats,
      reconnectAttempts,
      requestOnlineCount,
    }),
    [connected, onlineStats, reconnectAttempts, requestOnlineCount]
  );

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
};

// --- Custom Hook do użycia kontekstu ---
export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider");
  }
  return context;
};
