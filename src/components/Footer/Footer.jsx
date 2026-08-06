import React from "react";
import { Link } from "react-router-dom";
import {
  FiMail, FiPhone,
  FiFacebook, FiTwitter, FiInstagram, FiYoutube,
} from "react-icons/fi";
import { FaWhatsapp, FaTiktok } from "react-icons/fa";
import CartPulseLogo from "../Logo/CartPulseLogo";
import { useSiteSettings } from "../../context/SiteSettingsContext";

const footerLinks = {
  Company: [
    { label: "About Us", to: "/about" },
    { label: "Contact Us", to: "/contact" },
  ],
  "Customer Service": [
    { label: "Help Center",      to: "/help" },
    { label: "Shipping Info",    to: "/shipping" },
    { label: "Returns & Refunds", to: "/returns" },
    { label: "FAQs",             to: "/faqs" },
    { label: "How to Pay",       to: "/how-to-pay" },
  ],
  Shopping: [
    { label: "All Categories", to: "/categories" },
    { label: "Top Brands", to: "/brands" },
    { label: "New Arrivals", to: "/new-arrivals" },
    { label: "Shop", to: "/shop" },
    { label: "Loyalty Rewards", to: "/loyalty" },
  ],
  Legal: [
    { label: "Privacy Policy",      to: "/privacy" },
    { label: "Terms & Conditions",   to: "/terms" },
    { label: "Cookie Notice",        to: "/cookie-notice" },
    { label: "Cookie Preferences",   to: "/cookie-preferences" },
  ],
};

const socials = [
  { icon: <FiFacebook />,  label: "Facebook",  href: "https://facebook.com/CartPulse" },
  { icon: <FiTwitter />,   label: "Twitter",   href: "https://twitter.com/CartPulse" },
  { icon: <FiInstagram />, label: "Instagram", href: "https://instagram.com/CartPulse" },
  { icon: <FiYoutube />,   label: "YouTube",   href: "https://youtube.com/@CartPulse" },
  { icon: <FaTiktok />,    label: "TikTok",    href: "https://tiktok.com/@CartPulse" },
  { icon: <FaWhatsapp />,  label: "WhatsApp",  href: "https://wa.me/256794448439" },
];

const Footer = () => {
  const { sellerOpen } = useSiteSettings();

  return (

    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <CartPulseLogo size={36} textClass="text-xl font-extrabold" dark />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              CartPulse is Uganda's trusted online store — we source, verify, and sell quality electronics, STEM products, and everyday essentials with reliable delivery across Uganda.
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <a href="mailto:information.cartpulse@gmail.com" className="flex items-center gap-2 hover:text-primary-400 transition-colors">
                <FiMail className="text-primary-500 flex-shrink-0" /> information.cartpulse@gmail.com
              </a>
              <a href="tel:+256794448439" className="flex items-center gap-2 hover:text-primary-400 transition-colors">
                <FiPhone className="text-primary-500 flex-shrink-0" /> +256 794 448 439
              </a>

            </div>
          </div>

          {/* Links — 2 cols on mobile, 4 on lg */}
          <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">{title}</h4>
                <ul className="flex flex-col gap-2.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link to={link.to} className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                  {/* Sell with CartPulse — only in Company column, controlled by admin */}
                  {title === "Company" && sellerOpen && (
                    <li>
                      <Link to="/trader/register" className="text-sm text-orange-400 hover:text-orange-300 font-semibold transition-colors">
                        Sell with CartPulse
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-500 space-y-1 text-center sm:text-left">
            <p>© {new Date().getFullYear()} CartPulse. All rights reserved.</p>
            <p className="text-xs text-gray-600">Online Store &amp; Delivery — Uganda</p>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-primary-600 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
              >
                {s.icon}
              </a>
            ))}
          </div>


        </div>
      </div>
    </footer>
  );
};

export default Footer;
