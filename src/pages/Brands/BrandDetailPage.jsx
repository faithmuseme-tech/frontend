import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiChevronRight, FiTag, FiPackage } from "react-icons/fi";
import api from "../../services/api";
import ProductCard from "../../components/ProductCard/ProductCard";

const API_BASE = process.env.REACT_APP_API_URL?.replace("/api/v1", "") || "http://127.0.0.1:8000";
const toAbsolute = (url) => (!url ? "" : url.startsWith("http") ? url : `${API_BASE}${url}`);

const normalizeProduct = (p) => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  brand: p.brand_name || "",
  category: p.category_name || "",
  price: parseFloat(p.price),
  originalPrice: p.original_price ? parseFloat(p.original_price) : null,
  deliveryCharge: parseFloat(p.delivery_charge || 0),
  discount: p.discount || 0,
  image: toAbsolute(p.primary_image),
  inStock: p.in_stock,
  badge: p.badge || "",
  rating: p.avg_rating || 0,
  reviews: p.review_count || 0,
});

const ProductSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
    <div className="aspect-square bg-gray-200" />
    <div className="p-4 space-y-3">
      <div className="h-3 bg-gray-200 rounded w-1/3" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-8 bg-gray-200 rounded-xl mt-2" />
    </div>
  </div>
);

const SORT_OPTIONS = [
  { value: "-created_at", label: "Newest" },
  { value: "price", label: "Price: Low to High" },
  { value: "-price", label: "Price: High to Low" },
  { value: "-avg_rating", label: "Top Rated" },
];

const BrandDetailPage = () => {
  const { slug } = useParams();
  const [brand, setBrand] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("-created_at");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/brands/${slug}/`),
      api.get("/products/", { params: { brand: slug, ordering: sort } }),
    ])
      .then(([brandRes, prodRes]) => {
        setBrand(brandRes.data);
        const list = prodRes.data?.results || prodRes.data || [];
        setProducts(list.map(normalizeProduct));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug, sort]);

  if (!loading && !brand) return (
    <div className="text-center py-32 text-gray-400">
      <FiTag className="text-5xl mx-auto mb-3 opacity-20" />
      <p className="font-medium text-gray-600">Brand not found.</p>
      <Link to="/brands" className="mt-4 inline-block text-sm text-primary-600 font-semibold hover:underline">
        Back to Brands
      </Link>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-16">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <FiChevronRight className="text-xs" />
          <Link to="/brands" className="hover:text-primary-600 transition-colors">Brands</Link>
          <FiChevronRight className="text-xs" />
          <span className="text-gray-800 font-semibold">{brand?.name || "..."}</span>
        </div>
      </div>

      {/* Brand Hero */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          {loading ? (
            <div className="flex items-center gap-6 animate-pulse">
              <div className="w-24 h-24 rounded-2xl bg-gray-200 flex-shrink-0" />
              <div className="space-y-3 flex-1">
                <div className="h-6 bg-gray-200 rounded w-40" />
                <div className="h-4 bg-gray-200 rounded w-72" />
                <div className="h-4 bg-gray-200 rounded w-24" />
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
            >
              {/* Logo */}
              <div className="w-24 h-24 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 p-3">
                {brand.logo ? (
                  <img src={brand.logo} alt={brand.name} className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="text-4xl font-extrabold text-primary-300">{brand.name[0]}</span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{brand.name}</h1>
                {brand.description && (
                  <p className="text-sm text-gray-500 mt-1 max-w-xl">{brand.description}</p>
                )}
                <div className="flex items-center gap-2 mt-3">
                  <FiPackage className="text-primary-400 text-sm" />
                  <span className="text-sm font-semibold text-gray-600">
                    {brand.product_count ?? products.length} products
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500 font-medium">
            {loading ? "Loading..." : `${products.length} product${products.length !== 1 ? "s" : ""}`}
          </p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-primary-400 bg-white"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {Array(8).fill(0).map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <FiPackage className="text-5xl mx-auto mb-3 opacity-20" />
            <p className="font-medium text-gray-500">No products found for this brand.</p>
            <Link to="/shop" className="mt-4 inline-block text-sm text-primary-600 font-semibold hover:underline">
              Browse all products
            </Link>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          >
            {products.map((p) => (
              <motion.div
                key={p.id}
                variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BrandDetailPage;
