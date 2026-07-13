import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import traderService from "../../../services/traderService";
import { FiCheck, FiAlertCircle } from "react-icons/fi";

const Field = ({ label, error, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</label>
    {children}
    {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
  </div>
);

const inputCls = (err) =>
  `w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all
  ${err ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-primary-400 focus:ring-primary-100"}`;

const TraderProfilePage = () => {
  const { user, updateUser } = useAuth();
  const profile = user?.trader_profile;

  const [form, setForm] = useState({
    business_name: profile?.business_name || "",
    business_email: profile?.business_email || "",
    business_phone: profile?.business_phone || "",
    business_address: profile?.business_address || "",
    business_city: profile?.business_city || "",
    business_country: profile?.business_country || "Uganda",
    description: profile?.description || "",
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const res = await traderService.updateProfile(form);
      updateUser({ trader_profile: res.data });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Business Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Update your business information visible to customers.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <div>
            <p className="font-bold text-gray-800">{profile?.business_name}</p>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize
              ${profile?.status === "approved" ? "bg-green-100 text-green-700" :
                profile?.status === "rejected" ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-700"}`}>
              {profile?.status}
            </span>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600 mb-4">
            <FiAlertCircle className="flex-shrink-0" /> {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700 mb-4">
            <FiCheck className="flex-shrink-0" /> Profile updated successfully.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Business Name">
            <input value={form.business_name} onChange={set("business_name")} className={inputCls(false)} />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Business Email">
              <input type="email" value={form.business_email} onChange={set("business_email")} className={inputCls(false)} />
            </Field>
            <Field label="Business Phone">
              <input type="tel" value={form.business_phone} onChange={set("business_phone")} className={inputCls(false)} />
            </Field>
          </div>
          <Field label="Business Address">
            <input value={form.business_address} onChange={set("business_address")} className={inputCls(false)} />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="City">
              <input value={form.business_city} onChange={set("business_city")} className={inputCls(false)} />
            </Field>
            <Field label="Country">
              <input value={form.business_country} onChange={set("business_country")} className={inputCls(false)} />
            </Field>
          </div>
          <Field label="Description">
            <textarea value={form.description} onChange={set("description")} rows={4} className={inputCls(false) + " resize-none"} />
          </Field>

          <div className="flex justify-end pt-2">
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 py-2.5 rounded-xl text-sm transition-all disabled:opacity-60">
              {saving ? "Saving..." : <><FiCheck /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TraderProfilePage;
