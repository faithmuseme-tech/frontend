import React from "react";
import { FiTruck, FiMapPin, FiClock } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

const ShippingPage = () => (
  <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14 space-y-8">
    <div>
      <h1 className="text-3xl font-extrabold text-gray-900">Shipping Information</h1>
      <p className="mt-3 text-gray-500">Everything you need to know about delivery at CartPulse.</p>
    </div>

    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
      <div className="flex items-center gap-2 font-bold text-blue-800 mb-3"><FiTruck /> Delivery Areas & Fees</div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b border-blue-100">
            <th className="pb-2 font-semibold">Location</th>
            <th className="pb-2 font-semibold">Fee</th>
            <th className="pb-2 font-semibold">Estimated Time</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          <tr className="border-b border-blue-50"><td className="py-2">Kampala</td><td className="py-2">UGX 5,000</td><td className="py-2">Same day</td></tr>
          <tr className="border-b border-blue-50"><td className="py-2">Central Uganda (outside Kampala)</td><td className="py-2">UGX 8,000</td><td className="py-2">1–2 days</td></tr>
          <tr className="border-b border-blue-50"><td className="py-2">Eastern Uganda</td><td className="py-2">UGX 10,000</td><td className="py-2">2–3 days</td></tr>
          <tr className="border-b border-blue-50"><td className="py-2">Western Region (Fort Portal)</td><td className="py-2">UGX 10,000</td><td className="py-2">2–3 days</td></tr>
          <tr><td className="py-2">Northern Uganda</td><td className="py-2">UGX 10,000</td><td className="py-2">2–3 days</td></tr>
        </tbody>
      </table>
    </div>

    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
      <div className="flex items-center gap-2 font-bold text-amber-800 mb-2"><FiClock /> Same-Day Dispatch</div>
      <p className="text-sm text-gray-600">
        Kampala orders placed and <span className="font-semibold text-gray-800">paid before 2:00 PM</span> are eligible for same-day dispatch.
      </p>
    </div>

    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
      <div className="flex items-center gap-2 font-bold text-gray-800 mb-2"><FiMapPin /> Order Holding Policy</div>
      <p className="text-sm text-gray-600">
        Once your order is confirmed and paid, we hold your product for <span className="font-semibold text-gray-800">up to 2 weeks</span>.
        If you need more time, additional holding fees apply. If the product is not picked up within 2 weeks without communication,
        we reserve the right to return the product to stock.
      </p>
    </div>

    <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
      <div className="flex items-center gap-2 font-bold text-green-800 mb-2"><FaWhatsapp /> Confirm Your Order</div>
      <p className="text-sm text-gray-600">
        After payment, confirm with our customer care on{" "}
        <a href="https://wa.me/256786023858" className="font-semibold text-green-700 hover:underline">0786 023 858</a>
        {" "}or{" "}
        <a href="https://wa.me/256794448439" className="font-semibold text-green-700 hover:underline">0794 448 439</a>
        {" "}via WhatsApp or call.
      </p>
    </div>
  </div>
);

export default ShippingPage;
