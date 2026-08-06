import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import adminService from "../../../services/adminService";
import { FiCheckCircle, FiX, FiSearch, FiPackage, FiUser, FiMapPin, FiTruck, FiShoppingBag, FiShield, FiAward, FiTag } from "react-icons/fi";
import { formatUGX } from "../../../utils/currency";
import { toAbsolute } from "../../../utils/imageUrl";

const STATUS_PILL = {
  pending:   "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped:   "bg-indigo-100 text-indigo-700",
  pickup:    "bg-orange-100 text-orange-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
  refunded:  "bg-gray-100 text-gray-500",
};

const shortId = (uuid) => String(uuid).slice(0, 8).toUpperCase();
const fmtDate = (d) => new Date(d).toLocaleString("en-UG", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

/* ── Order Detail Modal ── */
const OrderDetailModal = ({ order, onClose, onStatusChange, updating }) => {
  if (!order) return null;

  const subtotal       = parseFloat(order.subtotal) > 0
    ? parseFloat(order.subtotal)
    : order.items.reduce((s, i) => s + parseFloat(i.subtotal), 0);
  const delivery       = parseFloat(order.delivery_fee ?? 0);
  const couponDiscount = parseFloat(order.coupon_discount ?? 0);
  const pointsDiscount = parseFloat(order.points_discount ?? 0);
  const pointsUsed     = parseInt(order.points_used ?? 0);
  const couponCode     = order.coupon_code_used || null;
  const grandTotal     = parseFloat(order.total_price);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Order</p>
            <p className="text-lg font-extrabold text-gray-900">#{shortId(order.order_number)}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full capitalize ${STATUS_PILL[order.status] || "bg-gray-100 text-gray-600"}`}>
              {order.status === "pickup" ? "Ready for Pickup" : order.status}
            </span>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
              <FiX />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

          {/* Secret word */}
          {order.secret_word && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                <FiShield />
              </div>
              <div>
                <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wide">Secret Word</p>
                <p className="text-lg font-extrabold text-indigo-700 tracking-widest">{order.secret_word}</p>
                <p className="text-xs text-gray-400">Use this to verify the customer when they call</p>
              </div>
            </div>
          )}

          {/* Customer */}
          <div className="bg-gray-50 rounded-2xl p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
              <FiUser />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Customer</p>
              <p className="text-sm font-bold text-gray-900">{order.customer?.full_name || "—"}</p>
              <p className="text-xs text-gray-500">{order.customer?.email}</p>
              <p className="text-xs text-gray-500">{order.customer?.phone}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Payment</p>
              {order.is_paid ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                  <FiCheckCircle /> Paid
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-yellow-600 bg-yellow-50 px-2.5 py-1 rounded-full">
                  Pending
                </span>
              )}
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-gray-50 rounded-2xl p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
              <FiMapPin />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Delivery Address</p>
              <p className="text-sm font-semibold text-gray-800">{order.shipping_address}</p>
              <p className="text-xs text-gray-500">{order.shipping_city}, {order.shipping_country} {order.shipping_zip}</p>
              {order.notes && <p className="text-xs text-gray-400 mt-1 italic">Note: {order.notes}</p>}
            </div>
          </div>

          {/* Items */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Items</p>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3">
                  {/* Image */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                    {item.product_image ? (
                      <img src={toAbsolute(item.product_image)} alt={item.product_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FiShoppingBag />
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{item.product_name}</p>
                    {item.trader_name && (
                      <p className="text-xs text-indigo-600 font-medium">by {item.trader_name}</p>
                    )}
                    <p className="text-xs text-gray-400">Qty: {item.quantity} × {formatUGX(item.product_price)}</p>
                  </div>
                  <p className="text-sm font-extrabold text-gray-900 flex-shrink-0">{formatUGX(item.subtotal)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Rewards & Discounts */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-4 space-y-3">
            <p className="text-xs font-bold text-orange-700 uppercase tracking-wide flex items-center gap-1.5">
              <FiAward className="text-orange-500" /> Rewards & Discounts
            </p>

            {/* Coupon row */}
            <div className="flex items-start gap-3 bg-white/70 rounded-xl p-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                couponDiscount > 0 ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
              }`}>
                <FiTag />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-800">Coupon</p>
                {couponDiscount > 0 ? (
                  <>
                    {couponCode && (
                      <p className="text-xs font-mono bg-gray-100 inline-block px-2 py-0.5 rounded mt-0.5 text-gray-600">{couponCode}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-0.5">Discount off product subtotal</p>
                  </>
                ) : (
                  <p className="text-xs text-gray-400 mt-0.5">No coupon used on this order</p>
                )}
              </div>
              <p className={`text-sm font-extrabold flex-shrink-0 ${
                couponDiscount > 0 ? "text-green-600" : "text-gray-300"
              }`}>
                {couponDiscount > 0 ? `−${formatUGX(couponDiscount)}` : "—"}
              </p>
            </div>

            {/* Loyalty points row */}
            <div className="flex items-start gap-3 bg-white/70 rounded-xl p-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                pointsDiscount > 0 ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-400"
              }`}>
                <FiAward />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-800">Loyalty Points</p>
                {pointsDiscount > 0 ? (
                  <p className="text-xs text-gray-500 mt-0.5">{pointsUsed} pts redeemed · off delivery fee</p>
                ) : (
                  <p className="text-xs text-gray-400 mt-0.5">No loyalty points used on this order</p>
                )}
              </div>
              <p className={`text-sm font-extrabold flex-shrink-0 ${
                pointsDiscount > 0 ? "text-orange-600" : "text-gray-300"
              }`}>
                {pointsDiscount > 0 ? `−${formatUGX(pointsDiscount)}` : "—"}
              </p>
            </div>
          </div>

          {/* Price summary */}
          <div className="bg-gradient-to-br from-indigo-50 to-cyan-50 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>{formatUGX(subtotal)}</span>
            </div>
            {delivery > 0 && (
              <div className="flex justify-between text-sm text-gray-600">
                <span className="flex items-center gap-1"><FiTruck className="text-xs" /> Delivery Fee</span>
                <span>{formatUGX(delivery)}</span>
              </div>
            )}
            {couponDiscount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span className="flex items-center gap-1"><FiTag className="text-xs" /> Coupon Discount{couponCode ? ` (${couponCode})` : ""}</span>
                <span>−{formatUGX(couponDiscount)}</span>
              </div>
            )}
            {pointsDiscount > 0 && (
              <div className="flex justify-between text-sm text-orange-600">
                <span className="flex items-center gap-1"><FiAward className="text-xs" /> Points Discount ({pointsUsed} pts)</span>
                <span>−{formatUGX(pointsDiscount)}</span>
              </div>
            )}
            <div className="border-t border-indigo-100 pt-2 flex justify-between text-sm font-extrabold text-gray-900">
              <span>Grand Total</span>
              <span>{formatUGX(grandTotal)}</span>
            </div>
          </div>

          {/* Meta */}
          <div className="flex justify-between text-xs text-gray-400">
            <span>Placed: {fmtDate(order.created_at)}</span>
            <span>Updated: {fmtDate(order.updated_at)}</span>
          </div>
        </div>

        {/* Footer — status update */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3 flex-wrap">
          <p className="text-xs font-semibold text-gray-500 mr-auto">Update Status:</p>
          {['confirmed', 'shipped', 'pickup', 'delivered', 'cancelled'].map((s) => {
            const isActive = order.status === s;
            const activeColors = {
              confirmed: "bg-blue-600 text-white",
              shipped:   "bg-indigo-600 text-white",
              pickup:    "bg-orange-500 text-white",
              delivered: "bg-green-600 text-white",
              cancelled: "bg-red-500 text-white",
            };
            return (
              <button
                key={s}
                disabled={isActive || updating}
                onClick={() => onStatusChange(order.id, s)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors disabled:opacity-60 ${
                  isActive
                    ? activeColors[s]
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {s === "pickup" ? "Ready for Pickup" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ── Main Page ── */
const AdminOrders = () => {
  const [searchParams] = useSearchParams();
  const [orders, setOrders]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "");
  const [searchValue, setSearchValue]   = useState("");
  const [searching, setSearching]       = useState(false);
  const [searchError, setSearchError]   = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating]           = useState(false);

  const openOrder = async (order) => {
    setSelectedOrder(order);
    try {
      const res = await adminService.getOrder(order.id);
      setSelectedOrder(res.data);
    } catch {}
  };

  const loadOrders = (sf = statusFilter) => {
    setLoading(true);
    adminService.getOrders(sf)
      .then((r) => setOrders(r.data?.results || r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadOrders(); }, [statusFilter]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchValue.trim()) return;
    setSearching(true);
    setSearchError("");
    try {
      const clean = searchValue.trim().replace(/^#/, "");
      const res = await adminService.getOrderByNumber(clean);
      const found = Array.isArray(res.data) ? res.data[0] : res.data;
      setSelectedOrder(found);
    } catch {
      setSearchError("Order not found.");
    } finally {
      setSearching(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(true);
    try {
      const res = await adminService.updateOrderStatus(orderId, newStatus);
      setSelectedOrder(res.data);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? res.data : o)));
    } catch {
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Manage order fulfillment and status.</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              value={searchValue}
              onChange={(e) => { setSearchValue(e.target.value); setSearchError(""); }}
              placeholder="Search order number…"
              className="pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>
          <button type="submit" disabled={searching}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold disabled:opacity-60 transition-colors">
            {searching ? "…" : "Search"}
          </button>
        </form>
      </div>

      {searchError && (
        <p className="text-sm text-red-500 font-medium">{searchError}</p>
      )}

      {/* Status filters */}
      <div className="flex flex-wrap gap-2">
        {['', 'pending', 'confirmed', 'shipped', 'pickup', 'delivered', 'cancelled', 'refunded'].map((v) => (
          <button key={v} onClick={() => setStatusFilter(v)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              statusFilter === v ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-indigo-300"
            }`}>
            {v === '' ? 'All' : v === 'pickup' ? 'Ready for Pickup' : v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <FiPackage className="text-4xl mx-auto mb-2 opacity-20" />
            <p className="font-medium">No orders found.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Order</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Customer</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Total</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Date</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => openOrder(order)}>
                  <td className="px-5 py-4">
                    <p className="font-bold text-gray-900">#{shortId(order.order_number)}</p>
                    <p className="text-xs text-gray-400">{order.items?.length} item{order.items?.length !== 1 ? "s" : ""}</p>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {parseFloat(order.coupon_discount) > 0 && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-full">
                          <FiTag className="text-[9px]" /> Coupon
                        </span>
                      )}
                      {parseFloat(order.points_discount) > 0 && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-orange-700 bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded-full">
                          <FiAward className="text-[9px]" /> Points
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <p className="font-medium text-gray-800">{order.customer?.full_name || "—"}</p>
                    <p className="text-xs text-gray-400">{order.customer?.email}</p>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell font-semibold text-gray-700">{formatUGX(order.total_price)}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_PILL[order.status] || "bg-gray-100 text-gray-600"}`}>
                      {order.status === "pickup" ? "Pickup" : order.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell text-xs text-gray-400">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={(e) => { e.stopPropagation(); openOrder(order); }}
                      className="text-xs font-semibold text-indigo-600 hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={handleStatusChange}
          updating={updating}
        />
      )}
    </div>
  );
};

export default AdminOrders;
