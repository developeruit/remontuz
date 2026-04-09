import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase";
import { api } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    try {
      const p = await api.me();
      setUser(p);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session) await loadProfile();
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) loadProfile();
      else setUser(null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    await loadProfile();
    return res.user;
  };

  const register = async (data) => {
    const res = await api.register(data);
    // Supabase email confirmation yoqilgan bo'lsa session bo'lmasligi mumkin
    await loadProfile();
    return res.user;
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
