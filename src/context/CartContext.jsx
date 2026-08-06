import React, { createContext, useContext, useReducer, useEffect, useCallback, useState, useRef } from "react";
import api from "../services/api";
import authService from "../services/authService";
import { toAbsolute } from "../utils/imageUrl";

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case "SET": return { ...state, items: action.payload, synced: true };
    case "ADD_ITEM": {
      const exists = state.items.find((i) => i.id === action.payload.id);
      const addQty = action.payload.qty || 1;
      if (exists) {
        return { ...state, items: state.items.map((i) => i.id === action.payload.id ? { ...i, qty: i.qty + addQty } : i) };
      }
      return { ...state, items: [...state.items, { ...action.payload, qty: addQty }] };
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.id !== action.payload) };
    case "UPDATE_QTY":
      return { ...state, items: state.items.map((i) => i.id === action.payload.id ? { ...i, qty: action.payload.qty } : i) };
    case "CLEAR":
      return { ...state, items: [] };
    default:
      return state;
  }
};

// Normalize backend cart items to local shape
const normalizeItems = (backendItems) =>
  backendItems.map((item) => ({
    id: item.product.id,
    cartItemId: item.id,
    name: item.product.name,
    price: parseFloat(item.product.price),
    image: toAbsolute(item.product.primary_image),
    brand: item.product.brand_name,
    qty: item.quantity,
    selected_options: item.selected_options || {},
  }));

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], synced: false });
  const [nudgeActive, setNudgeActive] = useState(false);

  // Fetch cart from backend if authenticated — only once per session mount
  const fetchCart = useCallback(async () => {
    if (!authService.isAuthenticated()) return;
    try {
      const res = await api.get("/cart/");
      dispatch({ type: "SET", payload: normalizeItems(res.data.items) });
    } catch {
      // silently fail — use local state
    }
  }, []);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addItem = async (product) => {
    const qty = product.qty || 1;
    dispatch({ type: "ADD_ITEM", payload: product });
    if (authService.isAuthenticated()) {
      try {
        const res = await api.post("/cart/", { product_id: product.id, quantity: qty, selected_options: product.selected_options || {} });
        const normalized = normalizeItems(res.data.items);
        // Backend always returns primary_image — restore the chosen image for this product
        const patched = normalized.map(i => i.id === product.id ? { ...i, image: product.image } : i);
        dispatch({ type: "SET", payload: patched });
      } catch { /* keep local */ }
    }
  };

  const removeItem = async (id) => {
    const item = state.items.find((i) => i.id === id);
    dispatch({ type: "REMOVE_ITEM", payload: id });
    if (authService.isAuthenticated() && item?.cartItemId) {
      try {
        const res = await api.delete("/cart/", { data: { item_id: item.cartItemId } });
        dispatch({ type: "SET", payload: normalizeItems(res.data.items) });
      } catch { /* keep local */ }
    }
  };

  const updateQtyTimers = useRef({});

  const updateQty = (id, qty) => {
    dispatch({ type: "UPDATE_QTY", payload: { id, qty } });
    if (!authService.isAuthenticated()) return;
    const cartItemId = state.items.find((i) => i.id === id)?.cartItemId;
    if (!cartItemId) return;
    // Debounce: cancel any pending PATCH for this item and wait for the user to stop clicking
    clearTimeout(updateQtyTimers.current[id]);
    updateQtyTimers.current[id] = setTimeout(async () => {
      try {
        await api.patch("/cart/", { item_id: cartItemId, quantity: qty });
      } catch { /* keep local */ }
    }, 400);
  };

  const clearCart = async () => {
    dispatch({ type: "CLEAR" });
    if (authService.isAuthenticated()) {
      try { await api.delete("/cart/"); } catch { /* keep local */ }
    }
  };

  const totalItems = state.items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = state.items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ items: state.items, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice, fetchCart, nudgeActive, setNudgeActive }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
