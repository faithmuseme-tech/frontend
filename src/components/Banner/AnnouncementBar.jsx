import React from "react";
import { Link } from "react-router-dom";
import { FiTruck, FiShield, FiRefreshCw, FiHeadphones, FiShoppingBag } from "react-icons/fi";

const messages = [
  { icon: <FiTruck />, text: "Free delivery on eligible orders over UGX 200,000" },
  { icon: <FiShield />, text: "Secure payments with 256-bit SSL encryption" },
  { icon: <FiRefreshCw />, text: "Easy 30-day returns — no questions asked" },
  { icon: <FiHeadphones />, text: "24/7 PrimeAisle customer support" },
];

// Duplicate for seamless loop
const ticker = [...messages, ...messages];

const AnnouncementBar = () => (
  <div className="bg-indigo-700 text-white text-sm py-2 overflow-hidden">
    <style>{`
      @keyframes marquee {
        0%   { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .marquee-track {
        display: flex;
        width: max-content;
        animation: marquee 28s linear infinite;
      }
      .marquee-track:hover {
        animation-play-state: paused;
      }
    `}</style>

    <div className="flex items-center justify-between gap-4 px-4">
      {/* Scrolling ticker — takes all available space */}
      <div className="flex-1 overflow-hidden relative">
        {/* Left fade */}
        <div className="absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-indigo-700 to-transparent z-10 pointer-events-none" />
        {/* Right fade */}
        <div className="absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-indigo-700 to-transparent z-10 pointer-events-none" />

        <div className="marquee-track">
          {ticker.map((msg, i) => (
            <div key={i} className="flex items-center gap-2 px-10 whitespace-nowrap text-indigo-100">
              <span className="text-yellow-300 flex-shrink-0">{msg.icon}</span>
              <span>{msg.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sell with PrimeAisle CTA — desktop only */}
      <Link
        to="/trader/register"
        className="hidden md:flex items-center gap-1.5 flex-shrink-0 bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
      >
        <FiShoppingBag className="text-yellow-300" />
        Sell with PrimeAisle
      </Link>
    </div>
  </div>
);

export default AnnouncementBar;
