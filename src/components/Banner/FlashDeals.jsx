import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiShoppingCart } from "react-icons/fi";
import Rating from "../Rating/Rating";
import { formatUGX } from "../../utils/currency";
import { useCart } from "../../context/CartContext";
import api from "../../services/api";
import { toAbsolute } from "../../utils/imageUrl";

const getTimeLeft = (endsAt) => {
  const diff = new Date(endsAt) - Date.now();
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  };
};

const Pad = ({ n, label }) => (
  <div className="flex flex-col items-center">
    <div className="bg-primary-900 text-white rounded-lg w-11 h-11 flex items-center justify-center font-extrabold text-lg tabular-nums">
      {String(n).padStart(2, "0")}
    </div>
    <span className="text-blue-400 text-[10px] mt-0.5 font-medium">{label}</span>
  </div>
);

const Sep = () => <span className="text-white font-bold text-xl mb-4">:</span>;

const DealCard = ({ deal, index }) => {
  const { addItem } = useCart();
  const [time, setTime] = useState(getTimeLeft(deal.ends_at));
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(getTimeLeft(deal.ends_at)), 1000);
    return () => clearInterval(t);
  }, [deal.ends_at]);

  const p = deal.product_detail;
  const image = toAbsolute(p?.primary_image);
  const brand = p?.brand_name || p?.brand?.name || "";
  const slug = p?.slug || p?.id;

  const cartProduct = {
    id: p?.id,
    name: p?.name,
    slug: p?.slug,
    brand,
    price: parseFloat(deal.deal_price),
    originalPrice: parseFloat(p?.price),
    image,
    inStock: deal.remaining > 0,
    deliveryCharge: parseFloat(p?.delivery_charge || 0),
  };

  const handleAdd = (e) => {
    e.preventDefault();
    addItem(cartProduct);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg flex flex-col"
    >
      <Link to={`/product/${slug}`} className="relative aspect-square bg-gray-50 overflow-hidden block">
        <img
          src={image}
          alt={p?.name}
          loading="lazy"
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
        {deal.discount_percent > 0 && (
          <span className="absolute top-3 left-3 bg-accent-500 text-white text-xs font-extrabold px-2.5 py-1 rounded-full">
            -{deal.discount_percent}%
          </span>
        )}
        {/* Per-card countdown */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
          <div className="flex items-end gap-1 justify-center">
            <Pad n={time.d} label="D" />
            <Sep />
            <Pad n={time.h} label="H" />
            <Sep />
            <Pad n={time.m} label="M" />
            <Sep />
            <Pad n={time.s} label="S" />
          </div>
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-primary-600 font-semibold uppercase">{brand}</p>
        <h3 className="text-sm font-bold text-gray-800 mt-1 line-clamp-2">{p?.name}</h3>
        <Rating value={p?.avg_rating || 0} size="sm" />

        <div className="flex flex-col mt-2">
          <span className="text-base font-extrabold text-gray-900">{formatUGX(deal.deal_price)}</span>
          <span className="text-xs text-gray-400 line-through">{formatUGX(p?.price)}</span>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Sold: {deal.sold_percent}%</span>
            <span>{deal.remaining} left</span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent-500 to-red-500 rounded-full transition-all"
              style={{ width: `${deal.sold_percent}%` }}
            />
          </div>
        </div>

        <button
          onClick={handleAdd}
          disabled={deal.remaining === 0}
          className={`mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            deal.remaining === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : added
              ? "bg-green-500 text-white"
              : "bg-accent-500 hover:bg-accent-600 text-white active:scale-95"
          }`}
        >
          <FiShoppingCart />
          {deal.remaining === 0 ? "Sold Out" : added ? "Added!" : "Shop Deal"}
        </button>
      </div>
    </motion.div>
  );
};

const FlashDeals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/flash-deals/")
      .then((res) => setDeals(res.data?.results || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && deals.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-br from-primary-900 via-primary-800 to-blue-900 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-xl">🔥</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">Flash Deals</h2>
            </div>
            <p className="text-blue-300 text-sm">Limited-time offers — grab them before they're gone!</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {loading
            ? Array(4).fill(0).map((_, i) => (
                <div key={i} className="bg-white/10 rounded-2xl aspect-[3/4] animate-pulse" />
              ))
            : deals.map((deal, i) => <DealCard key={deal.id} deal={deal} index={i} />)
          }
        </div>

        <div className="text-center mt-8">
          <Link
            to="/shop"
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
