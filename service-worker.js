self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('xg-iptv-v1').then(cache => {
      return cache.addAll([
        './',
        './index.html',
        './css/styles.css',
        './js/app.js',
        './assets/logo-xg.png',
        './manifest.json'
      ]);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(resp => {
      return resp || fetch(e.request);
    })
  );
});
