import React, { useEffect, useState, useRef } from "react";
import adminService from "../../../services/adminService";
import { FiPower, FiEdit2, FiTrash2, FiX, FiPlus, FiSave, FiImage, FiChevronDown } from "react-icons/fi";

const EMPTY_FORM = {
  name: "", description: "", trader_price: "", original_price: "",
  delivery_charge: "", stock: "", badge: "",
  is_active: true, is_featured: false, is_new_arrival: false, is_best_seller: false,
  brand_id: "", category_id: "",
};


const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
    {children}
  </div>
);

const Input = (props) => (
  <input
    {...props}
    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
  />
);

const Textarea = (props) => (
  <textarea
    {...props}
    rows={3}
    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
  />
);

const Toggle = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-2 cursor-pointer select-none">
    <div
      onClick={() => onChange(!checked)}
      className={`w-10 h-5 rounded-full transition-colors ${checked ? "bg-indigo-600" : "bg-gray-200"} relative`}
    >
      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${checked ? "left-5" : "left-0.5"}`} />
    </div>
    <span className="text-xs text-gray-600">{label}</span>
  </label>
);

// ── Category type detector ────────────────────────────────────────────────────
const getCategoryType = (name) => {
  if (!name) return null;
  const n = name.toLowerCase();
  if (/shoe|boot|sandal|sneaker|heel|loafer|slipper|footwear|trainer/.test(n)) return 'shoes';
  if (/cloth|fashion|wear|shirt|dress|trouser|jean|apparel|outfit|jacket|coat|suit|skirt|blouse|underwear|sock/.test(n)) return 'clothing';
  if (/phone|mobile|smartphone|iphone|android|tablet/.test(n)) return 'phone';
  if (/laptop|computer|pc|notebook|macbook/.test(n)) return 'computer';
  if (/tv|television|monitor|display|screen/.test(n)) return 'tv';
  if (/camera|photo|lens/.test(n)) return 'camera';
  return null;
};

const CATEGORY_FIELDS = {
  shoes: [
    { key: 'sizes',        label: 'Sizes (EU)',       type: 'multicheck', options: ['35','36','37','38','39','40','41','42','43','44','45','46','47','48'] },
    { key: 'uk_sizes',     label: 'Sizes (UK)',        type: 'multicheck', options: ['3','4','5','6','7','8','9','10','11','12','13'] },
    { key: 'colors',       label: 'Colors',            type: 'tags',       placeholder: 'e.g. Black, White, Brown' },
    { key: 'gender',       label: 'Gender',            type: 'select',     options: ['Unisex','Men','Women','Boys','Girls','Kids'] },
    { key: 'shoe_type',    label: 'Shoe Type',         type: 'select',     options: ['Sneakers','Boots','Sandals','Loafers','Heels','Slippers','Formal Shoes','Sports Shoes','Flip Flops','Wedges','Moccasins','Other'] },
    { key: 'material',     label: 'Upper Material',    type: 'select',     options: ['Leather','Synthetic Leather','Canvas','Mesh','Suede','Rubber','Textile','Other'] },
    { key: 'sole_material',label: 'Sole Material',     type: 'select',     options: ['Rubber','EVA','TPR','PU','Leather','Other'] },
    { key: 'closure',      label: 'Closure Type',      type: 'select',     options: ['Lace-up','Slip-on','Velcro','Buckle','Zipper','Hook & Loop','Other'] },
    { key: 'heel_height',  label: 'Heel Height',       type: 'select',     options: ['Flat (0–1cm)','Low (1–3cm)','Mid (3–6cm)','High (6–9cm)','Very High (9cm+)'] },
    { key: 'occasion',     label: 'Occasion',          type: 'tags',       placeholder: 'e.g. Casual, Formal, Sports' },
    { key: 'condition',    label: 'Condition',         type: 'select',     options: ['Brand New','Used - Like New','Used - Good'] },
  ],
  clothing: [
    { key: 'sizes',    label: 'Available Sizes',   type: 'multicheck', options: ['XS','S','M','L','XL','XXL','XXXL','4XL','Free Size','28','30','32','34','36','38','40','42','44'] },
    { key: 'colors',   label: 'Available Colors',  type: 'tags',       placeholder: 'e.g. Red, Blue, Black' },
    { key: 'material', label: 'Material',          type: 'text',       placeholder: 'e.g. 100% Cotton' },
    { key: 'gender',   label: 'Gender',            type: 'select',     options: ['Unisex','Men','Women','Boys','Girls','Kids'] },
    { key: 'style',    label: 'Style',             type: 'text',       placeholder: 'e.g. Casual, Formal' },
    { key: 'care',     label: 'Care Instructions', type: 'text',       placeholder: 'e.g. Machine wash cold' },
  ],
  phone: [
    { key: 'storage_options', label: 'Storage',  type: 'multicheck', options: ['16GB','32GB','64GB','128GB','256GB','512GB','1TB'] },
    { key: 'ram',             label: 'RAM',       type: 'multicheck', options: ['2GB','3GB','4GB','6GB','8GB','12GB','16GB'] },
    { key: 'colors',          label: 'Colors',    type: 'tags',       placeholder: 'e.g. Black, White' },
    { key: 'network',         label: 'Network',   type: 'multicheck', options: ['2G','3G','4G LTE','5G'] },
    { key: 'os',              label: 'OS',        type: 'select',     options: ['Android','iOS','HarmonyOS','Other'] },
    { key: 'battery',         label: 'Battery',   type: 'text',       placeholder: 'e.g. 5000mAh' },
    { key: 'screen_size',     label: 'Screen',    type: 'text',       placeholder: 'e.g. 6.7 inches' },
    { key: 'condition',       label: 'Condition', type: 'select',     options: ['Brand New','Refurbished','Used - Like New','Used - Good'] },
  ],
  computer: [
    { key: 'processor', label: 'Processor', type: 'text',       placeholder: 'e.g. Intel Core i7' },
    { key: 'ram',       label: 'RAM',       type: 'multicheck', options: ['4GB','8GB','16GB','32GB','64GB'] },
    { key: 'storage',   label: 'Storage',   type: 'text',       placeholder: 'e.g. 512GB SSD' },
    { key: 'display',   label: 'Display',   type: 'text',       placeholder: 'e.g. 15.6" FHD' },
    { key: 'gpu',       label: 'GPU',       type: 'text',       placeholder: 'e.g. NVIDIA RTX 3060' },
    { key: 'os',        label: 'OS',        type: 'select',     options: ['Windows 11','Windows 10','macOS','Linux','No OS'] },
    { key: 'condition', label: 'Condition', type: 'select',     options: ['Brand New','Refurbished','Used - Like New','Used - Good'] },
  ],
  tv: [
    { key: 'screen_size', label: 'Screen Size', type: 'text',   placeholder: 'e.g. 55 inches' },
    { key: 'resolution',  label: 'Resolution',  type: 'select', options: ['HD (720p)','Full HD (1080p)','4K UHD','8K'] },
    { key: 'smart_tv',    label: 'Smart TV',    type: 'select', options: ['Yes','No'] },
    { key: 'hdmi_ports',  label: 'HDMI Ports',  type: 'text',   placeholder: 'e.g. 3' },
  ],
  camera: [
    { key: 'megapixels', label: 'Megapixels',   type: 'text',   placeholder: 'e.g. 24.2 MP' },
    { key: 'sensor',     label: 'Sensor Type',  type: 'select', options: ['Full Frame','APS-C','Micro Four Thirds','Medium Format'] },
    { key: 'video',      label: 'Video',        type: 'text',   placeholder: 'e.g. 4K 30fps' },
    { key: 'condition',  label: 'Condition',    type: 'select', options: ['Brand New','Refurbished','Used - Like New','Used - Good'] },
  ],
};

const TYPE_LABEL = {
  shoes: '👟 Shoes', clothing: '👕 Clothing', phone: '📱 Phone',
  computer: '💻 Computer', tv: '📺 TV / Display', camera: '📷 Camera',
};

const ALL_CAT_KEYS = Object.values(CATEGORY_FIELDS).flatMap(f => f.map(x => x.key));

const CategoryFields = ({ categoryType, catSpecs, onChange }) => {
  if (!categoryType || !CATEGORY_FIELDS[categoryType]) return null;
  const fields = CATEGORY_FIELDS[categoryType];
  const update = (key, value) => onChange({ ...catSpecs, [key]: value });
  const toggleMulti = (key, option) => {
    const cur = catSpecs[key] ? catSpecs[key].split(',').map(s => s.trim()).filter(Boolean) : [];
    const next = cur.includes(option) ? cur.filter(o => o !== option) : [...cur, option];
    update(key, next.join(', '));
  };
  const isChecked = (key, option) =>
    (catSpecs[key] ? catSpecs[key].split(',').map(s => s.trim()) : []).includes(option);

  return (
    <div className="border border-indigo-100 bg-indigo-50/40 rounded-2xl p-5 space-y-4">
      <p className="text-xs font-bold text-indigo-700 uppercase tracking-wide">{TYPE_LABEL[categoryType]} Details</p>
      {fields.map((field) => (
        <div key={field.key}>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">{field.label}</label>
          {(field.type === 'text' || field.type === 'tags') && (
            <input
              value={catSpecs[field.key] || ''}
              onChange={(e) => update(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          )}
          {field.type === 'select' && (
            <div className="relative">
              <select
                value={catSpecs[field.key] || ''}
                onChange={(e) => update(field.key, e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 appearance-none pr-8"
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
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-400'
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
const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);       // full product object
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [imgUploading, setImgUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [catSpecs, setCatSpecs] = useState({});
  const fileRef = useRef();

  const load = async () => {
    setLoading(true);
    try {
      const [pRes, bRes, cRes] = await Promise.all([
        adminService.getProducts(),
        adminService.getBrands(),
        adminService.getCategories(),
      ]);
      setProducts(pRes.data?.results || pRes.data || []);
      setBrands(bRes.data?.results || bRes.data || []);
      setCategories(cRes.data?.results || cRes.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openEdit = async (product) => {
    // fetch full detail
    const res = await adminService.getProduct(product.id);
    const p = res.data;
    setEditing(p);
    setForm({
      name: p.name || "",
      description: p.description || "",
      trader_price: p.trader_price || "",
      original_price: p.original_price || "",
      delivery_charge: p.delivery_charge || "",
      stock: p.stock ?? "",
      badge: p.badge || "",
      is_active: p.is_active,
      is_featured: p.is_featured,
      is_new_arrival: p.is_new_arrival,
      is_best_seller: p.is_best_seller,
      brand_id: p.brand?.id || "",
      category_id: p.category?.id || "",
    });
    if (p.specs && typeof p.specs === 'object') {
      const catData = {};
      const manualRows = [];
      Object.entries(p.specs).forEach(([k, v]) => {
        if (ALL_CAT_KEYS.includes(k)) catData[k] = String(v);
        else manualRows.push({ key: k, value: String(v) });
      });
      setCatSpecs(catData);
    }
  };

  const closeEdit = () => { setEditing(null); setForm(EMPTY_FORM); setCatSpecs({}); };

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      const specsObj = {};
      Object.entries(catSpecs).forEach(([k, v]) => { if (v && String(v).trim()) specsObj[k] = v; });
      Object.entries(form).forEach(([k, v]) => {
        fd.append(k, v === "" ? "" : v);
      });
      fd.set("specs", JSON.stringify(specsObj));
      await adminService.updateProduct(editing.id, fd);
      await load();
      closeEdit();
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id) => {
    const res = await adminService.toggleProduct(id);
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, is_active: res.data.is_active } : p));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product permanently?")) return;
    await adminService.deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImgUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await adminService.addProductImage(editing.id, fd);
      setEditing((prev) => ({ ...prev, images: [...(prev.images || []), res.data] }));
    } finally {
      setImgUploading(false);
      fileRef.current.value = "";
    }
  };

  const handleDeleteImage = async (imageId) => {
    await adminService.deleteProductImage(editing.id, imageId);
    setEditing((prev) => ({ ...prev, images: prev.images.filter((i) => i.id !== imageId) }));
  };

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.brand_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">View, edit, and manage all trader products.</p>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No products found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Product</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Brand</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Price</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Stock</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-800">{product.name}</p>
                    <p className="text-xs text-gray-400">{product.category_name}</p>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell text-gray-700">{product.brand_name}</td>
                  <td className="px-5 py-4 hidden lg:table-cell text-gray-700">
                    {product.price ? `UGX ${Number(product.price).toLocaleString()}` : "—"}
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell text-gray-700">{product.stock}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${product.is_active ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                      {product.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(product)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-2 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
                      >
                        <FiEdit2 size={12} /> Edit
                      </button>
                      <button
                        onClick={() => handleToggle(product.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-gray-100 px-3 py-2 text-gray-700 text-xs font-semibold hover:bg-gray-200 transition-colors"
                      >
                        <FiPower size={12} /> {product.is_active ? "Disable" : "Enable"}
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-red-50 px-3 py-2 text-red-600 text-xs font-semibold hover:bg-red-100 transition-colors"
                      >
                        <FiTrash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Edit Modal ── */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-8 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            {/* header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-extrabold text-gray-900 text-lg">Edit Product</h2>
              <button onClick={closeEdit} className="text-gray-400 hover:text-gray-600">
                <FiX size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Images */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Images</label>
                <div className="flex flex-wrap gap-3 mb-3">
                  {(editing.images || []).map((img) => (
                    <div key={img.id} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-gray-200">
                      <img src={img.image} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => handleDeleteImage(img.id)}
                        className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => fileRef.current.click()}
                    disabled={imgUploading}
                    className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-indigo-400 hover:text-indigo-500 transition-colors text-xs gap-1"
                  >
                    {imgUploading ? <div className="w-4 h-4 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" /> : <><FiImage size={16} /><span>Add</span></>}
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAddImage} />
                </div>
              </div>

              {/* Basic info */}
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Product Name">
                  <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
                </Field>
                <Field label="Badge (e.g. New, Hot)">
                  <Input value={form.badge} onChange={(e) => set("badge", e.target.value)} />
                </Field>
              </div>

              <Field label="Description">
                <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} />
              </Field>

              {/* Pricing */}
              <div className="grid sm:grid-cols-3 gap-4">
                <Field label="Trader Price (UGX)">
                  <Input type="number" value={form.trader_price} onChange={(e) => set("trader_price", e.target.value)} />
                </Field>
                <Field label="Original Price (UGX)">
                  <Input type="number" value={form.original_price} onChange={(e) => set("original_price", e.target.value)} />
                </Field>
                <Field label="Delivery Charge (UGX)">
                  <Input type="number" value={form.delivery_charge} onChange={(e) => set("delivery_charge", e.target.value)} />
                </Field>
              </div>

              {/* Stock, Brand, Category */}
              <div className="grid sm:grid-cols-3 gap-4">
                <Field label="Stock">
                  <Input type="number" value={form.stock} onChange={(e) => set("stock", e.target.value)} />
                </Field>
                <Field label="Brand">
                  <select
                    value={form.brand_id}
                    onChange={(e) => set("brand_id", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  >
                    <option value="">— Select Brand —</option>
                    {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </Field>
                <Field label="Category">
                  <select
                    value={form.category_id}
                    onChange={(e) => set("category_id", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  >
                    <option value="">— Select Category —</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </Field>
              </div>

              {/* Category-specific specs */}
              {(() => {
                const cat = categories.find(c => String(c.id) === String(form.category_id));
                const catType = getCategoryType(cat?.name);
                return <CategoryFields categoryType={catType} catSpecs={catSpecs} onChange={setCatSpecs} />;
              })()}

              {/* Toggles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <Toggle label="Active" checked={form.is_active} onChange={(v) => set("is_active", v)} />
                <Toggle label="Featured" checked={form.is_featured} onChange={(v) => set("is_featured", v)} />
                <Toggle label="New Arrival" checked={form.is_new_arrival} onChange={(v) => set("is_new_arrival", v)} />
                <Toggle label="Best Seller" checked={form.is_best_seller} onChange={(v) => set("is_best_seller", v)} />
              </div>
            </div>

            {/* footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={closeEdit} className="px-5 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-colors disabled:opacity-60"
              >
                {saving ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <FiSave size={14} />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
