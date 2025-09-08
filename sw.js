
// sw.js — simple app-shell caching for XG IPTV PWA
const CACHE = 'xg-iptv-v1';
const APP_SHELL = [
  './',
  './index.html',
  './css/styles.css',
  './js/app.js',
  './assets/logo-xg.png',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/apple-touch-icon.png',
  './manifest.webmanifest',
  'https://unpkg.com/xgplayer/dist/index.min.js',
  'https://unpkg.com/xgplayer/dist/index.min.css',
  'https://unpkg.com/xgplayer-hls.js/dist/index.min.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  const url = new URL(request.url);

  // Only cache same-origin and allowed CDN assets. Streams (HLS) are NOT cached.
  const isCDN = url.origin === 'https://unpkg.com';
  const isSameOrigin = url.origin === self.location.origin;

  if (isSameOrigin || isCDN) {
    e.respondWith(
      caches.match(request).then(cached => cached || fetch(request).then(resp => {
        // Cache successful GET responses for app shell assets
        if (request.method === 'GET' && (isSameOrigin || isCDN)) {
          const respClone = resp.clone();
          caches.open(CACHE).then(cache => cache.put(request, respClone));
        }
        return resp;
      }).catch(() => cached))
    );
  }
  // Else: let it pass-through (e.g., M3U/HLS from remote servers without CORS)
});
