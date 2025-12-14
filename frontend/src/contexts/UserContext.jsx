// src/contexts/UserContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // load user from backend (expects GET /auth/me or change path)
  const loadUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return null;
    }
    setLoading(true);
    try {
      const res = await api.get("/auth/me"); // change endpoint if needed
      // if api returns user object as res.data or res.data.data adjust below
      const u = res?.data ?? res?.data?.data ?? null;

      setUser(u.user);
      setLoading(false);
      return u;
    } catch (e) {
      setUser(null);
      setLoading(false);
      return null;
    }
  };

  // optionally auto-load on mount if token exists
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) {
      // set header pre-emptively (safe) — if interceptor exists it's ok
      api.defaults.headers.common["Authorization"] = "Bearer " + t;
      loadUser();
    }
  }, []);

  const value = {
    user,
    setUser,
    loadUser,
    loading
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
