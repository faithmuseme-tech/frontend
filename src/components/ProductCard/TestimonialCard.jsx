import React from "react";
import { Link } from "react-router-dom";
import { FaQuoteLeft } from "react-icons/fa";
import { FiShoppingBag } from "react-icons/fi";
import Rating from "../Rating/Rating";

const TestimonialCard = ({ testimonial }) => {
  const { name, avatar, rating, text, productName, productImage, productSlug } = testimonial;

  return (
    <div className="card p-5 flex flex-col gap-4 h-full">
      {/* Review text */}
      <FaQuoteLeft className="text-primary-200 text-xl flex-shrink-0" />
      <p className="text-gray-600 text-sm leading-relaxed flex-1 line-clamp-4">"{text}"</p>

      {/* Product bought */}
      {productName && (
        <Link
          to={productSlug ? `/product/${productSlug}` : "#"}
          className="flex items-center gap-3 bg-gray-50 hover:bg-primary-50 border border-gray-100 hover:border-primary-100 rounded-xl px-3 py-2.5 transition-colors group"
        >
          <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
            {productImage ? (
              <img src={productImage} alt={productName} loading="lazy" className="w-full h-full object-contain p-1" />
            ) : (
              <FiShoppingBag className="text-gray-300 text-lg" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Purchased</p>
            <p className="text-xs font-semibold text-gray-700 group-hover:text-primary-600 truncate transition-colors">
              {productName}
            </p>
          </div>
        </Link>
      )}

      {/* Customer info + rating */}
      <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
        <img
          src={avatar}
          alt={name}
          loading="lazy"
          onError={(e) => { e.target.src = `https://ui-avatars.com/api/?background=random&size=80&name=${encodeURIComponent(name)}`; }}
          className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-100 flex-shrink-0"
        />
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 text-sm truncate">{name}</p>
          <Rating value={rating} size="sm" />
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
