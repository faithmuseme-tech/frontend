import React, { useEffect, useState } from "react";
import { FiX as FiXIcon, FiDownload as FiDownloadIcon, FiSmartphone as FiSmartphoneIcon } from "react-icons/fi";
import { Zap, Package, Bell } from "lucide-react";

const FiX = FiXIcon as React.ElementType;
const FiDownload = FiDownloadIcon as React.ElementType;
const FiSmartphone = FiSmartphoneIcon as React.ElementType;

const DISMISSED_KEY = "pwa_install_dismissed";
const DELAY_MS = 8000;

const isIOS = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window as any).MSStream;

const isStandalone = () =>
  (window.navigator as any).standalone === true ||
  window.matchMedia("(display-mode: standalone)").matches;

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [show, setShow] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;
    if (localStorage.getItem(DISMISSED_KEY)) return;

    const iosDevice = isIOS();
    setIos(iosDevice);

    if (iosDevice) {
      const t = setTimeout(() => setShow(true), DELAY_MS);
      return () => clearTimeout(t);
    }

    let timer: ReturnType<typeof setTimeout>;
    const handler = (e: Event) => {
      setDeferredPrompt(e);
      timer = setTimeout(() => setShow(true), DELAY_MS);
    };

    window.addEventListener("beforeinstallprompt", handler as EventListener);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler as EventListener);
      clearTimeout(timer);
    };
  }, []);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem(DISMISSED_KEY, "1");
  };

  const install = async () => {
    if (!deferredPrompt) return;
    (deferredPrompt as any).preventDefault?.();
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") localStorage.setItem(DISMISSED_KEY, "1");
    setDeferredPrompt(null);
    setShow(false);
  };

  if (!show) return null;

  const base = process.env.NODE_ENV === "production" ? "/frontend" : "";

  return (
    <>
      {/* Backdrop — mobile only */}
      <div className="fixed inset-0 bg-black/40 z-[998] sm:hidden" onClick={dismiss} />

      {/* Bottom sheet on mobile, corner card on desktop */}
      <div
        className="fixed z-[999] bg-white shadow-2xl
          left-0 right-0 bottom-0 rounded-t-2xl px-5 pt-5 pb-8
          sm:left-auto sm:right-5 sm:bottom-5 sm:rounded-2xl sm:w-80 sm:pb-5"
        role="dialog"
        aria-modal="true"
        aria-label="Install CartPulse"
      >
        {/* Drag handle — mobile only */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4 sm:hidden" />

        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
          aria-label="Dismiss"
        >
          <FiX className="text-lg" />
        </button>

        {/* App icon + title */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src={`${base}/logo192.png`}
            alt="CartPulse"
            className="w-12 h-12 rounded-xl shadow-sm flex-shrink-0"
          />
          <div>
            <p className="font-extrabold text-gray-900 text-base leading-tight">Install CartPulse</p>
            <p className="text-xs text-gray-500 mt-0.5">Shop faster, even offline</p>
          </div>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-1 rounded-full">
            <Zap size={11} /> Fast
          </span>
          <span className="flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-1 rounded-full">
            <Package size={11} /> Track orders
          </span>
          <span className="flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-1 rounded-full">
            <Bell size={11} /> Notifications
          </span>
        </div>

        {ios ? (
          <div className="bg-indigo-50 rounded-xl p-3 space-y-2">
            <p className="text-sm font-bold text-indigo-800 flex items-center gap-1.5">
              <FiSmartphone /> Add to Home Screen
            </p>
            <ol className="list-decimal list-inside space-y-1 text-xs text-indigo-700">
              <li>Tap the <strong>Share</strong> button <span className="bg-indigo-100 rounded px-1">⎙</span> in Safari</li>
              <li>Tap <strong>"Add to Home Screen"</strong></li>
              <li>Tap <strong>Add</strong></li>
            </ol>
          </div>
        ) : (
          <button
            onClick={install}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-sm py-3 rounded-xl transition-all"
          >
            <FiDownload /> Install App
          </button>
        )}

        <button
          onClick={dismiss}
          className="w-full mt-2 text-xs text-gray-400 hover:text-gray-600 py-1 transition-colors"
        >
          Not now
        </button>
      </div>
    </>
  );
};

export default InstallPrompt;
