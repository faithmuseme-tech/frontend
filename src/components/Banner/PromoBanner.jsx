import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

const promos = [
  {
    title: "Gaming Setup",
    subtitle: "Level up your game",
    description: "Keyboards, mice, headsets & more",
    cta: "Shop Gaming",
    to: "/categories/gaming",
    bg: "from-purple-600 to-indigo-700",
    emoji: "🎮",
    image: "https://images.unsplash.com/photo-1593640408182-31c228b2b7e8?w=500&h=300&fit=crop",
  },
  {
    title: "Latest Smartphones",
    subtitle: "Stay connected",
    description: "iPhone, Samsung, Google Pixel & more",
    cta: "Shop Phones",
    to: "/categories/smartphones",
    bg: "from-primary-600 to-blue-700",
    emoji: "📱",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=300&fit=crop",
  },
  {
    title: "Student Laptops",
    subtitle: "Back to school deals",
    description: "Powerful laptops starting at $399",
    cta: "Shop Laptops",
    to: "/categories/laptops",
    bg: "from-teal-600 to-cyan-700",
    emoji: "💻",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=300&fit=crop",
  },
  {
    title: "Smart Home",
    subtitle: "Automate your life",
    description: "Speakers, cameras, thermostats & more",
    cta: "Shop Smart Home",
    to: "/categories/smart-home",
    bg: "from-accent-500 to-red-600",
    emoji: "🏠",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop",
  },
];

const PromoBanner = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Handpicked collections for every need</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {promos.map((promo, i) => (
            <motion.div
              key={promo.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Link
                to={promo.to}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${promo.bg} p-6 flex flex-col justify-between min-h-[200px] group shadow-lg hover:shadow-xl transition-shadow`}
              >
                <div className="absolute inset-0 opacity-20">
                  <img src={promo.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="relative">
                  <div className="text-4xl mb-3">{promo.emoji}</div>
                  <p className="text-white/80 text-xs font-medium uppercase tracking-wider">{promo.subtitle}</p>
                  <h3 className="text-white text-xl font-extrabold mt-1">{promo.title}</h3>
                  <p className="text-white/70 text-sm mt-1">{promo.description}</p>
                </div>
                <div className="relative mt-4">
                  <span className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors group-hover:gap-3">
                    {promo.cta} <FiArrowRight />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
