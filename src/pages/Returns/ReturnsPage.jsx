import React from "react";
import { FiRefreshCw, FiAlertTriangle, FiClock, FiPhone } from "react-icons/fi";

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
      <div className="flex items-center gap-2 font-bold text-gray-800 mb-2"><FiPhone /> Initiate a Return</div>
      <p className="text-sm text-gray-600">
        Contact our customer care on{" "}
        <a href="https://wa.me/256786023858" className="font-semibold text-indigo-600 hover:underline">0786 023 858</a>
        {" "}or{" "}
        <a href="https://wa.me/256794448439" className="font-semibold text-indigo-600 hover:underline">0794 448 439</a>
        {" "}via WhatsApp or call to start the return process.
      </p>
    </div>
  </div>
);

export default ReturnsPage;
