import React from "react";
import { Link } from "react-router-dom";
import {
  FiMapPin, FiPhone, FiMail, FiShoppingBag, FiCheckCircle,
  FiTarget, FiEye, FiBookOpen, FiShield, FiPackage, FiTruck, FiUsers,
} from "react-icons/fi";
import { useSiteSettings } from "../../context/SiteSettingsContext";

const HERO_BG = "https://res.cloudinary.com/d5qqtsou/image/upload/v1/media/categories/Arduino_icon_wbrgvn";

const SectionHeader = ({ label, title, subtitle }) => (
  <div className="text-center mb-10">
    {label && (
      <span className="inline-block text-xs font-bold tracking-widest uppercase text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mb-3">
        {label}
      </span>
    )}
    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{title}</h2>
    {subtitle && (
      <p className="mt-3 text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">{subtitle}</p>
    )}
  </div>
);

const Card = ({ children, className = "" }) => (
  <div className={`bg-white border border-gray-100 rounded-2xl shadow-sm p-6 ${className}`}>
    {children}
  </div>
);

const AboutPage = () => {
  const { sellerOpen } = useSiteSettings();
  return (
  <div className="bg-gray-50 min-h-screen">

    {/* ── Hero with background image ── */}
    <div
      className="relative text-white"
      style={{
        backgroundImage: `url('${HERO_BG}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* dark overlay */}
      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-28 text-center">
        <span className="inline-block text-xs font-bold tracking-widest uppercase bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-1.5 rounded-full mb-5">
          Uganda's Trusted Electronics Store
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight mb-6 drop-shadow-lg">
          About CartPulse
        </h1>
        <p className="text-indigo-100 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-8">
          We sell quality electronics, STEM products, industrial equipment, and everyday essentials
          directly to our customers — handling everything from sourcing to doorstep delivery.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          {["Verified Traders", "Quality Assured", "Doorstep Delivery", "Customer First"].map((tag) => (
            <span key={tag} className="bg-white/15 backdrop-blur-sm border border-white/25 px-4 py-1.5 rounded-full font-medium">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* bottom fade into page bg */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent" />
    </div>

    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-20">

      {/* ── Mission & Vision ── */}
      <section>
        <SectionHeader label="Who We Are" title="Our Mission & Vision" />
        <div className="grid sm:grid-cols-2 gap-6">
          <Card className="border-l-4 border-l-indigo-500">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-indigo-100 text-indigo-600 p-2 rounded-xl">
                <FiTarget size={20} />
              </div>
              <h3 className="font-bold text-gray-800 text-lg">Our Mission</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              To simplify the shopping experience by providing customers with quality products at
              affordable prices through a trusted, transparent, and reliable platform. We are
              committed to ensuring every order is handled with professionalism, accountability,
              and excellent customer service from purchase to doorstep delivery.
            </p>
          </Card>
          <Card className="border-l-4 border-l-indigo-400">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-indigo-100 text-indigo-600 p-2 rounded-xl">
                <FiEye size={20} />
              </div>
              <h3 className="font-bold text-gray-800 text-lg">Our Vision</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              To become East Africa's most trusted online marketplace for electronics, STEM
              products, industrial equipment, and everyday essentials, empowering innovation,
              education, businesses, and communities through convenient access to quality products.
            </p>
          </Card>
        </div>
      </section>

      {/* ── Story ── */}
      <section>
        <SectionHeader label="Our Background" title="Our Story" />
        <Card>
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-indigo-100 text-indigo-600 p-2 rounded-xl">
              <FiBookOpen size={20} />
            </div>
            <h3 className="font-bold text-gray-800">How CartPulse Began</h3>
          </div>
          <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
            <p>
              CartPulse was founded with a vision of transforming how Ugandans shop for
              electronics, industrial equipment, STEM products, and everyday essentials.
            </p>
            <p>
              The idea was born from firsthand experience working on engineering and technology
              projects for universities and schools — frequently struggling to find reliable
              suppliers, spending hours searching through different markets, waiting for packages
              on buses, or traveling long distances, with no guarantee of genuine or quality
              products.
            </p>
            <p>
              These challenges were shared by students, engineers, technicians, businesses, and
              individuals across Uganda. Many genuine traders had no online presence, while
              customers had limited ways to identify trustworthy sellers.
            </p>
            <p>
              CartPulse was established to bridge the gap between customers and verified
              suppliers.
            </p>
            <p>
              Today, CartPulse works with carefully verified traders who supply products through
              our platform. Customers buy directly from CartPulse — not from individual traders.
              We take full responsibility for sourcing, quality assurance, order processing, and
              doorstep delivery.
            </p>
            <p className="font-semibold text-indigo-700 border-l-4 border-indigo-400 pl-4 py-2 bg-indigo-50 rounded-r-xl">
              Our goal is simple: to make quality products easier to find, easier to buy, and
              easier to trust.
            </p>
          </div>
        </Card>

        {/* Team roles */}
        <div className="grid sm:grid-cols-2 gap-6 mt-6">
          {[
            {
              role: "Partnerships & Orders",
              responsibilities: [
                "Manages business partnerships and trader onboarding",
                "Oversees order processing and fulfilment",
                "Ensures every order is accurately handled from placement to dispatch",
              ],
            },
            {
              role: "Trader Relations & Logistics",
              responsibilities: [
                "Tracks products and manages trader relationships",
                "Ensures orders are correctly placed and well-coordinated",
                "Oversees delivery operations and last-mile fulfilment",
              ],
            },
          ].map(({ role, responsibilities }) => (
            <div key={role} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
              <span className="inline-block text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full mb-3">
                {role}
              </span>
              <ul className="space-y-1.5">
                {responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                    <FiCheckCircle className="text-indigo-400 mt-0.5 shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── Growing Team ── */}
      <section>
        <SectionHeader
          label="We're Growing"
          title="A Team Built to Serve You Better"
          subtitle="CartPulse is continuously growing — onboarding new talent, expanding our team, and improving our services to serve you faster and better every day."
        />
        <div
          className="relative rounded-3xl overflow-hidden text-white"
          style={{
            backgroundImage: `url('https://res.cloudinary.com/d5qqtsou/image/upload/v1/media/categories/phones_icons_in9gwb')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 p-8 sm:p-12">
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-white/20 p-2 rounded-xl">
                <FiUsers size={22} />
              </div>
              <h3 className="text-xl font-bold">Growing Together</h3>
            </div>
            <p className="text-indigo-100 text-sm leading-relaxed mb-6 max-w-xl">
              As CartPulse expands across Uganda and East Africa, we are actively onboarding new
              team members — from delivery personnel and customer support agents to operations
              staff and technology specialists. Every new person we bring on board is part of our
              commitment to making your shopping experience faster, smoother, and more reliable.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {[
                { label: "Delivery Network", desc: "Expanding our reach to more cities and towns" },
                { label: "Customer Support", desc: "More agents to assist you quickly and professionally" },
                { label: "Operations Team", desc: "Ensuring every order is processed with precision" },
              ].map(({ label, desc }) => (
                <div key={label} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
                  <p className="font-bold text-white text-sm mb-1">{label}</p>
                  <p className="text-indigo-200 text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
            <p className="text-indigo-200 text-xs italic">
              Our growth is driven by one purpose — to serve you better, every single day.
            </p>
          </div>
        </div>
      </section>

      {/* ── Trust & Credibility ── */}
      <section>
        <SectionHeader
          label="Trust & Credibility"
          title="How We Ensure Quality & Safety"
          subtitle="At CartPulse, trust is the foundation of everything we do. We verify our trading partners, inspect every product, and take full responsibility for every order."
        />
        <div className="grid sm:grid-cols-2 gap-6">
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 text-green-600 p-2 rounded-xl">
                <FiShield size={20} />
              </div>
              <h3 className="font-bold text-gray-800">Trader Verification</h3>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Every trader completes a comprehensive verification process before being approved:
            </p>
            <ul className="space-y-2">
              {[
                "Submission of personal and business information",
                "Verification of business location and contact details",
                "Submission of required identification and business documents",
                "Review of the trader's products and business operations",
                "Physical business visits when additional verification is necessary",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                  <FiCheckCircle className="text-green-500 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-500 mt-4 italic">
              We continuously monitor trader performance to ensure they maintain our standards.
            </p>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 text-blue-600 p-2 rounded-xl">
                <FiPackage size={20} />
              </div>
              <h3 className="font-bold text-gray-800">Quality Assurance</h3>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Every order is verified before it reaches the customer:
            </p>
            <ul className="space-y-2">
              {[
                "Confirming the customer order",
                "Retrieving the product from our inventory or verified trader",
                "Inspecting against ordered specifications, quantity, and condition",
                "Carefully packaging the product for safe transportation",
                "Dispatching through our delivery network",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                  <FiCheckCircle className="text-blue-500 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-500 mt-4 italic">
              If a product does not meet our standards, it is not shipped until the issue is resolved.
            </p>
          </Card>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section>
        <SectionHeader
          label="The Process"
          title="How CartPulse Works"
          subtitle="A simple, transparent process designed to give you a safe and hassle-free shopping experience."
        />
        <div className="relative">
          <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-indigo-100 hidden sm:block" />
          <div className="space-y-5">
            {[
              {
                icon: <FiShoppingBag size={18} />,
                step: "01",
                title: "Place Your Order",
                desc: "Browse our platform, select the products you need, and place your order securely through CartPulse.",
              },
              {
                icon: <FiPackage size={18} />,
                step: "02",
                title: "We Verify & Prepare Your Order",
                desc: "Our team confirms your order. Whether the product is from our inventory or a verified trader, we collect it, inspect it, and package it ourselves before it leaves our hands.",
              },
              {
                icon: <FiTruck size={18} />,
                step: "03",
                title: "Doorstep Delivery",
                desc: "CartPulse delivers directly to your preferred location. You deal with us from start to finish — sourcing, verification, packaging, delivery, and customer support.",
              },
            ].map(({ icon, step, title, desc }, i) => (
              <div key={i} className="flex gap-5 items-start">
                <div className="shrink-0 w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md z-10">
                  {icon}
                </div>
                <Card className="flex-1">
                  <span className="text-xs font-bold text-indigo-400 tracking-widest">STEP {step}</span>
                  <h3 className="font-bold text-gray-800 mt-1 mb-2">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Trust Us ── */}
      <section>
        <SectionHeader label="Why Choose Us" title="Why Customers Trust CartPulse" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            "Verified and approved traders only",
            "Every order is inspected before delivery",
            "Products are carefully packaged by CartPulse",
            "Safe and reliable doorstep delivery",
            "Dedicated customer support",
            "CartPulse takes full responsibility for every order",
          ].map((point, i) => (
            <div key={i} className="flex items-start gap-3 bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
              <div className="bg-indigo-100 text-indigo-600 p-1.5 rounded-lg shrink-0">
                <FiCheckCircle size={16} />
              </div>
              <p className="text-sm text-gray-700 font-medium leading-snug">{point}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Locations ── */}
      <section>
        <SectionHeader label="Where We Are" title="Our Locations" />
        <div className="grid sm:grid-cols-2 gap-5">
          <Card className="border-t-4 border-t-indigo-500">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-indigo-100 text-indigo-600 p-2 rounded-xl">
                <FiMapPin size={18} />
              </div>
              <div>
                <p className="font-bold text-gray-800">Fort Portal</p>
                <span className="text-xs bg-indigo-100 text-indigo-600 font-semibold px-2 py-0.5 rounded-full">
                  Main Office
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">Fort Portal City, Western Uganda</p>
          </Card>
          <Card className="border-t-4 border-t-gray-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-gray-100 text-gray-600 p-2 rounded-xl">
                <FiMapPin size={18} />
              </div>
              <div>
                <p className="font-bold text-gray-800">Kampala</p>
                <span className="text-xs bg-gray-100 text-gray-600 font-semibold px-2 py-0.5 rounded-full">
                  Branch
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">Kampala, Central Uganda</p>
          </Card>
        </div>
      </section>

      {/* ── Contact ── */}
      <section>
        <SectionHeader label="Contact Us" title="Get in Touch" />
        <Card>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-start sm:items-center">
            <a href="mailto:balanceiq81@gmail.com" className="flex items-center gap-3 text-gray-700 hover:text-indigo-600 transition-colors group">
              <div className="bg-indigo-100 group-hover:bg-indigo-200 text-indigo-600 p-2 rounded-xl transition-colors">
                <FiMail size={18} />
              </div>
              <span className="text-sm font-medium">balanceiq81@gmail.com</span>
            </a>
            <a href="tel:+256794448439" className="flex items-center gap-3 text-gray-700 hover:text-indigo-600 transition-colors group">
              <div className="bg-indigo-100 group-hover:bg-indigo-200 text-indigo-600 p-2 rounded-xl transition-colors">
                <FiPhone size={18} />
              </div>
              <span className="text-sm font-medium">+256 794 448 439</span>
            </a>
            <a href="tel:+256706721334" className="flex items-center gap-3 text-gray-700 hover:text-indigo-600 transition-colors group">
              <div className="bg-indigo-100 group-hover:bg-indigo-200 text-indigo-600 p-2 rounded-xl transition-colors">
                <FiPhone size={18} />
              </div>
              <span className="text-sm font-medium">+256 706 721 334</span>
            </a>
          </div>
        </Card>
      </section>

      {/* ── Trader CTA ── */}
      <section
        className="relative rounded-3xl overflow-hidden text-white"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 p-10 text-center">
          <h2 className="text-2xl font-extrabold mb-3">Are You a Trader?</h2>
          <p className="text-indigo-100 text-sm mb-6 max-w-md mx-auto">
            Join CartPulse as a verified trader and reach customers across Uganda. We handle
            the sales, delivery, and customer service — you focus on your products.
          </p>
        {sellerOpen ? (
          <Link
            to="/trader/register"
            className="inline-flex items-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 font-bold px-8 py-3 rounded-xl transition-all shadow-lg"
          >
            <FiShoppingBag /> Apply to Sell with CartPulse
          </Link>
        ) : (
          <p className="text-indigo-200 text-sm font-semibold">Seller registration is currently closed. Check back soon.</p>
        )}
        </div>
      </section>

    </div>
  </div>
  );
};

export default AboutPage;
