import api from "./api";

const orderService = {
  getOrders: () => api.get("/orders/"),
  getOrder: (id) => api.get(`/orders/${id}/`),
  createOrder: (data) => api.post("/orders/create/", data),
};

export default orderService;
