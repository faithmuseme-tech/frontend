import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft, FiRefreshCw, FiCheckCircle, FiXCircle,
  FiClipboard, FiAward, FiPackage, FiMessageSquare, FiPlus, FiChevronRight,
} from "react-icons/fi";
import api from "../../services/api";

const STATUS_CONFIG = {
  pending:   { label: "Pending Review", pill: "bg-yellow-100 text-yellow-700", icon: <FiClipboard className="text-yellow-500" />,  bar: "bg-yellow-400" },
  approved:  { label: "Approved",       pill: "bg-blue-100 text-blue-700",     icon: <FiCheckCircle className="text-blue-500" />,  bar: "bg-blue-400" },
  rejected:  { label: "Rejected",       pill: "bg-red-100 text-red-600",       icon: <FiXCircle className="text-red-500" />,       bar: "bg-red-400" },
  completed: { label: "Completed",      pill: "bg-green-100 text-green-700",   icon: <FiAward className="text-green-500" />,       bar: "bg-green-400" },
};

const REASON_LABELS = {
  defective:        "Defective / Faulty Product",
  wrong_item:       "Wrong Item Delivered",
  not_as_described: "Not as Described",
  damaged_delivery: "Damaged During Delivery",
  other:            "Other",
};

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-UG", { day: "numeric", month: "short", year: "numeric" });

const shortId = (uuid) => String(uuid).slice(0, 8).toUpperCase();

/* ── Detail Panel ── */
const ReturnDetail = ({ rr, onBack }) => {
  const cfg = STATUS_CONFIG[rr.status] || STATUS_CONFIG.pending;
  const steps = ["pending", "approved", "completed"];
  const currentIdx = rr.status === "rejected" ? 1 : steps.indexOf(rr.status);

  const adminBg = {
    approved:  "bg-blue-50 border-blue-100",
    rejected:  "bg-red-50 border-red-100",
    completed: "bg-green-50 border-green-100",
    pending:   "bg-orange-50 border-orange-100",
  }[rr.status] || "bg-gray-50 border-gray-100";

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={onBack}
            className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <FiArrowLeft />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Return Request</p>
            <p className="text-xl font-extrabold text-gray-900">
              #{rr.id} &nbsp;·&nbsp; Order #{shortId(rr.order_number || rr.order)}
            </p>
          </div>
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0 ${cfg.pill}`}>
            {cfg.label}
          </span>
        </div>
        <p className="text-xs text-gray-400">Submitted on {fmtDate(rr.created_at)}</p>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

        {/* Reason + Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Reason</p>
            <p className="text-sm font-semibold text-gray-800">{REASON_LABELS[rr.reason] || rr.reason}</p>
          </div>
          {rr.item_names?.length > 0 && (
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Items</p>
              <ul className="space-y-1">
                {rr.item_names.map((name, i) => (
                  <li key={i} className="flex items-center gap-1.5 text-sm text-gray-700">
                    <FiPackage className="text-gray-300 text-xs flex-shrink-0" /> {name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Your Description</p>
          <p className="text-sm text-gray-700 bg-gray-50 rounded-2xl px-4 py-3 whitespace-pre-wrap leading-relaxed">
            {rr.description}
          </p>
        </div>

        {/* Admin response */}
        {rr.admin_notes ? (
          <div className={`rounded-2xl px-4 py-4 border ${adminBg}`}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <FiMessageSquare /> Admin Response
            </p>
            <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{rr.admin_notes}</p>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100">
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <FiMessageSquare /> No admin response yet. We'll notify you via your inbox.
            </p>
          </div>
        )}

        {/* Status timeline */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Timeline</p>
          <div className="flex items-center">
            {steps.map((s, i) => {
              const done   = i < currentIdx || rr.status === "completed";
              const active = i === currentIdx && rr.status !== "rejected";
              const c      = STATUS_CONFIG[s];
              return (
                <React.Fragment key={s}>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${
                      done || active ? "bg-green-600 text-white" : "bg-gray-100 text-gray-400"
                    }`}>
                      {done ? <FiCheckCircle /> : i + 1}
                    </div>
                    <p className={`text-[10px] font-semibold text-center w-16 leading-tight ${
                      done || active ? "text-green-600" : "text-gray-400"
                    }`}>{c.label}</p>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mb-5 mx-1 rounded ${done ? "bg-green-300" : "bg-gray-100"}`} />
                  )}
                </React.Fragment>
              );
            })}
            {rr.status === "rejected" && (
              <>
                <div className="flex-1 h-0.5 mb-5 mx-1 rounded bg-red-200" />
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-red-500 text-white text-sm">
                    <FiXCircle />
                  </div>
                  <p className="text-[10px] font-semibold text-center w-16 leading-tight text-red-500">Rejected</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Page ── */
const MyReturnsPage = () => {
  const navigate = useNavigate();
  const [returns, setReturns]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get("/orders/returns/")
      .then((r) => {
        const list = Array.isArray(r.data) ? r.data : (r.data.results ?? []);
        setReturns(list);
        if (list.length > 0) setSelected(list[0]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const showDetail = !!selected;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

      {/* Page header */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <FiArrowLeft />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">My Returns</h1>
            <p className="text-sm text-gray-500">Track your return requests.</p>
          </div>
        </div>
        <Link
          to="/returns/request"
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <FiPlus /> New Request
        </Link>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-[280px_1fr] gap-4">
          <div className="space-y-2">
            {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-white rounded-2xl border border-gray-100 animate-pulse" />)}
          </div>
          <div className="h-80 bg-white rounded-2xl border border-gray-100 animate-pulse hidden md:block" />
        </div>
      ) : returns.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <FiRefreshCw className="text-5xl mx-auto mb-3 opacity-20" />
          <p className="font-semibold text-gray-600">No return requests yet.</p>
          <p className="text-sm mt-1">If you have an issue with a delivered order, you can request a return.</p>
          <Link
            to="/returns/request"
            className="mt-5 inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            <FiPlus /> Request a Return
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-[280px_1fr] gap-4 items-start">

          {/* ── Sidebar list ── */}
          <div className={`md:sticky md:top-4 md:max-h-[calc(100vh-6rem)] md:overflow-y-auto bg-white border border-gray-100 rounded-2xl overflow-hidden ${showDetail && selected ? "hidden md:block" : "block"}`}>
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                {returns.length} Request{returns.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="divide-y divide-gray-50">
              {returns.map((rr) => {
                const cfg = STATUS_CONFIG[rr.status] || STATUS_CONFIG.pending;
                const isActive = selected?.id === rr.id;
                return (
                  <button
                    key={rr.id}
                    onClick={() => setSelected(rr)}
                    className={`w-full text-left flex items-center gap-3 px-4 py-3.5 transition-colors ${
                      isActive ? "bg-indigo-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className={`w-1 self-stretch rounded-full flex-shrink-0 ${isActive ? cfg.bar : "bg-transparent"}`} />
                    <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 text-sm">
                      {cfg.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold truncate ${isActive ? "text-indigo-700" : "text-gray-900"}`}>
                        Order #{shortId(rr.order_number || rr.order)}
                      </p>
                      <p className="text-xs text-gray-400">{fmtDate(rr.created_at)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.pill}`}>
                        {cfg.label}
                      </span>
                      <FiChevronRight className={`text-xs ${isActive ? "text-indigo-400" : "text-gray-300"}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Detail panel ── */}
          <div className={`bg-white border border-gray-100 rounded-2xl overflow-hidden min-h-[400px] ${!showDetail ? "hidden md:block" : "block"}`}>
            {selected ? (
              <ReturnDetail rr={selected} onBack={() => setSelected(null)} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-24 text-gray-400">
                <FiRefreshCw className="text-4xl mb-3 opacity-20" />
                <p className="text-sm font-medium">Select a return to view details</p>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default MyReturnsPage;
