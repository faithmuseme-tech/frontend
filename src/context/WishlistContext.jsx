import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";
import api from "../services/api";
import { toAbsolute } from "../utils/imageUrl";

const WishlistContext = createContext();

const NUDGE_DELAY_MS = 3 * 60 * 1000; // 3 minutes
const NUDGE_COOLDOWN_MS = 30 * 60 * 1000;
const NUDGE_STORAGE_KEY = "wishlist_nudge_last";

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
  const [nudgeProduct, setNudgeProduct] = useState(null);
  const nudgeTimers = useRef({}); // productId -> timeoutId

  const fetchWishlist = useCallback(() => {
    api.get("/wishlist/")
      .then((res) => setItems((res.data.products || []).map(normalizeProduct)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (user) fetchWishlist();
    else setItems([]);
  }, [user, fetchWishlist]);

  // Schedule a nudge for a product after NUDGE_DELAY_MS if not added to cart
  const scheduleNudge = useCallback((product, cartItems) => {
    // Clear any existing timer for this product
    clearTimeout(nudgeTimers.current[product.id]);

    nudgeTimers.current[product.id] = setTimeout(() => {
      // Check cooldown
      const last = parseInt(localStorage.getItem(NUDGE_STORAGE_KEY) || "0", 10);
      if (Date.now() - last < NUDGE_COOLDOWN_MS) return;

      // Only fire if product is still in wishlist and NOT in cart
      setItems((current) => {
        const stillWishlisted = current.some((i) => i.id === product.id);
        if (!stillWishlisted) return current;

        const inCart = (cartItems || []).some((c) => c.id === product.id);
        if (inCart) return current;

        localStorage.setItem(NUDGE_STORAGE_KEY, String(Date.now()));
        setNudgeProduct(product);
        return current;
      });
    }, NUDGE_DELAY_MS);
  }, []);

  const dismissNudge = useCallback(() => setNudgeProduct(null), []);

  const toggle = async (product, cartItems) => {
    const alreadyIn = items.some((i) => i.id === product.id);

    setItems((prev) =>
      alreadyIn ? prev.filter((i) => i.id !== product.id) : [...prev, product]
    );

    if (!alreadyIn) {
      // Just wishlisted — start nudge timer
      scheduleNudge(product, cartItems);
    } else {
      // Removed from wishlist — cancel timer
      clearTimeout(nudgeTimers.current[product.id]);
    }

    if (user) {
      try {
        await api.post("/wishlist/", { product_id: product.id });
      } catch {
        setItems((prev) =>
          alreadyIn ? [...prev, product] : prev.filter((i) => i.id !== product.id)
        );
      }
    }
  };

  const isWishlisted = (id) => items.some((i) => i.id === id);

  return (
    <WishlistContext.Provider value={{ items, toggle, isWishlisted, count: items.length, fetchWishlist, nudgeProduct, dismissNudge }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
