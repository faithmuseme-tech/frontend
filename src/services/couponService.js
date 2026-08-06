import api from "./api";

const couponService = {
  preview: (data) => api.post("/promotions/preview/", data),
  validateCoupon: (code) => api.post("/promotions/validate-coupon/", { code }),
  getLoyalty: () => api.get("/promotions/loyalty/"),
  getMyCoupons: () => api.get("/promotions/my-coupons/"),
};

export default couponService;
