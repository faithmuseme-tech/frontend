import React, { useState } from "react";
import Modal from "./Modal";
import api from "../../services/api";

const RateProductModal = ({ open, onClose, product, onSuccess }) => {
  const [form, setForm] = useState({ rating: 5, title: "", body: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.post(`/reviews/${product.id}/`, form);
      setDone(true);
      onSuccess?.();
      setTimeout(onClose, 1200);
    } catch (err) {
      const data = err?.response?.data;
      const msg = data?.detail || (typeof data === "object" ? Object.values(data).flat().join(" ") : null);
      setError(msg || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={`Rate: ${product?.name}`} size="max-w-md">
      {done ? (
        <div className="text-center py-8">
          <p className="text-4xl mb-3">✅</p>
          <p className="text-sm font-semibold text-green-600">Review submitted! Thank you.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Your Rating</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, rating: s }))}
                  className={`text-3xl transition-transform hover:scale-110 ${s <= form.rating ? "text-yellow-400" : "text-gray-200"}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <input
            type="text"
            placeholder="Review title (optional)"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400"
          />

          <textarea
            required
            rows={4}
            placeholder="Share your experience with this product..."
            value={form.body}
            onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 resize-none"
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-600 hover:border-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default RateProductModal;
