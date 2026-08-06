import React from "react";
import { Link } from "react-router-dom";
import { FiRefreshCw, FiAlertTriangle, FiClock, FiArrowRight } from "react-icons/fi";

const ReturnsPage = () => (
  <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14 space-y-8">
    <div>
      <h1 className="text-3xl font-extrabold text-gray-900">Returns & Refunds</h1>
      <p className="mt-3 text-gray-500">Our return and refund policy explained clearly.</p>
    </div>

    <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
      <div className="flex items-center gap-2 font-bold text-green-800 mb-2"><FiRefreshCw /> When We Accept Returns</div>
      <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
        <li>The product has a fault or defect that was present at the time of delivery.</li>
        <li>The product has <span className="font-semibold text-gray-800">not been used</span> by the customer.</li>
        <li>The product has <span className="font-semibold text-gray-800">no physical damage</span> caused by the customer.</li>
      </ul>
    </div>

    <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
      <div className="flex items-center gap-2 font-bold text-red-700 mb-2"><FiAlertTriangle /> When We Do NOT Accept Returns</div>
      <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
        <li>The product was damaged due to customer carelessness (e.g. poor wiring, physical damage, liquid damage).</li>
        <li>The product was used and the fault occurred during normal use due to mishandling.</li>
        <li>The product shows signs of tampering or unauthorised repair.</li>
      </ul>
    </div>

    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
      <div className="flex items-center gap-2 font-bold text-blue-800 mb-2"><FiClock /> Return Timeline</div>
      <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
        <li>Return process takes <span className="font-semibold text-gray-800">up to 1 week</span> from the date we receive the product.</li>
        <li>Money reimbursement is processed <span className="font-semibold text-gray-800">after analysis</span> of the returned product.</li>
        <li>If the product is found to be faulty through no fault of the customer, a full refund is issued.</li>
      </ul>
    </div>

    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
      <div className="flex items-center gap-2 font-bold text-gray-800 mb-2"><FiArrowRight /> Ready to Return?</div>
      <p className="text-sm text-gray-600 mb-4">If your order meets the return criteria above, submit a return request directly from your account.</p>
      <Link
        to="/returns/request"
        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
      >
        <FiRefreshCw /> Request a Return
      </Link>
    </div>
  </div>
);

export default ReturnsPage;
