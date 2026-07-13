import React, { useEffect, useState } from "react";
import adminService from "../../../services/adminService";
import { FiCheckCircle, FiX, FiSearch, FiPackage, FiUser, FiMapPin, FiTruck, FiShoppingBag } from "react-icons/fi";
import { formatUGX } from "../../../utils/currency";

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

  const subtotal = order.items.reduce((s, i) => s + parseFloat(i.subtotal), 0);
  const delivery = order.delivery_fee ?? 0;

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
                      <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
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

          {/* Price summary */}
          <div className="bg-gradient-to-br from-indigo-50 to-cyan-50 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>{formatUGX(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span className="flex items-center gap-1"><FiTruck className="text-xs" /> Delivery Fee</span>
              <span>{delivery === 0 ? <span className="text-green-600 font-semibold">Free</span> : formatUGX(delivery)}</span>
            </div>
            <div className="border-t border-indigo-100 pt-2 flex justify-between text-sm font-extrabold text-gray-900">
              <span>Total</span>
              <span>{formatUGX(parseFloat(order.total_price) + delivery)}</span>
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
          {['confirmed', 'shipped', 'pickup', 'delivered', 'cancelled'].map((s) => (
            <button
              key={s}
              disabled={order.status === s || updating}
              onClick={() => onStatusChange(order.id, s)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors disabled:opacity-40 ${
                order.status === s
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
              }`}
            >
              {s === "pickup" ? "Ready for Pickup" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── Main Page ── */
const AdminOrders = () => {
  const [orders, setOrders]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchValue, setSearchValue]   = useState("");
  const [searching, setSearching]       = useState(false);
  const [searchError, setSearchError]   = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating]         = useState(false);

  const loadOrders = (sf = statusFilter) => {
    setLoading(true);
    adminService.getOrders(sf)
      .then((r) => setOrders(r.data?.results || r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

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
                <tr key={order.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelectedOrder(order)}>
                  <td className="px-5 py-4">
                    <p className="font-bold text-gray-900">#{shortId(order.order_number)}</p>
                    <p className="text-xs text-gray-400">{order.items?.length} item{order.items?.length !== 1 ? "s" : ""}</p>
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
                      onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}
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
