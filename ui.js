/* ===== SEJUL 공통 화면 틀 — 왼쪽 메뉴(레일) · 색 · 요약 자료 =====
   앱 홈(index.html)과 도구 페이지(shell.js)가 같은 메뉴를 그림. 도구를 옮겨도 위치가 같음. */
(function () {
  const C = window.SJAPP = window.SJAPP || {}, U = window.SJUI = {};
  const EN = () => (C.get && C.get('lang') || 'ko') === 'en'; U.T = (k, e) => EN() ? (e || k) : k;
  U.esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  U.VES = ['KTS GOLD', 'KTS SILVER', 'KTS RED', 'KTS WHITE', 'KTS GREEN', 'KTS BLUE', 'SKY ROYAL', 'SUNNY QUEEN'];
  /* 기기 종류: 처음 설정에서 정함 (선박 / 사무실). 서버 등록 정보가 있으면 그것을 따름 */
  U.me = () => window.SJCLOUD && SJCLOUD.me ? SJCLOUD.me() : null;
  U.role = () => { const m = U.me(); if (m && m.role && m.status !== 'none') return m.role; return C.get('role') || ''; };
  /* 기기 종류: PC · 노트북 · 태블릿 · 휴대폰 (처음 설정에서 자동으로 고르고 바꿀 수 있음) */
  U.KINDS = [['pc', '🖥', 'PC', 'Desktop PC'], ['laptop', '💻', '노트북', 'Laptop'], ['tablet', '📟', '태블릿', 'Tablet'], ['phone', '📱', '휴대폰', 'Phone']];
  U.kindGuess = () => { const ua = navigator.userAgent, touch = navigator.maxTouchPoints > 1; if (/iPad/.test(ua) || (/Macintosh/.test(ua) && touch) || (/Android/.test(ua) && !/Mobile/.test(ua))) return 'tablet'; if (/iPhone|Android.*Mobile|Mobile/.test(ua)) return 'phone'; return 'pc'; };
  U.kindLabel = k => { const x = U.KINDS.find(y => y[0] === k); return x ? x[1] + ' ' + U.T(x[2], x[3]) : '—'; };
  U.officeOK = () => { const m = U.me(); return !!(m && m.role === 'office' && m.status === 'approved'); };
  U.code = id => { const h = String(id || '').replace(/-/g, '').toUpperCase(); return h ? h.slice(0, 4) + '-' + h.slice(4, 8) : '—'; };
  U.sum = k => { try { return JSON.parse(localStorage.getItem('sejul_sum_' + k) || 'null'); } catch (e) { return null; } };
  U.ago = t => { if (!t) return '—'; const m = (Date.now() - new Date(t)) / 60e3; return m < 2 ? U.T('방금', 'just now') : m < 60 ? Math.round(m) + U.T('분 전', ' min ago') : m < 1440 ? Math.round(m / 60) + U.T('시간 전', ' h ago') : Math.round(m / 1440) + U.T('일 전', ' d ago'); };
  const P = {
    home: 'M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5M10 21v-6h4v6',
    pms: 'M14.7 6.3a4 4 0 0 0 5.2 5.2l-8.6 8.6a2.1 2.1 0 0 1-3-3l8.6-8.6M14.7 6.3 17 4l3 3-2.3 2.3',
    rsk: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM12 8v4M12 16h.01',
    dev: 'M4 5h16v11H4zM8 20h8M12 16v4',
    stw: 'M9 3h6M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2h12.4a1.5 1.5 0 0 0 1.3-2L14 9V3M7 15h10',
    sms: 'M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6M8 13h8M8 17h5',
    set: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
    ship: 'M3 17l1.5 3h15L21 17M5 17V11h14v6M9 11V6h6v5M12 3v3',
    bld: 'M3 21h18M5 21V7l7-4 7 4v14M9 9h1M14 9h1M9 13h1M14 13h1M9 17h1M14 17h1'
  };
  U.ic = (k, s) => `<svg width="${s || 19}" height="${s || 19}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${P[k] || k}"/></svg>`;
  U.css = `
.sjr{position:fixed;left:0;top:0;bottom:0;width:248px;z-index:900;box-sizing:border-box;background:#14244A;color:#E6EBF5;font-family:'Pretendard','Noto Sans KR','Malgun Gothic','Apple SD Gothic Neo',system-ui,sans-serif;display:flex;flex-direction:column;padding:16px 14px;gap:4px;overflow-y:auto}
.sjr *{box-sizing:border-box}.sjr [hidden]{display:none!important}.sjr a{text-decoration:none}
.sjr .sj-lg{display:flex;align-items:center;gap:10px;padding:4px 8px 14px;color:#fff}.sjr .sj-lg i{width:36px;height:36px;border-radius:10px;background:#F2B705;color:#14244A;display:flex;align-items:center;justify-content:center;font:800 18px/1 inherit;font-style:normal}
.sjr .sj-lg b{display:block;font-size:15.5px}.sjr .sj-lg small{display:block;font-size:11.5px;color:#8F9BB8;letter-spacing:.05em}
.sjr .sj-vb{display:flex;align-items:center;gap:10px;background:#1E3260;border:1px solid #2C4377;border-radius:12px;padding:9px 11px;margin-bottom:8px;color:#fff;width:100%;text-align:left;font:inherit}
.sjr .sj-vb .sj-vi{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex:none}.sjr .sj-vb .sj-vi.s{background:#E8EDF7;color:#1B2F5B}.sjr .sj-vb .sj-vi.o{background:#FEF3D7;color:#8A5A00}
.sjr .sj-vb .sj-vt{flex:1;min-width:0}.sjr .sj-vb .sj-vt small{display:block;font-size:12.5px;color:#A9B4CE}.sjr .sj-vb .sj-vt b{display:block;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sjr .sj-vb select{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;color:#0F172A;background:#fff}.sjr .sj-vb select option{color:#0F172A;background:#fff}.sjr .sj-vbw{position:relative}
.sjr .sj-hd{font-size:12px;font-weight:800;letter-spacing:.12em;color:#7F8DB0;text-transform:uppercase;margin:12px 10px 4px;display:flex;align-items:center;gap:8px}.sjr .sj-hd::after{content:'';flex:1;height:1px;background:#2A3D6B}
.sjr .sj-it{position:relative;display:flex;align-items:center;gap:12px;padding:9px 12px;border-radius:10px;color:#EEF2FA;font-size:15px;font-weight:600;min-height:46px}
.sjr .sj-it .sj-lt{display:flex;flex-direction:column;line-height:1.2;min-width:0}.sjr .sj-it .sj-lt small{font-size:12.5px;font-weight:500;color:#AFBEDF;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sjr .sj-it:not(.on):hover{background:#22396C}.sjr .sj-it .sj-ii{color:#9FB0D6;display:flex}
.sjr .sj-it.on,.sjr .sj-vs.on{background:#fff;color:#13254D;font-weight:800;box-shadow:0 2px 10px rgba(0,0,0,.25)}.sjr .sj-it.on .sj-ii{color:#2F5496}.sjr .sj-it.on .sj-lt small{color:#4A5B80}
.sjr .sj-it.on::before,.sjr .sj-vs.on::before{content:'';position:absolute;left:-14px;top:8px;bottom:8px;width:5px;border-radius:0 4px 4px 0;background:#F2B705}
.sjr .sj-it .sj-bd,.sjr .sj-vs .sj-bd{margin-left:auto;background:#D92D20;color:#fff;border-radius:10px;padding:1px 8px;font-size:12px;font-weight:700}.sjr .sj-bd.y{background:#F2B705!important;color:#14244A!important}
.sjr .sj-vl{display:flex;flex-direction:column;gap:2px;margin:2px 0 0 14px;padding-left:10px;border-left:2px solid #2A3D6B}
.sjr .sj-vs{position:relative;display:flex;align-items:center;gap:9px;padding:5px 10px;border-radius:8px;color:#D5DCEB;font-size:13.5px;font-weight:600;min-height:31px;letter-spacing:.01em}.sjr .sj-vs:not(.on):hover{background:#22396C;color:#fff}.sjr .sj-vs.on::before{left:-25px}
.sjr .sj-vs.cur{background:#2C4377;color:#fff;font-weight:800;box-shadow:inset 0 0 0 1.5px #F2B705}
.sjr .sj-vs .sj-vn{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sjr .sj-dt{width:9px;height:9px;border-radius:50%;background:#56688F;flex:none}.sjr .sj-dt.r{background:#F04438}.sjr .sj-dt.y{background:#F2B705}.sjr .sj-dt.g{background:#3CCB7F}
.sjr .sj-soon{display:flex;align-items:center;gap:6px;margin:10px 10px 0;font-size:12.5px;white-space:nowrap;color:#6F7C9C}.sjr .sj-soon span{border:1px solid #3A4E7C;border-radius:10px;padding:0 7px;font-size:11px;color:#8F9BB8}
.sjr .sj-up .sj-ut{display:flex;flex-direction:column;line-height:1.25}.sjr .sj-up .sj-ut span{font-size:13px;color:#C9D2E6}.sjr .sj-up .sj-ut small{font-size:12.5px;color:#8F9BB8}.sjr .sj-up.has{background:#F2B705!important;color:#14244A!important}.sjr .sj-up.has .sj-ii,.sjr .sj-up.has .sj-ut span,.sjr .sj-up.has .sj-ut small{color:#14244A!important;font-weight:700}
.sjr .sj-ft{margin-top:auto;display:flex;flex-direction:column;gap:6px;padding-top:10px}
.sjr .sj-sy{display:flex;align-items:center;gap:9px;background:#0F1D3D;border-radius:12px;padding:10px 12px;font-size:13.5px;color:#C9D2E6}.sjr .sj-sy .sj-d{width:9px!important;height:9px!important;min-width:0!important;padding:0!important;border-radius:50%;background:#8F9BB8;flex:none}.sjr .sj-sy .sj-d.ok{background:#3CCB7F}.sjr .sj-sy .sj-d.warn{background:#F2B705}.sjr .sj-sy .sj-d.err{background:#F04438}
@media (max-width:899px){.sjr{display:none!important}}
@media print{.sjr,.sjmob{display:none!important}}
.sjmob{display:none}
@media (max-width:899px){
 .sjmob{display:block;font-family:'Pretendard','Noto Sans KR','Malgun Gothic','Apple SD Gothic Neo',system-ui,sans-serif}.sjmob *{box-sizing:border-box}.sjmob a{text-decoration:none}.sjmob [hidden]{display:none!important}
 .sjm{position:fixed;top:0;left:0;right:0;height:54px;z-index:950;background:#14244A;color:#fff;display:flex;align-items:center;gap:10px;padding:0 12px;box-shadow:0 2px 8px rgba(0,0,0,.18)}html.sj-hasupd .sjm{top:46px}
 .sjm-lg i{width:34px;height:34px;border-radius:10px;background:#F2B705;color:#14244A;display:flex;align-items:center;justify-content:center;font:800 17px/1 inherit;font-style:normal}
 .sjm-v{display:flex;align-items:center;gap:8px;background:#22396C;border:1px solid #33508A;color:#fff;border-radius:22px;padding:7px 12px 7px 11px;font:inherit;font-size:15px;min-width:0;max-width:62vw}.sjm-v b{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}button.sjm-v{cursor:pointer}
 .sjm-sp{flex:1}.sjm-up{background:#F2B705;color:#14244A;border-radius:16px;padding:5px 10px;font-size:13px;font-weight:800;white-space:nowrap}
 .sjm-sy{display:flex;align-items:center;justify-content:center;width:34px;height:34px}.sjm .sjm-sy .sj-d{width:11px!important;height:11px!important;min-width:0!important;padding:0!important;border:0!important;border-radius:50%;background:#8F9BB8}.sjm-sy .sj-d.ok{background:#3CCB7F}.sjm-sy .sj-d.warn{background:#F2B705}.sjm-sy .sj-d.err{background:#F04438}
 .sjb{position:fixed;left:0;right:0;bottom:0;z-index:950;background:#fff;border-top:1px solid #DDE2EA;display:grid;grid-auto-flow:column;grid-auto-columns:1fr;padding:4px 0 calc(6px + env(safe-area-inset-bottom));box-shadow:0 -2px 10px rgba(0,0,0,.06)}
 .sjb a{position:relative;display:flex;flex-direction:column;align-items:center;gap:2px;padding:6px 0 2px;color:#5B6474;font-size:12.5px;font-weight:600}.sjb a.on{color:#14244A;font-weight:800}.sjb a.on::before{content:'';position:absolute;top:-5px;left:28%;right:28%;height:3px;border-radius:0 0 3px 3px;background:#F2B705}
 .sjb .sj-bd{position:absolute;top:0;left:calc(50% + 8px);background:#D92D20;color:#fff;border-radius:9px;padding:0 6px;font-size:11px;font-weight:800;line-height:17px}.sjb .sj-bd.y{background:#F2B705;color:#14244A}
 .sjs{position:fixed;inset:0;z-index:960}.sjs-bg{position:absolute;inset:0;background:rgba(15,23,42,.45)}.sjs-p{position:absolute;left:0;right:0;bottom:0;max-height:82vh;overflow:auto;background:#fff;border-radius:18px 18px 0 0;padding:8px 12px calc(16px + env(safe-area-inset-bottom));box-shadow:0 -6px 24px rgba(0,0,0,.2)}
 .sjs-h{display:flex;align-items:center;justify-content:space-between;padding:10px 6px 8px;font-size:17px;color:#0F172A}.sjs-h button{border:0;background:#F1F3F7;border-radius:50%;width:34px;height:34px;font-size:16px;cursor:pointer}
 .sjs-r{display:flex;align-items:center;gap:12px;padding:13px 12px;border-radius:12px;color:#0F172A;font-size:16px;font-weight:700;border-bottom:1px solid #F0F2F5}.sjs-r.on{background:#EEF3FB;box-shadow:inset 4px 0 0 #F2B705}.sjs-r small{font-weight:500;color:#5B6474;font-size:13px}.sjs-r .sj-vn{flex:1;min-width:0}.sjs-r small.od{color:#C62828;font-weight:700}.sjs-r .sj-bd{background:#F2B705;color:#14244A;border-radius:10px;padding:1px 8px;font-size:12px}
 .sjs-r .sj-dt{width:11px;height:11px;border-radius:50%;background:#B8C0CC;flex:none}.sjs-r .sj-dt.r{background:#F04438}.sjs-r .sj-dt.y{background:#F2B705}.sjs-r .sj-dt.g{background:#3CCB7F}.sjs-r .sj-dt.b{width:auto;height:auto;background:none;color:#2F5496;display:flex}
}`;
  /* 왼쪽 메뉴 HTML. act = home|pms|rsk|devices|settings, base = 앱 홈 기준 경로 ('' 또는 '../') */
  U.rail = function (act, base) { base = base || ''; const T = U.T, role = U.role(), off = role === 'office', v = C.get('vessel') || '', pc = C.get('pcname') || '', view = C.get('view') || '';
    const sp = U.sum('pms'), sr = U.sum('rsk');
    let bp = '', br = '';
    if (sp && sp.ships){ if (off){ const n = Object.values(sp.ships).reduce((a, s) => a + (s.O || []).filter(x => x[0] !== 'cls').length, 0); bp = n ? `<span class="sj-bd y">${n}</span>` : ''; } else { const s = sp.ships[v]; bp = s && s.od ? `<span class="sj-bd">${s.od}</span>` : ''; } }
    if (sr && sr.v){ const n = Object.entries(sr.v).filter(([k]) => off || k === v).reduce((a, [, s]) => a + (off ? s.wait : s.draft + s.wait + s.stop), 0); br = n ? `<span class="sj-bd y">${n}</span>` : ''; }
    const it = (k, href, label, icon, extra, sub) => `<a class="sj-it ${act === k ? 'on' : ''}" href="${href}"><span class="sj-ii">${U.ic(icon)}</span><span class="sj-lt">${label}${sub ? `<small>${sub}</small>` : ''}</span>${extra || ''}</a>`;
    const sec = t => `<div class="sj-hd">${t}</div>`;
    /* 사무실: 선대 목록이 곧 선박 선택 (한 번 눌러 바로 그 선박) */
    const fleet = () => { const ps = (sp && sp.ships) || {}, rs = (sr && sr.v) || {};
      const row = n => { const a = ps[n], r = rs[n]; const dc = !a || !a.n ? '' : a.od ? 'r' : a.d7 ? 'y' : 'g'; const k = (a ? (a.O || []).filter(x => x[0] !== 'cls').length : 0) + (r ? r.wait || 0 : 0);
        return `<a class="sj-vs ${view === n ? (act === 'home' ? 'on' : act === 'pms' || act === 'rsk' ? 'cur' : '') : ''}" href="#" data-sjves="${U.esc(n)}" title="${U.esc(n)}"><span class="sj-dt ${dc}"></span><span class="sj-vn">${U.esc(n)}</span>${k ? `<span class="sj-bd y">${k}</span>` : ''}</a>`; };
      return `${sec(T('선대', 'Fleet'))}<a class="sj-it sj-fl ${act === 'home' && !view ? 'on' : ''}" href="${base}index.html" data-sjves=""><span class="sj-ii">${U.ic('bld')}</span><span class="sj-lt">${T('선대 현황', 'Fleet overview')}<small>${T('전체 ' + U.VES.length + '척', 'All ' + U.VES.length + ' vessels')}</small></span></a><div class="sj-vl">${U.VES.map(row).join('')}</div>`; };
    const vbox = off ? fleet()
      : `<div class="sj-vb"><span class="sj-vi s">${U.ic('ship', 17)}</span><span class="sj-vt"><b>${v ? U.esc(v) : T('선박 미설정', 'No vessel')}</b><small>${T('선박 기기', 'Ship device')}${pc ? ' · ' + U.esc(pc) : ''}</small></span></div>`;
    const tsub = off ? (view ? U.esc(view) : T('선박을 고르세요', 'Pick a vessel')) : '';
    return `<nav class="sjr" aria-label="${T('도구 메뉴', 'Tools')}"><a class="sj-lg" href="${base}index.html"><i>S</i><span><b>${T('SEJUL 선박관리', 'SEJUL Fleet')}</b><small>FLEET APPS</small></span></a>${vbox}
      ${off ? '' : it('home', base + 'index.html', T('홈 · 오늘 할 일', 'Home · Today'), 'home')}
      ${sec(T('도구', 'Tools'))}
      ${it('pms', base + 'tools/pms.html', T('계획정비', 'Maintenance'), 'pms', bp, tsub)}
      ${it('rsk', base + 'tools/rsk.html', T('위험성 관리', 'Risk'), 'rsk', br, tsub)}
      ${off ? sec(T('관리', 'Admin')) + it('devices', base + 'index.html#devices', T('기기 승인', 'Devices'), 'dev', '<span class="sj-bd y" data-sjpend hidden></span>') : ''}
      <div class="sj-soon"><span>${T('준비 중', 'Soon')}</span> ${T('화물 호환성 · SMS 서식', 'Cargo compat. · SMS forms')}</div>
      <div class="sj-ft"><a class="sj-it sj-up" href="#" data-sjupd><span class="sj-ii">${U.ic('M21 12a9 9 0 1 1-2.6-6.4L21 8M21 3v5h-5')}</span><span class="sj-ut"><span>${T('앱 버전', 'App version')} v${U.esc(String(C.ver || '').replace(/^(\d{4})\.(\d\d)\.(\d\d)\.(\d\d)(\d\d)$/, '$1.$2.$3 $4:$5'))}</span><small>${T('업데이트 확인', 'Check for updates')}</small></span></a>${it('settings', base + 'index.html#settings', T('설정', 'Settings'), 'set')}<a class="sj-sy" id="sjSync" href="${base}index.html#settings/sync"><span class="sj-d"></span><span class="sj-t">${T('서버 동기화', 'Server sync')}</span></a></div></nav>` + U.mob(act, base, { off, v, view, sp, sr, bp, br }); };
  /* 좁은 화면(태블릿 세로·휴대폰): 위 막대(선박 칩) + 아래 공통 탭 + 선박 고르기 시트 */
  U.fleetRows = function (act, base, view, sp, sr, cls) { const T = U.T, ps = (sp && sp.ships) || {}, rs = (sr && sr.v) || {};
    return `<a class="${cls} fl ${act === 'home' && !view ? 'on' : ''}" href="${base}index.html" data-sjves=""><span class="sj-dt b">${U.ic('bld', 15)}</span><span class="sj-vn">${T('선대 현황', 'Fleet overview')} <small>· ${T('전체 ' + U.VES.length + '척', 'all ' + U.VES.length)}</small></span></a>` + U.VES.map(n => { const a = ps[n], r = rs[n]; const dc = !a || !a.n ? '' : a.od ? 'r' : a.d7 ? 'y' : 'g'; const k = (a ? (a.O || []).filter(x => x[0] !== 'cls').length : 0) + (r ? r.wait || 0 : 0);
      return `<a class="${cls} ${view === n ? 'on' : ''}" href="#" data-sjves="${U.esc(n)}"><span class="sj-dt ${dc}"></span><span class="sj-vn">${U.esc(n)}</span>${a && a.od ? `<small class="od">${T('초과', 'overdue')} ${a.od}</small>` : ''}${k ? `<span class="sj-bd y">${k}</span>` : ''}</a>`; }).join(''); };
  U.mob = function (act, base, o) { const T = U.T, { off, v, view, sp, sr, bp, br } = o;
    const name = off ? (view || T('선대 전체', 'Whole fleet')) : (v || T('선박 미설정', 'No vessel'));
    const tab = (k, href, label, ic, bd) => `<a class="${act === k ? 'on' : ''}" href="${href}">${U.ic(ic, 22)}<span>${label}</span>${bd || ''}</a>`;
    return `<div class="sjmob"><header class="sjm"><a class="sjm-lg" href="${base}index.html" aria-label="${T('앱 홈', 'App home')}"><i>S</i></a>
      ${off ? `<button class="sjm-v" data-sjsheet type="button">${U.ic('bld', 17)}<b>${U.esc(name)}</b>${U.ic('m6 9 6 6 6-6', 16)}</button>` : `<span class="sjm-v">${U.ic('ship', 17)}<b>${U.esc(name)}</b></span>`}
      <span class="sjm-sp"></span><a class="sjm-up" href="#" data-sjupd hidden>⬆ ${T('업데이트', 'Update')}</a><a class="sjm-sy" href="${base}index.html#settings/sync" aria-label="${T('동기화', 'Sync')}"><span class="sj-d"></span></a></header>
      <nav class="sjb">${tab('home', base + 'index.html', off ? T('선대', 'Fleet') : T('홈', 'Home'), off ? 'bld' : 'home')}${tab('pms', base + 'tools/pms.html', T('계획정비', 'PMS'), 'pms', bp)}${tab('rsk', base + 'tools/rsk.html', T('위험성', 'Risk'), 'rsk', br)}${off ? tab('devices', base + 'index.html#devices', T('기기', 'Devices'), 'dev', '<span class="sj-bd y" data-sjpend hidden></span>') : ''}${tab('settings', base + 'index.html#settings', T('설정', 'Settings'), 'set')}</nav>
      ${off ? `<div class="sjs" hidden><div class="sjs-bg" data-sjsheet></div><div class="sjs-p" role="dialog" aria-label="${T('선박 고르기', 'Choose vessel')}"><div class="sjs-h"><b>${T('선박 고르기', 'Choose vessel')}</b><button type="button" data-sjsheet aria-label="${T('닫기', 'Close')}">✕</button></div>${U.fleetRows(act, base, view, sp, sr, 'sjs-r')}</div></div>` : ''}</div>`; };
  /* 동기화 표시 (레일 아래) */
  U.syncPaint = function () { const el = document.getElementById('sjSync'); if (!el) return; const T = U.T, m = U.me(), s = (window.SJCLOUD && SJCLOUD.state) || {};
    let c = '', t;
    if (!navigator.onLine) t = T('오프라인 — 이 기기에 저장', 'Offline — saved here');
    else if (!m || m.status === 'none') { c = 'warn'; t = T('서버 미등록', 'Not registered'); }
    else if (m.status === 'pending') { c = 'warn'; t = T('사무실 승인 대기', 'Waiting for approval'); }
    else if (m.status === 'revoked') { c = 'err'; t = T('동기화 해제됨', 'Revoked'); }
    else if (s.err) { c = 'err'; t = T('동기화 오류', 'Sync error'); }
    else if (s.busy) { c = 'ok'; t = T('동기화 중…', 'Syncing…'); }
    else { c = 'ok'; const at = s.last; t = at ? T('동기화', 'Synced') + ' · ' + U.ago(at) : T('서버 연결됨', 'Connected'); }
    document.querySelectorAll('.sjm-sy .sj-d').forEach(d => { d.className = 'sj-d ' + c; d.parentNode.title = t; });
    el.querySelector('.sj-d').className = 'sj-d ' + c; el.querySelector('.sj-t').textContent = t; el.title = s.err ? s.err : ''; };
  /* 업데이트 표시 (왼쪽 메뉴) */
  U.updPaint = function (msg) { document.querySelectorAll('.sjm-up').forEach(x => x.hidden = !C.updHas); const a = document.querySelector('.sjr [data-sjupd]'); if (!a) return; const has = !!C.updHas; a.classList.toggle('has', has); const sm = a.querySelector('small'); if (sm) sm.textContent = has ? U.T('⬆ 새 버전 — 눌러서 업데이트', '⬆ New version — tap to update') : (msg || U.T('업데이트 확인', 'Check for updates')); };
  document.addEventListener('click', async e => { const a = e.target.closest && e.target.closest('[data-sjupd]'); if (!a) return; e.preventDefault();
    if (C.updHas && C.updNow && await C.updNow()) return; U.updPaint(U.T('확인 중…', 'Checking…')); const r = C.updCheck ? await C.updCheck() : 'none';
    U.updPaint(r === 'latest' ? U.T('최신 버전입니다 ✓', 'Up to date ✓') : r === 'offline' ? U.T('오프라인 — 나중에 다시', 'Offline — try later') : r === 'has' ? '' : U.T('업데이트 확인', 'Check for updates')); });
  /* 선박 고르기 시트 열고 닫기 (좁은 화면) */
  document.addEventListener('click', e => { const a = e.target.closest && e.target.closest('[data-sjsheet]'); if (!a) return; e.preventDefault(); const sh = document.querySelector('.sjs'); if (sh) sh.hidden = !sh.hidden; });
  /* 선대 목록에서 선박 고르기 (사무실) */
  document.addEventListener('click', e => { const a = e.target.closest && e.target.closest('[data-sjves]'); if (!a) return; const n = a.dataset.sjves; C.set('view', n);
    const sh = document.querySelector('.sjs'); if (sh) sh.hidden = true;
    if (!n && a.getAttribute('href') !== 'index.html') return; e.preventDefault(); if (U.onView) U.onView(n); }, true);
  /* 보는 선박 바꾸기 (사무실) */
  document.addEventListener('change', e => { const s = e.target.closest && e.target.closest('[data-sjview]'); if (!s) return; C.set('view', s.value); if (U.onView) U.onView(s.value); });
})();
