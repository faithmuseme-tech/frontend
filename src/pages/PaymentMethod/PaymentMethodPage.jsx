import React, { useState } from "react";
import { FiCreditCard, FiPlus, FiTrash2, FiCheck } from "react-icons/fi";

const STORAGE_KEY = "pa_payment_methods";

const loadMethods = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
};

const saveMethods = (methods) => localStorage.setItem(STORAGE_KEY, JSON.stringify(methods));

const CARD_BRANDS = {
  "4": "Visa",
  "5": "Mastercard",
  "3": "Amex",
};

const detectBrand = (num) => CARD_BRANDS[num?.[0]] || "Card";

const mask = (num) => {
  const clean = num.replace(/\D/g, "");
  return clean.length >= 4 ? `•••• •••• •••• ${clean.slice(-4)}` : "•••• •••• •••• ••••";
};

const formatCardInput = (val) =>
  val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

const PaymentMethodPage = () => {
  const [methods, setMethods] = useState(loadMethods);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === "number" ? formatCardInput(value)
             : name === "expiry" ? value.replace(/\D/g, "").slice(0, 4).replace(/^(\d{2})(\d)/, "$1/$2")
             : value,
    }));
    setError("");
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const clean = form.number.replace(/\s/g, "");
    if (clean.length < 13) { setError("Enter a valid card number."); return; }
    if (!form.name.trim()) { setError("Enter the cardholder name."); return; }
    if (form.expiry.length < 5) { setError("Enter a valid expiry (MM/YY)."); return; }

    const newMethod = {
      id: Date.now(),
      brand: detectBrand(clean),
      last4: clean.slice(-4),
      name: form.name.trim(),
      expiry: form.expiry,
      masked: mask(clean),
    };
    const updated = [...methods, newMethod];
    setMethods(updated);
    saveMethods(updated);
    setForm({ number: "", name: "", expiry: "", cvv: "" });
    setShowForm(false);
  };

  const handleRemove = (id) => {
    const updated = methods.filter((m) => m.id !== id);
    setMethods(updated);
    saveMethods(updated);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-10 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
          <FiCreditCard />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Payment Methods</h1>
          <p className="text-sm text-gray-500">Manage your saved cards.</p>
        </div>
      </div>

      {/* Saved cards */}
      <div className="space-y-3">
        {methods.length === 0 && !showForm && (
          <div className="text-center py-12 text-gray-400">
            <FiCreditCard className="text-4xl mx-auto mb-2 opacity-30" />
            <p className="text-sm font-medium">No payment methods saved</p>
          </div>
        )}
        {methods.map((m) => (
          <div key={m.id} className="bg-white rounded-2xl border border-gray-100 px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                {m.brand[0]}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{m.brand} {m.masked}</p>
                <p className="text-xs text-gray-400">{m.name} · Expires {m.expiry}</p>
              </div>
            </div>
            <button onClick={() => handleRemove(m.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
              <FiTrash2 />
            </button>
          </div>
        ))}
      </div>

      {/* Add card form */}
      {showForm ? (
        <form onSubmit={handleAdd} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <p className="text-sm font-bold text-gray-800">New Card</p>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Card Number</label>
            <input name="number" value={form.number} onChange={handleChange} placeholder="1234 5678 9012 3456" maxLength={19}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Cardholder Name</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Expiry (MM/YY)</label>
              <input name="expiry" value={form.expiry} onChange={handleChange} placeholder="08/27" maxLength={5}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">CVV</label>
              <input name="cvv" value={form.cvv} onChange={handleChange} placeholder="•••" maxLength={4} type="password"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition" />
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3">
            <button type="submit" className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors">
              <FiCheck /> Add Card
            </button>
            <button type="button" onClick={() => { setShowForm(false); setError(""); }}
              className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 font-semibold py-3 rounded-2xl text-sm transition-colors">
          <FiPlus /> Add Payment Method
        </button>
      )}
    </div>
  );
};

export default PaymentMethodPage;
