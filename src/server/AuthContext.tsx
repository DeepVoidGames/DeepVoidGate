import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Client, Session } from "@heroiclabs/nakama-js";
import { v4 as uuidv4 } from "uuid";
import { API_KEY } from "@/key";

export const client = new Client(API_KEY, "api.deepvoid.dev", "443", true);

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
      let customId = localStorage.getItem("custom_id");
      if (!customId) {
        customId = uuidv4();
        localStorage.setItem("custom_id", customId);
      }
      try {
        const s = await client.authenticateCustom(customId);
        setSession(s);
        console.log("Authenticated! User ID:", s.user_id);
      } catch (e) {
        console.error("Authentication error:", e);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };
    authenticate();
  }, []);

  const logout = () => {
    setSession(null);
    localStorage.removeItem("custom_id");
  };

  return (
    <AuthContext.Provider value={{ session, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
