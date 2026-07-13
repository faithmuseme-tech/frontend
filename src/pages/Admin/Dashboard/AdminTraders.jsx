import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import adminService from "../../../services/adminService";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

const STATUS_TABS = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const AdminTraders = () => {
  const [traders, setTraders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get("status") || "";

  const loadTraders = async () => {
    setLoading(true);
    try {
      const res = await adminService.getTraders(status);
      setTraders(res.data?.results || res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTraders();
  }, [status]);

  const updateTrader = async (id, action) => {
    try {
      const res = await adminService.traderAction(id, action);
      setTraders((prev) => prev.map((trader) => trader.id === id ? res.data : trader));
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Traders</h1>
          <p className="text-sm text-gray-500 mt-1">Review and manage trader registration requests.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSearchParams(tab.value ? { status: tab.value } : {})}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${status === tab.value ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-indigo-300"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : traders.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500">No trader profiles found.</p>
            <Link to="/admin/dashboard" className="mt-4 inline-block text-primary-600 font-semibold hover:underline">Return to overview</Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Business</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Contact</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Submitted</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {traders.map((trader) => (
                <tr key={trader.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-800">{trader.business_name}</p>
                    <p className="text-xs text-gray-400">{trader.business_address}</p>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <p className="text-sm text-gray-700">{trader.business_email}</p>
                    <p className="text-xs text-gray-400">{trader.business_phone}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${trader.status === "approved" ? "bg-emerald-100 text-emerald-700" : trader.status === "rejected" ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-800"}`}>
                      {trader.status?.replace(/^(.)/, (match) => match.toUpperCase())}
                    </span>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell text-gray-500 text-xs">{new Date(trader.created_at).toLocaleDateString()}</td>
                  <td className="px-5 py-4 text-right">
                    {trader.status === "pending" ? (
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => updateTrader(trader.id, "approve")} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors">
                          <FiCheckCircle /> Approve
                        </button>
                        <button onClick={() => updateTrader(trader.id, "reject")} className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-3 py-2 text-white text-xs font-semibold hover:bg-red-700 transition-colors">
                          <FiXCircle /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">No action</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminTraders;
