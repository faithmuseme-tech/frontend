import React from "react";
import { Link } from "react-router-dom";
import { FiPhone, FiDollarSign, FiInfo, FiArrowRight } from "react-icons/fi";

const METHODS = [
  {
    id: "mtn",
    label: "MTN Mobile Money",
    number: "0794 448 439",
    name: "SABIRA SSEMATA",
    hint: "Dial *165# → Send Money → Enter number → Enter amount → Confirm.",
    bg: "bg-yellow-50 border-yellow-300",
    badge: "bg-yellow-400 text-white",
    icon: (
      <svg viewBox="0 0 44 44" className="w-10 h-10 flex-shrink-0" fill="none">
        <circle cx="22" cy="22" r="22" fill="#FFCC00" />
        <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1a1a1a">MTN</text>
      </svg>
    ),
  },
  {
    id: "airtel",
    label: "Airtel Money",
    number: "0752 448 439",
    name: "SABIRA SSEMATA",
    hint: "Dial *185# → Send Money → Enter number → Enter amount → Confirm.",
    bg: "bg-red-50 border-red-300",
    badge: "bg-red-500 text-white",
    icon: (
      <svg viewBox="0 0 44 44" className="w-10 h-10 flex-shrink-0" fill="none">
        <circle cx="22" cy="22" r="22" fill="#E40000" />
        <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white">AIRTEL</text>
      </svg>
    ),
  },
  {
    id: "bank",
    label: "Bank Transfer",
    number: "9030012345678",
    name: "SABIRA SSEMATA",
    hint: "Transfer to our Stanbic Bank account, then send proof of payment via WhatsApp to 0794 448 439.",
    extra: "Stanbic Bank Uganda",
    bg: "bg-blue-50 border-blue-300",
    badge: "bg-blue-600 text-white",
    icon: (
      <svg viewBox="0 0 44 44" className="w-10 h-10 flex-shrink-0" fill="none">
        <circle cx="22" cy="22" r="22" fill="#0033A0" />
        <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white">BANK</text>
      </svg>
    ),
  },
  {
    id: "cod",
    label: "Cash on Delivery",
    number: null,
    name: null,
    hint: "Pay with cash when your order arrives at your door or when you pick it up at our Fort Portal station. Please have the exact amount ready.",
    bg: "bg-green-50 border-green-300",
    badge: "bg-green-600 text-white",
    icon: (
      <svg viewBox="0 0 44 44" className="w-10 h-10 flex-shrink-0" fill="none">
        <circle cx="22" cy="22" r="22" fill="#16a34a" />
        <text x="50%" y="58%" dominantBaseline="middle" textAnchor="middle" fontSize="20" fill="white">💵</text>
      </svg>
    ),
  },
];

const PaymentMethodPage = () => (
  <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">

    {/* Header */}
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
        <FiDollarSign size={20} />
      </div>
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Payment Methods</h1>
        <p className="text-sm text-gray-500">We accept the following payment options.</p>
      </div>
    </div>

    {/* Method cards */}
    <div className="space-y-4">
      {METHODS.map((m) => (
        <div key={m.id} className={`rounded-2xl border p-5 ${m.bg}`}>
          <div className="flex items-start gap-4">
            {m.icon}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-base font-extrabold text-gray-900">{m.label}</p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${m.badge}`}>Accepted</span>
              </div>

              {m.number && (
                <div className="mt-2 flex items-center gap-2">
                  <FiPhone className="text-gray-500 flex-shrink-0" size={14} />
                  <span className="text-lg font-bold text-gray-900 tracking-wide">{m.number}</span>
                </div>
              )}
              {m.name && (
                <p className="text-sm text-gray-600 mt-0.5 font-semibold">{m.name}{m.extra ? ` · ${m.extra}` : ""}</p>
              )}

              <div className="mt-3 flex items-start gap-2 bg-white/60 rounded-xl px-3 py-2.5">
                <FiInfo className="text-gray-400 flex-shrink-0 mt-0.5" size={13} />
                <p className="text-xs text-gray-600">{m.hint}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* How to pay link */}
    <Link
      to="/how-to-pay"
      className="flex items-center justify-between bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-4 rounded-2xl transition-colors"
    >
      <span>Step-by-step payment guide</span>
      <FiArrowRight />
    </Link>

    {/* Safety note */}
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-xs text-gray-500 space-y-1">
      <p className="font-bold text-gray-700">🔒 Safety reminder</p>
      <p>Only send money to the numbers listed above. CartPulse will <span className="font-semibold text-red-600">never</span> ask for your Mobile Money PIN, card details, or OTP.</p>
    </div>
  </div>
);

export default PaymentMethodPage;
