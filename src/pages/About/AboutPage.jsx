import React from "react";
import {
  FiPhone, FiMail, FiShoppingBag, FiCheckCircle,
  FiTarget, FiEye, FiBookOpen, FiShield, FiPackage, FiTruck, FiUsers,
} from "react-icons/fi";

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

const AboutPage = () => (
  <div className="bg-gray-50 min-h-screen">

    {/* Hero */}
    <div
      className="relative text-white"
      style={{ backgroundImage: `url('${HERO_BG}')`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}
    >
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
          {["Quality Assured", "Doorstep Delivery", "Customer First", "Genuine Products"].map((tag) => (
            <span key={tag} className="bg-white/15 backdrop-blur-sm border border-white/25 px-4 py-1.5 rounded-full font-medium">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent" />
    </div>

    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-20">

      {/* Mission & Vision */}
      <section>
        <SectionHeader label="Who We Are" title="Our Mission & Vision" />
        <div className="grid sm:grid-cols-2 gap-6">
          <Card className="border-l-4 border-l-indigo-500">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-indigo-100 text-indigo-600 p-2 rounded-xl"><FiTarget size={20} /></div>
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
              <div className="bg-indigo-100 text-indigo-600 p-2 rounded-xl"><FiEye size={20} /></div>
              <h3 className="font-bold text-gray-800 text-lg">Our Vision</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              To become East Africa's most trusted online store for electronics, STEM products,
              industrial equipment, and everyday essentials, empowering innovation, education,
              businesses, and communities through convenient access to quality products.
            </p>
          </Card>
        </div>
      </section>

      {/* Story */}
      <section>
        <SectionHeader label="Our Background" title="Our Story" />
        <Card>
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-indigo-100 text-indigo-600 p-2 rounded-xl"><FiBookOpen size={20} /></div>
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
              on buses, or traveling long distances, with no guarantee of genuine or quality products.
            </p>
            <p>
              CartPulse was established to make it easy for Ugandans to access quality products
              without the hassle of unreliable markets or uncertain deliveries.
            </p>
            <p>
              Today, CartPulse sources, verifies, and sells products directly to customers.
              We take full responsibility for sourcing, quality assurance, order processing, and
              doorstep delivery.
            </p>
            <p className="font-semibold text-indigo-700 border-l-4 border-indigo-400 pl-4 py-2 bg-indigo-50 rounded-r-xl">
              Our goal is simple: to make quality products easier to find, easier to buy, and easier to trust.
            </p>
          </div>
        </Card>

        <div className="grid sm:grid-cols-2 gap-6 mt-6">
          {[
            {
              role: "Procurement & Orders",
              responsibilities: [
                "Sources and procures products for the platform",
                "Oversees order processing and fulfilment",
                "Ensures every order is accurately handled from placement to dispatch",
              ],
            },
            {
              role: "Logistics & Delivery",
              responsibilities: [
                "Manages inventory and stock coordination",
                "Ensures orders are correctly packed and dispatched",
                "Oversees delivery operations and last-mile fulfilment",
              ],
            },
          ].map(({ role, responsibilities }) => (
            <div key={role} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
              <span className="inline-block text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full mb-3">{role}</span>
              <ul className="space-y-1.5">
                {responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                    <FiCheckCircle className="text-indigo-400 mt-0.5 shrink-0" />{r}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Growing Team */}
      <section>
        <SectionHeader
          label="We're Growing"
          title="A Team Built to Serve You Better"
          subtitle="CartPulse is continuously growing — onboarding new talent, expanding our team, and improving our services to serve you faster and better every day."
        />
        <div
          className="relative rounded-3xl overflow-hidden text-white"
          style={{ backgroundImage: `url('https://res.cloudinary.com/d5qqtsou/image/upload/v1/media/categories/phones_icons_in9gwb')`, backgroundSize: "cover", backgroundPosition: "center" }}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 p-8 sm:p-12">
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-white/20 p-2 rounded-xl"><FiUsers size={22} /></div>
              <h3 className="text-xl font-bold">Growing Together</h3>
            </div>
            <p className="text-indigo-100 text-sm leading-relaxed mb-6 max-w-xl">
              As CartPulse expands across Uganda and East Africa, we are actively onboarding new
              team members — from delivery personnel and customer support agents to operations
              staff and technology specialists.
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
            <p className="text-indigo-200 text-xs italic">Our growth is driven by one purpose — to serve you better, every single day.</p>
          </div>
        </div>
      </section>

      {/* Trust & Credibility */}
      <section>
        <SectionHeader
          label="Trust & Credibility"
          title="How We Ensure Quality & Safety"
          subtitle="At CartPulse, trust is the foundation of everything we do. We source carefully, inspect every product, and take full responsibility for every order."
        />
        <div className="grid sm:grid-cols-2 gap-6">
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 text-green-600 p-2 rounded-xl"><FiShield size={20} /></div>
              <h3 className="font-bold text-gray-800">Product Verification</h3>
            </div>
            <p className="text-xs text-gray-500 mb-3">Every product is verified before being listed or sold:</p>
            <ul className="space-y-2">
              {[
                "Products are sourced from trusted and verified suppliers",
                "Each product is inspected for quality and authenticity",
                "Accurate descriptions, images, and pricing are confirmed before listing",
                "Products that do not meet our standards are not sold",
                "We continuously review our catalogue to maintain quality",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                  <FiCheckCircle className="text-green-500 mt-0.5 shrink-0" />{item}
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 text-blue-600 p-2 rounded-xl"><FiPackage size={20} /></div>
              <h3 className="font-bold text-gray-800">Quality Assurance</h3>
            </div>
            <p className="text-xs text-gray-500 mb-3">Every order is verified before it reaches the customer:</p>
            <ul className="space-y-2">
              {[
                "Confirming the customer order",
                "Retrieving the product from our inventory",
                "Inspecting against ordered specifications, quantity, and condition",
                "Carefully packaging the product for safe transportation",
                "Dispatching for doorstep delivery to your address",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                  <FiCheckCircle className="text-blue-500 mt-0.5 shrink-0" />{item}
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-500 mt-4 italic">
              If a product does not meet our standards, it is not shipped until the issue is resolved.
            </p>
          </Card>
        </div>
      </section>

      {/* How It Works */}
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
              { icon: <FiShoppingBag size={18} />, step: "01", title: "Place Your Order", desc: "Browse our platform, select the products you need, and place your order securely through CartPulse." },
              { icon: <FiPackage size={18} />, step: "02", title: "We Verify & Prepare Your Order", desc: "Our team confirms your order, retrieves the product from our inventory, inspects it, and packages it before dispatch." },
              { icon: <FiTruck size={18} />, step: "03", title: "Doorstep Delivery", desc: "CartPulse delivers directly to your doorstep in the listed delivery towns. We do not operate pick-up stations — you do not need to go anywhere. You deal with us from start to finish — sourcing, verification, packaging, delivery, and customer support." },
            ].map(({ icon, step, title, desc }, i) => (
              <div key={i} className="flex gap-5 items-start">
                <div className="shrink-0 w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md z-10">{icon}</div>
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

      {/* Why Trust Us */}
      <section>
        <SectionHeader label="Why Choose Us" title="Why Customers Trust CartPulse" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            "Quality products sourced and verified by CartPulse",
            "Every order is inspected before delivery",
            "Products are carefully packaged by our team",
            "Safe and reliable doorstep delivery",
            "Dedicated customer support",
            "CartPulse takes full responsibility for every order",
          ].map((point, i) => (
            <div key={i} className="flex items-start gap-3 bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
              <div className="bg-indigo-100 text-indigo-600 p-1.5 rounded-lg shrink-0"><FiCheckCircle size={16} /></div>
              <p className="text-sm text-gray-700 font-medium leading-snug">{point}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section>
        <SectionHeader label="Contact Us" title="Get in Touch" />
        <Card>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-start sm:items-center">
            <a href="mailto:information.cartpulse@gmail.com" className="flex items-center gap-3 text-gray-700 hover:text-indigo-600 transition-colors group">
              <div className="bg-indigo-100 group-hover:bg-indigo-200 text-indigo-600 p-2 rounded-xl transition-colors"><FiMail size={18} /></div>
              <span className="text-sm font-medium">information.cartpulse@gmail.com</span>
            </a>
            <a href="tel:+256794448439" className="flex items-center gap-3 text-gray-700 hover:text-indigo-600 transition-colors group">
              <div className="bg-indigo-100 group-hover:bg-indigo-200 text-indigo-600 p-2 rounded-xl transition-colors"><FiPhone size={18} /></div>
              <span className="text-sm font-medium">+256 794 448 439</span>
            </a>
            <a href="tel:+256706721334" className="flex items-center gap-3 text-gray-700 hover:text-indigo-600 transition-colors group">
              <div className="bg-indigo-100 group-hover:bg-indigo-200 text-indigo-600 p-2 rounded-xl transition-colors"><FiPhone size={18} /></div>
              <span className="text-sm font-medium">+256 706 721 334</span>
            </a>
          </div>
        </Card>
      </section>

    </div>
  </div>
);

export default AboutPage;
