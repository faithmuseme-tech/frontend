import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiTrash2, FiMinus, FiPlus, FiShoppingBag,
  FiArrowLeft, FiArrowRight, FiTag,
  FiShield, FiChevronRight,
} from "react-icons/fi";
import { Truck, Package, Calendar } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { formatUGX } from "../../utils/currency";

// Delivery fee rules:
// 1 product line  → UGX 10,000 × qty
// 2+ product lines → UGX 5,000 × qty  (all regions)
const SINGLE_FEE = 10000;
const MULTI_FEE  = 5000;

const DELIVERY_CAP = 90_000;

const getTotalQty = (items = []) => items.reduce((sum, i) => sum + (i.qty || 1), 0);

const getDeliveryFee = (items = []) => {
  const totalQty = getTotalQty(items);
  if (totalQty <= 1) return SINGLE_FEE;
  const unitsAtNormal = Math.min(totalQty, Math.floor(DELIVERY_CAP / MULTI_FEE));
  const unitsDiscounted = totalQty - unitsAtNormal;
  return unitsAtNormal * MULTI_FEE + unitsDiscounted * 4_500;
};

const getFeePerItem = (items = []) => {
  const totalQty = getTotalQty(items);
  if (totalQty <= 1) return SINGLE_FEE;
  return MULTI_FEE * totalQty > DELIVERY_CAP ? 4_500 : MULTI_FEE;
};

const getDeliveryDate = () => {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 6=Sat
  const hour = now.getHours();
  // Saturday after noon → skip Sunday, add 3 days
  let daysAhead = (day === 6 && hour >= 12) ? 3 : 2;
  const d = new Date(now);
  d.setDate(d.getDate() + daysAhead);
  // Never land on Sunday (0)
  if (d.getDay() === 0) d.setDate(d.getDate() + 1);
  return d.toLocaleDateString('en-UG', { weekday: 'long', month: 'short', day: 'numeric' });
};

const CartPage = () => {
  const { items, removeItem, updateQty, clearCart, totalPrice } = useCart();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState("");
  const [couponMsg, setCouponMsg] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [removing, setRemoving] = useState(null);

  const totalQty = items.reduce((s, i) => s + i.qty, 0);
  const feePerItem = getFeePerItem(items);
  const shipping = getDeliveryFee(items);
  const grandTotal = totalPrice - discount + shipping;

  const handleRemove = (id) => {
    setRemoving(id);
    setTimeout(() => { removeItem(id); setRemoving(null); }, 300);
  };

  const handleQty = (id, qty) => { if (qty >= 1) updateQty(id, qty); };

  const handleCoupon = () => {
    if (coupon.trim().toUpperCase() === "SAVE10") {
      setDiscount(Math.round(totalPrice * 0.1));
      setCouponMsg({ ok: true, text: "10% discount applied!" });
    } else {
      setDiscount(0);
      setCouponMsg({ ok: false, text: "Invalid coupon code." });
    }
    setTimeout(() => setCouponMsg(null), 3000);
  };

  // ── Empty state ───────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 gap-5">
        <div className="w-28 h-28 bg-primary-50 rounded-full flex items-center justify-center">
          <FiShoppingBag className="text-5xl text-primary-300" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-gray-800">Your cart is empty</h2>
          <p className="text-gray-400 text-sm mt-1">Add some products and come back here.</p>
        </div>
        <Link
          to="/shop"
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-7 py-3 rounded-xl transition-colors shadow-md"
        >
          <FiArrowLeft /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16">

      {/* ── Breadcrumb ──────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <FiChevronRight className="text-xs" />
          <Link to="/shop" className="hover:text-primary-600 transition-colors">Shop</Link>
          <FiChevronRight className="text-xs" />
          <span className="text-gray-800 font-semibold">Cart</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">

        {/* ── Page title row ───────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Shopping Cart</h1>
            <p className="text-sm text-gray-400 mt-0.5">{totalQty} item{totalQty !== 1 ? "s" : ""}</p>
          </div>
          <button
            onClick={clearCart}
            className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-semibold border border-red-200 hover:border-red-400 px-4 py-2 rounded-xl transition-all"
          >
            <FiTrash2 className="text-base" /> Clear Cart
          </button>
        </div>

                {/* ── Delivery notice ───────────────────────────────────────────── */}
        <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-3.5 mb-6 flex items-start gap-3">
          <Package size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-green-800 flex items-center gap-1.5">
              <Calendar size={14} className="text-green-600" />
              Order today and get it delivered by {getDeliveryDate()}
            </p>
            <p className="text-xs text-gray-600 mt-0.5">
              {items.length === 1 && items[0].qty === 1
                ? <><span className="font-semibold text-gray-800">{formatUGX(SINGLE_FEE)}</span> per product — order more than 1 to save!</>
                : <><span className="font-semibold text-gray-800">{formatUGX(MULTI_FEE)}</span> per product (multi-item discount applied) — all regions</>
              }
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── LEFT: Cart Table ─────────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

              {/* Table header — hidden on mobile */}
              <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3.5 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <div className="col-span-5">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-2 text-right">Subtotal</div>
              </div>

              {/* Table rows */}
              <AnimatePresence>
                {items.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: removing === item.id ? 0 : 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`grid grid-cols-12 gap-4 items-center px-6 py-4 border-b border-gray-50 last:border-0 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}
                  >
                    {/* Product col (image + name + brand) */}
                    <div className="col-span-12 sm:col-span-5 flex items-center gap-3 min-w-0">
                      <Link to={`/product/${item.slug || item.id}`} className="flex-shrink-0 group">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </Link>
                      <div className="min-w-0">
                        {item.brand && (
                          <p className="text-xs font-semibold text-primary-500 uppercase tracking-wide mb-0.5">{item.brand}</p>
                        )}
                        <Link
                          to={`/product/${item.slug || item.id}`}
                          className="text-sm font-bold text-gray-800 hover:text-primary-600 transition-colors line-clamp-2 leading-snug"
                        >
                          {item.name}
                        </Link>
                        {item.selected_options && Object.keys(item.selected_options).length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {Object.entries(item.selected_options).map(([k, v]) => (
                              <span key={k} className="text-xs bg-primary-50 text-primary-700 border border-primary-100 px-2 py-0.5 rounded-full font-medium capitalize">
                                {k.replace('_', ' ')}: {v}
                              </span>
                            ))}
                          </div>
                        )}
                        {/* Mobile-only price */}
                        <p className="sm:hidden text-sm font-extrabold text-gray-900 mt-1">{formatUGX(item.price)}</p>
                        {/* Remove link */}
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="mt-1.5 flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors font-medium"
                        >
                          <FiTrash2 className="text-xs" /> Remove
                        </button>
                      </div>
                    </div>

                    {/* Price col */}
                    <div className="hidden sm:flex col-span-2 justify-center">
                      <span className="text-sm font-semibold text-gray-700">{formatUGX(item.price)}</span>
                    </div>

                    {/* Quantity col */}
                    <div className="col-span-7 sm:col-span-3 flex justify-start sm:justify-center">
                      <div className="inline-flex items-center border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <button
                          onClick={() => handleQty(item.id, item.qty - 1)}
                          disabled={item.qty <= 1}
                          className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <FiMinus className="text-xs" />
                        </button>
                        <span className="w-10 text-center text-sm font-extrabold text-gray-900 border-x border-gray-200">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => handleQty(item.id, item.qty + 1)}
                          className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                        >
                          <FiPlus className="text-xs" />
                        </button>
                      </div>
                    </div>

                    {/* Subtotal col */}
                    <div className="col-span-5 sm:col-span-2 flex justify-end items-center">
                      <span className="text-sm font-extrabold text-primary-600">{formatUGX(item.price * item.qty)}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Table footer totals row */}
              <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="col-span-5 flex items-center">
                  <Link to="/shop" className="flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                    <FiArrowLeft className="text-sm" /> Continue Shopping
                  </Link>
                </div>
                <div className="col-span-2 text-center text-xs text-gray-400 font-semibold self-center">
                  {totalQty} items
                </div>
                <div className="col-span-3" />
                <div className="col-span-2 text-right">
                  <p className="text-xs text-gray-400 font-semibold">Cart Total</p>
                  <p className="text-base font-extrabold text-gray-900">{formatUGX(totalPrice)}</p>
                </div>
              </div>
            </div>

            {/* Mobile continue shopping */}
            <Link to="/shop" className="sm:hidden inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 mt-4">
              <FiArrowLeft /> Continue Shopping
            </Link>
          </div>

          {/* ── RIGHT: Order Summary ─────────────────────────────────────── */}
          <div className="space-y-4">

            {/* Coupon */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-3">
                <FiTag className="text-primary-500" /> Have a Coupon?
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCoupon()}
                  placeholder="e.g. SAVE10"
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                />
                <button
                  onClick={handleCoupon}
                  className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold px-4 rounded-xl transition-colors"
                >
                  Apply
                </button>
              </div>
              {couponMsg && (
                <p className={`text-xs mt-2 font-semibold ${couponMsg.ok ? "text-green-600" : "text-red-500"}`}>
                  {couponMsg.text}
                </p>
              )}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-base font-extrabold text-gray-900 mb-4">Order Summary</p>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalQty} item{totalQty !== 1 ? "s" : ""})</span>
                  <span className="font-semibold text-gray-800">{formatUGX(totalPrice)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600 bg-green-50 -mx-5 px-5 py-2 rounded-lg">
                    <span className="font-semibold">Coupon (SAVE10)</span>
                    <span className="font-bold">- {formatUGX(discount)}</span>
                  </div>
                )}

                                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <Truck size={13} className="text-gray-400" /> Delivery
                  </span>
                  <span className="font-semibold text-gray-800">{formatUGX(shipping)}</span>
                </div>
                <p className="text-xs text-blue-600 -mt-1">
                  {formatUGX(feePerItem)}/product × {totalQty} item{totalQty !== 1 ? "s" : ""}
                  {items.length === 1 ? " — order more than 1 to get 5,000/product" : " — multi-item rate"}
                </p>

                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-1.5"><FiShield className="text-gray-400" /> Tax (0%)</span>
                  <span className="font-semibold text-gray-800">UGX 0</span>
                </div>

                <div className="border-t-2 border-dashed border-gray-200 pt-3 mt-1 flex justify-between items-center">
                  <span className="font-extrabold text-gray-900 text-base">Grand Total</span>
                  <span className="font-extrabold text-2xl text-primary-600">{formatUGX(grandTotal)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="mt-5 w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 active:scale-95 text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg text-sm"
              >
                Proceed to Checkout <FiArrowRight />
              </button>

              <div className="mt-4 grid grid-cols-2 divide-x divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                {[
                  { icon: <FiShield />, label: "Verified Seller" },
                  { icon: <Truck size={14} />, label: "2-Day Delivery" },
                ].map((b) => (
                  <div key={b.label} className="flex flex-col items-center gap-1 py-3 text-center bg-gray-50">
                    <span className="text-primary-500 text-base">{b.icon}</span>
                    <span className="text-xs text-gray-500 font-medium">{b.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment methods */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs text-gray-400 text-center mb-3 font-bold uppercase tracking-wider">We Accept</p>
              <div className="flex items-center justify-center gap-2 bg-yellow-50 border border-yellow-100 text-yellow-700 text-xs font-bold px-3 py-2.5 rounded-xl">
                <svg viewBox="0 0 28 28" className="w-5 h-5 flex-shrink-0" fill="none">
                  <circle cx="14" cy="14" r="14" fill="#FFCC00"/>
                  <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#1a1a1a">MTN</text>
                </svg>
                MTN Mobile Money
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CartPage;
