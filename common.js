/* ===== SEJUL 앱 공통 (PWA) — 각 도구 페이지 맨 앞에서 먼저 실행 =====
   공통 설정(PC 이름 · 언어 · 선박 · 데이터 폴더)을 한 곳(sejul_common_*)에 두고, 도구별 저장 키와 양방향으로 맞춤.
   도구 코드는 그대로 두고 저장 키만 연결하므로, 도구를 따로(HTML 파일) 써도 동작은 같음. */
(function () {
  const C = window.SJAPP = window.SJAPP || {};
  C.ver = '2026.11.11.1139';
  C.inApp = true;
  /* 도구별 키 ↔ 공통 키 */
  const MAP = {
    pcname: ['sejul_pms_pcname', '_rskPcName'],
    lang: ['sejul-pms-lang', 'sejul_rsk_tool_v1_lang']
  };
  const ls = window.localStorage, rawSet = Storage.prototype.setItem, rawGet = Storage.prototype.getItem;
  const get = k => { try { return rawGet.call(ls, k); } catch (e) { return null; } };
  const put = (k, v) => { try { rawSet.call(ls, k, v); } catch (e) { } };
  C.get = k => get('sejul_common_' + k);
  C.set = (k, v) => { put('sejul_common_' + k, v); (MAP[k] || []).forEach(t => put(t, v)); };
  /* 1) 시작할 때: 공통 → 도구 키 (공통 값이 없으면 도구 값에서 공통을 채움) */
  for (const [k, ts] of Object.entries(MAP)) { const v = C.get(k); if (v) ts.forEach(t => put(t, v)); else { const tv = ts.map(get).find(Boolean); if (tv) C.set(k, tv); } }
  /* 2) 도구가 자기 키를 바꾸면 공통에도 반영 */
  const REV = {}; Object.entries(MAP).forEach(([k, ts]) => ts.forEach(t => REV[t] = k));
  Storage.prototype.setItem = function (k, v) { rawSet.call(this, k, v); if (this === ls && REV[k]) { put('sejul_common_' + REV[k], v); REV[k] && MAP[REV[k]].forEach(t => t !== k && put(t, v)); } };
  /* 3) 데이터 폴더: 한 번 고르면 두 도구에 모두 연결 (같은 주소의 IndexedDB) */
  const idbPut = (db, store, key, val) => new Promise(res => { try { const r = indexedDB.open(db, 1); r.onupgradeneeded = () => r.result.createObjectStore(store); r.onsuccess = () => { try { const tx = r.result.transaction(store, 'readwrite'); val == null ? tx.objectStore(store).delete(key) : tx.objectStore(store).put(val, key); tx.oncomplete = () => res(true); tx.onerror = () => res(false); } catch (e) { res(false); } }; r.onerror = () => res(false); } catch (e) { res(false); } });
  const idbGet = (db, store, key) => new Promise(res => { try { const r = indexedDB.open(db, 1); r.onupgradeneeded = () => r.result.createObjectStore(store); r.onsuccess = () => { try { const q = r.result.transaction(store).objectStore(store).get(key); q.onsuccess = () => res(q.result || null); q.onerror = () => res(null); } catch (e) { res(null); } }; r.onerror = () => res(null); } catch (e) { res(null); } });
  C.dirGet = () => idbGet('sejul_common', 'h', 'dir');
  C.dirSet = async h => { await idbPut('sejul_common', 'h', 'dir', h); await idbPut('sejul-pms', 'kv', 'dir', h); await idbPut('sejul_rsk_fs', 'h', 'dir', h); };
  /* 도구에서 폴더를 고르면 공통에도 저장 → 다른 도구도 다음 실행부터 같은 폴더 */
  C.hookTools = function () {
    try { if (window.KV && KV.set && !KV.__sj) { const s = KV.set.bind(KV); KV.set = async (k, v) => { const r = await s(k, v); if (k === 'dir' && v && v.kind === 'directory') { idbPut('sejul_common', 'h', 'dir', v); idbPut('sejul_rsk_fs', 'h', 'dir', v); } return r; }; KV.__sj = 1; } } catch (e) { }
    try { if (typeof fsIdbSet === 'function' && !window.__sjFs) { const f = fsIdbSet; window.fsIdbSet = fsIdbSet = async v => { await f(v); if (v && v.kind === 'directory') { idbPut('sejul_common', 'h', 'dir', v); idbPut('sejul-pms', 'kv', 'dir', v); } }; window.__sjFs = 1; } } catch (e) { }
  };
  /* 4) 선박: 공통 선박이 있고 도구에 선박이 없으면 자동 적용 */
  C.applyVessel = function () { const v = C.get('vessel'); if (!v) return;
    try { if (typeof DB !== 'undefined' && DB.settings && !DB.settings.vessel && DB.settings.site !== 'office') { DB.settings.vessel = v; if (typeof save === 'function') save(); if (typeof render === 'function') render(); } } catch (e) { }
    try { if (typeof SHIP !== 'undefined' && !SHIP && typeof MODE !== 'undefined' && MODE === 'ship' && typeof ACT !== 'undefined' && ACT.v9pickVessel) { const b = document.createElement('button'); b.dataset.name = v; ACT.v9pickVessel(b); setTimeout(() => { const ok = document.querySelector('#mback .modal:last-child .mf button:last-child'); if (ok && /선박|vessel/i.test((document.querySelector('#mback .modal:last-child') || {}).textContent || '')) ok.click(); }, 50); } } catch (e) { }
    try { if (typeof DB !== 'undefined' && DB.settings && DB.settings.vessel && DB.settings.vessel !== v && !C.get('vessel')) C.set('vessel', DB.settings.vessel); } catch (e) { } };
  /* 5) 앱 홈으로 버튼 */
  C.homeBtn = function () { if (document.getElementById('sjAppHome')) return; const a = document.createElement('a'); a.id = 'sjAppHome'; a.href = '../index.html'; a.title = '앱 홈 · App home'; a.innerHTML = '<b>⌂</b><span>앱 홈</span>'; document.body.appendChild(a); };
  const css = `#sjAppHome{position:fixed;left:8px;bottom:84px;z-index:9998;display:flex;align-items:center;gap:4px;background:#1F3864;color:#fff;text-decoration:none;border-radius:20px;padding:6px 12px 6px 9px;font:600 13px/1 'Noto Sans KR',sans-serif;box-shadow:0 3px 10px #0004;opacity:.88}#sjAppHome:hover{opacity:1}#sjAppHome b{font-size:16px;color:#F5B800}
  @media (max-width:760px){#sjAppHome{left:auto;right:8px;top:6px;bottom:auto;padding:5px 9px;font-size:0}#sjAppHome b{font-size:16px}}
  #sjUpd{position:fixed;left:50%;transform:translateX(-50%);top:10px;z-index:9999;background:#1F3864;color:#fff;border-radius:10px;padding:10px 14px;font:14px 'Noto Sans KR',sans-serif;box-shadow:0 6px 20px #0005;display:flex;gap:10px;align-items:center}#sjUpd button{background:#F5B800;border:0;border-radius:6px;padding:6px 12px;font-weight:700;cursor:pointer}`;
  const st = document.createElement('style'); st.textContent = css; (document.head || document.documentElement).appendChild(st);
  /* 6) 새 버전 알림 (서비스 워커) */
  C.watchUpdate = function () { if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register(C.swPath || '../sw.js').then(reg => { const show = () => { if (document.getElementById('sjUpd')) return; const d = document.createElement('div'); d.id = 'sjUpd'; d.innerHTML = '🔄 새 버전이 있습니다 · New version <button>지금 업데이트</button>'; d.querySelector('button').onclick = () => { if (reg.waiting) reg.waiting.postMessage('skip'); }; document.body.appendChild(d); };
      if (reg.waiting && navigator.serviceWorker.controller) show(); reg.addEventListener('updatefound', () => { const w = reg.installing; w && w.addEventListener('statechange', () => { if (w.state === 'installed' && navigator.serviceWorker.controller) show(); }); }); setInterval(() => reg.update().catch(() => { }), 30 * 60e3); }).catch(() => { });
    let rl = false; navigator.serviceWorker.addEventListener('controllerchange', () => { if (rl) return; rl = true; location.reload(); }); };
  /* 도구 페이지: 불러온 뒤 연결 */
  if (!C.isHub) { const go = () => { C.hookTools(); C.homeBtn(); C.watchUpdate(); setTimeout(C.applyVessel, 1500); setTimeout(C.hookTools, 2500); };
    if (document.readyState === 'complete') setTimeout(go, 300); else window.addEventListener('load', () => setTimeout(go, 300)); }
})();
