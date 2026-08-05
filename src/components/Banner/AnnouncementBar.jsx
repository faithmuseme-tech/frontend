import React from "react";
import { Link } from "react-router-dom";
import { FiTruck, FiRefreshCw, FiHeadphones, FiShoppingBag, FiMapPin, FiAlertTriangle } from "react-icons/fi";
import { useSiteSettings } from "../../context/SiteSettingsContext";

const messages = [
  { icon: <FiTruck />,         text: "Fast delivery to your nearest pick-up station across Uganda" },
  { icon: <FiAlertTriangle />, text: "We will NEVER ask for your Mobile Money PIN, card PIN, or account password" },
  { icon: <FiMapPin />,        text: "Village or remote area? Additional delivery fees apply — CartPulse does not cover those costs" },
  { icon: <FiRefreshCw />,     text: "Easy returns for faulty products — report within the return window" },
  { icon: <FiHeadphones />,    text: "Customer support: 0794 448 439 or 0786 023 858 — WhatsApp or call" },
  { icon: <FiShoppingBag />,   text: "Pay via Mobile Money to 0794 448 439 (SABIRA SSEMATA) only" },
];

const ticker = [...messages, ...messages];

const AnnouncementBar = () => {
  const { sellerOpen } = useSiteSettings();

  return (
  <div className="bg-indigo-700 text-white text-sm py-2 overflow-hidden">
    <style>{`
      @keyframes marquee {
        0%   { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .marquee-track {
        display: flex;
        width: max-content;
        animation: marquee 40s linear infinite;
      }
      .marquee-track:hover {
        animation-play-state: paused;
      }
    `}</style>

    <div className="flex items-center justify-between gap-4 px-4">
      <div className="flex-1 overflow-hidden relative">
        <div className="absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-indigo-700 to-transparent z-10 pointer-events-none" />
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

      {sellerOpen && (
        <Link
          to="/trader/register"
          className="hidden md:flex items-center gap-1.5 flex-shrink-0 bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
        >
          <FiShoppingBag className="text-yellow-300" />
          Sell with CartPulse
        </Link>
      )}
    </div>
  </div>
  );
};

export default AnnouncementBar;
