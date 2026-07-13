import api from "./api";

const traderService = {
  register: (data) => api.post("/auth/trader/register/", data),
  getProfile: () => api.get("/auth/trader/profile/"),
  updateProfile: (data) => api.patch("/auth/trader/profile/", data),

  getProducts: () => api.get("/products/trader/"),
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
};

export default traderService;
