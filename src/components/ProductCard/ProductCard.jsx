import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHeart, FiShoppingCart, FiEye } from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import Rating from "../Rating/Rating";
import { formatUGX } from "../../utils/currency";

const badgeColors = {
  "Best Seller": "bg-green-500",
  "Hot Deal": "bg-red-500",
  New: "bg-blue-500",
  "Top Rated": "bg-purple-500",
  Gaming: "bg-orange-500",
};

const ProductCard = ({ product }) => {
  const { id, name, brand, rating, reviews, price, originalPrice, discount, image, inStock, badge } = product;
  const deliveryCharge = product.deliveryCharge ?? product.delivery_charge ?? 0;
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const [added, setAdded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const slug = product.slug || id;
  const productLink = `/product/${slug}`;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!inStock) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const navigate = useNavigate();

  const handleWishlist = (e) => {
    e.preventDefault();
    toggle(product);
  };

  const handleView = (e) => {
    e.preventDefault();
    navigate(productLink);
  };

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Link to={productLink} className="card flex flex-col group overflow-hidden h-full">
        {/* Image */}
        <div className="relative overflow-hidden bg-gray-50 rounded-t-2xl aspect-square">
          {!imgLoaded && <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-t-2xl" />}
          <img
            src={image}
            alt={name}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {badge && (
              <span className={`${badgeColors[badge] || "bg-gray-500"} text-white text-xs font-bold px-2 py-0.5 rounded-full`}>
                {badge}
              </span>
            )}
            {discount > 0 && (
              <span className="bg-accent-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                -{discount}%
              </span>
            )}
          </div>

          {/* Hover action buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
            <button
              onClick={handleWishlist}
              aria-label="Add to wishlist"
              className={`w-8 h-8 rounded-full shadow-md flex items-center justify-center transition-colors ${
                isWishlisted(id) ? "bg-red-500 text-white" : "bg-white text-gray-600 hover:bg-red-50 hover:text-red-500"
              }`}
            >
              <FiHeart className={`text-sm ${isWishlisted(id) ? "fill-current" : ""}`} />
            </button>
            <button
              onClick={handleView}
              aria-label="View product"
              className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-colors"
            >
              <FiEye className="text-sm" />
            </button>
          </div>

          {/* Out of stock overlay */}
          {!inStock && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center rounded-t-2xl">
              <span className="bg-gray-800 text-white text-xs font-semibold px-3 py-1.5 rounded-full">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col flex-1 gap-2">
          <p className="text-xs text-primary-600 font-semibold uppercase tracking-wide">{brand}</p>
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug group-hover:text-primary-600 transition-colors">
            {name}
          </h3>
          <Rating value={rating} count={reviews} />

          <div className="flex flex-col mt-auto pt-1">
            <span className="text-base font-extrabold text-gray-900">{formatUGX(price)}</span>
            {deliveryCharge > 0 && (
              <span className="text-xs font-semibold text-blue-600">Delivery: {formatUGX(deliveryCharge)}</span>
            )}
            {originalPrice > price && (
              <span className="text-xs text-gray-400 line-through">{formatUGX(originalPrice)}</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className={`mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              !inStock
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : added
                ? "bg-green-500 text-white"
                : "bg-primary-600 hover:bg-primary-700 text-white active:scale-95"
            }`}
          >
            <FiShoppingCart className="text-base" />
            {added ? "Added!" : inStock ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
