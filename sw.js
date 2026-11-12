// Franklin v2.2.2 · fb7a0117: el juego se guarda en el iPad para jugar sin conexión
const CACHE = 'franklin-v2.2.2-fb7a0117';
const FILES = ["./", "index.html", "three.min.js", "manifest.webmanifest", "fonts/bodoni-moda-latin-400-italic.woff2", "fonts/bodoni-moda-latin-500-italic.woff2", "fonts/bodoni-moda-latin-500-normal.woff2", "fonts/bodoni-moda-latin-600-normal.woff2", "fonts/bodoni-moda-latin-700-normal.woff2", "fonts/bodoni-moda-latin-800-normal.woff2", "fonts/fonts.css", "fonts/old-standard-tt-latin-400-italic.woff2", "fonts/old-standard-tt-latin-400-normal.woff2", "fonts/old-standard-tt-latin-700-normal.woff2", "fonts/pinyon-script-latin-400-normal.woff2", "fonts/special-elite-latin-400-normal.woff2", "icons/icon-152.png", "icons/icon-167.png", "icons/icon-180.png", "icons/icon-192.png", "icons/icon-32.png", "icons/icon-512.png", "icons/icon-maskable-512.png"];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  const page = r.mode === 'navigate' || r.url.endsWith('/index.html');
  if (page) {   // la página: primero la red (así llegan las actualizaciones), si no hay conexión, la copia guardada
    e.respondWith(fetch(r).then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put('index.html', cp)); return res; }).catch(() => caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(r).then(m => m || fetch(r).then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)); return res; })));
});
