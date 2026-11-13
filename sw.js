/* SEJUL 앱 서비스 워커 — 앱 파일을 PC에 보관해 인터넷 없이 실행, 인터넷이 되면 새 버전을 받아 둠 (데이터는 다루지 않음) */
const CACHE = 'sejul-2026.11.13.1518';
const FILES = ['./', './index.html', './common.js', './ui.js', './cloud.js', './shell.js', './manifest.webmanifest', './sj2-icon-192.png', './sj2-icon-512.png', './sj2-icon-maskable.png', './sj2-apple-touch-icon.png', './sj2-favicon.png', './logo.svg', './fonts/Pretendard-Regular.subset.woff2', './fonts/Pretendard-Bold.subset.woff2', './tools/pms.html', './tools/rsk.html'];
/* 새 버전 받기: files.json(파일별 지문)을 보고 바뀐 파일만 내려받음 — 그대로인 파일은 이전 보관함에서 복사 (위성 통신량 절약) */
self.addEventListener('install', e => e.waitUntil((async () => { const c = await caches.open(CACHE);
  let man = null; try { man = await (await fetch('./files.json?t=' + Date.now(), { cache: 'no-store' })).json(); } catch (x) { }
  if (!man || !man.files) return c.addAll(FILES.map(f => new Request(f, { cache: 'reload' })));
  let old = null, oldMan = {}; for (const k of (await caches.keys()).filter(k => k.startsWith('sejul-') && k !== CACHE)) { try { const r = await (await caches.open(k)).match('./files.json'); if (r) { oldMan = (await r.json()).files || {}; old = await caches.open(k); break; } } catch (x) { } }
  for (const [f, h] of Object.entries(man.files)) { let res = oldMan[f] === h && old ? await old.match(f) : null;
    if (!res) { res = await fetch(new Request(f, { cache: 'reload' })); if (!res.ok) throw new Error('fetch ' + f); }
    await c.put(f, res.clone()); if (f === './index.html') await c.put('./', res.clone()); }
  await c.put('./files.json', new Response(JSON.stringify(man), { headers: { 'content-type': 'application/json' } })); })()));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('sejul-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('message', e => { if (e.data === 'skip') self.skipWaiting(); });
self.addEventListener('fetch', e => { const r = e.request; if (r.method !== 'GET' || new URL(r.url).origin !== location.origin || /version\.json$/.test(new URL(r.url).pathname)) return;
  e.respondWith(caches.match(r, { ignoreSearch: true }).then(hit => hit || fetch(r).then(res => { if (res.ok) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)); } return res; }).catch(() => caches.match('./index.html')))); });

/* 알림(푸시) 받기 → 화면에 표시, 누르면 해당 화면 열기 */
self.addEventListener('push', e => { let d = {}; try { d = e.data ? e.data.json() : {}; } catch (_) { d = { body: e.data && e.data.text() }; }
  e.waitUntil(self.registration.showNotification(d.title || 'SEJUL', { body: d.body || '', tag: d.tag || undefined, renotify: !!d.tag, icon: 'sj2-icon-192.png', badge: 'sj2-favicon.png', data: { url: d.url || 'index.html' } })); });
self.addEventListener('notificationclick', e => { e.notification.close(); const url = new URL((e.notification.data && e.notification.data.url) || 'index.html', self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => { for (const c of cs) { if (c.url.startsWith(self.registration.scope) && 'focus' in c) { c.navigate(url).catch(() => {}); return c.focus(); } } return self.clients.openWindow(url); })); });
