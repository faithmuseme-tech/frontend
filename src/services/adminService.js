import api from "./api";

const adminService = {
  getStats: () => api.get("/admin/stats/"),
  getAnalytics: () => api.get("/admin/analytics/"),

  getUsers: (role) => api.get("/admin/users/", { params: role ? { role } : {} }),
  updateUser: (id, data) => api.patch(`/admin/users/${id}/`, data),

  getTraders: (status) => api.get("/admin/traders/", { params: status ? { status } : {} }),
  traderAction: (id, action) => api.post(`/admin/traders/${id}/action/`, { action }),
  deleteTrader: (id) => api.post(`/admin/traders/${id}/action/`, { action: 'delete' }),

  getOrders: (status) => api.get("/admin/orders/", { params: status ? { status } : {} }),
  getOrder: (id) => api.get(`/admin/orders/${id}/`),
  updateOrder: (id, data) => api.patch(`/admin/orders/${id}/`, data),
  updateOrderStatus: (id, status) => api.post(`/admin/orders/${id}/status/`, { status }),
  getOrderByNumber: (orderNumber) => api.get(`/admin/orders/lookup/`, { params: { order_number: orderNumber } }),

  getProducts: () => api.get("/admin/products/"),
  getProduct: (id) => api.get(`/admin/products/${id}/`),
  updateProduct: (id, data) => api.patch(`/admin/products/${id}/`, data, { headers: { "Content-Type": "multipart/form-data" } }),
  deleteProduct: (id) => api.delete(`/admin/products/${id}/`),
  toggleProduct: (id) => api.post(`/admin/products/${id}/toggle/`),
  addProductImage: (id, formData) => api.post(`/admin/products/${id}/images/`, formData, { headers: { "Content-Type": "multipart/form-data" } }),
  deleteProductImage: (id, imageId) => api.delete(`/admin/products/${id}/images/`, { data: { image_id: imageId } }),
  resetPassword: (id, newPassword) => api.post(`/admin/users/${id}/reset-password/`, { new_password: newPassword }),

  getCategories: () => api.get("/categories/admin/"),
  createCategory: (data) => api.post("/categories/admin/", data, { headers: { "Content-Type": "multipart/form-data" } }),
  updateCategory: (id, data) => api.patch(`/categories/admin/${id}/`, data, { headers: { "Content-Type": "multipart/form-data" } }),
  deleteCategory: (id) => api.delete(`/categories/admin/${id}/`),

  getBrands: () => api.get("/brands/admin/"),
  createBrand: (data) => api.post("/brands/admin/", data, { headers: { "Content-Type": "multipart/form-data" } }),
  updateBrand: (id, data) => api.patch(`/brands/admin/${id}/`, data, { headers: { "Content-Type": "multipart/form-data" } }),
  deleteBrand: (id) => api.delete(`/brands/admin/${id}/`),

  getSettings: () => api.get("/admin/settings/"),
  updateSettings: (data) => api.patch("/admin/settings/", data),

  getInquiries: (status) => api.get("/contact/admin/inquiries/", { params: status ? { status } : {} }),
  updateInquiry: (id, data) => api.patch(`/contact/admin/inquiries/${id}/`, data),
  deleteInquiry: (id) => api.delete(`/contact/admin/inquiries/${id}/`),

  getReturns: (status) => api.get("/orders/admin/returns/", { params: status ? { status } : {} }),
  updateReturn: (id, data) => api.patch(`/orders/admin/returns/${id}/`, data),

  getInsights: () => api.get("/insights/"),

  getEmployees: () => api.get("/admin/employees/"),
  addEmployee: (data) => api.post("/admin/employees/", data),
  updateEmployee: (id, data) => api.patch(`/admin/employees/${id}/`, data),
  deleteEmployee: (id) => api.delete(`/admin/employees/${id}/`),
  employeeSetPassword: (data) => api.post("/admin/employees/set-password/", data),
};

export default adminService;
