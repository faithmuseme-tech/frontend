import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiChevronRight, FiPackage, FiArrowLeft } from "react-icons/fi";
import api from "../../services/api";
import ProductCard from "../../components/ProductCard/ProductCard";

const API_BASE = process.env.REACT_APP_API_URL?.replace("/api/v1", "") || "http://127.0.0.1:8000";
const toAbsolute = (url) => (!url ? "" : url.startsWith("http") ? url : `${API_BASE}${url}`);

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

const SORT_OPTIONS = [
  { label: "Newest", value: "-created_at" },
  { label: "Price: Low to High", value: "price" },
  { label: "Price: High to Low", value: "-price" },
  { label: "Top Rated", value: "-avg_rating" },
];

const CategoryDetailPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("-created_at");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/categories/${slug}/`),
      api.get("/products/", { params: { category: slug, ordering: sort } }),
    ])
      .then(([catRes, prodRes]) => {
        setCategory(catRes.data);
        const list = prodRes.data?.results || prodRes.data || [];
        setProducts(list.map(normalize));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug, sort]);

  return (
    <div className="bg-gray-50 min-h-screen pb-16">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <FiChevronRight className="text-xs" />
          <Link to="/categories" className="hover:text-primary-600 transition-colors">Categories</Link>
          <FiChevronRight className="text-xs" />
          <span className="text-gray-800 font-semibold">{category?.name || slug}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">

        {/* Category header */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8 flex items-center gap-5">
          {category?.image ? (
            <img
              src={toAbsolute(category.image)}
              alt={category.name}
              className="w-16 h-16 rounded-2xl object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center text-3xl flex-shrink-0">
              {category?.icon || "📦"}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-extrabold text-gray-900">{category?.name || slug}</h1>
            {category?.description && (
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{category.description}</p>
            )}
            <p className="text-xs text-primary-600 font-semibold mt-1">
              {category?.product_count ?? products.length} products
            </p>
          </div>
          <Link to="/categories" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-primary-600 transition-colors flex-shrink-0">
            <FiArrowLeft className="text-sm" /> All Categories
          </Link>
        </div>

        {/* Sort + count bar */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-800">{products.length}</span> products found
          </p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-primary-400 bg-white"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Products grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="rounded-2xl bg-gray-100 animate-pulse aspect-[3/4]" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <FiPackage className="text-5xl mx-auto mb-3 opacity-20" />
            <p className="font-medium text-gray-500">No products in this category yet.</p>
            <Link to="/shop" className="mt-4 inline-block text-sm text-primary-600 font-semibold hover:underline">
              Browse all products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetailPage;
