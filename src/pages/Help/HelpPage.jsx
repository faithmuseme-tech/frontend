import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiMessageCircle, FiMail, FiPhone, FiChevronRight,
  FiX, FiPackage, FiRefreshCw, FiCreditCard, FiTruck,
  FiShield, FiHelpCircle, FiArrowRight, FiExternalLink,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

/* ── Help topics the user picks before going to chat ── */
const TOPICS = [
  { id: "order",    icon: FiPackage,     label: "Order Issue",          desc: "Track, modify or cancel an order" },
  { id: "payment",  icon: FiCreditCard,  label: "Payment Problem",      desc: "Payment not confirmed or failed" },
  { id: "delivery", icon: FiTruck,       label: "Delivery Question",    desc: "Delivery time, location or status" },
  { id: "return",   icon: FiRefreshCw,   label: "Return & Refund",      desc: "Return a product or get a refund" },
  { id: "scam",     icon: FiShield,      label: "Report a Scam",        desc: "Suspicious call, message or payment request" },
  { id: "other",    icon: FiHelpCircle,  label: "Something Else",       desc: "Any other question or concern" },
];

/* ── Quick-link FAQ cards ── */
const FAQS = [
  { q: "How do I pay for my order?",          to: "/how-to-pay" },
  { q: "What are the delivery areas?",         to: "/shipping" },
  { q: "How do I return a product?",           to: "/returns" },
  { q: "Is my payment safe?",                  to: "/how-to-pay#s4" },
  { q: "What are CartPulse's terms?",          to: "/terms" },
  { q: "How do I report a scam?",              to: "/how-to-pay#s6" },
];

/* ── Chat topic picker modal ── */
const TopicModal = ({ onClose, onSelect }) => (
  <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0">
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
      <div className="bg-primary-600 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-extrabold text-lg">What do you need help with?</p>
            <p className="text-primary-200 text-xs mt-0.5">Choose a topic so we can assist you faster</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
            <FiX size={18} />
          </button>
        </div>
      </div>
      <div className="p-4 grid grid-cols-2 gap-2.5">
        {TOPICS.map(({ id, icon: Icon, label, desc }) => (
          <button
            key={id}
            onClick={() => onSelect(label)}
            className="flex flex-col items-start gap-1.5 p-3.5 rounded-2xl border border-gray-100 hover:border-primary-300 hover:bg-primary-50 transition-all text-left group"
          >
            <div className="w-8 h-8 bg-primary-100 group-hover:bg-primary-200 rounded-xl flex items-center justify-center transition-colors">
              <Icon className="text-primary-600" size={15} />
            </div>
            <p className="text-sm font-bold text-gray-900 leading-tight">{label}</p>
            <p className="text-xs text-gray-400 leading-snug">{desc}</p>
          </button>
        ))}
      </div>
    </div>
  </div>
);

/* ── Contact channel card ── */
const Channel = ({ icon, label, sublabel, href, onClick, color, external }) => {
  const cls = `flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${color}`;
  const inner = (
    <>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/60">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-900">{label}</p>
        {sublabel && <p className="text-xs text-gray-500 mt-0.5">{sublabel}</p>}
      </div>
      {external ? <FiExternalLink size={14} className="text-gray-400 flex-shrink-0" /> : <FiChevronRight size={14} className="text-gray-400 flex-shrink-0" />}
    </>
  );
  if (onClick) return <div className={cls} onClick={onClick}>{inner}</div>;
  if (external) return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>;
  return <a href={href} className={cls}>{inner}</a>;
};

const HelpPage = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleTopicSelect = (topic) => {
    setShowModal(false);
    navigate("/chat", { state: { helpTopic: topic } });
  };

  return (
    <>
      {showModal && <TopicModal onClose={() => setShowModal(false)} onSelect={handleTopicSelect} />}

      <div className="min-h-screen bg-gray-50">

        {/* ── Hero ── */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center">
            <div className="w-14 h-14 bg-primary-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <FiHelpCircle className="text-primary-600" size={26} />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900">How can we help you?</h1>
            <p className="mt-3 text-gray-500 max-w-md mx-auto text-sm leading-relaxed">
              Choose how you'd like to reach us. Our team is ready to help with orders, payments, delivery, and more.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">

          {/* ── Contact channels ── */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Contact us</p>
            <div className="grid sm:grid-cols-2 gap-3">

              <Channel
                icon={<FiMessageCircle className="text-primary-600" size={20} />}
                label="Live Chat"
                sublabel="Chat with our support team"
                color="bg-primary-50 border-primary-100 hover:border-primary-300"
                onClick={() => setShowModal(true)}
              />

              <Channel
                icon={<FaWhatsapp className="text-green-600" size={20} />}
                label="WhatsApp"
                sublabel="0786 023 858 · 0794 448 439"
                href="https://wa.me/256786023858"
                color="bg-green-50 border-green-100 hover:border-green-300"
                external
              />

              <Channel
                icon={<FiPhone className="text-blue-600" size={20} />}
                label="Call Us"
                sublabel="0794 448 439 · 0786 023 858"
                href="tel:+256794448439"
                color="bg-blue-50 border-blue-100 hover:border-blue-300"
              />

              <Channel
                icon={<FiMail className="text-indigo-600" size={20} />}
                label="Send an Email"
                sublabel="information.cartpulse@gmail.com"
                href="mailto:information.cartpulse@gmail.com"
                color="bg-indigo-50 border-indigo-100 hover:border-indigo-300"
              />

            </div>
          </div>

          {/* ── Quick answers ── */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Quick answers</p>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {FAQS.map(({ q, to }) => (
                <Link
                  key={q}
                  to={to}
                  className="flex items-center justify-between gap-3 bg-white border border-gray-100 hover:border-primary-200 hover:bg-primary-50 rounded-2xl px-4 py-3.5 transition-all group"
                >
                  <span className="text-sm text-gray-700 group-hover:text-primary-700 font-medium">{q}</span>
                  <FiArrowRight size={14} className="text-gray-300 group-hover:text-primary-500 flex-shrink-0 transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* ── Help topics ── */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Browse by topic</p>
            <div className="grid sm:grid-cols-3 gap-3">
              {TOPICS.map(({ id, icon: Icon, label, desc }) => (
                <button
                  key={id}
                  onClick={() => setShowModal(true)}
                  className="flex flex-col items-start gap-2 bg-white border border-gray-100 hover:border-primary-200 hover:bg-primary-50 rounded-2xl p-4 text-left transition-all group"
                >
                  <div className="w-9 h-9 bg-primary-100 group-hover:bg-primary-200 rounded-xl flex items-center justify-center transition-colors">
                    <Icon className="text-primary-600" size={16} />
                  </div>
                  <p className="text-sm font-bold text-gray-900">{label}</p>
                  <p className="text-xs text-gray-400 leading-snug">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* ── Bottom note ── */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <FiShield className="text-amber-600" size={18} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900">Stay safe from scams</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                CartPulse will <span className="font-semibold text-gray-700">never</span> ask for your PIN, OTP, or password.
                We only accept payment to <span className="font-semibold text-gray-700">0794 448 439 (SABIRA SSEMATA)</span>.
              </p>
            </div>
            <Link
              to="/how-to-pay#s4"
              className="flex-shrink-0 text-xs text-amber-600 font-bold hover:underline whitespace-nowrap"
            >
              Learn more →
            </Link>
          </div>

        </div>
      </div>
    </>
  );
};

export default HelpPage;
