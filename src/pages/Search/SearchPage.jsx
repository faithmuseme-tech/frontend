import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { FiSearch, FiPackage } from "react-icons/fi";
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

const Skeleton = () => (
  <div className="rounded-2xl bg-gray-100 animate-pulse aspect-[3/4]" />
);

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const [query, setQuery] = useState(q);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setQuery(q);
    if (!q) { setResults([]); return; }
    setLoading(true);
    api.get("/products/search/", { params: { q } })
      .then((r) => {
        const list = Array.isArray(r.data) ? r.data : (r.data.results ?? []);
        setResults(list.map(normalize));
      })
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [q]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) setSearchParams({ q: query.trim() });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

      {/* Search bar */}
      <form onSubmit={handleSubmit} className="flex gap-3 mb-8 max-w-2xl">
        <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-3 bg-white shadow-sm focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
          <FiSearch className="text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, brands, categories..."
            className="flex-1 text-sm outline-none bg-transparent text-gray-800 placeholder-gray-400"
          />
        </div>
        <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 rounded-xl text-sm transition-colors">
          Search
        </button>
      </form>

      {/* Heading */}
      {q && !loading && (
        <p className="text-sm text-gray-500 mb-6">
          {results.length > 0
            ? <><span className="font-semibold text-gray-800">{results.length}</span> results for "<span className="font-semibold text-primary-600">{q}</span>"</>
            : <>No results for "<span className="font-semibold text-primary-600">{q}</span>"</>
          }
        </p>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {Array(8).fill(0).map((_, i) => <Skeleton key={i} />)}
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {results.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : q ? (
        <div className="text-center py-24 text-gray-400">
          <FiPackage className="text-5xl mx-auto mb-3 opacity-20" />
          <p className="font-medium text-gray-500">No products found.</p>
          <Link to="/shop" className="mt-4 inline-block text-sm text-primary-600 font-semibold hover:underline">
            Browse all products
          </Link>
        </div>
      ) : (
        <div className="text-center py-24 text-gray-400">
          <FiSearch className="text-5xl mx-auto mb-3 opacity-20" />
          <p className="font-medium text-gray-500">Type something to search.</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
