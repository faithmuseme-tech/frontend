import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiTrash2, FiMinus, FiPlus, FiShoppingBag,
  FiArrowLeft, FiArrowRight, FiTag, FiTruck,
  FiShield, FiRefreshCw, FiChevronRight,
} from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import { formatUGX } from "../../utils/currency";

const UPCOUNTRY_FEE = 8000; // per item, Fort Portal / upcountry estimate

const CartPage = () => {
  const { items, removeItem, updateQty, clearCart, totalPrice } = useCart();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState("");
  const [couponMsg, setCouponMsg] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [removing, setRemoving] = useState(null);

  const totalQty = items.reduce((s, i) => s + i.qty, 0);
  const shipping = items.reduce((sum, i) => sum + UPCOUNTRY_FEE * i.qty, 0);
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

        {/* ── Shipping estimate notice ──────────────────────────────────── */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-3.5 mb-6 flex items-center gap-3">
          <FiTruck className="text-blue-500 text-xl flex-shrink-0" />
          <p className="text-xs text-gray-600">
            Shipping estimated at <span className="font-bold text-blue-600">UGX {UPCOUNTRY_FEE.toLocaleString()}/item</span> (upcountry rate). Select your district at checkout for the exact fee.
          </p>
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
                  <span className="flex items-center gap-1.5"><FiTruck className="text-gray-400" /> Shipping <span className="text-xs text-gray-400">(est.)</span></span>
                  <span className="font-semibold text-gray-800">{formatUGX(shipping)}</span>
                </div>

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

              <div className="mt-4 grid grid-cols-3 divide-x divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                {[
                  { icon: <FiShield />, label: "Secure Pay" },
                  { icon: <FiTruck />, label: "Fast Ship" },
                  { icon: <FiRefreshCw />, label: "30-day Return" },
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
              <p className="text-xs text-gray-400 text-center mb-3 font-bold uppercase tracking-wider">Accepted Payments</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: "Visa", color: "bg-blue-50 text-blue-700 border-blue-100" },
                  { name: "Mastercard", color: "bg-red-50 text-red-700 border-red-100" },
                  { name: "MTN MoMo", color: "bg-yellow-50 text-yellow-700 border-yellow-100" },
                  { name: "Airtel Money", color: "bg-red-50 text-red-600 border-red-100" },
                ].map((m) => (
                  <div key={m.name} className={`text-xs font-bold px-3 py-2 rounded-xl border text-center ${m.color}`}>
                    {m.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CartPage;
