import React from "react";
import {
  FiFileText, FiAlertTriangle, FiShield, FiRefreshCw,
  FiPackage, FiUsers, FiLock, FiTruck, FiMapPin, FiSlash,
} from "react-icons/fi";

const Section = ({ icon, title, color = "gray", children }) => {
  const colors = {
    gray:   "bg-gray-50 border-gray-100",
    indigo: "bg-indigo-50 border-indigo-100",
    green:  "bg-green-50 border-green-100",
    red:    "bg-red-50 border-red-100",
    amber:  "bg-amber-50 border-amber-100",
    blue:   "bg-blue-50 border-blue-100",
    purple: "bg-purple-50 border-purple-100",
    rose:   "bg-rose-50 border-rose-100",
  };
  const titleColors = {
    gray: "text-gray-800", indigo: "text-indigo-800", green: "text-green-800",
    red: "text-red-700", amber: "text-amber-800", blue: "text-blue-800",
    purple: "text-purple-800", rose: "text-rose-700",
  };
  return (
    <div className={`border rounded-2xl p-5 ${colors[color]}`}>
      <div className={`flex items-center gap-2 font-bold mb-3 ${titleColors[color]}`}>{icon} {title}</div>
      {children}
    </div>
  );
};

const List = ({ items }) => (
  <ul className="text-sm text-gray-600 space-y-1.5 list-disc list-inside">
    {items.map((item, i) => <li key={i}>{item}</li>)}
  </ul>
);

const TermsPage = () => (
  <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14 space-y-8">
    <div>
      <h1 className="text-3xl font-extrabold text-gray-900">Terms & Conditions</h1>
      <p className="mt-3 text-gray-500">
        Last updated: {new Date().getFullYear()}. By using CartPulse, you agree to the following terms.
        Please read them carefully before placing an order or registering an account.
      </p>
    </div>

    {/* About CartPulse */}
    <Section icon={<FiShield />} title="About CartPulse" color="indigo">
      <p className="text-sm text-gray-600 leading-relaxed">
        CartPulse is a <span className="font-semibold text-gray-800">marketplace and delivery platform</span> based
        in Uganda. We connect verified traders with customers across the country, offering a wide range of genuine
        products with reliable delivery. CartPulse is not just a shop — it is a full marketplace where multiple
        verified sellers list their products, and we handle the delivery process to bring those products to you.
      </p>
    </Section>

    {/* Orders & Payment */}
    <Section icon={<FiFileText />} title="Orders & Payment" color="blue">
      <List items={[
        "An order is only confirmed after full payment is received and verified by our team.",
        "Payment is made via Mobile Money only — send to 0794 448 439 in the names of SABIRA SSEMATA.",
        "No payment is processed through the platform itself.",
        "After submitting your order or payment, our team may call you on 0794 448 439 to verify and confirm your order.",
        "Always confirm payment with customer care on 0786 023 858 or 0794 448 439 via WhatsApp or call.",
        "CartPulse will never ask you to pay to any number other than 0794 448 439 (SABIRA SSEMATA).",
      ]} />
    </Section>

    {/* Order Holding */}
    <Section icon={<FiPackage />} title="Order Holding Policy" color="green">
      <List items={[
        "Paid orders are held for up to 2 weeks from the date of payment confirmation.",
        "If you need more time, notify us before the 2-week period expires — additional holding fees apply.",
        "If a product is not picked up within 2 weeks and no communication has been made, CartPulse reserves the right to return the product to stock.",
        "CartPulse is not liable for any loss arising from failure to collect within the holding period.",
      ]} />
    </Section>

    {/* Delivery & Village Policy */}
    <Section icon={<FiTruck />} title="Delivery & Shipping Policy" color="purple">
      <p className="text-sm text-gray-600 leading-relaxed mb-3">
        CartPulse delivers to designated pick-up stations and delivery points across Uganda.
        Customers are responsible for collecting their orders from the nearest available station.
      </p>
      <List items={[
        "Standard delivery covers designated pick-up stations and major town centres.",
        "Customers who reside in villages or remote areas far beyond the nearest pick-up station are fully responsible for any additional transportation or delivery costs incurred to reach their location.",
        "CartPulse will NOT incur or cover extra costs for deliveries beyond standard pick-up points.",
        "It is the customer's responsibility to arrange and pay for any last-mile transport from the pick-up station to their home or village.",
        "CartPulse is not liable for delays or losses that occur after the product has been handed over at the pick-up station.",
        "Customers will be notified when their order arrives at the nearest pick-up station.",
        "Delivery timelines are estimates and may vary depending on location and availability.",
      ]} />
      <div className="mt-3 bg-amber-100 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 font-medium">
        Note: If you live in a village or far from a pick-up station, please contact us before ordering so we can advise on the best delivery arrangement and any additional fees that may apply.
      </div>
    </Section>

    {/* Returns & Refunds */}
    <Section icon={<FiRefreshCw />} title="Returns & Refunds" color="green">
      <List items={[
        "Returns are accepted only for products with a fault or defect present at the time of delivery.",
        "The product must be unused and show no physical damage caused by the customer.",
        "Damage caused by customer carelessness — including poor wiring, physical impact, or liquid damage — is not covered and will not be compensated.",
        "Once a product encounters a problem during use due to mishandling, CartPulse bears no responsibility.",
        "Return processing takes up to 1 week from the date we receive the product.",
        "Money reimbursement is issued only after thorough analysis and verification of the returned product.",
        "If the product is found to be faulty through no fault of the customer, a full refund is issued.",
      ]} />
    </Section>

    {/* Safety & Fraud */}
    <Section icon={<FiShield />} title="Safety & Fraud Prevention" color="amber">
      <p className="text-sm text-gray-600 leading-relaxed mb-3">
        CartPulse takes your security seriously. Our team will never ask you for sensitive information.
        To verify you are speaking with a genuine CartPulse representative, ask for the safety word:{" "}
        <span className="font-bold text-gray-900">"AISLE VERIFIED"</span>. A genuine agent will always confirm it.
        You may also ask for the secondary safety phrase:{" "}
        <span className="font-bold text-gray-900">"PRIME SECURE"</span> — our team will always respond with it.
      </p>
      <List items={[
        "CartPulse staff will NEVER ask for your Mobile Money PIN.",
        "CartPulse staff will NEVER ask for any card PIN or OTP.",
        "CartPulse staff will NEVER ask for your CartPulse account password.",
        "CartPulse staff will NEVER ask you to send money to any number other than 0794 448 439 (SABIRA SSEMATA).",
        "Our official contact number is 0794 448 439. Any call from a different number claiming to be CartPulse should be treated with caution.",
        "If anyone claiming to be CartPulse asks for any of the above, hang up immediately and report to us.",
        "Always verify by asking: \"What is the safety word?\" — the answer must be AISLE VERIFIED.",
      ]} />
    </Section>

    {/* Privacy & Data */}
    <Section icon={<FiLock />} title="Privacy & Data" color="gray">
      <List items={[
        "CartPulse keeps all customer and trader information strictly confidential.",
        "We do not share, sell, or disclose any personal data — including emails, phone numbers, and order details — to any third party.",
        "Your data is used solely to process orders and improve your experience on CartPulse.",
        "We do not store Mobile Money PINs, card PINs, OTPs, or account passwords.",
      ]} />
    </Section>

    {/* Trader Responsibilities */}
    <Section icon={<FiUsers />} title="Trader Responsibilities" color="gray">
      <List items={[
        "Traders must list only genuine, authentic products with accurate descriptions, images, and pricing.",
        "Traders are fully responsible for the quality and authenticity of the products they list.",
        "All traders must be verified and approved by CartPulse before listing any products on the platform.",
        "CartPulse conducts a thorough verification process to confirm that every trader is legitimate before granting access to list products.",
        "Traders must fulfil orders promptly and communicate any delays to CartPulse.",
        "Traders must not engage in deceptive pricing, fake reviews, or any fraudulent activity.",
        "Traders must not misrepresent products — including using fake images, false specifications, or misleading descriptions.",
      ]} />
    </Section>

    {/* Fake Products & Bans */}
    <Section icon={<FiSlash />} title="Fake Products & Trader Bans" color="rose">
      <p className="text-sm text-gray-600 leading-relaxed mb-3">
        CartPulse has a zero-tolerance policy for fake, counterfeit, or misrepresented products.
        We take this very seriously to protect our customers and maintain the integrity of the marketplace.
      </p>
      <List items={[
        "Any trader found selling fake, counterfeit, or misrepresented products will be immediately and permanently banned from CartPulse.",
        "Banned traders will have all their product listings removed from the platform with immediate effect.",
        "Traders who engage in fraud or sell fake products will face legal consequences in accordance with Ugandan law.",
        "CartPulse reserves the right to report fraudulent traders to relevant authorities.",
        "Customers who receive fake or misrepresented products are entitled to a full refund after verification.",
        "CartPulse will never knowingly allow fake products to be listed — all traders are vetted before listing.",
        "If you suspect a product is fake or a trader is fraudulent, report it immediately to balanceiq81@gmail.com or call 0794 448 439.",
      ]} />
      <div className="mt-3 bg-rose-100 border border-rose-200 rounded-xl p-3 text-xs text-rose-800 font-semibold">
        Warning: Selling fake products on CartPulse is a serious offence. Offenders will be banned, their listings removed, and legal action will be pursued.
      </div>
    </Section>

    {/* Trader Verification */}
    <Section icon={<FiMapPin />} title="Trader Verification Process" color="blue">
      <p className="text-sm text-gray-600 leading-relaxed mb-3">
        CartPulse does not allow just anyone to list products. Every trader goes through a verification process
        to ensure they are legitimate and trustworthy.
      </p>
      <List items={[
        "All trader applications are reviewed by the CartPulse team before approval.",
        "Traders must provide accurate business information including name, contact, and location.",
        "CartPulse may contact the trader directly to verify their identity and business.",
        "Only approved traders are allowed to list products on the platform.",
        "Approval typically takes up to 24 hours after a complete application is submitted.",
        "CartPulse reserves the right to reject any application without providing a reason.",
        "Approved traders are expected to maintain the standards set by CartPulse at all times.",
      ]} />
    </Section>

    {/* Limitation of Liability */}
    <Section icon={<FiAlertTriangle />} title="Limitation of Liability" color="red">
      <List items={[
        "CartPulse acts as a marketplace connecting buyers and verified traders. We are not responsible for disputes arising from trader misrepresentation after thorough vetting.",
        "CartPulse is not liable for delays caused by third-party delivery services or circumstances beyond our control.",
        "CartPulse is not responsible for losses arising from failure to follow payment or collection instructions.",
        "CartPulse is not responsible for additional delivery costs incurred by customers in remote or village areas beyond standard pick-up stations.",
      ]} />
    </Section>

    <p className="text-xs text-gray-400 pt-2">
      These terms may be updated from time to time. Continued use of CartPulse constitutes acceptance of the latest terms.
      For questions, contact us at{" "}
      <a href="mailto:balanceiq81@gmail.com" className="text-indigo-500 hover:underline">balanceiq81@gmail.com</a>.
    </p>
  </div>
);

export default TermsPage;
