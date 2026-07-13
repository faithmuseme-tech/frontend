import React from "react";

const PrimeAisleLogo = ({ size = 36, textClass = "text-xl font-extrabold", showText = true, dark = false }) => (
  <div className="flex items-center gap-2.5">
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pa-bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="pa-gold" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="pa-white-fade" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0.7" />
        </linearGradient>
        <filter id="pa-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="pa-outer-shadow" x="-15%" y="-15%" width="130%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#4f46e5" floodOpacity="0.45" />
        </filter>
        <clipPath id="pa-clip">
          <rect width="48" height="48" rx="13" />
        </clipPath>
      </defs>

      {/* Outer card with shadow */}
      <g filter="url(#pa-outer-shadow)">
        <rect width="48" height="48" rx="13" fill="url(#pa-bg)" />
      </g>

      {/* Subtle inner top shine */}
      <rect width="48" height="24" rx="13" clipPath="url(#pa-clip)" fill="white" fillOpacity="0.08" />

      {/* ── P mark ── */}
      {/* P vertical stem */}
      <rect x="9" y="12" width="4" height="24" rx="2" fill="url(#pa-white-fade)" />
      {/* P bowl — thick rounded arc */}
      <path
        d="M13 12 h5 a6.5 6.5 0 0 1 0 13 H13"
        stroke="url(#pa-white-fade)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* ── Divider dot (prime mark) ── */}
      <circle cx="24" cy="24" r="2.2" fill="url(#pa-gold)" filter="url(#pa-glow)" />

      {/* ── A mark ── */}
      {/* A — drawn as two angled strokes meeting at apex */}
      <path
        d="M28 36 L34.5 12 L41 36"
        stroke="url(#pa-white-fade)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* A crossbar */}
      <line
        x1="29.8" y1="27"
        x2="39.2" y2="27"
        stroke="url(#pa-white-fade)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>

    {showText && (
      <span className={textClass} style={{ letterSpacing: "-0.03em" }}>
        <span className={dark ? "text-white" : "text-indigo-600"}>Prime</span>
        <span
          className={dark ? "text-cyan-300" : "text-cyan-500"}
          style={{ fontWeight: 800 }}
        >
          Aisle
        </span>
      </span>
    )}
  </div>
);

export default PrimeAisleLogo;
