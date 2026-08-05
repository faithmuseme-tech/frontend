import React from "react";
import { FiShield, FiLock, FiEyeOff, FiUser, FiDatabase, FiAlertTriangle, FiTruck, FiUsers } from "react-icons/fi";

const Section = ({ icon, color, title, children }) => {
  const bg = {
    indigo: "bg-indigo-50 border-indigo-100", green: "bg-green-50 border-green-100",
    gray: "bg-gray-50 border-gray-100", blue: "bg-blue-50 border-blue-100",
    amber: "bg-amber-50 border-amber-100", red: "bg-red-50 border-red-100",
    purple: "bg-purple-50 border-purple-100",
  };
  const tc = {
    indigo: "text-indigo-800", green: "text-green-800", gray: "text-gray-800",
    blue: "text-blue-800", amber: "text-amber-800", red: "text-red-700", purple: "text-purple-800",
  };
  return (
    <div className={`border rounded-2xl p-5 ${bg[color]}`}>
      <div className={`flex items-center gap-2 font-bold mb-3 ${tc[color]}`}>{icon} {title}</div>
      {children}
    </div>
  );
};

const List = ({ items }) => (
  <ul className="text-sm text-gray-600 space-y-1.5 list-disc list-inside">
    {items.map((item, i) => <li key={i}>{item}</li>)}
  </ul>
);

const PrivacyPage = () => (
  <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14 space-y-8">
    <div>
      <h1 className="text-3xl font-extrabold text-gray-900">Privacy Policy</h1>
      <p className="mt-3 text-gray-500">
        Last updated: {new Date().getFullYear()}. This policy explains how CartPulse collects,
        uses, and protects your personal information as a marketplace and delivery platform.
      </p>
    </div>

    <Section icon={<FiUser />} color="indigo" title="What Information We Collect">
      <List items={[
        "Full name, email address, and phone number when you register an account.",
        "Delivery address, village or town, and location details for order fulfilment.",
        "Order history, product preferences, and browsing activity on the platform.",
        "Trader business name, contact details, and product listings for registered traders.",
        "Payment confirmation details (we do not store Mobile Money PINs or card details).",
        "Device and browser information for security and platform improvement purposes.",
        "Communication records such as messages or calls made to our customer care team.",
      ]} />
    </Section>

    <Section icon={<FiLock />} color="green" title="How We Use Your Information">
      <List items={[
        "To process and confirm your orders.",
        "To contact you regarding your order status, delivery, or any issues.",
        "To verify payments and prevent fraud.",
        "To improve the CartPulse platform and user experience.",
        "To communicate important updates about your account or orders.",
        "To verify trader identities and ensure only legitimate sellers list on the platform.",
        "To calculate and communicate any additional delivery fees for remote or village locations.",
        "To investigate and resolve disputes, complaints, or reports of fake products.",
      ]} />
    </Section>

    <Section icon={<FiTruck />} color="purple" title="Delivery & Location Data">
      <p className="text-sm text-gray-600 leading-relaxed">
        When you place an order, we collect your delivery address and location details to arrange
        delivery to the nearest pick-up station. If you are located in a village or remote area
        beyond standard pick-up points, we may use your location information to advise you on
        additional delivery arrangements and costs. This information is used solely for order
        fulfilment and is never shared with third parties.
      </p>
    </Section>

    <Section icon={<FiEyeOff />} color="gray" title="No Third-Party Sharing">
      <p className="text-sm text-gray-600 leading-relaxed">
        CartPulse does not share, sell, rent, or disclose any personal information — including
        customer emails, phone numbers, order details, location data, or trader information — to
        any third party under any circumstances. Your data belongs to you and is used solely to
        operate and improve the CartPulse service.
      </p>
    </Section>

    <Section icon={<FiDatabase />} color="blue" title="Data Storage & Security">
      <List items={[
        "All data is stored securely on protected servers.",
        "Access to personal data is restricted to authorised CartPulse staff only.",
        "We use industry-standard encryption to protect data in transit.",
        "We do not store Mobile Money PINs, card PINs, OTPs, or account passwords.",
        "CartPulse staff will never ask you for your PIN, OTP, or password — by call, message, or any other means.",
        "Our systems are regularly reviewed to ensure data security and integrity.",
      ]} />
    </Section>

    <Section icon={<FiUsers />} color="indigo" title="Trader Data & Verification">
      <List items={[
        "Trader business information is collected during the registration process for verification purposes.",
        "Trader data is used to verify legitimacy and ensure only genuine sellers list on CartPulse.",
        "Trader product listings, pricing, and business details are visible to customers on the platform.",
        "Traders who are banned for selling fake products will have their data retained for legal and security purposes.",
        "CartPulse does not share trader personal contact details with customers or third parties.",
      ]} />
    </Section>

    <Section icon={<FiShield />} color="amber" title="Your Rights">
      <List items={[
        "You may request to view the personal information we hold about you at any time.",
        "You may request correction of inaccurate information.",
        "You may request deletion of your account and associated data by contacting us.",
        "You may opt out of non-essential communications at any time.",
        "You have the right to know how your data is being used and to raise concerns about its use.",
      ]} />
    </Section>

    <Section icon={<FiAlertTriangle />} color="red" title="Fraud & Impersonation Warning">
      <p className="text-sm text-gray-600 leading-relaxed">
        CartPulse will never contact you asking for your Mobile Money PIN, card PIN, OTP, or
        account password. If you receive any such request from someone claiming to be CartPulse,
        do not comply. Ask for the safety word — the answer must be{" "}
        <span className="font-bold text-gray-800">"AISLE VERIFIED"</span>. Report any suspicious
        contact immediately to{" "}
        <a href="mailto:balanceiq81@gmail.com" className="font-semibold text-red-600 hover:underline">balanceiq81@gmail.com</a>
        {" "}or call{" "}
        <a href="tel:+256794448439" className="font-semibold text-red-600 hover:underline">0794 448 439</a>.
      </p>
    </Section>

    <p className="text-xs text-gray-400 pt-2">
      This policy applies to all users of CartPulse including customers and traders.
      For questions, contact us at{" "}
      <a href="mailto:balanceiq81@gmail.com" className="text-indigo-500 hover:underline">balanceiq81@gmail.com</a>.
    </p>
  </div>
);

export default PrivacyPage;
