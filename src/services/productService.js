import api from "./api";

const productService = {
  // Lists
  getAll: (params) => api.get("/products/", { params }),
  getFeatured: () => api.get("/products/featured/"),
  getNewArrivals: () => api.get("/products/new-arrivals/"),
  getBestSellers: () => api.get("/products/best-sellers/"),
  getFlashDeals: () => api.get("/products/flash-deals/"),
  search: (q, params) => api.get("/products/search/", { params: { q, ...params } }),

  // Single product
  getBySlug: (slug) => api.get(`/products/${slug}/`),
  getRelated: (slug) => api.get(`/products/${slug}/related/`),

  // Categories
  getCategories: () => api.get("/categories/"),
  getCategoryBySlug: (slug) => api.get(`/categories/${slug}/`),

  // Brands
  getBrands: () => api.get("/brands/"),
  getBrandBySlug: (slug) => api.get(`/brands/${slug}/`),

  // Reviews
  getReviews: (productId) => api.get(`/reviews/${productId}/`),
  addReview: (productId, data) => api.post(`/reviews/${productId}/`, data),
};

export default productService;
