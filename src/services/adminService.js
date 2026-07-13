import api from "./api";

const adminService = {
  getStats: () => api.get("/admin/stats/"),

  getUsers: (role) => api.get("/admin/users/", { params: role ? { role } : {} }),
  updateUser: (id, data) => api.patch(`/admin/users/${id}/`, data),

  getTraders: (status) => api.get("/admin/traders/", { params: status ? { status } : {} }),
  traderAction: (id, action) => api.post(`/admin/traders/${id}/action/`, { action }),

  getOrders: (status) => api.get("/admin/orders/", { params: status ? { status } : {} }),
  updateOrder: (id, data) => api.patch(`/admin/orders/${id}/`, data),
  updateOrderStatus: (id, status) => api.post(`/admin/orders/${id}/status/`, { status }),
  getOrderByNumber: (orderNumber) => api.get(`/admin/orders/lookup/`, { params: { order_number: orderNumber } }),

  getProducts: () => api.get("/admin/products/"),
  toggleProduct: (id) => api.post(`/admin/products/${id}/toggle/`),

  getCategories: () => api.get("/categories/admin/"),
  createCategory: (data) => api.post("/categories/admin/", data),
  updateCategory: (id, data) => api.patch(`/categories/admin/${id}/`, data),
  deleteCategory: (id) => api.delete(`/categories/admin/${id}/`),
};

export default adminService;
