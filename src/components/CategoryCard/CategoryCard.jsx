import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const API_BASE = process.env.REACT_APP_API_URL?.replace("/api/v1", "") || "http://127.0.0.1:8000";
const toAbsolute = (url) => (!url ? "" : url.startsWith("http") ? url : `${API_BASE}${url}`);

const CategoryCard = ({ category, showDescription = false }) => {
  const { name, slug, icon, image, product_count, description } = category;

  if (showDescription) {
    return (
      <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
        <Link
          to={`/categories/${slug}`}
          className="card flex items-center gap-4 p-4 cursor-pointer group hover:border-primary-200 hover:bg-primary-50/40"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-105 transition-transform duration-200 shadow-sm overflow-hidden">
            {image ? (
              <img src={toAbsolute(image)} alt={name} loading="lazy" className="w-full h-full object-cover" />
            ) : (
              <span>{icon || "📦"}</span>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-gray-800 text-sm group-hover:text-primary-600 transition-colors truncate">
              {name}
            </p>
            {description && (
              <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{description}</p>
            )}
            <span className="inline-block mt-1.5 text-xs font-semibold bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
              {product_count ?? 0} products
            </span>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Link
        to={`/categories/${slug}`}
        className="card flex flex-col items-center justify-center p-5 gap-3 cursor-pointer group hover:border-primary-200 hover:bg-primary-50/50"
      >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-200 shadow-sm overflow-hidden">
          {image ? (
            <img src={toAbsolute(image)} alt={name} loading="lazy" className="w-full h-full object-cover" />
          ) : (
            <span>{icon || "📦"}</span>
          )}
        </div>
        <div className="text-center">
          <p className="font-semibold text-gray-800 text-sm group-hover:text-primary-600 transition-colors">
            {name}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{product_count ?? 0} products</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
