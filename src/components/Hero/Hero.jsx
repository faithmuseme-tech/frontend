import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiCpu, FiChevronLeft, FiChevronRight, FiShoppingCart, FiStar } from "react-icons/fi";
import { formatUGX } from "../../utils/currency";
import api from "../../services/api";
import { toAbsolute } from "../../utils/imageUrl";

const SLIDE_INTERVAL = 3500;

const Hero = () => {
  const [slides, setSlides] = useState([]);
  const [idx, setIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    api.get("/products/best-sellers/")
      .then((r) => {
        const list = (r.data?.results || r.data || []).slice(0, 3);
        setSlides(list.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: parseFloat(p.price),
          original_price: p.original_price ? parseFloat(p.original_price) : null,
          discount: p.discount || 0,
          image: toAbsolute(p.primary_image),
          rating: p.avg_rating || 0,
          reviews: p.review_count || 0,
          badge: p.badge || "Best Seller",
          category: p.category_name || "",
        })));
      })
      .catch(() => {});
  }, []);

  const go = useCallback((dir, manual = false) => {
    setDirection(dir);
    setIdx((prev) => (prev + dir + slides.length) % slides.length);
    if (manual) setResetKey((k) => k + 1);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => go(1), SLIDE_INTERVAL);
    return () => clearInterval(t);
  }, [slides.length, go, resetKey]);

  const variants = {
    enter: (d) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <section className="relative overflow-hidden bg-white min-h-[88vh] flex items-center">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-100/60 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-50/80 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-primary-50 border border-primary-200 rounded-full px-4 py-2 text-sm text-primary-700 mb-6"
            >
              <FiCpu className="text-accent-400" />
              <span>New IoT components every week — Build your next project</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight"
            >
              Build Smarter
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-yellow-300">
                University IoT
              </span>
              Projects
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg text-gray-600 leading-relaxed max-w-lg"
            >
              Everything students need — Arduino, Raspberry Pi, sensors, modules, and components. Turn your ideas into real IoT projects with fast delivery right to campus.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link to="/shop" className="btn-accent flex items-center gap-2 text-base">
                Shop Components <FiArrowRight />
              </Link>
              <Link
                to="/categories"
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-800 font-semibold px-6 py-3 rounded-xl transition-all duration-200"
              >
                Browse Projects
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 flex flex-wrap gap-8"
            >
              {[
                { value: "500+", label: "IoT Components" },
                { value: "10K+", label: "Student Builders" },
                { value: "50+", label: "Project Kits" },
                { value: "4.9★", label: "Average Rating" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-extrabold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — product ad slider */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden lg:flex justify-center items-center"
          >
            {slides.length === 0 ? (
              /* fallback static image while loading */
              <div className="relative w-full max-w-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/30 to-blue-400/30 rounded-3xl blur-2xl scale-110" />
                <img
                  src="https://res.cloudinary.com/d5qqtsou/image/upload/v1783935397/arduino_mega_hfl9bh.webp"
                  alt="Arduino Mega — IoT project component"
                  className="relative rounded-3xl shadow-2xl w-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
            ) : (
              <div className="relative w-full max-w-lg select-none">
                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/30 to-blue-400/30 rounded-3xl blur-2xl scale-110 pointer-events-none" />

                {/* Card */}
                <div className="relative bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-2xl">

                  {/* Ad label */}
                  <div className="absolute top-4 left-4 z-10 bg-accent-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                    🔥 Most Popular
                  </div>

                  {/* Slide counter */}
                  <div className="absolute top-4 right-4 z-10 bg-black/30 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    {idx + 1} / {slides.length}
                  </div>

                  {/* Image */}
                  <div className="relative h-64 overflow-hidden bg-white">
                    <AnimatePresence custom={direction} mode="wait">
                      <motion.img
                        key={slides[idx].id}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        src={slides[idx].image}
                        alt={slides[idx].name}
                        loading={idx === 0 ? "eager" : "lazy"}
                        fetchPriority={idx === 0 ? "high" : "auto"}
                        className="absolute inset-0 w-full h-full object-contain p-6"
                      />
                    </AnimatePresence>
                  </div>

                  {/* Info */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`info-${slides[idx].id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="px-6 py-5"
                    >
                      {slides[idx].badge && (
                        <span className="inline-block text-[10px] font-bold text-accent-400 uppercase tracking-widest mb-1">
                          {slides[idx].badge}
                        </span>
                      )}
                      <p className="text-gray-900 font-bold text-lg leading-tight line-clamp-2">
                        {slides[idx].name}
                      </p>

                      {/* Rating */}
                      {slides[idx].rating > 0 && (
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <FiStar className="text-yellow-400 text-xs fill-yellow-400" />
                          <span className="text-yellow-600 text-xs font-semibold">{slides[idx].rating}</span>
                          <span className="text-gray-500 text-xs">({slides[idx].reviews} reviews)</span>
                        </div>
                      )}

                      {/* Price + CTA */}
                      <div className="flex items-center justify-between mt-4">
                        <div>
                          <span className="text-gray-900 font-extrabold text-xl">{formatUGX(slides[idx].price)}</span>
                          {slides[idx].original_price && (
                            <span className="ml-2 text-gray-400 text-sm line-through">{formatUGX(slides[idx].original_price)}</span>
                          )}
                          {slides[idx].discount > 0 && (
                            <span className="ml-2 bg-green-500/20 text-green-300 text-xs font-bold px-2 py-0.5 rounded-full">
                              -{slides[idx].discount}%
                            </span>
                          )}
                        </div>
                        <Link
                          to={`/product/${slides[idx].slug}`}
                          className="flex items-center gap-1.5 bg-accent-500 hover:bg-accent-600 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
                        >
                          <FiShoppingCart className="text-sm" /> Buy Now
                        </Link>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Prev / Next */}
                  <button
                    onClick={() => go(-1, true)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full flex items-center justify-center transition-colors z-10"
                  >
                    <FiChevronLeft />
                  </button>
                  <button
                    onClick={() => go(1, true)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full flex items-center justify-center transition-colors z-10"
                  >
                    <FiChevronRight />
                  </button>
                </div>

                {/* Dot indicators */}
                <div className="flex justify-center gap-2 mt-4">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setDirection(i > idx ? 1 : -1); setIdx(i); setResetKey((k) => k + 1); }}
                      className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? "w-6 bg-primary-600" : "w-1.5 bg-gray-300"}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="#f9fafb" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
