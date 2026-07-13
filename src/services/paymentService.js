import api from "./api";

const paymentService = {
  // Extend this when integrating Stripe / PayPal
  getPayment: (orderId) => api.get(`/payments/${orderId}/`),
};

export default paymentService;
