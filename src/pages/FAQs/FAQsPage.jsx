import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { Star } from "lucide-react";

const faqs = [
  {
    category: "Orders & Payment",
    items: [
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
        a: "We hold your product for up to 2 weeks after payment while we arrange doorstep delivery. Additional holding fees apply if you need more time. If delivery has not been completed within 2 weeks and no communication has been made, the product may be returned to stock.",
      },
    ],
  },
  {
    category: "Delivery & Returns",
    items: [
      {
        q: "Does CartPulse have pick-up stations?",
        a: "No. CartPulse does not operate pick-up stations. We deliver directly to your doorstep in the towns listed on our Shipping page. You do not need to go anywhere to collect your order.",
      },
      {
        q: "What if I live outside a listed delivery town?",
        a: "If you are outside a listed delivery town — including villages or remote areas — additional delivery charges apply and are not included in the standard delivery fee. Please contact us before placing your order so we can advise on the extra cost.",
      },
      {
        q: "How long does delivery take?",
        a: "Kampala orders placed before 2:00 PM are eligible for same-day delivery. Western and Northern Uganda orders take 2–3 days.",
      },
      {
        q: "Can I return a product?",
        a: "Yes, if the product has a fault present at delivery and has not been used or damaged by you. Returns take up to 1 week and refunds are issued after product analysis.",
      },
      {
        q: "What if I damaged the product myself?",
        a: "We do not compensate for damage caused by customer carelessness, such as poor wiring, physical damage, or liquid damage.",
      },
    ],
  },
  {
    category: "Loyalty Rewards & Coupons",
    items: [
      {
        q: "What is the CartPulse Loyalty Rewards programme?",
        a: "Every completed order automatically earns you loyalty points — no sign-ups or extra steps needed. Once you've accumulated enough points, you can redeem them for a discount on your next order at checkout.",
      },
      {
        q: "How do I earn loyalty points?",
        a: "Simply place and complete an order. Points are credited to your account automatically after your order is delivered and confirmed.",
      },
      {
        q: "How do I redeem my points?",
        a: "When you have enough points, a redemption option appears at checkout. Your points are converted into a discount (UGX value) that is applied directly to your order total.",
      },
      {
        q: "How many points do I need before I can redeem?",
        a: "You need a minimum of 150 points before redemption is unlocked. You can track your progress and see exactly how close you are on your Loyalty Rewards page.",
      },
      {
        q: "What are coupons and how do I get them?",
        a: "Coupons are discount codes you earn through loyalty milestones and promotions. They appear automatically in your Loyalty Rewards page and can be applied at checkout for a fixed discount off your order.",
      },
      {
        q: "Do my loyalty points or coupons expire?",
        a: "Loyalty points do not expire. Coupons however expire the moment you place a new order without using them — that order was your chance to use the coupon and it has passed. Always apply your coupon at checkout before placing an order. You can see your available coupons on your Loyalty Rewards page.",
      },
      {
        q: "Where can I see my points balance and transaction history?",
        a: "Visit your Loyalty Rewards page from the account menu. It shows your available points, total earned, total redeemed, full transaction history, and all available or used coupons.",
      },
    ],
  },
  {
    category: "Account & Privacy",
    items: [
      {
        q: "Is my personal information safe?",
        a: "Yes. CartPulse keeps all customer information strictly confidential. We do not share any personal data with third parties.",
      },
    ],
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
  <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14 space-y-10">
    <div>
      <h1 className="text-3xl font-extrabold text-gray-900">Frequently Asked Questions</h1>
      <p className="mt-3 text-gray-500">Quick answers to common questions about CartPulse.</p>
    </div>

    {faqs.map((section) => (
      <div key={section.category} className="space-y-3">
        <div className="flex items-center gap-2">
          {section.category === "Loyalty Rewards & Coupons" && (
            <Star size={16} className="text-amber-500 shrink-0" />
          )}
          <h2 className="text-base font-extrabold text-gray-800">{section.category}</h2>
        </div>
        {section.items.map((item) => <FAQItem key={item.q} {...item} />)}
        {section.category === "Loyalty Rewards & Coupons" && (
          <Link
            to="/loyalty"
            className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors mt-1"
          >
            <Star size={14} /> View your Loyalty Rewards dashboard
          </Link>
        )}
      </div>
    ))}
  </div>
);

export default FAQsPage;
