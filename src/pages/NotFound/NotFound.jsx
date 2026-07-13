import React from "react";
import { Link } from "react-router-dom";
import { FiZap, FiArrowLeft } from "react-icons/fi";

const NotFound = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
    <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-blue-400 rounded-3xl flex items-center justify-center mb-6 shadow-xl">
      <FiZap className="text-white text-4xl" />
    </div>
    <h1 className="text-7xl font-extrabold text-gray-900">404</h1>
    <h2 className="text-2xl font-bold text-gray-700 mt-2">Page Not Found</h2>
    <p className="text-gray-500 mt-3 max-w-md">
      Looks like this page got lost in the circuit. Let's get you back on track.
    </p>
    <Link to="/" className="btn-primary mt-8 flex items-center gap-2">
      <FiArrowLeft /> Back to Home
    </Link>
  </div>
);

export default NotFound;
