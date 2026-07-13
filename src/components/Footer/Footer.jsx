import React from "react";
import { Link } from "react-router-dom";
import {
  FiMail, FiPhone, FiMapPin, FiShoppingBag,
  FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiLinkedin,
} from "react-icons/fi";
import PrimeAisleLogo from "../Logo/PrimeAisleLogo";

const footerLinks = {
  Company: [
    { label: "About Us", to: "/about" },
    { label: "Careers", to: "/careers" },
    { label: "Contact", to: "/contact" },
    { label: "Blog", to: "/blog" },
  ],
  "Customer Service": [
    { label: "Help Center", to: "/help" },
    { label: "Shipping Info", to: "/shipping" },
    { label: "Returns & Refunds", to: "/returns" },
    { label: "FAQs", to: "/faqs" },
  ],
  Shopping: [
    { label: "All Categories", to: "/categories" },
    { label: "Top Brands", to: "/brands" },
    { label: "Deals & Offers", to: "/deals" },
    { label: "New Arrivals", to: "/new-arrivals" },
  ],
  Legal: [
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Terms & Conditions", to: "/terms" },
    { label: "Cookie Policy", to: "/cookies" },
    { label: "Accessibility", to: "/accessibility" },
  ],
};

const socials = [
  { icon: <FiFacebook />, label: "Facebook", href: "#" },
  { icon: <FiTwitter />, label: "Twitter", href: "#" },
  { icon: <FiInstagram />, label: "Instagram", href: "#" },
  { icon: <FiYoutube />, label: "YouTube", href: "#" },
  { icon: <FiLinkedin />, label: "LinkedIn", href: "#" },
];

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <PrimeAisleLogo size={36} textClass="text-xl font-extrabold" dark />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Your trusted destination for premium electronics. We bring you the latest tech at unbeatable prices with fast, reliable delivery.
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <a href="mailto:support@primeaisle.com" className="flex items-center gap-2 hover:text-primary-400 transition-colors">
                <FiMail className="text-primary-500" /> support@primeaisle.com
              </a>
              <a href="tel:+256800000000" className="flex items-center gap-2 hover:text-primary-400 transition-colors">
                <FiPhone className="text-primary-500" /> +256 800 000 000
              </a>
              <span className="flex items-center gap-2">
                <FiMapPin className="text-primary-500 flex-shrink-0" /> Kampala, Uganda
              </span>
            </div>
            {/* Sell CTA */}
            <Link
              to="/trader/register"
              className="mt-5 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all"
            >
              <FiShoppingBag /> Sell with PrimeAisle
            </Link>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">{title}</h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-gray-400 hover:text-primary-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} PrimeAisle. All rights reserved.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-primary-600 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
              >
                {s.icon}
              </a>
            ))}
          </div>

          {/* Payment icons */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>We accept:</span>
            {["Visa", "MC", "PayPal", "Amex"].map((p) => (
              <span key={p} className="bg-gray-800 px-2 py-1 rounded text-gray-400 font-medium">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
