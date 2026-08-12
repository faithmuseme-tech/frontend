const CACHE = "cartpulse-v1786565818722";
const OFFLINE_URL = "/frontend/";

const PRECACHE = [
  "/frontend/",
  "/frontend/index.html",
  "/frontend/manifest.json",
  "/frontend/logo192.png",
  "/frontend/logo512.png",
  "/frontend/favicon-64.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// Cart abandonment nudge from app
self.addEventListener("message", (e) => {
  if (e.data?.type === "CLEAR_BADGE") {
    self.navigator.clearAppBadge?.().catch(() => {});
    return;
  }
  if (e.data?.type !== "CART_NUDGE") return;
  const { url } = e.data;
  self.registration.showNotification("Your cart is waiting", {
    body: "You've already picked your items \u2014 just one step left. Complete your checkout and place your order.",
    icon: "/frontend/logo192.png",
    tag: "cart-nudge",
    renotify: true,
    data: { url },
    actions: [{ action: "checkout", title: "Checkout Now" }],
  }).then(() => {
    // Set badge on the installed app icon after showing notification
    self.navigator.setAppBadge?.(1).catch(() => {});
  });
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  // Clear badge when user taps the notification
  self.navigator.clearAppBadge?.().catch(() => {});
  const path = e.notification.data?.url || "/cart";
  const target = self.location.origin + "/frontend" + path;
  e.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      const existing = list.find((c) => c.url.includes(path));
      if (existing) return existing.focus();
      return clients.openWindow(target);
    })
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;

  const url = new URL(e.request.url);

  if (url.origin !== self.location.origin) return;

  // Network-first for navigation — fallback to cached shell
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request).catch(() =>
        caches.match(OFFLINE_URL).then((r) => r || caches.match("/frontend/index.html"))
      )
    );
    return;
  }

  // Cache-first for static assets
  if (/\.(js|css|png|jpg|jpeg|svg|ico|woff2?|ttf)$/.test(url.pathname)) {
    e.respondWith(
      caches.match(e.request).then((cached) => {
        if (cached) return cached;
        return fetch(e.request).then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, clone));
          }
          return res;
        });
      })
    );
    return;
  }
});
