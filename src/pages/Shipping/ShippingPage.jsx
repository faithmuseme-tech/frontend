import React from "react";
import { FiTruck, FiMapPin, FiClock, FiAlertTriangle } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

const REGIONS = [
  { name: "Central", fee: "UGX 15,000", time: "Same day – 1 day", districts: ["Buikwe","Bukomansimbi","Butambala","Buvuma","Gomba","Kalangala","Kalungu","Kampala","Kassanda","Kayunga","Kiboga","Kyankwanzi","Kyotera","Luwero","Lwengo","Lyantonde","Masaka","Mityana","Mpigi","Mubende","Mukono","Nakaseke","Nakasongola","Rakai","Sembabule","Wakiso"] },
  { name: "Eastern", fee: "UGX 15,000", time: "2–3 days", districts: ["Amuria","Budaka","Bududa","Bugiri","Bugweri","Bukedea","Bukwa","Bulambuli","Busia","Butaleja","Butebo","Buyende","Iganga","Jinja","Kaberamaido","Kaliro","Kamuli","Kapchorwa","Katakwi","Kibuku","Kumi","Kween","Luuka","Manafwa","Mayuge","Mbale","Namayingo","Namisindwa","Namutumba","Ngora","Pallisa","Serere","Sironko","Soroti","Tororo"] },
  { name: "Western", fee: "UGX 15,000", time: "2–3 days", districts: ["Bundibugyo","Bunyangabu","Bushenyi","Hoima","Ibanda","Isingiro","Kabale","Kabarole","Kagadi","Kakumiro","Kamwenge","Kanungu","Kasese","Kibaale","Kiruhura","Kiryandongo","Kisoro","Kyegegwa","Kyenjojo","Masindi","Mbarara","Mitooma","Ntoroko","Ntungamo","Rubanda","Rubirizi","Rukiga","Rukungiri","Sheema","Fort Portal"] },
  { name: "Northern", fee: "UGX 15,000", time: "2–3 days", districts: ["Abim","Adjumani","Agago","Alebtong","Amolatar","Amudat","Amuru","Apac","Arua","Dokolo","Gulu","Kaabong","Kitgum","Koboko","Kole","Kotido","Kwania","Lamwo","Lira","Maracha","Moroto","Moyo","Napak","Nebbi","Nwoya","Omoro","Otuke","Oyam","Pader","Pakwach","Soroti","Yumbe","Zombo"] },
];

const ShippingPage = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 space-y-8">
    <div>
      <h1 className="text-3xl font-extrabold text-gray-900">Shipping Information</h1>
      <p className="mt-3 text-gray-500">Everything you need to know about delivery at CartPulse.</p>
    </div>

    {/* About CartPulse delivery */}
    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
      <div className="flex items-center gap-2 font-bold text-indigo-800 mb-2"><FiTruck /> How Delivery Works</div>
      <p className="text-sm text-gray-600 leading-relaxed">
        CartPulse is a personal business operated by <span className="font-semibold text-gray-800">SSEMATA SABIRA</span>.
        We deliver products <span className="font-semibold text-gray-800">directly to your doorstep</span> in the towns listed below.
        CartPulse does not operate pick-up stations — your order comes to you.
      </p>
      <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-800 font-medium">
        <span className="font-bold">CartPulse does not sell via social media.</span> Our social media accounts are used for marketing only. All orders must be placed on the CartPulse platform. Anyone claiming to sell CartPulse products through social media is not authorised.
      </div>
    </div>

    {/* Delivery towns table */}
    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
      <div className="flex items-center gap-2 font-bold text-blue-800 mb-4"><FiMapPin /> Doorstep Delivery Districts & Fees</div>
      <div className="space-y-5">
        {REGIONS.map(({ name, fee, time, districts }) => (
          <div key={name}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-blue-900">{name} Uganda</span>
              <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">{fee} · {time}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {districts.map((d) => (
                <span key={d} className="text-xs bg-white border border-blue-100 text-gray-700 px-2.5 py-1 rounded-full">{d}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Beyond listed towns */}
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
      <div className="flex items-center gap-2 font-bold text-amber-800 mb-2"><FiAlertTriangle /> Outside Listed Towns</div>
      <p className="text-sm text-gray-600 leading-relaxed">
        If you are located <span className="font-semibold text-gray-800">outside the towns listed above</span> — including
        villages, trading centres, or remote areas — additional delivery charges will apply and are{" "}
        <span className="font-semibold text-gray-800">not included in the standard delivery fee</span>. These extra
        costs are fully the responsibility of the customer.
      </p>
      <p className="text-sm text-gray-600 mt-2">
        Please <span className="font-semibold text-gray-800">contact us before placing your order</span> so we can
        advise on the exact additional charges and delivery arrangement for your location.
      </p>
    </div>

    {/* Same-day dispatch */}
    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
      <div className="flex items-center gap-2 font-bold text-amber-800 mb-2"><FiClock /> Same-Day Delivery (Kampala)</div>
      <p className="text-sm text-gray-600">
        Kampala orders placed and <span className="font-semibold text-gray-800">paid before 2:00 PM</span> are eligible for same-day doorstep delivery.
      </p>
    </div>

    {/* Order holding */}
    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
      <div className="flex items-center gap-2 font-bold text-gray-800 mb-2"><FiMapPin /> Order Holding Policy</div>
      <p className="text-sm text-gray-600">
        Once your order is confirmed and paid, we hold your product for{" "}
        <span className="font-semibold text-gray-800">up to 2 weeks</span> while delivery is arranged.
        If you need more time, additional holding fees apply. If no communication is made within 2 weeks,
        CartPulse reserves the right to return the product to stock.
      </p>
    </div>

    {/* Confirm order */}
    <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
      <div className="flex items-center gap-2 font-bold text-green-800 mb-2"><FaWhatsapp /> Confirm Your Order</div>
      <p className="text-sm text-gray-600">
        After payment, confirm with our customer care on{" "}
        <a href="https://wa.me/256786023858" className="font-semibold text-green-700 hover:underline">0786 023 858</a>
        {" "}or{" "}
        <a href="https://wa.me/256794448439" className="font-semibold text-green-700 hover:underline">0794 448 439</a>
        {" "}via WhatsApp or call.
      </p>
    </div>
  </div>
);

export default ShippingPage;
