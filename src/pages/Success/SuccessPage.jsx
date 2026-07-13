import React from "react";
import { Link } from "react-router-dom";
import { FiCheckCircle, FiShoppingBag, FiHome } from "react-icons/fi";

const SuccessPage = () => (
  <div className="min-h-[70vh] flex items-center justify-center px-4">
    <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
      <FiCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
      <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Order Placed!</h1>
      <p className="text-gray-500 text-sm mb-8">
        Thank you for your order. We'll send you a confirmation shortly.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/shop"
          className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-3 rounded-xl transition-all text-sm"
        >
          <FiShoppingBag /> Continue Shopping
        </Link>
        <Link
          to="/"
          className="flex items-center justify-center gap-2 border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-all text-sm"
        >
          <FiHome /> Go Home
        </Link>
      </div>
    </div>
  </div>
);

export default SuccessPage;
