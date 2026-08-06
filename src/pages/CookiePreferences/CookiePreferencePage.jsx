import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiShield, FiCheck, FiChevronRight, FiLock, FiBarChart2 } from "react-icons/fi";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const KEY = "cp_cookie_consent";

const Toggle = ({ enabled, onChange, disabled }) => (
  <button
    type="button"
    onClick={() => !disabled && onChange(!enabled)}
    className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${
      disabled ? "bg-gray-200 cursor-not-allowed" : enabled ? "bg-orange-500" : "bg-gray-300 hover:bg-gray-400"
    }`}
    aria-pressed={enabled}
  >
    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${enabled ? "translate-x-5" : "translate-x-0"}`} />
  </button>
);

const CookiePreferencePage = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [loading,   setLoading]   = useState(false);

  // Load saved preference
  useEffect(() => {
    const local = localStorage.getItem(KEY);
    if (local === "accepted") { setAnalytics(true); return; }
    if (local === "rejected") { setAnalytics(false); return; }
    if (!user) return;
    api.get("/auth/cookie-preferences/")
      .then(r => setAnalytics(r.data.analytics))
      .catch(() => {});
  }, [user]);

  const save = async () => {
    setLoading(true);
    setSaved(false);
    // Always save locally
    localStorage.setItem(KEY, analytics ? "accepted" : "rejected");
    localStorage.removeItem("cp_cookie_remind");
    // Save to backend if logged in
    if (user) {
      await api.post("/auth/cookie-preferences/", { analytics }).catch(() => {});
    }
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-2xl mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
          <FiChevronRight size={12} />
          <span className="text-gray-700 font-semibold">Cookie Preferences</span>
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <FiShield className="text-orange-500" size={18} />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Cookie Preferences</h1>
        </div>
        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
          Manage how CartPulse uses cookies on your device. Necessary cookies are always active as they are
          required for the website to function. You can choose whether to allow analytics cookies below.{" "}
          <Link to="/privacy" className="text-orange-500 font-semibold hover:underline">Privacy Policy</Link>
        </p>

        <div className="space-y-4">

          {/* Necessary */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4">
            <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
              <FiLock className="text-gray-500" size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-gray-900">Necessary Cookies</p>
                  <span className="text-xs text-gray-400 font-medium">Always active</span>
                </div>
                <Toggle enabled={true} onChange={() => {}} disabled={true} />
              </div>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Required for the website to work. These include login sessions, shopping cart, security tokens,
                and basic site functionality. They cannot be disabled.
              </p>
            </div>
          </div>

          {/* Analytics */}
          <div className={`bg-white rounded-2xl border transition-colors p-5 flex items-start gap-4 ${analytics ? "border-orange-200" : "border-gray-100"}`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${analytics ? "bg-orange-100" : "bg-gray-100"}`}>
              <FiBarChart2 className={analytics ? "text-orange-500" : "text-gray-400"} size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-gray-900">Analytics Cookies</p>
                  <span className={`text-xs font-medium ${analytics ? "text-orange-500" : "text-gray-400"}`}>
                    {analytics ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <Toggle enabled={analytics} onChange={setAnalytics} />
              </div>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Help us understand how visitors interact with CartPulse — which pages are visited, how long
                users stay, and where they come from. This helps us improve the experience. No personal data
                is sold or shared with third parties.
              </p>
            </div>
          </div>

        </div>

        {/* Save */}
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={save}
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-sm shadow-orange-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Saving…" : "Save preferences"}
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-green-600 font-semibold">
              <FiCheck size={14} /> Saved
            </span>
          )}
        </div>

        <p className="text-xs text-gray-400 mt-4">
          You can update your preferences at any time from this page.
          {!user && (
            <> <Link to="/login" className="text-orange-500 font-semibold hover:underline">Sign in</Link> to sync preferences across devices.</>
          )}
        </p>

      </div>
    </div>
  );
};

export default CookiePreferencePage;
