import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import traderService from "../../../services/traderService";
import {
  FiPackage, FiPlusCircle, FiTrendingUp, FiAlertCircle,
  FiShoppingBag, FiDollarSign,
} from "react-icons/fi";
import { toAbsolute } from "../../../utils/imageUrl";

const StatCard = ({ label, value, icon, color, loading }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${color}`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">
        {loading ? "—" : value}
      </p>
      <p className="text-xs text-gray-500 font-medium leading-tight mt-0.5 truncate">{label}</p>
    </div>
  </div>
);

const TraderOverview = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      traderService.getProducts(),
      traderService.getStats(),
    ])
      .then(([prodRes, statsRes]) => {
        const raw = prodRes.data;
        const list = raw?.results || (Array.isArray(raw) ? raw : []);
        setProducts(list);
        // Use paginated count if available, otherwise list length
        setTotalCount(raw?.count ?? list.length);
        setStats(statsRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const active = products.filter((p) => p.is_active !== false).length;
  const outOfStock = products.filter((p) => !p.in_stock).length;

  const statCards = [
    { label: "Total Products",  value: totalCount ?? products.length,                                icon: <FiPackage />,    color: "bg-blue-50 text-blue-600" },
    { label: "Active Listings", value: active,                                                       icon: <FiTrendingUp />, color: "bg-green-50 text-green-600" },
    { label: "Out of Stock",    value: outOfStock,                                                   icon: <FiAlertCircle />,color: "bg-red-50 text-red-500" },
    { label: "Total Orders",    value: stats?.orders_count ?? "—",                                   icon: <FiShoppingBag />,color: "bg-purple-50 text-purple-600" },
    { label: "Products Sold",   value: stats?.products_sold ?? "—",                                  icon: <FiPackage />,    color: "bg-indigo-50 text-indigo-600" },
    { label: "Revenue",         value: stats ? `UGX ${Number(stats.revenue).toLocaleString()}` : "—",icon: <FiDollarSign />, color: "bg-emerald-50 text-emerald-600" },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">
          Welcome, {user?.first_name || user?.email} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">Here's an overview of your store.</p>
      </div>

      {/* Stats grid — 2 cols on mobile, 3 on sm+ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {statCards.map((s) => (
          <StatCard key={s.label} {...s} loading={loading} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6">
        <p className="font-bold text-gray-800 mb-3">Quick Actions</p>
        <div className="flex flex-row gap-3">
          <Link
            to="/trader/dashboard/add-product"
            className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all"
          >
            <FiPlusCircle /> Add Product
          </Link>
          <Link
            to="/trader/dashboard/products"
            className="flex items-center justify-center gap-2 border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold px-5 py-2.5 rounded-xl text-sm transition-all"
          >
            <FiPackage /> Manage Products
          </Link>
        </div>
      </div>

      {/* Recent Products */}
      {products.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6">
          <p className="font-bold text-gray-800 mb-3">Recent Products</p>
          <div className="space-y-2.5">
            {products.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                  {p.primary_image && (
                    <img src={toAbsolute(p.primary_image)} alt={p.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">{p.name}</p>
                  <p className="text-xs text-gray-500">UGX {Number(p.price).toLocaleString()}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0
                  ${p.in_stock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                  {p.in_stock ? "In Stock" : "Out"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TraderOverview;
