import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import adminService from "../../../services/adminService";
import { formatUGX, moneyClass } from "../../../utils/currency";
import { useSiteSettings } from "../../../context/SiteSettingsContext";
import {
  FiUsers, FiBriefcase, FiShoppingBag, FiPackage, FiDollarSign,
  FiClock, FiTrendingUp, FiTrendingDown, FiRefreshCw, FiAlertTriangle,
  FiBarChart2, FiZap, FiCheckCircle, FiXCircle, FiArrowRight,
} from "react-icons/fi";

// ── Scale font size by string length (for any value, not just money) ─────────
const valueClass = (str) => {
  const len = String(str).length;
  if (len <= 6)  return "text-2xl font-extrabold";
  if (len <= 10) return "text-xl font-bold";
  if (len <= 14) return "text-base font-bold";
  if (len <= 18) return "text-sm font-semibold";
  return "text-xs font-semibold";
};

// ── Reusable stat card ────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, sub, color, to }) => {
  const inner = (
    <div className="bg-white rounded-2xl border border-gray-100 p-3 sm:p-5 flex items-center gap-3 sm:gap-4 hover:shadow-md transition-shadow h-full">
      <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-base sm:text-xl flex-shrink-0 ${color}`}>{icon}</div>
      <div className="min-w-0">
        <p className={`${valueClass(value)} text-gray-900 leading-tight break-all`}>{value}</p>
        <p className="text-[10px] sm:text-xs text-gray-500 font-medium mt-0.5">{label}</p>
        {sub && <p className="text-[10px] text-gray-400 mt-0.5 hidden sm:block">{sub}</p>}
      </div>
    </div>
  );
  return to ? <Link to={to} className="block">{inner}</Link> : <div>{inner}</div>;
};

// ── Section title ─────────────────────────────────────────────────────────────
const Section = ({ title, icon, to, children }) => (
  <div>
    <div className="flex items-center justify-between mb-3">
      <p className="font-extrabold text-gray-800 flex items-center gap-2 text-sm">{icon}{title}</p>
      {to && (
        <Link to={to} className="text-xs text-indigo-600 hover:underline font-semibold flex items-center gap-1">
          View all <FiArrowRight size={11} />
        </Link>
      )}
    </div>
    {children}
  </div>
);

// ── Insight severity row ──────────────────────────────────────────────────────
const InsightRow = ({ insight, navigate }) => {
  const colors = {
    critical: "bg-red-50 border-red-200 text-red-700",
    warning:  "bg-amber-50 border-amber-200 text-amber-700",
    positive: "bg-green-50 border-green-200 text-green-700",
    info:     "bg-blue-50 border-blue-200 text-blue-700",
  };
  const dot = {
    critical: "bg-red-500",
    warning:  "bg-amber-500",
    positive: "bg-green-500",
    info:     "bg-blue-500",
  };
  return (
    <div
      onClick={() => navigate("/admin/dashboard/insights")}
      className={`rounded-xl border p-3 cursor-pointer hover:opacity-80 transition-opacity flex flex-col gap-1.5 ${colors[insight.severity] || colors.info}`}
    >
      <div className="flex items-center justify-between gap-1">
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dot[insight.severity] || dot.info}`} />
        {insight.metric && (
          <span className="text-[10px] font-bold bg-white/60 px-1.5 py-0.5 rounded-full whitespace-nowrap">
            {insight.metric}
          </span>
        )}
      </div>
      <p className="text-[11px] font-bold leading-tight line-clamp-2">{insight.title}</p>
    </div>
  );
};

// ── Mini bar (for funnel / rates) ─────────────────────────────────────────────
const MiniBar = ({ label, value, max, color = "bg-indigo-500", suffix = "" }) => {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1 gap-2">
        <span className="text-gray-600 font-medium truncate">{label}</span>
        <span className="font-bold text-gray-800 flex-shrink-0">{typeof value === "number" && !suffix ? value.toLocaleString() : `${value}${suffix}`}</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────
const AdminOverview = () => {
  const navigate = useNavigate();
  const { refresh: refreshSettings } = useSiteSettings();
  const [stats, setStats]         = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [insights, setInsights]   = useState([]);
  const [sellerOpen, setSellerOpen] = useState(true);
  const [toggling, setToggling]   = useState(false);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([
      adminService.getStats(),
      adminService.getAnalytics(),
      adminService.getInsights(),
      adminService.getSettings(),
    ]).then(([s, a, ins, set]) => {
      setStats(s.data);
      setAnalytics(a.data);
      setInsights((ins.data.insights || []).slice(0, 8));
      setSellerOpen(set.data.seller_registration_open);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const toggleSeller = async () => {
    setToggling(true);
    try {
      const res = await adminService.updateSettings({ seller_registration_open: !sellerOpen });
      setSellerOpen(res.data.seller_registration_open);
      refreshSettings(); // sync footer immediately
    } catch {} finally { setToggling(false); }
  };

  if (loading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(8).fill(0).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 h-24 animate-pulse" />
        ))}
      </div>
    </div>
  );

  const o  = analytics?.orders          || {};
  const ca = analytics?.customer_analytics || {};
  const f  = analytics?.funnel_analytics  || {};
  const r  = analytics?.returns_analytics || {};

  // Always show 4 insight cards, pad with nulls if fewer
  const urgentInsights = insights.filter(i => i.severity === "critical" || i.severity === "warning");
  const positiveInsights = insights.filter(i => i.severity === "positive");
  const infoInsights = insights.filter(i => i.severity === "info");
  const ranked = [...urgentInsights, ...positiveInsights, ...infoInsights];
  const shownInsights = Array.from({ length: 4 }, (_, i) => ranked[i] || null);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back, Admin.</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Link to="/admin/dashboard/analytics" className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 text-xs sm:text-sm font-semibold hover:bg-gray-50 transition-colors">
            <FiBarChart2 size={13} /> Analytics
          </Link>
          <Link to="/admin/dashboard/insights" className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold transition-colors">
            <FiZap size={13} /> Smart Insights
          </Link>
        </div>
      </div>

      {/* ── Row 1: Core KPIs ── */}
      <Section title="Store Overview" icon={<FiBarChart2 size={14} className="text-gray-400" />}>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard icon={<FiUsers />}      label="Total Customers"  value={stats?.total_users?.toLocaleString() ?? "—"}    color="bg-blue-50 text-blue-600"    to="/admin/dashboard/users" />
          <StatCard icon={<FiBriefcase />}  label="Total Traders"    value={stats?.total_traders?.toLocaleString() ?? "—"}  color="bg-indigo-50 text-indigo-600" to="/admin/dashboard/traders" />
          <StatCard icon={<FiShoppingBag />} label="Total Orders"    value={stats?.total_orders?.toLocaleString() ?? "—"}   color="bg-green-50 text-green-600"   to="/admin/dashboard/orders" />
          <StatCard icon={<FiPackage />}    label="Active Products"  value={stats?.total_products?.toLocaleString() ?? "—"} color="bg-purple-50 text-purple-600" to="/admin/dashboard/products" />
        </div>
      </Section>

      {/* ── Row 2: Revenue & Customers ── */}
      <Section title="Revenue & Customers (30 days)" icon={<FiDollarSign size={14} className="text-gray-400" />} to="/admin/dashboard/analytics">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            icon={<FiDollarSign />}
            label="Revenue (30d)"
            value={formatUGX(o.revenue_30d ?? stats?.total_revenue ?? 0)}
            color="bg-emerald-50 text-emerald-600"
            to="/admin/dashboard/orders"
          />
          <StatCard
            icon={<FiTrendingUp />}
            label="Commission Earned"
            value={formatUGX(o.commission_earned ?? 0)}
            sub="30-day platform fee"
            color="bg-cyan-50 text-cyan-600"
            to="/admin/dashboard/analytics"
          />
          <StatCard
            icon={<FiUsers />}
            label="Active Customers"
            value={ca.active_customers_30d?.toLocaleString() ?? "—"}
            sub="Ordered in last 30d"
            color="bg-blue-50 text-blue-600"
            to="/admin/dashboard/users?role=customer"
          />
          <StatCard
            icon={<FiRefreshCw />}
            label="Repeat Purchase Rate"
            value={`${ca.repeat_purchase_rate ?? 0}%`}
            sub={`${ca.returning_customers ?? 0} returning customers`}
            color="bg-violet-50 text-violet-600"
            to="/admin/dashboard/analytics"
          />
        </div>
      </Section>

      {/* ── Row 3: Orders & Returns ── */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Orders status */}
        <Section title="Orders (30 days)" icon={<FiShoppingBag size={14} className="text-gray-400" />} to="/admin/dashboard/orders">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
            <MiniBar label="Orders Placed"      value={f.orders_placed_30d ?? 0}    max={f.orders_placed_30d ?? 1}  color="bg-indigo-500" />
            <MiniBar label="Payment Received"   value={f.payment_received_30d ?? 0} max={f.orders_placed_30d ?? 1}  color="bg-green-500" />
            <MiniBar label="Delivered"          value={f.delivered_30d ?? 0}        max={f.orders_placed_30d ?? 1}  color="bg-emerald-500" />
            <MiniBar label="Pending (unconfirmed)" value={f.pending_orders_30d ?? 0} max={f.orders_placed_30d ?? 1} color="bg-yellow-400" />
            <div className="pt-2 border-t border-gray-50 grid grid-cols-3 gap-1 text-[10px] sm:text-xs text-gray-500">
              <span>Conversion:<br /><strong className="text-gray-800">{f.conversion_rate ?? 0}%</strong></span>
              <span>Cart abandon:<br /><strong className="text-gray-800">{f.cart_abandonment_rate ?? 0}%</strong></span>
              <span>Checkout abandon:<br /><strong className="text-gray-800">{f.checkout_abandonment_rate ?? 0}%</strong></span>
            </div>
          </div>
        </Section>

        {/* Returns & Cancellations */}
        <Section title="Returns & Cancellations" icon={<FiRefreshCw size={14} className="text-gray-400" />} to="/admin/dashboard/returns">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { label: "Awaiting Pickup",  value: r.not_picked_up ?? 0,         color: "text-orange-600 bg-orange-50", to: "/admin/dashboard/orders?status=pickup" },
                { label: "Cancelled (30d)",  value: r.cancelled_30d ?? 0,          color: "text-red-600 bg-red-50",       to: "/admin/dashboard/orders?status=cancelled" },
                { label: "Return Requests",  value: r.return_requests_total ?? 0,  color: "text-amber-600 bg-amber-50",   to: "/admin/dashboard/returns" },
              ].map(item => (
                <Link key={item.label} to={item.to} className={`rounded-xl p-2 sm:p-3 text-center hover:opacity-80 transition-opacity ${item.color}`}>
                  <p className={`${valueClass(item.value)} leading-tight`}>{item.value}</p>
                  <p className="text-[9px] sm:text-[10px] font-semibold mt-0.5 leading-tight">{item.label}</p>
                </Link>
              ))}
            </div>
            <div className="space-y-2 pt-1">
              {(r.by_reason || []).slice(0, 3).map(row => (
                <MiniBar
                  key={row.reason}
                  label={row.reason?.replace(/_/g, " ")}
                  value={row.count}
                  max={r.return_requests_total || 1}
                  color="bg-amber-400"
                />
              ))}
            </div>
          </div>
        </Section>
      </div>

      {/* ── Row 4: Pending actions + Smart Insights ── */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Pending actions */}
        <Section title="Pending Actions" icon={<FiAlertTriangle size={14} className="text-amber-500" />}>
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  label: "Pending Traders",
                  value: stats?.pending_traders ?? 0,
                  icon: <FiClock size={14} />,
                  to: "/admin/dashboard/traders?status=pending",
                  urgent: (stats?.pending_traders ?? 0) > 0,
                  urgentColor: "bg-yellow-50 border-yellow-200 text-yellow-700",
                  calmColor: "bg-gray-50 border-gray-100 text-gray-500",
                },
                {
                  label: "Unconfirmed Orders",
                  value: f.pending_orders_30d ?? 0,
                  icon: <FiShoppingBag size={14} />,
                  to: "/admin/dashboard/orders?status=pending",
                  urgent: (f.pending_orders_30d ?? 0) > 0,
                  urgentColor: "bg-indigo-50 border-indigo-200 text-indigo-700",
                  calmColor: "bg-gray-50 border-gray-100 text-gray-500",
                },
                {
                  label: "Pending Returns",
                  value: (r.by_status || []).find(s => s.status === "pending")?.count ?? 0,
                  icon: <FiRefreshCw size={14} />,
                  to: "/admin/dashboard/returns?status=pending",
                  urgent: ((r.by_status || []).find(s => s.status === "pending")?.count ?? 0) > 0,
                  urgentColor: "bg-amber-50 border-amber-200 text-amber-700",
                  calmColor: "bg-gray-50 border-gray-100 text-gray-500",
                },
                {
                  label: "Awaiting Pickup",
                  value: r.not_picked_up ?? 0,
                  icon: <FiPackage size={14} />,
                  to: "/admin/dashboard/orders?status=pickup",
                  urgent: (r.not_picked_up ?? 0) > 0,
                  urgentColor: "bg-orange-50 border-orange-200 text-orange-700",
                  calmColor: "bg-gray-50 border-gray-100 text-gray-500",
                },
              ].map(item => (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`flex flex-col gap-1 p-3 rounded-xl border transition-colors ${item.urgent ? item.urgentColor : item.calmColor}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="opacity-70">{item.icon}</span>
                    <span className="text-lg font-extrabold leading-none">{item.value}</span>
                  </div>
                  <span className="text-[10px] font-semibold leading-tight">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </Section>

        {/* Smart Insights preview */}
        <Section title="Smart Insights" icon={<FiZap size={14} className="text-indigo-500" />} to="/admin/dashboard/insights">
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="grid grid-cols-2 gap-2">
              {shownInsights.map((ins, i) =>
                ins ? (
                  <InsightRow key={i} insight={ins} navigate={navigate} />
                ) : (
                  <div key={i} className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-3 flex items-center justify-center">
                    <FiCheckCircle size={14} className="text-gray-300" />
                  </div>
                )
              )}
            </div>
            <Link
              to="/admin/dashboard/insights"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-dashed border-indigo-300 text-indigo-600 text-xs font-bold hover:bg-indigo-50 transition-colors mt-3"
            >
              <FiZap size={12} /> View all insights
            </Link>
          </div>
        </Section>
      </div>

      {/* ── Row 5: Customer health + Seller toggle ── */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Customer health */}
        <Section title="Customer Health" icon={<FiUsers size={14} className="text-gray-400" />} to="/admin/dashboard/analytics">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {[
                { label: "New (30d)",      value: ca.new_customers_30d ?? 0,    color: "text-blue-600 bg-blue-50" },
                { label: "Retention Rate", value: `${ca.retention_rate ?? 0}%`, color: "text-green-600 bg-green-50" },
                { label: "Avg CLV",        value: formatUGX(ca.clv ?? 0),       color: "text-violet-600 bg-violet-50" },
                { label: "Returning",      value: ca.returning_customers ?? 0,  color: "text-indigo-600 bg-indigo-50" },
              ].map(item => (
                <div key={item.label} className={`rounded-xl p-2 sm:p-3 ${item.color}`}>
                  <p className={`${valueClass(item.value)} leading-tight break-all`}>{item.value}</p>
                  <p className="text-[9px] sm:text-[10px] font-semibold mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Controls */}
        <Section title="Store Controls" icon={<FiCheckCircle size={14} className="text-gray-400" />}>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
            {/* Seller registration toggle */}
            <div>
              <p className="text-sm font-bold text-gray-800 mb-0.5">Seller Registration</p>
              <p className="text-xs text-gray-400 mb-3">Control whether "Sell with CartPulse" is visible to the public.</p>
              <div className="flex items-center justify-between gap-3">
                <span className={`text-xs sm:text-sm font-semibold leading-tight ${sellerOpen ? "text-emerald-600" : "text-red-500"}`}>
                  {sellerOpen ? "Open — anyone can apply" : "Closed — hidden"}
                </span>
                <button
                  onClick={toggleSeller}
                  disabled={toggling}
                  className={`relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-50 ${sellerOpen ? "bg-emerald-500" : "bg-gray-300"}`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${sellerOpen ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>
            </div>

            {/* Quick links */}
            <div className="border-t border-gray-50 pt-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Quick Actions</p>
              <div className="grid grid-cols-3 gap-2">
                <Link to="/admin/dashboard/traders?status=pending" className="flex items-center justify-center gap-1.5 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-3 py-2 rounded-xl text-xs transition-colors">
                  <FiClock size={11} /> Pending Traders
                </Link>
                <Link to="/admin/dashboard/orders?status=pending" className="flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-3 py-2 rounded-xl text-xs transition-colors">
                  <FiShoppingBag size={11} /> Confirm Orders
                </Link>
                <Link to="/admin/dashboard/returns?status=pending" className="flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-3 py-2 rounded-xl text-xs transition-colors">
                  <FiRefreshCw size={11} /> Review Returns
                </Link>
              </div>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
};

export default AdminOverview;
