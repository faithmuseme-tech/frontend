import React, { useState } from "react";
import { FiMapPin, FiCheck } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const Field = ({ label, name, value, onChange, placeholder }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
    />
  </div>
);

const LocationPage = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    address:  user?.address  || "",
    city:     user?.city     || "",
    country:  user?.country  || "",
    zip_code: user?.zip_code || "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [error, setError]   = useState("");

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const { data } = await api.patch("/auth/profile/", form);
      updateUser(data);
      setSaved(true);
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-10 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
          <FiMapPin />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Delivery Location</h1>
          <p className="text-sm text-gray-500">Your default shipping address.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <Field label="Street Address" name="address" value={form.address} onChange={handleChange} placeholder="e.g. Plot 12, Kampala Road" />
        <div className="grid grid-cols-2 gap-4">
          <Field label="City" name="city" value={form.city} onChange={handleChange} placeholder="Kampala" />
          <Field label="ZIP / Postal Code" name="zip_code" value={form.zip_code} onChange={handleChange} placeholder="00256" />
        </div>
        <Field label="Country" name="country" value={form.country} onChange={handleChange} placeholder="Uganda" />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
        >
          {saved ? <><FiCheck /> Saved!</> : saving ? "Saving…" : "Save Address"}
        </button>
      </form>
    </div>
  );
};

export default LocationPage;
