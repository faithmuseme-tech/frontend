import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import traderService from "../../services/traderService";
import { useSiteSettings } from "../../context/SiteSettingsContext";
import {
  FiUser, FiMail, FiPhone, FiMapPin, FiFileText,
  FiCheck, FiAlertCircle, FiChevronRight, FiArrowLeft,
  FiShield, FiAlertTriangle, FiSlash, FiDollarSign, FiCreditCard, FiLock,
} from "react-icons/fi";

const STEPS = ["Guidelines", "Business Info", "Done"];

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
  const { sellerOpen } = useSiteSettings();
  const [step, setStep] = useState(0);
  const [declared, setDeclared] = useState(false);
  const [declareError, setDeclareError] = useState(false);
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

  const handleGuidelinesNext = () => {
    if (!declared) { setDeclareError(true); return; }
    setDeclareError(false);
    setStep(1);
  };

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

  if (!sellerOpen) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <FiLock className="text-3xl text-gray-400" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-900">Seller Registration Closed</h2>
          <p className="text-gray-500 text-sm">We're not accepting new trader applications at the moment. Please check back later.</p>
          <Link to="/" className="inline-block bg-primary-600 text-white font-bold px-6 py-3 rounded-xl text-sm">Back to Home</Link>
        </div>
      </div>
    );
  }

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

        {/* Step 0 — Guidelines & Rules */}
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Trader Guidelines & Rules</h1>
              <p className="text-sm text-gray-500 mt-1">
                Before registering as a trader on CartPulse, please read and understand the following guidelines carefully.
              </p>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 space-y-2 text-sm text-indigo-800">
              <p className="font-bold flex items-center gap-2"><FiShield /> Verification & Approval</p>
              <ul className="space-y-1 list-disc list-inside text-indigo-700 text-xs">
                <li>All trader applications are reviewed and verified by the CartPulse team.</li>
                <li>Only approved traders are allowed to list products on the platform.</li>
                <li>Approval typically takes up to 24 hours after a complete application is submitted.</li>
                <li>CartPulse may contact you directly to verify your identity and business.</li>
                <li>CartPulse reserves the right to reject any application without providing a reason.</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-100 rounded-xl p-4 space-y-2 text-sm text-green-800">
              <p className="font-bold flex items-center gap-2"><FiCheck /> Product Listing Rules</p>
              <ul className="space-y-1 list-disc list-inside text-green-700 text-xs">
                <li>You must only list genuine, authentic products with accurate descriptions and images.</li>
                <li>Pricing must be honest and transparent — no hidden charges or misleading prices.</li>
                <li>You are fully responsible for the quality and authenticity of every product you list.</li>
                <li>Orders must be fulfilled promptly. Any delays must be communicated to CartPulse.</li>
                <li>Fake reviews, deceptive pricing, or any fraudulent activity is strictly prohibited.</li>
                <li>Traders must always mark a product as <span className="font-semibold">Inactive</span> immediately when it goes out of stock — do not leave out-of-stock products listed as available.</li>
                <li>If a trader's products are repeatedly found listed as available but out of stock, the account will be permanently banned without warning.</li>
                <li>Keeping out-of-stock products active misleads customers and damages the platform's trust — this is treated as a serious violation.</li>
              </ul>
            </div>

            <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 space-y-2 text-sm text-rose-800">
              <p className="font-bold flex items-center gap-2"><FiSlash /> Fake Products — Zero Tolerance</p>
              <ul className="space-y-1 list-disc list-inside text-rose-700 text-xs">
                <li>Selling fake, counterfeit, or misrepresented products will result in an immediate permanent ban.</li>
                <li>All product listings will be removed and your account will be deactivated.</li>
                <li>CartPulse will pursue legal action against traders who sell fake products.</li>
                <li>Fraudulent traders will be reported to relevant Ugandan authorities.</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-2 text-sm text-blue-800">
              <p className="font-bold flex items-center gap-2"><FiDollarSign /> Payment & Product Handling</p>
              <ul className="space-y-1 list-disc list-inside text-blue-700 text-xs">
                <li>CartPulse will NOT release or deliver your product to any customer without full payment being confirmed first.</li>
                <li>Packaging of products is entirely the trader's responsibility — CartPulse does not package on your behalf.</li>
                <li>Traders are responsible for ensuring products are properly packaged before handing them over to CartPulse.</li>
                <li>CartPulse handles payment collection on your behalf — you will receive your payment after deductions as agreed.</li>
              </ul>
            </div>

            <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 space-y-2 text-sm text-rose-800">
              <p className="font-bold flex items-center gap-2"><FiSlash /> Strictly Prohibited on Listings</p>
              <ul className="space-y-1 list-disc list-inside text-rose-700 text-xs">
                <li>Including your phone number, email address, or any personal contact details on product listings is strictly prohibited.</li>
                <li>Displaying your business name, business logo, or any branding on product images or descriptions is strictly prohibited.</li>
                <li>Collecting money directly from customers using the CartPulse platform is strictly prohibited — all payments go through CartPulse only.</li>
                <li>Misleading customers with false product information, fake discounts, or deceptive descriptions is strictly prohibited.</li>
                <li>Any attempt to redirect customers to buy outside of CartPulse is a serious violation and will result in an immediate ban.</li>
              </ul>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 space-y-2 text-sm text-amber-800">
              <p className="font-bold flex items-center gap-2"><FiAlertTriangle /> General Conduct & Disputes</p>
              <ul className="space-y-1 list-disc list-inside text-amber-700 text-xs">
                <li>Traders must maintain professional and respectful communication with CartPulse staff at all times.</li>
                <li>Traders must not misuse customer data or attempt to contact customers outside of CartPulse's platform.</li>
                <li>Any misunderstanding or dispute between a trader and CartPulse will be handled privately between the two parties, unless the matter escalates to require legal or third-party involvement.</li>
                <li>Any misuse of your trader account beyond the limits and boundaries set by CartPulse is entirely your own responsibility. CartPulse will not be held liable or involved in any consequences — legal, financial, or otherwise — that arise from such misuse.</li>
                <li>If your account is found to be operating outside permitted boundaries, you alone will face the resulting consequences. CartPulse bears no responsibility whatsoever.</li>
                <li>CartPulse reserves the right to suspend or permanently ban any trader who violates these rules.</li>
                <li>By registering, you agree to comply with all CartPulse Terms & Conditions.</li>
              </ul>
            </div>

            <div className="bg-gray-100 border border-gray-200 rounded-xl p-4 space-y-2 text-sm text-gray-700">
              <p className="font-bold flex items-center gap-2"><FiCreditCard /> Identity & Security</p>
              <ul className="space-y-1 list-disc list-inside text-gray-600 text-xs">
                <li>CartPulse may request your personal information such as a National ID for identity verification and security purposes.</li>
                <li>This information is kept strictly confidential and used solely for verification — it will never be shared with third parties.</li>
                <li>Failure to provide requested verification documents when asked may result in suspension of your trader account.</li>
              </ul>
            </div>

            {/* Declaration */}
            <div className={`border rounded-xl p-4 ${declareError ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"}`}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={declared}
                  onChange={(e) => { setDeclared(e.target.checked); if (e.target.checked) setDeclareError(false); }}
                  className="mt-0.5 w-4 h-4 accent-indigo-600 flex-shrink-0"
                />
                <span className="text-sm text-gray-700">
                  I have read and understood the CartPulse Trader Guidelines and Rules. I declare that I will only list
                  genuine products, comply with all platform policies, and accept that violations may result in a permanent
                  ban and legal consequences. I agree to the{" "}
                  <Link to="/terms" target="_blank" className="text-indigo-600 font-semibold hover:underline">Terms & Conditions</Link>
                  {" "}and{" "}
                  <Link to="/privacy" target="_blank" className="text-indigo-600 font-semibold hover:underline">Privacy Policy</Link>.
                </span>
              </label>
              {declareError && (
                <p className="text-xs text-red-600 font-semibold mt-2 flex items-center gap-1">
                  <FiAlertCircle /> You must read and accept the guidelines before proceeding.
                </p>
              )}
            </div>

            <p className="text-sm text-gray-500">
              Signed in as <span className="font-semibold text-gray-700">{user.email}</span>
            </p>

            <button
              onClick={handleGuidelinesNext}
              className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl text-sm transition-all"
            >
              I Agree — Continue <FiChevronRight />
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
