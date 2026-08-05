import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiChevronRight, FiSearch, FiTag } from "react-icons/fi";
import api from "../../services/api";

const BrandsPage = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/brands/")
      .then((r) => setBrands(r.data?.results || r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() =>
    brands.filter((b) => b.name.toLowerCase().includes(search.toLowerCase())),
    [brands, search]
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-16">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <FiChevronRight className="text-xs" />
          <span className="text-gray-800 font-semibold">Brands</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <FiTag className="text-primary-600 text-lg" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">All Brands</h1>
              <p className="text-sm text-gray-400 mt-0.5">{brands.length} brands available</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search brands..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary-400 bg-white"
            />
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array(10).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 h-36 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <FiTag className="text-5xl mx-auto mb-3 opacity-20" />
            <p className="font-medium text-gray-500">No brands found.</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
          >
            {filtered.map((brand) => (
              <motion.div
                key={brand.id}
                variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to={`/brands/${brand.slug}`}
                  className="bg-white rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-md p-5 flex flex-col items-center gap-3 group transition-all"
                >
                  {/* Logo */}
                  <div className="w-16 h-16 flex items-center justify-center">
                    {brand.logo ? (
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        loading="lazy"
                        className="max-h-14 max-w-full object-contain grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-300"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center text-2xl font-extrabold text-primary-400">
                        {brand.name[0]}
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <p className="font-bold text-gray-800 text-sm text-center group-hover:text-primary-600 transition-colors">
                    {brand.name}
                  </p>

                  {/* Product count */}
                  <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">
                    {brand.product_count ?? 0} products
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BrandsPage;
