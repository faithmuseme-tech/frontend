import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import ProductCard from "../../components/ProductCard/ProductCard";
import { FiPackage, FiFilter, FiChevronDown, FiStar, FiArrowRight } from "react-icons/fi";

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
  badge: p.badge || "New",
  rating: p.avg_rating || 0,
  reviews: p.review_count || 0,
  createdAt: p.created_at || "",
});

const SORT_OPTIONS = [
  { label: "Newest First",    value: "newest" },
  { label: "Price: Low–High", value: "price_asc" },
  { label: "Price: High–Low", value: "price_desc" },
  { label: "Top Rated",       value: "rating" },
];

const Skeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
    {Array(8).fill(0).map((_, i) => (
      <div key={i} className="rounded-2xl bg-gray-100 animate-pulse aspect-[3/4]" />
    ))}
  </div>
);

const NewArrivalsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [category, setCategory] = useState("All");
  const [sort, setSort]         = useState("newest");

  useEffect(() => {
    api.get("/products/", { params: { ordering: "-created_at", limit: 40 } })
      .then((r) => {
        const list = Array.isArray(r.data) ? r.data : (r.data.results ?? []);
        setProducts(list.map(normalize));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category).filter(Boolean))];
    return ["All", ...cats];
  }, [products]);

  const filtered = useMemo(() => {
    let list = category === "All" ? products : products.filter((p) => p.category === category);
    if (sort === "price_asc")  list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price_desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating")     list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [products, category, sort]);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex flex-col gap-3">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full w-fit">
              <FiStar className="text-yellow-300" /> Just Arrived
            </div>
            <div className="flex flex-row items-end justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">New Arrivals</h1>
                <p className="text-indigo-200 mt-1.5 text-xs sm:text-sm max-w-sm">
                  Fresh products just added to CartPulse. Be the first to grab the latest items from our verified traders.
                </p>
              </div>
              <Link
                to="/shop"
                className="self-start sm:self-auto flex items-center gap-1 text-indigo-200 hover:text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap"
              >
                View All Products <FiArrowRight className="text-xs" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Filters bar */}
        <div className="bg-white rounded-2xl border border-gray-100 p-3 sm:p-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <span className="flex items-center gap-1 text-xs font-bold text-gray-500 flex-shrink-0">
              <FiFilter className="text-sm" /> Filter:
            </span>
            {loading
              ? Array(4).fill(0).map((_, i) => (
                  <div key={i} className="h-7 w-16 bg-gray-100 rounded-full animate-pulse flex-shrink-0" />
                ))
              : categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      category === cat
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
            <div className="relative flex-shrink-0 ml-auto">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none bg-gray-100 text-gray-700 text-xs font-semibold pl-3 pr-7 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-sm text-gray-500 font-medium">
            Showing <span className="font-bold text-gray-800">{filtered.length}</span> new arrival{filtered.length !== 1 ? "s" : ""}
            {category !== "All" && <> in <span className="font-bold text-indigo-600">{category}</span></>}
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <Skeleton />
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <FiPackage className="text-5xl mx-auto mb-3 text-gray-200" />
            <p className="font-semibold text-gray-500">No new arrivals found.</p>
            <Link to="/shop" className="mt-4 inline-flex items-center gap-2 text-sm text-indigo-600 font-semibold hover:underline">
              Browse all products <FiArrowRight />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewArrivalsPage;
