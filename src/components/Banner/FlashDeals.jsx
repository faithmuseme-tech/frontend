import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiZap, FiArrowRight, FiShoppingCart } from "react-icons/fi";
import { flashDeals } from "../../utils/data";
import Rating from "../Rating/Rating";
import { formatUGX } from "../../utils/currency";
import { useCart } from "../../context/CartContext";

const getTimeLeft = (target) => {
  const diff = target - Date.now();
  if (diff <= 0) return { h: 0, m: 0, s: 0 };
  return {
    h: Math.floor(diff / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  };
};

const Pad = ({ n }) => (
  <div className="bg-primary-900 text-white rounded-lg w-10 h-10 flex items-center justify-center font-extrabold text-lg tabular-nums">
    {String(n).padStart(2, "0")}
  </div>
);

const FlashDeals = () => {
  const [target] = useState(() => Date.now() + 6 * 3600000 + 23 * 60000 + 45000);
  const [time, setTime] = useState(getTimeLeft(target));
  const { addItem } = useCart();

  useEffect(() => {
    const t = setInterval(() => setTime(getTimeLeft(target)), 1000);
    return () => clearInterval(t);
  }, [target]);

  return (
    <section className="py-16 bg-gradient-to-br from-primary-900 via-primary-800 to-blue-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-accent-500 rounded-xl flex items-center justify-center">
                <FiZap className="text-white text-xl" />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">Flash Deals</h2>
            </div>
            <p className="text-blue-300 text-sm">Limited-time offers — grab them before they're gone!</p>
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-2">
            <span className="text-blue-300 text-sm font-medium mr-1">Ends in:</span>
            <Pad n={time.h} />
            <span className="text-white font-bold text-xl">:</span>
            <Pad n={time.m} />
            <span className="text-white font-bold text-xl">:</span>
            <Pad n={time.s} />
          </div>
        </div>

        {/* Deals grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {flashDeals.map((deal, i) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg"
            >
              <div className="relative aspect-square bg-gray-50 overflow-hidden">
                <img
                  src={deal.image}
                  alt={deal.name}
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-accent-500 text-white text-xs font-extrabold px-2.5 py-1 rounded-full">
                  -{deal.discount}%
                </span>
              </div>

              <div className="p-4">
                <p className="text-xs text-primary-600 font-semibold uppercase">{deal.brand}</p>
                <h3 className="text-sm font-bold text-gray-800 mt-1 line-clamp-2">{deal.name}</h3>
                <Rating value={deal.rating} size="sm" />

                <div className="flex flex-col mt-2">
                  <span className="text-base font-extrabold text-gray-900">{formatUGX(deal.price)}</span>
                  <span className="text-xs text-gray-400 line-through">{formatUGX(deal.originalPrice)}</span>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Sold: {deal.sold}%</span>
                    <span>{deal.total - deal.sold} left</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-accent-500 to-red-500 rounded-full transition-all"
                      style={{ width: `${deal.sold}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => addItem(deal)}
                  className="mt-3 w-full btn-accent flex items-center justify-center gap-2 py-2.5 text-sm"
                >
                  <FiShoppingCart /> Shop Deal
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            to="/deals"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-6 py-3 rounded-xl transition-all"
          >
            View All Deals <FiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FlashDeals;
