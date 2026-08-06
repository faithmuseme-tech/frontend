import React, { useEffect, useRef, useState } from "react";
import {
  FiPhone, FiAlertTriangle, FiCheckCircle, FiShield,
  FiX, FiCheck, FiMail, FiMessageSquare,
} from "react-icons/fi";

const SECTIONS = [
  { id: "s1", num: 1, title: "Payment Steps" },
  { id: "s2", num: 2, title: "Order Confirmed" },
  { id: "s3", num: 3, title: "How CartPulse Contacts You" },
  { id: "s4", num: 4, title: "We Will NEVER Do This" },
  { id: "s5", num: 5, title: "What a Real Call Looks Like" },
  { id: "s6", num: 6, title: "Report a Scam" },
];

const HowToPayPage = () => {
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
          <h1 className="text-3xl font-extrabold text-gray-900">How to Pay</h1>
          <p className="mt-3 text-gray-500 max-w-2xl">
            CartPulse uses Mobile Money only. Follow the steps below and stay safe from scams.
          </p>
        </div>

        {/* 1. Payment Steps */}
        <section id="s1" ref={(el) => (sectionRefs.current.s1 = el)} className="scroll-mt-8 space-y-3">
          <h2 className="text-lg font-bold text-indigo-800 flex items-center gap-2"><FiPhone /> 1. Payment Steps</h2>
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 space-y-4">
            <ol className="space-y-3 text-sm text-gray-700">
              {[
                <>Go to your Mobile Money menu and select <span className="font-semibold">Send Money</span>.</>,
                <>Enter the number: <span className="font-bold text-indigo-700 text-base">0794 448 439</span></>,
                <>Confirm the name shows: <span className="font-bold text-gray-900">SABIRA SSEMATA</span></>,
                <>Enter the exact order amount.</>,
                <>On the <span className="font-semibold">Reference / Reason</span> field, enter <span className="font-bold text-indigo-700">your full name</span> (e.g. John Doe). This helps us match your payment to your order.</>,
                <>Confirm and complete the transaction.</>,
                <>Confirm payment with customer care on{" "}
                  <a href="https://wa.me/256786023858" className="font-semibold text-green-700 hover:underline">0786 023 858</a>
                  {" "}or{" "}
                  <a href="https://wa.me/256794448439" className="font-semibold text-green-700 hover:underline">0794 448 439</a>
                  {" "}via WhatsApp or call.</>,
              ].map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className={`w-6 h-6 ${i === 6 ? "bg-green-600" : "bg-indigo-600"} text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 text-xs`}>
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 2. Order Confirmed */}
        <section id="s2" ref={(el) => (sectionRefs.current.s2 = el)} className="scroll-mt-8 space-y-3">
          <h2 className="text-lg font-bold text-green-800 flex items-center gap-2"><FiCheckCircle /> 2. Order Confirmed</h2>
          <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
            <p className="text-sm text-gray-600 leading-relaxed">
              Your order is only confirmed after payment is received and verified by our team.
              After you submit your order or payment, our team may call you on{" "}
              <span className="font-semibold text-gray-800">0794 448 439</span> to verify and confirm your order.
              We will notify you once your order is confirmed and ready for delivery.
            </p>
          </div>
        </section>

        {/* 3. How CartPulse Contacts You */}
        <section id="s3" ref={(el) => (sectionRefs.current.s3 = el)} className="scroll-mt-8 space-y-3">
          <h2 className="text-lg font-bold text-blue-800 flex items-center gap-2"><FiShield /> 3. How CartPulse Contacts You</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 space-y-4">
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
              We will always mention your <span className="font-semibold text-gray-800">order number</span> and the{" "}
              <span className="font-semibold text-gray-800">exact items</span> you ordered.
              To verify you are speaking with a genuine CartPulse agent, ask them to confirm your{" "}
              <span className="font-semibold text-gray-800">order number</span> — a real agent will always know it without you telling them first.
            </p>
          </div>
        </section>

        {/* 4. We Will NEVER Do This */}
        <section id="s4" ref={(el) => (sectionRefs.current.s4 = el)} className="scroll-mt-8 space-y-3">
          <h2 className="text-lg font-bold text-red-700 flex items-center gap-2"><FiAlertTriangle /> 4. We Will NEVER Do This</h2>
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 space-y-3">
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
                "Sell products via social media — our social media accounts are for marketing only, all orders must be placed on the CartPulse platform",
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
        </section>

        {/* 5. What a Real Call Looks Like */}
        <section id="s5" ref={(el) => (sectionRefs.current.s5 = el)} className="scroll-mt-8 space-y-3">
          <h2 className="text-lg font-bold text-green-800 flex items-center gap-2"><FiCheckCircle /> 5. What a Real Call Looks Like</h2>
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 space-y-3">
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
        </section>

        {/* 6. Report a Scam */}
        <section id="s6" ref={(el) => (sectionRefs.current.s6 = el)} className="scroll-mt-8 space-y-3">
          <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2">
            <FiAlertTriangle className="text-orange-500" /> 6. Report a Scam
          </h2>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-3">
            <p className="text-sm text-gray-600">
              If you receive a suspicious call or message claiming to be CartPulse, do not pay anything.
              Report it right away:
            </p>
            <div className="space-y-1.5 text-sm">
              <p className="flex items-center gap-2">
                <FiMail className="text-indigo-500 flex-shrink-0" size={14} />
                <a href="mailto:information.cartpulse@gmail.com" className="font-semibold text-indigo-600 hover:underline">information.cartpulse@gmail.com</a>
              </p>
              <p className="flex items-center gap-2">
                <FiMessageSquare className="text-indigo-500 flex-shrink-0" size={14} />
                WhatsApp: <a href="https://wa.me/256786023858" className="font-semibold text-indigo-600 hover:underline">0786 023 858</a>
              </p>
              <p className="flex items-center gap-2">
                <FiPhone className="text-indigo-500 flex-shrink-0" size={14} />
                Call: <a href="tel:+256794448439" className="font-semibold text-indigo-600 hover:underline">0794 448 439</a>
              </p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default HowToPayPage;
