import React, { useEffect, useState } from "react";
import adminService from "../../../services/adminService";
import { FiMail, FiPhone, FiX, FiTrash2, FiMessageSquare, FiInbox } from "react-icons/fi";

const STATUS_PILL = {
  new:         "bg-blue-100 text-blue-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  resolved:    "bg-green-100 text-green-700",
};

const fmtDate = (d) => new Date(d).toLocaleString("en-UG", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

/* ── Detail Modal ── */
const InquiryModal = ({ inquiry, onClose, onUpdate, onDelete }) => {
  const [notes, setNotes]   = useState(inquiry.admin_notes || "");
  const [status, setStatus] = useState(inquiry.status);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await adminService.updateInquiry(inquiry.id, { status, admin_notes: notes });
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

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{inquiry.inquiry_type}</p>
            <p className="text-lg font-extrabold text-gray-900">{inquiry.subject}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"><FiX /></button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          {/* Sender info */}
          <div className="bg-gray-50 rounded-2xl p-4 space-y-1">
            <p className="text-sm font-bold text-gray-900">{inquiry.name}</p>
            {inquiry.email && (
              <a href={`mailto:${inquiry.email}`} className="flex items-center gap-1.5 text-xs text-indigo-600 hover:underline">
                <FiMail /> {inquiry.email}
              </a>
            )}
            <a href={`tel:${inquiry.phone}`} className="flex items-center gap-1.5 text-xs text-gray-600">
              <FiPhone /> {inquiry.phone}
            </a>
            <p className="text-xs text-gray-400 pt-1">{fmtDate(inquiry.created_at)}</p>
          </div>

          {/* Message */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Message</p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-xl p-3">{inquiry.message}</p>
          </div>

          {/* Status */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Status</p>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
            >
              <option value="new">New</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          {/* Admin notes */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Admin Notes</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Add internal notes…"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3">
          <button
            onClick={() => onDelete(inquiry.id)}
            className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-700 transition-colors mr-auto"
          >
            <FiTrash2 /> Delete
          </button>
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold disabled:opacity-60 transition-colors"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Main Page ── */
const AdminInquiries = () => {
  const [inquiries, setInquiries]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected]     = useState(null);

  const load = (sf = statusFilter) => {
    setLoading(true);
    adminService.getInquiries(sf)
      .then((r) => setInquiries(r.data?.results || r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [statusFilter]);

  const handleUpdate = (updated) => {
    setInquiries((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this inquiry?")) return;
    await adminService.deleteInquiry(id);
    setInquiries((prev) => prev.filter((i) => i.id !== id));
    setSelected(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Contact Inquiries</h1>
        <p className="text-sm text-gray-500 mt-1">Manage messages submitted via the Contact Us page.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[["", "All"], ["new", "New"], ["in_progress", "In Progress"], ["resolved", "Resolved"]].map(([val, label]) => (
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
        ) : inquiries.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <FiInbox className="text-4xl mx-auto mb-2 opacity-20" />
            <p className="font-medium">No inquiries found.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Type</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Subject</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Date</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {inquiries.map((inq) => (
                <tr key={inq.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelected(inq)}>
                  <td className="px-5 py-4">
                    <p className="font-bold text-gray-900">{inq.name}</p>
                    <p className="text-xs text-gray-400">{inq.phone}</p>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell text-gray-600">{inq.inquiry_type}</td>
                  <td className="px-5 py-4 hidden md:table-cell text-gray-700 max-w-xs truncate">{inq.subject}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_PILL[inq.status] || "bg-gray-100 text-gray-600"}`}>
                      {inq.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell text-xs text-gray-400">
                    {new Date(inq.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelected(inq); }}
                      className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      <FiMessageSquare /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <InquiryModal
          inquiry={selected}
          onClose={() => setSelected(null)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default AdminInquiries;
