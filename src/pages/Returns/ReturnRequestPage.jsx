import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft, FiPackage, FiCheckSquare, FiSquare, FiSend,
  FiLock, FiShoppingBag, FiClock, FiX,
} from "react-icons/fi";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const REASONS = [
  { value: "defective",        label: "Defective / Faulty Product" },
  { value: "wrong_item",       label: "Wrong Item Delivered" },
  { value: "not_as_described", label: "Not as Described" },
  { value: "damaged_delivery", label: "Damaged During Delivery" },
  { value: "other",            label: "Other" },
];

const shortId = (uuid) => String(uuid).slice(0, 8).toUpperCase();

const STATUS_PILL = {
  pending:   "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped:   "bg-indigo-100 text-indigo-700",
  pickup:    "bg-orange-100 text-orange-700",
  cancelled: "bg-red-100 text-red-600",
};

/* ── Blocker Modal ── */
const BlockerModal = ({ type, allOrders, onClose }) => {
  const isNoOrders    = type === "no_orders";
  const isNotDelivered = type === "not_delivered";
  const isNotLoggedIn  = type === "not_logged_in";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">

        {/* Icon */}
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto ${
          isNotLoggedIn  ? "bg-indigo-100" :
          isNoOrders     ? "bg-gray-100" :
          "bg-yellow-100"
        }`}>
          {isNotLoggedIn  && <FiLock className="text-indigo-500 text-2xl" />}
          {isNoOrders     && <FiShoppingBag className="text-gray-400 text-2xl" />}
          {isNotDelivered && <FiClock className="text-yellow-500 text-2xl" />}
        </div>

        {/* Title & message */}
        {isNotLoggedIn && (
          <>
            <h2 className="text-xl font-extrabold text-gray-900 text-center">Sign In Required</h2>
            <p className="text-sm text-gray-500 text-center">You need to be logged in to request a return.</p>
            <div className="flex gap-3 pt-1">
              <Link
                to="/login"
                state={{ from: "/returns/request" }}
                className="flex-1 text-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
              >
                Sign In
              </Link>
              <button
                onClick={onClose}
                className="flex-1 border border-gray-200 text-gray-600 font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </>
        )}

        {isNoOrders && (
          <>
            <h2 className="text-xl font-extrabold text-gray-900 text-center">No Orders Yet</h2>
            <p className="text-sm text-gray-500 text-center">
              You haven't placed any orders. Returns are only available for delivered orders.
            </p>
            <div className="flex gap-3 pt-1">
              <Link
                to="/shop"
                className="flex-1 text-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
              >
                Shop Now
              </Link>
              <button
                onClick={onClose}
                className="flex-1 border border-gray-200 text-gray-600 font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </>
        )}

        {isNotDelivered && (
          <>
            <h2 className="text-xl font-extrabold text-gray-900 text-center">No Eligible Orders</h2>
            <p className="text-sm text-gray-500 text-center">
              Returns are only available for <span className="font-semibold text-gray-700">delivered</span> orders without an existing return request.
            </p>

            {/* Order list */}
            <div className="bg-gray-50 rounded-2xl divide-y divide-gray-100 max-h-48 overflow-y-auto">
              {allOrders.slice(0, 6).map((o) => (
                <div key={o.id} className="flex items-center justify-between px-4 py-2.5">
                  <div>
                    <p className="text-sm font-bold text-gray-900">#{shortId(o.order_number)}</p>
                    <p className="text-xs text-gray-400">{new Date(o.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                    o.return_request ? "bg-purple-100 text-purple-700" : (STATUS_PILL[o.status] || "bg-green-100 text-green-700")
                  }`}>
                    {o.return_request ? "Return Submitted" : o.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-1">
              <Link
                to="/orders"
                className="flex-1 text-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
              >
                View Orders
              </Link>
              <button
                onClick={onClose}
                className="flex-1 border border-gray-200 text-gray-600 font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </>
        )}

        {/* Close X */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
        >
          <FiX />
        </button>
      </div>
    </div>
  );
};

/* ── Page ── */
const ReturnRequestPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [allOrders, setAllOrders]   = useState([]);
  const [orders, setOrders]         = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [reason, setReason]         = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors]         = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]       = useState(false);
  const [modal, setModal]           = useState(null); // "not_logged_in" | "no_orders" | "not_delivered"

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setLoadingOrders(false); setModal("not_logged_in"); return; }
    api.get("/orders/")
      .then((r) => {
        const list = Array.isArray(r.data) ? r.data : (r.data.results ?? []);
        setAllOrders(list);
        const eligible = list.filter((o) => o.status === "delivered" && !o.return_request);
        setOrders(eligible);
        if (list.length === 0)    setModal("no_orders");
        else if (eligible.length === 0) setModal("not_delivered");
      })
      .catch(() => {})
      .finally(() => setLoadingOrders(false));
  }, [user, authLoading]);

  const toggleItem = (id) =>
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const validate = () => {
    const e = {};
    if (!selectedOrder) e.order = "Please select an order.";
    if (!reason) e.reason = "Please select a reason.";
    if (!description.trim()) e.description = "Please describe the issue.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e_ = validate();
    if (Object.keys(e_).length) { setErrors(e_); return; }
    setSubmitting(true);
    try {
      await api.post("/orders/returns/", {
        order_id:    selectedOrder.id,
        item_ids:    selectedItems,
        reason,
        description,
      });
      setSuccess(true);
    } catch (err) {
      const code = err.response?.data?.error;
      if (code === "no_orders")       { setModal("no_orders");     return; }
      if (code === "not_delivered")   { setModal("not_delivered"); return; }
      if (code === "duplicate_return") { setErrors({ submit: "A return request for this order already exists." }); return; }
      if (code === "order_not_found") { setErrors({ submit: "Order not found." }); return; }
      setErrors({ submit: err.response?.data?.detail || "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  if (success) return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-4">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <FiSend className="text-green-600 text-2xl" />
      </div>
      <h2 className="text-2xl font-extrabold text-gray-900">Return Request Submitted</h2>
      <p className="text-gray-500 text-sm">We've received your request and will review it within 1–3 business days. We'll contact you via phone or WhatsApp.</p>
      <div className="flex justify-center gap-3 pt-2">
        <Link to="/orders" className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors">
          My Orders
        </Link>
        <Link to="/" className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
          Home
        </Link>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">

      {/* Blocker modal */}
      {modal && (
        <BlockerModal
          type={modal}
          allOrders={allOrders}
          onClose={() => { setModal(null); navigate(-1); }}
        />
      )}

      {/* Header */}
      <div className="mb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-4 transition-colors">
          <FiArrowLeft /> Back
        </button>
        <h1 className="text-3xl font-extrabold text-gray-900">Request a Return</h1>
        <p className="mt-2 text-gray-500 text-sm">
          Only <span className="font-semibold text-gray-700">delivered</span> orders are eligible.
          Read our <Link to="/returns" className="text-indigo-600 hover:underline">return policy</Link> before submitting.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">

        {/* Step 1 — Select Order */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">1. Select Order</h2>
          {loadingOrders ? (
            <div className="space-y-2">
              {[1, 2].map((i) => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
            </div>
          ) : (
            <div className="space-y-2">
              {orders.map((order) => {
                const active = selectedOrder?.id === order.id;
                return (
                  <button
                    key={order.id}
                    type="button"
                    onClick={() => { setSelectedOrder(order); setSelectedItems([]); setErrors((e) => ({ ...e, order: undefined })); }}
                    className={`w-full text-left flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                      active ? "border-indigo-400 bg-indigo-50" : "border-gray-200 hover:border-indigo-200 hover:bg-gray-50"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-bold text-gray-900">#{shortId(order.order_number)}</p>
                      <p className="text-xs text-gray-400">{order.items?.length} item{order.items?.length !== 1 ? "s" : ""} · {new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${active ? "border-indigo-500 bg-indigo-500" : "border-gray-300"}`} />
                  </button>
                );
              })}
            </div>
          )}
          {errors.order && <p className="text-xs text-red-500">{errors.order}</p>}
        </div>

        {/* Step 2 — Select Items */}
        {selectedOrder && (
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">2. Select Items to Return <span className="text-gray-400 font-normal normal-case">(optional — leave blank for full order)</span></h2>
            <div className="space-y-2">
              {selectedOrder.items.map((item) => {
                const checked = selectedItems.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                      checked ? "border-indigo-400 bg-indigo-50" : "border-gray-200 hover:border-indigo-200"
                    }`}
                  >
                    <span className={`text-lg flex-shrink-0 ${checked ? "text-indigo-600" : "text-gray-300"}`}>
                      {checked ? <FiCheckSquare /> : <FiSquare />}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{item.product_name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3 — Reason */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">3. Reason for Return <span className="text-red-500">*</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {REASONS.map((r) => {
              const active = reason === r.value;
              return (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => { setReason(r.value); setErrors((e) => ({ ...e, reason: undefined })); }}
                  className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                    active ? "border-indigo-400 bg-indigo-50 text-indigo-700" : "border-gray-200 text-gray-600 hover:border-indigo-200"
                  }`}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
          {errors.reason && <p className="text-xs text-red-500">{errors.reason}</p>}
        </div>

        {/* Step 4 — Description */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">4. Describe the Issue <span className="text-red-500">*</span></h2>
          <textarea
            value={description}
            onChange={(e) => { setDescription(e.target.value); setErrors((err) => ({ ...err, description: undefined })); }}
            rows={4}
            placeholder="Explain what happened with the product in detail…"
            className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none ${errors.description ? "border-red-400" : "border-gray-200"}`}
          />
          {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
        </div>

        {errors.submit && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{errors.submit}</div>
        )}

        <button
          type="submit"
          disabled={submitting || !!modal}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          <FiSend /> {submitting ? "Submitting…" : "Submit Return Request"}
        </button>
      </form>
    </div>
  );
};

export default ReturnRequestPage;
