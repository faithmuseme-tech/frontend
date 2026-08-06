import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart, FiX } from "react-icons/fi";
import { useCartAbandonment } from "../../hooks/useCartAbandonment";

const CartNudgeToast = () => {
  const [nudge, setNudge] = useState(null);
  const navigate = useNavigate();

  useCartAbandonment({
    onNudge: ({ title, body }) => setNudge({ title, body }),
  });

  useEffect(() => {
    if (!nudge) return;
    const t = setTimeout(() => setNudge(null), 12000);
    return () => clearTimeout(t);
  }, [nudge]);

  if (!nudge) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100%-2rem)] max-w-sm animate-slide-up">
      <div className="bg-white rounded-2xl shadow-2xl border border-indigo-100 p-4 flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
          <FiShoppingCart className="text-lg" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900">{nudge.title}</p>
          <p className="text-xs text-gray-500 mt-0.5">{nudge.body}</p>
          <button
            onClick={() => { setNudge(null); navigate("/checkout"); }}
            className="mt-2 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Checkout Now
          </button>
        </div>
        <button
          onClick={() => setNudge(null)}
          className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FiX />
        </button>
      </div>
    </div>
  );
};

export default CartNudgeToast;
