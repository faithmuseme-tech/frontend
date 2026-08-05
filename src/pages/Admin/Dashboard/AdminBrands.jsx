import React, { useEffect, useRef, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiImage, FiLayers } from "react-icons/fi";
import adminService from "../../../services/adminService";

const emptyForm = { name: "", description: "", logo: null, is_active: true };

const AdminBrands = () => {
  const [brands, setBrands]         = useState([]);
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
    adminService.getBrands()
      .then((r) => setBrands(r.data?.results || r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setForm(emptyForm); setPreview(null); setEditId(null); setError(""); setShowForm(true);
  };

  const openEdit = (b) => {
    setForm({ name: b.name, description: b.description || "", logo: null, is_active: b.is_active ?? true });
    setPreview(b.logo || null);
    setEditId(b.id); setError(""); setShowForm(true);
  };

  const cancel = () => { setShowForm(false); setEditId(null); setPreview(null); setError(""); };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((f) => ({ ...f, logo: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError("Name is required."); return; }
    setSaving(true); setError("");
    try {
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("description", form.description.trim());
      fd.append("is_active", form.is_active ? "true" : "false");
      if (form.logo) fd.append("logo_upload", form.logo);
      if (editId) {
        await adminService.updateBrand(editId, fd);
      } else {
        await adminService.createBrand(fd);
      }
      cancel();
      load();
    } catch (err) {
      const d = err?.response?.data;
      setError(d?.name?.[0] || d?.slug?.[0] || d?.logo?.[0] || "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this brand? Products linked to it will have no brand.")) return;
    setDeletingId(id);
    try {
      await adminService.deleteBrand(id);
      setBrands((prev) => prev.filter((b) => b.id !== id));
    } catch {}
    finally { setDeletingId(null); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Brands</h1>
          <p className="text-sm text-gray-500 mt-1">Manage product brands available to traders.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
        >
          <FiPlus /> Add Brand
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-indigo-100 p-6 space-y-4">
          <p className="text-sm font-bold text-gray-800">{editId ? "Edit Brand" : "New Brand"}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Name *</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Arduino"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Description <span className="font-normal text-gray-400">(optional)</span></label>
              <input
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Brief description…"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none w-fit">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
              className="w-4 h-4 accent-indigo-600"
            />
            <span className="text-sm font-medium text-gray-700">Active (visible to traders)</span>
          </label>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Logo <span className="font-normal text-gray-400">(optional)</span></label>
            <div className="flex items-center gap-4">
              {preview ? (
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
                  <img src={preview} alt="preview" className="w-full h-full object-contain p-1" />
                  <button
                    type="button"
                    onClick={() => { setPreview(null); setForm((f) => ({ ...f, logo: null })); if (fileRef.current) fileRef.current.value = ""; }}
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
                {preview ? "Change Logo" : "Upload Logo"}
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
        ) : brands.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <FiLayers className="text-4xl mx-auto mb-2 opacity-30" />
            <p className="font-medium">No brands yet</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Brand</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Description</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Products</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {brands.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {b.logo
                          ? <img src={b.logo} alt={b.name} className="w-full h-full object-contain p-1" />
                          : <FiLayers className="text-gray-300 text-base" />}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{b.name}</p>
                        <p className="text-xs text-gray-400">{b.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell text-gray-500 text-xs max-w-xs truncate">
                    {b.description || "—"}
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 font-semibold text-xs px-2.5 py-1 rounded-full">
                      {b.product_count ?? 0} products
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${b.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {b.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(b)}
                        className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                        <FiEdit2 />
                      </button>
                      <button onClick={() => handleDelete(b.id)} disabled={deletingId === b.id}
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

export default AdminBrands;
