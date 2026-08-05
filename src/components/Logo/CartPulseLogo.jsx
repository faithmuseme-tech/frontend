import React from "react";

const CartPulseLogo = ({ size = 36, textClass = "text-xl font-extrabold", showText = true, dark = false }) => (
  <div className="flex items-center gap-2.5">
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cp-bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#1e3a5f" />
        </linearGradient>
        <linearGradient id="cp-pulse" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#f472b6" />
        </linearGradient>
        <linearGradient id="cp-gold" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <filter id="cp-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="cp-shadow" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0f172a" floodOpacity="0.7" />
        </filter>
        <clipPath id="cp-clip"><rect width="48" height="48" rx="14" /></clipPath>
      </defs>

      {/* Background */}
      <g filter="url(#cp-shadow)">
        <rect width="48" height="48" rx="14" fill="url(#cp-bg)" />
      </g>
      {/* Subtle top shine */}
      <rect width="48" height="22" rx="14" clipPath="url(#cp-clip)" fill="white" fillOpacity="0.05" />

      {/* ── Calligraphic C ── */}
      {/* Main arc — open on the right */}
      <path
        d="M22 11 C16 10, 9 14.5, 8.5 24 C8 33.5, 14.5 38.5, 21 38"
        stroke="url(#cp-gold)" strokeWidth="3.2" strokeLinecap="round" fill="none"
        filter="url(#cp-glow)"
      />
      {/* Top entry flourish */}
      <path
        d="M22 11 C24 9.5, 26.5 9.5, 27.5 11"
        stroke="url(#cp-gold)" strokeWidth="2" strokeLinecap="round" fill="none"
      />
      {/* Bottom exit flourish */}
      <path
        d="M21 38 C23 39.5, 26 39.8, 27.5 38.5"
        stroke="url(#cp-gold)" strokeWidth="2" strokeLinecap="round" fill="none"
      />
      {/* Terminal dots */}
      <circle cx="27.5" cy="11" r="1.3" fill="url(#cp-gold)" filter="url(#cp-glow)" />
      <circle cx="27.5" cy="38.5" r="1.3" fill="url(#cp-gold)" filter="url(#cp-glow)" />

      {/* ── Calligraphic P ── */}
      {/* Vertical stem — slightly curved */}
      <path
        d="M31 38 C30.5 30, 30.5 20, 31 11"
        stroke="url(#cp-gold)" strokeWidth="3.2" strokeLinecap="round" fill="none"
        filter="url(#cp-glow)"
      />
      {/* P bowl — elegant teardrop curve */}
      <path
        d="M31 11 C35 10.5, 40 13, 40 18.5 C40 24, 35.5 26.5, 31 26"
        stroke="url(#cp-gold)" strokeWidth="2.8" strokeLinecap="round" fill="none"
      />
      {/* Top entry flourish */}
      <path
        d="M31 11 C30 9, 29 8.5, 28 9"
        stroke="url(#cp-gold)" strokeWidth="1.8" strokeLinecap="round" fill="none"
      />

      {/* ── Pulse wave across bottom ── */}
      <path
        d="M4 40 L9 40 L11 36 L14 44 L17 38 L20 40 L44 40"
        stroke="url(#cp-pulse)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        fill="none" filter="url(#cp-glow)"
      />
    </svg>

    {showText && (
      <span className={textClass} style={{ letterSpacing: "-0.03em" }}>
        <span className={dark ? "text-white" : "text-slate-800"}>Cart</span>
        <span className={dark ? "text-sky-300" : "text-sky-500"} style={{ fontWeight: 800 }}>Pulse</span>
      </span>
    )}
  </div>
);

export default CartPulseLogo;
