import React from "react";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

const ContactPage = () => (
  <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14 space-y-8">
    <div>
      <h1 className="text-3xl font-extrabold text-gray-900">Contact Us</h1>
      <p className="mt-3 text-gray-500">Reach out to us via any of the channels below. We're happy to help.</p>
    </div>

    <div className="space-y-4">
      <a
        href="mailto:balanceiq81@gmail.com"
        className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all"
      >
        <span className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 text-lg flex-shrink-0">
          <FiMail />
        </span>
        <div>
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Email</p>
          <p className="text-sm font-bold text-gray-800">balanceiq81@gmail.com</p>
        </div>
      </a>

      <a
        href="tel:+256794448439"
        className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all"
      >
        <span className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 text-lg flex-shrink-0">
          <FiPhone />
        </span>
        <div>
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Phone</p>
          <p className="text-sm font-bold text-gray-800">+256 794 448 439</p>
        </div>
      </a>

      <a
        href="tel:+256706721334"
        className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all"
      >
        <span className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 text-lg flex-shrink-0">
          <FiPhone />
        </span>
        <div>
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Phone</p>
          <p className="text-sm font-bold text-gray-800">+256 706 721 334</p>
        </div>
      </a>

      <a
        href="https://wa.me/256786023858"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 p-4 bg-green-50 rounded-2xl border border-green-100 hover:border-green-300 transition-all"
      >
        <span className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600 text-lg flex-shrink-0">
          <FaWhatsapp />
        </span>
        <div>
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">WhatsApp / Customer Care</p>
          <p className="text-sm font-bold text-gray-800">0786 023 858 &nbsp;/&nbsp; 0794 448 439</p>
          <p className="text-xs text-gray-500 mt-0.5">For order confirmation & support</p>
        </div>
      </a>

      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
        <span className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 text-lg flex-shrink-0">
          <FiMapPin />
        </span>
        <div>
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Locations</p>
          <p className="text-sm font-bold text-gray-800">Fort Portal (Main Office) &amp; Kampala, Uganda</p>
        </div>
      </div>
    </div>
  </div>
);

export default ContactPage;
