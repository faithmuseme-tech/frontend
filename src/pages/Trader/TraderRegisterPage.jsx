import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import traderService from "../../services/traderService";
import {
  FiUser, FiMail, FiPhone, FiMapPin, FiFileText,
  FiCheck, FiAlertCircle, FiChevronRight, FiArrowLeft,
} from "react-icons/fi";

const STEPS = ["Intro", "Business Info", "Done"];

const Field = ({ label, icon, error, textarea, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</label>
    <div className="relative">
      {icon && <span className="absolute left-3 top-3.5 text-gray-400 text-sm">{icon}</span>}
      {textarea ? (
        <textarea
          {...props}
          rows={3}
          className={`w-full border rounded-xl py-3 text-sm focus:outline-none focus:ring-2 resize-none transition-all
            ${icon ? "pl-9 pr-4" : "px-4"}
            ${error ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-primary-400 focus:ring-primary-100"}`}
        />
      ) : (
        <input
          {...props}
          className={`w-full border rounded-xl py-3 text-sm focus:outline-none focus:ring-2 transition-all
            ${icon ? "pl-9 pr-4" : "px-4"}
            ${error ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-primary-400 focus:ring-primary-100"}`}
        />
      )}
    </div>
    {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
  </div>
);

const TraderRegisterPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    business_name: "",
    business_email: "",
    business_phone: "",
    business_address: "",
    business_city: "",
    business_country: "Uganda",
    description: "",
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.business_name.trim()) e.business_name = "Required";
    if (!form.business_email.trim()) e.business_email = "Required";
    if (!form.business_phone.trim()) e.business_phone = "Required";
    if (!form.business_address.trim()) e.business_address = "Required";
    if (!form.business_city.trim()) e.business_city = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await traderService.register(form);
      setStep(2);
    } catch (err) {
      const data = err?.response?.data;
      if (data && typeof data === "object") {
        setErrors(Object.fromEntries(
          Object.entries(data).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])
        ));
      } else {
        setErrors({ submit: "Submission failed. Please try again." });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) return null;

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="text-gray-600">You need to be logged in to register as a trader.</p>
          <Link to="/login" state={{ from: "/trader/register" }} className="inline-block bg-primary-600 text-white font-bold px-6 py-3 rounded-xl text-sm">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (user?.trader_profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-sm">
          <FiCheck className="text-5xl text-green-500 mx-auto" />
          <h2 className="text-xl font-extrabold text-gray-900">Already Registered</h2>
          <p className="text-gray-500 text-sm">
            Your trader application is <span className="font-semibold capitalize">{user.trader_profile.status}</span>.
          </p>
          <Link to="/trader/dashboard" className="inline-block bg-primary-600 text-white font-bold px-6 py-3 rounded-xl text-sm">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

        {/* Step indicator */}
        <div className="flex items-center justify-center mb-8">
          {STEPS.map((label, i) => (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all
                  ${i < step ? "bg-green-500 text-white" : i === step ? "bg-primary-600 text-white" : "bg-gray-200 text-gray-400"}`}>
                  {i < step ? <FiCheck /> : i + 1}
                </div>
                <span className={`text-xs font-semibold ${i === step ? "text-primary-600" : "text-gray-400"}`}>{label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 w-12 mx-2 mb-4 rounded-full ${i < step ? "bg-green-400" : "bg-gray-200"}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step 0 — Intro */}
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Become a Trader</h1>
              <p className="text-sm text-gray-500 mt-1">
                Sell your products to thousands of customers. Fill in your business details to get started.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-2 text-sm text-blue-800">
              <p className="font-bold">How it works:</p>
              <ul className="space-y-1 list-disc list-inside text-blue-700">
                <li>Complete your business profile</li>
                <li>Wait for approval (usually within 24 hours)</li>
                <li>Start listing your products</li>
                <li>Customers can find and buy them</li>
              </ul>
            </div>
            <p className="text-sm text-gray-500">
              Signed in as <span className="font-semibold text-gray-700">{user.email}</span>
            </p>
            <button
              onClick={() => setStep(1)}
              className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl text-sm transition-all"
            >
              Get Started <FiChevronRight />
            </button>
          </div>
        )}

        {/* Step 1 — Business Form */}
        {step === 1 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-lg font-extrabold text-gray-900 mb-2">Business Information</h2>

            {errors.submit && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600 font-medium">
                <FiAlertCircle className="flex-shrink-0" /> {errors.submit}
              </div>
            )}

            <Field label="Business Name" icon={<FiUser />} placeholder="Acme Electronics Ltd" value={form.business_name} onChange={set("business_name")} error={errors.business_name} />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Business Email" icon={<FiMail />} type="email" placeholder="info@acme.com" value={form.business_email} onChange={set("business_email")} error={errors.business_email} />
              <Field label="Business Phone" icon={<FiPhone />} type="tel" placeholder="+256 700 000 000" value={form.business_phone} onChange={set("business_phone")} error={errors.business_phone} />
            </div>
            <Field label="Business Address" icon={<FiMapPin />} placeholder="123 Kampala Road" value={form.business_address} onChange={set("business_address")} error={errors.business_address} />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="City" placeholder="Kampala" value={form.business_city} onChange={set("business_city")} error={errors.business_city} />
              <Field label="Country" placeholder="Uganda" value={form.business_country} onChange={set("business_country")} />
            </div>
            <Field label="Business Description (optional)" icon={<FiFileText />} textarea placeholder="Tell customers about your business..." value={form.description} onChange={set("description")} />

            <div className="flex items-center justify-between pt-2">
              <button type="button" onClick={() => setStep(0)} className="flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-gray-700">
                <FiArrowLeft /> Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 py-3 rounded-xl text-sm transition-all disabled:opacity-60"
              >
                {submitting ? "Submitting..." : <><FiCheck /> Submit Application</>}
              </button>
            </div>
          </form>
        )}

        {/* Step 2 — Success */}
        {step === 2 && (
          <div className="text-center space-y-5">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <FiCheck className="text-3xl text-green-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">Application Submitted!</h2>
            <p className="text-gray-500 text-sm">
              Your trader application is under review. We'll notify you once it's approved — usually within 24 hours.
            </p>
            <div className="flex flex-col gap-3">
              <Link to="/trader/dashboard" className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl text-sm transition-all">
                Go to Dashboard
              </Link>
              <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 font-medium">
                Back to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TraderRegisterPage;
