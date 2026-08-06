import React from "react";
import { Link } from "react-router-dom";
import { FiPhone, FiDollarSign, FiInfo, FiArrowRight } from "react-icons/fi";

const MOMO_NUMBER = "+256 794 448 439";
const MOMO_NAME = "SABIRA SSEMATA";

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

    {/* MTN MoMo card */}
    <div className="rounded-2xl border bg-yellow-50 border-yellow-300 p-5">
      <div className="flex items-start gap-4">
        <img src="https://res.cloudinary.com/d5qqtsou/image/upload/v1785425025/MTN_MoMo_irikay.jpg" alt="MTN MoMo" className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-base font-extrabold text-gray-900">MTN Mobile Money</p>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-yellow-400 text-white">Accepted</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <FiPhone className="text-gray-500 flex-shrink-0" size={14} />
            <span className="text-lg font-bold text-gray-900 tracking-wide">{MOMO_NUMBER}</span>
          </div>
          <p className="text-sm text-gray-600 mt-0.5 font-semibold">{MOMO_NAME}</p>
          <div className="mt-3 flex items-start gap-2 bg-white/60 rounded-xl px-3 py-2.5">
            <FiInfo className="text-gray-400 flex-shrink-0 mt-0.5" size={13} />
            <p className="text-xs text-gray-600">Dial <strong>*165#</strong> → Send Money → Enter number → Enter amount → On the <strong>Reference/Reason</strong> field, enter <strong>your full name</strong> → Confirm.</p>
          </div>
        </div>
      </div>
    </div>

    {/* Airtel users note */}
    <div className="rounded-2xl border bg-red-50 border-red-200 p-5">
      <div className="flex items-start gap-4">
        <img src="https://res.cloudinary.com/d5qqtsou/image/upload/v1785425176/Airtel_Money_fgicyp.png" alt="Airtel Money" className="w-10 h-10 rounded-xl object-contain flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-base font-extrabold text-gray-900">Airtel Money Users</p>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-500 text-white">Supported</span>
          </div>
          <div className="mt-3 flex items-start gap-2 bg-white/60 rounded-xl px-3 py-2.5">
            <FiInfo className="text-gray-400 flex-shrink-0 mt-0.5" size={13} />
            <p className="text-xs text-gray-600">
              You can send money directly to our MTN number <strong>{MOMO_NUMBER}</strong> from your Airtel account.
              Dial <strong>*185#</strong> → Send Money → Enter the MTN number → Enter amount → On the <strong>Reference/Reason</strong> field, enter <strong>your full name</strong> → Confirm.
            </p>
          </div>
        </div>
      </div>
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
