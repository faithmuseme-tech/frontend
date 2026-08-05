import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiCheckCircle, FiShoppingBag, FiHome } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { formatUGX } from "../../utils/currency";

const STEPS = [
  "Go to your Mobile Money menu and select Send Money.",
  "Enter the number: 0794 448 439",
  "Confirm the name shows: SABIRA SSEMATA",
  "Enter the exact order amount and complete the transaction.",
  "Confirm payment with customer care on 0786 023 858 or 0794 448 439 via WhatsApp or call.",
];

const SuccessPage = () => {
  const { state } = useLocation();
  const total       = state?.total       || null;
  const senderPhone = state?.senderPhone || "";

  const waText = encodeURIComponent(
    `Hi, I just placed an order on CartPulse${total ? ` for ${formatUGX(total)}` : ""}` +
    `${senderPhone ? ` and sent payment from ${senderPhone}` : ""}. Please confirm.`
  );

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md space-y-4">

        {/* Success banner */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <FiCheckCircle className="text-green-500 text-6xl mx-auto mb-3" />
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Order Placed!</h1>
          <p className="text-gray-500 text-sm">
            Your order is received. Follow the steps below to complete your payment.
          </p>
        </div>

        {/* Payment instructions */}
        <div className="bg-yellow-50 border border-yellow-300 rounded-2xl p-5 space-y-4">
          <p className="font-extrabold text-gray-900 text-base">📲 Mobile Money Payment</p>

          {total && (
            <div className="bg-white rounded-xl px-4 py-3 border border-yellow-200 flex items-center justify-between">
              <span className="text-sm text-gray-500">Amount to send</span>
              <span className="text-lg font-extrabold text-primary-600">{formatUGX(total)}</span>
            </div>
          )}

          {/* Step-by-step */}
          <ol className="space-y-2.5">
            {STEPS.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-yellow-400 text-gray-900 text-xs font-extrabold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-700 leading-snug">{step}</p>
              </li>
            ))}
          </ol>

          {/* Payment number */}
          <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-yellow-200">
            <svg viewBox="0 0 36 36" className="w-9 h-9 flex-shrink-0" fill="none">
              <circle cx="18" cy="18" r="18" fill="#FFCC00"/>
              <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1a1a1a">MTN</text>
            </svg>
            <div>
              <p className="text-sm font-extrabold text-gray-900">0794 448 439</p>
              <p className="text-xs text-gray-500">Mobile Money · SABIRA SSEMATA</p>
            </div>
          </div>

          {senderPhone && (
            <div className="bg-white rounded-xl px-4 py-3 border border-yellow-200 text-sm">
              <span className="text-gray-500">Your payment number: </span>
              <span className="font-extrabold text-gray-900">{senderPhone}</span>
            </div>
          )}

          <a
            href={`https://wa.me/256794448439?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-5 py-3.5 rounded-xl transition-colors w-full"
          >
            <FaWhatsapp size={20} /> Confirm Payment on WhatsApp
          </a>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            to="/orders"
            className="flex-1 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-4 py-3 rounded-xl transition-all text-sm"
          >
            <FiShoppingBag size={15} /> My Orders
          </Link>
          <Link
            to="/"
            className="flex-1 flex items-center justify-center gap-2 border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold px-4 py-3 rounded-xl transition-all text-sm"
          >
            <FiHome size={15} /> Go Home
          </Link>
        </div>

        <p className="text-center text-xs text-gray-400">
          Questions? Call or WhatsApp{" "}
          <a href="tel:+256794448439" className="font-semibold text-gray-600 hover:underline">0794 448 439</a>
          {" "}or{" "}
          <a href="tel:+256786023858" className="font-semibold text-gray-600 hover:underline">0786 023 858</a>
        </p>
      </div>
    </div>
  );
};

export default SuccessPage;
