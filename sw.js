const CACHE = 'safa-omra-v2';

// Chemins RELATIFS (restent dans /safa-omra-app/)
const ASSETS = ['./', './index.html', './manifest.json', './icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    // On supprime les anciens caches (v1) puis on prend le contrôle
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // On ne touche jamais aux appels vers Apps Script (les données doivent rester en direct)
  if (e.request.url.includes('script.google.com')) return;

  // Pour le reste : cache d'abord, sinon réseau
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
