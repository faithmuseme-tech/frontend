import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiArrowRight, FiCheck } from "react-icons/fi";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setSubmitted(true);
    setEmail("");
  };

  return (
    <section className="py-16 bg-gradient-to-r from-primary-600 to-blue-700 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiMail className="text-white text-2xl" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">Stay in the Loop</h2>
          <p className="text-blue-200 mt-2 text-sm md:text-base">
            Subscribe to get exclusive deals, new arrivals, and tech news delivered to your inbox.
          </p>

          {submitted ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-8 flex items-center justify-center gap-3 bg-white/20 rounded-2xl px-6 py-4"
            >
              <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                <FiCheck className="text-white font-bold" />
              </div>
              <p className="text-white font-semibold">You're subscribed! Welcome to the Electrons family 🎉</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="Enter your email address"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-white/50 text-sm"
                  aria-label="Email address"
                />
              </div>
              <button
                type="submit"
                className="btn-accent flex items-center justify-center gap-2 whitespace-nowrap"
              >
                Subscribe <FiArrowRight />
              </button>
            </form>
          )}

          {error && <p className="text-red-300 text-sm mt-2">{error}</p>}

          <p className="text-blue-300 text-xs mt-4">
            No spam, ever. Unsubscribe at any time. We respect your privacy.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
