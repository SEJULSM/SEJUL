/* ===== SEJUL 서버 동기화 (Supabase RPC) — 각 도구 페이지·앱 홈 공용 =====
   기기마다 비밀 열쇠(브라우저에만 보관) → 서버에 등록 → 사무실 승인 후 자료 파일을 올리고 받음.
   올리는 내용은 공유 폴더에 쓰는 파일과 같은 형식(gzip+base64). 합치기는 각 도구의 기존 합치기 함수 사용. */
(function () {
  const C = window.SJCLOUD = window.SJCLOUD || {};
  C.url = 'https://zfstmwmmtphmvkcvkago.supabase.co'; C.key = 'sb_publishable_zXVcET74c_Gd7jOKqtwl7Q_FYFoyeQK';
  const LS = k => { try { return localStorage.getItem(k); } catch (e) { return null; } }, LSS = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { } };
  C.devKey = () => { let k = LS('sejul_cloud_key'); if (!k) { const a = new Uint8Array(32); crypto.getRandomValues(a); k = [...a].map(x => x.toString(16).padStart(2, '0')).join(''); LSS('sejul_cloud_key', k); } return k; };
  C.me = () => { try { return JSON.parse(LS('sejul_cloud_me') || 'null'); } catch (e) { return null; } };
  C.setMe = m => LSS('sejul_cloud_me', JSON.stringify(m));
  C.rpc = async (fn, args, timeout = 60e3) => { const ac = new AbortController(), tm = setTimeout(() => ac.abort(), timeout);
    try { const r = await fetch(C.url + '/rest/v1/rpc/' + fn, { method: 'POST', headers: { apikey: C.key, 'Content-Type': 'application/json' }, body: JSON.stringify(Object.assign({ p_key: C.devKey() }, args || {})), signal: ac.signal });
      const tx = await r.text(); let j; try { j = tx ? JSON.parse(tx) : null; } catch (e) { j = tx; } if (!r.ok) throw new Error((j && (j.message || j.hint)) || ('HTTP ' + r.status)); return j; } finally { clearTimeout(tm); } };
  C.refresh = async () => { const m = await C.rpc('sj_me'); C.setMe(Object.assign(m || {}, { at: Date.now() })); return m; };
  C.register = async (role, ship, pc, pin) => { const m = await C.rpc('sj_register', { p_role: role, p_ship: ship, p_pc: pc, p_pin: pin || null }); C.setMe(Object.assign(m, { at: Date.now() })); return m; };
  /* gzip + base64 */
  C.gz = async s => { const b = await new Response(new Blob([s]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer(), u = new Uint8Array(b); let o = ''; for (let i = 0; i < u.length; i += 0x8000) o += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000)); return btoa(o); };
  C.ungz = async b64 => { const b = atob(b64), u = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return new Response(new Blob([u]).stream().pipeThrough(new DecompressionStream('gzip'))).text(); };
  const hash = s => { let h = 2166136261 >>> 0; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h.toString(36) + ':' + s.length; };
  /* 상태 표시 */
  C.state = { busy: false, last: null, err: '', up: 0, down: 0 };
  C.badge = () => { if (window.SJUI && SJUI.syncPaint) SJUI.syncPaint(); const b = document.getElementById('sjAppHome'); if (!b) return; let c = b.querySelector('.cl'); if (!c) { c = document.createElement('i'); c.className = 'cl'; b.appendChild(c); }
    const m = C.me(), s = C.state; c.textContent = !m || m.status === 'none' ? '' : m.status !== 'approved' ? ' ☁⏳' : s.err ? ' ☁⚠' : s.busy ? ' ☁…' : s.last ? ' ☁✓' : ' ☁';
    b.title = '앱 홈 · App home' + (m && m.status === 'approved' ? `\n서버 동기화: ${s.err ? '오류 — ' + s.err : s.last ? new Date(s.last).toLocaleTimeString() + ' (올림 ' + s.up + ' · 받음 ' + s.down + ')' : '대기'}` : m && m.status === 'pending' ? '\n서버 동기화: 사무실 승인 대기' : ''); };
  /* 동기화 한 번: 올리기 → 받기 */
  C.sync = async function (A, force) { if (!A || C.state.busy || !navigator.onLine) return 0; let m = C.me();
    try { if (!m || !m.at || Date.now() - m.at > 10 * 60e3) m = await C.refresh(); } catch (e) { C.state.err = e.message; C.badge(); return 0; }
    if (!m || m.status !== 'approved') { C.badge(); return 0; }
    C.state.busy = true; C.badge(); let n = 0;
    try { const tool = A.tool, pushed = JSON.parse(LS('sejul_cloud_' + tool + '_pushed') || '{}'), seen = JSON.parse(LS('sejul_cloud_' + tool + '_seen') || '{}');
      const files = A.files(m) || [], mine = new Set(files.map(f => f.name)); C.state.up = 0; C.state.down = 0;
      for (const f of files) { const core = JSON.stringify(f.core), h = hash(core); if (!force && pushed[f.name] === h) continue;
        const at = new Date().toISOString(), body = await C.gz(JSON.stringify(Object.assign({}, f.obj, { savedAt: at })));
        await C.rpc('sj_put', { p_tool: tool, p_name: f.name, p_ship: f.ship, p_body: body, p_size: body.length, p_saved_at: at, p_pc: A.pc() }); pushed[f.name] = h; seen[f.name] = at; C.state.up++; }
      LSS('sejul_cloud_' + tool + '_pushed', JSON.stringify(pushed));
      const list = await C.rpc('sj_list', { p_tool: tool }) || [];
      for (const r of list) { if (r.mine || mine.has(r.name)) continue; const at = new Date(r.saved_at).toISOString(); if (!force && seen[r.name] && seen[r.name] >= at) continue;
        const b64 = await C.rpc('sj_get', { p_tool: tool, p_name: r.name }); if (!b64) continue;
        try { const o = JSON.parse(await C.ungz(b64)); n += (await A.apply(o, r)) || 0; } catch (e) { console.warn('cloud apply', r.name, e); }
        seen[r.name] = at; C.state.down++; }
      LSS('sejul_cloud_' + tool + '_seen', JSON.stringify(seen));
      if (n) await A.after(n);
      C.state.last = Date.now(); C.state.err = '';
      setTimeout(() => C.sumPush().catch(() => {}), 2500);
    } catch (e) { C.state.err = e.message; console.warn('cloud', e); }
    C.state.busy = false; C.badge(); return n; };
  /* 알림용 요약 올리기 — 선박: 자기 선박의 계획정비·위험성 요약 / 사무실: 선박별 DPA 결정 (바뀐 것만) */
  C.sumPush = async function () { const m = C.me(); if (!m || m.status !== 'approved' || !navigator.onLine) return;
    const rd = k => { try { return JSON.parse(LS('sejul_sum_' + k) || 'null'); } catch (e) { return null; } }, sp = rd('pms'), sr = rd('rsk'), out = [];
    if (m.role === 'ship') { const v = m.ship, s = sp && sp.ships && sp.ships[v], r = sr && sr.v && sr.v[v];
      if (s && sp.mode !== 'admin') out.push(['pms', v, { od: s.od || 0, d7: s.d7 || 0, d30: s.d30 || 0, cri: s.cri || 0, def: s.def || 0, defA: s.defA || 0, low: s.low || 0, D: s.D || [], R: s.R || [] }]);
      if (r && sr.site !== 'office') out.push(['rsk', v, { draft: r.draft || 0, waitN: r.wait || 0, stop: r.stop || 0, act: r.act || 0, moc: r.moc || 0, wait: (r.items || []).filter(x => x[0] === 'wait').map(x => [x[1], x[2]]), ptw: r.ptw || [] }]); }
    else if (sr && sr.site === 'office') Object.entries(sr.v || {}).forEach(([v, r]) => { if (v && v !== '—' && (r.dpa || []).length) out.push(['dpa', v, { list: r.dpa }]); });
    let h = {}; try { h = JSON.parse(LS('sejul_cloud_sum_h') || '{}'); } catch (e) { }
    for (const [tool, ship, data] of out) { const j = JSON.stringify(data), hk = tool + ':' + ship, hv = hash(j); if (h[hk] === hv) continue;
      try { await C.rpc('sj_summary_put', { p_ship: ship, p_tool: tool, p_data: data }); h[hk] = hv; } catch (e) { if (/does not exist|Could not find the function/i.test(e.message)) break; console.warn('sum', e.message); } }
    LSS('sejul_cloud_sum_h', JSON.stringify(h)); };
  /* 알림(푸시) 켜기·끄기·시험 */
  /* 알림 함수 이름: 대시보드에서 정한 이름이 달라도 찾아서 기억 (sj-push → sg-push → rapid-api) */
  C.FN = ['sj-push', 'sg-push', 'rapid-api'];
  C.fn = async (body) => { const saved = LS('sejul_push_fn'), names = saved ? [saved, ...C.FN.filter(n => n !== saved)] : C.FN; let last;
    for (const n of names) { const r = await fetch(C.url + '/functions/v1/' + n, { method: 'POST', headers: { apikey: C.key, 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); const t = await r.text(); let j; try { j = JSON.parse(t); } catch (e) { j = { error: t }; }
      if (r.status === 404 && /NOT_FOUND|not found/i.test(t)) { last = new Error('HTTP 404 function not found'); continue; }
      if (!r.ok) throw new Error('HTTP ' + r.status + ' ' + (j.error || j.message || j.msg || ''));
      LSS('sejul_push_fn', n); return j; }
    throw last || new Error('HTTP 404 function not found'); };
  const u8 = b => { const p = '='.repeat((4 - b.length % 4) % 4), s = atob((b + p).replace(/-/g, '+').replace(/_/g, '/')), a = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) a[i] = s.charCodeAt(i); return a; };
  C.pushState = async () => { if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) return 'unsup'; if (Notification.permission === 'denied') return 'denied';
    try { const reg = await navigator.serviceWorker.getRegistration(); const sub = reg && await reg.pushManager.getSubscription(); return sub ? 'on' : 'off'; } catch (e) { return 'off'; } };
  C.prefs = () => { let o = {}; try { o = JSON.parse(LS('sejul_push_prefs') || '{}') || {}; } catch (e) { } return Object.assign({ quiet: true, from: 1320, to: 420, ptw: true, types: {} }, o); };
  C.prefsSet = async o => { LSS('sejul_push_prefs', JSON.stringify(o)); const reg = await navigator.serviceWorker.getRegistration(), sub = reg && await reg.pushManager.getSubscription(); if (sub) await C.rpc('sj_push_prefs', { p_endpoint: sub.endpoint, p_prefs: o, p_tz: -new Date().getTimezoneOffset() }); };
  C.pushOn = async () => { const p = await Notification.requestPermission(); if (p !== 'granted') throw new Error(p === 'denied' ? 'denied' : 'dismissed');
    const reg = await navigator.serviceWorker.ready, { key } = await C.fn({ op: 'vapid' });
    let sub = await reg.pushManager.getSubscription(); if (sub && sub.options && sub.options.applicationServerKey) { const a = new Uint8Array(sub.options.applicationServerKey), b = u8(key); if (a.length !== b.length || a.some((x, i) => x !== b[i])) { await sub.unsubscribe(); sub = null; } }
    if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: u8(key) });
    await C.rpc('sj_push_sub', { p_sub: sub.toJSON(), p_tz: -new Date().getTimezoneOffset(), p_prefs: C.prefs() }); LSS('sejul_push_on', '1'); return true; };
  C.pushOff = async () => { const reg = await navigator.serviceWorker.getRegistration(), sub = reg && await reg.pushManager.getSubscription(); if (sub) { try { await C.rpc('sj_push_unsub', { p_endpoint: sub.endpoint }); } catch (e) { } await sub.unsubscribe(); } LSS('sejul_push_on', ''); };
  C.pushTest = () => C.fn({ op: 'test', key: C.devKey() });
  /* 도구 연결: 시작 5초 후 · 2분마다 · 저장 15초 후 · 창으로 돌아올 때 · 인터넷 연결될 때 */
  C.start = function (A) { if (!C.url || /__CLOUD/.test(C.url)) return; C.A = A; let t;
    const kick = (d) => { clearTimeout(t); t = setTimeout(() => C.sync(A), d); };
    kick(5000); setInterval(() => C.sync(A), 2 * 60e3); addEventListener('online', () => kick(3000)); addEventListener('focus', () => kick(2000));
    C.onSave = () => kick(15000); };
})();

/* ===== 도구별 연결 (도구 페이지에서만) ===== */
(function () { const C = window.SJCLOUD; if (!C || (window.SJAPP && SJAPP.isHub)) return;
  const fs = s => String(s || '').replace(/[^A-Za-z0-9가-힣_-]+/g, '_');
  const PMS = { tool: 'pms', pc: () => SJ.pcLabel('pms'),
    files(m) { const s = SJ.pcSlug('pms'), base = { pc: SJ.pcId('pms'), pcName: SJ.pcLabel('pms') };
      if (MODE === 'admin') { if (m.role !== 'office') return []; return Object.entries(OFFICE.ships || {}).map(([k, d]) => ({ name: `PMS_OFFICE_${s}__${fs(k)}.json`, ship: k, core: d, obj: Object.assign({ type: 'office', app: APP.name, schema: APP.schema, office: { ships: { [k]: d }, adminHash: OFFICE.adminHash } }, base) })); }
      if (!SHIP || /^__/.test(SHIP.ship.name)) return []; if (m.role === 'ship' && SHIP.ship.name !== m.ship) return [];
      return [{ name: `PMS_${fs(SHIP.ship.name)}_${s}.json`, ship: SHIP.ship.name, core: SHIP, obj: Object.assign(wrapShipData(SHIP), base) }]; },
    apply(o) { if (MODE !== 'admin' && o.type === 'office' && SHIP && !(o.office.ships || {})[SHIP.ship.name]) return 0; return pmsApplyObj(o); },
    async after(n) { SY.base = {}; trackAll(); await KV.set('ship', SHIP); await KV.set('office', OFFICE); try { resetHistory(); } catch (e) { } if (pmsBusy()) { SY.pending += n; renderTop(); } else { render(); toast(L(`서버에서 변경 ${n}건을 받아 합쳤습니다`, `Merged ${n} changes from the server`)); } } };
  const RSK = { tool: 'rsk', pc: () => fsPcLabel(),
    files(m) { const base = { kind: 'SEJUL-RSK-DATA', app: APP_VER, pc: fsPc(), pcName: fsPcLabel() };
      if (DB.settings.site === 'office') { if (m.role !== 'office') return []; const V = [...new Set(['ras', 'ptws', 'mocs', 'rirs'].flatMap(k => (DB[k] || []).map(x => x.vessel)).filter(Boolean))];
        return V.map(v => { const d = { ras: DB.ras.filter(x => x.vessel === v), ptws: DB.ptws.filter(x => x.vessel === v), mocs: DB.mocs.filter(x => x.vessel === v), rirs: DB.rirs.filter(x => x.vessel === v), reg: DB.reg, del: DB.del, stdEdit: DB.stdEdit, simM: DB.simM, simW: DB.simW, stdMeta: DB.stdMeta, settings: {} };
          return { name: `RSK_OFFICE_${fs(fsPcLabel())}__${fs(v)}.json`, ship: v, core: d, obj: Object.assign({ vessel: v, data: d }, base) }; }); }
      const v = vesselName(); if (!v || /^__/.test(v) || (m.role === 'ship' && v !== m.ship)) return [];
      return [{ name: fsName(), ship: v, core: DB, obj: Object.assign({ vessel: v, data: DB }, base) }]; },
    apply(j) { return j && j.data ? fsMerge(migrate(j.data)) : 0; },
    async after(n) { _save0(); try { applyStd && applyStd(); } catch (e) { } if (fsTyping() || MODAL) { FS.pending = (FS.pending || 0) + n; fsBadge(); } else { render(); toast(t(`서버에서 변경 ${n}건을 받아 합쳤습니다`, `Merged ${n} changes from the server`)); } } };
  const boot = () => { let A = null;
    if (typeof pmsApplyObj === 'function' && typeof SJ !== 'undefined') { A = PMS; if (typeof doSave === 'function' && !doSave.__cl) { const d0 = doSave; doSave = async function () { const r = await d0.apply(this, arguments); C.onSave && C.onSave(); return r; }; doSave.__cl = 1; } }
    else if (typeof fsMerge === 'function' && typeof DB !== 'undefined') { A = RSK; if (typeof save === 'function' && !save.__cl) { const s0 = save; save = function () { const r = s0.apply(this, arguments); C.onSave && C.onSave(); return r; }; save.__cl = 1; } }
    if (!A) return setTimeout(boot, 1000); C.start(A); setTimeout(C.badge, 1500); };
  if (document.readyState === 'complete') setTimeout(boot, 1200); else addEventListener('load', () => setTimeout(boot, 1200));
})();
