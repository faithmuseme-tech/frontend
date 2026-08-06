import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiFileText, FiAlertTriangle, FiShield, FiRefreshCw,
  FiPackage, FiLock, FiTruck, FiUser, FiCheckCircle, FiAward,
} from "react-icons/fi";

const SECTIONS = [
  { id: "s1",  num: 1,  title: "Introduction" },
  { id: "s2",  num: 2,  title: "Registration & Account" },
  { id: "s3",  num: 3,  title: "Orders & Payment" },
  { id: "s19", num: 4,  title: "Loyalty, Coupons & Points" },
  { id: "s4",  num: 5,  title: "Order Holding Policy" },
  { id: "s5",  num: 6,  title: "Delivery & Shipping" },
  { id: "s6",  num: 7,  title: "Returns & Refunds" },
  { id: "s7",  num: 8,  title: "Safety & Fraud Prevention" },
  { id: "s8",  num: 9,  title: "Acceptable Use" },
  { id: "s9",  num: 10, title: "Intellectual Property" },
  { id: "s10", num: 11, title: "Privacy & Data" },
  { id: "s11", num: 12, title: "Limitation of Liability" },
  { id: "s12", num: 13, title: "Indemnification" },
  { id: "s13", num: 14, title: "Breaches & Account Suspension" },
  { id: "s14", num: 15, title: "Variation & Entire Agreement" },
  { id: "s15", num: 16, title: "Severability & Assignment" },
  { id: "s16", num: 17, title: "Law & Jurisdiction" },
  { id: "s18", num: 18, title: "Cookie Policy" },
  { id: "s17", num: 19, title: "About CartPulse & Contact" },
];

const List = ({ items }) => (
  <ul className="text-sm text-gray-600 space-y-1.5 list-disc list-inside">
    {items.map((item, i) => <li key={i}>{item}</li>)}
  </ul>
);

const TermsPage = () => {
  const [active, setActive] = useState("s1");
  const sectionRefs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex min-h-screen w-full">

      {/* ── Sticky Left TOC ── */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 flex-shrink-0 sticky top-0 h-screen overflow-y-auto border-r border-gray-100 bg-white py-10 px-4">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 px-2">Contents</p>
        <nav className="flex flex-col gap-0.5">
          {SECTIONS.map(({ id, num, title }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`text-left px-3 py-2 rounded-xl text-sm transition-all duration-150 flex items-start gap-2 group ${
                active === id
                  ? "bg-indigo-50 text-indigo-700 font-semibold"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              <span className={`flex-shrink-0 w-5 text-xs font-bold mt-0.5 ${active === id ? "text-indigo-500" : "text-gray-300 group-hover:text-gray-400"}`}>
                {num}.
              </span>
              <span className="leading-snug">{title}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 min-w-0 px-6 sm:px-10 xl:px-16 py-14 space-y-12">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Terms & Conditions</h1>
          <p className="mt-3 text-gray-500 max-w-2xl">
            Last updated: {new Date().getFullYear()}. By using CartPulse, you agree to the following terms.
            Please read them carefully before placing an order or registering an account.
          </p>
        </div>

        {/* 1. Introduction */}
        <section id="s1" ref={(el) => (sectionRefs.current.s1 = el)} className="scroll-mt-8 space-y-3">
          <h2 className="text-lg font-bold text-indigo-800 flex items-center gap-2"><FiShield /> 1. Introduction</h2>
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 space-y-3 text-sm text-gray-600 leading-relaxed">
            <p>
              <span className="font-semibold text-gray-800">CartPulse</span> is a trading name operated by{" "}
              <span className="font-semibold text-gray-800">SSEMATA SABIRA</span>, an individual trader based in
              Fort Portal, Uganda. <span className="font-semibold text-gray-800">CartPulse is a personal business</span> — it is not a registered company or corporation.
              CartPulse operates an online store and delivery platform (the "platform") for
              the sale of consumer products including electronics, STEM products, industrial equipment, and everyday
              essentials, with doorstep delivery to selected towns across Uganda.
            </p>
            <p>
              These terms and conditions govern your use of the CartPulse platform and all related services.
              By using the platform, you accept these terms in full.
            </p>
            <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-4">
              <p className="font-bold text-red-700 text-sm mb-1">Important Notice</p>
              <p className="text-sm text-red-700 leading-relaxed">
                If you <span className="font-bold">disagree</span> with any part of these terms and conditions,
                you <span className="font-bold">must not use the CartPulse platform</span> in any way — including
                browsing, placing orders, or registering an account. You must also{" "}
                <span className="font-bold">not share, distribute, or forward</span> any content, links, or
                information from this platform to any other person.
              </p>
            </div>
            <p>
              If you use CartPulse in the course of a business or organisational project, you confirm that you have
              the authority to agree to these terms on behalf of that entity, and that both you and the entity are
              bound by them.
            </p>
          </div>
        </section>

        {/* 2. Registration & Account */}
        <section id="s2" className="scroll-mt-8 space-y-3">
          <h2 className="text-lg font-bold text-blue-800 flex items-center gap-2"><FiUser /> 2. Registration & Account</h2>
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
            <List items={[
              "You must be at least 18 years of age to register an account on CartPulse.",
              "You agree to provide accurate and complete information when registering.",
              "You are responsible for keeping your password confidential and must notify us immediately if you suspect any unauthorised access to your account.",
              "Your account is for your personal use only and must not be transferred to any third party.",
              "We may suspend or cancel your account at any time if we reasonably believe these terms have been breached.",
              "You may cancel your account at any time by contacting us at information.cartpulse@gmail.com.",
            ]} />
          </div>
        </section>

        {/* 3. Orders & Payment */}
        <section id="s3" className="scroll-mt-8 space-y-3">
          <h2 className="text-lg font-bold text-blue-800 flex items-center gap-2"><FiFileText /> 3. Orders & Payment</h2>
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 space-y-3">
            <List items={[
              "An order is only confirmed after full payment is received and verified by our team.",
              "Payment is made via Mobile Money only — send to 0794 448 439 in the names of SABIRA SSEMATA.",
              "No payment is processed through the platform itself — all payments are made directly via Mobile Money.",
              "After submitting your order, our team may call you on 0794 448 439 to verify and confirm.",
              "Always confirm payment with customer care on 0786 023 858 or 0794 448 439 via WhatsApp or call.",
              "CartPulse will never ask you to pay to any number other than 0794 448 439 (SABIRA SSEMATA).",
              "Product prices are as stated on the platform and include all applicable charges unless otherwise stated.",
              "Delivery charges, where applicable, will be clearly communicated before your order is confirmed.",
            ]} />
            <div className="bg-blue-100 border border-blue-200 rounded-xl p-3 text-xs text-blue-800 font-medium">
              All products sold on CartPulse are sourced, verified, and sold directly by CartPulse (trading name of SSEMATA SABIRA). CartPulse takes full responsibility for every order from placement to delivery.
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-800 font-medium">
              <span className="font-bold">CartPulse does not sell via social media.</span> Our social media accounts (Facebook, Instagram, TikTok, WhatsApp, etc.) are used for marketing purposes only. All orders must be placed exclusively through the CartPulse platform at <span className="font-bold">cartpulse.com</span>. Any person claiming to sell CartPulse products via social media is not authorised and should be treated as a scam.
            </div>
          </div>
        </section>

        {/* 4. Loyalty, Coupons & Points */}
        <section id="s19" className="scroll-mt-8 space-y-3">
          <h2 className="text-lg font-bold text-orange-700 flex items-center gap-2"><FiAward /> 4. Loyalty Rewards, Coupons & Points</h2>
          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 space-y-4">

            {/* Intro */}
            <div className="bg-gradient-to-r from-orange-100 to-amber-50 border border-orange-200 rounded-xl p-4 space-y-2">
              <p className="text-sm font-bold text-orange-800 flex items-center gap-2"><FiAward className="text-orange-500" /> Our Way of Saying Thank You</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                At CartPulse, we genuinely appreciate every customer who chooses to shop with us.
                The <span className="font-semibold text-gray-800">Loyalty Rewards Program</span> and our{" "}
                <span className="font-semibold text-gray-800">coupon offers</span> are our way of giving back —
                rewarding you for your trust, your repeat business, and your continued support of CartPulse.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                Every completed order earns you loyalty points that you can use to reduce your delivery fee on
                future orders. Coupons are issued from time to time as special thank-you gifts, seasonal
                promotions, and exclusive offers for our valued customers. The more you shop with CartPulse,
                the more you benefit — it is that simple.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                These benefits are provided entirely free of charge and with no obligation. The terms below
                exist solely to ensure the program remains fair, sustainable, and genuinely rewarding for
                every CartPulse customer.
              </p>
            </div>

            {/* How points are generated */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-2">
              <p className="text-sm font-bold text-green-800 flex items-center gap-2"><FiCheckCircle className="text-green-600" /> How Points & Coupons Are Generated</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                Loyalty points and coupons on CartPulse are <span className="font-semibold text-gray-800">generated automatically by the platform</span> based solely on your shopping activity.
                No CartPulse worker, staff member, or the owner can manually create, add, edit, or delete your points or coupons —
                not even CartPulse itself has the ability to interfere with your balance.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                Your points are yours, earned entirely through your own purchases. When you complete an order,
                the system awards your points automatically. When you redeem them, the system deducts them automatically.
                No human involvement takes place at any stage of this process.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                This means your balance is <span className="font-semibold text-gray-800">always accurate, always fair, and always protected</span> —
                exactly as you earned it.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-800">Loyalty Points</p>
              <List items={[
                "Points are credited to your account automatically once your order status is marked as Delivered. No manual action by any person is involved.",
                "Points are not awarded for cancelled or refunded orders.",
                "If an order is cancelled or refunded after points have been credited, the system will automatically reverse those points from your account.",
                "Points have no cash value and cannot be withdrawn, transferred, gifted, or exchanged for money under any circumstances.",
                "Points may only be redeemed as a discount against the delivery fee on a qualifying order — they cannot be applied to product prices. A minimum of 150 points is required before redemption is unlocked.",
                "Only the exact number of points needed to cover the delivery fee will be deducted. Any remaining points stay on your account.",
                "Points are non-transferable and are linked exclusively to the account that earned them.",
              ]} />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-800">Coupons & Discount Codes</p>
              <List items={[
                "Coupons and discount codes are issued by CartPulse as rewards for your shopping activity.",
                "A coupon expires immediately when you place a new order without applying it at checkout. Placing an order is your opportunity to use the coupon — once that order is submitted without it, the coupon is permanently invalidated.",
                "Always apply your coupon at checkout before confirming your order. Coupons cannot be applied retroactively to orders that have already been placed.",
                "Each coupon may only be used once per account unless explicitly stated otherwise.",
                "Coupons cannot be combined with other coupons or promotional offers unless CartPulse expressly permits it.",
                "Coupons have no cash value and cannot be exchanged for money, transferred, or sold.",
                "CartPulse reserves the right to cancel or invalidate any coupon at any time, including if it was obtained through unauthorised means.",
                "Attempting to use expired, invalid, or fraudulently obtained coupons may result in order cancellation and account suspension.",
              ]} />
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-800 font-medium">
              Any attempt to manipulate, exploit, or abuse the loyalty points system or coupon system — including placing and cancelling orders to farm points, using multiple accounts, or sharing coupon codes — will result in immediate forfeiture of all points and coupons, and may lead to permanent account suspension.
            </div>

          </div>
        </section>

        {/* 5. Order Holding Policy */}
        <section id="s4" className="scroll-mt-8 space-y-3">
          <h2 className="text-lg font-bold text-green-800 flex items-center gap-2"><FiPackage /> 5. Order Holding Policy</h2>
          <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
            <List items={[
              "Paid orders are held for up to 2 weeks from the date of payment confirmation.",
              "If you need more time, notify us before the 2-week period expires — additional holding fees apply.",
              "If delivery has not been completed within 2 weeks and no communication has been made, CartPulse reserves the right to return the product to stock.",
              "CartPulse is not liable for any loss arising from failure to receive delivery within the holding period.",
            ]} />
          </div>
        </section>

        {/* 6. Delivery & Shipping */}
        <section id="s5" className="scroll-mt-8 space-y-3">
          <h2 className="text-lg font-bold text-purple-800 flex items-center gap-2"><FiTruck /> 6. Delivery & Shipping</h2>
          <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5 space-y-3">
            <p className="text-sm text-gray-600 leading-relaxed">
              CartPulse delivers products <span className="font-semibold text-gray-800">directly to your doorstep</span>.
              CartPulse does <span className="font-semibold text-gray-800">not</span> operate pick-up stations — you do not need to go anywhere to collect your order.
              Doorstep delivery is available to the specific towns listed on the CartPulse Shipping page.
            </p>
            <List items={[
              "Your order is delivered directly to the address you provide at checkout, within the listed delivery towns.",
              "The delivery fee shown at checkout covers doorstep delivery within the listed town only.",
              "If you are located outside a listed town — including villages, trading centres, or remote areas — additional charges apply and are NOT included in the standard delivery fee.",
              "Any extra delivery costs beyond the listed towns are fully the responsibility of the customer and must be agreed upon before the order is dispatched.",
              "Please contact us before placing your order if you are outside a listed town, so we can confirm availability and advise on the exact additional charges.",
              "Delivery timelines are estimates and may vary depending on location, road conditions, and availability.",
              "CartPulse is not liable for delays caused by circumstances beyond our reasonable control, including natural disasters, civil unrest, or infrastructure disruptions.",
            ]} />
            <div className="bg-amber-100 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 font-medium">
              If you live outside a listed delivery town, contact us before ordering. Extra charges will apply and must be paid by you — they are not covered by CartPulse.
            </div>
          </div>
        </section>

        {/* 7. Returns & Refunds */}
        <section id="s6" className="scroll-mt-8 space-y-3">
          <h2 className="text-lg font-bold text-green-800 flex items-center gap-2"><FiRefreshCw /> 7. Returns & Refunds</h2>
          <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
            <List items={[
              "Returns are accepted only for products with a fault or defect present at the time of doorstep delivery.",
              "The product must be unused and show no physical damage caused by the customer.",
              "Damage caused by customer carelessness — including poor wiring, physical impact, or liquid damage — is not covered.",
              "Return processing takes up to 1 week from the date we receive the product back.",
              "Refunds are issued only after thorough analysis and verification of the returned product.",
              "If the product is found to be faulty through no fault of the customer, a full refund is issued via Mobile Money.",
              "CartPulse reserves the right to decline a return if the product does not meet the return criteria above.",
            ]} />
          </div>
        </section>

        {/* 8. Safety & Fraud Prevention */}
        <section id="s7" className="scroll-mt-8 space-y-3">
          <h2 className="text-lg font-bold text-amber-800 flex items-center gap-2"><FiShield /> 8. Safety & Fraud Prevention</h2>
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 space-y-3">
            <div className="bg-amber-100 border border-amber-200 rounded-xl p-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                To verify you are speaking with a genuine CartPulse agent, ask them to confirm your{" "}
                <span className="font-semibold text-gray-800">order number</span> — a real agent will always
                know it without you telling them first.
              </p>
            </div>
            <List items={[
              "CartPulse staff will NEVER ask for your Mobile Money PIN.",
              "CartPulse staff will NEVER ask for any card PIN or OTP.",
              "CartPulse staff will NEVER ask for your CartPulse account password.",
              "CartPulse staff will NEVER ask you to send money to any number other than 0794 448 439 (SABIRA SSEMATA).",
              "Our official contact number is 0794 448 439. Any call from a different number claiming to be CartPulse should be treated with caution.",
            ]} />
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
                    <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-green-600 font-bold text-xs">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 9. Acceptable Use */}
        <section id="s8" className="scroll-mt-8 space-y-3">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2"><FiFileText /> 9. Acceptable Use</h2>
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 space-y-3">
            <p className="text-sm text-gray-600">You may use CartPulse only for lawful personal or business purposes in connection with purchasing products. You must not:</p>
            <List items={[
              "Use the platform in any way that is unlawful, fraudulent, or harmful.",
              "Submit false, inaccurate, or misleading information including fake reviews or feedback.",
              "Attempt to hack, tamper with, or disrupt the platform or its security systems.",
              "Conduct automated data collection (scraping, data mining, etc.) without our written consent.",
              "Use data collected from the platform for unsolicited marketing.",
              "Post content that is offensive, defamatory, discriminatory, or in breach of any applicable law.",
              "Attempt to contact other users outside the platform to conduct transactions or collect payments.",
            ]} />
          </div>
        </section>

        {/* 10. Intellectual Property */}
        <section id="s9" className="scroll-mt-8 space-y-3">
          <h2 className="text-lg font-bold text-indigo-800 flex items-center gap-2"><FiLock /> 10. Intellectual Property</h2>
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
            <List items={[
              "All content on the CartPulse platform — including text, images, logos, and software — is owned by or licensed to CartPulse (SSEMATA SABIRA) and is protected by applicable intellectual property laws.",
              "The CartPulse name and logo are trading identifiers of SSEMATA SABIRA. No permission is granted for their use without our written consent.",
              "You may not reproduce, republish, sell, or redistribute any material from the platform without our express written permission.",
              "Any content you submit to the platform (such as reviews) grants CartPulse a non-exclusive licence to use, publish, and display that content on the platform.",
            ]} />
          </div>
        </section>

        {/* 11. Privacy & Data */}
        <section id="s10" className="scroll-mt-8 space-y-3">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2"><FiLock /> 11. Privacy & Data</h2>
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
            <List items={[
              "CartPulse keeps all customer information strictly confidential.",
              "We do not share, sell, or disclose any personal data — including emails, phone numbers, and order details — to any third party.",
              "Your data is used solely to process orders, arrange delivery, and improve your experience on CartPulse.",
              "We do not store Mobile Money PINs, card PINs, OTPs, or account passwords.",
              "By using CartPulse, you consent to the collection and use of your data as described in our Privacy Policy.",
            ]} />
          </div>
        </section>

        {/* 12. Limitation of Liability */}
        <section id="s11" className="scroll-mt-8 space-y-3">
          <h2 className="text-lg font-bold text-red-700 flex items-center gap-2"><FiAlertTriangle /> 12. Limitation of Liability</h2>
          <div className="bg-red-50 border border-red-100 rounded-2xl p-5 space-y-3">
            <p className="text-sm text-gray-600">To the maximum extent permitted by applicable Ugandan law:</p>
            <List items={[
              "CartPulse is not liable for delays or losses caused by circumstances beyond our reasonable control, including natural disasters, civil unrest, or infrastructure failures.",
              "CartPulse is not responsible for losses arising from failure to follow payment or collection instructions.",
              "CartPulse is not responsible for additional delivery costs incurred by customers located outside the listed delivery towns.",
              "CartPulse is not liable for any indirect, special, or consequential loss or damage arising from use of the platform.",
              "Our total liability to you in respect of any order shall not exceed the amount paid by you for that order.",
              "Nothing in these terms limits liability for fraud, death, or personal injury caused by our negligence.",
            ]} />
          </div>
        </section>

        {/* 13. Indemnification */}
        <section id="s12" className="scroll-mt-8 space-y-3">
          <h2 className="text-lg font-bold text-amber-800 flex items-center gap-2"><FiShield /> 13. Indemnification</h2>
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
            <p className="text-sm text-gray-600 leading-relaxed">
              You agree to indemnify and hold CartPulse (SSEMATA SABIRA) harmless from any losses, damages, costs,
              or liabilities — including legal expenses — arising directly or indirectly from your use of the platform
              or any breach of these terms by you.
            </p>
          </div>
        </section>

        {/* 14. Breaches & Account Suspension */}
        <section id="s13" className="scroll-mt-8 space-y-3">
          <h2 className="text-lg font-bold text-red-700 flex items-center gap-2"><FiAlertTriangle /> 14. Breaches & Account Suspension</h2>
          <div className="bg-red-50 border border-red-100 rounded-2xl p-5 space-y-3">
            <p className="text-sm text-gray-600">If you breach these terms, or if we reasonably suspect a breach, we may:</p>
            <List items={[
              "Temporarily suspend your access to the platform.",
              "Permanently prohibit you from accessing the platform.",
              "Suspend or delete your account.",
              "Commence legal action against you where appropriate.",
            ]} />
            <p className="text-sm text-gray-600">You must not attempt to circumvent any suspension or restriction by creating a new account.</p>
          </div>
        </section>

        {/* 15. Variation & Entire Agreement */}
        <section id="s14" className="scroll-mt-8 space-y-3">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2"><FiFileText /> 15. Variation & Entire Agreement</h2>
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
            <List items={[
              "These terms constitute the entire agreement between you and CartPulse in relation to your use of the platform.",
              "We may revise these terms at any time. The revised terms will apply from the date of publication on the platform.",
              "Continued use of CartPulse after any revision constitutes your acceptance of the updated terms.",
              "No waiver of any breach of these terms shall be construed as a waiver of any subsequent breach.",
            ]} />
          </div>
        </section>

        {/* 16. Severability & Assignment */}
        <section id="s15" className="scroll-mt-8 space-y-3">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2"><FiFileText /> 16. Severability & Assignment</h2>
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
            <List items={[
              "If any provision of these terms is found to be unlawful or unenforceable, the remaining provisions will continue in full effect.",
              "CartPulse may assign or transfer its rights and obligations under these terms at any time.",
              "You may not assign or transfer your rights or obligations under these terms without our prior written consent.",
            ]} />
          </div>
        </section>

        {/* 17. Law & Jurisdiction */}
        <section id="s16" className="scroll-mt-8 space-y-3">
          <h2 className="text-lg font-bold text-indigo-800 flex items-center gap-2"><FiShield /> 17. Law & Jurisdiction</h2>
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
            <p className="text-sm text-gray-600 leading-relaxed">
              These terms are governed by and construed in accordance with the laws of Uganda. Any disputes
              relating to these terms shall be subject to the exclusive jurisdiction of the courts of law in Uganda.
            </p>
          </div>
        </section>

        {/* 18. Cookie Policy */}
        <section id="s18" className="scroll-mt-8 space-y-3">
          <h2 className="text-lg font-bold text-orange-700 flex items-center gap-2"><FiShield /> 18. Cookie Policy</h2>
          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 space-y-3">
            <p className="text-sm text-gray-600 leading-relaxed">
              CartPulse uses cookies and similar tracking technologies when you visit our website or mobile applications.
              Cookies are small files stored on your device that help us recognise you, remember your preferences, and
              improve your browsing experience.
            </p>
            <List items={[
              "Strictly necessary cookies are always active and cannot be disabled — they are required for login, cart, and checkout to function.",
              "Analytics cookies help us understand how visitors use our site so we can improve it. These are optional.",
              "Functional cookies remember your preferences and settings across visits. These are optional.",
              "You will be shown a cookie consent prompt on your first visit. You may accept all, reject optional cookies, or manage your preferences individually.",
              "You can update your cookie preferences at any time from the Cookie Preferences page.",
              "You may also control cookies through your browser settings at any time.",
            ]} />
            <div className="flex flex-wrap gap-2 pt-1">
              <Link to="/cookie-notice" className="inline-flex items-center gap-1 text-xs text-orange-600 font-semibold hover:underline">
                Read our full Cookie Notice →
              </Link>
              <span className="text-gray-300">|</span>
              <Link to="/cookie-preferences" className="inline-flex items-center gap-1 text-xs text-orange-600 font-semibold hover:underline">
                Manage Cookie Preferences →
              </Link>
            </div>
          </div>
        </section>

        {/* 19. About CartPulse & Contact */}
        <section id="s17" className="scroll-mt-8 space-y-3">
          <h2 className="text-lg font-bold text-blue-800 flex items-center gap-2"><FiUser /> 19. About CartPulse & Contact</h2>
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-sm text-gray-600 space-y-1.5">
            <p><span className="font-semibold text-gray-800">Trading Name:</span> CartPulse</p>
            <p><span className="font-semibold text-gray-800">Operated by:</span> SSEMATA SABIRA (individual trader)</p>
            <p><span className="font-semibold text-gray-800">Location:</span> Fort Portal, Uganda</p>
            <p><span className="font-semibold text-gray-800">Email:</span>{" "}
              <a href="mailto:information.cartpulse@gmail.com" className="text-indigo-600 hover:underline">information.cartpulse@gmail.com</a>
            </p>
            <p><span className="font-semibold text-gray-800">Phone / WhatsApp:</span> 0794 448 439 &nbsp;/&nbsp; 0786 023 858</p>
          </div>
        </section>

        <p className="text-xs text-gray-400 pb-10">
          These terms may be updated from time to time. Continued use of CartPulse constitutes acceptance of the latest terms.
          For questions, contact us at{" "}
          <a href="mailto:information.cartpulse@gmail.com" className="text-indigo-500 hover:underline">information.cartpulse@gmail.com</a>.
        </p>
      </main>
    </div>
  );
};

export default TermsPage;
