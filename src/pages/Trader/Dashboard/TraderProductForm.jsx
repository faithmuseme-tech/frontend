import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import traderService from "../../../services/traderService";
import api from "../../../services/api";
import { FiUpload, FiX, FiCheck, FiAlertCircle, FiPlus, FiTrash2, FiChevronDown, FiLoader } from "react-icons/fi";
import { toAbsolute } from "../../../utils/imageUrl";

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

// ── Category type detector ─────────────────────────────────────────────────────
const getCategoryType = (categoryName) => {
  if (!categoryName) return null;
  const n = categoryName.toLowerCase();
  if (/shoe|boot|sandal|sneaker|heel|loafer|slipper|footwear|trainer/.test(n)) return 'shoes';
  if (/cloth|fashion|wear|shirt|dress|trouser|jean|apparel|outfit|jacket|coat|suit|skirt|blouse|underwear|sock/.test(n)) return 'clothing';
  if (/phone|mobile|smartphone|iphone|android|tablet/.test(n)) return 'phone';
  if (/laptop|computer|pc|notebook|macbook/.test(n)) return 'computer';
  if (/tv|television|monitor|display|screen/.test(n)) return 'tv';
  if (/camera|photo|lens/.test(n)) return 'camera';
  return null;
};

// ── Category-specific fields config ───────────────────────────────────────────
const CATEGORY_FIELDS = {
  shoes: [
    { key: 'sizes', label: 'Available Sizes (EU)', type: 'multicheck', options: ['35','36','37','38','39','40','41','42','43','44','45','46','47','48'] },
    { key: 'uk_sizes', label: 'Available Sizes (UK)', type: 'multicheck', options: ['3','4','5','6','7','8','9','10','11','12','13'] },
    { key: 'colors', label: 'Available Colors', type: 'tags', placeholder: 'e.g. Black, White, Brown (comma separated)' },
    { key: 'gender', label: 'Gender', type: 'select', options: ['Unisex', 'Men', 'Women', 'Boys', 'Girls', 'Kids'] },
    { key: 'shoe_type', label: 'Shoe Type', type: 'select', options: ['Sneakers', 'Boots', 'Sandals', 'Loafers', 'Heels', 'Slippers', 'Formal Shoes', 'Sports Shoes', 'Flip Flops', 'Wedges', 'Moccasins', 'Other'] },
    { key: 'material', label: 'Upper Material', type: 'select', options: ['Leather', 'Synthetic Leather', 'Canvas', 'Mesh', 'Suede', 'Rubber', 'Textile', 'Other'] },
    { key: 'sole_material', label: 'Sole Material', type: 'select', options: ['Rubber', 'EVA', 'TPR', 'PU', 'Leather', 'Other'] },
    { key: 'closure', label: 'Closure Type', type: 'select', options: ['Lace-up', 'Slip-on', 'Velcro', 'Buckle', 'Zipper', 'Hook & Loop', 'Other'] },
    { key: 'heel_height', label: 'Heel Height', type: 'select', options: ['Flat (0–1cm)', 'Low (1–3cm)', 'Mid (3–6cm)', 'High (6–9cm)', 'Very High (9cm+)'] },
    { key: 'occasion', label: 'Occasion', type: 'tags', placeholder: 'e.g. Casual, Formal, Sports, Office' },
    { key: 'condition', label: 'Condition', type: 'select', options: ['Brand New', 'Used - Like New', 'Used - Good'] },
  ],
  clothing: [
    { key: 'sizes', label: 'Available Sizes', type: 'multicheck', options: ['XS','S','M','L','XL','XXL','XXXL','4XL','Free Size','28','30','32','34','36','38','40','42','44'] },
    { key: 'colors', label: 'Available Colors', type: 'tags', placeholder: 'e.g. Red, Blue, Black (comma separated)' },
    { key: 'material', label: 'Material', type: 'text', placeholder: 'e.g. 100% Cotton, Polyester blend' },
    { key: 'gender', label: 'Gender', type: 'select', options: ['Unisex', 'Men', 'Women', 'Boys', 'Girls', 'Kids'] },
    { key: 'style', label: 'Style', type: 'text', placeholder: 'e.g. Casual, Formal, Sportswear' },
    { key: 'care', label: 'Care Instructions', type: 'text', placeholder: 'e.g. Machine wash cold' },
  ],
  phone: [
    { key: 'storage_options', label: 'Storage Options', type: 'multicheck', options: ['16GB','32GB','64GB','128GB','256GB','512GB','1TB'] },
    { key: 'ram', label: 'RAM', type: 'multicheck', options: ['2GB','3GB','4GB','6GB','8GB','12GB','16GB'] },
    { key: 'colors', label: 'Available Colors', type: 'tags', placeholder: 'e.g. Black, White, Blue' },
    { key: 'network', label: 'Network', type: 'multicheck', options: ['2G','3G','4G LTE','5G'] },
    { key: 'os', label: 'Operating System', type: 'select', options: ['Android', 'iOS', 'HarmonyOS', 'Other'] },
    { key: 'battery', label: 'Battery Capacity', type: 'text', placeholder: 'e.g. 5000mAh' },
    { key: 'screen_size', label: 'Screen Size', type: 'text', placeholder: 'e.g. 6.7 inches' },
    { key: 'condition', label: 'Condition', type: 'select', options: ['Brand New', 'Refurbished', 'Used - Like New', 'Used - Good'] },
  ],
  computer: [
    { key: 'processor', label: 'Processor', type: 'text', placeholder: 'e.g. Intel Core i7-12th Gen' },
    { key: 'ram', label: 'RAM', type: 'multicheck', options: ['4GB','8GB','16GB','32GB','64GB'] },
    { key: 'storage', label: 'Storage', type: 'text', placeholder: 'e.g. 512GB SSD + 1TB HDD' },
    { key: 'display', label: 'Display', type: 'text', placeholder: 'e.g. 15.6" FHD IPS' },
    { key: 'gpu', label: 'Graphics Card', type: 'text', placeholder: 'e.g. NVIDIA RTX 3060' },
    { key: 'os', label: 'Operating System', type: 'select', options: ['Windows 11', 'Windows 10', 'macOS', 'Linux', 'No OS'] },
    { key: 'condition', label: 'Condition', type: 'select', options: ['Brand New', 'Refurbished', 'Used - Like New', 'Used - Good'] },
  ],
  tv: [
    { key: 'screen_size', label: 'Screen Size', type: 'text', placeholder: 'e.g. 55 inches' },
    { key: 'resolution', label: 'Resolution', type: 'select', options: ['HD (720p)', 'Full HD (1080p)', '4K UHD', '8K'] },
    { key: 'smart_tv', label: 'Smart TV', type: 'select', options: ['Yes', 'No'] },
    { key: 'hdmi_ports', label: 'HDMI Ports', type: 'text', placeholder: 'e.g. 3' },
  ],
  camera: [
    { key: 'megapixels', label: 'Megapixels', type: 'text', placeholder: 'e.g. 24.2 MP' },
    { key: 'sensor', label: 'Sensor Type', type: 'select', options: ['Full Frame', 'APS-C', 'Micro Four Thirds', 'Medium Format'] },
    { key: 'video', label: 'Video Resolution', type: 'text', placeholder: 'e.g. 4K 30fps' },
    { key: 'condition', label: 'Condition', type: 'select', options: ['Brand New', 'Refurbished', 'Used - Like New', 'Used - Good'] },
  ],
};

// ── Category-specific fields component ────────────────────────────────────────
const CategoryFields = ({ categoryType, catSpecs, onChange }) => {
  if (!categoryType || !CATEGORY_FIELDS[categoryType]) return null;
  const fields = CATEGORY_FIELDS[categoryType];

  const update = (key, value) => onChange({ ...catSpecs, [key]: value });

  const toggleMulti = (key, option) => {
    const current = catSpecs[key] ? catSpecs[key].split(',').map(s => s.trim()).filter(Boolean) : [];
    const next = current.includes(option) ? current.filter(o => o !== option) : [...current, option];
    update(key, next.join(', '));
  };

  const isChecked = (key, option) => {
    const current = catSpecs[key] ? catSpecs[key].split(',').map(s => s.trim()) : [];
    return current.includes(option);
  };

  const typeLabel = { shoes: '👟 Shoes', clothing: '👕 Clothing', phone: '📱 Phone', computer: '💻 Computer', tv: '📺 TV / Display', camera: '📷 Camera' };

  return (
    <div className="border border-primary-100 bg-primary-50/40 rounded-2xl p-5 space-y-4">
      <p className="text-xs font-bold text-primary-700 uppercase tracking-wide">{typeLabel[categoryType]} Details</p>
      {fields.map((field) => (
        <div key={field.key}>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">{field.label}</label>
          {field.type === 'text' && (
            <input
              value={catSpecs[field.key] || ''}
              onChange={(e) => update(field.key, e.target.value)}
              placeholder={field.placeholder}
              className={inputCls(false)}
            />
          )}
          {field.type === 'tags' && (
            <input
              value={catSpecs[field.key] || ''}
              onChange={(e) => update(field.key, e.target.value)}
              placeholder={field.placeholder}
              className={inputCls(false)}
            />
          )}
          {field.type === 'select' && (
            <div className="relative">
              <select
                value={catSpecs[field.key] || ''}
                onChange={(e) => update(field.key, e.target.value)}
                className={inputCls(false) + ' appearance-none pr-10'}
              >
                <option value="">Select...</option>
                {field.options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          )}
          {field.type === 'multicheck' && (
            <div className="flex flex-wrap gap-2">
              {field.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleMulti(field.key, option)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    isChecked(field.key, option)
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-primary-400'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ── Specs Table Builder ────────────────────────────────────────────────────────────
const parseMarkdownTable = (text) => {
  const lines = text.trim().split(/\r?\n/).filter(l => l.trim() && !/^\|[-| :]+\|$/.test(l.trim()));
  return lines.slice(1).map(line => {
    const cols = line.split('|').map(c => c.replace(/\*\*/g, '').trim()).filter((_, i, a) => i > 0 && i < a.length - 1);
    return cols.length >= 2 ? { key: cols[0], value: cols[1] } : null;
  }).filter(Boolean);
};

const SpecsBuilder = ({ specs, onChange }) => {
  const [showPaste, setShowPaste] = useState(false);
  const [pasteText, setPasteText] = useState("");

  const addRow = () => onChange([...specs, { key: "", value: "" }]);
  const removeRow = (i) => onChange(specs.filter((_, idx) => idx !== i));
  const updateRow = (i, field, val) => {
    const updated = specs.map((row, idx) => idx === i ? { ...row, [field]: val } : row);
    onChange(updated);
  };

  const applyPaste = () => {
    const parsed = parseMarkdownTable(pasteText);
    if (parsed.length) onChange([...specs, ...parsed]);
    setPasteText("");
    setShowPaste(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Specifications</p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setShowPaste(v => !v)}
            className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-primary-600 border border-gray-200 hover:border-primary-300 rounded-lg px-3 py-1.5 transition-colors">
            Paste Table
          </button>
          <button type="button" onClick={addRow}
            className="flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700 border border-primary-200 hover:border-primary-400 rounded-lg px-3 py-1.5 transition-colors">
            <FiPlus /> Add Row
          </button>
        </div>
      </div>

      {showPaste && (
        <div className="border border-dashed border-primary-300 bg-primary-50/40 rounded-xl p-3 space-y-2">
          <p className="text-xs text-gray-500">Paste a markdown table below and click Apply.</p>
          <textarea
            value={pasteText}
            onChange={e => setPasteText(e.target.value)}
            rows={5}
            placeholder={`| Specification | Value |\n| --- | --- |\n| Connector Type | Female to Female |`}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-primary-400 resize-none"
          />
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => { setShowPaste(false); setPasteText(""); }}
              className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg text-gray-500 hover:border-gray-300 transition-colors">Cancel</button>
            <button type="button" onClick={applyPaste}
              className="text-xs px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors">Apply</button>
          </div>
        </div>
      )}

      {specs.length > 0 ? (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-primary-600 text-white">
                <th className="text-left px-4 py-2.5 font-semibold w-2/5">Specification</th>
                <th className="text-left px-4 py-2.5 font-semibold">Value</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {specs.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="px-3 py-2 border-t border-gray-100">
                    <input
                      value={row.key}
                      onChange={(e) => updateRow(i, "key", e.target.value)}
                      placeholder="e.g. Processor"
                      className="w-full bg-transparent border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary-400"
                    />
                  </td>
                  <td className="px-3 py-2 border-t border-gray-100">
                    <input
                      value={row.value}
                      onChange={(e) => updateRow(i, "value", e.target.value)}
                      placeholder="e.g. Intel Core i7"
                      className="w-full bg-transparent border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary-400"
                    />
                  </td>
                  <td className="px-2 py-2 border-t border-gray-100 text-center">
                    <button type="button" onClick={() => removeRow(i)}
                      className="text-red-400 hover:text-red-600 transition-colors">
                      <FiTrash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center text-sm text-gray-400">
          No specs yet. Click "Add Row" to start building the specs table.
        </div>
      )}
    </div>
  );
};

const TraderProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [form, setForm] = useState({
    name: "", description: "", trader_price: "", original_price: "",
    stock: "", sku: "", badge: "",
    category_id: "", brand_id: "",
    is_active: true, is_featured: false, is_new_arrival: false, is_best_seller: false,
  });
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [specs, setSpecs] = useState([]);
  const [catSpecs, setCatSpecs] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [uploadingImages, setUploadingImages] = useState(new Set());

  useEffect(() => {
    api.get("/categories/").then((r) => setCategories(r.data?.results || r.data || [])).catch(() => {});
    api.get("/brands/").then((r) => setBrands(r.data?.results || r.data || [])).catch(() => {});
    if (isEdit) {
      traderService.getProduct(id).then((r) => {
        const p = r.data;
        if (p) {
          setForm({
            name: p.name || "",
            description: p.description || "",
            trader_price: p.trader_price || p.price || "",
            original_price: p.original_price || "",
            stock: p.stock ?? "",
            sku: p.sku || "",
            badge: p.badge || "",
            category_id: p.category?.id || p.category_id || "",
            brand_id: p.brand?.id || p.brand_id || "",
            is_active: p.is_active ?? true,
            is_featured: p.is_featured ?? false,
            is_new_arrival: p.is_new_arrival ?? false,
            is_best_seller: p.is_best_seller ?? false,
          });
          setExistingImages(p.images || []);
          if (p.specs && typeof p.specs === 'object' && Object.keys(p.specs).length > 0) {
            const specEntries = Object.entries(p.specs);
            // Separate category-specific keys from manual specs
            const allCatKeys = Object.values(CATEGORY_FIELDS).flatMap(fields => fields.map(f => f.key));
            const catSpecData = {};
            const manualSpecs = [];
            specEntries.forEach(([key, value]) => {
              if (allCatKeys.includes(key)) {
                catSpecData[key] = String(value);
              } else {
                manualSpecs.push({ key, value: String(value) });
              }
            });
            setCatSpecs(catSpecData);
            setSpecs(manualSpecs);
          }
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
    if (!form.trader_price) e.trader_price = "Required";
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
    setSuccessMsg("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));

      const specsObj = specs.reduce((acc, row) => {
        if (row.key.trim()) acc[row.key.trim()] = row.value;
        return acc;
      }, {});
      Object.entries(catSpecs).forEach(([k, v]) => {
        if (v && v.trim()) specsObj[k] = v.trim();
      });
      fd.append('specs', JSON.stringify(specsObj));

      let product;
      if (isEdit) {
        const res = await traderService.updateProduct(id, fd);
        product = res.data;
      } else {
        const res = await traderService.createProduct(fd);
        product = res.data;
      }

      // Upload new images with per-image loading state
      for (let i = 0; i < images.length; i++) {
        setUploadingImages((prev) => new Set(prev).add(i));
        try {
          await traderService.uploadImage(product.id, images[i]);
        } finally {
          setUploadingImages((prev) => { const s = new Set(prev); s.delete(i); return s; });
        }
      }

      setSuccessMsg(isEdit ? "Product updated successfully!" : "Product published successfully!");
      setImages([]);
      setTimeout(() => navigate("/trader/dashboard/products"), 1500);
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

      {successMsg && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700 font-semibold">
          <FiCheck className="flex-shrink-0" /> {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">

        <Field label="Product Name" error={errors.name}>
          <input value={form.name} onChange={set("name")} placeholder="e.g. Samsung Galaxy S24" className={inputCls(errors.name)} />
        </Field>

        <Field label="Description">
          <textarea value={form.description} onChange={set("description")} rows={4} placeholder="Describe your product..." className={inputCls(false) + " resize-none"} />
        </Field>

        <SpecsBuilder specs={specs} onChange={setSpecs} />

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Your Price (UGX)" error={errors.trader_price}>
            <input type="number" value={form.trader_price} onChange={set("trader_price")} placeholder="0" className={inputCls(errors.trader_price)} />
            {form.trader_price > 0 && (
              <p className="text-xs text-green-600 font-medium mt-1">
                Customer pays: UGX {Math.ceil(Number(form.trader_price) * 1.1).toLocaleString()} (includes 10% platform fee)
              </p>
            )}
          </Field>
          <Field label="Original Price (UGX) — for discount display">
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

        {/* Category-specific fields */}
        {(() => {
          const selectedCat = categories.find(c => String(c.id) === String(form.category_id));
          const catType = getCategoryType(selectedCat?.name);
          return <CategoryFields categoryType={catType} catSpecs={catSpecs} onChange={setCatSpecs} />;
        })()}

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
                  <img src={toAbsolute(img.image)} alt="" className="w-full h-full object-cover" />
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
                  {uploadingImages.has(i) ? (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <svg className="animate-spin w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                    </div>
                  ) : (
                    <button type="button" onClick={() => removeNewImage(i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
                      <FiX />
                    </button>
                  )}
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
            {submitting
              ? uploadingImages.size > 0
                ? <>Uploading images ({uploadingImages.size} left)...</>
                : "Saving..."
              : <><FiCheck /> {isEdit ? "Save Changes" : "Publish Product"}</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TraderProductForm;
