import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiChevronRight, FiGrid } from "react-icons/fi";
import api from "../../services/api";
import CategoryCard from "../../components/CategoryCard/CategoryCard";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/categories/")
      .then((r) => setCategories(r.data?.results || r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen pb-16">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <FiChevronRight className="text-xs" />
          <span className="text-gray-800 font-semibold">Categories</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
            <FiGrid className="text-primary-600 text-lg" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">All Categories</h1>
            <p className="text-sm text-gray-400 mt-0.5">Browse products by category</p>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array(12).fill(0).map((_, i) => (
              <div key={i} className="card p-5 h-28 animate-pulse bg-gray-100" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <FiGrid className="text-5xl mx-auto mb-3 opacity-20" />
            <p className="font-medium text-gray-500">No categories available yet.</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          >
            {categories.map((cat) => (
              <motion.div
                key={cat.id}
                variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
              >
                <CategoryCard category={cat} showDescription />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
