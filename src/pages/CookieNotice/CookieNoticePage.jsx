import React from "react";
import { Link } from "react-router-dom";
import { FiShield, FiChevronRight, FiExternalLink } from "react-icons/fi";

const Section = ({ id, title, children }) => (
  <section id={id} className="scroll-mt-8 space-y-3">
    <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">{title}</h2>
    <div className="text-sm text-gray-600 leading-relaxed space-y-3">{children}</div>
  </section>
);

const CookieType = ({ title, badge, badgeColor, children }) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-2">
    <div className="flex items-center gap-2">
      <p className="font-bold text-gray-900 text-sm">{title}</p>
      {badge && (
        <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${badgeColor}`}>
          {badge}
        </span>
      )}
    </div>
    <p className="text-sm text-gray-600 leading-relaxed">{children}</p>
  </div>
);

const CookieNoticePage = () => (
  <div className="min-h-screen bg-gray-50 px-4 py-12">
    <div className="max-w-3xl mx-auto">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
        <FiChevronRight size={12} />
        <span className="text-gray-700 font-semibold">Cookie Notice</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0">
          <FiShield className="text-orange-500" size={18} />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900">CartPulse Cookie Notice</h1>
      </div>
      <p className="text-sm text-gray-400 mb-10">Last updated: {new Date().getFullYear()}</p>

      <div className="space-y-10">

        {/* About */}
        <Section id="about" title="About this Notice">
          <p>
            This Cookie Notice provides information on how <span className="font-semibold text-gray-800">CartPulse</span> uses
            cookies when you visit our website or mobile applications. Any personal data provided to or collected by
            CartPulse via cookies and other tracking technologies is controlled by CartPulse (trading name of SSEMATA SABIRA).
            Kindly familiarise yourself with our cookie practices.
          </p>
          <p>
            For full details on how we handle your personal data, please read our{" "}
            <Link to="/privacy" className="text-orange-500 font-semibold hover:underline">Privacy Policy</Link>.
          </p>
        </Section>

        {/* What are cookies */}
        <Section id="what" title="Cookies and How We Use Them">
          <p>
            A cookie is a small file of letters and numbers that websites send to your browser, which is then stored on
            your device — whether that is a computer, phone, tablet, or any other device.
          </p>
          <p>
            Cookies allow us to distinguish you from other users of our website and mobile applications, which helps us
            provide you with an enhanced browsing experience. For example, we use cookies for the following purposes:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>
              Recognising and counting the number of visitors and to see how visitors move around our site and mobile
              apps when they are using it — this helps us improve the way our website works, for example by ensuring
              users can find what they are looking for.
            </li>
            <li>
              Identifying your preferences and settings, e.g. language settings, saved items, and items stored in your
              cart.
            </li>
            <li>
              Sending you newsletters and commercial or advertising messages tailored to your interests.
            </li>
          </ul>
          <p>
            Our approved third parties may also set cookies when you use our platform. Third parties include search
            engines, providers of measurement and analytics services, social media networks, and advertising companies.
          </p>
        </Section>

        {/* Cookie types */}
        <Section id="types" title="Cookie Preferences">
          <p>
            We use technology such as cookies to collect information and store your online preferences. By managing your
            cookie preferences you enable or disable a specific set of cookies based on predefined categories.
          </p>
          <div className="space-y-3 pt-1">
            <CookieType title="Strictly Necessary Cookies" badge="Always active" badgeColor="bg-gray-100 text-gray-600">
              These cookies enable website functionality and are automatically enabled when you use the site. They are
              essential to the operation of the site — helping you log in, manage your cart, and complete checkout. You
              cannot disable this category of cookie.
            </CookieType>

            <CookieType title="Analytics Cookies" badge="Optional" badgeColor="bg-orange-100 text-orange-600">
              It is important for us to understand how you use the site — for example, how efficiently you are able to
              navigate around it and what features you use. Analytics cookies enable us to gather this information,
              helping us to improve our site and your experience of it.
            </CookieType>

            <CookieType title="Functional Cookies" badge="Optional" badgeColor="bg-orange-100 text-orange-600">
              Functionality cookies allow the site to remember choices you have made and provide you with enhanced
              personal features. The information these cookies collect is anonymised and does not track your browsing
              activity on other sites.
            </CookieType>

            <CookieType title="Targeting Cookies" badge="Optional" badgeColor="bg-orange-100 text-orange-600">
              It is important for us to know when and how often you visit the site, and which parts of it you have used
              — including which pages and links you have visited. This information helps us to better understand you and,
              in turn, to make our site and advertising more relevant to your interests. Some information gathered by
              targeting cookies may also be shared with third parties.
            </CookieType>

            <CookieType title="Third Party Cookies" badge="Optional" badgeColor="bg-orange-100 text-orange-600">
              Third party cookies are not placed by us; instead, they are placed by third parties that provide services
              to us and/or to you. Third party cookies may be used by advertising services to serve up tailored
              advertising to you on our site, or by third parties providing analytics services to us.
            </CookieType>

            <CookieType title="Persistent Cookies" badge="Varies" badgeColor="bg-blue-100 text-blue-600">
              Any of the above types of cookie may be a persistent cookie. Persistent cookies remain on your computer or
              device for a predetermined period and are activated each time you visit our site.
            </CookieType>

            <CookieType title="Session Cookies" badge="Temporary" badgeColor="bg-blue-100 text-blue-600">
              Any of the above types of cookie may be a session cookie. Session cookies are temporary and only remain on
              your device from the point at which you visit our site until you close your browser, at which point they
              are deleted.
            </CookieType>
          </div>

          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex items-center justify-between gap-4 mt-2">
            <p className="text-sm text-orange-800 font-medium">
              You can update your cookie preferences at any time from our preferences page.
            </p>
            <Link
              to="/cookie-preferences"
              className="flex-shrink-0 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all whitespace-nowrap"
            >
              Manage Preferences
            </Link>
          </div>
        </Section>

        {/* Consent */}
        <Section id="consent" title="Consent">
          <p>
            Before cookies are placed on your computer or device, you will be shown a prompt requesting your consent to
            set those cookies. By giving your consent to the placing of cookies you are enabling us to provide the best
            possible experience and service to you.
          </p>
          <p>
            You may, if you wish, deny consent to the placing of cookies (unless those cookies are strictly necessary);
            however certain features of our site may not function fully or as intended. You will be given the
            opportunity to allow and/or deny different categories of cookie that we use.
          </p>
          <p>
            In addition to the controls that we provide, you can choose to enable or disable cookies in your internet
            browser. Most internet browsers also enable you to choose whether you wish to disable all cookies or only
            third-party cookies. By default, most internet browsers accept cookies but this can be changed. For further
            details, please consult the help menu in your internet browser or the documentation that came with your
            device.
          </p>
          <p className="font-semibold text-gray-700">
            The links below provide instructions on how to control cookies in all mainstream browsers:
          </p>
          <ul className="space-y-1.5 pl-2">
            {[
              { label: "Google Chrome", href: "https://support.google.com/chrome/answer/95647" },
              { label: "Microsoft Edge", href: "https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" },
              { label: "Mozilla Firefox", href: "https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" },
              { label: "Safari (macOS)", href: "https://support.apple.com/en-gb/guide/safari/sfri11471/mac" },
              { label: "Safari (iOS)", href: "https://support.apple.com/en-us/HT201265" },
            ].map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-orange-500 font-semibold hover:underline"
                >
                  {label} <FiExternalLink size={12} />
                </a>
              </li>
            ))}
          </ul>
        </Section>

        {/* Changes */}
        <Section id="changes" title="Changes to this Cookie Notice">
          <p>
            We may alter this Cookie Notice at any time. If we do so, details of the changes will be highlighted at the
            top of this page. Any such changes will become binding on you on your first use of our site after the
            changes have been made. You are therefore advised to check this page from time to time.
          </p>
          <p>
            In the event of any conflict between the current version of this Cookie Notice and any previous version(s),
            the provisions current and in effect shall prevail unless it is expressly stated otherwise.
          </p>
        </Section>

        {/* Further info */}
        <Section id="contact" title="Further Information">
          <p>
            If you are looking for more information on how we process your personal data, or you wish to exercise your
            legal rights in respect of your personal data, please contact us:
          </p>
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-1 text-sm">
            <p><span className="font-semibold text-gray-800">Email:</span>{" "}
              <a href="mailto:information.cartpulse@gmail.com" className="text-orange-500 hover:underline">
                information.cartpulse@gmail.com
              </a>
            </p>
            <p><span className="font-semibold text-gray-800">Phone / WhatsApp:</span> 0794 448 439 &nbsp;/&nbsp; 0786 023 858</p>
            <p><span className="font-semibold text-gray-800">Privacy Policy:</span>{" "}
              <Link to="/privacy" className="text-orange-500 hover:underline">Read our Privacy Policy</Link>
            </p>
            <p><span className="font-semibold text-gray-800">Terms &amp; Conditions:</span>{" "}
              <Link to="/terms" className="text-orange-500 hover:underline">Read our Terms &amp; Conditions</Link>
            </p>
          </div>
        </Section>

      </div>
    </div>
  </div>
);

export default CookieNoticePage;
