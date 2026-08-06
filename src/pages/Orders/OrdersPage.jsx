import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiPackage, FiCheck, FiX, FiMapPin, FiCalendar, FiShoppingBag, FiArrowLeft, FiStar, FiTruck, FiRefreshCw, FiAward,
} from "react-icons/fi";
import api from "../../services/api";
import { formatUGX } from "../../utils/currency";
import { toAbsolute } from "../../utils/imageUrl";
import Modal from "../../components/Modal/Modal";
import RateProductModal from "../../components/Modal/RateProductModal";

const STATUS_STYLES = {
  pending:   { pill: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-400" },
  confirmed: { pill: "bg-blue-100 text-blue-700",    dot: "bg-blue-400" },
  shipped:   { pill: "bg-indigo-100 text-indigo-700", dot: "bg-indigo-400" },
  pickup:    { pill: "bg-orange-100 text-orange-700", dot: "bg-orange-400" },
  delivered: { pill: "bg-green-100 text-green-700",  dot: "bg-green-400" },
  cancelled: { pill: "bg-red-100 text-red-600",      dot: "bg-red-400" },
  refunded:  { pill: "bg-gray-100 text-gray-500",    dot: "bg-gray-400" },
};

const RETURN_PILL = {
  pending:   "bg-yellow-100 text-yellow-700",
  approved:  "bg-blue-100 text-blue-700",
  rejected:  "bg-red-100 text-red-600",
  completed: "bg-green-100 text-green-700",
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
  const isDelivered = status === "delivered";

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
        const done   = isDelivered || i < currentIdx;
        const active = !isDelivered && i === currentIdx;
        return (
          <React.Fragment key={step.key}>
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                done   ? "bg-green-500 text-white" :
                active ? "bg-green-500 text-white outline outline-4 outline-green-100" :
                         "bg-gray-100 text-gray-400"
              }`}>
                {done || active ? <FiCheck /> : i + 1}
              </div>
              <p className={`text-[10px] font-semibold text-center leading-tight w-14 ${
                done || active ? "text-green-600" : "text-gray-400"
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

/* ── Order Row ── */
const OrderRow = ({ order, onClick }) => {
  const style = STATUS_STYLES[order.status] || STATUS_STYLES.pending;
  const subtotal = order.total_price - (order.delivery_fee || 0);
  return (
    <>
      {/* Desktop row */}
      <tr
        onClick={onClick}
        className="hidden md:table-row hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
      >
        <td className="px-4 py-3">
          <span className="font-bold text-gray-900 text-sm">#{shortId(order.order_number)}</span>
        </td>
        <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{fmtDate(order.created_at)}</td>
        <td className="px-4 py-3 text-xs font-semibold text-gray-700 whitespace-nowrap">{formatUGX(order.delivery_fee || 0)}</td>
        <td className="px-4 py-3">
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize whitespace-nowrap ${style.pill}`}>
            {order.status === "pickup" ? "Pickup" : order.status}
          </span>
        </td>
        <td className="px-4 py-3 text-sm font-extrabold text-gray-900 whitespace-nowrap">{formatUGX(order.total_price)}</td>
        <td className="px-4 py-3 text-right">
          <span className="text-xs font-semibold text-indigo-600">View →</span>
        </td>
      </tr>

      {/* Mobile card */}
      <div
        onClick={onClick}
        className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors"
      >
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${style.dot}`} />
        <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap">
          <span className="font-bold text-gray-900 text-xs">#{shortId(order.order_number)}</span>
          <span className="text-gray-300 text-xs">·</span>
          <span className="text-xs text-gray-400">{fmtDate(order.created_at)}</span>
          <span className="text-gray-300 text-xs">·</span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${style.pill}`}>
            {order.status === "pickup" ? "Pickup" : order.status}
          </span>
          {order.return_request && (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${RETURN_PILL[order.return_request.status] || "bg-gray-100 text-gray-500"}`}>
              Return: {order.return_request.status}
            </span>
          )}
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="text-xs font-extrabold text-gray-900">{formatUGX(order.total_price)}</p>
          <p className="text-[10px] text-gray-400">+{formatUGX(order.delivery_fee || 0)} del.</p>
        </div>
      </div>
    </>
  );
};

/* ── Right: Order Detail ── */
const OrderDetail = ({ order, onBack, onRate, ratedProductIds = new Set() }) => {
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
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500">
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
                      ? <img src={toAbsolute(item.product_image)} alt={item.product_name} className="w-full h-full object-cover" />
                      : <FiShoppingBag className="w-full h-full p-2 text-indigo-400" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 leading-tight">{item.product_name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <p className="text-sm font-bold text-gray-900">{formatUGX(item.subtotal)}</p>
                  {order.status === "delivered" && item.product && (
                    ratedProductIds.has(item.product) ? (
                      <span className="text-xs text-green-600 font-semibold flex items-center gap-1">
                        <FiCheck className="text-xs" /> Rated
                      </span>
                    ) : (
                      <button
                        onClick={() => onRate({ id: item.product, name: item.product_name })}
                        className="flex items-center gap-1 text-xs font-semibold text-yellow-600 hover:text-yellow-700 transition-colors"
                      >
                        <FiStar className="text-xs" /> Rate
                      </button>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-br from-indigo-50 to-cyan-50 rounded-2xl px-5 py-4 space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span>{formatUGX(order.total_price - (order.delivery_fee || 0))}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span className="flex items-center gap-1"><FiTruck className="text-gray-400" /> Delivery</span>
            <span className="font-semibold">
              {order.delivery_fee > 0 ? formatUGX(order.delivery_fee) : <span className="text-green-600">Free</span>}
            </span>
          </div>
          <div className="border-t border-indigo-100 pt-2 flex justify-between text-sm font-extrabold text-gray-900">
            <span>Total</span>
            <span>{formatUGX(order.total_price)}</span>
          </div>
        </div>
        {/* Return request badge + action */}
        {order.status === "delivered" && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between gap-3 flex-wrap">
            {order.return_request ? (
              <>
                <div className="flex items-center gap-2">
                  <FiRefreshCw className="text-gray-400 text-sm" />
                  <span className="text-xs text-gray-500">Return:</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${RETURN_PILL[order.return_request.status] || "bg-gray-100 text-gray-500"}`}>
                    {order.return_request.status}
                  </span>
                </div>
                <Link
                  to="/returns/my-returns"
                  className="text-xs font-semibold text-orange-600 hover:underline flex items-center gap-1"
                >
                  <FiRefreshCw className="text-xs" /> View Return
                </Link>
              </>
            ) : (
              <Link
                to="/returns/request"
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-orange-600 transition-colors"
              >
                <FiRefreshCw className="text-xs" /> Request a Return
              </Link>
            )}
          </div>
        )}
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
  const [rateTarget, setRateTarget] = useState(null);
  const [ratedProductIds, setRatedProductIds] = useState(new Set());

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
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl font-extrabold text-gray-900">My Orders</h1>
          <Link
            to="/loyalty"
            className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-sm font-bold px-4 py-2 rounded-xl transition-colors"
          >
            <FiAward /> Loyalty Rewards
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <p className="text-sm text-gray-500">{orders.length} order{orders.length !== 1 ? "s" : ""}</p>
          <input value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder="Search by order number" className="px-3 py-1.5 rounded-xl border border-gray-200 text-sm" />
          <button onClick={searchByOrderNumber} className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold">Search</button>
          <button onClick={clearSearch} className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-sm">Clear</button>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Order #</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Delivery</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <OrderRow key={o.id} order={o} onClick={() => { setSelected(o); setShowModal(true); }} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {orders.map((o) => (
          <OrderRow key={o.id} order={o} onClick={() => { setSelected(o); setShowModal(true); }} />
        ))}
      </div>

      {/* Detail modal — both mobile and desktop */}
      {selected && (
        <Modal open={showModal} onClose={() => setShowModal(false)} title={`Order #${shortId(selected.order_number)}`}>
          <OrderDetail
            order={selected}
            onBack={() => { setShowModal(false); setSelected(null); }}
            onRate={(p) => { setShowModal(false); setRateTarget(p); }}
            ratedProductIds={ratedProductIds}
          />
        </Modal>
      )}
      {rateTarget && (
        <RateProductModal
          open={!!rateTarget}
          onClose={() => setRateTarget(null)}
          product={rateTarget}
          onSuccess={() => setRatedProductIds((prev) => new Set([...prev, rateTarget.id]))}
        />
      )}
    </div>
  );
};

export default OrdersPage;
