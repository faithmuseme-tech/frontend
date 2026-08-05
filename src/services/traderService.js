import api from "./api";

const traderService = {
  register: (data) => api.post("/auth/trader/register/", data),
  getProfile: () => api.get("/auth/trader/profile/"),
  updateProfile: (data) => api.patch("/auth/trader/profile/", data),

  getProducts: (search = "") => api.get(`/products/trader/${search ? `?search=${encodeURIComponent(search)}` : ""}`),
  getProduct: (id) => api.get(`/products/trader/${id}/`),
  createProduct: (data) => api.post("/products/trader/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  }),
  updateProduct: (id, data) => api.patch(`/products/trader/${id}/`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  }),
  deleteProduct: (id) => api.delete(`/products/trader/${id}/`),
  uploadImage: (id, file) => {
    const fd = new FormData();
    fd.append("image", file);
    return api.post(`/products/trader/${id}/images/`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  deleteImage: (id, imageId) =>
    api.delete(`/products/trader/${id}/images/`, { data: { image_id: imageId } }),

  // Flash Deals
  getFlashDeals: () => api.get("/flash-deals/trader/"),
  createFlashDeal: (data) => api.post("/flash-deals/trader/", data),
  deleteFlashDeal: (id) => api.delete(`/flash-deals/trader/${id}/`),

  // Orders
  getOrders: () => api.get("/orders/trader/"),
  getStats: () => api.get("/orders/trader/stats/"),
};

export default traderService;
