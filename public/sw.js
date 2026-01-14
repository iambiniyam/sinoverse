/**
 * Sinoverse Service Worker
 * PWA offline functionality and caching
 */

const CACHE_VERSION = "sinoverse-v1.0.1";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const AUDIO_CACHE = `${CACHE_VERSION}-audio`;
const DATA_CACHE = `${CACHE_VERSION}-data`;

// Static assets to cache immediately
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/web-app-manifest-192x192.png",
  "/web-app-manifest-512x512.png",
  "/apple-icon.png",
  "/favicon.ico",
];

// Maximum cache sizes
const MAX_DYNAMIC_CACHE_SIZE = 50;
const MAX_AUDIO_CACHE_SIZE = 150; // Increased for more syllables
const MAX_DATA_CACHE_SIZE = 20;

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("[SW] Installing service worker...");

  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log("[SW] Caching static assets");
      return cache.addAll(STATIC_ASSETS);
    })
  );

  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating service worker...");

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(
            (name) =>
              name.startsWith("sinoverse-") &&
              name !== STATIC_CACHE &&
              name !== DYNAMIC_CACHE &&
              name !== AUDIO_CACHE
          )
          .map((name) => {
            console.log("[SW] Deleting old cache:", name);
            return caches.delete(name);
          })
      );
    })
  );

  self.clients.claim();
});

// Fetch event - serve from cache with network fallback
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Handle audio files separately
  if (url.pathname.includes("/audio/")) {
    event.respondWith(
      cacheFirstStrategy(request, AUDIO_CACHE, MAX_AUDIO_CACHE_SIZE)
    );
    return;
  }

  // Handle API requests (if any)
  if (url.pathname.includes("/api/")) {
    event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE));
    return;
  }

  // Handle data files
  if (url.pathname.includes("/data/") || url.pathname.endsWith(".json")) {
    event.respondWith(
      cacheFirstStrategy(request, DYNAMIC_CACHE, MAX_DYNAMIC_CACHE_SIZE)
    );
    return;
  }

  // Handle static assets
  if (
    url.pathname.endsWith(".woff2") ||
    url.pathname.endsWith(".woff") ||
    url.pathname.endsWith(".ttf") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".jpg") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".ico")
  ) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
    return;
  }

  // Handle navigation requests
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match("/index.html");
      })
    );
    return;
  }

  // Default: network first with cache fallback
  event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE));
});

/**
 * Cache first strategy - check cache, fallback to network
 */
async function cacheFirstStrategy(request, cacheName, maxSize = null) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);

    if (networkResponse && networkResponse.status === 200) {
      // Clone response before caching
      cache.put(request, networkResponse.clone());

      // Limit cache size if specified
      if (maxSize) {
        limitCacheSize(cacheName, maxSize);
      }
    }

    return networkResponse;
  } catch (error) {
    console.error("[SW] Cache first strategy failed:", error);
    throw error;
  }
}

/**
 * Network first strategy - try network, fallback to cache
 */
async function networkFirstStrategy(request, cacheName) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log("[SW] Network failed, trying cache:", request.url);
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    throw error;
  }
}

/**
 * Limit cache size by removing oldest entries
 */
async function limitCacheSize(cacheName, maxSize) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();

  if (keys.length > maxSize) {
    // Remove oldest entries
    const toDelete = keys.slice(0, keys.length - maxSize);
    await Promise.all(toDelete.map((key) => cache.delete(key)));
  }
}

// Handle messages from clients
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "CLEAR_CACHE") {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(cacheNames.map((name) => caches.delete(name)));
      })
    );
  }
});
