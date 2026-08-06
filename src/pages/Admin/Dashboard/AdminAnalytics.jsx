import React, { useEffect, useState } from "react";
import adminService from "../../../services/adminService";
import {
  FiUsers, FiUserPlus, FiRepeat, FiShoppingBag, FiDollarSign,
  FiEye, FiClock, FiMapPin, FiTrendingUp, FiPackage, FiRefreshCw, FiTruck,
  FiRotateCcw, FiXCircle, FiAlertCircle, FiSearch, FiShoppingCart,
  FiCreditCard, FiCheckCircle, FiPercent, FiFilter,
} from "react-icons/fi";

const fmt = (n) => Number(n || 0).toLocaleString();
const fmtUGX = (n) => `UGX ${Number(n || 0).toLocaleString()}`;
const fmtSec = (s) => {
  const sec = Math.round(s || 0);
  if (sec < 60) return `${sec}s`;
  return `${Math.floor(sec / 60)}m ${sec % 60}s`;
};

// Scale font size + weight by string length so long money values never overflow
const valueClass = (str) => {
  const len = String(str).length;
  if (len <= 6)  return "text-2xl font-extrabold";
  if (len <= 10) return "text-xl font-bold";
  if (len <= 14) return "text-base font-bold";
  if (len <= 18) return "text-sm font-semibold";
  return "text-xs font-semibold";
};

const StatCard = ({ icon, label, value, sub, color = "indigo" }) => {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600",
    green:  "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-600",
    blue:   "bg-blue-50 text-blue-600",
    red:    "bg-red-50 text-red-600",
    purple: "bg-purple-50 text-purple-600",
    teal:   "bg-teal-50 text-teal-600",
    orange: "bg-orange-50 text-orange-600",
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colors[color]}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
        <p className={`${valueClass(value)} text-gray-900 mt-0.5 leading-tight break-all`}>{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
};

const SectionTitle = ({ icon, title }) => (
  <div className="flex items-center gap-2 mb-4">
    <span className="text-indigo-500">{icon}</span>
    <h2 className="text-base font-extrabold text-gray-800">{title}</h2>
  </div>
);

const BarRow = ({ label, value, max, suffix = "", color = "bg-indigo-500" }) => {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-600">
        <span className="font-medium truncate max-w-[60%]">{label}</span>
        <span className="font-bold">{fmt(value)}{suffix}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

const MiniChart = ({ data, valueKey, labelKey, color = "#6366f1" }) => {
  if (!data?.length) return <p className="text-xs text-gray-400">No data yet</p>;
  const max = Math.max(...data.map((d) => d[valueKey] || 0), 1);
  return (
    <div className="flex items-end gap-0.5 h-16">
      {data.map((d, i) => {
        const h = Math.max(4, Math.round(((d[valueKey] || 0) / max) * 64));
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-0.5 group relative">
            <div
              className="w-full rounded-sm transition-all"
              style={{ height: h, backgroundColor: color, opacity: 0.8 }}
            />
            <div className="absolute bottom-full mb-1 hidden group-hover:block bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap z-10">
              {d[labelKey]}: {fmt(d[valueKey])}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// SVG multi-line chart — accepts lines: [{key, color, label}], data: [{month, ...keys}]
const MultiLineChart = ({ data, lines, yFmt = (v) => String(v) }) => {
  if (!data?.length) return <p className="text-xs text-gray-400">No data yet</p>;
  const W = 600, H = 160, PAD = { top: 16, right: 16, bottom: 28, left: 48 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const allVals = lines.flatMap(l => data.map(d => d[l.key] || 0));
  const maxVal = Math.max(...allVals, 1);
  const xScale = (i) => PAD.left + (i / (data.length - 1 || 1)) * innerW;
  const yScale = (v) => PAD.top + innerH - (v / maxVal) * innerH;
  const yTicks = [0, 0.5, 1].map(t => ({
    y: PAD.top + innerH - t * innerH,
    label: yFmt(Math.round(t * maxVal)),
  }));
  const xLabels = data.map((d, i) => ({ x: xScale(i), label: (d.month || d.day || '').slice(0, 7) }));
  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-3">
        {lines.map(l => (
          <span key={l.key} className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
            <span className="w-3 h-0.5 inline-block rounded" style={{ backgroundColor: l.color }} />
            {l.label}
          </span>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 160 }}>
        {yTicks.map((t, i) => (
          <g key={i}>
            <line x1={PAD.left} y1={t.y} x2={W - PAD.right} y2={t.y} stroke="#f3f4f6" strokeWidth="1" />
            <text x={PAD.left - 4} y={t.y + 4} textAnchor="end" fontSize="9" fill="#9ca3af">{t.label}</text>
          </g>
        ))}
        {lines.map(l => {
          const pts = data.map((d, i) => `${xScale(i)},${yScale(d[l.key] || 0)}`).join(' ');
          const areaPts = [
            ...data.map((d, i) => `${xScale(i)},${yScale(d[l.key] || 0)}`),
            `${xScale(data.length - 1)},${PAD.top + innerH}`,
            `${xScale(0)},${PAD.top + innerH}`,
          ].join(' ');
          return (
            <g key={l.key}>
              <polygon points={areaPts} fill={l.color} fillOpacity="0.07" />
              <polyline points={pts} fill="none" stroke={l.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
              {data.map((d, i) => (
                <circle key={i} cx={xScale(i)} cy={yScale(d[l.key] || 0)} r="3" fill={l.color} />
              ))}
            </g>
          );
        })}
        {xLabels.map((l, i) => (
          <text key={i} x={l.x} y={H - 4} textAnchor="middle" fontSize="9" fill="#9ca3af">{l.label}</text>
        ))}
      </svg>
    </div>
  );
};

// Conversion Funnel — SVG cone, text always inside
const ConversionFunnel = ({ steps }) => {
  if (!steps?.length) return null;

  const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#f97316', '#10b981'];
  const W = 600;
  const STEP_H = 48;
  const GAP_H = 18;  // space between steps for drop-off label
  const n = steps.length;
  const totalH = n * STEP_H + (n - 1) * GAP_H;
  const max = Math.max(...steps.map((s) => s.value), 1);

  // Top width of step i (as fraction of W), narrows toward bottom
  // Step 0 = full width, last step = 30% width
  const topFrac  = (i) => 1 - (i / n) * 0.70;
  const botFrac  = (i) => 1 - ((i + 1) / n) * 0.70;

  const toX = (frac) => (W - frac * W) / 2;
  const toXR = (frac) => W - toX(frac);

  const rows = steps.map((step, i) => {
    const y = i * (STEP_H + GAP_H);
    const tFrac = topFrac(i);
    const bFrac = botFrac(i);
    const x1 = toX(tFrac),  x2 = toXR(tFrac);  // top-left, top-right
    const x3 = toXR(bFrac), x4 = toX(bFrac);   // bottom-right, bottom-left
    const cx = W / 2;
    const cy = y + STEP_H / 2;
    const dropPct = i > 0 && steps[i - 1].value > 0
      ? Math.round(((steps[i - 1].value - step.value) / steps[i - 1].value) * 100)
      : null;
    return { step, i, y, x1, x2, x3, x4, cx, cy, dropPct, color: COLORS[i % COLORS.length] };
  });

  return (
    <svg viewBox={`0 0 ${W} ${totalH}`} className="w-full" style={{ maxHeight: 380 }}>
      <defs>
        {rows.map(({ i, x1, x2, x3, x4, y }) => (
          <clipPath key={i} id={`fc${i}`}>
            <polygon points={`${x1},${y} ${x2},${y} ${x3},${y + STEP_H} ${x4},${y + STEP_H}`} />
          </clipPath>
        ))}
      </defs>

      {rows.map(({ step, i, y, x1, x2, x3, x4, cx, cy, dropPct, color }) => (
        <g key={i}>
          {/* Drop-off label in the gap above this step */}
          {dropPct !== null && (
            <text
              x={cx} y={y - GAP_H / 2 + 5}
              textAnchor="middle" fontSize="10" fill="#f87171" fontWeight="600"
            >
              &#8595; {dropPct}% drop-off
            </text>
          )}

          {/* Trapezoid */}
          <polygon
            points={`${x1},${y} ${x2},${y} ${x3},${y + STEP_H} ${x4},${y + STEP_H}`}
            fill={color}
          />

          {/* Label — clipped to trapezoid so it never overflows */}
          <text
            x={cx - 60} y={cy + 4}
            fontSize="11" fill="white" fontWeight="700"
            clipPath={`url(#fc${i})`}
          >
            {step.label}
          </text>

          {/* Value — right-aligned inside trapezoid */}
          <text
            x={cx + 60} y={cy + 4}
            textAnchor="end" fontSize="11" fill="white" fontWeight="700" opacity="0.9"
            clipPath={`url(#fc${i})`}
          >
            {Number(step.value).toLocaleString()}
          </text>
        </g>
      ))}
    </svg>
  );
};

// Combined SVG line chart for commission + delivery fee
const CombinedLineChart = ({ data }) => {
  if (!data?.length) return <p className="text-xs text-gray-400">No data yet</p>;

  const W = 600, H = 160, PAD = { top: 16, right: 16, bottom: 28, left: 64 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const maxVal = Math.max(...data.map((d) => Math.max(d.commission, d.delivery)), 1);

  const xScale = (i) => PAD.left + (i / (data.length - 1 || 1)) * innerW;
  const yScale = (v) => PAD.top + innerH - (v / maxVal) * innerH;

  const polyline = (key, color) => {
    const pts = data.map((d, i) => `${xScale(i)},${yScale(d[key])}`).join(" ");
    return <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />;
  };

  const area = (key, color) => {
    const pts = [
      ...data.map((d, i) => `${xScale(i)},${yScale(d[key])}`),
      `${xScale(data.length - 1)},${PAD.top + innerH}`,
      `${xScale(0)},${PAD.top + innerH}`,
    ].join(" ");
    return <polygon points={pts} fill={color} fillOpacity="0.08" />;
  };

  // Y-axis ticks
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => ({
    y: PAD.top + innerH - t * innerH,
    label: `${(t * maxVal / 1000).toFixed(0)}k`,
  }));

  // X-axis labels (show first, middle, last)
  const xLabels = [0, Math.floor((data.length - 1) / 2), data.length - 1]
    .filter((i, idx, arr) => arr.indexOf(i) === idx)
    .map((i) => ({ x: xScale(i), label: data[i].day?.slice(5) || "" }));

  return (
    <div>
      {/* Legend */}
      <div className="flex items-center gap-4 mb-3 text-xs font-semibold">
        <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-indigo-500 inline-block rounded" /> Commission Earned</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-teal-500 inline-block rounded" /> Delivery Fees</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 160 }}>
        {/* Grid lines */}
        {yTicks.map((t, i) => (
          <g key={i}>
            <line x1={PAD.left} y1={t.y} x2={W - PAD.right} y2={t.y} stroke="#f3f4f6" strokeWidth="1" />
            <text x={PAD.left - 6} y={t.y + 4} textAnchor="end" fontSize="9" fill="#9ca3af">{t.label}</text>
          </g>
        ))}
        {/* Areas */}
        {area("commission", "#6366f1")}
        {area("delivery", "#14b8a6")}
        {/* Lines */}
        {polyline("commission", "#6366f1")}
        {polyline("delivery", "#14b8a6")}
        {/* Dots */}
        {data.map((d, i) => (
          <g key={i}>
            <circle cx={xScale(i)} cy={yScale(d.commission)} r="3" fill="#6366f1" />
            <circle cx={xScale(i)} cy={yScale(d.delivery)} r="3" fill="#14b8a6" />
          </g>
        ))}
        {/* X labels */}
        {xLabels.map((l, i) => (
          <text key={i} x={l.x} y={H - 4} textAnchor="middle" fontSize="9" fill="#9ca3af">{l.label}</text>
        ))}
      </svg>
    </div>
  );
};

const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const load = () => {
    setLoading(true);
    adminService.getAnalytics()
      .then((r) => { setData(r.data); setLastRefresh(new Date()); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );

  if (!data) return (
    <div className="text-center py-20 text-gray-400">Failed to load analytics.</div>
  );

  const { users, geography, orders, behavior, returns_analytics: ret, funnel_analytics: funnel, customer_analytics: cust } = data;
  const maxCity    = Math.max(...(geography.top_cities.map((c) => c.count)), 1);
  const maxViewed  = Math.max(...(behavior.most_viewed_products.map((p) => p.views)), 1);
  const maxTime    = Math.max(...(behavior.most_time_products.map((p) => p.total_seconds)), 1);
  const maxOrdered = Math.max(...(behavior.most_ordered_products.map((p) => p.orders)), 1);
  const maxCat     = Math.max(...(behavior.top_categories.map((c) => c.views)), 1);
  const maxBrand   = Math.max(...(behavior.top_brands.map((b) => b.views)), 1);
  const maxPage    = Math.max(...((behavior.top_pages || []).map((p) => p.views)), 1);
  const maxPageTime = Math.max(...((behavior.avg_time_per_page || []).map((p) => p.avg_seconds)), 1);

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-400 mt-1">Last 30 days · Refreshed {lastRefresh.toLocaleTimeString()}</p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
        >
          <FiRefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* ── User Overview ── */}
      <div>
        <SectionTitle icon={<FiUsers size={16} />} title="User Overview" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard icon={<FiUsers size={18} />}    label="Total Users"     value={fmt(users.total)}     color="indigo" />
          <StatCard icon={<FiUserPlus size={18} />} label="New (30d)"       value={fmt(users.new_30d)}   sub={`${fmt(users.new_7d)} this week`} color="green" />
          <StatCard icon={<FiUserPlus size={18} />} label="New (24h)"       value={fmt(users.new_24h)}   color="blue" />
          <StatCard icon={<FiRepeat size={18} />}   label="Returning"       value={fmt(users.returning)} sub="placed 2+ orders" color="purple" />
          <StatCard icon={<FiUsers size={18} />}    label="Customers"       value={fmt(users.customers)} color="yellow" />
          <StatCard icon={<FiUsers size={18} />}    label="Traders"         value={fmt(users.traders)}   color="red" />
        </div>
      </div>

      {/* ── Signups chart ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <SectionTitle icon={<FiTrendingUp size={16} />} title="Daily Signups (Last 30 Days)" />
        <MiniChart data={users.signups_by_day} valueKey="count" labelKey="day" color="#6366f1" />
        <div className="flex justify-between text-[10px] text-gray-300 mt-1">
          <span>{users.signups_by_day[0]?.day || ""}</span>
          <span>{users.signups_by_day[users.signups_by_day.length - 1]?.day || ""}</span>
        </div>
      </div>

      {/* ── Customer Analytics ── */}
      {cust && (
        <div>
          <SectionTitle icon={<FiUsers size={16} />} title="Customer Analytics" />

          {/* KPI row 1 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            <StatCard icon={<FiUsers size={18} />}       label="Total Customers"      value={fmt(cust.total_customers)}        color="indigo" />
            <StatCard icon={<FiUserPlus size={18} />}    label="New Customers (30d)"  value={fmt(cust.new_customers_30d)}      color="green" />
            <StatCard icon={<FiRepeat size={18} />}      label="Returning Customers"  value={fmt(cust.returning_customers)}    sub="placed 2+ orders" color="purple" />
            <StatCard icon={<FiEye size={18} />}         label="Active Customers"     value={fmt(cust.active_customers_30d)}   sub="ordered in last 30d" color="blue" />
          </div>

          {/* KPI row 2 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <StatCard icon={<FiPercent size={18} />}     label="Retention Rate"       value={`${cust.retention_rate}%`}        sub="30d cohort retained" color="teal" />
            <StatCard icon={<FiRepeat size={18} />}      label="Repeat Purchase Rate" value={`${cust.repeat_purchase_rate}%`}  sub="customers with 2+ orders" color="yellow" />
            <StatCard icon={<FiDollarSign size={18} />}  label="Avg CLV"              value={fmtUGX(cust.clv)}                 sub="avg lifetime spend" color="green" />
            <StatCard icon={<FiTrendingUp size={18} />}  label="CAC (proxy)"          value={fmtUGX(cust.cac)}                 sub="revenue ÷ new customers" color="orange" />
          </div>

          {/* Combined growth chart: new + active per month */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Customer Growth (Last 6 Months)</p>
            <p className="text-[11px] text-gray-400 mb-4">New registrations vs active customers per month</p>
            <MultiLineChart
              data={cust.growth_by_month}
              lines={[
                { key: 'new',    color: '#6366f1', label: 'New Customers' },
                { key: 'active', color: '#10b981', label: 'Active Customers' },
              ]}
            />
          </div>

          {/* Location breakdown */}
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Customers by City</p>
              {!cust.by_city?.length
                ? <p className="text-xs text-gray-400">No location data</p>
                : (() => {
                    const maxC = Math.max(...cust.by_city.map(c => c.count), 1);
                    return (
                      <div className="space-y-3">
                        {cust.by_city.map(c => (
                          <BarRow key={c.city} label={c.city} value={c.count} max={maxC} suffix=" customers" color="bg-indigo-400" />
                        ))}
                      </div>
                    );
                  })()
              }
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Customers by Country</p>
              {!cust.by_country?.length
                ? <p className="text-xs text-gray-400">No location data</p>
                : (() => {
                    const maxC = Math.max(...cust.by_country.map(c => c.count), 1);
                    return (
                      <div className="space-y-3">
                        {cust.by_country.map(c => (
                          <BarRow key={c.country} label={c.country} value={c.count} max={maxC} suffix=" customers" color="bg-teal-400" />
                        ))}
                      </div>
                    );
                  })()
              }
            </div>
          </div>
        </div>
      )}

      {/* ── Orders ── */}
      <div>
        <SectionTitle icon={<FiShoppingBag size={16} />} title="Orders (Last 30 Days)" />

        {/* KPI row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <StatCard icon={<FiShoppingBag size={18} />} label="Total Orders"       value={fmt(orders.total_30d)}                    color="indigo" />
          <StatCard icon={<FiDollarSign size={18} />}  label="Revenue (30d)"      value={fmtUGX(orders.revenue_30d)}               color="green" />
          <StatCard icon={<FiTrendingUp size={18} />}  label="Commission Earned"  value={fmtUGX(orders.commission_earned)}          sub="10% on trader products" color="purple" />
          <StatCard icon={<FiTruck size={18} />}       label="Delivery Fees"      value={fmtUGX(orders.delivery_fees_collected)}    sub="collected from orders" color="teal" />
        </div>

        {/* Daily orders bar chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Daily Orders</p>
          <MiniChart data={orders.by_day} valueKey="count" labelKey="day" color="#10b981" />
        </div>

        {/* Combined commission + delivery line graph */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Commission & Delivery Fees — Daily (30d)</p>
          <p className="text-[11px] text-gray-400 mb-4">UGX collected per day</p>
          <CombinedLineChart data={orders.revenue_by_day || []} />
        </div>
      </div>

      {/* ── Funnel & Conversion ── */}
      {funnel && (
        <div>
          <SectionTitle icon={<FiFilter size={16} />} title="Search, Funnel & Conversion (Last 30 Days)" />

          {/* Search KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <StatCard icon={<FiSearch size={18} />}       label="Search Sessions"      value={fmt(funnel.search_sessions_30d)}          sub={`${fmt(funnel.total_searches_30d)} total searches`} color="blue" />
            <StatCard icon={<FiShoppingCart size={18} />} label="Add-to-Cart Rate"      value={`${funnel.add_to_cart_rate}%`}            sub="of product viewers" color="green" />
            <StatCard icon={<FiXCircle size={18} />}      label="Cart Abandonment"      value={`${funnel.cart_abandonment_rate}%`}       sub="had cart, never ordered" color="red" />
            <StatCard icon={<FiPercent size={18} />}      label="Checkout Abandonment"  value={`${funnel.checkout_abandonment_rate}%`}   sub="ordered, payment not received" color="orange" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 mb-6">
            <StatCard icon={<FiCheckCircle size={18} />} label="Conversion Rate"    value={`${funnel.conversion_rate}%`}   sub="visitors → delivered orders" color="purple" />
            <StatCard icon={<FiCreditCard size={18} />}  label="Pending Orders"     value={fmt(funnel.pending_orders_30d)} sub="placed, awaiting payment" color="yellow" />
          </div>

          {/* Cone funnel */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Conversion Funnel</p>
            <p className="text-[11px] text-gray-400 mb-5">Visitors &rarr; Product Views &rarr; Add to Cart &rarr; Orders Placed &rarr; Payment Received &rarr; Delivered</p>
            <ConversionFunnel
              steps={[
                { label: 'Visitors',          value: funnel.visitors_30d },
                { label: 'Product Views',     value: funnel.product_viewers_30d },
                { label: 'Add to Cart',       value: funnel.add_to_cart_sessions },
                { label: 'Orders Placed',     value: funnel.orders_placed_30d },
                { label: 'Payment Received',  value: funnel.payment_received_30d },
                { label: 'Delivered',         value: funnel.delivered_30d },
              ]}
            />
          </div>
        </div>
      )}

      {/* ── Returns & Cancellations ── */}
      {ret && (
        <div>
          <SectionTitle icon={<FiRotateCcw size={16} />} title="Returns & Cancellations" />

          {/* KPI row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <StatCard
              icon={<FiAlertCircle size={18} />}
              label="Awaiting Pickup"
              value={fmt(ret.not_picked_up)}
              sub={`${fmt(ret.not_picked_up_30d)} in last 30d`}
              color="orange"
            />
            <StatCard
              icon={<FiXCircle size={18} />}
              label="Cancelled Orders"
              value={fmt(ret.cancelled_total)}
              sub={`${fmt(ret.cancelled_30d)} in last 30d`}
              color="red"
            />
            <StatCard
              icon={<FiRotateCcw size={18} />}
              label="Return Requests"
              value={fmt(ret.return_requests_total)}
              sub={`${fmt(ret.return_requests_30d)} in last 30d`}
              color="yellow"
            />
            <StatCard
              icon={<FiPackage size={18} />}
              label="Returns (30d)"
              value={fmt(ret.return_requests_30d)}
              sub="user-initiated"
              color="purple"
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            {/* Returns by reason */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Returns by Reason</p>
              {!ret.by_reason?.length
                ? <p className="text-xs text-gray-400">No returns yet</p>
                : (() => {
                    const maxR = Math.max(...ret.by_reason.map((r) => r.count), 1);
                    const REASON_LABELS = {
                      defective: 'Defective / Faulty',
                      wrong_item: 'Wrong Item',
                      not_as_described: 'Not as Described',
                      damaged_delivery: 'Damaged in Delivery',
                      other: 'Other',
                    };
                    return (
                      <div className="space-y-3">
                        {ret.by_reason.map((r) => (
                          <BarRow
                            key={r.reason}
                            label={REASON_LABELS[r.reason] || r.reason}
                            value={r.count}
                            max={maxR}
                            suffix=" returns"
                            color="bg-orange-400"
                          />
                        ))}
                      </div>
                    );
                  })()
              }
            </div>

            {/* Returns by status */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Return Requests by Status</p>
              {!ret.by_status?.length
                ? <p className="text-xs text-gray-400">No returns yet</p>
                : (() => {
                    const maxS = Math.max(...ret.by_status.map((s) => s.count), 1);
                    const STATUS_COLORS = {
                      pending: 'bg-yellow-400',
                      approved: 'bg-green-400',
                      rejected: 'bg-red-400',
                      completed: 'bg-indigo-400',
                    };
                    return (
                      <div className="space-y-3">
                        {ret.by_status.map((s) => (
                          <BarRow
                            key={s.status}
                            label={s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                            value={s.count}
                            max={maxS}
                            suffix=" requests"
                            color={STATUS_COLORS[s.status] || 'bg-gray-400'}
                          />
                        ))}
                      </div>
                    );
                  })()
              }
            </div>
          </div>

          {/* Daily returns line chart */}
          {ret.by_day?.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5 mt-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Daily Return Requests (30d)</p>
              <MiniChart data={ret.by_day} valueKey="count" labelKey="day" color="#f97316" />
              <div className="flex justify-between text-[10px] text-gray-300 mt-1">
                <span>{ret.by_day[0]?.day || ""}</span>
                <span>{ret.by_day[ret.by_day.length - 1]?.day || ""}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Geography ── */}
      {geography.top_cities.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <SectionTitle icon={<FiMapPin size={16} />} title="Top Cities by Users" />
          <div className="space-y-3">
            {geography.top_cities.map((c) => (
              <BarRow key={c.city} label={c.city} value={c.count} max={maxCity} color="bg-blue-400" />
            ))}
          </div>
        </div>
      )}

      {/* ── Top Pages ── */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <SectionTitle icon={<FiEye size={16} />} title="Most Visited Pages (30d)" />
          {!(behavior.top_pages?.length)
            ? <p className="text-xs text-gray-400">No data yet</p>
            : <div className="space-y-3">
                {behavior.top_pages.map((p) => (
                  <BarRow key={p.path} label={p.path} value={p.views} max={maxPage} suffix=" views" color="bg-indigo-400" />
                ))}
              </div>
          }
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <SectionTitle icon={<FiClock size={16} />} title="Avg Time per Page (30d)" />
          {!(behavior.avg_time_per_page?.length)
            ? <p className="text-xs text-gray-400">No data yet</p>
            : <div className="space-y-3">
                {behavior.avg_time_per_page.map((p) => (
                  <div key={p.path} className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span className="font-medium truncate max-w-[60%]">{p.path}</span>
                      <span className="font-bold">{fmtSec(p.avg_seconds)}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-teal-400" style={{ width: `${Math.round((p.avg_seconds / maxPageTime) * 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
          }
        </div>
      </div>

      {/* ── Most Viewed Products ── */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <SectionTitle icon={<FiEye size={16} />} title="Most Viewed Products (30d)" />
          {behavior.most_viewed_products.length === 0
            ? <p className="text-xs text-gray-400">No data yet</p>
            : <div className="space-y-3">
                {behavior.most_viewed_products.map((p) => (
                  <BarRow key={p.product__id} label={p.product__name} value={p.views} max={maxViewed} suffix=" views" color="bg-indigo-400" />
                ))}
              </div>
          }
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <SectionTitle icon={<FiClock size={16} />} title="Most Time Spent on Products (30d)" />
          {behavior.most_time_products.length === 0
            ? <p className="text-xs text-gray-400">No data yet</p>
            : <div className="space-y-3">
                {behavior.most_time_products.map((p) => (
                  <div key={p.product__id} className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span className="font-medium truncate max-w-[60%]">{p.product__name}</span>
                      <span className="font-bold">{fmtSec(p.total_seconds)}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-purple-400" style={{ width: `${Math.round((p.total_seconds / maxTime) * 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
          }
        </div>
      </div>

      {/* ── Most Ordered ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <SectionTitle icon={<FiPackage size={16} />} title="Most Ordered Products (30d)" />
        {behavior.most_ordered_products.length === 0
          ? <p className="text-xs text-gray-400">No orders yet</p>
          : <div className="space-y-3">
              {behavior.most_ordered_products.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <BarRow label={p.items__product_name} value={p.orders} max={maxOrdered} suffix=" orders" color="bg-green-400" />
                  </div>
                </div>
              ))}
            </div>
        }
      </div>

      {/* ── Categories & Brands ── */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <SectionTitle icon={<FiTrendingUp size={16} />} title="Top Browsed Categories (30d)" />
          {behavior.top_categories.length === 0
            ? <p className="text-xs text-gray-400">No data yet</p>
            : <div className="space-y-3">
                {behavior.top_categories.map((c) => (
                  <BarRow key={c.category__name} label={c.category__name} value={c.views} max={maxCat} suffix=" views" color="bg-yellow-400" />
                ))}
              </div>
          }
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <SectionTitle icon={<FiTrendingUp size={16} />} title="Top Browsed Brands (30d)" />
          {behavior.top_brands.length === 0
            ? <p className="text-xs text-gray-400">No data yet</p>
            : <div className="space-y-3">
                {behavior.top_brands.map((b) => (
                  <BarRow key={b.brand__name} label={b.brand__name} value={b.views} max={maxBrand} suffix=" views" color="bg-red-400" />
                ))}
              </div>
          }
        </div>
      </div>

      {/* ── Avg Time Spent per Day ── */}
      {behavior.avg_time_by_day.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <SectionTitle icon={<FiClock size={16} />} title="Avg Time Spent per Day (seconds)" />
          <MiniChart data={behavior.avg_time_by_day} valueKey="avg_seconds" labelKey="day" color="#a855f7" />
          <div className="flex justify-between text-[10px] text-gray-300 mt-1">
            <span>{behavior.avg_time_by_day[0]?.day || ""}</span>
            <span>{behavior.avg_time_by_day[behavior.avg_time_by_day.length - 1]?.day || ""}</span>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminAnalytics;
