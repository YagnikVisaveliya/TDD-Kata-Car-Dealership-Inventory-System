import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import Cookies from "js-cookie";
import type { User } from "../types/User";
import { login as loginApi, register as registerApi } from "../api/auth";
import { onUnauthorized } from "../api/authEvents";
import { toast } from "react-hot-toast/headless";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => Cookies.get("token") ?? null);
  const [user, setUser] = useState<User | null>(() => {
    const stored = Cookies.get("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  function persist(newToken: string, newUser: User) {
    Cookies.set("token", newToken, { expires: 7 });
    Cookies.set("user", JSON.stringify(newUser), { expires: 7 });
    setToken(newToken);
    setUser(newUser);
  }

  async function login(email: string, password: string) {
    setLoading(true);
    try {
      const res = await loginApi(email, password);
      persist(res.token, res.user);
    } finally {
      setLoading(false);
    }
  }

  async function register(name: string, email: string, password: string) {
    setLoading(true);
    try {
      const res = await registerApi(name, email, password);
      persist(res.token, res.user);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    Cookies.remove("token");
    Cookies.remove("user");
    setToken(null);
    setUser(null);
  }
  useEffect(() => {
    onUnauthorized(() => {
      logout();
      toast.error("Session expired. Please log in again.");
    });
  }, []);
  

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}