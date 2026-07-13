import api from "./api";

const authService = {
  register: (data) => api.post("/auth/register/", data),

  login: async (email, password) => {
    const res = await api.post("/auth/login/", { email, password });
    localStorage.setItem("access_token", res.data.access);
    localStorage.setItem("refresh_token", res.data.refresh);
    return res.data;
  },

  logout: async () => {
    const refresh = localStorage.getItem("refresh_token");
    try {
      await api.post("/auth/logout/", { refresh });
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  },

  getProfile: () => api.get("/auth/profile/"),

  updateProfile: (data) => api.patch("/auth/profile/", data),

  changePassword: (data) => api.post("/auth/change-password/", data),

  isAuthenticated: () => !!localStorage.getItem("access_token"),
};

export default authService;
