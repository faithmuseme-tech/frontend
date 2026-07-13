import React, { useEffect, useState } from "react";
import adminService from "../../../services/adminService";
import { FiUsers, FiToggleLeft, FiToggleRight } from "react-icons/fi";

const TABS = [
  { label: "All", value: "" },
  { label: "Customers", value: "customer" },
  { label: "Traders", value: "trader" },
];

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("");

  const load = (role) => {
    setLoading(true);
    adminService.getUsers(role)
      .then((r) => setUsers(r.data?.results || r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(tab); }, [tab]);

  const toggleActive = async (user) => {
    await adminService.updateUser(user.id, { is_active: !user.is_active });
    setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, is_active: !u.is_active } : u));
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
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-semibold text-gray-800">{u.first_name} {u.last_name}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
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
                    <button onClick={() => toggleActive(u)} title={u.is_active ? "Deactivate" : "Activate"}
                      className={`text-xl transition-colors ${u.is_active ? "text-green-500 hover:text-red-400" : "text-gray-300 hover:text-green-500"}`}>
                      {u.is_active ? <FiToggleRight /> : <FiToggleLeft />}
                    </button>
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
