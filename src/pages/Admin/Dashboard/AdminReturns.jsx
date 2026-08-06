import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import adminService from "../../../services/adminService";
import { FiX, FiRefreshCw, FiInbox } from "react-icons/fi";

const STATUS_PILL = {
  pending:   "bg-yellow-100 text-yellow-700",
  approved:  "bg-blue-100 text-blue-700",
  rejected:  "bg-red-100 text-red-600",
  completed: "bg-green-100 text-green-700",
};

const REASON_LABELS = {
  defective:        "Defective / Faulty",
  wrong_item:       "Wrong Item",
  not_as_described: "Not as Described",
  damaged_delivery: "Damaged in Delivery",
  other:            "Other",
};

const fmtDate = (d) => new Date(d).toLocaleString("en-UG", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

/* ── Detail Modal ── */
const ReturnModal = ({ item, onClose, onUpdate }) => {
  const [status, setStatus]   = useState(item.status);
  const [notes, setNotes]     = useState(item.admin_notes || "");
  const [saving, setSaving]   = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await adminService.updateReturn(item.id, { status, admin_notes: notes });
      onUpdate(res.data);
      onClose();
    } catch {
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Return Request #{item.id}</p>
            <p className="text-lg font-extrabold text-gray-900">Order #{item.order_number}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"><FiX /></button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          {/* Customer */}
          <div className="bg-gray-50 rounded-2xl p-4 space-y-0.5">
            <p className="text-sm font-bold text-gray-900">{item.user_name}</p>
            <p className="text-xs text-gray-500">{item.user_phone}</p>
            <p className="text-xs text-gray-400">{fmtDate(item.created_at)}</p>
          </div>

          {/* Reason & items */}
          <div className="space-y-2">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Reason</p>
              <p className="text-sm font-semibold text-gray-800">{REASON_LABELS[item.reason] || item.reason}</p>
            </div>
            {item.item_names?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Items</p>
                <ul className="text-sm text-gray-700 space-y-0.5 list-disc list-inside">
                  {item.item_names.map((n, i) => <li key={i}>{n}</li>)}
                </ul>
              </div>
            )}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Description</p>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3 whitespace-pre-wrap">{item.description}</p>
            </div>
          </div>

          {/* Status */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Update Status</p>
            <div className="flex flex-wrap gap-2">
              {["pending", "approved", "rejected", "completed"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
                    status === s ? `${STATUS_PILL[s]} ring-2 ring-offset-1 ring-current` : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {s.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Admin notes */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Admin Notes</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Add internal notes or reason for decision…"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold disabled:opacity-60 transition-colors">
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Main Page ── */
const AdminReturns = () => {
  const [searchParams] = useSearchParams();
  const [returns, setReturns]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "");
  const [selected, setSelected]     = useState(null);

  const load = (sf = statusFilter) => {
    setLoading(true);
    adminService.getReturns(sf)
      .then((r) => setReturns(r.data?.results || r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [statusFilter]);

  const handleUpdate = (updated) => {
    setReturns((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Return Requests</h1>
        <p className="text-sm text-gray-500 mt-1">Review and manage customer return requests.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[["", "All"], ["pending", "Pending"], ["approved", "Approved"], ["rejected", "Rejected"], ["completed", "Completed"]].map(([val, label]) => (
          <button key={val} onClick={() => setStatusFilter(val)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              statusFilter === val ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-indigo-300"
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : returns.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <FiInbox className="text-4xl mx-auto mb-2 opacity-20" />
            <p className="font-medium">No return requests found.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Order</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Reason</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Date</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {returns.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelected(r)}>
                  <td className="px-5 py-4">
                    <p className="font-bold text-gray-900">{r.user_name}</p>
                    <p className="text-xs text-gray-400">{r.user_phone}</p>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell font-semibold text-gray-700">#{r.order_number}</td>
                  <td className="px-5 py-4 hidden md:table-cell text-gray-600">{REASON_LABELS[r.reason] || r.reason}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_PILL[r.status] || "bg-gray-100 text-gray-600"}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell text-xs text-gray-400">
                    {new Date(r.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelected(r); }}
                      className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      <FiRefreshCw /> Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <ReturnModal
          item={selected}
          onClose={() => setSelected(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default AdminReturns;
