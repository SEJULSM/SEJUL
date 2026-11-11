/* ===== SEJUL 앱 셸 — 앱(PWA) 안에서 도구를 열 때만 =====
   · 모든 도구가 같은 왼쪽 메뉴(ui.js) + 흰 머리글 + 같은 바탕
   · 기기 종류(선박/사무실)·선박·PC 이름·언어·회사 정보·동기화·백업 폴더는 앱 [설정] 한 곳 → 도구 화면의 해당 단추·안내는 숨김
   · 선박 기기 = 자기 선박만 / 사무실 기기 = 선대 전체 (왼쪽 위 '보는 선박')
   · 도구 상태를 요약해 앱 홈 '오늘 할 일'·선대 현황에 보냄 (sejul_sum_pms / sejul_sum_rsk)
   · 앱 홈에서 누른 항목으로 바로 이동 (?go=data-속성 JSON) */
(function () {
  const C = window.SJAPP; if (!C || C.isHub) return; C.shell = true;
  const U = window.SJUI, T = U.T;
  const CO0 = { dpaName: 'Noh You Seok', dpaPhone: '+82-10-6588-7959', dpaEmail: 'nohys@sejulsm.com', sqEmail: 'sjsm@sejulsm.com' };
  C.company = () => { let o = {}; try { o = JSON.parse(C.get('company') || '{}') || {}; } catch (e) { } Object.keys(CO0).forEach(k => { if (!o[k]) o[k] = CO0[k]; }); return o; };
  C.mode = () => U.role() === 'office' && U.officeOK() ? 'office' : 'ship';
  const TOOL = /rsk\.html/.test(location.pathname) ? 'rsk' : 'pms';

  /* ---------- 디자인 ---------- */
  const css = U.css + `
:root{--sjx-bg:#F3F4F6;--sjx-line:#E3E6EB;--sjx-ink:#0F172A;--sjx-navy:#1B2F5B;--sjx-mut:#5B6474}
:root{--bg:var(--sjx-bg)!important;--sj-bg:var(--sjx-bg)!important;--line:var(--sjx-line);--sj-line:var(--sjx-line)}
body{background:var(--sjx-bg)!important;font-family:'Pretendard','Noto Sans KR','Malgun Gothic','Apple SD Gothic Neo',system-ui,sans-serif!important}
@media (min-width:900px){
 body{padding-left:248px!important}
 #top.sj-top,#sjFoot{left:248px!important}
 #top .sjbar,header.top .bar{background:#FFFFFF!important;color:var(--sjx-ink)!important;box-shadow:none!important;border-bottom:0!important;min-height:64px!important;padding-left:28px!important;padding-right:28px!important}
 #top .sjbar .logo,header.top .bar .logo{color:var(--sjx-ink)!important;font-size:21px!important;font-weight:800!important}
 #top .sjbar .logo .en{color:var(--sjx-mut)!important;font-size:13px!important;font-weight:500!important}
 #top .sjbar .logo small,header.top .bar .logo small{color:var(--sjx-mut)!important;font-size:12px!important;opacity:1!important}
 #top .sj-tool{background:#fff!important;color:var(--sjx-ink)!important;border:1px solid #CBD2DC!important}
 #top .sj-tool:disabled{opacity:.45}
 #top .sj-nav,header.top .nav{background:#FFFFFF!important;border-bottom:1px solid var(--sjx-line)!important;padding-left:18px!important;box-shadow:none!important}
 #top .sj-nav>button,header.top .nav>button{color:var(--sjx-mut)!important;background:transparent!important;border-radius:0!important;box-shadow:none!important;border-bottom:3px solid transparent!important;font-weight:500!important}
 #top .sj-nav>button:hover,header.top .nav>button:hover{color:var(--sjx-ink)!important}
 #top .sj-nav>button.on{color:var(--sjx-navy)!important;border-bottom-color:var(--sjx-navy)!important;font-weight:700!important}
 header.top .nav>button.on{color:#C2410C!important;border-bottom-color:#C2410C!important;font-weight:700!important}
 .sjx-home{display:none!important}
}
#top .sj-lang,#top .sj-fs,#top .sj-site,#top .sj-ves,header.top #lang,header.top #fsst,header.top .siteSw,header.top #ves,
.mtmode,.mtr:has([data-a=siteSet]),.mtr:has([data-a=lang]),#mtab [data-act^=lang],.sj-sheet [data-act^=lang],.sj-sheet [data-sjsite],[data-act=shipChange],
.sj-card:has([data-sjconf=dpaName]),.sj-card.wipe,[data-a=resetAll],[data-a=pcNameReset],#top .sj-nav [data-go=fleet],#top .sj-nav [data-go=settings],#mtab [data-go=fleet],#sjFoot [data-go=fleet],#mtab [data-go=settings],.sj-sheet [data-go=settings],#top .sj-nav>[data-go=fleet],#top .sj-nav>[data-go=settings],#mtab [data-go=settings],.sj-sheet [data-go=settings],.sj-card.wipe,.resetbox,[data-a=delAll],[data-a=resetAll],.sj-card:has(#npw),.card:has(> .grid input[data-b=dpaName]),label:has(> select[data-b=vessel]),.f:has(> select[data-b=vessel]),.f:has(input[data-b=vesselOther]){display:none!important}
.sjx-home{display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:9px;background:#ffffff1f;color:#fff;text-decoration:none;font-size:17px;flex:none;margin-right:4px}
.sjx-card{border:1px solid var(--sjx-line);border-radius:14px;background:#fff;padding:14px 16px;margin-bottom:14px;display:flex;gap:14px;align-items:center;flex-wrap:wrap}
.sjx-card .tx{flex:1;min-width:220px;font-size:13.5px;color:#3B4352;line-height:1.55}.sjx-card b{color:var(--sjx-ink);font-size:14.5px}
.sjx-pick{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;margin-top:16px}.sjx-pick button{text-align:left;background:#fff;border:1px solid var(--sjx-line);border-radius:14px;padding:16px;font:inherit;cursor:pointer;min-height:64px}.sjx-pick button:hover{border-color:#9AA6B8}.sjx-pick b{display:block;font-size:16px}.sjx-pick small{color:var(--sjx-mut)}.sjx-empty{background:#fff;border:1px solid var(--sjx-line);border-radius:16px;padding:28px;margin:8px 0;font-size:14.5px;line-height:1.7;color:#3B4352}.sjx-empty h2{margin:0 0 6px;font-size:20px;color:var(--sjx-ink)}
.sjx-card a{background:var(--sjx-navy);color:#fff;text-decoration:none;border-radius:9px;padding:8px 14px;font-weight:700;font-size:13.5px}`;
  const st = document.createElement('style'); st.textContent = css; (document.head || document.documentElement).appendChild(st);

  /* ---------- 왼쪽 메뉴 ---------- */
  C.ensureBar = function () {
    let r = document.querySelector('.sjr'); if (!r) { const w = document.createElement('div'); w.innerHTML = U.rail(TOOL, '../'); document.body.appendChild(w.firstElementChild); U.syncPaint(); }
    const bar = document.querySelector('#top .sjbar, header.top .bar'); /* 휴대폰: 머리글에 ⌂ */
    if (bar && !bar.querySelector('.sjx-home')) { const a = document.createElement('a'); a.className = 'sjx-home'; a.href = '../index.html'; a.title = T('앱 홈', 'App home'); a.textContent = '⌂'; bar.insertBefore(a, bar.firstChild); } };
  const railRefresh = () => { const r = document.querySelector('.sjr'); if (r) r.remove(); C.ensureBar(); };
  const appCard = cls => `<div class="${cls} sjx-card"><span class="tx"><b>${T('앱 공통 설정', 'App settings')}</b><br>${T('기기 종류(선박/사무실)·선박·PC 이름·언어·회사 정보(DPA)·서버 동기화·백업 폴더는 앱 [설정]에서 한 번에 관리합니다. 이 화면에는 이 도구에만 필요한 설정만 있습니다.', 'Device type, vessel, PC name, language, company (DPA), sync and backup folder are managed once in app Settings. Only settings for this tool are here.')}</span><a href="../index.html#settings">${T('앱 설정 열기', 'Open app settings')}</a></div>`;
  const noData = (v, tool) => `<div class="sjx-empty"><h2>${U.esc(v)}</h2>${T(`아직 이 선박의 ${tool} 자료를 받지 못했습니다.<br>선박 기기가 앱에 등록되고 사무실이 [기기 승인]을 하면, 선박에서 입력한 자료가 자동으로 들어옵니다.`, `No ${tool} data from this vessel yet. It arrives once a ship device is registered and approved.`)}<div style="margin-top:14px"><a href="../index.html#devices" style="font-weight:700">${T('기기 승인 화면으로 →', 'Go to device approval →')}</a></div></div>`;
  document.addEventListener('click', e => { const b = e.target.closest && e.target.closest('[data-sjpick]'); if (!b) return; C.set('view', b.dataset.sjpick); if (U.onView) U.onView(b.dataset.sjpick); }, true);
  const fire = attrs => { const b = document.createElement('button'); b.hidden = true; Object.entries(attrs).forEach(([k, v]) => b.setAttribute('data-' + k, v)); document.body.appendChild(b); b.click(); b.remove(); };
  let sumT; const sumSoon = X => { clearTimeout(sumT); sumT = setTimeout(() => { try { X.sum(); railRefresh(); } catch (e) { console.warn('sum', e); } }, 1500); };

  /* ---------- 계획정비 ---------- */
  const PMS = {
    ok: () => typeof pmsApplyObj === 'function' && typeof SJ !== 'undefined' && typeof ACT !== 'undefined' && typeof shipStats === 'function',
    hook() {
      try { FOLDER_ASKED = true; } catch (e) { } try { folderGate = function () { }; } catch (e) { }
      try { const sm = setupMissing9; setupMissing9 = () => sm().filter(x => !['fs', 'pc', 'vessel'].includes(x[0])); } catch (e) { }
      try { pmsFolderCard = () => appCard('sj-card'); } catch (e) { }
      try { const t0 = pmsTabs; pmsTabs = () => t0().filter(k => k !== 'fleet' && k !== 'settings'); } catch (e) { }
      /* 복구: 예전 '전체 초기화'로 막힌 기본 선박 자료(SUNNY QUEEN·KTS WHITE)와 서버 자료를 다시 받음 */
      let fix = false;
      try { if (OFFICE.wiped) { OFFICE.wiped = false; fix = true; if (typeof ensureVessels === 'function') ensureVessels(); KV.set('office', OFFICE); } } catch (e) { }
      try { if (SY.adopt === '9999') { SY.adopt = ''; fix = true; } } catch (e) { }
      if (fix || localStorage.getItem('sejul_restore_pms')) { ['sejul_cloud_pms_seen', 'sejul_cloud_pms_pushed', 'sejul_restore_pms'].forEach(k => localStorage.removeItem(k)); C.restoring = true; }
    },
    after() { if (MODE !== 'admin') return; const main = document.getElementById('main'); if (!main) return; const view = C.get('view') || '';
      if (!view || route() === 'fleet') { const S = (U.sum('pms') || {}).ships || {};
        main.innerHTML = `<div class="sjx-empty"><h2>${T('선박을 고르세요', 'Choose a vessel')}</h2>${T('사무실 기기는 선박을 하나 골라 그 선박의 계획정비를 봅니다 (왼쪽 위 [보는 선박]으로도 바꿉니다). 선대 전체 현황은 <a href="../index.html">앱 홈</a>에 있습니다.', 'Pick one vessel (or use Viewing at top left). The fleet overview is on the <a href="../index.html">app home</a>.')}<div class="sjx-pick">${U.VES.map(v => `<button data-sjpick="${U.esc(v)}"><b>${U.esc(v)}</b><small>${OFFICE.ships[v] ? (S[v] ? T(`기한 초과 ${S[v].od} · 미결 결함 ${S[v].def}`, `Overdue ${S[v].od} · defects ${S[v].def}`) : T('자료 있음', 'Has data')) : T('아직 받은 자료 없음', 'No data yet')}</small></button>`).join('')}</div></div>`; return; }
      if (!OFFICE.ships[view]) main.innerHTML = noData(view, T('계획정비', 'Maintenance')); },
    apply() { let ch = 0; const co = C.company();
      Object.entries(co).forEach(([k, v]) => { if (SJ.conf('pms')[k] !== v) SJ.confSet('pms', k, v); });
      const want = C.mode();
      if (want === 'office' && MODE !== 'admin') { MODE = 'admin'; try { resetHistory(); } catch (e) { } ch++; }
      else if (want === 'ship' && MODE === 'admin') { MODE = 'ship'; try { resetHistory(); } catch (e) { } location.hash = '#/home'; ch++; }
      if (want === 'office') { const view = C.get('view') || '';   /* 계획정비는 늘 고른 한 선박만 — 자료가 없으면 '자료 없음' 안내 (다른 선박을 보여주지 않음) */
        if (view && OFFICE.ships[view] && OFFICE.sel !== view) { OFFICE.sel = view; ch++; }
        if (view && (/fleet/.test(location.hash) || !location.hash) && !/fleet/.test(new URLSearchParams(location.search).get('go') || '')) { location.hash = '#/home'; ch++; } }
      const v = C.get('vessel');
      if (want === 'ship' && v && SHIP && SHIP.ship.name !== v && typeof switchShip === 'function') setTimeout(() => switchShip(v, true), 50);
      else if (want === 'ship' && v && !SHIP && ACT.v9pickVessel) { const b = document.createElement('button'); b.dataset.name = v; ACT.v9pickVessel(b);
        setTimeout(() => { const m = document.querySelector('#mback .modal:last-child'), ok = m && m.querySelector('.mf button:last-child'); if (ok && /선박|vessel/i.test(m.textContent || '')) ok.click(); }, 60); }
      if (ch) render(); },
    view(v) { if (MODE !== 'admin') return; if (!v) { location.href = '../index.html'; return; } if (OFFICE.ships[v]) OFFICE.sel = v; location.hash = '#/home'; render(); },
    sum() { const ships = MODE === 'admin' ? OFFICE.ships : (SHIP ? { [SHIP.ship.name]: SHIP } : {}), out = {};
      for (const [n, db] of Object.entries(ships)) { try { const { c } = shipStats(db), td = typeof opsTodo === 'function' ? opsTodo(db) : { O: [], S: [] };
        out[n] = { od: c.od, d7: c.d7, d30: c.d30, nd: c.nd, cri: c.cri, def: c.def, defA: c.defA, low: c.low, n: c.n, E: c.E, S: td.S.slice(0, 15), O: td.O.slice(0, 15),
          D: td.O.filter(x => x[0] === 'def').slice(0, 30).map(x => [x[1], x[2], x[3]]),
          R: (typeof RQS === 'function' ? RQS(db) : []).filter(r => r.st === 'sent').slice(0, 30).map(r => [r.id, r.no + (r.kind === 'rep' ? ' (수리 repair)' : '') + ' · ' + (r.items || []).length + '건', r.urg === 'u' ? 'u' : 'n']) }; } catch (e) { } }
      localStorage.setItem('sejul_sum_pms', JSON.stringify({ at: Date.now(), mode: MODE, ships: out })); },
    hookRender() { const r0 = render; render = function () { const x = r0.apply(this, arguments); try { PMS.after(); } catch (e) { } sumSoon(PMS); return x; }; }
  };
  /* ---------- 위험성 관리 ---------- */
  const RSK = {
    ok: () => typeof fsMerge === 'function' && typeof DB !== 'undefined' && typeof V !== 'undefined' && typeof A !== 'undefined' && typeof raStatus === 'function',
    hook() {
      try { const sm = setupMissing; setupMissing = () => sm().filter(x => !['fs', 'pc', 'vessel'].includes(x[0])); } catch (e) { }
      if (localStorage.getItem('sejul_restore_rsk')) { ['sejul_cloud_rsk_seen', 'sejul_cloud_rsk_pushed', 'sejul_restore_rsk'].forEach(k => localStorage.removeItem(k)); C.restoring = true; }
      try { fsCard = () => appCard('card') + '<div>'; pcNameHTML = () => ''; } catch (e) { }
      try { const h0 = V.home; V.home = () => h0().replace(/<div class="al (?:warn|err)" style="margin-bottom:14px"><span class="ic">(?:🔓|💾)[\s\S]*?<\/div>/, ''); } catch (e) { }
    },
    apply() { let ch = 0; const s = DB.settings, co = C.company();
      Object.entries(co).forEach(([k, v]) => { if (s[k] !== v) { s[k] = v; ch++; } });
      const site = C.mode(); if ((s.site || 'ship') !== site) { s.site = site; ch++; }
      const v = C.get('vessel');
      if (site === 'ship' && v) { const known = typeof VESSELS !== 'undefined' && VESSELS.includes(v);
        if (known ? s.vessel !== v : (s.vessel !== '__other' || s.vesselOther !== v)) { if (known) s.vessel = v; else { s.vessel = '__other'; s.vesselOther = v; } if (typeof VESSEL_MAIL !== 'undefined' && VESSEL_MAIL[v]) s.shipEmail = VESSEL_MAIL[v]; ch++; } }
      const m = U.me(); if (m && m.status === 'approved') s.lastBackup = new Date().toISOString().slice(0, 10);   /* 서버에 사본이 있으므로 '데이터 파일 백업' 안내 끔 */
      if (ch) { save(); render(); } },
    view(v) { if (!v) { location.href = '../index.html'; return; } render(); },
    sum() { const by = {}, g = n => by[n] = by[n] || { draft: 0, wait: 0, stop: 0, act: 0, moc: 0, items: [] };
      const st = (f, x) => { try { return f(x)[0]; } catch (e) { return ''; } };
      (DB.ras || []).forEach(r => { const k = st(raStatus, r), b = g(r.vessel || '—'); if (b[k] != null && k !== 'act') { b[k]++; if (b.items.length < 10) b.items.push([k, r.id, (r.no ? r.no + ' ' : '') + (r.title || '')]); } });
      (DB.ptws || []).forEach(p => { if (st(ptwStatus, p) !== 'act') return; const b = g(p.vessel || '—'); b.act++; const e = p.to ? new Date(p.to) : null; if (e && !isNaN(e)) (b.ptw = b.ptw || []).push({ id: p.id, no: p.no || 'PTW', t: String(p.desc || p.location || '').slice(0, 60), end: e.toISOString() }); });
      (DB.ras || []).forEach(r => { const dec = r.apv && r.apv.dpaDecision; if (dec) (g(r.vessel || '—').dpa = g(r.vessel || '—').dpa || []).push({ id: r.id, no: r.no || '', t: String(r.title || '').slice(0, 60), dec }); });
      (DB.mocs || []).forEach(m => { if (!(m.close && m.close.apvDate)) g(m.vessel || '—').moc++; });
      localStorage.setItem('sejul_sum_rsk', JSON.stringify({ at: Date.now(), site: DB.settings.site, crew: (DB.settings.crew || []).length, v: by })); },
    hookRender() { const r0 = render; render = function () { const v = C.get('view') || '', off = DB.settings.site === 'office', K = ['ras', 'ptws', 'mocs', 'rirs'], keep = {};
        if (off && v) K.forEach(k => { keep[k] = DB[k] || []; DB[k] = keep[k].filter(x => x.vessel === v); });   /* 사무실: 고른 선박만 보이게 (그리는 동안만) */
        let x; try { x = r0.apply(this, arguments); } finally { if (off && v) K.forEach(k => { const shown = DB[k]; DB[k] = keep[k].filter(y => y.vessel !== v || shown.includes(y)).concat(shown.filter(y => !keep[k].includes(y))); }); }
        try { if (off && v) { const h = document.querySelector('.page-h h2'); if (h && !h.querySelector('.sjv')) h.insertAdjacentHTML('beforeend', ` <span class="sjv" style="font-size:14px;color:#5B6474;font-weight:500">· ${U.esc(v)}</span>`); } } catch (e) { }
        sumSoon(RSK); return x; }; }
  };
  /* ---------- 시작 ---------- */
  let tries = 0;
  const boot = () => { const X = TOOL === 'pms' ? (PMS.ok() ? PMS : null) : (RSK.ok() ? RSK : null);
    if (!X) { if (++tries < 60) setTimeout(boot, 500); return; }
    try { const m = U.me(); if (!C.get('pcname') && m && m.pc) C.set('pcname', m.pc); } catch (e) { }
    X.hook(); try { X.apply(); } catch (e) { console.warn('shell apply', e); }
    if (C.restoring) setTimeout(() => { try { if (window.SJCLOUD && SJCLOUD.A) SJCLOUD.sync(SJCLOUD.A, true); } catch (e) { } }, 6000);
    if (X === RSK && /^#settings/.test(location.hash)) { try { A.go({ v: 'settings' }); } catch (e) { } }
    X.hookRender(); try { render(); } catch (e) { }
    C.ensureBar(); setInterval(C.ensureBar, 1000); setInterval(U.syncPaint, 20e3);
    U.onView = v => { try { X.view(v); } catch (e) { } railRefresh(); };
    /* PTW 만료 30분 전 — 이 기기에서 위험성 관리를 열어 둔 동안 (인터넷 없어도) */
    if (X === RSK) setInterval(() => { try { if (!('Notification' in window) || Notification.permission !== 'granted' || DB.settings.site === 'office') return; const pf = SJCLOUD.prefs ? SJCLOUD.prefs() : {}; if ((pf.types || {}).ptw === false) return; if (pf.quiet && !pf.ptw) { const d = new Date(), m = d.getHours() * 60 + d.getMinutes(), f = pf.from, t2 = pf.to; if (f !== t2 && (f < t2 ? m >= f && m < t2 : m >= f || m < t2)) return; } const v = vesselName(), now = Date.now(); let seen = {}; try { seen = JSON.parse(localStorage.getItem('sejul_ptw_alerted') || '{}'); } catch (e) { }
      (DB.ptws || []).forEach(p => { if (p.vessel !== v || ptwStatus(p)[0] !== 'act' || !p.to) return; const e = new Date(p.to).getTime(), k = p.id + ':' + p.to; if (seen[k] || e - now > 30 * 60e3 || now - e > 10 * 60e3) return; seen[k] = now;
        navigator.serviceWorker && navigator.serviceWorker.ready.then(reg => reg.showNotification(v + ' — ' + T('PTW 곧 만료', 'Permit expiring'), { body: (p.no || 'PTW') + ' ' + (p.desc || p.location || '') + ' — ' + String(p.to).slice(11, 16) + T(' 만료', ' expires'), tag: 'ptw-' + p.id, icon: '../icon-192.png', data: { url: 'tools/rsk.html' } })); });
      localStorage.setItem('sejul_ptw_alerted', JSON.stringify(seen)); } catch (e) { } }, 60e3);
    /* 앱 홈에서 누른 항목으로 이동 */
    const q = new URLSearchParams(location.search).get('go'); if (q) { setTimeout(() => { try { const o = JSON.parse(q); if (o.view && MODE === 'admin' && OFFICE.ships[o.view]) { OFFICE.sel = o.view; } if (o.hash) location.hash = o.hash; if (o.attrs) setTimeout(() => fire(o.attrs), 300); } catch (e) { } history.replaceState(null, '', location.pathname + location.hash); }, 900); }
    addEventListener('storage', e => { if (/^sejul_common_(vessel|role|lang|company|pcname)$/.test(e.key || '')) { try { X.apply(); } catch (er) { } railRefresh(); } });
    addEventListener('pageshow', () => { try { X.apply(); } catch (er) { } railRefresh(); }); };
  if (document.readyState === 'complete') setTimeout(boot, 500); else addEventListener('load', () => setTimeout(boot, 500));
})();
