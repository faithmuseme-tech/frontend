import React, { useEffect, useRef, useState } from "react";
import { FiTag, FiPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiImage } from "react-icons/fi";
import adminService from "../../../services/adminService";

const API_BASE = process.env.REACT_APP_API_URL?.replace("/api/v1", "") || "http://127.0.0.1:8000";
const toAbsolute = (url) => (!url ? "" : url.startsWith("http") ? url : `${API_BASE}${url}`);

const emptyForm = { name: "", icon: "", description: "", image: null, is_active: true };

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [form, setForm]             = useState(emptyForm);
  const [preview, setPreview]       = useState(null);
  const [editId, setEditId]         = useState(null);
  const [showForm, setShowForm]     = useState(false);
  const [saving, setSaving]         = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError]           = useState("");
  const fileRef = useRef();

  const load = () => {
    setLoading(true);
    adminService.getCategories()
      .then((r) => setCategories(r.data?.results || r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setForm(emptyForm); setPreview(null); setEditId(null); setError(""); setShowForm(true);
  };

  const openEdit = (cat) => {
    setForm({ name: cat.name, icon: cat.icon || "", description: cat.description || "", image: null, is_active: cat.is_active ?? true });
    setPreview(cat.image ? toAbsolute(cat.image) : null);
    setEditId(cat.id); setError(""); setShowForm(true);
  };

  const cancel = () => { setShowForm(false); setEditId(null); setPreview(null); setError(""); };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((f) => ({ ...f, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError("Name is required."); return; }
    setSaving(true); setError("");
    try {
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("icon", form.icon.trim());
      fd.append("description", form.description.trim());
      fd.append("is_active", form.is_active ? "true" : "false");
      if (form.image) fd.append("image", form.image);
      if (editId) {
        await adminService.updateCategory(editId, fd);
      } else {
        await adminService.createCategory(fd);
      }
      cancel();
      load();
    } catch (err) {
      const d = err?.response?.data;
      setError(d?.name?.[0] || d?.slug?.[0] || d?.image?.[0] || "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category? Products in it will be uncategorised.")) return;
    setDeletingId(id);
    try {
      await adminService.deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch {}
    finally { setDeletingId(null); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">Manage product categories.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
        >
          <FiPlus /> Add Category
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-indigo-100 p-6 space-y-4">
          <p className="text-sm font-bold text-gray-800">{editId ? "Edit Category" : "New Category"}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Name *</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Arduino Components"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            {/* Icon */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Icon (emoji)</label>
              <input
                value={form.icon}
                onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                placeholder="e.g. 🔌"
                maxLength={4}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Description <span className="font-normal text-gray-400">(optional)</span></label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Brief description of this category…"
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
          </div>

          {/* Active toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none w-fit">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
              className="w-4 h-4 accent-indigo-600"
            />
            <span className="text-sm font-medium text-gray-700">Active (visible to customers)</span>
          </label>

          {/* Image */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Category Image <span className="font-normal text-gray-400">(optional)</span></label>
            <div className="flex items-center gap-4">
              {preview ? (
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
                  <img src={preview} alt="preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => { setPreview(null); setForm((f) => ({ ...f, image: null })); if (fileRef.current) fileRef.current.value = ""; }}
                    className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                  >
                    <FiX />
                  </button>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 flex-shrink-0">
                  <FiImage className="text-2xl" />
                </div>
              )}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 border border-indigo-200 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-colors"
              >
                {preview ? "Change Image" : "Upload Image"}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3">
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">
              <FiCheck /> {saving ? "Saving…" : editId ? "Save Changes" : "Create"}
            </button>
            <button type="button" onClick={cancel}
              className="flex items-center gap-2 border border-gray-200 text-gray-600 font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">
              <FiX /> Cancel
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <FiTag className="text-4xl mx-auto mb-2 opacity-30" />
            <p className="font-medium">No categories yet</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Category</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Description</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Products</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-lg flex-shrink-0 overflow-hidden">
                        {cat.image ? (
                          <img src={toAbsolute(cat.image)} alt={cat.name} className="w-full h-full object-cover" />
                        ) : (
                          <span>{cat.icon || <FiTag className="text-indigo-400 text-base" />}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{cat.name}</p>
                        <p className="text-xs text-gray-400">{cat.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell text-gray-500 text-xs max-w-xs truncate">
                    {cat.description || "—"}
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 font-semibold text-xs px-2.5 py-1 rounded-full">
                      {cat.product_count ?? 0} products
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cat.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {cat.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(cat)}
                        className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                        <FiEdit2 />
                      </button>
                      <button onClick={() => handleDelete(cat.id)} disabled={deletingId === cat.id}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40">
                        <FiTrash2 />
                      </button>
                    </div>
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

export default AdminCategories;
