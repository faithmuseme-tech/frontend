import React, { useEffect, useState, useMemo } from "react";
import api from "../../services/api";
import ProductCard from "../../components/ProductCard/ProductCard";
import { FiPackage, FiSearch, FiSliders, FiX } from "react-icons/fi";

const API_BASE = process.env.REACT_APP_API_URL?.replace('/api/v1', '') || 'http://127.0.0.1:8000';
const toAbsolute = (url) => (!url ? '' : url.startsWith('http') ? url : `${API_BASE}${url}`);

const normalize = (p) => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  brand: p.brand_name || "",
  category: p.category_name || "",
  price: parseFloat(p.price),
  originalPrice: p.original_price ? parseFloat(p.original_price) : null,
  deliveryCharge: p.delivery_charge !== undefined ? parseFloat(p.delivery_charge) : 0,
  discount: p.discount || 0,
  image: toAbsolute(p.primary_image),
  inStock: p.in_stock,
  badge: p.badge || "",
  rating: p.avg_rating || 0,
  reviews: p.review_count || 0,
});

// Fetch all pages
const fetchAll = async (url) => {
  let results = [];
  let next = url;
  while (next) {
    const r = await api.get(next.replace(/^.*\/api\/v1/, ""));
    const data = r.data;
    const page = Array.isArray(data) ? data : (data.results ?? []);
    results = results.concat(page);
    next = data.next || null;
  }
  return results;
};

const SORT_OPTIONS = [
  { value: "default",    label: "Default" },
  { value: "price_asc",  label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating",     label: "Top Rated" },
  { value: "newest",     label: "Newest" },
];

const Shop = () => {
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [sort, setSort]           = useState("default");
  const [category, setCategory]   = useState("");
  const [brand, setBrand]         = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchAll("/products/")
      .then((list) => setProducts(list.map(normalize)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => [...new Set(products.map((p) => p.category).filter(Boolean))].sort(), [products]);
  const brands     = useMemo(() => [...new Set(products.map((p) => p.brand).filter(Boolean))].sort(), [products]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (search.trim())  list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()));
    if (category)       list = list.filter((p) => p.category === category);
    if (brand)          list = list.filter((p) => p.brand === brand);
    if (sort === "price_asc")  list.sort((a, b) => a.price - b.price);
    if (sort === "price_desc") list.sort((a, b) => b.price - a.price);
    if (sort === "rating")     list.sort((a, b) => b.rating - a.rating);
    if (sort === "newest")     list.sort((a, b) => b.id - a.id);
    return list;
  }, [products, search, sort, category, brand]);

  const hasFilters = search || category || brand || sort !== "default";

  const clearFilters = () => { setSearch(""); setCategory(""); setBrand(""); setSort("default"); };

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">All Products</h1>
            {!loading && (
              <p className="text-sm text-gray-400 mt-0.5">
                {filtered.length} of {products.length} product{products.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          {/* Search + filter toggle */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 w-48 sm:w-64"
              />
            </div>
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                showFilters ? "bg-primary-600 text-white border-primary-600" : "bg-white border-gray-200 text-gray-600 hover:border-primary-400"
              }`}
            >
              <FiSliders /> Filters
            </button>
            {hasFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-red-500 font-semibold hover:text-red-600 px-2">
                <FiX /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Filter bar */}
        {showFilters && (
          <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-6 flex flex-wrap gap-4 shadow-sm">
            <div className="flex flex-col gap-1 min-w-[160px]">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-400 bg-white"
              >
                <option value="">All Categories</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1 min-w-[160px]">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Brand</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-400 bg-white"
              >
                <option value="">All Brands</option>
                {brands.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1 min-w-[180px]">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Sort By</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-400 bg-white"
              >
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
            {Array(20).fill(0).map((_, i) => (
              <div key={i} className="rounded-2xl bg-gray-100 animate-pulse aspect-[3/4]" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <FiPackage className="text-5xl mx-auto mb-3 opacity-20" />
            <p className="font-medium text-gray-500">{hasFilters ? "No products match your filters." : "No products available yet."}</p>
            {hasFilters && (
              <button onClick={clearFilters} className="mt-3 text-sm text-primary-600 font-semibold hover:underline">Clear filters</button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
