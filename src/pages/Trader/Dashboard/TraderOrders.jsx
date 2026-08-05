import React, { useEffect, useState } from "react";
import traderService from "../../../services/traderService";
import { FiShoppingBag, FiDollarSign, FiPackage, FiAlertCircle } from "react-icons/fi";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-indigo-100 text-indigo-700",
  pickup: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
  refunded: "bg-gray-100 text-gray-600",
};

const TraderOrders = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([traderService.getOrders(), traderService.getStats()])
      .then(([ordersRes, statsRes]) => {
        setOrders(ordersRes.data?.results || ordersRes.data || []);
        setStats(statsRes.data);
      })
      .catch(() => setError("Failed to load orders."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-gray-900">My Orders</h1>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
          <FiAlertCircle /> {error}
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { label: "Total Revenue", value: `UGX ${Number(stats.revenue).toLocaleString()}`, icon: <FiDollarSign />, color: "bg-green-50 text-green-600" },
            { label: "Products Sold", value: stats.products_sold, icon: <FiPackage />, color: "bg-blue-50 text-blue-600" },
            { label: "Total Orders", value: stats.orders_count, icon: <FiShoppingBag />, color: "bg-purple-50 text-purple-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${s.color}`}>{s.icon}</div>
              <div>
                <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500 font-medium">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Orders table */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <FiShoppingBag className="text-5xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No orders yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Order #</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Customer</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Items</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-gray-600">
                    #{String(order.order_number).slice(0, 8).toUpperCase()}
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell text-gray-700">
                    {order.customer?.full_name || "—"}
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <div className="space-y-0.5">
                      {order.items
                        .filter((item) => item.trader_name !== null)
                        .map((item) => (
                          <p key={item.id} className="text-xs text-gray-600">
                            {item.quantity}× {item.product_name}
                          </p>
                        ))}
                    </div>
                  </td>
                  <td className="px-5 py-3 font-semibold text-gray-800">
                    UGX {Number(order.total_price).toLocaleString()}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 hidden lg:table-cell text-xs text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TraderOrders;
