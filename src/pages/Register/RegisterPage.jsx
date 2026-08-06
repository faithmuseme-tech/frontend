import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiUser, FiMail, FiLock, FiPhone, FiAlertCircle,
  FiCheck, FiMapPin, FiChevronDown, FiArrowRight, FiShield,
} from "react-icons/fi";
import CartPulseLogo from "../../components/Logo/CartPulseLogo";

const REGIONS = [
  { name: "Central Region",  districts: ["Kampala","Buikwe","Bukomansimbi","Butambala","Buvuma","Gomba","Kalangala","Kalungu","Kassanda","Kayunga","Kiboga","Kyankwanzi","Kyotera","Luwero","Lwengo","Lyantonde","Masaka","Mityana","Mpigi","Mubende","Mukono","Nakaseke","Nakasongola","Rakai","Sembabule","Wakiso"] },
  { name: "Eastern Region",  districts: ["Amuria","Budaka","Bududa","Bugiri","Bugweri","Bukedea","Bukwa","Bulambuli","Busia","Butaleja","Butebo","Buyende","Iganga","Jinja","Kaberamaido","Kaliro","Kamuli","Kapchorwa","Katakwi","Kibuku","Kumi","Kween","Luuka","Manafwa","Mayuge","Mbale","Namayingo","Namisindwa","Namutumba","Ngora","Pallisa","Serere","Sironko","Soroti","Tororo"] },
  { name: "Northern Region", districts: ["Abim","Adjumani","Agago","Alebtong","Amolatar","Amudat","Amuru","Apac","Arua","Dokolo","Gulu","Kaabong","Kabong","Karenga","Kitgum","Koboko","Kole","Kotido","Lamwo","Lira","Maracha","Moroto","Moyo","Nakapiripirit","Napak","Nebbi","Nwoya","Omoro","Otuke","Oyam","Pader","Pakwach","Yumbe","Zombo"] },
  { name: "Western Region",  districts: ["Bunyangabu","Buhweju","Buliisa","Bundibugyo","Bushenyi","Fort Portal","Hoima","Ibanda","Isingiro","Kabale","Kabarole","Kamwenge","Kanungu","Kasese","Kazo","Kibale","Kiruhura","Kiryandongo","Kisoro","Kitagwenda","Kikuube","Kyegegwa","Kyenjojo","Masandi","Mbarara","Mitooma","Ntoroko","Ntungamo","Rubanda","Rukiga","Rukungiri","Rwampara","Sheema"] },
];

/* ── Floating-label input ── */
const Field = ({ label, icon: Icon, error, ...props }) => {
  const [focused, setFocused] = useState(false);
  const filled = String(props.value ?? "").length > 0;
  return (
    <div className="relative">
      <div className={`flex items-center border rounded-xl transition-all duration-150 bg-white ${
        error ? "border-red-400 ring-1 ring-red-200"
              : focused ? "border-primary-500 ring-1 ring-primary-100"
                        : "border-gray-200 hover:border-gray-300"
      }`}>
        {Icon && (
          <span className={`pl-3.5 flex-shrink-0 transition-colors ${focused || filled ? "text-primary-500" : "text-gray-400"}`}>
            <Icon size={15} />
          </span>
        )}
        <div className="relative flex-1">
          <input
            {...props}
            onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
            onBlur={(e)  => { setFocused(false); props.onBlur?.(e); }}
            placeholder=" "
            className="peer w-full bg-transparent pt-5 pb-1.5 px-3 text-sm text-gray-900 focus:outline-none"
          />
          <label className={`absolute left-3 transition-all duration-150 pointer-events-none select-none
            peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
            top-1.5 text-[10px] font-semibold uppercase tracking-wide
            ${focused || filled ? "text-primary-500 top-1.5 text-[10px]" : "text-gray-400"}`}>
            {label}
          </label>
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-red-500 font-medium flex items-center gap-1"><FiAlertCircle size={11}/>{error}</p>}
    </div>
  );
};

/* ── District dropdown ── */
const DistrictSelect = ({ districts, value, onChange, disabled }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} className="relative">
      <button type="button" disabled={disabled} onClick={() => setOpen(o => !o)}
        className={`w-full border rounded-xl px-3.5 py-3 text-sm text-left flex items-center justify-between bg-white transition-all duration-150
          ${disabled ? "opacity-50 cursor-not-allowed border-gray-200" : open ? "border-primary-500 ring-1 ring-primary-100" : "border-gray-200 hover:border-gray-300"}`}>
        <span className={value ? "text-gray-900" : "text-gray-400"}>{value || (disabled ? "Select region first" : "Select district…")}</span>
        <FiChevronDown className={`text-gray-400 transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`} size={14} />
      </button>
      {open && (
        <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-y-auto max-h-48 py-1">
          {districts.map(d => (
            <li key={d} onClick={() => { onChange(d); setOpen(false); }}
              className={`px-4 py-2 text-sm cursor-pointer transition-colors ${d === value ? "bg-primary-50 text-primary-700 font-semibold" : "hover:bg-gray-50 text-gray-700"}`}>
              {d}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/* ── Section divider ── */
const SectionLabel = ({ children }) => (
  <div className="flex items-center gap-3 pt-2">
    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">{children}</span>
    <div className="flex-1 h-px bg-gray-100" />
  </div>
);

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "", phone: "",
    password: "", confirm_password: "", region: "", city: "", address: "",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.first_name.trim()) e.first_name = "Required";
    if (!form.last_name.trim())  e.last_name  = "Required";
    if (!form.phone.trim())      e.phone      = "Required";
    if (!form.password)          e.password   = "Required";
    else if (form.password.length < 8) e.password = "Minimum 8 characters";
    if (form.password !== form.confirm_password) e.confirm_password = "Passwords do not match";
    if (!agreedToTerms) e.terms = "You must accept the Terms & Conditions to continue";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register({
        first_name: form.first_name, last_name: form.last_name,
        username: form.email, email: form.email, phone: form.phone,
        password: form.password, password2: form.confirm_password,
        city: form.city, address: form.address,
      });
      navigate("/", { replace: true });
    } catch (err) {
      const data = err?.response?.data;
      if (data && typeof data === "object") {
        setErrors(Object.fromEntries(Object.entries(data).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])));
      } else {
        setErrors({ submit: "Registration failed. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl flex rounded-3xl shadow-2xl shadow-blue-100/60 overflow-hidden border border-gray-100">

        {/* ── Left brand panel ── */}
        <div className="hidden lg:flex flex-col justify-between w-80 xl:w-96 flex-shrink-0 bg-gradient-to-b from-primary-700 to-primary-900 p-10 text-white">
          <div>
            <div className="mb-8">
              <CartPulseLogo size={40} textClass="text-xl font-extrabold" dark />
            </div>
            <h2 className="text-2xl font-extrabold leading-tight mb-3">Join CartPulse today</h2>
            <p className="text-primary-200 text-sm leading-relaxed">
              Shop electronics, STEM products, and everyday essentials — delivered straight to your door across Uganda.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: FiShield,   text: "Secure & verified payments" },
              { icon: FiMapPin,   text: "Doorstep delivery across Uganda" },
              { icon: FiCheck,    text: "Order tracking & support" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={14} className="text-primary-200" />
                </div>
                <span className="text-sm text-primary-100">{text}</span>
              </div>
            ))}
            <p className="text-xs text-primary-300 pt-4 border-t border-white/10">
              Already have an account?{" "}
              <Link to="/login" className="text-white font-semibold hover:underline">Sign in →</Link>
            </p>
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div className="flex-1 bg-white px-8 sm:px-10 py-10 overflow-y-auto">

          {/* Mobile header */}
          <div className="lg:hidden mb-5">
            <CartPulseLogo size={32} textClass="text-lg font-extrabold" />
            <h1 className="text-xl font-extrabold text-gray-900 mt-4">Create account</h1>
            <p className="text-sm text-gray-500 mt-1">
              Already have an account?{" "}
              <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign in</Link>
            </p>
          </div>

          <div className="hidden lg:block mb-5">
            <h1 className="text-2xl font-extrabold text-gray-900">Create your account</h1>
            <p className="text-sm text-gray-400 mt-1">Fill in the details below to get started.</p>
          </div>

          {errors.submit && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600 font-medium mb-5">
              <FiAlertCircle className="flex-shrink-0" /> {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">

            <SectionLabel>Personal info</SectionLabel>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="First Name" icon={FiUser} value={form.first_name} onChange={set("first_name")} error={errors.first_name} />
              <Field label="Last Name"  icon={FiUser} value={form.last_name}  onChange={set("last_name")}  error={errors.last_name} />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Email Address (optional)" icon={FiMail}  type="email" value={form.email} onChange={set("email")} error={errors.email} />
              <Field label="Phone Number"              icon={FiPhone} type="tel"   value={form.phone} onChange={set("phone")} error={errors.phone} />
            </div>

            <SectionLabel>Your location</SectionLabel>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-0.5">Region</p>

                <select
                  value={form.region}
                  onChange={(e) => setForm(f => ({ ...f, region: e.target.value, city: "" }))}
                  className="w-full border border-gray-200 hover:border-gray-300 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-100 bg-white text-gray-700 transition-all"
                >
                  <option value="">Select region…</option>
                  {REGIONS.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-0.5">District</p>
                <DistrictSelect
                  districts={REGIONS.find(r => r.name === form.region)?.districts || []}
                  value={form.city}
                  onChange={(d) => setForm(f => ({ ...f, city: d }))}
                  disabled={!form.region}
                />
              </div>
            </div>
            <Field label="Street Address (optional)" icon={FiMapPin} type="text" value={form.address} onChange={set("address")} />


            <SectionLabel>Security</SectionLabel>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Password"         icon={FiLock} type="password" value={form.password}         onChange={set("password")}         error={errors.password} />
              <Field label="Confirm Password" icon={FiLock} type="password" value={form.confirm_password} onChange={set("confirm_password")} error={errors.confirm_password} />
            </div>

            {/* Terms checkbox */}
            <div className="space-y-1">
              <label className="flex items-start gap-3 cursor-pointer group">
                <button
                  type="button"
                  onClick={() => { setAgreedToTerms(v => !v); setErrors(e => ({ ...e, terms: undefined })); }}
                  className={`mt-0.5 w-5 h-5 flex-shrink-0 rounded-md border-2 flex items-center justify-center transition-all duration-150 ${
                    agreedToTerms ? "bg-primary-600 border-primary-600 shadow-sm shadow-primary-200"
                                  : errors.terms ? "border-red-400"
                                                 : "border-gray-300 group-hover:border-primary-400"
                  }`}
                >
                  {agreedToTerms && <FiCheck className="text-white" size={11} />}
                </button>
                <span className="text-sm text-gray-500 leading-snug">
                  I have read and agree to the{" "}
                  <Link to="/terms" target="_blank" className="text-primary-600 font-semibold hover:underline">
                    Terms &amp; Conditions
                  </Link>
                  . By creating an account you accept these terms in full.
                </span>
              </label>
              {errors.terms && (
                <p className="text-xs text-red-500 font-medium flex items-center gap-1 pl-8">
                  <FiAlertCircle size={11} />{errors.terms}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-primary-200 text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account…
                </>
              ) : (
                <>Create Account <FiArrowRight size={15} /></>
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
