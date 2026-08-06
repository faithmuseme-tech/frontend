import React, { useEffect, useState } from "react";
import { FiUserPlus, FiTrash2, FiShield, FiCopy, FiCheck, FiEdit2, FiX } from "react-icons/fi";
import adminService from "../../../services/adminService";
import { toAbsolute } from "../../../utils/imageUrl";

const PAGE_LABELS = {
  orders: "Orders", users: "Users", traders: "Traders", products: "Products",
  analytics: "Analytics", returns: "Returns", chat: "Chat", inquiries: "Inquiries",
  categories: "Categories", brands: "Brands", settings: "Settings", insights: "Insights",
};

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="ml-2 text-indigo-500 hover:text-indigo-700 transition-colors">
      {copied ? <FiCheck className="text-green-500" /> : <FiCopy />}
    </button>
  );
};

const AdminEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [allPages, setAllPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ phone: "", first_name: "", permissions: [] });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [newCred, setNewCred] = useState(null); // { phone, temp_password }
  const [editingId, setEditingId] = useState(null);
  const [editPerms, setEditPerms] = useState([]);

  const load = () => {
    setLoading(true);
    adminService.getEmployees()
      .then((r) => { setEmployees(r.data.employees); setAllPages(r.data.all_pages); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const togglePerm = (page, perms, setPerms) => {
    setPerms((prev) =>
      prev.includes(page) ? prev.filter((p) => p !== page) : [...prev, page]
    );
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.phone.trim()) { setError("Phone number is required."); return; }
    if (!form.permissions.length) { setError("Select at least one page permission."); return; }
    setSaving(true);
    try {
      const res = await adminService.addEmployee(form);
      setNewCred({ phone: res.data.phone, temp_password: res.data.temp_password });
      setForm({ phone: "", first_name: "", permissions: [] });
      setAdding(false);
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add employee.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this employee? They will lose admin access.")) return;
    await adminService.deleteEmployee(id).catch(() => {});
    load();
  };

  const startEdit = (emp) => {
    setEditingId(emp.id);
    setEditPerms([...emp.permissions]);
  };

  const saveEdit = async (id) => {
    await adminService.updateEmployee(id, { permissions: editPerms }).catch(() => {});
    setEditingId(null);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Employees</h1>
          <p className="text-sm text-gray-500 mt-0.5">Add staff with restricted page access. Each employee gets a generated password on first login.</p>
        </div>
        <button
          onClick={() => { setAdding(true); setError(""); setNewCred(null); }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <FiUserPlus /> Add Employee
        </button>
      </div>

      {/* Generated credentials banner */}
      {newCred && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 space-y-2">
          <p className="text-sm font-bold text-green-800 flex items-center gap-2"><FiShield /> Employee added — share these credentials securely</p>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span className="font-semibold">Phone:</span>
            <span className="font-mono">{newCred.phone}</span>
            <CopyButton text={newCred.phone} />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span className="font-semibold">Temp Password:</span>
            <span className="font-mono bg-white border border-green-200 px-2 py-0.5 rounded-lg tracking-widest">{newCred.temp_password}</span>
            <CopyButton text={newCred.temp_password} />
          </div>
          <p className="text-xs text-green-700">The employee will be prompted to set their own password on first login. This password will not be shown again.</p>
          <button onClick={() => setNewCred(null)} className="text-xs text-green-600 hover:underline">Dismiss</button>
        </div>
      )}

      {/* Add form */}
      {adding && (
        <form onSubmit={handleAdd} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-800">New Employee</h2>
            <button type="button" onClick={() => setAdding(false)} className="text-gray-400 hover:text-gray-600"><FiX /></button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Phone Number *</label>
              <input
                type="tel" required value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="e.g. 0700000000"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">First Name (optional)</label>
              <input
                type="text" value={form.first_name}
                onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
                placeholder="e.g. John"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">Page Access *</label>
            <div className="flex flex-wrap gap-2">
              {allPages.map((page) => (
                <button
                  key={page} type="button"
                  onClick={() => togglePerm(page, form.permissions, (fn) => setForm((f) => ({ ...f, permissions: fn(f.permissions) })))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    form.permissions.includes(page)
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"
                  }`}
                >
                  {PAGE_LABELS[page] || page}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3">
            <button type="submit" disabled={saving}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
              {saving ? "Adding..." : "Add Employee & Generate Password"}
            </button>
            <button type="button" onClick={() => setAdding(false)}
              className="px-5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Employee list */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : employees.length === 0 ? (
          <div className="p-12 text-center">
            <FiShield className="text-4xl text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No employees added yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {employees.map((emp) => (
              <div key={emp.id} className="p-5 flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Avatar + info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 overflow-hidden">
                    {emp.avatar
                      ? <img src={toAbsolute(emp.avatar)} alt="" className="w-full h-full object-cover" />
                      : <span className="text-sm font-bold text-indigo-600">{(emp.first_name?.[0] || emp.phone[0]).toUpperCase()}</span>}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-800">{emp.first_name || "—"}</p>
                    <p className="text-xs text-gray-500 font-mono">{emp.phone}</p>
                    <div className={`inline-flex items-center gap-1 mt-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${emp.must_change_password ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
                      {emp.must_change_password ? "Awaiting first login" : "Active"}
                    </div>
                  </div>
                </div>

                {/* Permissions */}
                <div className="flex-1">
                  {editingId === emp.id ? (
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1.5">
                        {allPages.map((page) => (
                          <button key={page} type="button"
                            onClick={() => setEditPerms((prev) => prev.includes(page) ? prev.filter((p) => p !== page) : [...prev, page])}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                              editPerms.includes(page)
                                ? "bg-indigo-600 text-white border-indigo-600"
                                : "bg-white text-gray-500 border-gray-200 hover:border-indigo-300"
                            }`}
                          >
                            {PAGE_LABELS[page] || page}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => saveEdit(emp.id)} className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">Save</button>
                        <button onClick={() => setEditingId(null)} className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {emp.permissions.map((p) => (
                        <span key={p} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg">
                          {PAGE_LABELS[p] || p}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => startEdit(emp)} title="Edit permissions"
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                    <FiEdit2 />
                  </button>
                  <button onClick={() => handleDelete(emp.id)} title="Remove employee"
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEmployees;
