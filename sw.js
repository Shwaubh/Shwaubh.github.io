const CACHE_NAME = "skg-site-v2";
const OFFLINE_PAGE = "/offline.html";

const CORE_ASSETS = [
  "/",
  "/index.html",
  "/about.html",
  "/cats.html",
  "/country.html",
  "/planner.html",
  "/shadi.html",
  "/offline.html",
  "/css/style.css",
  "/css/shadistyle.css",
  "/catscript.js",
  "/countryscript.js",
  "/planner.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const cloned = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
        return response;
      })
      .catch(() =>
        caches.match(event.request).then((cached) => {
          if (cached) return cached;
          if (event.request.mode === "navigate") return caches.match(OFFLINE_PAGE);
          return new Response("Offline content is unavailable.", {
            status: 503,
            headers: { "Content-Type": "text/plain" }
          });
        })
      )
  );
});
