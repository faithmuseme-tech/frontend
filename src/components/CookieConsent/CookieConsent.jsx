import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiX, FiShield } from "react-icons/fi";
import api from "../../services/api";

const KEY        = "cp_cookie_consent";
const REMIND_KEY = "cp_cookie_remind";
const REMIND_MS  = 7 * 24 * 60 * 60 * 1000;

const shouldShow = () => {
  const consent = localStorage.getItem(KEY);
  if (consent === "accepted" || consent === "rejected" || consent === "custom") return false;
  const remindAt = localStorage.getItem(REMIND_KEY);
  if (!remindAt) return true;
  return Date.now() > Number(remindAt) + REMIND_MS;
};

const saveToBackend = (analytics) => {
  const token = localStorage.getItem("access_token");
  if (!token) return;
  api.post("/auth/cookie-preferences/", { analytics }).catch(() => {});
};

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setVisible(shouldShow()), 600);
    return () => clearTimeout(t);
  }, []);

  const accept = () => {
    localStorage.setItem(KEY, "accepted");
    localStorage.removeItem(REMIND_KEY);
    saveToBackend(true);
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem(KEY, "rejected");
    localStorage.removeItem(REMIND_KEY);
    saveToBackend(false);
    setVisible(false);
  };

  const dismiss = () => {
    localStorage.setItem(REMIND_KEY, String(Date.now()));
    setVisible(false);
  };

  const manage = () => {
    dismiss();
    navigate("/cookie-preferences");
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999]">
      <div className="w-full bg-orange-500 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row sm:items-center gap-3">

          {/* Icon + text */}
          <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
            <div className="w-7 h-7 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0">
              <FiShield className="text-white" size={14} />
            </div>
            <p className="text-sm text-white leading-relaxed">
              We use necessary cookies to make our website work. With your permission, we also use
              analytics cookies to understand how visitors use our website.{" "}
              <Link to="/cookie-notice" className="text-orange-100 font-bold underline underline-offset-2 hover:text-white transition-colors">
                Cookie Notice
              </Link>
              {" · "}
              <Link to="/privacy" className="text-orange-100 font-bold underline underline-offset-2 hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
            <button
              onClick={accept}
              className="bg-white text-orange-600 hover:bg-orange-50 text-xs font-bold px-4 py-2 rounded-xl transition-all whitespace-nowrap"
            >
              Accept all
            </button>
            <button
              onClick={reject}
              className="bg-orange-600 hover:bg-orange-700 border border-orange-400 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all whitespace-nowrap"
            >
              Reject optional
            </button>
            <button
              onClick={manage}
              className="bg-orange-600 hover:bg-orange-700 border border-orange-400 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all whitespace-nowrap"
            >
              Manage preferences
            </button>
            <button
              onClick={dismiss}
              className="text-orange-200 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-orange-600 flex-shrink-0"
              aria-label="Dismiss"
            >
              <FiX size={15} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
