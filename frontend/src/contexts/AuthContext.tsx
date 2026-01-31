"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Cookies from "js-cookie";

interface User {
  userId: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string, userId: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");
    const userId = Cookies.get("userId");
    if (token && userId) {
      setUser({ token, userId });
    }
    setIsLoading(false);
  }, []);

  const login = (token: string, userId: string) => {
    Cookies.set("token", token, { expires: 1 }); // 24h
    Cookies.set("userId", userId, { expires: 1 });
    setUser({ token, userId });
  };

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("userId");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
