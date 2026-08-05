import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import adminService from "../../../services/adminService";
import {
  FiCheckCircle, FiXCircle, FiEye, FiTrash2,
  FiSlash, FiUserX, FiX, FiMail, FiPhone,
  FiMapPin, FiCalendar, FiUser,
} from "react-icons/fi";

const STATUS_TABS = [
  { label: "All",      value: "" },
  { label: "Pending",  value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const STATUS_PILL = {
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-600",
  pending:  "bg-yellow-100 text-yellow-800",
};

const Row = ({ label, icon, value }) =>
  value ? (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-gray-400 flex-shrink-0">{icon}</span>
      <div>
        <p className="text-[11px] text-gray-400 uppercase font-semibold tracking-wide">{label}</p>
        <p className="text-sm text-gray-800 font-medium">{value}</p>
      </div>
    </div>
  ) : null;

const TraderModal = ({ trader, onClose, onAction, acting }) => {
  const API_BASE = process.env.REACT_APP_API_URL?.replace("/api/v1", "") || "";
  const logo = trader.logo
    ? (trader.logo.startsWith("http") ? trader.logo : `${API_BASE}${trader.logo}`)
    : null;

  const actions = [
    trader.status !== "approved" && {
      key: "approve", label: "Approve", icon: <FiCheckCircle />,
      cls: "bg-emerald-600 hover:bg-emerald-700 text-white",
    },
    trader.status !== "rejected" && {
      key: "reject", label: "Reject", icon: <FiXCircle />,
      cls: "bg-orange-500 hover:bg-orange-600 text-white",
    },
    trader.user_is_active && {
      key: "deactivate", label: "Deactivate", icon: <FiSlash />,
      cls: "bg-gray-600 hover:bg-gray-700 text-white",
    },
    {
      key: "ban", label: "Ban", icon: <FiUserX />,
      cls: "bg-red-600 hover:bg-red-700 text-white",
    },
    {
      key: "delete", label: "Delete", icon: <FiTrash2 />,
      cls: "bg-red-800 hover:bg-red-900 text-white",
      confirm: `Permanently delete "${trader.business_name}" and all their data?`,
    },
  ].filter(Boolean);

  const handle = (action) => {
    if (action.confirm && !window.confirm(action.confirm)) return;
    onAction(trader.id, action.key);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {logo ? (
              <img src={logo} alt={trader.business_name} className="w-10 h-10 rounded-xl object-cover border border-gray-100" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-lg font-extrabold text-indigo-600">
                {trader.business_name?.[0]?.toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-lg font-extrabold text-gray-900 leading-tight">{trader.business_name}</h2>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${STATUS_PILL[trader.status] || "bg-gray-100 text-gray-600"}`}>
                {trader.status?.charAt(0).toUpperCase() + trader.status?.slice(1)}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
            <FiX />
          </button>
        </div>

        {/* Body — two columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">

          {/* Left — Account Owner */}
          <div className="px-6 py-5 space-y-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Account Owner</p>
            <Row label="Full Name" icon={<FiUser />}     value={trader.user_name} />
            <Row label="Email"     icon={<FiMail />}     value={trader.user_email} />
            <Row label="Phone"     icon={<FiPhone />}    value={trader.user_phone} />
            <Row label="Account"   icon={<FiUser />}     value={trader.user_is_active ? "Active" : "Inactive"} />
            <Row label="Submitted" icon={<FiCalendar />} value={new Date(trader.created_at).toLocaleDateString()} />
          </div>

          {/* Right — Business Info */}
          <div className="px-6 py-5 space-y-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Business Info</p>
            <Row label="Business Email" icon={<FiMail />}   value={trader.business_email} />
            <Row label="Business Phone" icon={<FiPhone />}  value={trader.business_phone} />
            <Row label="Address"        icon={<FiMapPin />} value={trader.business_address} />
            <Row label="City"           icon={<FiMapPin />} value={trader.business_city} />
            <Row label="Country"        icon={<FiMapPin />} value={trader.business_country} />
          </div>
        </div>

        {/* Description — full width */}
        {trader.description && (
          <div className="px-6 pb-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Business Description</p>
            <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-3">{trader.description}</p>
          </div>
        )}

        {/* Actions */}
        <div className="px-6 py-4 border-t border-gray-100 flex flex-wrap gap-2">
          {actions.map((action) => (
            <button
              key={action.key}
              onClick={() => handle(action)}
              disabled={acting}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors disabled:opacity-50 ${action.cls}`}
            >
              {action.icon} {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const AdminTraders = () => {
  const [traders, setTraders]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [selected, setSelected]       = useState(null);
  const [acting, setActing]           = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get("status") || "";

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminService.getTraders(status);
      setTraders(res.data?.results || res.data || []);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [status]);

  const handleAction = async (id, action) => {
    setActing(true);
    try {
      if (action === "delete") {
        await adminService.traderAction(id, "delete");
        setTraders((prev) => prev.filter((t) => t.id !== id));
        setSelected(null);
      } else {
        const res = await adminService.traderAction(id, action);
        setTraders((prev) => prev.map((t) => t.id === id ? res.data : t));
        setSelected(res.data);
      }
    } catch {
    } finally {
      setActing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Traders</h1>
          <p className="text-sm text-gray-500 mt-1">Review and manage trader accounts.</p>
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
          <div className="p-12 text-center text-gray-500">No trader profiles found.</div>
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
                    <p className="text-xs text-gray-400">{trader.business_city}, {trader.business_country}</p>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <p className="text-sm text-gray-700">{trader.business_email}</p>
                    <p className="text-xs text-gray-400">{trader.business_phone}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_PILL[trader.status] || "bg-gray-100 text-gray-600"}`}>
                      {trader.status?.charAt(0).toUpperCase() + trader.status?.slice(1)}
                    </span>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell text-gray-500 text-xs">
                    {new Date(trader.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => setSelected(trader)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-semibold hover:bg-indigo-100 transition-colors"
                    >
                      <FiEye /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <TraderModal
          trader={selected}
          onClose={() => setSelected(null)}
          onAction={handleAction}
          acting={acting}
        />
      )}
    </div>
  );
};

export default AdminTraders;
