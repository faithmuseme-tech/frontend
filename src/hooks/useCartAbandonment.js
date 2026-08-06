import { useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";

const IDLE_MS = 10 * 60 * 1000; // 10 minutes
const COOLDOWN_MS = 30 * 60 * 1000;
const STORAGE_KEY = "cart_nudge_last";

const MESSAGES = [
  { title: "Your cart misses you! 🛒", body: "You left items behind. Complete your order before they sell out!" },
  { title: "Still thinking? 🤔", body: "Your cart is waiting — grab your items before stock runs out!" },
  { title: "Don't miss out! ⚡", body: "Items in your cart are popular. Checkout now to secure yours!" },
];

function randomMsg() {
  return MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
}

async function requestNotifPermission() {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

function sendBrowserNotif(title, body) {
  if (Notification.permission !== "granted") return;
  if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: "CART_NUDGE",
      title,
      body,
      url: "/cart",
    });
  } else {
    new Notification(title, { body, icon: "/logo192.png", badge: "/favicon-64.png" });
  }
}

export function useCartAbandonment({ onNudge } = {}) {
  const { items, setNudgeActive } = useCart();
  const timerRef = useRef(null);
  const firedRef = useRef(false);
  // Keep latest onNudge in a ref so the timer callback always has the current version
  const onNudgeRef = useRef(onNudge);
  useEffect(() => { onNudgeRef.current = onNudge; }, [onNudge]);

  const hasItems = items.length > 0;

  useEffect(() => {
    if (!hasItems) {
      clearTimeout(timerRef.current);
      firedRef.current = false;
      return;
    }

    const fire = async () => {
      if (firedRef.current) return;
      const last = parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
      if (Date.now() - last < COOLDOWN_MS) return;

      firedRef.current = true;
      localStorage.setItem(STORAGE_KEY, String(Date.now()));

      const { title, body } = randomMsg();
      await requestNotifPermission();
      sendBrowserNotif(title, body);
      setNudgeActive(true);
      onNudgeRef.current?.({ title, body });
    };

    const schedule = () => {
      clearTimeout(timerRef.current);
      if (!firedRef.current) {
        timerRef.current = setTimeout(fire, IDLE_MS);
      }
    };

    // Start timer immediately
    schedule();

    // Reset timer on any user activity (but don't clear firedRef — once fired, stay fired)
    const onActivity = () => {
      if (!firedRef.current) schedule();
    };

    const events = ["mousemove", "keydown", "scroll", "touchstart", "click"];
    events.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));

    return () => {
      clearTimeout(timerRef.current);
      events.forEach((e) => window.removeEventListener(e, onActivity));
    };
  }, [hasItems, setNudgeActive]);
}
