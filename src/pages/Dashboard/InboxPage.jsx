import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiInbox, FiStar, FiPackage, FiCheck, FiChevronRight,
  FiTrash2, FiCheckSquare, FiSquare, FiGift, FiBell, FiRefreshCw,
  FiCheckCircle, FiXCircle, FiClipboard, FiAward, FiArrowRight, FiX,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import RateProductModal from "../../components/Modal/RateProductModal";
import { useAuth } from "../../context/AuthContext";

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-UG", { day: "numeric", month: "short", year: "numeric" });

const API_BASE = process.env.REACT_APP_API_URL?.replace("/api/v1", "") || "http://127.0.0.1:8000";
const toAbsolute = (url) => (!url ? "" : url.startsWith("http") ? url : `${API_BASE}${url}`);

const returnIcon = (title = "") => {
  if (title.includes("Approved"))  return <FiCheckCircle className="text-blue-500 text-xl" />;
  if (title.includes("Rejected"))  return <FiXCircle className="text-red-400 text-xl" />;
  if (title.includes("Completed")) return <FiAward className="text-green-500 text-xl" />;
  return <FiClipboard className="text-orange-400 text-xl" />;
};

const returnBg = (title = "") => {
  if (title.includes("Approved"))  return "bg-blue-50";
  if (title.includes("Rejected"))  return "bg-red-50";
  if (title.includes("Completed")) return "bg-green-50";
  return "bg-orange-50";
};

const typeIcon = (type, title) => {
  if (type === "rate_product")   return <FiStar className="text-yellow-400 text-xl" />;
  if (type === "welcome")        return <FiGift className="text-indigo-400 text-xl" />;
  if (type === "return_update")  return returnIcon(title);
  if (type === "loyalty_points") return <FiAward className="text-orange-500 text-xl" />;
  return <FiPackage className="text-primary-400 text-xl" />;
};

const typeBg = (type, title) => {
  if (type === "rate_product")   return "bg-yellow-50";
  if (type === "welcome")        return "bg-indigo-50";
  if (type === "return_update")  return returnBg(title);
  if (type === "loyalty_points") return "bg-orange-50";
  return "bg-primary-50";
};

/* ── Full-message modal ─────────────────────────────────────────────────── */
const MessageModal = ({ notif, onClose, onRate, isRated }) => {
  if (!notif) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${typeBg(notif.type, notif.title)}`}>
              {notif.product_image
                ? <img src={toAbsolute(notif.product_image)} alt={notif.title} className="w-full h-full object-cover rounded-xl" />
                : typeIcon(notif.type, notif.title)}
            </div>
            <div className="min-w-0">
              <p className="font-extrabold text-gray-900 text-sm leading-snug">{notif.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{fmtDate(notif.created_at)}</p>
            </div>
          </div>
          <button onClick={onClose} className="flex-shrink-0 p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <FiX size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{notif.message}</p>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 mt-5 justify-end">
            {notif.type === "welcome" && (
              <>
                <Link to="/shop" onClick={onClose} className="inline-flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all">
                  Start Shopping <FiArrowRight size={12} />
                </Link>
                <Link to="/how-to-pay" onClick={onClose} className="inline-flex items-center gap-1.5 border border-gray-200 hover:border-primary-400 text-gray-600 hover:text-primary-600 text-xs font-semibold px-4 py-2 rounded-xl transition-all">
                  How to Pay <FiArrowRight size={12} />
                </Link>
              </>
            )}
            {notif.type === "loyalty_points" && (
              <Link to="/loyalty" onClick={onClose} className="inline-flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all">
                <FiAward size={12} /> View Loyalty Rewards
              </Link>
            )}
            {notif.type === "order_update" && notif.order_id && (
              <Link to="/orders" onClick={onClose} className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all">
                <FiPackage size={12} /> View My Orders
              </Link>
            )}
            {notif.type === "return_update" && notif.order_id && (
              <Link to="/returns/my-returns" onClick={onClose} className="inline-flex items-center gap-1.5 text-orange-600 border border-orange-200 hover:bg-orange-50 text-xs font-semibold px-4 py-2 rounded-xl transition-all">
                <FiRefreshCw size={12} /> View Return
              </Link>
            )}
            {notif.type === "rate_product" && !isRated && (
              <button
                onClick={() => { onRate(notif); onClose(); }}
                className="inline-flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
              >
                <FiStar size={12} /> Rate Product
              </button>
            )}
            {notif.product_slug && (
              <Link to={`/product/${notif.product_slug}`} onClick={onClose} className="inline-flex items-center gap-1.5 border border-gray-200 hover:border-primary-400 text-gray-600 hover:text-primary-600 text-xs font-semibold px-4 py-2 rounded-xl transition-all">
                View Product <FiArrowRight size={12} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Page ───────────────────────────────────────────────────────────────── */
const InboxPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [selected, setSelected]           = useState(new Set());
  const [rateTarget, setRateTarget]       = useState(null);
  const [ratedIds, setRatedIds]           = useState(new Set());
  const [openNotif, setOpenNotif]         = useState(null);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    api.get("/notifications/")
      .then((r) => {
        const list = r.data?.results || r.data || [];
        setNotifications(list);
        if (list.some((n) => !n.is_read)) {
          api.post("/notifications/mark-read/").catch(() => {});
          setNotifications(list.map((n) => ({ ...n, is_read: true })));
        }
        window.dispatchEvent(new Event("notif-unread-cleared"));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const toggleSelect = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const selectAll   = () => setSelected(new Set(notifications.map((n) => n.id)));
  const unselectAll = () => setSelected(new Set());
  const allSelected = notifications.length > 0 && selected.size === notifications.length;

  const markRead = async (id) => {
    await api.post(`/notifications/mark-read/${id}/`).catch(() => {});
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
  };

  const markAllRead = async () => {
    await api.post("/notifications/mark-read/").catch(() => {});
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const markSelectedRead = async () => {
    await Promise.all([...selected].map((id) => api.post(`/notifications/mark-read/${id}/`).catch(() => {})));
    setNotifications((prev) => prev.map((n) => (selected.has(n.id) ? { ...n, is_read: true } : n)));
    setSelected(new Set());
  };

  const deleteOne = async (id) => {
    await api.delete(`/notifications/delete/${id}/`).catch(() => {});
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setSelected((prev) => { const next = new Set(prev); next.delete(id); return next; });
    if (openNotif?.id === id) setOpenNotif(null);
  };

  const deleteSelected = async () => {
    const ids = [...selected];
    await api.delete("/notifications/delete/", { data: { ids } }).catch(() => {});
    setNotifications((prev) => prev.filter((n) => !selected.has(n.id)));
    setSelected(new Set());
  };

  const handleRate = (n) => {
    markRead(n.id);
    setRateTarget({
      _notifId: n.id,
      id: n.product,
      name: n.title.replace("How was ", "").replace("?", ""),
      slug: n.product_slug,
    });
  };

  const handleOpen = (n) => {
    if (!n.is_read) markRead(n.id);
    setOpenNotif(n);
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (!user) {
    return (
      <div className="bg-gray-50 min-h-screen pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-4 pb-2 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <FiChevronRight className="text-xs" />
          <span className="text-gray-800 font-semibold">Inbox</span>
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-16 text-center space-y-5">
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto">
            <FiBell className="text-indigo-500 text-3xl" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">Welcome to CartPulse!</h2>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">
            Create an account or sign in to receive order updates, product notifications, and your personal welcome message.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register" className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">Create Account</Link>
            <Link to="/login" className="border border-gray-200 hover:border-gray-300 text-gray-700 font-bold px-6 py-3 rounded-xl text-sm transition-all">Sign In</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16">

      {/* Breadcrumb */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-4 pb-2 flex items-center gap-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
        <FiChevronRight className="text-xs" />
        <span className="text-gray-800 font-semibold">Inbox</span>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-4 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <FiInbox className="text-primary-600 text-lg" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">Inbox</h1>
              {unreadCount > 0 && (
                <p className="text-xs text-primary-600 font-semibold">{unreadCount} unread</p>
              )}
            </div>
          </div>
          {unreadCount > 0 && selected.size === 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-500 hover:text-primary-600 transition-colors whitespace-nowrap"
            >
              <FiCheck /> Mark all read
            </button>
          )}
        </div>

        {/* Bulk toolbar */}
        {notifications.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-4 bg-white border border-gray-100 rounded-xl px-3 py-2">
            <button
              onClick={allSelected ? unselectAll : selectAll}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-indigo-600 transition-colors"
            >
              {allSelected ? <FiCheckSquare className="text-indigo-600" /> : <FiSquare />}
              {allSelected ? "Unselect All" : "Select All"}
            </button>
            {selected.size > 0 && (
              <>
                <span className="text-gray-300 text-xs">|</span>
                <span className="text-xs text-gray-500 font-medium">{selected.size} selected</span>
                <button onClick={markSelectedRead} className="flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                  <FiCheck className="text-xs" /> Mark read
                </button>
                <button onClick={deleteSelected} className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-600 transition-colors ml-auto">
                  <FiTrash2 className="text-xs" /> Delete ({selected.size})
                </button>
              </>
            )}
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="space-y-3">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse h-20" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <FiInbox className="text-5xl mx-auto mb-3 opacity-20" />
            <p className="font-medium text-gray-500">Your inbox is empty.</p>
          </div>
        ) : (
          <AnimatePresence>
            <div className="space-y-3">
              {notifications.map((n) => {
                const isRated    = ratedIds.has(n.id);
                const isSelected = selected.has(n.id);
                return (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`bg-white rounded-2xl border transition-all ${
                      isSelected ? "border-indigo-300 bg-indigo-50/30" :
                      n.is_read  ? "border-gray-100" : "border-primary-200 shadow-sm"
                    }`}
                  >
                    <div className="flex items-start gap-3 p-4">

                      {/* Checkbox */}
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleSelect(n.id); }}
                        className="flex-shrink-0 mt-0.5 text-gray-400 hover:text-indigo-600 transition-colors"
                      >
                        {isSelected
                          ? <FiCheckSquare className="text-indigo-600 text-lg" />
                          : <FiSquare className="text-lg" />}
                      </button>

                      {/* Icon */}
                      <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden flex items-center justify-center ${typeBg(n.type, n.title)}`}>
                        {n.product_image
                          ? <img src={toAbsolute(n.product_image)} alt={n.title} className="w-full h-full object-cover" />
                          : typeIcon(n.type, n.title)}
                      </div>

                      {/* Content — clickable to open modal */}
                      <button
                        className="flex-1 min-w-0 text-left"
                        onClick={() => handleOpen(n)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm font-semibold ${n.is_read ? "text-gray-700" : "text-gray-900"}`}>
                            {n.title}
                            {!n.is_read && <span className="ml-2 inline-block w-2 h-2 bg-primary-500 rounded-full align-middle" />}
                          </p>
                          <span className="text-xs text-gray-400 flex-shrink-0">{fmtDate(n.created_at)}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{n.message}</p>
                        <p className="text-xs text-primary-500 font-semibold mt-1.5">Click to read more →</p>
                      </button>

                      {/* Delete button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteOne(n.id); }}
                        className="flex-shrink-0 p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                        aria-label="Delete"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        )}
      </div>

      {/* Message modal */}
      <MessageModal
        notif={openNotif}
        onClose={() => setOpenNotif(null)}
        onRate={handleRate}
        isRated={openNotif ? ratedIds.has(openNotif.id) : false}
      />

      {/* Rate modal */}
      {rateTarget && (
        <RateProductModal
          open={!!rateTarget}
          onClose={() => setRateTarget(null)}
          product={rateTarget}
          onSuccess={() => { setRatedIds((prev) => new Set([...prev, rateTarget._notifId])); setRateTarget(null); }}
        />
      )}
    </div>
  );
};

export default InboxPage;
