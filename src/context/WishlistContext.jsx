import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import api from "../services/api";

const WishlistContext = createContext();

const API_BASE = process.env.REACT_APP_API_URL?.replace("/api/v1", "") || "http://127.0.0.1:8000";
const toAbsolute = (url) => (!url ? "" : url.startsWith("http") ? url : `${API_BASE}${url}`);

const normalizeProduct = (p) => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  brand: p.brand_name || p.brand?.name || "",
  category: p.category_name || p.category?.name || "",
  price: parseFloat(p.price),
  originalPrice: p.original_price ? parseFloat(p.original_price) : null,
  deliveryCharge: p.delivery_charge !== undefined ? parseFloat(p.delivery_charge) : 0,
  discount: p.discount || 0,
  image: toAbsolute(p.primary_image),
  inStock: p.in_stock,
  badge: p.badge || "",
  rating: p.avg_rating || 0,
  reviews: p.review_count || 0,
});

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  // Load wishlist from backend when user logs in
  const fetchWishlist = useCallback(() => {
    api.get("/wishlist/")
      .then((res) => setItems((res.data.products || []).map(normalizeProduct)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setItems([]);
    }
  }, [user, fetchWishlist]);

  const toggle = async (product) => {
    // Optimistic update
    const alreadyIn = items.some((i) => i.id === product.id);
    setItems((prev) =>
      alreadyIn ? prev.filter((i) => i.id !== product.id) : [...prev, product]
    );

    if (user) {
      try {
        await api.post("/wishlist/", { product_id: product.id });
      } catch {
        // Revert on failure
        setItems((prev) =>
          alreadyIn ? [...prev, product] : prev.filter((i) => i.id !== product.id)
        );
      }
    }
  };

  const isWishlisted = (id) => items.some((i) => i.id === id);

  return (
    <WishlistContext.Provider value={{ items, toggle, isWishlisted, count: items.length, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
