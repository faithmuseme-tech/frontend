import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FiUser, FiMail, FiLock, FiPhone, FiAlertCircle, FiCheck, FiMapPin, FiChevronRight } from "react-icons/fi";

const REGIONS = [
  { name: "Central Region", districts: ["Kampala","Buikwe","Bukomansimbi","Butambala","Buvuma","Gomba","Kalangala","Kalungu","Kassanda","Kayunga","Kiboga","Kyankwanzi","Kyotera","Luwero","Lwengo","Lyantonde","Masaka","Mityana","Mpigi","Mubende","Mukono","Nakaseke","Nakasongola","Rakai","Sembabule","Wakiso"] },
  { name: "Eastern Region", districts: ["Amuria","Budaka","Bududa","Bugiri","Bugweri","Bukedea","Bukwa","Bulambuli","Busia","Butaleja","Butebo","Buyende","Iganga","Jinja","Kaberamaido","Kaliro","Kamuli","Kapchorwa","Katakwi","Kibuku","Kumi","Kween","Luuka","Manafwa","Mayuge","Mbale","Namayingo","Namisindwa","Namutumba","Ngora","Pallisa","Serere","Sironko","Soroti","Tororo"] },
  { name: "Northern Region", districts: ["Abim","Adjumani","Agago","Alebtong","Amolatar","Amudat","Amuru","Apac","Arua","Dokolo","Gulu","Kaabong","Kabong","Karenga","Kitgum","Koboko","Kole","Kotido","Lamwo","Lira","Maracha","Moroto","Moyo","Nakapiripirit","Napak","Nebbi","Nwoya","Omoro","Otuke","Oyam","Pader","Pakwach","Yumbe","Zombo"] },
  { name: "Western Region", districts: ["Bunyangabu","Buhweju","Buliisa","Bundibugyo","Bushenyi","Fort Portal","Hoima","Ibanda","Isingiro","Kabale","Kabarole","Kamwenge","Kanungu","Kasese","Kazo","Kibale","Kiruhura","Kiryandongo","Kisoro","Kitagwenda","Kikuube","Kyegegwa","Kyenjojo","Masindi","Mbarara","Mitooma","Ntoroko","Ntungamo","Rubanda","Rukiga","Rukungiri","Rwampara","Sheema"] },
];

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
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-left flex items-center justify-between bg-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none">
        <span className={value ? "text-gray-900" : "text-gray-400"}>{value || (disabled ? "Select region first" : "Select district...")}</span>
        <FiChevronRight className={`text-gray-400 transition-transform flex-shrink-0 ${open ? "rotate-90" : ""}`} />
      </button>
      {open && (
        <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-y-auto max-h-48">
          {districts.map(d => (
            <li key={d} onClick={() => { onChange(d); setOpen(false); }}
              className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${d === value ? "bg-primary-50 text-primary-700 font-semibold" : "hover:bg-gray-50 text-gray-700"}`}>
              {d}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Field = ({ label, name, icon, error, onChange, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</label>
    <div className="relative">
      {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{icon}</span>}
      <input
        {...props}
        onChange={onChange}
        className={`w-full border rounded-xl py-3 text-sm focus:outline-none focus:ring-2 transition-all
          ${icon ? "pl-9 pr-4" : "px-4"}
          ${error ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-primary-400 focus:ring-primary-100"}`}
      />
    </div>
    {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
  </div>
);

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    region: "",
    city: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.first_name.trim()) e.first_name = "Required";
    if (!form.last_name.trim()) e.last_name = "Required";
    if (!form.email.trim()) e.email = "Required";
    if (!form.password) e.password = "Required";
    else if (form.password.length < 8) e.password = "Minimum 8 characters";
    if (form.password !== form.confirm_password) e.confirm_password = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register({
        first_name: form.first_name,
        last_name: form.last_name,
        username: form.email,
        email: form.email,
        phone: form.phone,
        password: form.password,
        password2: form.confirm_password,
        city: form.city,
        address: form.address,
      });
      navigate("/", { replace: true });
    } catch (err) {
      const data = err?.response?.data;
      if (data && typeof data === "object") {
        setErrors(
          Object.fromEntries(
            Object.entries(data).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])
          )
        );
      } else {
        setErrors({ submit: "Registration failed. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Create account</h1>
        <p className="text-sm text-gray-500 mb-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary-600 font-semibold hover:underline">
            Sign in
          </Link>
        </p>

        {errors.submit && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600 font-medium mb-4">
            <FiAlertCircle className="flex-shrink-0" /> {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="First Name" name="first_name" icon={<FiUser />} placeholder="John" value={form.first_name} onChange={set("first_name")} error={errors.first_name} />
            <Field label="Last Name" name="last_name" icon={<FiUser />} placeholder="Doe" value={form.last_name} onChange={set("last_name")} error={errors.last_name} />
          </div>

          <Field label="Email Address" name="email" icon={<FiMail />} type="email" placeholder="john@example.com" value={form.email} onChange={set("email")} error={errors.email} />
          <Field label="Phone Number (optional)" name="phone" icon={<FiPhone />} type="tel" placeholder="+256 700 000 000" value={form.phone} onChange={set("phone")} error={errors.phone} />

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Region</label>
              <select
                value={form.region}
                onChange={(e) => setForm(f => ({ ...f, region: e.target.value, city: "" }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:border-primary-400 focus:ring-primary-100 bg-white"
              >
                <option value="">Select region...</option>
                {REGIONS.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">District <span className="text-gray-400 font-normal normal-case">(your location)</span></label>
              <DistrictSelect
                districts={REGIONS.find(r => r.name === form.region)?.districts || []}
                value={form.city}
                onChange={(d) => setForm(f => ({ ...f, city: d }))}
                disabled={!form.region}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Street Address <span className="text-gray-400 font-normal normal-case">(optional)</span></label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"><FiMapPin /></span>
              <input type="text" value={form.address} onChange={set("address")}
                placeholder="e.g. Kabundaire, Fort Portal"
                className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:border-primary-400 focus:ring-primary-100" />
            </div>
          </div>

          <Field label="Password" name="password" icon={<FiLock />} type="password" placeholder="••••••••" value={form.password} onChange={set("password")} error={errors.password} />
          <Field label="Confirm Password" name="confirm_password" icon={<FiLock />} type="password" placeholder="••••••••" value={form.confirm_password} onChange={set("confirm_password")} error={errors.confirm_password} />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl transition-all shadow-md text-sm disabled:opacity-60 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2"
          >
            {loading ? "Creating account..." : <><FiCheck /> Create Account</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
