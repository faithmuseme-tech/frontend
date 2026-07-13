import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CategoryCard = ({ category }) => {
  const { name, count, icon } = category;

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Link
        to={`/categories/${name.toLowerCase().replace(/\s+/g, "-")}`}
        className="card flex flex-col items-center justify-center p-5 gap-3 cursor-pointer group hover:border-primary-200 hover:bg-primary-50/50"
      >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-200 shadow-sm">
          {icon}
        </div>
        <div className="text-center">
          <p className="font-semibold text-gray-800 text-sm group-hover:text-primary-600 transition-colors">
            {name}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{count} products</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
