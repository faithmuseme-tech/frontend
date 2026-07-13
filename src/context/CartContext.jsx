import React, { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import api from "../services/api";
import authService from "../services/authService";

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case "SET": return { ...state, items: action.payload, synced: true };
    case "ADD_ITEM": {
      const exists = state.items.find((i) => i.id === action.payload.id);
      if (exists) {
        return { ...state, items: state.items.map((i) => i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i) };
      }
      return { ...state, items: [...state.items, { ...action.payload, qty: 1 }] };
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

const API_BASE = process.env.REACT_APP_API_URL?.replace('/api/v1', '') || 'http://127.0.0.1:8000';

const toAbsolute = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API_BASE}${url}`;
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
  }));

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], synced: false });

  // Fetch cart from backend if authenticated
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
    dispatch({ type: "ADD_ITEM", payload: product });
    if (authService.isAuthenticated()) {
      try {
        const res = await api.post("/cart/", { product_id: product.id, quantity: 1 });
        dispatch({ type: "SET", payload: normalizeItems(res.data.items) });
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

  const updateQty = async (id, qty) => {
    const item = state.items.find((i) => i.id === id);
    dispatch({ type: "UPDATE_QTY", payload: { id, qty } });
    if (authService.isAuthenticated() && item?.cartItemId) {
      try {
        const res = await api.patch("/cart/", { item_id: item.cartItemId, quantity: qty });
        dispatch({ type: "SET", payload: normalizeItems(res.data.items) });
      } catch { /* keep local */ }
    }
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
    <CartContext.Provider value={{ items: state.items, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
