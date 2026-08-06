import React from "react";
import { FiShield, FiLock, FiEyeOff, FiUser, FiDatabase, FiAlertTriangle, FiTruck, FiPhone, FiMail, FiMessageSquare, FiX, FiCheck, FiCheckCircle } from "react-icons/fi";

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
        uses, and protects your personal information.
      </p>
    </div>

    <Section icon={<FiUser />} color="indigo" title="What Information We Collect">
      <List items={[
        "Full name, email address, and phone number when you register an account.",
        "Delivery address and location details for order fulfilment.",
        "Order history, product preferences, and browsing activity on the platform.",
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
        "To calculate and communicate any additional delivery fees for remote or village locations.",
        "To investigate and resolve disputes, complaints, or reports of product issues.",
      ]} />
    </Section>

    <Section icon={<FiTruck />} color="purple" title="Delivery & Location Data">
      <p className="text-sm text-gray-600 leading-relaxed">
        When you place an order, we collect your delivery address and location details to arrange
        doorstep delivery to your address. CartPulse does not operate pick-up stations — your order
        is delivered directly to you. If you are located outside a listed delivery town, we may use
        your location information to advise you on additional delivery arrangements and costs.
        This information is used solely for order fulfilment and is never shared with third parties.
      </p>
    </Section>

    <Section icon={<FiEyeOff />} color="gray" title="No Third-Party Sharing">
      <p className="text-sm text-gray-600 leading-relaxed">
        CartPulse does not share, sell, rent, or disclose any personal information — including
        customer emails, phone numbers, order details, or location data — to any third party
        under any circumstances. Your data belongs to you and is used solely to operate and
        improve the CartPulse service.
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
      <div className="space-y-4">
        {/* How CartPulse contacts you */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 font-bold text-blue-800 text-sm"><FiShield /> How CartPulse Will Contact You</div>
          <p className="text-sm text-gray-600">
            If we need to reach you about your order, we will <span className="font-semibold text-gray-800">only</span> contact you from these verified numbers:
          </p>
          <div className="space-y-2">
            {[
              { number: "0794 448 439", label: "Primary — SABIRA SSEMATA" },
              { number: "0786 023 858", label: "Support line" },
            ].map(({ number, label }) => (
              <div key={number} className="flex items-center gap-3 bg-white rounded-xl px-4 py-2.5 border border-blue-100">
                <FiPhone className="text-blue-500 flex-shrink-0" size={14} />
                <span className="font-bold text-gray-900">{number}</span>
                <span className="text-xs text-gray-400">{label}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600">
            We will always mention your <span className="font-semibold text-gray-800">order number</span> and the <span className="font-semibold text-gray-800">exact items</span> you ordered.
            To verify you are speaking with a genuine CartPulse agent, ask them to confirm your <span className="font-semibold text-gray-800">order number</span> — a real agent will always know it without you telling them first.
          </p>
        </div>

        {/* We will NEVER do this */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 font-bold text-red-700 text-sm"><FiAlertTriangle /> CartPulse Will NEVER Do This</div>
          <p className="text-sm text-gray-500">If anyone claiming to be CartPulse does any of the following, it is a scam — hang up immediately.</p>
          <ul className="space-y-2">
            {[
              "Ask for your Mobile Money PIN",
              "Ask for any OTP or verification code",
              "Ask for your CartPulse account password",
              "Ask you to send money to any number other than 0794 448 439 (SABIRA SSEMATA)",
              "Ask you to send money before you have placed an order on the website",
              "Send you a link and ask you to log in or pay through it",
              "Pressure you to pay urgently without giving you time to verify",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700">
                <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FiX className="text-red-500" size={11} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* What a real CartPulse call looks like */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 font-bold text-green-800 text-sm"><FiCheckCircle /> What a Real CartPulse Call Looks Like</div>
          <ul className="space-y-2">
            {[
              "We introduce ourselves as CartPulse and mention your order number",
              "We confirm the items you ordered by name",
              "We only ask you to send payment to 0794 448 439 (SABIRA SSEMATA)",
              "We remind you to put your full name as the reference",
              "We give you time to verify before paying — no pressure",
              "We confirm the safety word sent privately to you at order time if you ask",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700">
                <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FiCheck className="text-green-600" size={11} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>



        {/* Report */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 font-bold text-gray-700 mb-2 text-sm"><FiAlertTriangle className="text-orange-500" /> Suspect a Scam? Report Immediately</div>
          <p className="text-sm text-gray-600 mb-3">
            If you receive a suspicious call or message claiming to be CartPulse, do not pay anything. Report it right away:
          </p>
          <div className="space-y-1.5 text-sm">
            <p className="flex items-center gap-2"><FiMail className="text-indigo-500 flex-shrink-0" size={14} /> <a href="mailto:information.cartpulse@gmail.com" className="font-semibold text-indigo-600 hover:underline">information.cartpulse@gmail.com</a></p>
            <p className="flex items-center gap-2"><FiMessageSquare className="text-indigo-500 flex-shrink-0" size={14} /> WhatsApp: <a href="https://wa.me/256786023858" className="font-semibold text-indigo-600 hover:underline">0786 023 858</a></p>
            <p className="flex items-center gap-2"><FiPhone className="text-indigo-500 flex-shrink-0" size={14} /> Call: <a href="tel:+256794448439" className="font-semibold text-indigo-600 hover:underline">0794 448 439</a></p>
          </div>
        </div>
      </div>
    </Section>

    <p className="text-xs text-gray-400 pt-2">
      This policy applies to all users of CartPulse.
      For questions, contact us at{" "}
      <a href="mailto:information.cartpulse@gmail.com" className="text-indigo-500 hover:underline">information.cartpulse@gmail.com</a>.
    </p>
  </div>
);

export default PrivacyPage;
