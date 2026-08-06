import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiHeart, FiShoppingCart, FiX } from "react-icons/fi";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";

const MESSAGES = [
  "Still thinking? It's been a while — add it to your cart before it sells out!",
  "Your wishlist is calling! Don't let this one slip away.",
  "This item is waiting for you. Grab it before stock runs out!",
];

const WishlistNudgeToast = () => {
  const { nudgeProduct, dismissNudge } = useWishlist();
  const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!nudgeProduct) return;
    const t = setTimeout(dismissNudge, 15000);
    return () => clearTimeout(t);
  }, [nudgeProduct, dismissNudge]);

  if (!nudgeProduct) return null;

  const msg = MESSAGES[nudgeProduct.id % MESSAGES.length];

  const handleAddToCart = () => {
    addItem(nudgeProduct);
    dismissNudge();
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100%-2rem)] max-w-sm animate-slide-up">
      <div className="bg-white rounded-2xl shadow-2xl border border-orange-100 p-4 flex items-start gap-3">
        {/* Product image */}
        <div className="shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
          {nudgeProduct.image
            ? <img src={nudgeProduct.image} alt={nudgeProduct.name} className="w-full h-full object-cover" />
            : <FiHeart className="text-2xl text-orange-400 m-auto mt-3" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <FiHeart className="text-orange-500 text-xs shrink-0" />
            <p className="text-xs font-bold text-orange-500 uppercase tracking-wide">Wishlist Reminder</p>
          </div>
          <p className="text-sm font-bold text-gray-900 truncate">{nudgeProduct.name}</p>
          <p className="text-xs text-gray-500 mt-0.5 leading-snug">{msg}</p>

          <div className="flex items-center gap-2 mt-2.5">
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-500 hover:bg-accent-600 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              <FiShoppingCart className="text-xs" /> Add to Cart
            </button>
            <button
              onClick={() => { dismissNudge(); navigate(`/product/${nudgeProduct.slug}`); }}
              className="px-3 py-1.5 border border-gray-200 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              View Item
            </button>
          </div>
        </div>

        <button onClick={dismissNudge} className="shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors">
          <FiX />
        </button>
      </div>
    </div>
  );
};

export default WishlistNudgeToast;
