import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import adminService from "../../../services/adminService";
import {
  TrendingUp, TrendingDown, AlertTriangle, AlertCircle, Zap,
  ShoppingCart, Eye, Package, Users, Star, RefreshCw,
  Heart, Search, Clock, Activity, CheckCircle,
  ArrowUpRight, ArrowDownRight, Info, Flame, DollarSign,
  RotateCcw, XCircle, ChevronDown, ChevronUp,
} from "lucide-react";

const SEEN_KEY   = "insights_seen_count";
const SEEN_TS_KEY = "insights_seen_ts";

const SEVERITY = {
  critical: { bg: "bg-red-50 border-red-200",    badge: "bg-red-100 text-red-700",    icon_bg: "bg-red-100 text-red-600",    label: "Critical" },
  warning:  { bg: "bg-amber-50 border-amber-200", badge: "bg-amber-100 text-amber-700", icon_bg: "bg-amber-100 text-amber-600", label: "Warning"  },
  info:     { bg: "bg-blue-50 border-blue-200",   badge: "bg-blue-100 text-blue-700",   icon_bg: "bg-blue-100 text-blue-600",   label: "Info"     },
  positive: { bg: "bg-green-50 border-green-200", badge: "bg-green-100 text-green-700", icon_bg: "bg-green-100 text-green-600", label: "Positive" },
};

const TYPE_ICON = {
  revenue_forecast:     <TrendingUp size={18} />,
  sales_drop:           <TrendingDown size={18} />,
  sales_spike:          <Flame size={18} />,
  high_views_low_sales: <Eye size={18} />,
  stockout_risk:        <Package size={18} />,
  dead_stock:           <XCircle size={18} />,
  cart_abandonment:     <ShoppingCart size={18} />,
  churn_risk:           <Users size={18} />,
  high_value_customers: <DollarSign size={18} />,
  repeat_purchase:      <RotateCcw size={18} />,
  rating_alert:         <Star size={18} />,
  seller_performance:   <AlertCircle size={18} />,
  wishlist_demand:      <Heart size={18} />,
  search_opportunity:   <Search size={18} />,
  anomaly_low:          <ArrowDownRight size={18} />,
  anomaly_high:         <ArrowUpRight size={18} />,
  return_spike:         <RotateCcw size={18} />,
  peak_time:            <Clock size={18} />,
};

const FILTER_TABS = [
  { key: "all",      label: "All"      },
  { key: "critical", label: "Critical" },
  { key: "warning",  label: "Warning"  },
  { key: "positive", label: "Positive" },
  { key: "info",     label: "Info"     },
];

const buildActionUrl = (action, insight) => {
  const url = new URL(action.href, "http://x");
  const { type, data = {} } = insight;
  if (data.product_id) url.searchParams.set("highlight", data.product_id);
  if (data.seller_id)  url.searchParams.set("seller", data.seller_id);
  if (action.href.includes("/orders")) {
    if (type === "seller_performance") url.searchParams.set("status", "cancelled");
    else if (type === "return_spike")  url.searchParams.set("status", "refunded");
    else if (type === "anomaly_low")   url.searchParams.set("status", "pending");
  }
  if (action.href.includes("/returns") && type === "return_spike") url.searchParams.set("status", "pending");
  if (action.href.includes("/users") && ["churn_risk","repeat_purchase","high_value_customers"].includes(type)) url.searchParams.set("role", "customer");
  if (action.href.includes("/products")) {
    if (type === "dead_stock")    url.searchParams.set("filter", "inactive");
    if (type === "stockout_risk") url.searchParams.set("filter", "low_stock");
  }
  return url.pathname + url.search;
};

// ── Single insight card ──────────────────────────────────────────────────────
const InsightCard = ({ insight, isNew }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const sev  = SEVERITY[insight.severity] || SEVERITY.info;
  const icon = TYPE_ICON[insight.type] || <Activity size={18} />;

  return (
    <div className={`rounded-2xl border p-5 ${sev.bg} transition-all relative`}>
      {isNew && (
        <span className="absolute top-3 right-3 text-[9px] font-extrabold uppercase tracking-widest bg-indigo-600 text-white px-2 py-0.5 rounded-full">
          New
        </span>
      )}
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${sev.icon_bg}`}>
          {icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${sev.badge}`}>
              {sev.label}
            </span>
            {insight.metric && (
              <span className="text-[11px] font-semibold text-gray-500 bg-white/70 px-2 py-0.5 rounded-full border border-gray-200">
                {insight.metric}
              </span>
            )}
          </div>

          <h3 className="text-sm font-extrabold text-gray-900 leading-snug">{insight.title}</h3>

          <p className={`text-xs text-gray-600 mt-1 leading-relaxed ${!expanded ? "line-clamp-2" : ""}`}>
            {insight.detail}
          </p>

          {insight.detail.length > 120 && (
            <button
              onClick={() => setExpanded(e => !e)}
              className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-600 mt-1 font-semibold"
            >
              {expanded ? <><ChevronUp size={12} /> Show less</> : <><ChevronDown size={12} /> Show more</>}
            </button>
          )}

          {insight.actions?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {insight.actions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => navigate(buildActionUrl(action, insight))}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors border
                    ${i === 0
                      ? "bg-gray-900 text-white border-gray-900 hover:bg-gray-700"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                    }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Summary KPI strip ────────────────────────────────────────────────────────
const SummaryStrip = ({ insights, newCount }) => {
  const counts = { critical: 0, warning: 0, positive: 0, info: 0 };
  insights.forEach(i => { if (counts[i.severity] !== undefined) counts[i.severity]++; });
  const items = [
    { label: "Critical", count: counts.critical, color: "text-red-600",   bg: "bg-red-50",   icon: <AlertCircle size={16} /> },
    { label: "Warnings", count: counts.warning,  color: "text-amber-600", bg: "bg-amber-50", icon: <AlertTriangle size={16} /> },
    { label: "Positive", count: counts.positive, color: "text-green-600", bg: "bg-green-50", icon: <CheckCircle size={16} /> },
    { label: "Info",     count: counts.info,      color: "text-blue-600",  bg: "bg-blue-50",  icon: <Info size={16} /> },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {items.map(item => (
        <div key={item.label} className={`${item.bg} rounded-2xl border border-gray-100 p-4 flex items-center gap-3`}>
          <span className={item.color}>{item.icon}</span>
          <div>
            <p className="text-2xl font-extrabold text-gray-900">{item.count}</p>
            <p className="text-xs text-gray-500 font-semibold">{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Main page ────────────────────────────────────────────────────────────────
const AdminInsights = () => {
  const [insights, setInsights]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [filter, setFilter]           = useState("all");
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [newCount, setNewCount]       = useState(0);
  // Index threshold: insights at position < seenCount were seen on last visit
  const [seenCount, setSeenCount]     = useState(() => parseInt(localStorage.getItem(SEEN_KEY) || "0", 10));

  const load = useCallback((markRead = false) => {
    setLoading(true);
    adminService.getInsights()
      .then(r => {
        const all = r.data.insights || [];
        setInsights(all);
        setLastRefresh(new Date());

        const prevSeen = parseInt(localStorage.getItem(SEEN_KEY) || "0", 10);
        const fresh = Math.max(all.length - prevSeen, 0);
        setNewCount(fresh);

        if (markRead) {
          localStorage.setItem(SEEN_KEY, String(all.length));
          localStorage.setItem(SEEN_TS_KEY, Date.now().toString());
          setSeenCount(all.length);
          setNewCount(0);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // On mount: load and immediately mark as read
  useEffect(() => {
    load(true);
  }, [load]);

  const handleRefresh = () => load(true);

  const filtered = filter === "all" ? insights : insights.filter(i => i.severity === filter);

  // An insight is "new" if its position in the sorted list is beyond what was seen before
  // Since insights are sorted critical-first, new ones appear at the end of their severity group.
  // We track by index: anything at index >= seenCount (before this visit) is new.
  const prevSeen = parseInt(localStorage.getItem(SEEN_KEY) || "0", 10);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <Zap size={22} className="text-indigo-500" />
            Smart Insights
            {newCount > 0 && (
              <span className="ml-1 text-xs font-extrabold bg-indigo-600 text-white px-2.5 py-0.5 rounded-full">
                {newCount} new
              </span>
            )}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            AI-powered analysis · Refreshed {lastRefresh.toLocaleTimeString()}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <SummaryStrip insights={insights} newCount={newCount} />

          <div className="flex gap-2 flex-wrap">
            {FILTER_TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-colors border
                  ${filter === tab.key
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
              >
                {tab.label}
                {tab.key !== "all" && (
                  <span className="ml-1.5 opacity-70">
                    ({insights.filter(i => i.severity === tab.key).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <CheckCircle size={40} className="mx-auto mb-3 text-green-300" />
              <p className="font-semibold">No {filter !== "all" ? filter : ""} insights right now.</p>
              <p className="text-sm mt-1">Your store looks healthy!</p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-4">
              {filtered.map((insight, i) => (
                <InsightCard
                  key={i}
                  insight={insight}
                  isNew={i >= seenCount}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminInsights;
