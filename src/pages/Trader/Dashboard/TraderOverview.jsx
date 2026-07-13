import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import traderService from "../../../services/traderService";
import { FiPackage, FiPlusCircle, FiTrendingUp, FiAlertCircle } from "react-icons/fi";

const TraderOverview = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    traderService.getProducts()
      .then((res) => setProducts(res.data?.results || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const active = products.filter((p) => p.is_active !== false).length;
  const outOfStock = products.filter((p) => !p.in_stock).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">
          Welcome, {user?.first_name || user?.email} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">Here's an overview of your store.</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Total Products", value: products.length, icon: <FiPackage />, color: "bg-blue-50 text-blue-600" },
          { label: "Active Listings", value: active, icon: <FiTrendingUp />, color: "bg-green-50 text-green-600" },
          { label: "Out of Stock", value: outOfStock, icon: <FiAlertCircle />, color: "bg-red-50 text-red-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${s.color}`}>{s.icon}</div>
            <div>
              <p className="text-2xl font-extrabold text-gray-900">{loading ? "—" : s.value}</p>
              <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <p className="font-bold text-gray-800 mb-4">Quick Actions</p>
        <div className="flex flex-wrap gap-3">
          <Link to="/trader/dashboard/add-product" className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all">
            <FiPlusCircle /> Add Product
          </Link>
          <Link to="/trader/dashboard/products" className="flex items-center gap-2 border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold px-5 py-2.5 rounded-xl text-sm transition-all">
            <FiPackage /> Manage Products
          </Link>
        </div>
      </div>

      {/* Recent products */}
      {products.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <p className="font-bold text-gray-800 mb-4">Recent Products</p>
          <div className="space-y-3">
            {products.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                  {p.primary_image && <img src={p.primary_image} alt={p.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">{p.name}</p>
                  <p className="text-xs text-gray-500">UGX {Number(p.price).toLocaleString()}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.in_stock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                  {p.in_stock ? "In Stock" : "Out of Stock"}
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
