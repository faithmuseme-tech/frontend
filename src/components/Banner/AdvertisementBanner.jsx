import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import api from "../../services/api";
import { toAbsolute } from "../../utils/imageUrl";

const SLIDE_INTERVAL = 5000;

const GRADIENTS = [
  "from-blue-900 via-blue-800 to-indigo-900",
  "from-emerald-900 via-teal-800 to-cyan-900",
  "from-violet-900 via-purple-800 to-indigo-900",
  "from-rose-900 via-red-800 to-orange-900",
  "from-amber-900 via-yellow-800 to-orange-900",
  "from-slate-900 via-gray-800 to-zinc-900",
];

const AdvertisementBanner = () => {
  const [slides, setSlides] = useState([]);
  const [idx, setIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch categories + their top products in parallel
    api.get("/categories/").then(async (catRes) => {
      const cats = (catRes.data?.results || catRes.data || [])
        .filter((c) => c.product_count > 0)
        .slice(0, 6);

      const withProducts = await Promise.all(
        cats.map(async (cat) => {
          try {
            const res = await api.get("/products/", {
              params: { category: cat.slug, ordering: "-created_at", page_size: 3 },
            });
            const products = (res.data?.results || res.data || []).slice(0, 3);
            return { ...cat, products };
          } catch {
            return { ...cat, products: [] };
          }
        })
      );

      setSlides(withProducts.filter((s) => s.products.length > 0));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const go = useCallback((dir) => {
    setDirection(dir);
    setIdx((prev) => (prev + dir + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => go(1), SLIDE_INTERVAL);
    return () => clearInterval(t);
  }, [slides.length, go]);

  if (loading || slides.length === 0) return null;

  const slide = slides[idx];
  const gradient = GRADIENTS[idx % GRADIENTS.length];

  const textVariants = {
    enter: (d) => ({ x: d > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.45, ease: "easeOut" } },
    exit: (d) => ({ x: d > 0 ? -40 : 40, opacity: 0, transition: { duration: 0.3 } }),
  };

  const imgVariants = {
    enter: (d) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
    exit: (d) => ({ x: d > 0 ? -60 : 60, opacity: 0, transition: { duration: 0.3 } }),
  };

  return (
    <section className={`relative overflow-hidden bg-gradient-to-br ${gradient} transition-all duration-700`}>
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14 md:py-20">
        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* LEFT — text content */}
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={`text-${slide.id}`}
              custom={direction}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {/* Category badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-white/80 mb-5">
                {slide.image ? (
                  <img src={toAbsolute(slide.image)} alt={slide.name} className="w-5 h-5 rounded-full object-cover" />
                ) : (
                  <span className="text-base">{slide.icon || "📦"}</span>
                )}
                <span className="font-medium">{slide.name}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                Shop{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                  {slide.name}
                </span>
              </h2>

              <p className="mt-4 text-base text-white/70 leading-relaxed max-w-md">
                {slide.description ||
                  `Explore our full range of ${slide.name.toLowerCase()} — quality products, fast delivery, and unbeatable prices.`}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to={`/categories/${slide.slug}`}
                  className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-white/90 transition-colors"
                >
                  Shop {slide.name} <FiArrowRight />
                </Link>
                <Link
                  to="/categories"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
                >
                  All Categories
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-10 flex flex-wrap gap-8">
                <div>
                  <div className="text-2xl font-extrabold text-white">{slide.product_count}+</div>
                  <div className="text-xs text-white/60 mt-0.5">Products</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-white">{slide.products.length}</div>
                  <div className="text-xs text-white/60 mt-0.5">Top Picks</div>
                </div>
                {slide.products[0]?.avg_rating > 0 && (
                  <div>
                    <div className="text-2xl font-extrabold text-white">{slide.products[0].avg_rating}★</div>
                    <div className="text-xs text-white/60 mt-0.5">Avg Rating</div>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* RIGHT — top 3 product images */}
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={`imgs-${slide.id}`}
              custom={direction}
              variants={imgVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="grid grid-cols-3 gap-3"
            >
              {slide.products.map((p, i) => (
                <Link
                  key={p.id}
                  to={`/product/${p.slug}`}
                  className={`group relative overflow-hidden rounded-2xl bg-white/10 border border-white/20 shadow-lg hover:scale-105 transition-transform duration-300 ${
                    i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"
                  }`}
                >
                  <img
                    src={toAbsolute(p.primary_image)}
                    alt={p.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <p className="text-white text-xs font-semibold line-clamp-2">{p.name}</p>
                  </div>
                  {/* Discount badge */}
                  {p.discount > 0 && (
                    <span className="absolute top-2 left-2 bg-accent-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      -{p.discount}%
                    </span>
                  )}
                </Link>
              ))}

              {/* Fill empty slots if fewer than 3 products */}
              {slide.products.length < 3 && Array(3 - slide.products.length).fill(0).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square rounded-2xl bg-white/5 border border-white/10" />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide controls */}
        {slides.length > 1 && (
          <div className="flex items-center justify-between mt-10">
            {/* Dot indicators */}
            <div className="flex gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => { setDirection(i > idx ? 1 : -1); setIdx(i); }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === idx ? "w-8 bg-white" : "w-2 bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>

            {/* Prev / Next */}
            <div className="flex gap-2">
              <button
                onClick={() => go(-1)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-colors"
              >
                <FiChevronLeft />
              </button>
              <button
                onClick={() => go(1)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-colors"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 40L1440 40L1440 15C1200 40 960 0 720 15C480 30 240 0 0 15L0 40Z" fill="white" fillOpacity="0.04" />
        </svg>
      </div>
    </section>
  );
};

export default AdvertisementBanner;
