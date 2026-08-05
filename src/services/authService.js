import api from "./api";
import axios from "axios";

const authService = {
  register: (data) => api.post("/auth/register/", data),

  login: async (phone, password) => {
    const res = await api.post("/auth/login/", { phone, password });
    localStorage.setItem("access_token", res.data.access);
    localStorage.setItem("refresh_token", res.data.refresh);
    if (res.data.employee_permissions) {
      localStorage.setItem("employee_permissions", JSON.stringify(res.data.employee_permissions));
    } else {
      localStorage.removeItem("employee_permissions");
    }
    return res.data;
  },

  logout: async () => {
    const refresh = localStorage.getItem("refresh_token");
    try {
      await api.post("/auth/logout/", { refresh });
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("employee_permissions");
    }
  },

  getProfile: () => api.get("/auth/profile/"),

  updateProfile: (data) => api.patch("/auth/profile/", data),

  updateAvatar: (formData) => api.patch("/auth/profile/", formData, { headers: { "Content-Type": "multipart/form-data" } }),

  changePassword: (data) => api.post("/auth/change-password/", data),

  deleteAccount: () => api.delete("/auth/delete-account/", { data: { refresh: localStorage.getItem("refresh_token") } }),

  closeAccount: () => api.post("/auth/close-account/", { refresh: localStorage.getItem("refresh_token") }),

  isAuthenticated: () => !!localStorage.getItem("access_token"),
};

export default authService;
