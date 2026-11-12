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
.sjr{position:fixed;left:0;top:0;bottom:0;width:var(--sjr-w);transition:width .15s;z-index:900;box-sizing:border-box;background:#14244A;color:#E6EBF5;font-family:'Pretendard','Noto Sans KR','Malgun Gothic','Apple SD Gothic Neo',system-ui,sans-serif;display:flex;flex-direction:column;padding:16px 14px;gap:4px;overflow-y:auto}
:root{--sjr-w:248px}html.sj-railmin{--sjr-w:76px}
.sjr .sj-lgr{display:flex;align-items:center;gap:4px}.sjr .sj-lgr .sj-lg{flex:1;min-width:0}.sjr .sj-srch{position:relative}.sjr .sj-min{flex:none;width:30px;height:30px;border-radius:8px;border:0;background:none;color:#8F9BB8;cursor:pointer;display:flex;align-items:center;justify-content:center;margin-bottom:10px}.sjr .sj-min:hover{background:#22396C;color:#fff}
.sjr .sj-ft .sj-it{min-height:40px}.sjr .sj-ftl{display:flex;align-items:center;gap:6px;background:#0F1D3D;border-radius:12px;padding:4px 6px 4px 4px}.sjr .sj-ftl .sj-sy{flex:1;min-width:0;background:none!important;padding:6px 8px!important}.sjr .sj-ftl .sj-sy .sj-t{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:12.5px}
.sjr .sj-ftl .sj-up{flex:none;padding:4px 8px;border-radius:8px;min-height:0}.sjr .sj-ftl .sj-up .sj-ut span{font-size:11.5px;color:#8F9BB8}.sjr .sj-ftl .sj-up .sj-ut small{display:none}.sjr .sj-ftl .sj-up.has .sj-ut small{display:block;font-size:11px}.sjr .sj-ftl .sj-up:hover{background:#22396C}
html.sj-railmin .sjr{padding:16px 10px}html.sj-railmin .sjr .sj-lg span,html.sj-railmin .sjr .sj-lt,html.sj-railmin .sjr .sj-srch span,html.sj-railmin .sjr .sj-srch kbd,html.sj-railmin .sjr .sj-vt,html.sj-railmin .sjr .sj-vl,html.sj-railmin .sjr .sj-hd span,html.sj-railmin .sjr .sj-ftl .sj-t,html.sj-railmin .sjr .sj-ftl .sj-up{display:none!important}
html.sj-railmin .sjr .sj-lgr{flex-direction:column}html.sj-railmin .sjr .sj-min{transform:rotate(180deg);margin:0 0 8px}html.sj-railmin .sjr .sj-lg{padding:4px 0 6px;justify-content:center}html.sj-railmin .sjr .sj-it,html.sj-railmin .sjr .sj-srch{justify-content:center;padding:9px 0;gap:0}html.sj-railmin .sjr .sj-vb{justify-content:center;padding:8px 0}
html.sj-railmin .sjr .sj-it .sj-bd,html.sj-railmin .sjr .sj-srch .sj-bd{position:absolute;top:3px;right:4px;padding:0 5px!important;font-size:10.5px!important;margin:0}html.sj-railmin .sjr .sj-hd{margin:8px 4px 2px}html.sj-railmin .sjr .sj-it.on::before{left:-10px}html.sj-railmin .sjr .sj-ftl{justify-content:center;padding:6px 0}html.sj-railmin .sjr .sj-ftl .sj-sy{flex:none;padding:6px!important}
.sji-k.inv{background:#F1E9FF;color:#6B3FC7}
.sjr .sj-flr{display:flex;align-items:center;gap:2px;margin-top:6px}.sjr .sj-flr .sj-it{flex:1;min-width:0}.sjr .sj-vtg{flex:none;width:32px;height:32px;border:0;border-radius:8px;background:none;color:#9FB0D6;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .15s}.sjr .sj-vtg:hover{background:#22396C;color:#fff}.sjr .sj-vtg.min{transform:rotate(-90deg)}
html.sj-railmin .sjr .sj-vtg{display:none}html.sj-railmin .sjr .sj-flr{margin-top:4px}
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
@media print{.sjr,.sjmob,.sjq,.sji{display:none!important}}
.sjd{position:fixed;inset:0;z-index:1500;font-family:'Pretendard','Noto Sans KR','Malgun Gothic','Apple SD Gothic Neo',system-ui,sans-serif;display:flex;align-items:center;justify-content:center}.sjd-bg{position:absolute;inset:0;background:rgba(10,20,40,.45)}
@media (min-width:900px){.sjd{left:var(--sjr-w)}}
.sjd-p{position:relative;width:min(760px,96vw);max-height:92vh;background:#fff;border-radius:18px;box-shadow:0 24px 60px rgba(15,23,42,.35);display:flex;flex-direction:column;overflow:hidden}
.sjd-h{padding:16px 22px 12px;border-bottom:1px solid #E3E7EF}.sjd-ct{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.sjd-h h2{margin:8px 0 0;font-size:20px;line-height:1.35;color:#14244A}.sjd-sub{font-size:13.5px;color:#5B6474;margin-top:4px}
.sjd-k{font-size:12px;font-weight:800;border-radius:6px;padding:3px 8px;background:#E8EEF9;color:#2E6BD8}.sjd-k.rsk{background:#FBEFE3;color:#B8661C}.sjd-v{font-weight:800;color:#1B2F5B;font-size:13.5px}.sjd-no{font-size:13px;color:#5B6474;font-weight:600}
.sjd-x{margin-left:auto;border:0;background:none;font-size:20px;color:#5B6474;cursor:pointer;padding:2px 6px}
.sjd-b{overflow:auto;padding:14px 22px 6px}.sjd-kv{display:grid;grid-template-columns:120px 1fr;gap:6px 14px;margin:0 0 6px;font-size:14px}.sjd-kv dt{color:#5B6474}.sjd-kv dd{margin:0;color:#14244A;font-weight:600;white-space:pre-line}
.sjd-s{margin-top:14px}.sjd-s h3{font-size:13px;font-weight:800;color:#5B6474;margin:0 0 6px;letter-spacing:.02em}.sjd-s p{margin:0;font-size:14px;line-height:1.55;white-space:pre-line}
.sjd-tw{overflow:auto;max-height:280px;border:1px solid #E3E7EF;border-radius:10px}.sjd-t{width:100%;border-collapse:collapse;font-size:13px}.sjd-t th{background:#F3F5F9;text-align:left;padding:7px 9px;position:sticky;top:0;font-weight:700;color:#33405C}.sjd-t td{padding:7px 9px;border-top:1px solid #EEF1F6;vertical-align:top}.sjd-t input{width:80px;padding:4px 6px;border:1px solid #CBD2DC;border-radius:6px}
.sjd-tl{list-style:none;margin:0;padding:0 0 0 14px;border-left:2px solid #E3E7EF;font-size:13px}.sjd-tl li{margin:0 0 6px;position:relative}.sjd-tl li:before{content:'';position:absolute;left:-19px;top:6px;width:8px;height:8px;border-radius:50%;background:#B8C0CC}.sjd-tl span{display:block;color:#5B6474}
.sjd-in{background:#F7F8FB;border:1px solid #E3E7EF;border-radius:12px;padding:12px 14px}.sjd-fs{display:flex;flex-wrap:wrap;gap:10px}.sjd-f{display:flex;flex-direction:column;gap:4px;flex:1 1 200px;font-size:13px;font-weight:700;color:#33405C}.sjd-f.w{flex-basis:100%}.sjd-f i{color:#D93025;font-style:normal}
.sjd-f input,.sjd-f textarea{font:inherit;font-weight:400;font-size:15px;padding:9px 11px;border:1.5px solid #CBD2DC;border-radius:10px;background:#fff}.sjd-f textarea{resize:vertical}
.sjd-err{color:#B42318;font-weight:700;font-size:13.5px;min-height:18px;margin:8px 0 4px}
.sjd-ft{display:flex;gap:8px;align-items:center;padding:12px 22px;border-top:1px solid #E3E7EF;background:#F7F8FA;flex-wrap:wrap}.sjd-ft .sp{flex:1}
.sjd-ft button{font:inherit;font-size:15px;font-weight:700;border-radius:10px;padding:10px 16px;cursor:pointer;border:1.5px solid #CBD2DC;background:#fff;color:#1B2F5B}
.sjd-a.ok{background:#1E7F4E;border-color:#1E7F4E;color:#fff}.sjd-a.cond{background:#fff;border-color:#C27C00;color:#8A5A00}.sjd-a.rej{background:#fff;border-color:#D93025;color:#B42318}.sjd-a.neu{background:#fff}.sjd-a[disabled]{opacity:.45;cursor:not-allowed}
@media (max-width:640px){.sjd-p{width:100vw;max-height:100vh;height:100vh;border-radius:0}.sjd-kv{grid-template-columns:96px 1fr}.sjd-ft{position:sticky;bottom:0}.sjd-ft button{flex:1 1 auto}}
.sjst{display:inline-flex;align-items:center;gap:5px;border-radius:999px;padding:2px 10px;font-size:12px;font-weight:800;line-height:1.6;white-space:nowrap}.sjst:before{content:'';width:7px;height:7px;border-radius:50%;background:currentColor;opacity:.85}
.sjst.wait{background:#FFF3D1;color:#8A6200}.sjst.prog{background:#E6F0FF;color:#1D4FA8}.sjst.ok{background:#E3F5EA;color:#1E7F4E}.sjst.rej{background:#FDE7E7;color:#B42318}.sjst.done{background:#EEF1F6;color:#4B5563}.sjst.draft{background:#F1F3F6;color:#5B6474}
@media print{.sjd{display:none!important}}

.sjr .sj-inb{margin-top:6px}.sjr .sj-inb .sj-bd{margin-left:auto;background:#E53935;color:#fff;border-radius:10px;padding:1px 8px;font-size:12px;font-weight:800}.sjr .sj-inb .sj-bd[hidden]{display:none}.sjm-inb{position:relative}.sjm-inb b{position:absolute;top:3px;right:1px;min-width:17px;height:17px;padding:0 4px;border-radius:9px;background:#E53935;color:#fff;font-size:10.5px;line-height:17px;text-align:center}.sjm-inb b[hidden]{display:none}
.sji{position:fixed;inset:0;z-index:2000;font-family:'Pretendard','Noto Sans KR','Malgun Gothic','Apple SD Gothic Neo',system-ui,sans-serif}.sji[hidden]{display:none}.sji-bg{position:absolute;inset:0;background:rgba(10,20,40,.35)}.sji-p{position:absolute;top:0;right:0;bottom:0;width:min(440px,100vw);background:#fff;display:flex;flex-direction:column;box-shadow:-10px 0 40px rgba(0,0,0,.25)}.sji-h{display:flex;align-items:center;gap:8px;padding:14px 16px;border-bottom:1px solid #E3E7EF}.sji-h b{font-size:17px;color:#14244A;flex:1}.sji-h button{border:1px solid #D7DEEA;background:#fff;border-radius:8px;padding:6px 10px;font:inherit;font-size:13px;cursor:pointer;color:#1B2F5B}.sji-h .x{border:0;font-size:18px}.sji-f{display:flex;gap:6px;padding:10px 16px;flex-wrap:wrap;border-bottom:1px solid #EEF1F6}.sji-f button{border:1px solid #D7DEEA;background:#fff;border-radius:16px;padding:4px 11px;font:inherit;font-size:13px;cursor:pointer;color:#33405C}.sji-f button.on{background:#1B2F5B;color:#fff;border-color:#1B2F5B}.sji-l{flex:1;overflow:auto}.sji-tb{display:flex;gap:0;padding:0 16px;border-bottom:1px solid #E3E7EF}.sji-tb button{flex:1;border:0;background:none;padding:12px 8px;font:inherit;font-size:15px;font-weight:600;color:#5B6474;cursor:pointer;border-bottom:3px solid transparent}.sji-tb button.on{color:#14244A;border-bottom-color:#1B2F5B}.sji-tb b{display:inline-block;min-width:20px;padding:0 6px;border-radius:10px;background:#E3E7EF;color:#33405C;font-size:12px;margin-left:4px}.sji-tb b.y{background:#E0A100;color:#fff}.sji-tb b.r{background:#E53935;color:#fff}.sji-f[hidden],[data-sjiall][hidden]{display:none!important}.sji-ah{padding:10px 16px;font-size:12.5px;color:#5B6474;background:#F7F8FB;border-bottom:1px solid #EEF1F6}.sji-c{position:relative;padding:12px 16px 12px;border-bottom:1px solid #EEF1F6;display:flex;flex-direction:column;gap:3px}.sji-c b{font-size:14.5px;color:#14244A}.sji-c small{font-size:13px;color:#5B6474;line-height:1.45}.sji-ct{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-bottom:2px}.sji-k{font-size:11.5px;font-weight:700;border-radius:6px;padding:2px 7px;background:#E8EEF9;color:#2E6BD8}.sji-k.rsk{background:#FBEFE3;color:#B8661C}.sji-k.dev{background:#EEF0F3;color:#4B5563}.sji-v{font-size:12.5px;font-weight:700;color:#1B2F5B}.sji-st{margin-left:auto;font-size:11.5px;font-weight:700;border-radius:10px;padding:2px 8px}.sji-st.y{background:#FFF3D1;color:#8A6200}.sji-st.b{background:#E6F0FF;color:#1D4FA8}.sji-st.g{background:#EEF1F6;color:#5B6474}.sji-st.r{background:#FDE7E7;color:#B42318}.sji-go{align-self:flex-end;margin-top:6px;border:1px solid #D7DEEA;background:#fff;color:#1B2F5B;border-radius:8px;padding:7px 12px;font:inherit;font-size:13.5px;font-weight:700;cursor:pointer}.sji-go.pri{background:#1B2F5B;color:#fff;border-color:#1B2F5B}.sji-r{display:flex;gap:11px;width:100%;text-align:left;padding:12px 16px;border:0;border-bottom:1px solid #EEF1F6;background:#fff;font:inherit;cursor:pointer;align-items:flex-start}.sji-r:hover{background:#F5F7FB}.sji-r.un{background:#F2F6FF}.sji-r .ic{flex:none;width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;color:#fff;background:#5B6474}.sji-r .ic.pms{background:#2E6BD8}.sji-r .ic.rsk{background:#D9822B}.sji-r .ic.apv{background:#1E8E5A}.sji-r .ic.rej{background:#C62828}.sji-r .tx{flex:1;min-width:0}.sji-r .tx b{display:block;font-size:14.5px;color:#14244A;font-weight:600}.sji-r.un .tx b{font-weight:800}.sji-r .tx small{display:block;color:#5B6474;font-size:13px;margin-top:2px;white-space:pre-line;overflow:hidden;text-overflow:ellipsis;max-height:3.2em}.sji-r .tm{flex:none;font-size:12px;color:#8F9BB8;white-space:nowrap}.sji-r .dot{flex:none;width:8px;height:8px;border-radius:50%;background:#2E6BD8;margin-top:6px}.sji-r:not(.un) .dot{visibility:hidden}.sji-e{padding:40px 20px;text-align:center;color:#5B6474;font-size:14px;line-height:1.7}.sji-ft{padding:10px 16px;font-size:12px;color:#8F9BB8;border-top:1px solid #EEF1F6}
.sjr .sj-srch{display:flex;align-items:center;gap:10px;width:100%;margin:10px 0 2px;padding:9px 12px;border-radius:10px;border:1px solid #33508A;background:#1B2F5B;color:#C9D2E6;font:inherit;font-size:14px;cursor:pointer;text-align:left}.sjr .sj-srch:hover{background:#22396C;color:#fff}.sjr .sj-srch span{flex:1}.sjr .sj-srch kbd{font:inherit;font-size:11px;color:#8F9BB8;border:1px solid #3A4E7C;border-radius:5px;padding:0 5px}
.sjm-sr{background:none;border:0;color:#fff;width:38px;height:38px;display:flex;align-items:center;justify-content:center;cursor:pointer}
.sjq{position:fixed;inset:0;z-index:2000;font-family:'Pretendard','Noto Sans KR','Malgun Gothic','Apple SD Gothic Neo',system-ui,sans-serif}.sjq[hidden]{display:none}.sjq-bg{position:absolute;inset:0;background:rgba(15,23,42,.45)}
.sjq-p{position:relative;margin:8vh auto 0;width:min(680px,94vw);max-height:78vh;display:flex;flex-direction:column;background:#fff;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.3);overflow:hidden}
.sjq-i{display:flex;align-items:center;gap:10px;padding:12px 16px;border-bottom:1px solid #E3E6EB;color:#5B6474}.sjq-i input{flex:1;border:0;outline:0;font:inherit;font-size:17px;padding:6px 0;color:#0F172A;background:none}.sjq-x{border:0;background:#F1F3F7;border-radius:50%;width:32px;height:32px;cursor:pointer}
.sjq-l{overflow:auto;padding:6px 0 10px}.sjq-g{font-size:12.5px;font-weight:800;color:#5B6474;padding:10px 18px 4px}.sjq-g span{color:#9AA3B2;font-weight:600}
.sjq-r{display:block;width:100%;text-align:left;border:0;background:none;padding:9px 18px;cursor:pointer;font:inherit;color:#0F172A}.sjq-r:hover,.sjq-r.on{background:#EEF3FB}.sjq-r b{display:block;font-size:14.5px;font-weight:700}.sjq-r small{display:block;font-size:12.5px;color:#5B6474}.sjq-e{padding:24px 18px;color:#5B6474;font-size:14px;line-height:1.7}
@media (max-width:640px){.sjq-p{margin:0;width:100vw;max-height:100vh;height:100vh;border-radius:0}}

.sjh{max-width:1200px;color:#0F172A}.sjh *{box-sizing:border-box}.sjh a{text-decoration:none}.sjh button{font:inherit;color:inherit;text-align:inherit;background:none;border:0;margin:0;cursor:pointer}
.sjh-hd{display:flex;align-items:flex-end;gap:10px;margin:2px 0 16px;flex-wrap:wrap}.sjh-hd small{display:block;color:#5B6474;font-size:13.5px;font-weight:600}.sjh-hd h1{margin:2px 0 0;font-size:26px;font-weight:800;color:#0F172A;letter-spacing:-.01em}.sjh .sp{flex:1}
.sjh .sjh-btn,.sjh-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;border-radius:11px;padding:9px 15px;font-weight:800;font-size:14.5px;border:1.5px solid #CBD2DC;background:#fff;color:#14244A!important;cursor:pointer;white-space:nowrap;font-family:inherit}.sjh-btn:hover{border-color:#2F5496}
.sjh .sjh-btn.pri,.sjh-btn.pri{background:#1B2F5B;border-color:#1B2F5B;color:#fff!important}.sjh-btn.pri:hover{background:#24407A}.sjh-btn.big{font-size:16px;padding:12px 18px;border-radius:12px}.sjh-btn.s{padding:6px 12px;font-size:13.5px;border-radius:9px}
.sjh-band{display:flex;align-items:center;gap:10px;border-radius:12px;padding:10px 14px;background:#FFF7E0;border:1px solid #F2D27A;color:#6B4A00;font-size:14px;margin:0 0 12px}.sjh-band>*{margin:0!important}
.sjh-hero{display:flex;gap:18px;align-items:center;background:#fff;border:1px solid #E3E6EB;border-left:6px solid #C62828;border-radius:16px;padding:18px 22px;margin:0 0 14px}.sjh-hero.y{border-left-color:#E0A400}.sjh-hero.g{border-left-color:#2E7D32}.sjh-hero.n{border-left-color:#B8C0CC}.sjh-hero.b{border-left-color:#2F5496}
.sjh-hero .sjh-tx{flex:1;min-width:0}.sjh-hero small{display:block;color:#5B6474;font-size:13.5px;font-weight:600}.sjh-hero b{display:block;font-size:22px;margin:4px 0;font-weight:800}.sjh-hero em{font-style:normal}.sjh-hero em.r{color:#C62828}.sjh-hero em.y{color:#B26A00}.sjh-hero .sjh-tx>span{color:#5B6474;font-size:14px}
.sjh-k{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin:0 0 16px}.sjh .sjh-k>.kc{display:block;width:100%;text-align:left!important;background:#fff;border:1px solid #E3E6EB;border-radius:14px;padding:14px 16px;color:inherit;cursor:pointer}.sjh .sjh-k>.kc:hover{border-color:#2F5496}
.sjh-k b{display:block;font-size:30px;font-weight:800;line-height:1.1}.sjh-k span{color:#5B6474;font-size:13.5px;font-weight:600}.sjh-k .t-r b{color:#C62828}.sjh-k .t-y b{color:#B26A00}.sjh-k .t-b b{color:#2F5496}.sjh-k .zero b{color:#A3ABB8}
.sjh-c{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(280px,1fr);gap:16px;align-items:start}
.sjh-card{background:#fff;border:1px solid #E3E6EB;border-radius:16px;overflow:hidden;margin:0 0 16px}.sjh-card>h2{display:flex;align-items:center;gap:8px;margin:0;padding:14px 18px;font-size:16.5px;font-weight:800;border-bottom:1px solid #EEF0F3;color:#0F172A}.sjh-card>h2 small{font-size:13px;color:#5B6474;font-weight:600}
.sjh-r{display:flex;align-items:center;gap:12px;padding:12px 18px;border-bottom:1px solid #F0F2F5}.sjh-r:last-child{border-bottom:0}.sjh-r .sjh-bar{width:4px;align-self:stretch;border-radius:3px;flex:none}.sjh-r .sjh-bar.r{background:#E5484D}.sjh-r .sjh-bar.y{background:#F2B705}
.sjh-r .sjh-tx{flex:1;min-width:0}.sjh-r .sjh-tx b{font-size:14.5px;font-weight:700;word-break:keep-all}.sjh-r .sjh-tx small{display:block;color:#5B6474;font-size:13px;margin-top:2px;word-break:keep-all}
.sjh-r .sjh-tag{font-size:11.5px;font-weight:800;border-radius:6px;padding:1px 7px;margin-right:6px;background:#EEF3FB;color:#1B2F5B}.sjh-r .sjh-tag.r{background:#FDF0E7;color:#B4501A}.sjh-r .sjh-tag.c{background:#F1ECFA;color:#5B3FA0}
.sjh-r .sjh-due{font-size:12.5px;font-weight:800;white-space:nowrap}.sjh-r .sjh-due.r{color:#C62828}.sjh-r .sjh-due.y{color:#B26A00}.sjh-r .sjh-due.g{color:#5B6474}
.sjh-empty{padding:26px 18px;text-align:center;color:#5B6474;font-size:14.5px}
.sjh .sjh-q .qi{display:flex;width:100%;text-align:left;background:#fff;gap:12px;align-items:center;padding:12px 18px;border-bottom:1px solid #F0F2F5;color:inherit;cursor:pointer}.sjh-q .qi:last-child{border-bottom:0}.sjh-q .qi:hover{background:#F7F9FC}.sjh-q .sjh-ic{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex:none}.sjh-q b{display:block;font-size:14.5px;font-weight:700}.sjh-q small{display:block;color:#5B6474;font-size:12.5px}
.sjh-x{background:#fff;border:1px solid #E3E6EB;border-radius:16px;margin:0 0 16px}.sjh-x>summary{padding:14px 18px;font-weight:800;font-size:15.5px;cursor:pointer;list-style:none;display:flex;align-items:center;gap:8px}.sjh-x>summary::-webkit-details-marker{display:none}.sjh-x>summary::after{content:'▾';margin-left:auto;color:#5B6474}.sjh-x[open]>summary::after{content:'▴'}.sjh-x>.sjh-in{padding:0 18px 18px}
.sjh-ft{color:#9AA3B2;font-size:12px;text-align:right;margin:4px 0 24px}
@media (max-width:899px){.sjh-hd>.sjh-btn{display:none}.sjh-card>h2{flex-wrap:wrap}.sjh-card>h2 .seg{flex-basis:100%;display:flex}.sjh-card>h2 .seg button{flex:1}.sjh .sjh-k>.kc{padding:10px 14px}.sjh-k b{font-size:24px}.sjh-c{grid-template-columns:1fr}.sjh-k{grid-template-columns:repeat(2,minmax(0,1fr))}.sjh-k>:first-child:nth-last-child(odd){grid-column:1/-1}.sjh-hero{flex-direction:column;align-items:stretch;padding:16px}.sjh-hero b{font-size:19px}.sjh-hd h1{font-size:22px}.sjh-r{padding:12px 14px;flex-wrap:wrap}.sjh-r .sjh-tx{flex-basis:calc(100% - 20px)}.sjh-r .sjh-due{margin-left:16px}.sjh-r .sjh-btn{margin-left:auto}}

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
  /* 도구 목록 (왼쪽 메뉴·휴대폰 탭·검색·알림이 같이 씀) — 재고·구매, 증서·검사는 계획정비와 같은 자료를 씀 */
  U.TOOLS = () => [['pms', U.T('계획정비', 'Maintenance'), 'pms'], ['rsk', U.T('위험성 관리', 'Risk'), 'rsk'], ['inv', U.T('재고·구매', 'Stores & purchasing'), 'M21 8 12 3 3 8v8l9 5 9-5zM3 8l9 5 9-5M12 13v8'], ['cert', U.T('증서·검사', 'Certificates & surveys'), 'M12 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM9 14.5 8 22l4-2 4 2-1-7.5M5 3h14']];
  U.toolOf = k => k === 'req' ? 'inv' : k === 'cls' || k === 'cal' ? 'cert' : 'pms';
  U.toolBadges = function (off, v) { const sp = U.sum('pms'), sr = U.sum('rsk'), B = { pms: '', rsk: '', inv: '', cert: '' }, bd = (n, y) => n ? `<span class="sj-bd ${y ? 'y' : ''}">${n}</span>` : '';
    if (sp && sp.ships) { const S = off ? Object.values(sp.ships) : [sp.ships[v] || {}], cnt = (L, f) => L.reduce((a, s) => a + (s[off ? 'O' : 'S'] || []).filter(f).length, 0);
      B.pms = off ? bd(cnt(S, x => !['cls', 'req'].includes(x[0])), 1) : bd((S[0] || {}).od);
      B.inv = off ? bd(cnt(S, x => x[0] === 'req'), 1) : bd((S[0] || {}).low, 1);
      B.cert = bd(cnt(S, x => x[0] === 'cls'), 1); }
    if (sr && sr.v) { const n = Object.entries(sr.v).filter(([k]) => off || k === v).reduce((a, [, s]) => a + (off ? s.wait : s.draft + s.wait + s.stop), 0); B.rsk = bd(n, 1); }
    return B; };
  /* 왼쪽 메뉴 (A안: 도구 → 선대 → 관리, 아래는 설정·동기화 한 줄 · [≪]로 아이콘만 남기기) */
  U.rail = function (act, base) { base = base || ''; const T = U.T, role = U.role(), off = role === 'office', v = C.get('vessel') || '', pc = C.get('pcname') || '', view = C.get('view') || '';
    const sp = U.sum('pms'), sr = U.sum('rsk'), B = U.toolBadges(off, off ? view : v);
    const it = (k, href, label, icon, extra, sub) => `<a class="sj-it ${act === k ? 'on' : ''}" href="${href}" title="${U.esc(label.replace(/<[^>]+>/g, ''))}"><span class="sj-ii">${U.ic(icon)}</span><span class="sj-lt">${label}${sub ? `<small>${sub}</small>` : ''}</span>${extra || ''}</a>`;
    const sec = t => `<div class="sj-hd"><span>${t}</span></div>`;
    const fleet = () => { const ps = (sp && sp.ships) || {}, rs = (sr && sr.v) || {};
      const row = n => { const a = ps[n], r = rs[n]; const dc = !a || !a.n ? '' : a.od ? 'r' : a.d7 ? 'y' : 'g'; const k = (a ? (a.O || []).filter(x => x[0] !== 'cls').length : 0) + (r ? r.wait || 0 : 0);
        return `<a class="sj-vs ${view === n ? (act === 'home' ? 'on' : act !== 'devices' && act !== 'settings' ? 'cur' : '') : ''}" href="#" data-sjves="${U.esc(n)}" title="${U.esc(n)}"><span class="sj-dt ${dc}"></span><span class="sj-vn">${U.esc(n)}</span>${k ? `<span class="sj-bd y">${k}</span>` : ''}</a>`; };
      let vmin = false; try { vmin = localStorage.getItem('sejul_vl_min') === '1'; } catch (e) { }
      const tot = U.VES.reduce((n, x) => n + ((ps[x] ? (ps[x].O || []).filter(y => y[0] !== 'cls').length : 0) + (rs[x] ? rs[x].wait || 0 : 0)), 0);
      return `<div class="sj-flr"><a class="sj-it sj-fl ${act === 'home' && !view ? 'on' : ''}" href="${base}index.html" data-sjves="" title="${T('선대 현황', 'Fleet overview')}"><span class="sj-ii">${U.ic('bld')}</span><span class="sj-lt">${T('선대 현황', 'Fleet overview')}<small>${view ? T('보는 선박: ', 'Viewing: ') + U.esc(view) : T('전체 ' + U.VES.length + '척', 'All ' + U.VES.length + ' vessels')}</small></span>${vmin && tot ? `<span class="sj-bd y">${tot}</span>` : ''}</a><button type="button" class="sj-vtg ${vmin ? 'min' : ''}" data-sjvl aria-label="${T('선박 목록 접기·펴기', 'Collapse vessel list')}" title="${T('선박 목록 접기·펴기', 'Collapse / expand vessels')}">${U.ic('m6 9 6 6 6-6', 16)}</button></div><div class="sj-vl" ${vmin ? 'hidden' : ''}>${U.VES.map(row).join('')}</div>`; };
    const vbox = off ? '' : `<div class="sj-vb" title="${U.esc(v)}"><span class="sj-vi s">${U.ic('ship', 17)}</span><span class="sj-vt"><b>${v ? U.esc(v) : T('선박 미설정', 'No vessel')}</b><small>${T('선박 기기', 'Ship device')}${pc ? ' · ' + U.esc(pc) : ''}</small></span></div>`;
    const tsub = '';   /* 보는 선박은 위쪽 '선대 현황' 아래에 한 번만 */
    const ver = U.esc(String(C.ver || '').replace(/^(\d{4})\.(\d\d)\.(\d\d)\.(\d\d)(\d\d)$/, '$2.$3 $4:$5'));
    return `<nav class="sjr" aria-label="${T('도구 메뉴', 'Tools')}"><div class="sj-lgr"><a class="sj-lg" href="${base}index.html" title="${T('앱 홈', 'App home')}"><i>S</i><span><b>${T('SEJUL 선박관리', 'SEJUL Fleet')}</b><small>FLEET APPS</small></span></a><button type="button" class="sj-min" data-sjmin aria-label="${T('메뉴 접기·펴기', 'Collapse menu')}" title="${T('메뉴 접기·펴기', 'Collapse / expand')}">${U.ic('M11 17l-5-5 5-5M18 17l-5-5 5-5', 16)}</button></div>
      <button class="sj-srch" data-sjsearch type="button" title="${T('검색', 'Search')} (Ctrl K)">${U.ic('M21 21l-4.3-4.3M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14z', 17)}<span>${T('검색', 'Search')}</span><kbd>Ctrl K</kbd></button><button class="sj-srch sj-inb" data-sjinb type="button" title="${T('알림함', 'Inbox')}">${U.ic('M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0', 17)}<span>${T('알림함', 'Inbox')}</span><b class="sj-bd" data-sjinbn hidden></b></button>${vbox}
      ${off ? fleet() : ''}${sec(T('도구', 'Tools'))}${off ? '' : it('home', base + 'index.html', T('홈 · 오늘 할 일', 'Home · Today'), 'home')}
      ${U.TOOLS().map(([k, label, ic]) => it(k, U.toolUrl(base, k), label, ic, B[k], tsub)).join('')}
      ${off ? sec(T('관리', 'Admin')) + it('devices', base + 'index.html#devices', T('기기 승인', 'Devices'), 'dev', '<span class="sj-bd y" data-sjpend hidden></span>') : ''}
      <div class="sj-ft">${it('settings', base + 'index.html#settings', T('설정', 'Settings'), 'set')}<div class="sj-ftl"><a class="sj-sy" id="sjSync" href="${base}index.html#settings/sync"><span class="sj-d"></span><span class="sj-t">${T('서버 동기화', 'Server sync')}</span></a><a class="sj-up" href="#" data-sjupd title="${T('업데이트 확인', 'Check for updates')}"><span class="sj-ut"><span>v${ver}</span><small>${T('업데이트 확인', 'Check for updates')}</small></span></a></div></div></nav>` + U.mob(act, base, { off, v, view, sp, sr, B }) + (setTimeout(() => U.inb && U.inb.paint(), 0), ''); };
  /* 메뉴 접기: 기기마다 기억 */
  U.railMin = on => { try { if (on == null) on = localStorage.getItem('sejul_rail_min') === '1'; else localStorage.setItem('sejul_rail_min', on ? '1' : '0'); } catch (e) { } document.documentElement.classList.toggle('sj-railmin', !!on); };
  /* 사무실 선박 목록 접기 (선대 현황 옆 ⌄) */
  document.addEventListener('click', e => { const b = e.target.closest && e.target.closest('[data-sjvl]'); if (!b) return; e.preventDefault(); const vl = document.querySelector('.sjr .sj-vl'); if (!vl) return; vl.hidden = !vl.hidden; b.classList.toggle('min', vl.hidden); try { localStorage.setItem('sejul_vl_min', vl.hidden ? '1' : '0'); } catch (x) { } });
  U.railMin(); document.addEventListener('click', e => { if (e.target.closest && e.target.closest('[data-sjmin]')) { e.preventDefault(); U.railMin(!document.documentElement.classList.contains('sj-railmin')); } });
  /* ================= 공통 홈 틀 (앱 홈 · 계획정비 홈 · 위험성 관리 홈이 같이 씀) ================= */
  /* 도구 주소: 재고·구매·증서·검사는 계획정비와 같은 파일 (tools/pms.html?sub=inv) — 앱 크기 절약 */
  U.toolUrl = (base, tool, q) => (base || '') + 'tools/' + (tool === 'inv' || tool === 'cert' ? 'pms.html?sub=' + tool + (q ? '&' + q : '') : tool + '.html' + (q ? '?' + q : ''));
  U.curTool = () => { const m = /\/tools\/(\w+)\.html/.exec(location.pathname); if (!m) return ''; return m[1] === 'pms' ? (new URLSearchParams(location.search).get('sub') || 'pms') : m[1]; };
  U.goHref = (base, tool, o) => U.toolUrl(base, tool, o ? 'go=' + encodeURIComponent(JSON.stringify(o)) : '');
  /* 링크(href) 또는 도구 안 동작(data-*) — 도구 안 동작은 button으로 (주소가 #으로 바뀌지 않게) */
  const el = (o, cls, inner) => o.href ? `<a class="${cls}" href="${o.href}">${inner}</a>` : `<button type="button" class="${cls}" ${Object.entries(o.d || {}).map(([k, v]) => `data-${k}="${U.esc(v)}"`).join(' ')}>${inner}</button>`;
  const tagL = () => ({ p: U.T('계획정비', 'PMS'), r: U.T('위험성', 'Risk'), c: U.T('증서·검사', 'Surveys'), i: U.T('재고·구매', 'Stores') });
  U.H = {
    page: o => `<div class="sjh-hd"><div><small>${o.kicker || ''}</small><h1>${o.title}</h1></div><span class="sp"></span>${o.actions || ''}</div>`,
    btn: (label, o, pri) => el(o, 'sjh-btn ' + (pri ? 'pri' : ''), label),
    band: html => html ? `<div class="sjh-band">${html}</div>` : '',
    hero: o => `<div class="sjh-hero ${o.tone || 'n'}"><div class="sjh-tx"><small>${o.kicker || ''}</small><b>${o.title}</b><span>${o.sub || ''}</span></div>${o.btn ? el(o.btn, 'sjh-btn pri big', o.btn.label) : ''}</div>`,
    kpis: arr => `<div class="sjh-k">${arr.map(k => el(k, 'kc ' + (k.tone ? 't-' + k.tone : '') + ' ' + (k.n ? '' : 'zero'), `<b>${k.n == null ? '—' : k.n}</b><span>${k.label}</span>`)).join('')}</div>`,
    rows: (list, o) => { o = o || {}; const TL = tagL(); return list.length ? list.map(x => `<div class="sjh-r"><span class="sjh-bar ${x.bar || ''}"></span><span class="sjh-tx"><span>${o.tags && x.k ? `<span class="sjh-tag ${x.k}">${TL[x.k] || ''}</span>` : ''}<b>${U.esc(x.t)}</b></span>${x.sub ? `<small>${U.esc(x.sub)}</small>` : ''}</span>${x.due && x.due[1] ? `<span class="sjh-due ${x.due[0]}">${U.esc(x.due[1])}</span>` : ''}${x.act ? el(x, 'sjh-btn s', U.esc(x.act)) : ''}</div>`).join('') : `<div class="sjh-empty">${o.empty || '✅ ' + U.T('지금 처리할 일이 없습니다.', 'Nothing to do right now.')}</div>`; },
    card: (title, inner, right) => `<section class="sjh-card"><h2>${title}<span class="sp"></span>${right || ''}</h2>${inner}</section>`,
    quick: arr => `<div class="sjh-q">${arr.map(q => el(q, 'qi', `<span class="sjh-ic" style="background:${q.bg};color:${q.fg}">${U.ic(q.ic, 20)}</span><span><b>${q.t}</b><small>${q.sub || ''}</small></span>`)).join('')}</div>`,
    extra: (title, inner, id) => `<details class="sjh-x" ${id ? `id="${id}"` : ''}><summary>${title}</summary><div class="sjh-in">${inner}</div></details>`,
    cols: (main, side) => `<div class="sjh-c"><div>${main}</div><div>${side}</div></div>`,
    foot: t => t ? `<div class="sjh-ft">${t}</div>` : ''
  };
  /* 선박 한 척의 '처리할 일' (요약에서) — base: 앱 홈 '' · 도구 '../' */
  U.items = function (v, base) { const T = U.T, sp = U.sum('pms'), sr = U.sum('rsk'), out = [], g = (t, o) => U.goHref(base, t, o);
    const s = sp && sp.ships && sp.ships[v];
    if (s) { if (s.od) out.push({ k: 'p', bar: 'r', due: ['r', T('초과', 'Overdue')], t: T(`기한 초과 작업 ${s.od}건`, `${s.od} overdue jobs`), sub: (s.cri ? T(`중요장비 ${s.cri}건 포함 · `, `${s.cri} critical · `) : '') + T(`장비 ${(s.E || {}).od || 0}대`, `${(s.E || {}).od || 0} equipment`), act: T('목록 보기', 'View'), href: g('pms', { attrs: { v9due: 'od' } }) });
      if (s.d7) out.push({ k: 'p', bar: 'y', due: ['y', T('7일 이내', '≤ 7 days')], t: T(`7일 안에 할 작업 ${s.d7}건`, `${s.d7} jobs due in 7 days`), sub: T(`장비 ${(s.E || {}).d7 || 0}대`, `${(s.E || {}).d7 || 0} equipment`), act: T('목록 보기', 'View'), href: g('pms', { attrs: { v9due: 'd7' } }) });
      (s.S || []).forEach(([k, id, what, tx]) => out.push({ k: k === 'cls' ? 'c' : k === 'req' ? 'i' : 'p', bar: k === 'cls' ? 'y' : '', due: ['g', ''], t: what, sub: tx, act: T('열기', 'Open'), href: g(U.toolOf(k), { attrs: { opsk: k, opsid: id } }) }));
      if (s.def) out.push({ k: 'p', bar: s.defA ? 'r' : '', due: ['g', ''], t: T(`미결 결함 ${s.def}건`, `${s.def} open defects`), sub: s.defA ? T(`A등급 ${s.defA}건`, `${s.defA} grade A`) : T('결함 보고 진행 중', 'In progress'), act: T('결함', 'Defects'), href: g('pms', { hash: '#/defects' }) });
      if (s.low) out.push({ k: 'p', bar: '', due: ['g', '—'], t: T(`재고 부족 ${s.low}품목`, `${s.low} items below minimum`), sub: T('최소 재고 아래 — 청구서에 담기', 'Below minimum stock — add to a requisition'), act: T('청구서', 'Requisition'), href: g('inv', { hash: '#/spares' }) }); }
    const r = sr && sr.v && sr.v[v];
    if (r) { const lab = { draft: T('작성 중 위험성 평가', 'Draft RA'), wait: T('DPA 승인 대기', 'Awaiting DPA'), stop: T('작업 중지 — 보완 필요', 'Stopped — revise'), mocw: T('MoC 회사 승인 대기', 'MoC awaiting approval') };
      (r.items || []).forEach(([k, id, tx]) => out.push({ k: 'r', bar: k === 'stop' ? 'r' : k === 'wait' || k === 'mocw' ? 'y' : '', due: ['g', ''], t: lab[k] || k, sub: tx, act: T('열기', 'Open'), href: g('rsk', { attrs: k === 'mocw' ? { a: 'open', k: 'moc', id } : { a: 'open', k: 'ra', id } }) }));
      if (r.act) out.push({ k: 'r', bar: 'y', due: ['y', T('작업 중', 'Active')], t: T(`작업 중 PTW ${r.act}건`, `${r.act} active permits`), sub: T('작업 종료 후 허가서 마감', 'Close permits after work'), act: T('보기', 'View'), href: g('rsk', { attrs: { a: 'kpiGo', v: 'ptwList:act' } }) }); }
    return out; };
  /* 계획정비 공통: 오늘 할 일 카드·숫자 카드 */
  U.pmsHero = (s, v, d, off) => { const T = U.T, n = s ? (s.od || 0) + (s.d7 || 0) : 0;
    return U.H.hero(!s || !s.n ? { tone: 'n', kicker: T('오늘 할 일', 'Today') + ' · ' + U.esc(v), title: s ? T('아직 등록된 작업이 없습니다', 'No jobs registered yet') : T('⏳ 자료를 모으는 중입니다', '⏳ Gathering data'), sub: s ? T('선박 기기가 승인되면 계획정비 자료가 자동으로 들어옵니다.', 'Vessel data arrives once a ship device is approved.') : T('잠시 후 자동으로 표시됩니다.', 'Shown automatically in a moment.') }
      : { tone: n ? (s.od ? 'r' : 'y') : 'g', kicker: T('오늘 할 일', 'Today') + ' · ' + U.esc(v), title: n ? `${T('기한 초과', 'Overdue')} <em class="r">${s.od}</em> · ${T('7일 이내', '≤ 7 days')} <em class="y">${s.d7}</em>` : '✅ ' + T('급한 작업이 없습니다', 'Nothing urgent'), sub: n ? T('작업을 누르고 실시 기록을 입력하면 목록에서 빠집니다.', 'Open a job and record it to clear it.') : T('30일 이내 작업은 작업 목록에서 미리 볼 수 있습니다.', 'See upcoming jobs in the job list.'), btn: Object.assign({ label: n && !off ? T('바로 실시 입력 →', 'Record now →') : n ? T('기한 초과 작업 보기 →', 'View overdue →') : T('작업 목록 →', 'Job list →') }, d(n ? 'od' : 'd30')), ...(off && n ? { sub: T('실시 기록은 선박에서 입력합니다. 사무실은 진행 상황을 확인합니다.', 'Records are entered on board; the office monitors progress.') } : {}) }); };
  U.pmsKpis = (s, d, h) => { const T = U.T; return U.H.kpis([{ n: s && s.od, label: T('기한 초과', 'Overdue'), tone: 'r', ...d('od') }, { n: s && s.d7, label: T('7일 이내', '≤ 7 days'), tone: 'y', ...d('d7') }, { n: s && s.d30, label: T('30일 이내', '≤ 30 days'), ...d('d30') }, { n: s && s.def, label: T('미결 결함', 'Open defects'), tone: s && s.defA ? 'r' : '', ...h('defects') }, { n: s && s.low, label: T('재고 부족', 'Low stock'), ...h('spares') }]); };
  U.rskKpis = (r, d) => { const T = U.T; r = r || {}; return U.H.kpis([{ n: r.draft, label: T('작성 중 위험성 평가', 'Draft RA'), ...d('raList:draft') }, { n: r.wait, label: T('DPA·회사 승인 대기', 'Awaiting approval'), tone: 'y', ...d('raList:wait') }, { n: r.stop, label: T('작업 중지(불가)', 'Stopped'), tone: 'r', ...d('raList:stop') }, { n: r.act, label: T('작업 중 PTW', 'Active PTW'), tone: 'b', ...d('ptwList:act') }, { n: r.moc, label: T('진행 중 MoC', 'Open MoC'), ...d('mocList:open') }]); };

  /* ================= 앱 전체 검색 (Ctrl+K · /) ================= */
  U.search = (function () { let box, res = [], sel = 0;
    const base = () => /\/tools\//.test(location.pathname) ? '../' : '';
    const idx = k => { try { return JSON.parse(localStorage.getItem('sejul_idx_' + k) || 'null'); } catch (e) { return null; } };
    const vessels = () => { const off = U.role() === 'office', v = off ? (C.get('view') || '') : (C.get('vessel') || ''); const all = new Set([...Object.keys((idx('pms') || {}).v || {}), ...Object.keys((idx('rsk') || {}).v || {})]); return off ? [...(v ? [v] : []), ...[...all].filter(x => x !== v && x !== '—').sort()] : [v]; };
    function find(q) { const T = U.T, Q = q.trim().toLowerCase(); if (Q.length < 2) return []; const P = (idx('pms') || {}).v || {}, R = (idx('rsk') || {}).v || {}, out = [], hit = (...a) => a.join(' ').toLowerCase().includes(Q);
      const rskK = { ra: T('위험성 평가', 'RA'), ptw: 'PTW', moc: 'MoC', rir: T('식별 보고', 'Risk ID') };
      vessels().forEach(v => { const p = P[v] || {}, r = R[v] || [];
        (p.e || []).forEach(([id, n, sfi, mk]) => { if (hit(id, n, sfi, mk)) out.push({ g: 'e', v, t: n, s: `${sfi} · ${id}${mk ? ' · ' + mk : ''}`, tool: 'pms', o: { hash: '#/jobs', attrs: { sjfn: 'openEquip', arg: id } } }); });
        (p.j || []).forEach(([c, d, eq, pid]) => { if (hit(c, d, pid)) out.push({ g: 'j', v, t: d, s: `${pid || c} · ${eq || ''}`, tool: 'pms', o: { attrs: { sjfn: 'openJob', arg: c } } }); });
        (p.d || []).forEach(([id, no, t, cl]) => { if (hit(no, t)) out.push({ g: 'd', v, t: (no ? no + ' ' : '') + t, s: cl ? T('종결', 'Closed') : T('진행 중', 'Open'), tool: 'pms', o: { hash: '#/defects', attrs: { sjfn: 'openDefect', arg: id } } }); });
        (p.s || []).forEach(([id, n, pno, im]) => { if (hit(n, pno, im)) out.push({ g: 's', v, t: n, s: [pno, im ? 'IMPA ' + im : ''].filter(Boolean).join(' · '), tool: 'inv', o: { hash: '#/spares', attrs: { act: 'spEdit', id } } }); });
        (p.r || []).forEach(([id, no, it, st]) => { if (hit(no, it)) out.push({ g: 'q', v, t: no, s: it, tool: 'inv', o: { hash: '#/spares' } }); });
        r.forEach(([k, id, no, t]) => { if (hit(no, t, rskK[k])) out.push({ g: 'r', v, t: `${rskK[k]} ${no} ${t}`, s: '', tool: 'rsk', o: { attrs: { a: 'open', k, id } } }); }); });
      return out; }
    const GL = () => ({ e: U.T('장비', 'Equipment'), j: U.T('작업', 'Jobs'), d: U.T('결함', 'Defects'), s: U.T('인벤토리 품목', 'Inventory'), q: U.T('청구서', 'Requisitions'), r: U.T('위험성 관리', 'Risk') });
    function paint() { const T = U.T, q = box.querySelector('input').value, L = find(q), G = GL(), off = U.role() === 'office', cur = off ? C.get('view') : C.get('vessel'); res = [];
      const by = {}; L.forEach(x => (by[x.g] = by[x.g] || []).push(x));
      const html = Object.keys(G).filter(g => by[g]).map(g => { const a = by[g], shown = a.slice(0, 6); return `<div class="sjq-g">${G[g]} <span>${a.length}</span></div>` + shown.map(x => { res.push(x); return `<button class="sjq-r ${res.length - 1 === sel ? 'on' : ''}" data-sjqi="${res.length - 1}"><b>${U.esc(x.t)}</b><small>${U.esc(x.s)}${off && x.v !== cur ? ` · 🚢 ${U.esc(x.v)}` : ''}</small></button>`; }).join(''); }).join('');
      box.querySelector('.sjq-l').innerHTML = q.trim().length < 2 ? `<div class="sjq-e">${T('두 글자 이상 입력하세요 — 장비·작업·결함·품목·청구서·위험성 평가·PTW를 한 번에 찾습니다.', 'Type 2+ characters — searches equipment, jobs, defects, items, requisitions, RA and PTW.')}${(idx('pms') || idx('rsk')) ? '' : '<br>' + T('⏳ 검색 목록을 만드는 중입니다 — 잠시 후 다시 시도하세요.', '⏳ Building the search list — try again shortly.')}</div>` : html || `<div class="sjq-e">${T('찾는 항목이 없습니다.', 'No results.')}</div>`; }
    function goRes(x) { if (!x) return; const off = U.role() === 'office'; if (off && x.v && C.get('view') !== x.v) C.set('view', x.v); close();
      const here = U.curTool() === x.tool;
      if (here && !(off && x.v)) { if (x.o.hash) location.hash = x.o.hash; if (x.o.attrs) setTimeout(() => { const b = document.createElement('button'); b.hidden = true; Object.entries(x.o.attrs).forEach(([k, v]) => b.setAttribute('data-' + k, v)); document.body.appendChild(b); b.click(); b.remove(); }, x.o.hash ? 300 : 0); return; }
      location.href = U.goHref(base(), x.tool, Object.assign({}, x.o, off ? { view: x.v } : {})); }
    function open() { if (!box) { box = document.createElement('div'); box.className = 'sjq'; box.innerHTML = `<div class="sjq-bg"></div><div class="sjq-p" role="dialog" aria-label="${U.T('앱 전체 검색', 'Search')}"><div class="sjq-i">${U.ic('M21 21l-4.3-4.3M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14z', 20)}<input type="search" placeholder="${U.T('장비 · 작업 · 결함 · 품목 · 청구서 · 위험성 평가 찾기', 'Search equipment, jobs, defects, items, RA…')}" autocomplete="off"><button class="sjq-x" aria-label="${U.T('닫기', 'Close')}">✕</button></div><div class="sjq-l"></div></div>`;
        document.body.appendChild(box); const inp = box.querySelector('input');
        inp.addEventListener('input', () => { sel = 0; paint(); });
        inp.addEventListener('keydown', e => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(0, Math.min(res.length - 1, sel + (e.key === 'ArrowDown' ? 1 : -1))); box.querySelectorAll('.sjq-r').forEach((b, i) => b.classList.toggle('on', i === sel)); const on = box.querySelector('.sjq-r.on'); if (on) on.scrollIntoView({ block: 'nearest' }); } else if (e.key === 'Enter') goRes(res[sel]); else if (e.key === 'Escape') close(); });
        box.addEventListener('click', e => { const r = e.target.closest('[data-sjqi]'); if (r) return goRes(res[+r.dataset.sjqi]); if (e.target.closest('.sjq-bg,.sjq-x')) close(); }); }
      box.hidden = false; sel = 0; paint(); setTimeout(() => box.querySelector('input').focus(), 30); }
    function close() { if (box) box.hidden = true; }
    document.addEventListener('click', e => { if (e.target.closest && e.target.closest('[data-sjsearch]')) { e.preventDefault(); open(); } });
    document.addEventListener('keydown', e => { const k = (e.key || '').toLowerCase(); if ((e.ctrlKey || e.metaKey) && k === 'k') { e.preventDefault(); open(); } else if (k === '/' && !(e.target.closest && e.target.closest('input,textarea,select,[contenteditable]'))) { e.preventDefault(); open(); } });
    return { open, close }; })();

  /* 좁은 화면(태블릿 세로·휴대폰): 위 막대(선박 칩) + 아래 공통 탭 + 선박 고르기 시트 */
  U.fleetRows = function (act, base, view, sp, sr, cls) { const T = U.T, ps = (sp && sp.ships) || {}, rs = (sr && sr.v) || {};
    return `<a class="${cls} fl ${act === 'home' && !view ? 'on' : ''}" href="${base}index.html" data-sjves=""><span class="sj-dt b">${U.ic('bld', 15)}</span><span class="sj-vn">${T('선대 현황', 'Fleet overview')} <small>· ${T('전체 ' + U.VES.length + '척', 'all ' + U.VES.length)}</small></span></a>` + U.VES.map(n => { const a = ps[n], r = rs[n]; const dc = !a || !a.n ? '' : a.od ? 'r' : a.d7 ? 'y' : 'g'; const k = (a ? (a.O || []).filter(x => x[0] !== 'cls').length : 0) + (r ? r.wait || 0 : 0);
      return `<a class="${cls} ${view === n ? 'on' : ''}" href="#" data-sjves="${U.esc(n)}"><span class="sj-dt ${dc}"></span><span class="sj-vn">${U.esc(n)}</span>${a && a.od ? `<small class="od">${T('초과', 'overdue')} ${a.od}</small>` : ''}${k ? `<span class="sj-bd y">${k}</span>` : ''}</a>`; }).join(''); };
  U.mob = function (act, base, o) { const T = U.T, { off, v, view, sp, sr, B } = o;
    const name = off ? (view || T('선대 전체', 'Whole fleet')) : (v || T('선박 미설정', 'No vessel'));
    const tab = (k, href, label, ic, bd) => `<a class="${act === k ? 'on' : ''}" href="${href}">${U.ic(ic, 22)}<span>${label}</span>${bd || ''}</a>`;
    const more = ['cert', 'devices', 'settings'].includes(act);
    return `<div class="sjmob"><header class="sjm"><a class="sjm-lg" href="${base}index.html" aria-label="${T('앱 홈', 'App home')}"><i>S</i></a>
      ${off ? `<button class="sjm-v" data-sjsheet type="button">${U.ic('bld', 17)}<b>${U.esc(name)}</b>${U.ic('m6 9 6 6 6-6', 16)}</button>` : `<span class="sjm-v">${U.ic('ship', 17)}<b>${U.esc(name)}</b></span>`}
      <span class="sjm-sp"></span><button class="sjm-sr sjm-inb" data-sjinb type="button" aria-label="${T('알림함', 'Inbox')}">${U.ic('M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0', 21)}<b data-sjinbn hidden></b></button><button class="sjm-sr" data-sjsearch type="button" aria-label="${T('검색', 'Search')}">${U.ic('M21 21l-4.3-4.3M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14z', 21)}</button><a class="sjm-up" href="#" data-sjupd hidden>⬆ ${T('업데이트', 'Update')}</a><a class="sjm-sy" href="${base}index.html#settings/sync" aria-label="${T('동기화', 'Sync')}"><span class="sj-d"></span></a></header>
      <nav class="sjb">${tab('home', base + 'index.html', off ? T('선대', 'Fleet') : T('홈', 'Home'), off ? 'bld' : 'home')}${tab('pms', base + 'tools/pms.html', T('정비', 'PMS'), 'pms', B.pms)}${tab('rsk', base + 'tools/rsk.html', T('위험성', 'Risk'), 'rsk', B.rsk)}${tab('inv', U.toolUrl(base, 'inv'), T('재고', 'Stores'), U.TOOLS()[2][2], B.inv)}<a href="#" class="${more ? 'on' : ''}" data-sjmore>${U.ic('M4 6h16M4 12h16M4 18h16', 22)}<span>${T('더보기', 'More')}</span>${B.cert || ''}</a></nav>
      <div class="sjs sjmore" hidden><div class="sjs-bg" data-sjmore></div><div class="sjs-p" role="dialog" aria-label="${T('더보기', 'More')}"><div class="sjs-h"><b>${T('더보기', 'More')}</b><button type="button" data-sjmore aria-label="${T('닫기', 'Close')}">✕</button></div>
        <a class="sjs-r" href="${U.toolUrl(base, 'cert')}"><span class="sj-dt b">${U.ic(U.TOOLS()[3][2], 15)}</span><span class="sj-vn">${T('증서·검사', 'Certificates & surveys')}</span>${B.cert || ''}</a>${off ? `<a class="sjs-r" href="${base}index.html#devices"><span class="sj-dt b">${U.ic('dev', 15)}</span><span class="sj-vn">${T('기기 승인', 'Devices')}</span><span class="sj-bd y" data-sjpend hidden></span></a>` : ''}<a class="sjs-r" href="${base}index.html#settings"><span class="sj-dt b">${U.ic('set', 15)}</span><span class="sj-vn">${T('설정', 'Settings')}</span></a></div></div>
      ${off ? `<div class="sjs sjves" hidden><div class="sjs-bg" data-sjsheet></div><div class="sjs-p" role="dialog" aria-label="${T('선박 고르기', 'Choose vessel')}"><div class="sjs-h"><b>${T('선박 고르기', 'Choose vessel')}</b><button type="button" data-sjsheet aria-label="${T('닫기', 'Close')}">✕</button></div>${U.fleetRows(act, base, view, sp, sr, 'sjs-r')}</div></div>` : ''}</div>`; };
  document.addEventListener('click', e => { const a = e.target.closest && e.target.closest('[data-sjmore]'); if (!a) return; e.preventDefault(); const sh = document.querySelector('.sjmore'); if (sh) sh.hidden = !sh.hidden; });
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
  document.addEventListener('click', e => { const a = e.target.closest && e.target.closest('[data-sjsheet]'); if (!a) return; e.preventDefault(); const sh = document.querySelector('.sjs.sjves'); if (sh) sh.hidden = !sh.hidden; });
  /* 선대 목록에서 선박 고르기 (사무실) */
  document.addEventListener('click', e => { const a = e.target.closest && e.target.closest('[data-sjves]'); if (!a) return; const n = a.dataset.sjves; C.set('view', n);
    document.querySelectorAll('.sjs').forEach(sh => sh.hidden = true);
    if (!n && a.getAttribute('href') !== 'index.html') return; e.preventDefault(); if (U.onView) U.onView(n); }, true);
  /* 보는 선박 바꾸기 (사무실) */
  document.addEventListener('change', e => { const s = e.target.closest && e.target.closest('[data-sjview]'); if (!s) return; C.set('view', s.value); if (U.onView) U.onView(s.value); });

  /* ================= 알림함 (Notifications inbox) =================
     서버 요약(계획정비·위험성)과 이 기기에서 바뀐 것을 비교해 새 일을 알림으로 쌓음 — 푸시를 꺼 둔 기기에서도 앱을 열면 보임
     사무실: 결함·청구·작업 연기 승인 요청·DPA 승인 요청·기기 승인 / 선박: 연기 승인·반려, DPA 결과, 오늘 정비, PTW 만료 임박
     보관 30일 · 최대 200건 · 처음 켤 때 이미 있던 일은 '읽음'으로 넣음 (알림 폭탄 방지) */
  U.inb = (function () { const KEY = 'sejul_inbox', DAY = 864e5; let box = null, flt = 'all';
    const load = () => { let o; try { o = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { } o = o && o.it ? o : { it: [], sc: {} }; o.sc = o.sc || {}; return o; };
    const save = o => { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) { } };
    const h = t => { let x = 0; for (const c of String(t || '')) x = (x * 31 + c.charCodeAt(0)) | 0; return (x >>> 0).toString(36); };
    const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
    function events() { const T = U.T, role = U.role(), off = role === 'office', sp = U.sum('pms'), sr = U.sum('rsk'), E = [];
      if (!role) return { scope: '', E };
      if (off) { Object.entries((sp && sp.ships) || {}).forEach(([n, s]) => (s.O || []).forEach(([k, id, what, tx]) => { if (k === 'cls') return;
          E.push({ k: `o:${n}:${k}:${id}:${h(what)}`, g: k === 'pp' ? 'apv' : 'pms', t: `${n} · ${what}`, b: tx || '', tool: U.toolOf(k), o: { view: n, attrs: { opsk: k, opsid: id, opsship: n } } }); }));
        Object.entries((sr && sr.v) || {}).forEach(([n, r]) => (r.items || []).filter(x => x[0] === 'wait' || x[0] === 'mocw').forEach(([k, id, tx]) =>
          E.push({ k: `r:${n}:${k}:${id}`, g: 'apv', t: `${n} · ${k === 'mocw' ? T('MoC 회사 승인 요청', 'MoC approval request') : T('위험성 평가 DPA 승인 요청', 'RA approval request (DPA)')}`, b: tx || '', tool: 'rsk', o: { view: n, attrs: { a: 'sjApprove', id } } })));
        return { scope: 'office', E }; }
      const v = C.get('vessel') || ''; if (!v) return { scope: '', E }; const s = ((sp && sp.ships) || {})[v], r = ((sr && sr.v) || {})[v];
      if (s && sp.mode !== 'admin') { (s.Q || []).forEach(([id, tx, dec]) => E.push({ k: `q:${id}:${dec}`, g: dec === 'ok' ? 'apv' : 'rej', t: dec === 'ok' ? T('✅ 작업 연기 승인 (DPA)', '✅ Postponement approved') : T('↩ 작업 연기 반려 (DPA)', '↩ Postponement returned'), b: tx || '', tool: 'pms', o: { attrs: { opsk: 'pp', opsid: id } } }));
        if ((s.od || 0) + (s.d7 || 0) > 0) E.push({ k: 'day:' + today(), g: 'pms', t: T('오늘 정비', "Today's maintenance"), b: T(`기한 초과 ${s.od || 0}건 · 7일 이내 ${s.d7 || 0}건`, `Overdue ${s.od || 0} · due in 7 days ${s.d7 || 0}`), tool: 'pms', o: { attrs: { v9due: 'od' } } }); }
      if (r) { (r.dpa || []).forEach(x => { if (!['ok', 'cond', 'reject'].includes(x.dec)) return; E.push({ k: `dpa:${x.id}:${x.dec}`, g: x.dec === 'reject' ? 'rej' : 'apv', t: 'DPA ' + (x.dec === 'ok' ? T('승인', 'approved') : x.dec === 'cond' ? T('조건부 승인', 'approved with conditions') : T('반려 — 보완 후 다시 요청', 'returned')), b: ((x.no || '') + ' ' + (x.t || '')).trim(), tool: 'rsk', o: { attrs: { a: 'open', k: 'ra', id: x.id } } }); });
        (r.ptw || []).forEach(p => { const e = new Date(p.end).getTime(), now = Date.now(); if (!(e - now < 30 * 60e3 && now - e < 10 * 60e3)) return; E.push({ k: `ptw:${p.id}:${p.end}`, g: 'rsk', t: T('PTW 곧 만료', 'Permit expiring'), b: `${p.no || 'PTW'} ${p.t || ''} — ${new Date(e).toTimeString().slice(0, 5)}`, tool: 'rsk', o: { attrs: { a: 'kpiGo', v: 'ptwList:act' } } }); }); }
      return { scope: 'ship:' + v, E }; }
    /* 승인함: 지금 결정·서명이 필요한 일 (실시간 — 처리하면 사라짐). 모든 종류를 같은 카드·같은 상태·같은 버튼으로
       사무실 = 선박이 보낸 요청 / 선박 = 내가 보낸 요청의 진행 상황 + 반려되어 보완할 것 */
    const KIND = () => ({ def: [U.T('결함', 'Defect'), 'pms'], req: [U.T('청구서', 'Requisition'), 'inv'], pp: [U.T('작업 연기', 'Postponement'), 'pms'], dpa: [U.T('위험성 평가', 'Risk assessment'), 'rsk'], mocw: ['MoC', 'rsk'], wait: [U.T('위험성 평가', 'Risk assessment'), 'rsk'], dev: [U.T('기기', 'Device'), 'dev'] });
    function pend() { const T = U.T, role = U.role(), off = role === 'office', sp = U.sum('pms'), sr = U.sum('rsk'), out = [];
      if (off) { Object.entries((sp && sp.ships) || {}).forEach(([n, s]) => (s.O || []).forEach(([k, id, what, tx]) => { if (k === 'cls') return;
          out.push({ k, n, t: what, b: tx || '', st: k === 'req' ? 'rcv' : k === 'def' ? 'sign' : 'wait', btn: k === 'req' ? T('접수·처리', 'Process') : k === 'def' ? T('확인·서명', 'Review & sign') : T('검토·결정', 'Review'), tool: U.toolOf(k), o: { view: n, attrs: { opsk: k, opsid: id, opsship: n } } }); }));
        Object.entries((sr && sr.v) || {}).forEach(([n, r]) => (r.items || []).filter(x => x[0] === 'wait' || x[0] === 'mocw').forEach(([k, id, tx]) => out.push({ k: k === 'mocw' ? 'mocw' : 'dpa', n, t: k === 'mocw' ? T('MoC 회사 승인 요청', 'MoC approval request') : T('DPA 승인 요청', 'DPA approval request'), b: tx || '', st: 'wait', btn: T('검토·결정', 'Review'), tool: 'rsk', o: { view: n, attrs: { a: 'sjApprove', id } } })));
        let dv = []; try { dv = JSON.parse(localStorage.getItem('sejul_pend_dev') || '[]'); } catch (e) { }
        dv.forEach(([id, ship, pc]) => out.push({ k: 'dev', n: ship || T('사무실', 'Office'), t: T('기기 승인 요청', 'Device approval'), b: pc, st: 'wait', btn: T('승인·거절', 'Approve'), href: 'index.html#devices' })); }
      else { const v = C.get('vessel') || '', s = ((sp && sp.ships) || {})[v], r = ((sr && sr.v) || {})[v];
        if (s) (s.S || []).filter(x => x[0] === 'pp').forEach(([k, id, what, tx]) => { const rej = /반려|returned/i.test(what); out.push({ k: 'pp', n: v, t: what, b: tx || '', st: rej ? 'rej' : 'mine', btn: rej ? T('확인', 'Open') : T('보기', 'View'), tool: 'pms', o: { attrs: { opsk: 'pp', opsid: id } } }); });
        if (r) (r.items || []).filter(x => x[0] === 'wait' || x[0] === 'mocw').forEach(([k, id, tx]) => out.push({ k: k === 'mocw' ? 'mocw' : 'dpa', n: v, t: k === 'mocw' ? T('MoC — 회사 승인 대기', 'MoC — awaiting approval') : T('위험성 평가 — DPA 승인 대기', 'RA — awaiting DPA'), b: tx || '', st: 'mine', btn: T('보기', 'View'), tool: 'rsk', o: { attrs: { a: 'open', k: k === 'mocw' ? 'moc' : 'ra', id } } })); }
      const ord = { rej: 0, wait: 1, sign: 1, rcv: 2, mine: 3 }; return out.sort((a, b) => (ord[a.st] - ord[b.st]) || a.n.localeCompare(b.n)); }
    const STL = () => ({ wait: [U.T('승인 대기', 'Awaiting decision'), 'y'], sign: [U.T('서명 대기', 'Awaiting signature'), 'y'], rcv: [U.T('접수 대기', 'To process'), 'b'], mine: [U.T('사무실 결정 대기', 'Waiting for office'), 'g'], rej: [U.T('반려 — 보완 필요', 'Returned — revise'), 'r'] });
    /* 새 일 넣기 (같은 열쇠는 한 번만) */
    function put(list, scope) { const o = load(), have = new Set(o.it.map(x => x.k)), first = scope && !o.sc[scope]; let n = 0;
      list.forEach(x => { if (have.has(x.k)) return; have.add(x.k); o.it.unshift(Object.assign({ at: Date.now(), rd: !!first || !!x.rd }, x)); if (!first) n++; });
      if (scope) o.sc[scope] = 1; const cut = Date.now() - 30 * DAY; o.it = o.it.filter(x => x.at > cut).slice(0, 200); if (n || first || list.length) save(o); return n; }
    function scan() { if (window.top !== window || (C.bg)) return 0; try { const { scope, E } = events(); const n = scope ? put(E, scope) : 0; paint(); return n; } catch (e) { console.warn('inbox', e); return 0; } }
    const add = (x, scope) => { const n = put(Array.isArray(x) ? x : [x], scope); paint(); return n; };
    const unread = () => load().it.filter(x => !x.rd).length;
    function paint() { let p = 0; try { p = pend().filter(x => x.st !== 'mine').length; } catch (e) { } const n = unread() + p; document.querySelectorAll('[data-sjinbn]').forEach(b => { b.hidden = !n; b.textContent = n > 99 ? '99+' : n; b.title = U.T(`승인·처리 ${p} · 새 알림 ${n - p}`, `${p} to decide · ${n - p} new`); }); if (box && !box.hidden) list(); }
    const G = () => ({ all: U.T('전체', 'All'), un: U.T('안 읽음', 'Unread'), pms: U.T('계획정비', 'Maintenance'), rsk: U.T('위험성', 'Risk'), apv: U.T('승인·결정', 'Approvals') });
    const IC = { pms: 'pms', rsk: 'rsk', apv: 'M20 6 9 17l-5-5', rej: 'M9 14 4 9l5-5M4 9h11a5 5 0 0 1 0 10h-1', dev: 'dev' };
    let tab = '', PL = [];
    function list() { const T = U.T, o = load(), P = pend(); PL = P; if (!tab) tab = P.some(x => x.st !== 'mine') ? 'apv' : 'news';
      const off = U.role() === 'office', un = o.it.filter(x => !x.rd).length;
      box.querySelector('.sji-tb').innerHTML = `<button type="button" data-sjit="apv" class="${tab === 'apv' ? 'on' : ''}">${off ? T('승인함', 'Approvals') : T('요청·결정', 'Requests')} <b class="${P.length ? 'y' : ''}">${P.length}</b></button><button type="button" data-sjit="news" class="${tab === 'news' ? 'on' : ''}">${T('알림', 'Notifications')} <b class="${un ? 'r' : ''}">${un}</b></button>`;
      box.querySelector('[data-sjiall]').hidden = tab !== 'news'; box.querySelector('.sji-f').hidden = tab !== 'news';
      if (tab === 'apv') { const K = KIND(), S = STL();
        box.querySelector('.sji-l').innerHTML = P.length ? `<div class="sji-ah">${off ? T('선박이 보낸 요청 — 결정·서명하면 목록에서 빠집니다', 'Requests from vessels — they leave the list once decided') : T('내가 보낸 요청의 진행 상황 — 반려된 건은 보완해서 다시 보내세요', 'Status of your requests — revise returned ones')}</div>` + P.map((x, i) => `<div class="sji-c"><div class="sji-ct"><span class="sji-k ${(K[x.k] || [])[1] || ''}">${U.esc((K[x.k] || [x.k])[0])}</span>${off ? `<span class="sji-v">${U.esc(x.n)}</span>` : ''}<span class="sji-st ${S[x.st][1]}">${S[x.st][0]}</span></div><b>${U.esc(x.t)}</b>${x.b ? `<small>${U.esc(x.b)}</small>` : ''}<button type="button" class="sji-go ${x.st === 'mine' ? '' : 'pri'}" data-sjip="${i}">${U.esc(x.btn)} →</button></div>`).join('')
          : `<div class="sji-e">${off ? T('결정·서명할 일이 없습니다 ✓', 'Nothing to decide ✓') : T('진행 중인 요청이 없습니다 ✓', 'No open requests ✓')}</div>`; return; }
      const L = o.it.filter(x => flt === 'all' || (flt === 'un' ? !x.rd : flt === 'apv' ? (x.g === 'apv' || x.g === 'rej') : x.g === flt));
      box.querySelector('.sji-f').innerHTML = Object.entries(G()).map(([k, l]) => `<button type="button" data-sjif="${k}" class="${flt === k ? 'on' : ''}">${l}${k === 'un' ? ' ' + o.it.filter(x => !x.rd).length : ''}</button>`).join('');
      box.querySelector('.sji-l').innerHTML = L.length ? L.map((x, i) => `<button type="button" class="sji-r ${x.rd ? '' : 'un'}" data-sjik="${U.esc(x.k)}"><span class="dot"></span><span class="ic ${x.g}">${U.ic(IC[x.g] || 'pms', 18)}</span><span class="tx"><b>${U.esc(x.t)}</b>${x.b ? `<small>${U.esc(x.b)}</small>` : ''}</span><span class="tm">${U.ago(x.at)}</span></button>`).join('')
        : `<div class="sji-e">${flt === 'un' ? T('안 읽은 알림이 없습니다 ✓', 'All caught up ✓') : T('알림이 없습니다.<br>새 결함·청구·연기 요청·승인 결과 등이 생기면 여기에 쌓입니다.', 'No notifications yet.')}</div>`; }
    const base = () => /\/tools\//.test(location.pathname) ? '../' : '';
    function go(x) { const off = U.role() === 'office'; close();
      if (x.href) { location.href = base() + x.href; return; } if (!x.tool) return;
      const v = x.o && x.o.view, prev = C.get('view') || ''; if (off && v && prev !== v) C.set('view', v);
      const here = U.curTool() === x.tool;
      if (here && !(off && v && prev !== v)) { const a = (x.o || {}).attrs; if (a) { const b = document.createElement('button'); b.hidden = true; Object.entries(a).forEach(([k, val]) => b.setAttribute('data-' + k, val)); document.body.appendChild(b); b.click(); b.remove(); } return; }
      location.href = U.goHref(base(), x.tool, x.o); }
    function open(t0) { if (!box) { box = document.createElement('div'); box.className = 'sji'; box.innerHTML = `<div class="sji-bg"></div><div class="sji-p" role="dialog" aria-label="${U.T('알림함', 'Notifications')}"><div class="sji-h"><b>${U.T('알림함', 'Inbox')}</b><button type="button" data-sjiall>${U.T('모두 읽음', 'Mark all read')}</button><button type="button" class="x" aria-label="${U.T('닫기', 'Close')}">✕</button></div><div class="sji-tb"></div><div class="sji-f"></div><div class="sji-l"></div><div class="sji-ft">${U.T('최근 30일 · 이 기기에 보관됩니다. 휴대폰 알림(푸시)을 꺼 두어도 여기에는 쌓입니다.', 'Last 30 days, kept on this device — collected even when push is off.')}</div></div>`;
        document.body.appendChild(box);
        box.addEventListener('click', e => { const tb = e.target.closest('[data-sjit]'); if (tb) { tab = tb.dataset.sjit; return list(); } const pp = e.target.closest('[data-sjip]'); if (pp) { const x = PL[+pp.dataset.sjip]; if (x) go(x); return; }
          const f = e.target.closest('[data-sjif]'); if (f) { flt = f.dataset.sjif; return list(); }
          if (e.target.closest('[data-sjiall]')) { const o = load(); o.it.forEach(x => x.rd = true); save(o); return paint(); }
          const r = e.target.closest('[data-sjik]'); if (r) { const o = load(), x = o.it.find(y => y.k === r.dataset.sjik); if (x) { x.rd = true; save(o); paint(); go(x); } return; }
          if (e.target.closest('.sji-bg,.x')) close(); }); }
      scan(); tab = t0 || ''; box.hidden = false; list(); }
    function close() { if (box) box.hidden = true; }
    document.addEventListener('click', e => { const a = e.target.closest && e.target.closest('[data-sjinb]'); if (a) { e.preventDefault(); open(a.dataset.sjinb || ''); } });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box && !box.hidden) close(); });
    addEventListener('storage', e => { if (e.key === KEY) paint(); else if (/^sejul_sum_/.test(e.key || '')) scan(); });
    if (window.top === window) { setInterval(scan, 30e3); setTimeout(scan, 1500); }
    /* 끝난 일 읽음 처리 (예: 기기 승인 요청이 처리됨) */
    const read = f => { const o = load(); let n = 0; o.it.forEach(x => { if (!x.rd && f(x)) { x.rd = true; n++; } }); if (n) { save(o); paint(); } };
    return { scan, add, open, close, paint, unread, read, pend }; })();

  /* ================= 도구 미리 준비 (Speculation Rules prerender) =================
     앱을 켜 두면 계획정비·위험성 관리 화면을 뒤에서 미리 불러 둠 → 눌렀을 때 '불러오는 중' 없이 바로 열림 (Chrome·Edge·갤럭시)
     ?go= 같은 바로가기 주소는 미리 준비 대상이 아님 (그때는 예전처럼 불러옴) */
  (function () { if (window.top !== window || /[?&]bg=1/.test(location.search) || !(window.HTMLScriptElement && HTMLScriptElement.supports && HTMLScriptElement.supports('speculationrules'))) return;
    const inTool = /\/tools\//.test(location.pathname), base = inTool ? '../' : '', here = location.pathname.split('/').pop();
    const cur = U.curTool(), urls = ['pms', 'rsk', 'inv', 'cert'].filter(t => t !== cur).map(t => U.toolUrl(base, t)).concat(inTool ? [base + 'index.html'] : []);
    const add = () => { if (document.getElementById('sjSpec') || !U.role()) return; const sc = document.createElement('script'); sc.type = 'speculationrules'; sc.id = 'sjSpec';
      const eager = u => /(pms|rsk)\.html$/.test(u); sc.textContent = JSON.stringify({ prerender: [{ source: 'list', urls: urls.filter(eager), eagerness: 'eager' }, { source: 'list', urls: urls.filter(u => !eager(u)), eagerness: 'moderate' }].filter(r => r.urls.length) });   /* 재고·증서·앱 홈은 마우스를 올리거나 누를 때 준비 (메모리 절약) */
      document.head.appendChild(sc); };
    /* 켠 직후에는 지금 화면을 먼저 — 4초 뒤 준비 시작 */
    const go = () => setTimeout(add, document.prerendering ? 0 : 4000);
    if (document.prerendering) document.addEventListener('prerenderingchange', go, { once: true }); else if (document.readyState === 'complete') go(); else addEventListener('load', go); })();

  /* ================= 공통 결정 창 (검토·결정) =================
     작업 연기 · 청구서 · 결함 · 위험성 평가(DPA) · MoC 모두 같은 모양: 머리(종류·선박·번호·상태) → 요약 → 세부·이력 → 의견 → 버튼
     o = { kind, tool:'pms'|'rsk', vessel, no, title, sub, st:[label, tone], rows:[[k, html]], secs:[{h, html}], hist:[[at, who, text]],
           fields:[{id, label, type:'text'|'date'|'ta'|'num', value, min, max, ph, req}], acts:[{k, label, tone:'ok'|'cond'|'rej'|'neu', need:[fieldId], run(v, el)}] } */
  U.decide = function (o) { const T = U.T; let el = document.getElementById('sjd'); if (el) el.remove();
    el = document.createElement('div'); el.id = 'sjd'; el.className = 'sjd';
    const fld = f => { const at = `id="sjd_${f.id}" ${f.min ? `min="${U.esc(f.min)}"` : ''} ${f.max ? `max="${U.esc(f.max)}"` : ''} placeholder="${U.esc(f.ph || '')}"`;
      return `<label class="sjd-f ${f.type === 'ta' ? 'w' : ''}"><span>${f.label}${f.req ? ' <i>*</i>' : ''}</span>${f.type === 'ta' ? `<textarea ${at} rows="3">${U.esc(f.value || '')}</textarea>` : `<input type="${f.type === 'num' ? 'number' : f.type || 'text'}" ${at} value="${U.esc(f.value || '')}">`}</label>`; };
    const acts = o.acts || [], ord = { neu: 0, rej: 1, cond: 2, ok: 3 };
    el.innerHTML = `<div class="sjd-bg"></div><div class="sjd-p" role="dialog" aria-label="${U.esc(o.kind || '')}">
      <div class="sjd-h"><div class="sjd-ct"><span class="sjd-k ${o.tool || 'pms'}">${U.esc(o.kind || '')}</span>${o.vessel ? `<span class="sjd-v">${U.esc(o.vessel)}</span>` : ''}${o.no ? `<span class="sjd-no">${U.esc(o.no)}</span>` : ''}${o.st ? `<span class="sjst ${o.st[1] || 'wait'}">${U.esc(o.st[0])}</span>` : ''}<button type="button" class="sjd-x" aria-label="${T('닫기', 'Close')}">✕</button></div>
        <h2>${U.esc(o.title || '')}</h2>${o.sub ? `<div class="sjd-sub">${o.sub}</div>` : ''}</div>
      <div class="sjd-b">${(o.rows || []).length ? `<dl class="sjd-kv">${o.rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>` : ''}
        ${(o.secs || []).filter(x => x && x.html).map(x => `<section class="sjd-s"><h3>${x.h}</h3>${x.html}</section>`).join('')}
        ${(o.hist || []).length ? `<section class="sjd-s"><h3>${T('처리 이력', 'History')}</h3><ol class="sjd-tl">${o.hist.map(([at, who, tx]) => `<li><b>${U.esc(at || '')}</b> ${U.esc(who || '')}<span>${U.esc(tx || '')}</span></li>`).join('')}</ol></section>` : ''}
        ${(o.fields || []).length ? `<section class="sjd-s sjd-in"><h3>${T('결정 입력', 'Decision')}</h3><div class="sjd-fs">${o.fields.map(fld).join('')}</div></section>` : ''}
        <div class="sjd-err" role="alert"></div></div>
      <div class="sjd-ft"><button type="button" class="sjd-b0 sjd-x2">${T('닫기', 'Close')}</button>${acts.map((a, i) => [a, i]).filter(x => (x[0].tone || 'neu') === 'neu').map(([a, i]) => `<button type="button" class="sjd-a neu" data-sjda="${i}">${a.label}</button>`).join('')}<span class="sp"></span>${acts.map((a, i) => [a, i]).filter(x => (x[0].tone || 'neu') !== 'neu').sort((x, y) => (ord[x[0].tone] || 0) - (ord[y[0].tone] || 0)).map(([a, i]) => `<button type="button" class="sjd-a ${a.tone || 'neu'}" data-sjda="${i}" ${a.off ? 'disabled title="' + U.esc(a.off) + '"' : ''}>${a.label}</button>`).join('')}</div></div>`;
    document.body.appendChild(el); const close = () => el.remove(); el._close = close;
    const vals = () => { const v = {}; (o.fields || []).forEach(f => { const i = el.querySelector('#sjd_' + f.id); v[f.id] = i ? String(i.value || '').trim() : ''; }); return v; };
    el.addEventListener('click', async e => { if (e.target.closest('.sjd-bg,.sjd-x,.sjd-x2')) return close(); const b = e.target.closest('[data-sjda]'); if (!b || b.disabled) return;
      const a = acts[+b.dataset.sjda], v = vals(), er = el.querySelector('.sjd-err'); er.textContent = '';
      const miss = (a.need || []).filter(k => !v[k]); if (miss.length) { const f = (o.fields || []).find(x => x.id === miss[0]); er.textContent = T(`'${f ? f.label.replace(/<[^>]+>/g, '') : miss[0]}'을(를) 입력하세요.`, `Enter '${f ? f.label.replace(/<[^>]+>/g, '') : miss[0]}'.`); const i = el.querySelector('#sjd_' + miss[0]); if (i) i.focus(); return; }
      let r; try { r = await a.run(v, el); } catch (x) { r = x.message; } if (typeof r === 'string' && r) { er.textContent = r; return; } if (r !== false) close(); });
    document.addEventListener('keydown', function k(e) { if (e.key === 'Escape') { if (document.getElementById('sjd') === el) close(); document.removeEventListener('keydown', k); } });
    setTimeout(() => { const f = el.querySelector('.sjd-in textarea,.sjd-in input'); if (f && window.matchMedia('(min-width: 900px)').matches) f.focus(); }, 40); return el; };
  U.sjdTable = (head, rows) => `<div class="sjd-tw"><table class="sjd-t"><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</table></div>`;
})();
