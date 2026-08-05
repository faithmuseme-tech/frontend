import React, { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const faqs = [
  {
    q: "How do I place an order?",
    a: "Browse products, add to cart, and proceed to checkout. Your order is confirmed only after payment is received.",
  },
  {
    q: "How do I pay?",
    a: "We use Mobile Money only. Send payment to 0794 448 439 in the names of SABIRA SSEMATA. No other number is used for payment.",
  },
  {
    q: "How do I confirm my payment?",
    a: "After sending payment, contact our customer care on 0786 023 858 or 0794 448 439 via WhatsApp or call to confirm.",
  },
  {
    q: "How long will my order be held?",
    a: "We hold your product for up to 2 weeks after payment. Additional holding fees apply if you need more time. If uncollected after 2 weeks without communication, the product may be returned to stock.",
  },
  {
    q: "Can I return a product?",
    a: "Yes, if the product has a fault present at delivery and has not been used or damaged by you. Returns take up to 1 week and refunds are issued after product analysis.",
  },
  {
    q: "What if I damaged the product myself?",
    a: "We do not compensate for damage caused by customer carelessness, such as poor wiring, physical damage, or liquid damage.",
  },
  {
    q: "How long does delivery take?",
    a: "Kampala orders placed before 2:00 PM are eligible for same-day delivery. Western and Northern Uganda orders take 2–3 days.",
  },
  {
    q: "Is my personal information safe?",
    a: "Yes. CartPulse keeps all customer and trader information strictly confidential. We do not share any personal data with third parties.",
  },
  {
    q: "How do I sell on CartPulse?",
    a: "Register as a trader using the 'Sell with CartPulse' link. Your account will be reviewed and approved by our admin team.",
  },
];

const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
      >
        {q}
        {open ? <FiChevronUp className="flex-shrink-0 text-indigo-500" /> : <FiChevronDown className="flex-shrink-0 text-gray-400" />}
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
          {a}
        </div>
      )}
    </div>
  );
};

const FAQsPage = () => (
  <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14 space-y-6">
    <div>
      <h1 className="text-3xl font-extrabold text-gray-900">Frequently Asked Questions</h1>
      <p className="mt-3 text-gray-500">Quick answers to common questions about CartPulse.</p>
    </div>
    <div className="space-y-3">
      {faqs.map((item) => <FAQItem key={item.q} {...item} />)}
    </div>
  </div>
);

export default FAQsPage;
