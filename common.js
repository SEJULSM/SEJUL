/* ===== SEJUL 앱 공통 (PWA) — 각 도구 페이지 맨 앞에서 먼저 실행 =====
   공통 설정(PC 이름 · 언어 · 선박 · 데이터 폴더)을 한 곳(sejul_common_*)에 두고, 도구별 저장 키와 양방향으로 맞춤.
   도구 코드는 그대로 두고 저장 키만 연결하므로, 도구를 따로(HTML 파일) 써도 동작은 같음. */
(function () {
  const C = window.SJAPP = window.SJAPP || {};
  C.ver = '2026.11.12.1137';
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
  /* 글자 크기 (설정 → 글자 크기) — 앱 홈·모든 도구 공통 */
  C.applyZoom = () => { const z = +get('sejul_common_zoom') || 1; document.documentElement.style.zoom = z === 1 ? '' : String(z); };
  try { C.applyZoom(); } catch (e) { }
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
  C.applyVessel = function () { const v = C.get('vessel'); if (!v || v === '__office') return;
    try { if (typeof DB !== 'undefined' && DB.settings && !DB.settings.vessel && DB.settings.site !== 'office') { DB.settings.vessel = v; if (typeof save === 'function') save(); if (typeof render === 'function') render(); } } catch (e) { }
    try { if (typeof SHIP !== 'undefined' && !SHIP && typeof MODE !== 'undefined' && MODE === 'ship' && typeof ACT !== 'undefined' && ACT.v9pickVessel) { const b = document.createElement('button'); b.dataset.name = v; ACT.v9pickVessel(b); setTimeout(() => { const ok = document.querySelector('#mback .modal:last-child .mf button:last-child'); if (ok && /선박|vessel/i.test((document.querySelector('#mback .modal:last-child') || {}).textContent || '')) ok.click(); }, 50); } } catch (e) { }
    try { if (typeof DB !== 'undefined' && DB.settings && DB.settings.vessel && DB.settings.vessel !== v && !C.get('vessel')) C.set('vessel', DB.settings.vessel); } catch (e) { } };
  /* 5) 앱 홈으로 버튼 */
  C.homeBtn = function () { if (document.getElementById('sjAppHome')) return; const a = document.createElement('a'); a.id = 'sjAppHome'; a.href = '../index.html'; a.title = '앱 홈 · App home'; a.innerHTML = '<b>⌂</b><span>앱 홈</span>'; document.body.appendChild(a); };
  const css = `#sjAppHome{position:fixed;left:8px;bottom:84px;z-index:9998;display:flex;align-items:center;gap:4px;background:#1F3864;color:#fff;text-decoration:none;border-radius:20px;padding:6px 12px 6px 9px;font:600 13px/1 'Noto Sans KR',sans-serif;box-shadow:0 3px 10px #0004;opacity:.88}#sjAppHome:hover{opacity:1}#sjAppHome b{font-size:16px;color:#F5B800}#sjAppHome .cl{font-style:normal;font-size:12px}
  @media (max-width:760px){#sjAppHome{left:auto;right:8px;top:6px;bottom:auto;padding:5px 9px;font-size:0}#sjAppHome b{font-size:16px}}
  #sjUpd{position:fixed;left:0;right:0;top:0;z-index:10000;background:#F2B705;color:#14244A;padding:10px 18px;font:14.5px 'Noto Sans KR','Malgun Gothic',sans-serif;box-shadow:0 2px 10px #0003;display:flex;gap:14px;align-items:center;justify-content:center;flex-wrap:wrap}#sjUpd button{background:#14244A;color:#fff;border:0;border-radius:8px;padding:7px 16px;font-weight:700;cursor:pointer;font:inherit;font-weight:700}html.sj-hasupd body{padding-top:46px!important}html.sj-hasupd #top.sj-top,html.sj-hasupd .sjr{top:46px!important}`;
  const st = document.createElement('style'); st.textContent = css; (document.head || document.documentElement).appendChild(st);
  /* 6) 새 버전 알림 (서비스 워커) */
  C.updHas = false;
  /* 지금 업데이트해도 안전한가: 입력 중·팝업 열림·방금 조작 중이면 기다림 */
  let lastAct = Date.now(), fresh = Date.now(); ['pointerdown', 'keydown', 'input', 'touchstart'].forEach(ev => addEventListener(ev, () => lastAct = Date.now(), true));
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') fresh = Date.now(); });   /* 앱을 켜거나 다시 돌아온 직후 30초 = 아직 입력 전 → 바로 업데이트 */
  C.updSafe = function () { const a = document.activeElement; if (a && a.matches && a.matches('input:not([type=button]):not([type=checkbox]):not([type=radio]),textarea,select,[contenteditable=true]')) return false;
    if ([...document.querySelectorAll('.modal,#modal,dialog[open],.sjs:not([hidden]),.sjq:not([hidden]),#mback .modal')].some(m => m.offsetParent || (m.getClientRects && m.getClientRects().length))) return false;
    return document.visibilityState !== 'visible' || Date.now() - fresh < 30000 || Date.now() - lastAct > 8000; };
  C.updBar = function () { if (!C.updHas || document.getElementById('sjUpd') || !document.body || window.top !== window) return; const en = (C.get('lang') || 'ko') === 'en', d = document.createElement('div'); d.id = 'sjUpd'; d.setAttribute('role', 'status');
    d.innerHTML = '<b>⬆ ' + (en ? 'A new version is ready — it will update automatically when you pause.' : '새 버전이 있습니다 — 작업이 멈추면 자동으로 업데이트됩니다.') + '</b><button type="button">' + (en ? 'Update now' : '지금 업데이트') + '</button>';
    d.querySelector('button').onclick = () => C.updNow(); document.body.appendChild(d); document.documentElement.classList.add('sj-hasupd'); };
  C.updNow = async function () { try { const reg = await navigator.serviceWorker.getRegistration(); if (reg && reg.waiting) { try { sessionStorage.setItem('sejul_upd_done', '1'); } catch (e) { } reg.waiting.postMessage('skip'); return true; } } catch (e) { } return false; };
  C.updCheck = async function () { try { const reg = await navigator.serviceWorker.getRegistration(); if (!reg) return 'none'; if (reg.waiting && await C.updNewer() === true) { C.updFound(); return 'has'; } if (await C.updNewer() === false) return 'latest'; await reg.update(); await new Promise(r => setTimeout(r, 1800)); if (reg.waiting || reg.installing) { C.updFound(); return 'has'; } return 'latest'; } catch (e) { return 'offline'; } };
  /* 새 버전을 받으면: 안내 띠 + 안전한 때(입력·팝업 없음, 15초 조작 없음 또는 앱이 뒤로 갔을 때) 자동 적용 */
  let autoT = null;
  /* 서버의 최신 버전 번호(version.json, 캐시 안 거침) — 지금 버전보다 높을 때만 '새 버전'으로 인정 */
  C.updVurl = () => (C.swPath || '../sw.js').replace(/sw\.js$/, 'version.json');
  C.updNewer = async function () { try { const j = await (await fetch(C.updVurl() + '?t=' + Date.now(), { cache: 'no-store' })).json(); if (j && j.v && j.v > C.ver) { C.updNew = j.v; return true; } return false; } catch (e) { return null; } };
  C.updFound = async function () { if (C.updHas) return; const nw = await C.updNewer(); if (nw !== true) return; /* 최신 버전이면(또는 확인 불가) 띠·자동 적용 안 함 */ C.updHas = true; C.updBar(); if (window.SJUI && SJUI.updPaint) SJUI.updPaint(); if (C.onUpd) C.onUpd();
    if (window.top !== window || C.bg || autoT) return; autoT = setInterval(() => { if (C.updSafe()) { clearInterval(autoT); C.updNow(); } }, 2000); if (C.updSafe()) { clearInterval(autoT); C.updNow(); } };
  C.watchUpdate = function () { if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register(C.swPath || '../sw.js').then(reg => {
      if (reg.waiting && navigator.serviceWorker.controller) C.updFound();
      reg.addEventListener('updatefound', () => { const w = reg.installing; w && w.addEventListener('statechange', () => { if (w.state === 'installed' && navigator.serviceWorker.controller) C.updFound(); }); });
      /* 새 버전 확인: version.json(캐시 안 거침)과 지금 버전을 비교 → 다르면 새 앱 파일을 받아 두고(reg.update) 안전할 때 자동 적용 */
      /* 최신 버전이면 아무것도 하지 않음 — 서버 버전이 더 높을 때만 새 파일을 받음(reg.update) */
      const chk = async () => { if (window.top !== window || navigator.onLine === false || C.bg || C.updHas) return;
          if (await C.updNewer() !== true) return; if (window.SJUI && SJUI.updPaint) SJUI.updPaint();
          if (reg.waiting && navigator.serviceWorker.controller) return C.updFound(); reg.update().catch(() => { }); setTimeout(() => { if (!C.updHas) reg.update().catch(() => { }); }, 20e3); };
      setTimeout(chk, 1500); setTimeout(chk, 20e3); setInterval(chk, 60e3);   /* 켤 때 · 3분마다 · 앱으로 돌아올 때 · 인터넷이 다시 연결될 때 — 찾으면 안전한 때 자동 적용 */
      document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') chk(); }); addEventListener('online', chk); addEventListener('focus', chk); addEventListener('pageshow', chk); }).catch(() => { });
    /* 다른 창이 업데이트를 적용하면: 이 창도 안전할 때 새로 고침 (입력 중이면 기다림) */
    let rl = false; navigator.serviceWorker.addEventListener('controllerchange', () => { if (rl) return; rl = true; const go = () => { if (window.top !== window || C.updSafe() || document.visibilityState !== 'visible') location.reload(); else setTimeout(go, 3000); }; go(); });
    /* 업데이트 직후 한 번 알림 */
    try { if (sessionStorage.getItem('sejul_upd_done') && window.top === window) { sessionStorage.removeItem('sejul_upd_done'); const show = () => { if (!document.body) return setTimeout(show, 300); const t = document.createElement('div'); t.id = 'sjUpdOk'; t.textContent = ((C.get('lang') || 'ko') === 'en' ? '✅ Updated to v' : '✅ 최신 버전으로 업데이트되었습니다 — v') + C.ver; t.style.cssText = 'position:fixed;left:50%;bottom:90px;transform:translateX(-50%);z-index:10001;background:#14244A;color:#fff;padding:10px 18px;border-radius:12px;font:600 14px "Noto Sans KR",sans-serif;box-shadow:0 6px 20px #0004'; document.body.appendChild(t); setTimeout(() => t.remove(), 5000); }; setTimeout(show, 800); } } catch (e) { } };
  /* 도구 페이지: 불러온 뒤 연결 */
  if (!C.isHub) { const go = () => { C.hookTools(); if (!C.shell) { C.homeBtn(); setTimeout(C.applyVessel, 1500); } C.watchUpdate(); setTimeout(C.hookTools, 2500); };
    if (document.readyState === 'complete') setTimeout(go, 300); else window.addEventListener('load', () => setTimeout(go, 300)); }
})();
