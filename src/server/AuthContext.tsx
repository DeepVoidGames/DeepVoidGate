import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Client, Session } from "@heroiclabs/nakama-js";
import { v4 as uuidv4 } from "uuid";

// Konfiguracja klienta Nakama
export const client = new Client("defaultkey", "192.168.4.200", "7350", false);

type AuthContextType = {
  session: Session | null;
  loading: boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authenticate = async () => {
      let deviceId = localStorage.getItem("device_id");
      if (!deviceId) {
        deviceId = uuidv4();
        localStorage.setItem("device_id", deviceId);
      }
      try {
        const s = await client.authenticateDevice(deviceId, true);
        setSession(s);
        console.log("Authenticated! User ID:", s.user_id);
      } catch (e) {
        console.log(e);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };
    authenticate();
  }, []);

  const logout = () => {
    setSession(null);
    localStorage.removeItem("device_id");
  };

  return (
    <AuthContext.Provider value={{ session, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
