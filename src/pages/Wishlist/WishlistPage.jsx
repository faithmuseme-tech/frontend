import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiHeart, FiShoppingCart, FiTrash2, FiArrowLeft, FiChevronRight } from "react-icons/fi";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { formatUGX } from "../../utils/currency";
import { toAbsolute } from "../../utils/imageUrl";
import Rating from "../../components/Rating/Rating";

const WishlistPage = () => {
  const { items, toggle } = useWishlist();
  const { addItem, items: cartItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 gap-5">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center">
          <FiHeart className="text-5xl text-red-300" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-gray-800">Sign in to view your wishlist</h2>
          <p className="text-gray-400 text-sm mt-1">Save your favourite products and come back to them anytime.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate("/login")} className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors">
            Sign In
          </button>
          <button onClick={() => navigate("/register")} className="border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-xl text-sm transition-colors">
            Register
          </button>
        </div>
      </div>
    );
  }

  // Empty wishlist
  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 gap-5">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center">
          <FiHeart className="text-5xl text-red-300" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-gray-800">Your wishlist is empty</h2>
          <p className="text-gray-400 text-sm mt-1">Browse products and tap the heart icon to save them here.</p>
        </div>
        <Link to="/shop" className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-7 py-3 rounded-xl text-sm transition-colors shadow-md">
          <FiArrowLeft /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <FiChevronRight className="text-xs" />
          <span className="text-gray-800 font-semibold">Wishlist</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">My Wishlist</h1>
            <p className="text-sm text-gray-400 mt-0.5">{items.length} saved item{items.length !== 1 ? "s" : ""}</p>
          </div>
          <Link to="/shop" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">
            <FiArrowLeft className="text-sm" /> Continue Shopping
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {items.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col"
              >
                {/* Image */}
                <Link to={`/product/${product.slug || product.id}`} className="relative block aspect-square bg-gray-50 overflow-hidden group">
                  <img
                    src={toAbsolute(product.image)}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                      <span className="bg-gray-800 text-white text-xs font-semibold px-3 py-1.5 rounded-full">Out of Stock</span>
                    </div>
                  )}
                  {product.discount > 0 && (
                    <span className="absolute top-3 left-3 bg-accent-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      -{product.discount}%
                    </span>
                  )}
                  {/* Remove button */}
                  <button
                    onClick={(e) => { e.preventDefault(); toggle(product, cartItems); }}
                    className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                </Link>

                {/* Info */}
                <div className="p-4 flex flex-col flex-1 gap-2">
                  {product.brand && (
                    <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide">{product.brand}</p>
                  )}
                  <Link to={`/product/${product.slug || product.id}`} className="text-sm font-semibold text-gray-800 hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
                    {product.name}
                  </Link>
                  <Rating value={product.rating} count={product.reviews} />

                  <div className="mt-auto pt-1">
                    <span className="text-base font-extrabold text-gray-900">{formatUGX(product.price)}</span>
                    {product.originalPrice > product.price && (
                      <span className="ml-2 text-xs text-gray-400 line-through">{formatUGX(product.originalPrice)}</span>
                    )}
                  </div>

                  <button
                    onClick={() => addItem(product)}
                    disabled={!product.inStock}
                    className={`mt-1 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      !product.inStock
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-primary-600 hover:bg-primary-700 text-white active:scale-95"
                    }`}
                  >
                    <FiShoppingCart className="text-base" />
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <Link to="/shop" className="sm:hidden inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 mt-6">
          <FiArrowLeft /> Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default WishlistPage;
