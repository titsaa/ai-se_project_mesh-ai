import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { CurrentUser } from "../types";
import { getCurrentUser } from "../utils/api";

type AuthContextType = {
  currentUser: CurrentUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: CurrentUser) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth-token");

    if (!token) {
      setIsLoading(false);
      return;
    }

    getCurrentUser()
      .then((res) => {
        if (res.data) {
          setCurrentUser(res.data);
          setIsAuthenticated(true);
        }
      })
      .catch(() => {
        localStorage.removeItem("auth-token");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = (token: string, user: CurrentUser) => {
    localStorage.setItem("auth-token", token);
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const value = useMemo<AuthContextType>(
    () => ({
      currentUser,
      isAuthenticated,
      isLoading,
      login,
    }),
    [currentUser, isAuthenticated, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
