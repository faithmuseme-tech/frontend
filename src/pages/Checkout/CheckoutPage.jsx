import React, { useState, useMemo, useRef, useEffect } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronRight, MapPin, User, Phone, Mail,
  Truck, Shield, CreditCard, Check, ArrowLeft,
  Package, AlertCircle, Clock, Calendar,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { formatUGX } from "../../utils/currency";
import orderService from "../../services/orderService";

// Districts grouped by region with per-item delivery fee
const REGIONS = [
  {
    name: "Central Region", fee: 3000,
    districts: ["Buikwe","Bukomansimbi","Butambala","Buvuma","Gomba","Kalangala","Kalungu","Kampala","Kassanda","Kayunga","Kiboga","Kyankwanzi","Kyotera","Luwero","Lwengo","Lyantonde","Masaka","Mityana","Mpigi","Mubende","Mukono","Nakaseke","Nakasongola","Rakai","Sembabule","Wakiso"],
  },
  {
    name: "Eastern Region", fee: 5000,
    districts: ["Amuria","Budaka","Bududa","Bugiri","Bugweri","Bukedea","Bukwa","Bulambuli","Busia","Butaleja","Butebo","Buyende","Iganga","Jinja","Kaberamaido","Kaliro","Kamuli","Kapchorwa","Katakwi","Kibuku","Kumi","Kween","Luuka","Manafwa","Mayuge","Mbale","Namayingo","Namisindwa","Namutumba","Ngora","Pallisa","Serere","Sironko","Soroti","Tororo"],
  },
  {
    name: "Northern Region", fee: 8000,
    districts: ["Abim","Adjumani","Agago","Alebtong","Amolatar","Amudat","Amuru","Apac","Arua","Dokolo","Gulu","Kaabong","Kabong","Karenga","Kitgum","Koboko","Kole","Kotido","Lamwo","Lira","Maracha","Moroto","Moyo","Nakapiripirit","Napak","Nebbi","Nwoya","Omoro","Otuke","Oyam","Pader","Pakwach","Yumbe","Zombo"],
  },
  {
    name: "Western Region", fee: 8000,
    districts: ["Bunyangabu","Buhweju","Buliisa","Bundibugyo","Bushenyi","Hoima","Ibanda","Isingiro","Kabale","Kabarole","Kamwenge","Kanungu","Kasese","Kazo","Kibale","Kiruhura","Kiryandongo","Kisoro","Kitagwenda","Kikuube","Kyegegwa","Kyenjojo","Masindi","Mbarara","Mitooma","Ntoroko","Ntungamo","Rubanda","Rukiga","Rukungiri","Rwampara","Sheema"],
  },
];

const FEE_PER_ITEM = (district = "") => {
  const d = district.trim().toLowerCase();
  for (const r of REGIONS) {
    if (r.districts.some((x) => x.toLowerCase() === d)) return r.fee;
  }
  return 8000;
};

const getDeliveryFee = (city = "", items = []) => {
  if (!city.trim()) return 0;
  const feePerItem = FEE_PER_ITEM(city);
  return items.reduce((total, item) => total + feePerItem * (item.qty || 1), 0);
};

const DistrictSelect = ({ districts, value, onChange, disabled, error }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={`w-full border rounded-xl px-4 py-3 text-sm text-left flex items-center justify-between transition-all bg-white disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? "border-red-400" : open ? "border-primary-400 ring-2 ring-primary-100" : "border-gray-200"}`}
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {value || (disabled ? "Select region first" : "Select district...")}
        </span>
        <ChevronRight size={16} className={`text-gray-400 transition-transform flex-shrink-0 ${open ? "rotate-90" : ""}`} />
      </button>
      {open && (
        <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-y-auto max-h-[calc(8*2.5rem)]">
          {districts.map((d) => (
            <li
              key={d}
              onClick={() => { onChange(d); setOpen(false); }}
              className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                d === value ? "bg-primary-50 text-primary-700 font-semibold" : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              {d}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


const PAYMENT_METHODS = [
  { id: "mtn", label: "MTN Mobile Money", color: "border-yellow-400 bg-yellow-50", badge: "bg-yellow-400 text-white", icon: "📱" },
  { id: "airtel", label: "Airtel Money", color: "border-red-400 bg-red-50", badge: "bg-red-500 text-white", icon: "📱" },
  { id: "card", label: "Visa / Mastercard", color: "border-blue-400 bg-blue-50", badge: "bg-blue-600 text-white", icon: "💳" },
  { id: "cod", label: "Cash on Delivery", color: "border-green-400 bg-green-50", badge: "bg-green-600 text-white", icon: "💵" },
];

const STEPS = ["Shipping", "Payment", "Review"];

const Input = ({ label, icon, error, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</label>
    <div className="relative">
      {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{icon}</span>}
      <input
        {...props}
        className={`w-full border rounded-xl py-3 text-sm focus:outline-none focus:ring-2 transition-all
          ${icon ? "pl-9 pr-4" : "px-4"}
          ${error ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-primary-400 focus:ring-primary-100"}`}
      />
    </div>
    {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
  </div>
);

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("mtn");

  const [form, setForm] = useState(() => {
    const city = user?.city || "";
    const region = city
      ? (REGIONS.find((r) => r.districts.some((d) => d.toLowerCase() === city.trim().toLowerCase()))?.name || "")
      : "";
    return {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      shipping_address: user?.address || "",
      shipping_region: region,
      shipping_city: city,
      shipping_country: user?.country || "Uganda",
      shipping_zip: user?.zip_code || "",
      notes: "",
    };
  });

  useEffect(() => {
    if (!user) return;
    setForm((prev) => {
      const city = prev.shipping_city || user.city || "";
      const region = prev.shipping_region ||
        (city ? (REGIONS.find((r) => r.districts.some((d) => d.toLowerCase() === city.trim().toLowerCase()))?.name || "") : "");
      return {
        ...prev,
        first_name: prev.first_name || user.first_name || "",
        last_name: prev.last_name || user.last_name || "",
        email: prev.email || user.email || "",
        phone: prev.phone || user.phone || "",
        shipping_address: prev.shipping_address || user.address || "",
        shipping_city: city,
        shipping_region: region,
        shipping_country: prev.shipping_country || user.country || "Uganda",
        shipping_zip: prev.shipping_zip || user.zip_code || "",
      };
    });
  }, [user]);

  const shipping = useMemo(() => getDeliveryFee(form.shipping_city, items), [form.shipping_city, items]);
  const grandTotal = useMemo(() => totalPrice + shipping, [totalPrice, shipping]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validateStep0 = () => {
    const e = {};
    if (!form.first_name.trim()) e.first_name = "Required";
    if (!form.last_name.trim()) e.last_name = "Required";
    if (!form.email.trim()) e.email = "Required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.shipping_address.trim()) e.shipping_address = "Required";
    if (!form.shipping_city.trim()) e.shipping_city = "Required";
    if (!form.shipping_country.trim()) e.shipping_country = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 0 && !validateStep0()) return;
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    try {
      await orderService.createOrder({
        shipping_address: form.shipping_address,
        shipping_city: form.shipping_city,
        shipping_country: form.shipping_country,
        shipping_zip: form.shipping_zip,
        notes: form.notes,
        items: items.map((item) => ({
          product_id: item.id,
          product_name: item.name,
          product_price: item.price,
          quantity: item.qty,
        })),
      });
      navigate("/success");
      clearCart();
    } catch (err) {
      const msg = err?.response?.data?.error || "Failed to place order. Please try again.";
      setErrors({ submit: msg });
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: "/checkout" }} replace />;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <Package size={56} className="text-gray-300" />
        <h2 className="text-xl font-bold text-gray-700">Your cart is empty</h2>
        <Link to="/shop" className="flex items-center gap-2 bg-primary-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors">
          <ArrowLeft size={16} /> Go Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link to="/cart" className="hover:text-primary-600 transition-colors">Cart</Link>
          <ChevronRight size={12} />
          <span className="text-gray-800 font-semibold">Checkout</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">

        {/* Step indicator */}
        <div className="flex items-center justify-center mb-10">
          {STEPS.map((label, i) => (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center gap-1">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all
                  ${i < step ? "bg-green-500 text-white" : i === step ? "bg-primary-600 text-white shadow-lg shadow-primary-200" : "bg-gray-200 text-gray-400"}`}>
                  {i < step ? <Check size={16} /> : i + 1}
                </div>
                <span className={`text-xs font-semibold ${i === step ? "text-primary-600" : "text-gray-400"}`}>{label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 w-16 sm:w-24 mx-2 mb-4 rounded-full transition-all ${i < step ? "bg-green-400" : "bg-gray-200"}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── LEFT: Steps ─────────────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8"
            >

              {/* ── STEP 0: Shipping ──────────────────────────────────── */}
              {step === 0 && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="text-primary-600" size={20} />
                    <h2 className="text-lg font-extrabold text-gray-900">Shipping Information</h2>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="First Name" icon={<User size={14} />} value={form.first_name} onChange={set("first_name")} placeholder="John" error={errors.first_name} />
                    <Input label="Last Name" icon={<User size={14} />} value={form.last_name} onChange={set("last_name")} placeholder="Doe" error={errors.last_name} />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="Email Address" icon={<Mail size={14} />} type="email" value={form.email} onChange={set("email")} placeholder="john@example.com" error={errors.email} />
                    <Input label="Phone Number" icon={<Phone size={14} />} type="tel" value={form.phone} onChange={set("phone")} placeholder="+256 700 000 000" error={errors.phone} />
                  </div>

                  <Input label="Street Address" icon={<MapPin size={14} />} value={form.shipping_address} onChange={set("shipping_address")} placeholder="123 Kampala Road" error={errors.shipping_address} />

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Region</label>
                      <select
                        value={form.shipping_region || ""}
                        onChange={(e) => setForm((f) => ({ ...f, shipping_region: e.target.value, shipping_city: "" }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:border-primary-400 focus:ring-primary-100 bg-white"
                      >
                        <option value="">Select region...</option>
                        {REGIONS.map((r) => (
                          <option key={r.name} value={r.name}>{r.name} — UGX {r.fee.toLocaleString()}/item</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1 relative">
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">District</label>
                      <DistrictSelect
                        districts={REGIONS.find((r) => r.name === form.shipping_region)?.districts || []}
                        value={form.shipping_city}
                        onChange={(d) => setForm((f) => ({ ...f, shipping_city: d }))}
                        disabled={!form.shipping_region}
                        error={errors.shipping_city}
                      />
                      {errors.shipping_city && <p className="text-xs text-red-500 font-medium">Required</p>}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Order Notes (optional)</label>
                    <textarea
                      rows={3}
                      value={form.notes}
                      onChange={set("notes")}
                      placeholder="Any special instructions for delivery..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 resize-none"
                    />
                  </div>

                  {/* Delivery estimate */}
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                    <Truck size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-bold text-blue-800">When will it arrive?</p>
                      <p className="text-blue-700 mt-0.5">Your order will be on its way within <span className="font-semibold">2 to 4 business days</span> after we confirm it. We'll keep you in the loop!</p>
                    </div>
                  </div>

                  {/* Pickup station */}
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-2">
                    <div className="flex items-start gap-3">
                      <MapPin size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-green-800 text-sm">Rather pick it up yourself?</p>
                        <p className="text-green-700 text-sm mt-0.5">No problem! Swing by our Fort Portal pick-up station — it's quick, easy, and free.</p>
                        <p className="text-green-800 font-semibold text-sm mt-1.5">Link, Kabundaire Town</p>
                        <p className="text-green-600 text-xs">Near Kings Bet · Kabundaire, Fort Portal City</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-5 pl-7 pt-1">
                      <span className="flex items-center gap-1.5 text-xs text-green-700 font-medium">
                        <Clock size={13} /> 10:00 AM – 6:00 PM
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-green-700 font-medium">
                        <Calendar size={13} /> Monday – Saturday
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 1: Payment ───────────────────────────────────── */}
              {step === 1 && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="text-primary-600" size={20} />
                    <h2 className="text-lg font-extrabold text-gray-900">Payment Method</h2>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {PAYMENT_METHODS.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setPaymentMethod(m.id)}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                          paymentMethod === m.id ? m.color + " shadow-md" : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <span className="text-2xl">{m.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-800">{m.label}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          paymentMethod === m.id ? "border-primary-600 bg-primary-600" : "border-gray-300"
                        }`}>
                          {paymentMethod === m.id && <Check size={12} className="text-white" />}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* MTN / Airtel phone input */}
                  {(paymentMethod === "mtn" || paymentMethod === "airtel") && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                      <Input
                        label={`${paymentMethod === "mtn" ? "MTN" : "Airtel"} Mobile Money Number`}
                        icon={<Phone size={14} />}
                        type="tel"
                        placeholder="+256 700 000 000"
                        defaultValue={form.phone}
                      />
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-800 font-medium">
                        You will receive a payment prompt on your phone after placing the order.
                      </div>
                    </motion.div>
                  )}

                  {/* Card input */}
                  {paymentMethod === "card" && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                      <Input label="Card Number" icon={<CreditCard size={14} />} placeholder="1234 5678 9012 3456" maxLength={19} />
                      <div className="grid grid-cols-2 gap-4">
                        <Input label="Expiry Date" placeholder="MM / YY" />
                        <Input label="CVV" placeholder="123" maxLength={4} />
                      </div>
                      <Input label="Name on Card" icon={<User size={14} />} placeholder="John Doe" />
                    </motion.div>
                  )}

                  {paymentMethod === "cod" && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800 font-medium flex items-start gap-2">
                        <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                        Pay with cash when your order is delivered. Please have the exact amount ready.
                      </div>
                    </motion.div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-gray-400 pt-2">
                    <Shield size={13} className="text-green-500" />
                    Your payment information is encrypted and secure.
                  </div>
                </div>
              )}

              {/* ── STEP 2: Review ────────────────────────────────────── */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="text-primary-600" size={20} />
                    <h2 className="text-lg font-extrabold text-gray-900">Review Your Order</h2>
                  </div>

                  {/* Shipping summary */}
                  <div className="bg-gray-50 rounded-xl p-4 space-y-1 text-sm">
                    <p className="font-bold text-gray-700 flex items-center gap-2 mb-2"><MapPin size={14} className="text-primary-500" /> Shipping To</p>
                    <p className="text-gray-800 font-semibold">{form.first_name} {form.last_name}</p>
                    <p className="text-gray-600">{form.shipping_address}</p>
                    <p className="text-gray-600">{form.shipping_city}, {form.shipping_country} {form.shipping_zip}</p>
                    <p className="text-gray-600">{form.phone} · {form.email}</p>
                  </div>

                  {/* Payment summary */}
                  <div className="bg-gray-50 rounded-xl p-4 text-sm">
                    <p className="font-bold text-gray-700 flex items-center gap-2 mb-2"><CreditCard size={14} className="text-primary-500" /> Payment</p>
                    <p className="text-gray-800 font-semibold">{PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label}</p>
                  </div>

                  {/* Items */}
                  <div className="space-y-3">
                    <p className="font-bold text-gray-700 text-sm flex items-center gap-2"><Package size={14} className="text-primary-500" /> Items ({items.length})</p>
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="w-14 h-14 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-800 line-clamp-1">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                        </div>
                        <p className="text-sm font-extrabold text-primary-600 flex-shrink-0">{formatUGX(item.price * item.qty)}</p>
                      </div>
                    ))}
                  </div>

                  {errors.submit && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600 font-semibold">
                      <AlertCircle size={16} /> {errors.submit}
                    </div>
                  )}
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                {step > 0 ? (
                  <button onClick={handleBack} className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors">
                    <ArrowLeft size={16} /> Back
                  </button>
                ) : (
                  <Link to="/cart" className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors">
                    <ArrowLeft size={16} /> Back to Cart
                  </Link>
                )}

                {step < 2 ? (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 active:scale-95 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-md text-sm"
                  >
                    Continue <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={handlePlaceOrder}
                    disabled={submitting}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 active:scale-95 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-md text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Placing Order..." : "Place Order"}
                    {!submitting && <Check size={16} />}
                  </button>
                )}
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT: Order Summary ─────────────────────────────────────── */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-6">
              <p className="text-base font-extrabold text-gray-900 mb-4">Order Summary</p>

              {/* Items list */}
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-100">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {item.qty}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-700 line-clamp-2 leading-snug">{item.name}</p>
                    </div>
                    <p className="text-xs font-extrabold text-gray-900 flex-shrink-0">{formatUGX(item.price * item.qty)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-gray-200 pt-4 space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-800">{formatUGX(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-1.5"><Truck size={13} className="text-gray-400" /> Delivery</span>
                  <span className="font-semibold">{shipping === 0 ? <span className="text-green-600 font-bold">Free</span> : formatUGX(shipping)}</span>
                </div>
                {shipping > 0 && form.shipping_city && (
                  <div className="bg-blue-50 rounded-xl px-3 py-2 space-y-1">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-xs text-gray-500">
                        <span className="truncate max-w-[140px]">{item.name} × {item.qty}</span>
                        <span>{formatUGX(FEE_PER_ITEM(form.shipping_city) * item.qty)}</span>
                      </div>
                    ))}
                    <p className="text-xs text-blue-500 font-medium pt-1">{formatUGX(FEE_PER_ITEM(form.shipping_city))}/item to {form.shipping_city}</p>
                  </div>
                )}
                <div className="border-t border-gray-100 pt-2.5 flex justify-between items-center">
                  <span className="font-extrabold text-gray-900">Total</span>
                  <span className="font-extrabold text-xl text-primary-600">{formatUGX(grandTotal)}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-400">
                <Shield size={13} className="text-green-500" /> Secured by 256-bit SSL encryption
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
