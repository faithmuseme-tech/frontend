import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import traderService from "../../../services/traderService";
import api from "../../../services/api";
import { FiUpload, FiX, FiCheck, FiAlertCircle } from "react-icons/fi";

const Field = ({ label, error, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</label>
    {children}
    {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
  </div>
);

const inputCls = (err) =>
  `w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all
  ${err ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-primary-400 focus:ring-primary-100"}`;

const TraderProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [form, setForm] = useState({
    name: "", description: "", price: "", original_price: "",
    stock: "", sku: "", badge: "",
    category_id: "", brand_id: "",
    is_active: true, is_featured: false, is_new_arrival: false, is_best_seller: false,
  });
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    api.get("/categories/").then((r) => setCategories(r.data?.results || r.data || [])).catch(() => {});
    api.get("/brands/").then((r) => setBrands(r.data?.results || r.data || [])).catch(() => {});
    if (isEdit) {
      traderService.getProducts().then((r) => {
        const products = r.data?.results || r.data || [];
        const p = products.find((x) => String(x.id) === String(id));
        if (p) {
          setForm({
            name: p.name || "", description: p.description || "",
            price: p.price || "", original_price: p.original_price || "",
            stock: p.stock ?? "", sku: p.sku || "", badge: p.badge || "",
            category_id: p.category?.id || p.category_id || "",
            brand_id: p.brand?.id || p.brand_id || "",
            is_active: p.is_active ?? true,
            is_featured: p.is_featured ?? false,
            is_new_arrival: p.is_new_arrival ?? false,
            is_best_seller: p.is_best_seller ?? false,
          });
          setExistingImages(p.images || []);
        }
      }).catch(() => {});
    }
  }, [id, isEdit]);

  const set = (k) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: val }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.price) e.price = "Required";
    if (!form.stock && form.stock !== 0) e.stock = "Required";
    if (!form.category_id) e.category_id = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));

      let product;
      if (isEdit) {
        const res = await traderService.updateProduct(id, fd);
        product = res.data;
      } else {
        const res = await traderService.createProduct(fd);
        product = res.data;
      }

      // Upload new images
      for (const file of images) {
        await traderService.uploadImage(product.id, file);
      }

      navigate("/trader/dashboard/products");
    } catch (err) {
      const data = err?.response?.data;
      if (data && typeof data === "object") {
        setErrors(Object.fromEntries(
          Object.entries(data).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])
        ));
      }
      setSubmitError("Failed to save product. Check the fields above.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleImagePick = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const removeNewImage = (i) => setImages((prev) => prev.filter((_, idx) => idx !== i));

  const removeExistingImage = async (imgId) => {
    try {
      await traderService.deleteImage(id, imgId);
      setExistingImages((prev) => prev.filter((img) => img.id !== imgId));
    } catch {
      setSubmitError("Failed to delete image.");
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-extrabold text-gray-900">{isEdit ? "Edit Product" : "Add New Product"}</h1>

      {submitError && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
          <FiAlertCircle className="flex-shrink-0" /> {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">

        <Field label="Product Name" error={errors.name}>
          <input value={form.name} onChange={set("name")} placeholder="e.g. Samsung Galaxy S24" className={inputCls(errors.name)} />
        </Field>

        <Field label="Description">
          <textarea value={form.description} onChange={set("description")} rows={4} placeholder="Describe your product..." className={inputCls(false) + " resize-none"} />
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Price (UGX)" error={errors.price}>
            <input type="number" value={form.price} onChange={set("price")} placeholder="0" className={inputCls(errors.price)} />
          </Field>
          <Field label="Original Price (UGX)">
            <input type="number" value={form.original_price} onChange={set("original_price")} placeholder="0 (optional)" className={inputCls(false)} />
          </Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Stock Quantity" error={errors.stock}>
            <input type="number" value={form.stock} onChange={set("stock")} placeholder="0" className={inputCls(errors.stock)} />
          </Field>
          <Field label="SKU (optional)">
            <input value={form.sku} onChange={set("sku")} placeholder="e.g. SGS24-BLK" className={inputCls(false)} />
          </Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Category" error={errors.category_id}>
            <select value={form.category_id} onChange={set("category_id")} className={inputCls(errors.category_id)}>
              <option value="">Select category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Brand (optional)">
            <select value={form.brand_id} onChange={set("brand_id")} className={inputCls(false)}>
              <option value="">Select brand</option>
              {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </Field>
        </div>

        <Field label="Badge (optional)">
          <input value={form.badge} onChange={set("badge")} placeholder="e.g. New, Hot Deal" className={inputCls(false)} />
        </Field>

        {/* Flags */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { key: "is_active", label: "Active" },
            { key: "is_featured", label: "Featured" },
            { key: "is_new_arrival", label: "New Arrival" },
            { key: "is_best_seller", label: "Best Seller" },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={form[key]} onChange={set(key)} className="w-4 h-4 accent-primary-600" />
              <span className="text-sm text-gray-700 font-medium">{label}</span>
            </label>
          ))}
        </div>

        {/* Images */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Product Images</p>

          {/* Existing images */}
          {existingImages.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {existingImages.map((img) => (
                <div key={img.id} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200">
                  <img src={img.image} alt="" className="w-full h-full object-cover" />
                  {isEdit && (
                    <button type="button" onClick={() => removeExistingImage(img.id)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
                      <FiX />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* New image previews */}
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {images.map((file, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-primary-200">
                  <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeNewImage(i)}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
                    <FiX />
                  </button>
                </div>
              ))}
            </div>
          )}

          <label className="flex items-center gap-2 cursor-pointer w-fit border-2 border-dashed border-gray-300 hover:border-primary-400 rounded-xl px-4 py-3 text-sm text-gray-500 hover:text-primary-600 transition-colors">
            <FiUpload /> Upload Images
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleImagePick} />
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
          <button type="button" onClick={() => navigate("/trader/dashboard/products")}
            className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:border-gray-300 transition-all">
            Cancel
          </button>
          <button type="submit" disabled={submitting}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 py-2.5 rounded-xl text-sm transition-all disabled:opacity-60">
            {submitting ? "Saving..." : <><FiCheck /> {isEdit ? "Save Changes" : "Publish Product"}</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TraderProductForm;
