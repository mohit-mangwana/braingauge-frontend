import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authAPI } from "../api/services";
import { getErrorMessage } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")); }
    catch { return null; }
  });
  const [token,   setToken]   = useState(() => localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true); // initial /me check

 
  useEffect(() => {
    if (!token) { setLoading(false); return; }

    authAPI.getMe()
      .then(({ user: freshUser }) => {
        setUser(freshUser);
        localStorage.setItem("user", JSON.stringify(freshUser));
      })
      .catch(() => {
       
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []); 

  function persist(token, user) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(token);
    setUser(user);
  }

  const login = useCallback(async (email, password) => {
    const data = await authAPI.login(email, password); // throws on error
    console.log(data)
    persist(data.token, data.user);
      await authAPI.getMe()
    .then(({ user: freshUser }) => {
      persist(data.token, freshUser);
    });
    return data.user;
  }, []);

  
  const register = useCallback(async (formData) => {
    const data = await authAPI.register(formData);
    persist(data.token, data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);


  const updateUser = useCallback((partial) => {
    setUser((prev) => {
      const updated = { ...prev, ...partial };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    logout,
    register,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}