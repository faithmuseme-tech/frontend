import React from "react";
import { FiPhone, FiAlertTriangle, FiCheckCircle, FiShield } from "react-icons/fi";

const HowToPayPage = () => (
  <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14 space-y-8">
    <div>
      <h1 className="text-3xl font-extrabold text-gray-900">How to Pay</h1>
      <p className="mt-3 text-gray-500">CartPulse uses Mobile Money only. Follow the steps below.</p>
    </div>

    {/* Steps */}
    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-2 font-bold text-indigo-800 text-lg"><FiPhone /> Mobile Money Payment</div>
      <ol className="space-y-3 text-sm text-gray-700">
        <li className="flex gap-3">
          <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 text-xs">1</span>
          <span>Go to your Mobile Money menu and select <span className="font-semibold">Send Money</span>.</span>
        </li>
        <li className="flex gap-3">
          <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 text-xs">2</span>
          <span>Enter the number: <span className="font-bold text-indigo-700 text-base">0794 448 439</span></span>
        </li>
        <li className="flex gap-3">
          <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 text-xs">3</span>
          <span>Confirm the name shows: <span className="font-bold text-gray-900">SABIRA SSEMATA</span></span>
        </li>
        <li className="flex gap-3">
          <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 text-xs">4</span>
          <span>Enter the exact order amount and complete the transaction.</span>
        </li>
        <li className="flex gap-3">
          <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 text-xs">5</span>
          <span>
            Confirm payment with customer care on{" "}
            <a href="https://wa.me/256786023858" className="font-semibold text-green-700 hover:underline">0786 023 858</a>
            {" "}or{" "}
            <a href="https://wa.me/256794448439" className="font-semibold text-green-700 hover:underline">0794 448 439</a>
            {" "}via WhatsApp or call.
          </span>
        </li>
      </ol>
    </div>

    {/* Order confirmed */}
    <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
      <div className="flex items-center gap-2 font-bold text-green-800 mb-2"><FiCheckCircle /> Order Confirmed</div>
      <p className="text-sm text-gray-600">
        Your order is only confirmed after payment is received and verified by our team.
        After you submit your order or payment, our team may call you on{" "}
        <span className="font-semibold text-gray-800">0794 448 439</span> to verify and confirm your order.
        We will notify you once your order is confirmed and ready for pickup or delivery.
      </p>
    </div>

    {/* Safety words */}
    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
      <div className="flex items-center gap-2 font-bold text-blue-800 mb-3"><FiShield /> Stay Safe — Know Our Safety Words</div>
      <p className="text-sm text-gray-600 mb-3">
        When our team contacts you, we will identify ourselves as <span className="font-semibold text-gray-800">CartPulse</span> and
        reference your specific order. To verify you are speaking with a genuine CartPulse representative,
        you may ask them for the <span className="font-semibold text-gray-800">safety word: "AISLE VERIFIED"</span>.
        A genuine CartPulse agent will always confirm this.
      </p>
      <ul className="text-sm text-gray-600 space-y-1.5 list-disc list-inside">
        <li>Our team will <span className="font-bold text-gray-900">never</span> ask for your <span className="font-bold text-red-600">Mobile Money PIN</span>.</li>
        <li>Our team will <span className="font-bold text-gray-900">never</span> ask for any <span className="font-bold text-red-600">card PIN or OTP</span>.</li>
        <li>Our team will <span className="font-bold text-gray-900">never</span> ask for your <span className="font-bold text-red-600">CartPulse account password</span>.</li>
        <li>Our team will <span className="font-bold text-gray-900">never</span> ask you to send money to any number other than <span className="font-bold text-gray-800">0794 448 439 (SABIRA SSEMATA)</span>.</li>
        <li>If anyone claiming to be CartPulse asks for any of the above, <span className="font-bold text-red-600">hang up immediately</span> and report to us.</li>
      </ul>
    </div>

    {/* Important warning */}
    <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
      <div className="flex items-center gap-2 font-bold text-red-700 mb-2"><FiAlertTriangle /> Important</div>
      <ul className="text-sm text-gray-600 space-y-1.5 list-disc list-inside">
        <li>We do <span className="font-semibold text-gray-800">not</span> accept payment through the platform or any other number.</li>
        <li>Only send money to <span className="font-semibold text-gray-800">0794 448 439 (SABIRA SSEMATA)</span>.</li>
        <li>Always confirm the recipient name before completing the transaction.</li>
        <li>CartPulse will never ask you to pay to any other number.</li>
        <li>
          Report any suspicious contact immediately to{" "}
          <a href="mailto:balanceiq81@gmail.com" className="font-semibold text-red-600 hover:underline">balanceiq81@gmail.com</a>
          {" "}or{" "}
          <a href="https://wa.me/256786023858" className="font-semibold text-red-600 hover:underline">0786 023 858</a>.
        </li>
      </ul>
    </div>
  </div>
);

export default HowToPayPage;
