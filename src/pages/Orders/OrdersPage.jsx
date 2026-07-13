import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiPackage, FiCheck, FiX, FiMapPin, FiCalendar, FiShoppingBag, FiArrowLeft,
} from "react-icons/fi";
import api from "../../services/api";
import { formatUGX } from "../../utils/currency";
import Modal from "../../components/Modal/Modal";

const STATUS_STYLES = {
  pending:   { pill: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-400" },
  confirmed: { pill: "bg-blue-100 text-blue-700",    dot: "bg-blue-400" },
  shipped:   { pill: "bg-indigo-100 text-indigo-700", dot: "bg-indigo-400" },
  pickup:    { pill: "bg-orange-100 text-orange-700", dot: "bg-orange-400" },
  delivered: { pill: "bg-green-100 text-green-700",  dot: "bg-green-400" },
  cancelled: { pill: "bg-red-100 text-red-600",      dot: "bg-red-400" },
  refunded:  { pill: "bg-gray-100 text-gray-500",    dot: "bg-gray-400" },
};

const STEPS = [
  { key: "pending",   label: "Order Placed",      desc: "We received your order" },
  { key: "confirmed", label: "Confirmed",          desc: "Order has been confirmed" },
  { key: "shipped",   label: "Shipped",            desc: "On the way to you" },
  { key: "pickup",    label: "Ready for Pickup",   desc: "Waiting at pickup point" },
  { key: "delivered", label: "Delivered",          desc: "Order completed" },
];

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-UG", { day: "numeric", month: "short", year: "numeric" });

const shortId = (uuid) => String(uuid).slice(0, 8).toUpperCase();

/* ── Progress Tracker ── */
const OrderProgress = ({ status }) => {
  const isCancelled = status === "cancelled" || status === "refunded";
  const currentIdx  = STEPS.findIndex((s) => s.key === status);

  if (isCancelled) return (
    <div className="flex items-center gap-3 py-4 px-5 bg-red-50 rounded-2xl">
      <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
        <FiX className="text-red-500" />
      </div>
      <div>
        <p className="text-sm font-bold text-red-600 capitalize">{status}</p>
        <p className="text-xs text-red-400">This order has been {status}</p>
      </div>
    </div>
  );

  return (
    <div className="flex items-start">
      {STEPS.map((step, i) => {
        const done   = i < currentIdx;
        const active = i === currentIdx;
        return (
          <React.Fragment key={step.key}>
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                done   ? "bg-green-500 text-white shadow-sm shadow-green-200" :
                active ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200 ring-4 ring-indigo-50" :
                         "bg-gray-100 text-gray-400"
              }`}>
                {done ? <FiCheck /> : i + 1}
              </div>
              <p className={`text-[10px] font-semibold text-center leading-tight w-14 ${
                done ? "text-green-600" : active ? "text-indigo-600" : "text-gray-400"
              }`}>
                {step.label}
              </p>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mt-4 mx-1 rounded ${
                done ? "bg-green-300" : "bg-gray-100"
              }`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

/* ── Left: Order Row ── */
const OrderRow = ({ order, selected, onClick }) => {
  const style = STATUS_STYLES[order.status] || STATUS_STYLES.pending;
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3.5 rounded-xl transition-all flex items-start gap-3 ${
        selected ? "bg-indigo-50 border border-indigo-200" : "hover:bg-gray-50 border border-transparent"
      }`}
    >
      <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${style.dot}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-bold text-gray-900 truncate">#{shortId(order.order_number)}</p>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize flex-shrink-0 ${style.pill}`}>
            {order.status === "pickup" ? "Pickup" : order.status}
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">{fmtDate(order.created_at)}</p>
        <p className="text-xs font-semibold text-gray-700 mt-1">{formatUGX(order.total_price)}</p>
      </div>
    </button>
  );
};

/* ── Right: Order Detail ── */
const OrderDetail = ({ order, onBack }) => {
  const style = STATUS_STYLES[order.status] || STATUS_STYLES.pending;
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <button onClick={onBack} className="md:hidden p-1 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
                <FiArrowLeft />
              </button>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Order</p>
            </div>
            <p className="text-lg font-extrabold text-gray-900 mt-0.5">#{shortId(order.order_number)}</p>
          </div>
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full capitalize ${style.pill}`}>
            {order.status === "pickup" ? "Ready for Pickup" : order.status}
          </span>
        </div>

        <div className="flex flex-wrap gap-4 mt-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <FiCalendar className="text-gray-400" />
            {fmtDate(order.created_at)}
          </div>
          {order.shipping_city && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <FiMapPin className="text-gray-400" />
              {order.shipping_address}, {order.shipping_city}
            </div>
          )}
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        {/* Progress */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Tracking</p>
          <OrderProgress status={order.status} />
        </div>

        {/* Items */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Items</p>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 bg-gray-50 rounded-xl px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 overflow-hidden flex-shrink-0">
                    {item.product_image
                      ? <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                      : <FiShoppingBag className="w-full h-full p-2 text-indigo-400" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 leading-tight">{item.product_name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-gray-900 flex-shrink-0">{formatUGX(item.subtotal)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-br from-indigo-50 to-cyan-50 rounded-2xl px-5 py-4 space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span>{formatUGX(order.total_price)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Delivery</span>
            <span className="text-green-600 font-semibold">Free</span>
          </div>
          <div className="border-t border-indigo-100 pt-2 flex justify-between text-sm font-extrabold text-gray-900">
            <span>Total</span>
            <span>{formatUGX(order.total_price)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Page ── */
const OrdersPage = () => {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    api.get("/orders/")
      .then((r) => {
        const list = Array.isArray(r.data) ? r.data : (r.data.results ?? []);
        setOrders(list);
        if (list.length > 0) setSelected(list[0]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const searchByOrderNumber = async () => {
    if (!searchValue) return;
    setLoading(true);
    try {
      const r = await api.get('/orders/', { params: { order_number: searchValue } });
      const list = Array.isArray(r.data) ? r.data : (r.data.results ?? []);
      setOrders(list);
      setSelected(list[0] ?? null);
    } catch (e) {
      setOrders([]);
      setSelected(null);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchValue('');
    setLoading(true);
    api.get('/orders/').then((r) => {
      const list = Array.isArray(r.data) ? r.data : (r.data.results ?? []);
      setOrders(list);
      setSelected(list[0] ?? null);
    }).finally(() => setLoading(false));
  };

  if (loading) return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-[300px_1fr] gap-4">
        <div className="space-y-2">
          {Array(4).fill(0).map((_, i) => <div key={i} className="h-20 bg-white rounded-xl border border-gray-100 animate-pulse" />)}
        </div>
        <div className="h-96 bg-white rounded-2xl border border-gray-100 animate-pulse" />
      </div>
    </div>
  );

  if (orders.length === 0) return (
    <div className="max-w-5xl mx-auto px-4 py-10 text-center py-32 text-gray-400">
      <FiPackage className="text-6xl mx-auto mb-4 opacity-20" />
      <p className="font-bold text-gray-600 text-lg">No orders yet</p>
      <p className="text-sm mt-1">Looks like you haven't placed any orders.</p>
      <Link to="/shop" className="mt-5 inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors">
        Start Shopping
      </Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">My Orders</h1>
        <div className="flex items-center gap-3 mt-1">
          <p className="text-sm text-gray-500">{orders.length} order{orders.length !== 1 ? "s" : ""} found</p>
          <input value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder="Search by order number" className="px-3 py-2 rounded-xl border border-gray-200 text-sm" />
          <button onClick={searchByOrderNumber} className="px-3 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold">Search</button>
          <button onClick={clearSearch} className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-sm">Clear</button>
        </div>
      </div>

      <div className="grid md:grid-cols-[300px_1fr] gap-4 items-start">
        {/* Left — order list */}
        <div className={`bg-white rounded-2xl border border-gray-100 p-3 space-y-1 ${selected ? "hidden md:block" : "block"}`}>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-2 pb-2">All Orders</p>
          {orders.map((o) => (
            <OrderRow
              key={o.id}
              order={o}
              selected={selected?.id === o.id}
              onClick={() => setSelected(o)}
            />
          ))}
        </div>

        {/* Right — detail */}
        <div className={`bg-white rounded-2xl border border-gray-100 min-h-[520px] ${selected ? "block" : "hidden md:flex md:items-center md:justify-center"}`}>
          {selected ? (
            <div className="p-6">
              <div className="md:block hidden">
                <OrderDetail order={selected} onBack={() => setSelected(null)} />
              </div>
              <div className="md:hidden block">
                <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-xl">View Details</button>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-300 py-20">
              <FiPackage className="text-5xl mx-auto mb-3" />
              <p className="text-sm font-medium">Select an order to view details</p>
            </div>
          )}
        </div>

      {/* Modal for mobile/small screens */}
      {selected && (
        <>
          <Modal open={showModal} onClose={() => setShowModal(false)} title={`Order #${shortId(selected.order_number)}`}>
            <OrderDetail order={selected} onBack={() => { setShowModal(false); setSelected(null); }} />
          </Modal>
        </>
      )}
      </div>
    </div>
  );
};

export default OrdersPage;
