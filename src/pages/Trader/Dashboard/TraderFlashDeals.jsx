import React, { useEffect, useState } from "react";
import traderService from "../../../services/traderService";
import { FiPlusCircle, FiTrash2, FiAlertCircle, FiClock } from "react-icons/fi";
import { formatUGX } from "../../../utils/currency";
import { toAbsolute } from "../../../utils/imageUrl";

const getTimeLeft = (endsAt) => {
  const diff = new Date(endsAt) - Date.now();
  if (diff <= 0) return "Expired";
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return `${d}d ${h}h ${m}m remaining`;
};

const TraderFlashDeals = () => {
  const [deals, setDeals] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    product: "",
    deal_price: "",
    stock_count: 50,
  });
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([traderService.getFlashDeals(), traderService.getProducts()])
      .then(([dealsRes, prodsRes]) => {
        setDeals(dealsRes.data?.results || dealsRes.data || []);
        setProducts(prodsRes.data?.results || prodsRes.data || []);
      })
      .catch(() => setError("Failed to load data."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this flash deal?")) return;
    setDeleting(id);
    try {
      await traderService.deleteFlashDeal(id);
      setDeals((prev) => prev.filter((d) => d.id !== id));
    } catch {
      setError("Failed to delete flash deal.");
    } finally {
      setDeleting(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await traderService.createFlashDeal({
        product: Number(form.product),
        deal_price: form.deal_price,
        stock_count: Number(form.stock_count),
      });
      setDeals((prev) => [res.data, ...prev]);
      setForm({ product: "", deal_price: "", stock_count: 50 });
      setShowForm(false);
      setSuccess("Flash deal created! It will run for 1 week.");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      const data = err.response?.data;
      if (data?.deal_price) setError(data.deal_price[0] || data.deal_price);
      else if (data?.non_field_errors) setError(data.non_field_errors[0]);
      else setError("Failed to create flash deal.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedProduct = products.find((p) => String(p.id) === String(form.product));

  if (loading) return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center">
            <span className="text-lg">🔥</span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Flash Deals</h1>
        </div>
        <button
          onClick={() => { setShowForm((v) => !v); setError(""); }}
          className="flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all"
        >
          <FiPlusCircle /> New Flash Deal
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
          <FiAlertCircle className="flex-shrink-0" /> {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700">
          <span>🔥</span> {success}
        </div>
      )}

      {/* Create Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-800 mb-4">Create Flash Deal</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Product</label>
              <select
                required
                value={form.product}
                onChange={(e) => setForm((f) => ({ ...f, product: e.target.value, deal_price: "" }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              >
                <option value="">Select a product…</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {formatUGX(p.price)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Deal Price (UGX)
                  {selectedProduct && (
                    <span className="text-gray-400 font-normal ml-1">
                      (must be &lt; {formatUGX(selectedProduct.price)})
                    </span>
                  )}
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={form.deal_price}
                  onChange={(e) => setForm((f) => ({ ...f, deal_price: e.target.value }))}
                  placeholder="e.g. 250000"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Stock Count</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={form.stock_count}
                  onChange={(e) => setForm((f) => ({ ...f, stock_count: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500 bg-blue-50 rounded-xl px-3 py-2">
              <FiClock className="flex-shrink-0 text-blue-500" />
              Deal will automatically run for <span className="font-semibold text-blue-600">1 week</span> from creation.
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all disabled:opacity-50"
              >
                🔥 {submitting ? "Creating…" : "Launch Deal"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Deals List */}
      {deals.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <span className="text-5xl block mb-3">🔥</span>
          <p className="text-gray-500 font-medium">No flash deals yet.</p>
          <p className="text-gray-400 text-sm mt-1">Create a flash deal to feature your products on the home page.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Product</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Deal Price</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Progress</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Time Left</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {deals.map((deal) => {
                const p = deal.product_detail;
                const image = toAbsolute(p?.primary_image);
                const timeLeft = getTimeLeft(deal.ends_at);
                const isExpired = timeLeft === "Expired";
                return (
                  <tr key={deal.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                          {image && <img src={image} alt={p?.name} className="w-full h-full object-cover" />}
                        </div>
                        <span className="font-semibold text-gray-800 line-clamp-1">{p?.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell">
                      <div>
                        <span className="font-bold text-accent-600">{formatUGX(deal.deal_price)}</span>
                        {deal.discount_percent > 0 && (
                          <span className="ml-2 text-xs bg-accent-100 text-accent-700 font-semibold px-1.5 py-0.5 rounded-full">
                            -{deal.discount_percent}%
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <div className="w-32">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>{deal.sold_percent}% sold</span>
                          <span>{deal.remaining} left</span>
                        </div>
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-accent-500 to-red-500 rounded-full"
                            style={{ width: `${deal.sold_percent}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 hidden lg:table-cell">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <FiClock className={isExpired ? "text-red-400" : "text-blue-400"} />
                        <span className={isExpired ? "text-red-500 font-semibold" : ""}>{timeLeft}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        isExpired
                          ? "bg-gray-100 text-gray-500"
                          : deal.is_live
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {isExpired ? "Expired" : deal.is_live ? "Live" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => handleDelete(deal.id)}
                        disabled={deleting === deal.id}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TraderFlashDeals;
