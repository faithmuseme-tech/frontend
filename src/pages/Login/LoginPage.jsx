import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FiPhone, FiLock, FiAlertCircle, FiEye, FiEyeOff, FiShield, FiCheck } from "react-icons/fi";
import api from "../../services/api";

const PasswordStrength = ({ password }) => {
  const checks = [
    { label: "8+ characters", ok: password.length >= 8 },
    { label: "Uppercase letter", ok: /[A-Z]/.test(password) },
    { label: "Lowercase letter", ok: /[a-z]/.test(password) },
    { label: "Number", ok: /\d/.test(password) },
    { label: "Symbol", ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const color = score <= 2 ? "bg-red-400" : score <= 3 ? "bg-amber-400" : "bg-green-500";
  return (
    <div className="space-y-2 mt-2">
      <div className="flex gap-1">
        {checks.map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i < score ? color : "bg-gray-200"}`} />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {checks.map((c) => (
          <span key={c.label} className={`text-xs flex items-center gap-1 ${c.ok ? "text-green-600" : "text-gray-400"}`}>
            <FiCheck className={c.ok ? "opacity-100" : "opacity-0"} size={10} /> {c.label}
          </span>
        ))}
      </div>
    </div>
  );
};

const ForcePasswordModal = ({ onDone }) => {
  const [form, setForm] = useState({ new_password: "", confirm_password: "" });
  const [show, setShow] = useState({ new: false, confirm: false });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.new_password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (form.new_password !== form.confirm_password) { setError("Passwords do not match."); return; }
    setSaving(true);
    try {
      await api.post("/admin/employees/set-password/", form);
      onDone();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to set password.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <FiShield className="text-indigo-600 text-lg" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">Set Your Password</h2>
            <p className="text-xs text-gray-500">You're using a temporary password. Set a permanent one to continue.</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800 font-medium">
          You cannot access the dashboard until you set your own password. This is a one-time step.
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">New Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type={show.new ? "text" : "password"}
                required autoFocus
                value={form.new_password}
                onChange={(e) => setForm((f) => ({ ...f, new_password: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl pl-9 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="Create a strong password"
              />
              <button type="button" onClick={() => setShow((s) => ({ ...s, new: !s.new }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {show.new ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {form.new_password && <PasswordStrength password={form.new_password} />}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Confirm Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type={show.confirm ? "text" : "password"}
                required
                value={form.confirm_password}
                onChange={(e) => setForm((f) => ({ ...f, confirm_password: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl pl-9 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="Repeat your new password"
              />
              <button type="button" onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {show.confirm ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
              <FiAlertCircle className="shrink-0" /> {error}
            </div>
          )}

          <button type="submit" disabled={saving}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all text-sm">
            {saving ? "Saving..." : "Set Password & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const [form, setForm] = useState({ phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForceModal, setShowForceModal] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(form.phone, form.password);
      if (data?.must_change_password) {
        setShowForceModal(true);
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      setError(err?.response?.data?.detail || "Invalid phone number or password.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSet = () => {
    setShowForceModal(false);
    navigate("/", { replace: true });
  };

  return (
    <>
      {showForceModal && <ForcePasswordModal onDone={handlePasswordSet} />}

      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Sign in</h1>
          <p className="text-sm text-gray-500 mb-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary-600 font-semibold hover:underline">
              Register
            </Link>
          </p>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600 font-medium mb-4">
              <FiAlertCircle className="flex-shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Phone Number</label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="tel" required value={form.phone} onChange={set("phone")}
                  placeholder="+256 700 000 000"
                  className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="password" required value={form.password} onChange={set("password")}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl transition-all shadow-md text-sm disabled:opacity-60 disabled:cursor-not-allowed mt-2">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
