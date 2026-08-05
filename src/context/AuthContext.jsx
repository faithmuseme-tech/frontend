import React, { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authService.isAuthenticated()) {
      authService.getProfile()
        .then((res) => {
          setUser(res.data);
          if (Array.isArray(res.data.employee_permissions)) {
            localStorage.setItem("employee_permissions", JSON.stringify(res.data.employee_permissions));
          } else {
            localStorage.removeItem("employee_permissions");
          }
        })
        .catch(() => {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (phone, password) => {
    const data = await authService.login(phone, password);
    setUser(data.user || (await authService.getProfile()).data);
    return data;
  };

  const register = async (formData) => {
    const res = await authService.register(formData);
    if (res.data.access) {
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      setUser(res.data.user);
    }
    return res.data;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const updateUser = (data) => setUser((prev) => ({ ...prev, ...data }));

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
