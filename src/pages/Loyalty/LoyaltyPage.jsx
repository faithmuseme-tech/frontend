import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star, Tag, ArrowLeft, TrendingUp, Gift, Clock } from "lucide-react";
import { FiShoppingBag } from "react-icons/fi";
import couponService from "../../services/couponService";
import { formatUGX } from "../../utils/currency";

const Badge = ({ children, color }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${color}`}>
    {children}
  </span>
);

const LoyaltyPage = () => {
  const [loyalty, setLoyalty] = useState(null);
  const [coupons, setCoupons] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([couponService.getLoyalty(), couponService.getMyCoupons()])
      .then(([lRes, cRes]) => {
        setLoyalty(lRes.data);
        setCoupons(cRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  const redeemValue = loyalty ? loyalty.points_balance * loyalty.redemption_value : 0;
  const canRedeem = loyalty && loyalty.points_balance >= loyalty.redemption_minimum;
  const progressPct = loyalty && loyalty.redemption_minimum > 0
    ? Math.min(100, Math.round((loyalty.points_balance / loyalty.redemption_minimum) * 100))
    : 0;

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-gray-800 font-semibold">Loyalty Rewards</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-6">

        {/* ── Points summary card ─────────────────────────────────────── */}
        {loyalty && (
          <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Star size={22} className="text-yellow-300" />
              <h1 className="text-xl font-extrabold">Loyalty Rewards</h1>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-extrabold">{loyalty.points_balance.toLocaleString()}</p>
                <p className="text-orange-100 text-xs mt-1">Available</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold">{loyalty.points_earned.toLocaleString()}</p>
                <p className="text-orange-100 text-xs mt-1">Earned</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold">{loyalty.points_redeemed.toLocaleString()}</p>
                <p className="text-orange-100 text-xs mt-1">Redeemed</p>
              </div>
            </div>
            <div className="mt-5 bg-white/10 rounded-xl p-3 text-sm">
              {canRedeem ? (
                <p className="font-semibold text-yellow-200">
                  Your points are ready to redeem! Use them at checkout for a{" "}
                  <span className="font-extrabold text-white">{formatUGX(redeemValue)}</span> discount on your next order.
                </p>
              ) : (
                <>
                  <p className="text-orange-100">Keep shopping to unlock your next reward.</p>
                  <div className="mt-2 bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <p className="text-xs text-orange-200 mt-1">{progressPct}% of the way there</p>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── How it works ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-indigo-600" />
            <h2 className="font-extrabold text-gray-900">How It Works</h2>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Shop with us, earn rewards, and save on future purchases. Every completed order
            automatically earns you loyalty points — no sign-ups or extra steps needed.
            Once you've accumulated enough points, you can redeem them for a discount on
            your next order at checkout.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
            {[
              { icon: <FiShoppingBag size={18} className="text-indigo-500" />, label: "Shop", desc: "Place an order" },
              { icon: <Star size={18} className="text-yellow-500" />, label: "Earn", desc: "Get loyalty points" },
              { icon: <Gift size={18} className="text-green-500" />, label: "Redeem", desc: "Save at checkout" },
            ].map(({ icon, label, desc }) => (
              <div key={label} className="bg-indigo-50 rounded-xl p-3 flex flex-col items-center gap-1">
                {icon}
                <p className="font-extrabold text-indigo-900">{label}</p>
                <p className="text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Transaction history ─────────────────────────────────────── */}
        {loyalty?.transactions?.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={18} className="text-gray-500" />
              <h2 className="font-extrabold text-gray-900">Points History</h2>
            </div>
            <div className="space-y-2">
              {loyalty.transactions.map((tx, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{tx.note || tx.type}</p>
                    <p className="text-xs text-gray-400">{new Date(tx.created_at).toLocaleDateString("en-UG", { day: "numeric", month: "short", year: "numeric" })}</p>
                  </div>
                  <Badge color={tx.points > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}>
                    {tx.points > 0 ? "+" : ""}{tx.points} pts
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Available coupons ───────────────────────────────────────── */}
        {coupons && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Tag size={18} className="text-amber-600" />
              <h2 className="font-extrabold text-gray-900">Available Coupons</h2>
            </div>
            {coupons.available.length === 0 ? (
              <p className="text-sm text-gray-400">No coupons available right now. Shop more to earn rewards!</p>
            ) : (
              <div className="space-y-3">
                {coupons.available.map((c) => (
                  <div key={c.code} className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                    <div>
                      <p className="font-mono font-extrabold text-amber-900 text-base tracking-widest">{c.code}</p>
                      <p className="text-xs text-amber-700 mt-0.5">
                        {formatUGX(c.discount)} off
                        {c.expires_at && ` · Expires ${new Date(c.expires_at).toLocaleDateString("en-UG")}`}
                      </p>
                    </div>
                    <Badge color="bg-amber-200 text-amber-800">{c.type.replace("_", " ")}</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Used coupons ────────────────────────────────────────────── */}
        {coupons?.used?.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Gift size={18} className="text-gray-400" />
              <h2 className="font-extrabold text-gray-900">Used Coupons</h2>
            </div>
            <div className="space-y-2">
              {coupons.used.map((u) => (
                <div key={u.code} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 opacity-60">
                  <div>
                    <p className="font-mono font-bold text-gray-600 tracking-widest">{u.code}</p>
                    <p className="text-xs text-gray-400">Used {new Date(u.used_at).toLocaleDateString("en-UG")}</p>
                  </div>
                  <Badge color="bg-gray-100 text-gray-500">{formatUGX(u.discount)} off</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        <Link to="/checkout" className="flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">
          <ArrowLeft size={15} /> Back to Checkout
        </Link>
      </div>
    </div>
  );
};

export default LoyaltyPage;
