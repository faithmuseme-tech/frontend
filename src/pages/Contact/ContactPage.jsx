import React, { useState } from "react";
import { FiPhone, FiMail, FiMapPin, FiSend, FiUser, FiMessageSquare } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import api from "../../services/api";

const INQUIRY_TYPES = ["General Inquiry", "Order Support", "Product Question", "Returns & Refunds", "Partnership", "Other"];

const initialForm = { name: "", email: "", phone: "", inquiry_type: "", subject: "", message: "" };

const ContactPage = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // "success" | "error" | null
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.phone.trim()) e.phone = "Phone number is required.";
    else if (!/^\+?[\d\s\-()]{7,15}$/.test(form.phone.trim())) e.phone = "Enter a valid phone number.";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (!form.inquiry_type) e.inquiry_type = "Please select an inquiry type.";
    if (!form.subject.trim()) e.subject = "Subject is required.";
    if (!form.message.trim()) e.message = "Message is required.";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((err) => ({ ...err, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e_ = validate();
    if (Object.keys(e_).length) { setErrors(e_); return; }
    setLoading(true);
    setStatus(null);
    try {
      await api.post("/contact/inquiries/", form);
      setStatus("success");
      setForm(initialForm);
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Contact Us</h1>
        <p className="mt-2 text-gray-500">Have a question or need help? Fill out the form or reach us directly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* ── Inquiry Form ── */}
        <form onSubmit={handleSubmit} noValidate className="lg:col-span-3 space-y-5 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <FiMessageSquare className="text-indigo-500" /> Send an Inquiry
          </h2>

          {status === "success" && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">
              Your inquiry has been sent! We'll get back to you soon.
            </div>
          )}
          {status === "error" && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              Something went wrong. Please try again or contact us directly.
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ayesiga Winnie"
                className={`w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 ${errors.name ? "border-red-400" : "border-gray-200"}`}
              />
            </div>
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Email (optional) + Phone (required) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 ${errors.email ? "border-red-400" : "border-gray-200"}`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+256 700 000 000"
                  className={`w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 ${errors.phone ? "border-red-400" : "border-gray-200"}`}
                />
              </div>
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>
          </div>

          {/* Inquiry Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Inquiry Type <span className="text-red-500">*</span>
            </label>
            <select
              name="inquiry_type"
              value={form.inquiry_type}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white ${errors.inquiry_type ? "border-red-400" : "border-gray-200"}`}
            >
              <option value="">Select a type…</option>
              {INQUIRY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.inquiry_type && <p className="text-xs text-red-500 mt-1">{errors.inquiry_type}</p>}
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Brief subject of your inquiry"
              className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 ${errors.subject ? "border-red-400" : "border-gray-200"}`}
            />
            {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject}</p>}
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              placeholder="Describe your inquiry in detail…"
              className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none ${errors.message ? "border-red-400" : "border-gray-200"}`}
            />
            {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
          >
            <FiSend /> {loading ? "Sending…" : "Send Inquiry"}
          </button>
        </form>

        {/* ── Contact Info ── */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-gray-800">Reach Us Directly</h2>

          <a href="mailto:information.cartpulse@gmail.com" className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all">
            <span className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 text-lg flex-shrink-0"><FiMail /></span>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Email</p>
              <p className="text-sm font-bold text-gray-800">information.cartpulse@gmail.com</p>
            </div>
          </a>

          <a href="tel:+256794448439" className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all">
            <span className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 text-lg flex-shrink-0"><FiPhone /></span>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Phone</p>
              <p className="text-sm font-bold text-gray-800">+256 794 448 439</p>
            </div>
          </a>

          <a href="tel:+256706721334" className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all">
            <span className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 text-lg flex-shrink-0"><FiPhone /></span>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Phone</p>
              <p className="text-sm font-bold text-gray-800">+256 706 721 334</p>
            </div>
          </a>

          <a href="https://wa.me/256786023858" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-green-50 rounded-2xl border border-green-100 hover:border-green-300 transition-all">
            <span className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600 text-lg flex-shrink-0"><FaWhatsapp /></span>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">WhatsApp / Customer Care</p>
              <p className="text-sm font-bold text-gray-800">0786 023 858 &nbsp;/&nbsp; 0794 448 439</p>
              <p className="text-xs text-gray-500 mt-0.5">For order confirmation & support</p>
            </div>
          </a>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <span className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 text-lg flex-shrink-0"><FiMapPin /></span>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Location</p>
              <p className="text-sm font-bold text-gray-800">Fort Portal, Uganda</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
