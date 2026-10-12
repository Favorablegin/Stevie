const C = 'stevie-v4';
const SHELL = ['./', 'index.html', 'style.css', 'app.js', 'content.js', 'manifest.webmanifest', 'icon-192.png', 'icon-180.png', 'icon-512.png', 'icon-mask.svg'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.hostname === 'textdb.online' || u.pathname.startsWith('/api/')) return;
  const same = u.origin === location.origin;
  const isFont = /fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
  if (!same && !isFont) return;
  e.respondWith(fetch(e.request).then(r => {
    if (r.ok || r.type === 'opaque') { const cp = r.clone(); caches.open(C).then(c => c.put(same && e.request.mode === 'navigate' ? 'index.html' : e.request, cp)); }
    return r;
  }).catch(() => caches.match(same && e.request.mode === 'navigate' ? 'index.html' : e.request, { ignoreSearch: true })));
});
// Push
self.addEventListener('push', e => {
  let d = {}; try { d = e.data ? e.data.json() : {}; } catch { d = { title: 'Stevie', body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || 'Stevie', {
    body: d.body || '', icon: 'icon-192.png', badge: 'icon-192.png', tag: d.tag || undefined, renotify: !!d.tag, data: { url: d.url || './' }, lang: 'de'
  }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || './', self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    for (const c of cs) { if ('focus' in c) { c.navigate && c.navigate(url).catch(() => { }); return c.focus(); } }
    return self.clients.openWindow(url);
  }));
});
