import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiTrendingDown } from "react-icons/fi";
import { formatUGX } from "../../utils/currency";
import api from "../../services/api";
import { toAbsolute } from "../../utils/imageUrl";

// Normalize name for grouping: lowercase, strip extra spaces
const normalizeName = (name) => name?.trim().toLowerCase().replace(/\s+/g, " ") || "";

const ACCENT = [
  { border: "border-blue-100",   tag: "bg-blue-100 text-blue-700",   saving: "text-blue-600",   cta: "bg-blue-600 hover:bg-blue-700" },
  { border: "border-teal-100",   tag: "bg-teal-100 text-teal-700",   saving: "text-teal-600",   cta: "bg-teal-600 hover:bg-teal-700" },
  { border: "border-purple-100", tag: "bg-purple-100 text-purple-700", saving: "text-purple-600", cta: "bg-purple-600 hover:bg-purple-700" },
  { border: "border-orange-100", tag: "bg-orange-100 text-orange-700", saving: "text-orange-600", cta: "bg-orange-500 hover:bg-orange-600" },
];

const PromoBanner = () => {
  const navigate = useNavigate();
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    api.get("/products/", { params: { ordering: "price", page_size: 200 } })
      .then((r) => {
        const products = (r.data?.results || r.data || []).filter(
          (p) => p.price && parseFloat(p.price) > 0 && p.slug
        );

        // Group by normalized product name
        const byName = {};
        products.forEach((p) => {
          const key = normalizeName(p.name);
          if (!byName[key]) byName[key] = [];
          byName[key].push(p);
        });

        // Only groups with 2+ listings (same product, different traders)
        const result = Object.values(byName)
          .filter((group) => group.length >= 2)
          .map((group) => {
            const sorted = [...group].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            const cheapest  = sorted[0];
            const mostExp   = sorted[sorted.length - 1];
            const highPrice = parseFloat(mostExp.price);
            const lowPrice  = parseFloat(cheapest.price);
            const saving    = highPrice - lowPrice;
            const pct       = Math.round((saving / highPrice) * 100);
            return { cheapest, highPrice, saving, pct, totalListings: group.length };
          })
          .filter(({ pct }) => pct >= 5)        // at least 5% difference
          .sort((a, b) => b.pct - a.pct)        // biggest saving first
          .slice(0, 4);

        setDeals(result);
      })
      .catch(() => {});
  }, []);

  if (!deals.length) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full mb-3">
            <FiTrendingDown /> Cheapest Listings Right Now
          </div>
          <h2 className="section-title">Best Value on the Market</h2>
          <p className="section-subtitle">
            Same product, multiple sellers — we found you the lowest price
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {deals.map(({ cheapest, highPrice, saving, pct, totalListings }, i) => {
            const colors = ACCENT[i % ACCENT.length];
            const image  = toAbsolute(cheapest.primary_image);

            return (
              <motion.div
                key={cheapest.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                onClick={() => navigate(`/product/${cheapest.slug}`)}
                className={`cursor-pointer flex flex-col rounded-2xl border ${colors.border} shadow-sm hover:shadow-md transition-all overflow-hidden`}
              >
                {/* Product image */}
                <div className="relative h-44 overflow-hidden bg-gray-100">
                  {image ? (
                    <img
                      src={image}
                      alt={cheapest.name}
                      loading="lazy"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-5xl">📦</div>
                  )}
                  <span className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full ${colors.tag}`}>
                    {pct}% cheaper
                  </span>
                  <span className="absolute top-3 right-3 text-[11px] font-semibold bg-black/50 text-white px-2 py-1 rounded-full">
                    {totalListings} sellers
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-3 p-5 flex-1">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      {cheapest.category_name || ""}
                    </p>
                    <h3 className="text-gray-900 text-base font-extrabold leading-tight mt-0.5 line-clamp-2">
                      {cheapest.name}
                    </h3>
                  </div>

                  {/* Price comparison */}
                  <div className="bg-gray-50 rounded-xl p-3 space-y-1.5 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-medium">Highest listing</span>
                      <span className="text-gray-400 line-through">{formatUGX(highPrice)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-800">Lowest listing</span>
                      <span className="font-extrabold text-gray-900">{formatUGX(parseFloat(cheapest.price))}</span>
                    </div>
                    <div className={`flex justify-between items-center font-bold ${colors.saving}`}>
                      <span>You save ({pct}%)</span>
                      <span>{formatUGX(Math.round(saving))}</span>
                    </div>
                  </div>

                  <button
                    className={`mt-auto inline-flex items-center justify-center gap-2 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors ${colors.cta}`}
                  >
                    View Deal <FiArrowRight />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
