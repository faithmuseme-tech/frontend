import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiTrash2, FiMinus, FiPlus, FiShoppingBag,
  FiArrowLeft, FiArrowRight, FiTag,
  FiShield, FiChevronRight, FiAward,
} from "react-icons/fi";
import { Truck, Package, Calendar, Copy, Check, Tag, Gift } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { formatUGX } from "../../utils/currency";
import { toAbsolute } from "../../utils/imageUrl";
import couponService from "../../services/couponService";

// Delivery fee rules (based on total quantity across all cart items):
// qty 0        → 0
// qty 1–3      → UGX 15,000 flat
// qty 4+       → UGX 15,000 + (qty - 3) × 5,000
const BASE_FEE = 15000;
const EXTRA_PER_UNIT = 5000;
const BASE_QTY_LIMIT = 3;

const getTotalQty = (items = []) => items.reduce((sum, i) => sum + (i.qty || 1), 0);

const getDeliveryFee = (items = []) => {
  const qty = getTotalQty(items);
  if (qty === 0) return 0;
  if (qty <= BASE_QTY_LIMIT) return BASE_FEE;
  return BASE_FEE + (qty - BASE_QTY_LIMIT) * EXTRA_PER_UNIT;
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
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [removing, setRemoving] = useState(null);
  const [eligibility, setEligibility] = useState(null);
  const [copied, setCopied] = useState(false);
  const [redeemPoints, setRedeemPoints] = useState(false);

  const fetchEligibility = useCallback(async () => {
    if (items.length === 0) return;
    try {
      const res = await couponService.preview({ shipping_city: "", coupon_code: "", redeem_points: false });
      setEligibility(res.data);
    } catch { /* silent */ }
  }, [items]);

  useEffect(() => { fetchEligibility(); }, [fetchEligibility]);

  const totalQty = getTotalQty(items);
  const shipping = getDeliveryFee(items);
  const loyalty = eligibility?.loyalty;
  const redemptionMin = eligibility?.config?.points_redemption_minimum ?? 150;
  const redemptionValue = eligibility?.config?.points_redemption_value ?? 100;
  const pointsBalance = loyalty?.points_balance ?? 0;
  const canRedeem = pointsBalance >= redemptionMin;
  const pointsDiscount = redeemPoints && canRedeem ? Math.min(pointsBalance * redemptionValue, shipping) : 0;
  const grandTotal = totalPrice - discount + Math.max(0, shipping - pointsDiscount);

  const handleRemove = (id) => {
    setRemoving(id);
    setTimeout(() => { removeItem(id); setRemoving(null); }, 300);
  };

  const handleQty = (id, qty) => { if (qty >= 1) updateQty(id, qty); };

  const handleCoupon = async () => {
    const code = coupon.trim().toUpperCase();
    if (!code) return;
    setCouponLoading(true);
    try {
      const res = await couponService.validateCoupon(code);
      if (res.data.valid) {
        setDiscount(res.data.discount);
        setAppliedCoupon(code);
        setCouponMsg({ ok: true, text: `Coupon applied — UGX ${res.data.discount.toLocaleString()} off!` });
      } else {
        setDiscount(0);
        setAppliedCoupon("");
        setCouponMsg({ ok: false, text: res.data.error || "Invalid coupon code." });
      }
    } catch {
      setCouponMsg({ ok: false, text: "Could not validate coupon. Try again." });
    } finally {
      setCouponLoading(false);
    }
  };

  // Apply a code directly (used by banner button)
  const applyCode = async (code) => {
    setCoupon(code);
    setCouponLoading(true);
    try {
      const res = await couponService.validateCoupon(code);
      if (res.data.valid) {
        setDiscount(res.data.discount);
        setAppliedCoupon(code);
        setCouponMsg({ ok: true, text: `Coupon applied — UGX ${res.data.discount.toLocaleString()} off!` });
      } else {
        setDiscount(0); setAppliedCoupon("");
        setCouponMsg({ ok: false, text: res.data.error || "Invalid coupon code." });
      }
    } catch {
      setCouponMsg({ ok: false, text: "Could not validate coupon. Try again." });
    } finally { setCouponLoading(false); }
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-2 flex items-center gap-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
        <FiChevronRight className="text-xs" />
        <Link to="/shop" className="hover:text-primary-600 transition-colors">Shop</Link>
        <FiChevronRight className="text-xs" />
        <span className="text-gray-800 font-semibold">Cart</span>
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
              <span className="font-semibold text-gray-800">{formatUGX(shipping)}</span> delivery fee for {totalQty} item{totalQty !== 1 ? "s" : ""} — delivered to your doorstep
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
                            src={toAbsolute(item.image)}
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

                    {/* Subtotal + Remove col */}
                    <div className="col-span-5 sm:col-span-2 flex flex-col items-end gap-1">
                      <span className="text-sm font-extrabold text-primary-600">{formatUGX(item.price * item.qty)}</span>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors font-medium"
                      >
                        <FiTrash2 className="text-xs" /> Remove
                      </button>
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

            {/* Loyalty Points */}
            {eligibility && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-3">
                  <FiAward className="text-orange-500" /> Loyalty Points
                </p>
                {loyalty ? (
                  canRedeem ? (
                    <div className="space-y-3">
                      <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3">
                        <p className="text-xs font-bold text-orange-800">You have {pointsBalance} points!</p>
                        <p className="text-xs text-orange-700 mt-0.5">
                          Redeem for a <span className="font-bold">{formatUGX(pointsBalance * redemptionValue)}</span> delivery fee discount.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setRedeemPoints((p) => !p)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all font-semibold text-sm ${
                          redeemPoints
                            ? "border-orange-400 bg-orange-50 text-orange-800"
                            : "border-gray-200 bg-white text-gray-700 hover:border-orange-300"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <FiAward className={redeemPoints ? "text-orange-500" : "text-gray-400"} />
                          {redeemPoints ? "Points Applied" : "Use My Points"}
                        </span>
                        <span className={`w-10 h-5 rounded-full relative transition-colors ${
                          redeemPoints ? "bg-orange-500" : "bg-gray-300"
                        }`}>
                          <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                            redeemPoints ? "translate-x-5" : ""
                          }`} />
                        </span>
                      </button>
                      {redeemPoints && (
                        <p className="text-xs text-orange-700 font-semibold flex items-center gap-1">
                          <Check size={12} className="text-orange-500" />
                          {formatUGX(pointsDiscount)} discount will be applied at checkout.
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-xl px-4 py-3">
                      <p className="text-xs text-gray-600">
                        You have <span className="font-bold text-orange-600">{pointsBalance} pts</span>.
                        Keep shopping to earn more rewards and unlock a discount!
                      </p>
                      <div className="mt-2 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full bg-orange-400 rounded-full transition-all"
                          style={{ width: `${Math.min(100, Math.round((pointsBalance / redemptionMin) * 100))}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{Math.round((pointsBalance / redemptionMin) * 100)}% of the way to your next reward</p>
                    </div>
                  )
                ) : (
                  <p className="text-xs text-gray-400">Sign in to view and use your loyalty points.</p>
                )}
              </div>
            )}

            {/* Coupon */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
              <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <FiTag className="text-primary-500" /> Coupon / Promo Code
              </p>

              {/* ── Eligibility banners ── */}
              {eligibility?.large_order_eligible && eligibility?.large_order_coupon && !appliedCoupon && (
                <div className="bg-amber-50 border border-amber-300 rounded-xl p-3">
                  <div className="flex items-start gap-2">
                    <Tag size={15} className="text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-amber-800">Large Order Reward!</p>
                      <p className="text-xs text-amber-700 mt-0.5">
                        You qualify for a <span className="font-bold">UGX {eligibility.large_order_coupon.discount.toLocaleString()}</span> discount.
                      </p>
                      {/* Code row with copy icon */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-mono font-extrabold text-amber-900 bg-amber-100 border border-amber-200 px-2 py-1 rounded text-sm tracking-widest select-all">
                          {eligibility.large_order_coupon.code}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(eligibility.large_order_coupon.code)}
                          title="Copy code"
                          className="p-1.5 rounded-lg hover:bg-amber-200 text-amber-700 transition-colors flex-shrink-0"
                        >
                          {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => applyCode(eligibility.large_order_coupon.code)}
                        disabled={couponLoading}
                        className="mt-2 w-full text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {couponLoading ? "Applying..." : "Click to Apply Coupon"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {eligibility?.first_order_eligible && eligibility?.first_order_coupon && !appliedCoupon && (
                <div className="bg-purple-50 border border-purple-300 rounded-xl p-3">
                  <div className="flex items-start gap-2">
                    <Gift size={15} className="text-purple-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-purple-800">First Order Discount!</p>
                      <p className="text-xs text-purple-700 mt-0.5">
                        Welcome! Get <span className="font-bold">UGX {eligibility.first_order_coupon.discount.toLocaleString()}</span> off your first order.
                      </p>
                      {/* Code row with copy icon */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-mono font-extrabold text-purple-900 bg-purple-100 border border-purple-200 px-2 py-1 rounded text-sm tracking-widest select-all">
                          {eligibility.first_order_coupon.code}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(eligibility.first_order_coupon.code)}
                          title="Copy code"
                          className="p-1.5 rounded-lg hover:bg-purple-200 text-purple-700 transition-colors flex-shrink-0"
                        >
                          {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => applyCode(eligibility.first_order_coupon.code)}
                        disabled={couponLoading}
                        className="mt-2 w-full text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {couponLoading ? "Applying..." : "Click to Apply Coupon"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Manual input ── */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => {
                    setCoupon(e.target.value.toUpperCase());
                    if (!e.target.value.trim()) { setDiscount(0); setAppliedCoupon(""); setCouponMsg(null); }
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleCoupon()}
                  placeholder="Enter coupon code..."
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 font-mono uppercase"
                />
                <button
                  onClick={handleCoupon}
                  disabled={!coupon.trim() || couponLoading}
                  className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {couponLoading ? "..." : "Apply"}
                </button>
              </div>
              {couponMsg && (
                <p className={`text-xs font-semibold ${couponMsg.ok ? "text-green-600" : "text-red-500"}`}>
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
                    <span className="font-semibold">Coupon {appliedCoupon ? `(${appliedCoupon})` : ""}</span>
                    <span className="font-bold">- {formatUGX(discount)}</span>
                  </div>
                )}

                {pointsDiscount > 0 && (
                  <div className="flex justify-between text-orange-600 bg-orange-50 -mx-5 px-5 py-2 rounded-lg">
                    <span className="font-semibold flex items-center gap-1"><FiAward size={12} /> Delivery Discount (Points)</span>
                    <span className="font-bold">- {formatUGX(pointsDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <Truck size={13} className="text-gray-400" /> Delivery
                  </span>
                  <span className="font-semibold text-gray-800">{formatUGX(Math.max(0, shipping - pointsDiscount))}</span>
                </div>
                  <p className="text-xs text-blue-600 -mt-1">
                  {formatUGX(BASE_FEE)} base fee for up to {BASE_QTY_LIMIT} items
                  {totalQty > BASE_QTY_LIMIT && `, +${formatUGX(EXTRA_PER_UNIT)} × ${totalQty - BASE_QTY_LIMIT} extra`}
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
                onClick={() => {
                  sessionStorage.setItem('cart_rewards', JSON.stringify({
                    redeemPoints,
                    appliedCoupon,
                    discount,
                  }));
                  navigate("/checkout");
                }}
                className="mt-5 w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 active:scale-95 text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg text-sm"
              >
                Proceed to Checkout <FiArrowRight />
              </button>

              <div className="mt-4 grid grid-cols-2 divide-x divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                {[
                  { icon: <FiShield />, label: "Verified Seller" },
                  { icon: <Truck size={14} />, label: "Doorstep Delivery" },
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
              <div className="flex items-center justify-center gap-3">
                <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 px-3 py-2 rounded-xl">
                  <img src="https://res.cloudinary.com/d5qqtsou/image/upload/v1785425025/MTN_MoMo_irikay.jpg" alt="MTN MoMo" className="h-7 w-auto object-contain rounded" />
                </div>
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 px-3 py-2 rounded-xl">
                  <img src="https://res.cloudinary.com/d5qqtsou/image/upload/v1785425176/Airtel_Money_fgicyp.png" alt="Airtel Money" className="h-7 w-auto object-contain" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CartPage;
