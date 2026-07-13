import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiZap } from "react-icons/fi";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-blue-900 min-h-[88vh] flex items-center">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm text-blue-200 mb-6"
            >
              <FiZap className="text-accent-400" />
              <span>New arrivals every week — Shop the latest tech</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight"
            >
              Power Your World
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-yellow-300">
                with the Latest
              </span>
              Electronics
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg text-blue-200 leading-relaxed max-w-lg"
            >
              Discover smartphones, laptops, gaming gear, smart home devices, accessories, and much more — all at unbeatable prices with fast delivery.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link
                to="/shop"
                className="btn-accent flex items-center gap-2 text-base"
              >
                Shop Now <FiArrowRight />
              </Link>
              <Link
                to="/deals"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200"
              >
                Explore Deals
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
                { value: "50K+", label: "Products" },
                { value: "200K+", label: "Happy Customers" },
                { value: "100+", label: "Top Brands" },
                { value: "4.9★", label: "Average Rating" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-extrabold text-white">{stat.value}</div>
                  <div className="text-sm text-blue-300">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden lg:flex justify-center items-center"
          >
            <div className="relative w-full max-w-lg">
              {/* Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/30 to-blue-400/30 rounded-3xl blur-2xl scale-110" />
              <img
                src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=700&h=600&fit=crop"
                alt="Latest electronics collection"
                className="relative rounded-3xl shadow-2xl w-full object-cover"
                loading="eager"
              />
              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute -top-4 -left-4 glass rounded-2xl px-4 py-3 shadow-xl"
              >
                <div className="text-white text-xs font-semibold">🔥 Flash Sale</div>
                <div className="text-accent-400 text-lg font-extrabold">Up to 40% OFF</div>
              </motion.div>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                className="absolute -bottom-4 -right-4 glass rounded-2xl px-4 py-3 shadow-xl"
              >
                <div className="text-white text-xs font-semibold">✅ Free Delivery</div>
                <div className="text-blue-200 text-sm">On orders over $50</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="white" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
