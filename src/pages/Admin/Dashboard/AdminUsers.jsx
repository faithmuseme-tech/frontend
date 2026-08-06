import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import adminService from "../../../services/adminService";
import { FiUsers, FiToggleLeft, FiToggleRight, FiKey, FiCheck, FiX, FiUser } from "react-icons/fi";
import { toAbsolute } from "../../../utils/imageUrl";

const TABS = [
  { label: "All", value: "" },
  { label: "Customers", value: "customer" },
  { label: "Traders", value: "trader" },
];

const AdminUsers = () => {
  const [searchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const roleParam = searchParams.get("role") || "";
  const [tab, setTab] = useState(roleParam);

  const load = (role) => {
    setLoading(true);
    adminService.getUsers(role)
      .then((r) => setUsers(r.data?.results || r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(tab); }, [tab]);

  const [resetting, setResetting] = useState(null);
  const [newPw, setNewPw] = useState("");
  const [pwMsg, setPwMsg] = useState(null);

  const startReset = (id) => { setResetting(id); setNewPw(""); setPwMsg(null); };
  const cancelReset = () => { setResetting(null); setNewPw(""); setPwMsg(null); };

  const submitReset = async (id) => {
    if (newPw.length < 6) { setPwMsg({ ok: false, text: "Min 6 characters" }); return; }
    try {
      await adminService.resetPassword(id, newPw);
      setPwMsg({ ok: true, text: "Password reset!" });
      setTimeout(cancelReset, 1500);
    } catch {
      setPwMsg({ ok: false, text: "Failed. Try again." });
    }
  };

  const toggleActive = async (u) => {
    await adminService.updateUser(u.id, { is_active: !u.is_active });
    setUsers((prev) => prev.map((x) => x.id === u.id ? { ...x, is_active: !x.is_active } : x));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-gray-900">Users</h1>
        <span className="text-sm text-gray-500">{users.length} total</span>
      </div>

      <div className="flex gap-2">
        {TABS.map((t) => (
          <button key={t.value} onClick={() => setTab(t.value)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all
              ${tab === t.value ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-indigo-300"}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <FiUsers className="text-4xl text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No users found.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Role</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Joined</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center shrink-0">
                        {u.avatar
                          ? <img src={toAbsolute(u.avatar)} alt={u.first_name} className="w-full h-full object-cover" />
                          : u.first_name
                            ? <span className="text-xs font-bold text-indigo-500">{u.first_name[0]}{u.last_name?.[0] || ""}</span>
                            : <FiUser className="text-indigo-400" />}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{u.first_name} {u.last_name}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                      ${u.is_staff || u.is_admin ? "bg-red-100 text-red-600" : u.is_trader ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-600"}`}>
                      {u.is_staff || u.is_admin ? "Admin" : u.is_trader ? "Trader" : "Customer"}
                    </span>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell text-gray-500 text-xs">
                    {new Date(u.date_joined).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${u.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {u.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleActive(u)} title={u.is_active ? "Deactivate" : "Activate"}
                        className={`text-xl transition-colors ${u.is_active ? "text-green-500 hover:text-red-400" : "text-gray-300 hover:text-green-500"}`}>
                        {u.is_active ? <FiToggleRight /> : <FiToggleLeft />}
                      </button>
                      <button onClick={() => startReset(u.id)} title="Reset password"
                        className="text-gray-400 hover:text-indigo-500 transition-colors text-base">
                        <FiKey />
                      </button>
                    </div>
                    {resetting === u.id && (
                      <div className="mt-2 flex flex-col gap-1.5">
                        <input
                          type="text"
                          value={newPw}
                          onChange={(e) => setNewPw(e.target.value)}
                          placeholder="New password"
                          className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs w-36 focus:outline-none focus:border-indigo-400"
                        />
                        <div className="flex gap-1">
                          <button onClick={() => submitReset(u.id)}
                            className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-2 py-1 rounded-lg transition-colors">
                            <FiCheck size={11} /> Set
                          </button>
                          <button onClick={cancelReset}
                            className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold px-2 py-1 rounded-lg transition-colors">
                            <FiX size={11} /> Cancel
                          </button>
                        </div>
                        {pwMsg && (
                          <p className={`text-xs font-semibold ${pwMsg.ok ? "text-green-600" : "text-red-500"}`}>{pwMsg.text}</p>
                        )}
                      </div>
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

export default AdminUsers;
