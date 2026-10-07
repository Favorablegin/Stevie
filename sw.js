const C = 'stevie-v1';
const SHELL = ['./', 'index.html', 'style.css', 'app.js', 'content.js', 'manifest.webmanifest', 'icon-192.png', 'icon-180.png', 'icon-512.png', 'icon-mask.svg'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.hostname === 'textdb.online') return;
  const same = u.origin === location.origin;
  const isFont = /fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
  if (!same && !isFont) return;
  // network first for app files (fresh updates), cache fallback offline
  e.respondWith(fetch(e.request).then(r => {
    if (r.ok || r.type === 'opaque') { const cp = r.clone(); caches.open(C).then(c => c.put(same && e.request.mode === 'navigate' ? 'index.html' : e.request, cp)); }
    return r;
  }).catch(() => caches.match(same && e.request.mode === 'navigate' ? 'index.html' : e.request, { ignoreSearch: true })));
});
