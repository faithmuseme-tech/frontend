import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const BrandCard = ({ brand }) => {
  return (
    <motion.div whileHover={{ y: -3, scale: 1.02 }} transition={{ duration: 0.2 }}>
      <Link
        to={`/brands/${brand.slug || brand.name.toLowerCase()}`}
        className="card flex items-center justify-center p-5 h-20 group hover:border-primary-200"
      >
        {brand.logo ? (
          <img
            src={brand.logo}
            alt={brand.name}
            loading="lazy"
            className="max-h-8 max-w-full object-contain grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 transition-all duration-300"
          />
        ) : (
          <span className="text-sm font-extrabold text-primary-400 group-hover:text-primary-600 transition-colors">
            {brand.name}
          </span>
        )}
      </Link>
    </motion.div>
  );
};

export default BrandCard;
