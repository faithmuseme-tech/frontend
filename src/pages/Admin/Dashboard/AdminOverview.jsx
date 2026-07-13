import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import adminService from "../../../services/adminService";
import { FiUsers, FiBriefcase, FiShoppingBag, FiPackage, FiDollarSign, FiClock } from "react-icons/fi";
import { formatUGX } from "../../../utils/currency";

const StatCard = ({ icon, label, value, color, to }) => (
  <Link to={to} className={`bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow`}>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${color}`}>{icon}</div>
    <div>
      <p className="text-2xl font-extrabold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
    </div>
  </Link>
);

const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getStats()
      .then((r) => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = stats ? [
    { icon: <FiUsers />, label: "Total Customers", value: stats.total_users, color: "bg-blue-50 text-blue-600", to: "/admin/dashboard/users" },
    { icon: <FiBriefcase />, label: "Total Traders", value: stats.total_traders, color: "bg-indigo-50 text-indigo-600", to: "/admin/dashboard/traders" },
    { icon: <FiClock />, label: "Pending Traders", value: stats.pending_traders, color: "bg-yellow-50 text-yellow-600", to: "/admin/dashboard/traders?status=pending" },
    { icon: <FiShoppingBag />, label: "Total Orders", value: stats.total_orders, color: "bg-green-50 text-green-600", to: "/admin/dashboard/orders" },
    { icon: <FiDollarSign />, label: "Total Revenue", value: formatUGX(stats.total_revenue), color: "bg-emerald-50 text-emerald-600", to: "/admin/dashboard/orders" },
    { icon: <FiPackage />, label: "Active Products", value: stats.total_products, color: "bg-purple-50 text-purple-600", to: "/admin/dashboard/products" },
  ] : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Dashboard Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back, Admin.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 h-24 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {cards.map((c) => <StatCard key={c.label} {...c} />)}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <p className="font-bold text-gray-800 mb-3">Quick Actions</p>
          <div className="flex flex-wrap gap-3">
            <Link to="/admin/dashboard/traders?status=pending" className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-all">
              <FiClock /> Review Pending Traders
            </Link>
            <Link to="/admin/dashboard/orders" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-all">
              <FiShoppingBag /> Manage Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
