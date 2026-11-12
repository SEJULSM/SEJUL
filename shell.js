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
  const BG = new URLSearchParams(location.search).has('bg'); C.bg = BG;   /* 앱 홈이 요약만 만들려고 보이지 않게 연 창 */

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
.sj-card:has([data-sjconf=dpaName]),[data-act=spXlsx],.morebar:has([data-invmore]),[data-act=opsReply],[data-act=opsOpen],[data-act=openShipData],[data-a=dqCopyK],[data-a=dqCopy],[data-a=dqEml],#modal details.dqtxt,#modal .dqres .lbl,#modal .dqres .code,.sj-card.wipe,[data-a=resetAll],[data-a=pcNameReset],#top .sj-nav [data-go=fleet],#top .sj-nav [data-go=settings],#mtab [data-go=fleet],#sjFoot [data-go=fleet],#mtab [data-go=settings],.sj-sheet [data-go=settings],#top .sj-nav>[data-go=fleet],#top .sj-nav>[data-go=settings],#mtab [data-go=settings],.sj-sheet [data-go=settings],.sj-card.wipe,.resetbox,[data-a=delAll],[data-a=resetAll],.sj-card:has(#npw),.card:has(> .grid input[data-b=dpaName]),label:has(> select[data-b=vessel]),.f:has(> select[data-b=vessel]),.f:has(input[data-b=vesselOther]){display:none!important}
.sjx-home{display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:9px;background:#ffffff1f;color:#fff;text-decoration:none;font-size:17px;flex:none;margin-right:4px}
.sjx-card{border:1px solid var(--sjx-line);border-radius:14px;background:#fff;padding:14px 16px;margin-bottom:14px;display:flex;gap:14px;align-items:center;flex-wrap:wrap}
.sjx-card .tx{flex:1;min-width:220px;font-size:13.5px;color:#3B4352;line-height:1.55}.sjx-card b{color:var(--sjx-ink);font-size:14.5px}
.sjx-pick{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;margin-top:16px}.sjx-pick button{text-align:left;background:#fff;border:1px solid var(--sjx-line);border-radius:14px;padding:16px;font:inherit;cursor:pointer;min-height:64px}.sjx-pick button:hover{border-color:#9AA6B8}.sjx-pick b{display:block;font-size:16px}.sjx-pick small{color:var(--sjx-mut)}.sjx-empty{background:#fff;border:1px solid var(--sjx-line);border-radius:16px;padding:28px;margin:8px 0;font-size:14.5px;line-height:1.7;color:#3B4352}.sjx-empty h2{margin:0 0 6px;font-size:20px;color:var(--sjx-ink)}
.sjx-srv{border:2px solid #1B2F5B;background:#F3F6FB;border-radius:14px;padding:14px 16px;margin:8px 0;font-size:14.5px;line-height:1.65;color:#1D2433}.sjx-srv b{font-size:16px}.sjx-srv .btn{margin-top:8px}
.sjx-dd{position:relative;display:inline-block}.sjx-dd>summary{list-style:none;cursor:pointer;display:inline-flex;align-items:center;gap:6px;user-select:none}.sjx-dd>summary::-webkit-details-marker{display:none}
.sjx-ddm{position:absolute;z-index:60;top:calc(100% + 6px);left:0;min-width:260px;background:#fff;border:1px solid var(--sjx-line);border-radius:12px;box-shadow:0 12px 30px #0f172a26;padding:6px;display:flex;flex-direction:column;gap:2px}
.sjx-ddm>*{width:100%;justify-content:flex-start!important;text-align:left;border:0!important;background:none!important;box-shadow:none!important;border-radius:8px!important;padding:10px 12px!important;margin:0!important}.sjx-ddm>*:hover{background:#F1F3F6!important}
/* 각 도구의 '사용법' 탭 숨김 (내용이 지금 앱과 맞지 않음) */
[data-go=help],button[data-v=help],#mtab [data-v=help]{display:none!important}
.sjx-ddm .sjx-ddh{font-size:12px;color:var(--sjx-mut);padding:6px 12px 2px!important;pointer-events:none}
.sjx-ph{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin:2px 0 14px}.sjx-ph h1{margin:0!important;font-size:24px!important;flex:1;min-width:220px;display:flex;align-items:baseline;gap:8px;flex-wrap:wrap}.sjx-ph .sjx-act{display:flex;gap:8px;flex-wrap:wrap}
.sjx-fc{background:#fff;border:1px solid var(--sjx-line);border-radius:14px;padding:12px 16px;margin:0 0 14px;display:flex;flex-direction:column;gap:10px}.sjx-fc>*{margin:0!important}.sjx-fc>*+*{border-top:1px dashed #E3E6EB;padding-top:10px!important}
#main .hsub,#main p.hsub{color:var(--sjx-mut)!important;font-size:13.5px!important;margin:-6px 0 14px!important}
#main .btn.prt9,#main [data-act=ckBlankMenu],#main .btn.or,#main .btn.warn:not(.danger){background:#fff!important;border:1.5px solid #2F5496!important;color:#2F5496!important;font-weight:700!important;font-size:14.5px!important;padding:8px 16px!important;border-radius:9px!important;margin:0!important;box-shadow:none!important}
#main .btn{border-radius:9px}#main .btn.pri{background:#2F5496;border-color:#2F5496}
#main .chips .chip,#main .chip{border:1.5px solid #c3cbd9!important;background:#fff!important;border-radius:20px!important;padding:6px 14px!important;font-size:14px!important;color:#1d2433!important;box-shadow:none!important}
#main .chip b{display:inline-block;min-width:20px;text-align:center;background:#EEF2F8;color:#2F5496;border-radius:10px;padding:0 7px;margin-left:4px;font-size:12.5px}
#main .chip.on{background:#2F5496!important;border-color:#2F5496!important;color:#fff!important}#main .chip.on b{background:rgba(255,255,255,.22);color:#fff}
#main .viewsw{background:#fff;border:1px solid var(--sjx-line);border-radius:12px;padding:4px;display:inline-flex!important;gap:2px!important;margin:0 0 14px!important}#main .viewsw .lb{padding:0 8px;color:var(--sjx-mut);font-size:13px}
#main .viewsw button{border:0!important;border-radius:9px!important;background:transparent!important;color:#3B4352!important;font-weight:600!important;padding:8px 14px!important}#main .viewsw button.on{background:#2F5496!important;color:#fff!important}
#main .kpis{gap:10px!important}#main .kp{align-items:flex-start!important;text-align:left!important;min-width:120px!important;padding:12px 14px!important;border:1px solid var(--sjx-line)!important;border-left:4px solid #CBD2DC!important;border-radius:12px!important;background:#fff!important;box-shadow:none!important}
#main .kp b{font-size:26px!important}#main .kp span{font-size:12.5px!important;color:var(--sjx-mut)!important}#main .kp.od{border-left-color:#C62828!important}#main .kp.d7{border-left-color:#C99700!important}#main .kp.d30{border-left-color:#9AA6B8!important}#main .kp.cr{border-left-color:#E8A400!important;background:#fff!important}#main .kp.dn{border-left-color:#2E7D32!important}
#main .card,#main .tw{border-radius:14px!important;border-color:var(--sjx-line)!important;box-shadow:none!important}
.vesbar{display:none!important}
.sjx-fc{padding:6px 18px!important;gap:0!important}.sjx-fc>.sjx-row{display:grid;grid-template-columns:96px 1fr;gap:12px;align-items:center;padding:12px 0!important}.sjx-fc>.sjx-row+.sjx-row{border-top:1px dashed #E3E6EB}
.sjx-lb{font-weight:700;font-size:14.5px;color:#1d2433;display:flex;align-items:center;gap:6px}.sjx-rc{min-width:0}.sjx-rc>*{margin:0!important}
#main .sjx-fc input[type=search],#main .sjx-fc input[type=text]{border:1.5px solid #2F5496!important;border-radius:10px!important;min-height:40px}
#main .sjx-seg{display:inline-flex!important;flex-wrap:wrap;gap:0!important;border:1.5px solid #2F5496;border-radius:10px;overflow:hidden;background:#fff}
#main .sjx-seg .chip{border:0!important;border-radius:0!important;border-right:1px solid #E3E6EB!important;padding:9px 14px!important;color:#5B6474!important;font-weight:600}
#main .sjx-seg .chip:last-child{border-right:0!important}#main .sjx-seg .chip.on{background:#2F5496!important;color:#fff!important}
#main .sjx-seg .chip::before{content:'';display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--dot,#B8C0CC);margin-right:6px;vertical-align:1px}#main .sjx-seg .chip.on::before{background:#fff}
.sjx-rc>.dfsub>span.small{display:none}
.sjx-cnt{font-weight:700;font-size:15px;margin:2px 0 8px;color:#1d2433}
@media (max-width:760px){.sjx-fc>.sjx-row{grid-template-columns:1fr;gap:6px}}
#main .opsp{box-shadow:none!important;border:1px solid var(--sjx-line)!important;border-left:4px solid #C62828!important;border-radius:14px!important}
.sjx-card a{background:var(--sjx-navy);color:#fff;text-decoration:none;border-radius:9px;padding:8px 14px;font-weight:700;font-size:13.5px}
.sjx-hero{display:flex;align-items:center;gap:18px;background:#fff;border:1px solid var(--sjx-line);border-left:6px solid #C62828;border-radius:16px;padding:18px 22px;margin:4px 0 18px}.sjx-hero.ok{border-left-color:#2E7D32}.sjx-hero .tx{flex:1;min-width:0}.sjx-hero small{display:block;color:var(--sjx-mut);font-size:13.5px;font-weight:600}.sjx-hero b{display:block;font-size:22px;margin:4px 0 4px;color:var(--sjx-ink)}.sjx-hero em{font-style:normal}.sjx-hero em.r{color:#C62828}.sjx-hero em.y{color:#B26A00}.sjx-hero span{color:var(--sjx-mut);font-size:14px}.sjx-hero .btn{white-space:nowrap;font-size:16px!important;padding:12px 18px!important;background:#1B2F5B!important;color:#fff!important;border-radius:12px!important}
@media (max-width:640px){.sjx-hero{flex-direction:column;align-items:stretch;padding:16px}.sjx-hero b{font-size:19px}}
#main .kpu{font-size:12.5px!important}#main .small,#main small{font-size:max(12.5px,.85em)}
/* 입력 창(팝업) — 위험성 관리와 같은 짜임 */
#mback .modal{border-radius:18px!important;box-shadow:0 24px 60px rgba(15,23,42,.28)!important}
#mback .modal .mh{padding:18px 24px!important;font-size:19px!important;font-weight:800!important;background:#fff!important;border-bottom:1px solid var(--sjx-line)!important}
#mback .modal .mb{padding:20px 24px!important}#mback .modal .mf{background:#F7F8FA!important;border-top:1px solid var(--sjx-line)!important;padding:12px 24px!important}
#mback .modal .mb label{font-weight:700;color:#334155}
#mback .modal .mb :is(input:not([type=radio]):not([type=checkbox]),select,textarea){border:1.5px solid #CBD2DC!important;border-radius:10px!important;min-height:42px;font-size:15px!important}
#mback .modal .mb :is(input,select,textarea):focus{border-color:#2F5496!important;box-shadow:0 0 0 3px rgba(47,84,150,.15)!important;outline:0!important}
#mback .modal .dfh{background:#F3F6FB;border:0!important;border-left:5px solid #1B2F5B!important;border-radius:8px;padding:9px 14px!important;margin:18px 0 12px!important;font-size:16px!important}
@media (max-width:640px){#mback .modal{border-radius:18px 18px 0 0!important}#mback .modal .mh,#mback .modal .mb{padding-left:16px!important;padding-right:16px!important}}
/* 한글이 한 글자씩 끊겨 보이지 않게 (단어 단위 줄바꿈) */
#main,#mback .modal{word-break:keep-all;overflow-wrap:anywhere}
/* 휴대폰: 점검표 항목 줄 — 번호 | 내용, 그 아래 ✓✗ · 비고 */
@media (max-width:640px){
 #mback .ckr,#mback .ckr:has(.ckmv),#main .ckr{grid-template-columns:30px minmax(0,1fr)!important;gap:6px 8px!important;align-items:start!important}
 #mback .ckr>:not(.ckn),#main .ckr>:not(.ckn){grid-column:2!important;min-width:0}
 #mback .ckr .ckseg{justify-self:start}#mback .ckr .ckseg button{min-width:52px;min-height:40px;font-size:16px}#mback .ckr .ckm,#mback .ckr input{width:100%!important}
 #mback .ckpk{grid-template-columns:repeat(2,1fr)!important}#mback .mr .mrsum,#main .mr .mrsum{overflow-x:auto;grid-template-columns:repeat(7,minmax(70px,1fr))!important}
 #mback .modal table{display:block;overflow-x:auto}
 /* 간소화: 설명 문단·출력·엑셀·대량 등록은 PC에서 */
 #main>p.hsub,#main>.info.small,#main .sech,#main .sfitiles,#main section.eql,
 #main [data-act=prt9],#main .prt9,#main .prt9s,#main .sjx-dd,#main [data-act=ckPrintMenu],#main [data-act=ckBlankMenu],#main [data-act=sfiPrint],#main [data-act=clsPrint],#main [data-act=clsBlank],#main [data-act=monthlyReport],
 #main .sjx-ph [data-act=eqAdd],#main .sjx-ph [data-act=calAdd],#main .sjx-ph [data-act=clsNew],#main .sjx-ph [data-act=spNew],#main [data-act=sfiAdd]{display:none!important}
 #main .sjx-row:has([data-act=ckBlankMenu]):not(:has(input,select)),#main .sjx-fc:has([data-act=ckBlankMenu]):not(:has(input,select)){display:none!important}
 #main h1{font-size:22px!important}#main .sjx-ph{margin-bottom:6px}
 .sjx-pcnote{display:block!important}
}
.sjx-pcnote{display:none;font-size:12.5px;color:#5B6474;background:#EEF3FB;border-radius:10px;padding:8px 12px;margin:0 0 12px}
/* 도구 자체 큰 머리말(계획정비 시스템 · 위험성 관리 도구) 숨김 — 왼쪽 메뉴·홈 머리말이 대신함 */
html body #top .sjbar,html body header.top .bar{display:none!important}
.sjh-crew{margin:0 0 12px}.sjh-crew>*{margin:0!important}
#main>.sjh,.sjh{padding-top:4px}
/* 목록 표 — 홈·SFI 화면과 같은 흰 카드 · 옅은 머리줄 */
#main .tw{background:#fff;border:1px solid var(--sjx-line);border-radius:14px}
#main table.g thead th,#main table.g>tr:first-child>th{background:#F7F8FA!important;color:#5B6474!important;font-weight:700!important;font-size:12.5px!important;border-bottom:1px solid #E3E6EB!important;text-transform:none}
#main table.g tbody tr:hover>td{background:#F7F9FC}
/* ===== 도구 안 탭 줄: 도구 이름표 · 아이콘 · 숫자 · 고른 탭은 남색 알약 · 더보기(PC) · 전체 메뉴(휴대폰) ===== */
html body #top .sj-nav,html body header.top #nav{display:flex!important;align-items:center!important;gap:4px!important;flex-wrap:nowrap!important;background:#fff!important;border-bottom:1px solid #E3E6EB!important;box-shadow:0 2px 8px rgba(15,23,42,.06)!important;padding:8px 14px!important;overflow:visible}
html body #top .sj-nav>button,html body header.top #nav>button,html body .sjtb-more .sjtb-mm>button{display:inline-flex!important;align-items:center!important;gap:6px!important;flex:0 0 auto!important;white-space:nowrap!important;color:#334155!important;background:transparent!important;border:0!important;border-radius:9px!important;padding:8px 12px!important;font-size:14.5px!important;font-weight:600!important;box-shadow:none!important;margin:0!important;line-height:1.2!important}
html body #top .sj-nav>button:hover,html body header.top #nav>button:hover{background:#F1F4F9!important;color:#14244A!important}
html body #top .sj-nav>button.on,html body header.top #nav>button.on{background:#1B2F5B!important;color:#fff!important;font-weight:800!important;border:0!important}
.sjtb-ic{display:inline-flex;opacity:.8}button.on .sjtb-ic{opacity:1}
.sjtb-n{font-size:11.5px;font-weight:800;border-radius:9px;padding:0 6px;line-height:18px;background:#FDECEC;color:#C62828}.sjtb-n.y{background:#FFF4D6;color:#8A5A00}.sjtb-n.b{background:#E7ECF5;color:#1B2F5B}button.on .sjtb-n{background:#fff}
.sjtb-id{display:inline-flex;align-items:center;gap:8px;padding:4px 14px 4px 2px;margin-right:6px;border-right:1px solid #E3E6EB;font-weight:800;font-size:15px;color:#0F172A;white-space:nowrap;flex:none}.sjtb-id i{width:28px;height:28px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;font-style:normal}
.sjtb-id.pms i{background:#E7ECF5;color:#1B2F5B}.sjtb-id.rsk i{background:#FDF0E7;color:#B4501A}
.sjtb-more{position:relative;margin-left:auto;flex:none}.sjtb-more>summary{list-style:none;cursor:pointer;padding:8px 12px;border-radius:9px;font-weight:700;font-size:14.5px;color:#334155;white-space:nowrap}.sjtb-more>summary::-webkit-details-marker{display:none}.sjtb-more>summary:hover{background:#F1F4F9}.sjtb-more.on>summary{background:#1B2F5B;color:#fff}
.sjtb-mm{position:absolute;right:0;top:calc(100% + 6px);z-index:60;background:#fff;border:1px solid #DDE2EA;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.15);padding:6px;min-width:220px;display:flex;flex-direction:column}.sjtb-mm>button{width:100%;justify-content:flex-start}.sjtb-mm>button.on{background:#1B2F5B!important;color:#fff!important}
.sjtb-all{display:none}
html body #top .sj-nav>button[data-go=help],html body #top .sj-nav>button[data-go=settings],html body header.top #nav>button[data-v=help],html body header.top #nav>button[data-v=settings],html body #top .sj-nav>button.sjtb-all,html body header.top #nav>button.sjtb-all{display:none!important}
@media (max-width:899px){
 html body #top .sj-nav>button.sjtb-all,html body header.top #nav>button.sjtb-all{display:flex!important;position:fixed!important;right:0!important;width:56px!important;height:50px!important;padding:0 8px 0 0!important;align-items:center!important;justify-content:flex-end!important;border:0!important;border-radius:0!important;background:linear-gradient(90deg,rgba(255,255,255,0),#fff 40%)!important}
 html body #top .sj-nav,html body header.top #nav{padding:8px 52px 8px 10px!important;overflow-x:auto!important;gap:6px!important;position:relative}
 html body #top .sj-nav>button,html body header.top #nav>button{border:1px solid #D5DCE6!important;border-radius:18px!important;padding:7px 12px!important;font-size:14px!important}
 html body #top .sj-nav>button.on,html body header.top #nav>button.on{border-color:#1B2F5B!important}
 .sjtb-id{display:none}.sjtb-more{display:contents}.sjtb-more>summary{display:none}.sjtb-more .sjtb-mm{display:contents}
 .sjtb-all{display:flex;position:fixed;right:0;width:52px;height:52px;align-items:center;justify-content:center;background:linear-gradient(90deg,rgba(255,255,255,0),#fff 35%);border:0;z-index:5;cursor:pointer;color:#1B2F5B}
 .sjtb-all span{display:flex;width:34px;height:34px;border-radius:10px;border:1px solid #D5DCE6;background:#fff;align-items:center;justify-content:center}
}
.sjtb-sh{position:fixed;inset:0;z-index:2100}.sjtb-sh[hidden]{display:none}.sjtb-sh .bg{position:absolute;inset:0;background:rgba(15,23,42,.45)}.sjtb-sh .pn{position:absolute;left:0;right:0;bottom:0;background:#fff;border-radius:18px 18px 0 0;padding:10px 12px calc(16px + env(safe-area-inset-bottom));max-height:80vh;overflow:auto;font-family:'Pretendard','Noto Sans KR','Malgun Gothic',system-ui,sans-serif}
.sjtb-sh h3{margin:6px 6px 10px;font-size:17px;display:flex;align-items:center}.sjtb-sh h3 button{margin-left:auto;border:0;background:#F1F3F7;border-radius:50%;width:34px;height:34px;font-size:16px}
.sjtb-sh .pn>button.it{display:flex;align-items:center;gap:12px;width:100%;text-align:left;border:0;border-bottom:1px solid #F0F2F5;background:none;padding:14px 10px;font:inherit;font-size:16px;font-weight:700;color:#0F172A;cursor:pointer}.sjtb-sh .pn>button.it.on{background:#EEF3FB;box-shadow:inset 4px 0 0 #F2B705}.sjtb-sh .pn>button.it .sjtb-n{margin-left:auto}
/* 이전/다음 막대 없앰 (위 탭·왼쪽 메뉴로 이동) · 실행 취소 단추는 저장 알림의 [되돌리기]로 · 위험성 관리 '설정' 탭은 앱 설정으로 */
#sjFoot{display:none!important}#top .sj-nav [data-go=help],#nav [data-v=help],#mtab [data-v=help],#mtsheet [data-v=help],#drawer [data-go=help],#drawer [data-v=help]{display:none!important}#top .sj-tool[data-act=undo],#top .sj-tool[data-act=redo]{display:none!important}#nav [data-v=settings],#mtab [data-v=settings]{display:none!important}
#toasts .toast button:not(.tx){white-space:nowrap;flex:none;background:#F2B705!important;color:#14244A!important;border:0!important;border-radius:8px!important;font-weight:800!important;padding:5px 12px!important}
@media (max-width:899px){
 html body #top .sjbar,html body header.top .bar,html body #mtab,html body #mtsheet{display:none!important}
 html body #top.sj-top,html body header.top{top:54px!important}html.sj-hasupd #top.sj-top,html.sj-hasupd header.top{top:100px!important}
 html body #top .sj-nav,html body header.top .nav,html body header.top #nav{display:flex!important;flex-wrap:nowrap!important;overflow-x:auto!important;background:#fff!important;border-bottom:1px solid #E3E6EB!important;padding:0 6px!important;scrollbar-width:none;box-shadow:none!important;gap:0!important}
 #top .sj-nav::-webkit-scrollbar,header.top .nav::-webkit-scrollbar{display:none}
 #top .sj-nav>button,header.top .nav>button{flex:0 0 auto!important;white-space:nowrap;color:#5B6474!important;background:transparent!important;border:0!important;border-bottom:3px solid transparent!important;border-radius:0!important;padding:13px 12px 10px!important;font-size:15px!important;font-weight:600!important;box-shadow:none!important}
 #top .sj-nav>button.on,header.top .nav>button.on{color:#14244A!important;border-bottom-color:#14244A!important;font-weight:800!important}
 #top .sj-nav .sj-site{display:none!important}
 html body #toasts{top:auto!important;bottom:84px!important;left:10px!important;right:10px!important}html body{padding-top:54px!important;padding-bottom:84px!important}html.sj-hasupd body{padding-top:100px!important}html body #foot{bottom:66px!important}#drawer{bottom:66px!important}#selbar{bottom:66px!important}
}`;
  const st = document.createElement('style'); st.textContent = css; (document.head || document.documentElement).appendChild(st);
  /* 도구가 앱 설정(선박·사무실)을 적용할 때까지 내용 숨김 — 예전 모양·다른 선박이 잠깐 보이는 것 방지 */
  const wait = document.createElement('style'); wait.id = 'sjxWait'; wait.textContent = 'body>*:not(.sjr):not(.sjmob){visibility:hidden!important}body{background:#F3F4F6!important}'; (document.head || document.documentElement).appendChild(wait);
  /* 불러오는 동안 보이는 화면 (빈 화면 대신) */
  if (!BG) { const l = document.createElement('div'); l.id = 'sjxLoad'; const nm = TOOL === 'pms' ? T('계획정비', 'Maintenance') : T('위험성 관리', 'Risk');
    l.innerHTML = `<style>#sjxLoad{position:fixed;inset:0;z-index:890;background:#F3F4F6;display:flex;align-items:center;justify-content:center;font-family:'Pretendard','Noto Sans KR','Malgun Gothic',system-ui,sans-serif}@media (min-width:900px){#sjxLoad{left:248px}}@media (max-width:899px){#sjxLoad{top:54px;bottom:66px}}#sjxLoad .b{text-align:center;color:#1B2F5B}#sjxLoad i{display:block;width:44px;height:44px;margin:0 auto 16px;border-radius:50%;border:4px solid #D7DEEA;border-top-color:#1B2F5B;animation:sjxsp .8s linear infinite}#sjxLoad b{display:block;font-size:18px}#sjxLoad small{display:block;margin-top:6px;color:#5B6474;font-size:14px}@keyframes sjxsp{to{transform:rotate(360deg)}}</style><div class="b"><i></i><b>${nm} ${T('불러오는 중…', 'loading…')}</b><small>${T('처음 열 때는 몇 초 걸릴 수 있습니다', 'The first open can take a few seconds')}</small></div>`;
    document.documentElement.appendChild(l); }
  C.ready = () => { const w = document.getElementById('sjxWait'); if (w) w.remove(); const l = document.getElementById('sjxLoad'); if (l) l.remove(); };
  /* 비상용: 도구가 끝내 준비되지 않을 때만 가림막을 걷음 (느린 휴대폰에서 예전 화면이 먼저 보이지 않도록 넉넉히) */
  setTimeout(() => { if (!C.booted) C.ready(); }, 20000); setTimeout(C.ready, 30000);
  const early = () => { try { C.ensureBar(); } catch (e) { } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', early); else setTimeout(early, 0);

  /* ---------- 왼쪽 메뉴 ---------- */
  C.ensureBar = function () {
    let r = document.querySelector('.sjr'); if (!r) { document.querySelectorAll('.sjmob').forEach(x => x.remove()); const w = document.createElement('div'); w.innerHTML = U.rail(TOOL, '../'); [...w.children].forEach(x => document.body.appendChild(x)); U.syncPaint(); U.updPaint(); C.updBar && C.updBar(); }
    const bar = document.querySelector('#top .sjbar, header.top .bar'); /* 휴대폰: 머리글에 ⌂ */
    if (bar && !bar.querySelector('.sjx-home')) { const a = document.createElement('a'); a.className = 'sjx-home'; a.href = '../index.html'; a.title = T('앱 홈', 'App home'); a.textContent = '⌂'; bar.insertBefore(a, bar.firstChild); } };
  /* 탭 줄 꾸미기 — 도구가 다시 그릴 때마다 */
  const TBI = { home: 'home', jobs: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01', due: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01', ck: 'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11', defects: 'M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z', spares: 'M21 8 12 3 3 8v8l9 5 9-5zM3 8l9 5 9-5M12 13v8', fleet: 'bld',
    raList: 'M9 4h6v3H9zM7 5H5v16h14V5h-2M9 12h6M9 16h4', ptwList: 'M7 3h7l5 5v13H7zM14 3v5h5M10 14l2 2 4-4', mocList: 'M4 4v6h6M20 20v-6h-6M20 9A8 8 0 0 0 5.6 5.6L4 10M4 15a8 8 0 0 0 14.4 3.4L20 14', rirList: 'M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z', register: 'M4 4h12a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4zM8 4v16', dpa: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4' };
  const navDeco = () => { try { const pms = TOOL === 'pms', nav = document.querySelector(pms ? '#top .sj-nav' : 'header.top #nav'); if (!nav) return;
      const key = b => pms ? b.dataset.go : b.dataset.v, off = U.role() === 'office', v = off ? (C.get('view') || '') : (C.get('vessel') || '');
      const sp = (U.sum('pms') || {}).ships || {}, s = sp[v] || {}, r = ((U.sum('rsk') || {}).v || {})[v] || {};
      const CNT = pms ? { jobs: [s.od, ''], defects: [s.def, s.defA ? '' : 'y'], spares: [s.low, 'y'] } : { raList: [(r.wait || 0) + (r.stop || 0), r.stop ? '' : 'y'], ptwList: [r.act, 'b'], dpa: [r.wait, 'y'] };
      if (!nav.querySelector('.sjtb-id')) nav.insertAdjacentHTML('afterbegin', `<span class="sjtb-id ${pms ? 'pms' : 'rsk'}"><i>${U.ic(pms ? 'pms' : 'rsk', 17)}</i>${pms ? T('계획정비', 'Maintenance') : T('위험성 관리', 'Risk')}</span>`);
      const btns = [...nav.querySelectorAll(':scope>button, :scope>.sjtb-more .sjtb-mm>button')];
      btns.forEach(b => { const k = key(b); if (!k) return; if (k === 'dpa' && /승인 코드/.test(b.textContent)) b.textContent = T('DPA·회사 승인', 'Approvals'); if (pms && k === 'home' && /선박 현황|Vessel/.test(b.textContent)) b.textContent = T('홈', 'Home');
        if (!b.querySelector('.sjtb-ic') && TBI[k]) b.insertAdjacentHTML('afterbegin', `<span class="sjtb-ic">${U.ic(TBI[k], 16)}</span>`);
        b.querySelectorAll('.sjtb-n').forEach(x => x.remove()); const c = CNT[k]; if (c && c[0]) b.insertAdjacentHTML('beforeend', `<span class="sjtb-n ${c[1]}">${c[0]}</span>`); });
      if (!pms) { let more = nav.querySelector('.sjtb-more'); const mv = btns.filter(b => ['rirList', 'register'].includes(key(b)));
        if (mv.length) { if (!more) { more = document.createElement('details'); more.className = 'sjtb-more'; more.innerHTML = `<summary>${T('더보기', 'More')} ▾</summary><div class="sjtb-mm"></div>`; nav.appendChild(more); more.addEventListener('click', e => { if (e.target.closest('.sjtb-mm>button')) more.open = false; }); }
          mv.forEach(b => { if (b.parentNode !== more.querySelector('.sjtb-mm')) more.querySelector('.sjtb-mm').appendChild(b); }); more.classList.toggle('on', mv.some(b => b.classList.contains('on'))); } }
      let all = nav.querySelector('.sjtb-all'); if (!all) { nav.insertAdjacentHTML('beforeend', `<button type="button" class="sjtb-all" aria-label="${T('전체 메뉴', 'All sections')}"><span>${U.ic('M4 6h16M4 12h16M4 18h16', 18)}</span></button>`); all = nav.querySelector('.sjtb-all'); all.onclick = e => { e.stopPropagation(); navSheet(nav, key); }; }
      if (window.matchMedia('(max-width: 899px)').matches) setTimeout(() => { const on = nav.querySelector('button.on:not(.sjtb-all)'); if (!on) return; const a = on.getBoundingClientRect(), n = nav.getBoundingClientRect(); if (a.left < n.left || a.right > n.right - 56) nav.scrollLeft += a.left - n.left - 12; }, 60);
    } catch (e) { console.warn('nav', e); } };
  const navSheet = (nav, key) => { let sh = document.querySelector('.sjtb-sh'); if (!sh) { sh = document.createElement('div'); sh.className = 'sjtb-sh'; document.body.appendChild(sh); }
    const bs = [...nav.querySelectorAll('button')].filter(b => !b.classList.contains('sjtb-all') && key(b) && getComputedStyle(b).display !== 'none');
    sh.innerHTML = `<div class="bg"></div><div class="pn"><h3>${TOOL === 'pms' ? T('계획정비', 'Maintenance') : T('위험성 관리', 'Risk')}<button type="button" aria-label="${T('닫기', 'Close')}">✕</button></h3>${bs.map((b, i) => `<button type="button" class="it ${b.classList.contains('on') ? 'on' : ''}" data-i="${i}">${b.innerHTML}</button>`).join('')}</div>`;
    sh.hidden = false; sh.onclick = e => { const it = e.target.closest('.it'); if (it) { sh.hidden = true; bs[+it.dataset.i].click(); return; } if (e.target.closest('.bg,h3 button')) sh.hidden = true; }; };
  const railRefresh = () => { setTimeout(navDeco, 0); const open = document.querySelector('.sjs:not([hidden])'); document.querySelectorAll('.sjr,.sjmob').forEach(x => x.remove()); C.ensureBar(); if (open) { const sh = document.querySelector('.sjs'); if (sh) sh.hidden = false; } };
  const appCard = cls => `<div class="${cls} sjx-card"><span class="tx"><b>${T('앱 공통 설정', 'App settings')}</b><br>${T('기기 종류(선박/사무실)·선박·PC 이름·언어·회사 정보(DPA)·서버 동기화·백업 폴더는 앱 [설정]에서 한 번에 관리합니다. 이 화면에는 이 도구에만 필요한 설정만 있습니다.', 'Device type, vessel, PC name, language, company (DPA), sync and backup folder are managed once in app Settings. Only settings for this tool are here.')}</span><a href="../index.html#settings">${T('앱 설정 열기', 'Open app settings')}</a></div>`;
  const noData = (v, tool) => `<div class="sjx-empty"><h2>${U.esc(v)}</h2>${T(`아직 이 선박의 ${tool} 자료를 받지 못했습니다.<br>선박 기기가 앱에 등록되고 사무실이 [기기 승인]을 하면, 선박에서 입력한 자료가 자동으로 들어옵니다.`, `No ${tool} data from this vessel yet. It arrives once a ship device is registered and approved.`)}<div style="margin-top:14px"><a href="../index.html#devices" style="font-weight:700">${T('기기 승인 화면으로 →', 'Go to device approval →')}</a></div></div>`;
  document.addEventListener('click', e => { const b = e.target.closest && e.target.closest('[data-sjpick]'); if (!b) return; C.set('view', b.dataset.sjpick); if (U.onView) U.onView(b.dataset.sjpick); }, true);
  document.addEventListener('click', e => { const b = e.target.closest && e.target.closest('[data-invcat],[data-invlow],[data-invexp]'); if (!b || typeof SPF === 'undefined') return; SPF.lim = 1e6;
    if (b.dataset.invcat === '') { SPF.q = ''; SPF.low = false; SPF.exp = false; SPF.tab = 'items'; const q = document.getElementById('spq'); if (q) q.value = ''; } }, true);
  document.addEventListener('input', e => { if (e.target && e.target.id === 'spq' && typeof SPF !== 'undefined') setTimeout(() => SPF.lim = 1e6, 0); }, true);
  /* 이름 없는 빈 선택 칸에 '— 선택 —' 표시 (팝업 포함) */
  const fixSel = () => document.querySelectorAll('select').forEach(sl => { const o = sl.options[0]; if (o && o.value === '' && !o.text.trim()) o.text = T('— 선택 —', '— Select —'); });
  let fsT; new MutationObserver(() => { clearTimeout(fsT); fsT = setTimeout(fixSel, 120); }).observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener('click', e => { if (!(e.target.closest && e.target.closest('.sjx-dd'))) document.querySelectorAll('details.sjx-dd[open]').forEach(d => d.open = false); });
  const fire = attrs => { const b = document.createElement('button'); b.hidden = true; Object.entries(attrs).forEach(([k, v]) => b.setAttribute('data-' + k, v)); document.body.appendChild(b); b.click(); b.remove(); };
  let sumT; const sumSoon = X => { clearTimeout(sumT); sumT = setTimeout(() => { try { X.sum(); railRefresh(); } catch (e) { console.warn('sum', e); } }, 1500); };

  /* ---------- 계획정비 ---------- */
  const PMS = {
    ok: () => typeof pmsApplyObj === 'function' && typeof SJ !== 'undefined' && typeof ACT !== 'undefined' && typeof shipStats === 'function',
    hook() {
      try { FOLDER_ASKED = true; } catch (e) { } try { folderGate = function () { }; } catch (e) { } try { SPF.lim = 1e6; } catch (e) { }
      try { const sm = setupMissing9; setupMissing9 = () => sm().filter(x => !['fs', 'pc', 'vessel'].includes(x[0])); } catch (e) { }
      try { pmsFolderCard = () => appCard('sj-card'); } catch (e) { }
      if (BG) { try { persist = function () { }; } catch (e) { } try { const k0 = KV.set; KV.set = function (k) { return /^(ship|office)$/.test(k) ? Promise.resolve() : k0.apply(this, arguments); }; } catch (e) { } }   /* 요약만 만드는 보이지 않는 창: 저장하지 않음 */
      /* 저장할 때마다 알림에 [↶ 되돌리기] (위쪽 실행 취소 단추 대신) */
      try { const c0 = commit; let lc = 0, lu = 0; ['pointerdown', 'keydown'].forEach(ev => document.addEventListener(ev, () => lu = Date.now(), true)); commit = function () { const r = c0.apply(this, arguments); if (Date.now() - lu < 4000) lc = Date.now(); setTimeout(() => { if (Date.now() - lc < 1500 && !document.querySelector('#toasts .toast')) toast(T('저장했습니다', 'Saved'), true); }, 120); return r; };
        toast = function (msg, withUndo) { const box = document.getElementById('toasts'); if (!box) return; if (withUndo && !lu) return; box.innerHTML = ''; const u = (withUndo || Date.now() - lc < 1500) && Date.now() - lu < 6000; const t = document.createElement('div'); t.className = 'toast';
          t.innerHTML = `<span>${U.esc(msg)}</span>` + (u ? `<button>↶ ${T('되돌리기', 'Undo')}</button>` : '') + `<button class="tx" title="${T('닫기', 'Close')}">✕</button>`;
          if (u) t.querySelector('button').onclick = () => { try { undo(); } catch (e) { } t.remove(); }; t.querySelector('.tx').onclick = () => t.remove(); box.appendChild(t); setTimeout(() => t.remove(), u ? 6000 : 3000); }; } catch (e) { }
      try { vesBar = () => ''; } catch (e) { }
      try { const t0 = pmsTabs; pmsTabs = () => t0().filter(k => k !== 'fleet' && k !== 'settings'); } catch (e) { }
      /* 복구: 예전 '전체 초기화'로 막힌 기본 선박 자료(SUNNY QUEEN·KTS WHITE)와 서버 자료를 다시 받음 */
      let fix = false;
      try { if (OFFICE.wiped) { OFFICE.wiped = false; fix = true; if (typeof ensureVessels === 'function') ensureVessels(); KV.set('office', OFFICE); } } catch (e) { }
      try { if (SY.adopt === '9999') { SY.adopt = ''; fix = true; } } catch (e) { }
      if (fix || localStorage.getItem('sejul_restore_pms')) { ['sejul_cloud_pms_seen', 'sejul_cloud_pms_pushed', 'sejul_restore_pms'].forEach(k => localStorage.removeItem(k)); C.restoring = true; }
    },
    /* 가져오기·내보내기 버튼을 한 곳으로 묶기 (인벤토리·결함·검교정·작업 목록) */
    group() { const main = document.getElementById('main'); if (!main) return;
      const G = [['imp', '📥 ' + T('가져오기', 'Import'), ['spImport', 'impaImport', 'importCompany', 'ckImport', 'calImport', 'importMaster', 'eqImport', 'sfiImport'], T('엑셀·목록 파일에서 불러오기', 'Load from Excel / list files')],
                 ['exp', '📤 ' + T('내보내기', 'Export'), ['invErpXlsx', 'defXlsx', 'calXlsx'], T('ERP 업로드·보고용 엑셀', 'Excel for ERP upload / reports')],
                 ['prt', '🖨 ' + T('출력', 'Print'), ['prt9', 'sfiPrint'], T('인쇄 · PDF로 저장', 'Print / save as PDF'), 2]];
      for (const [k, label, acts, hint, min] of G) { const bs = acts.map(a => main.querySelector(`[data-act="${a}"]`)).filter(b => b && !b.closest('.sjx-dd'));
        if (bs.length < (min || 1)) continue; if (k === 'prt') { const lb = { prt9: '📋 ' + T('작업 목록 출력', 'Print job list'), sfiPrint: '🌳 ' + T('SFI 트리 출력', 'Print SFI tree') }; bs.forEach(b => { if (lb[b.dataset.act]) b.innerHTML = lb[b.dataset.act]; b.classList.remove('pri'); }); } const d = document.createElement('details'); d.className = 'sjx-dd'; d.dataset.k = k;
        d.innerHTML = `<summary class="${bs[0].className.replace(/\b(pri|danger|g)\b/g, '')}">${label} ▾</summary><div class="sjx-ddm"><span class="sjx-ddh">${hint}</span></div>`;
        bs[0].parentNode.insertBefore(d, bs[0]); const m = d.querySelector('.sjx-ddm'); bs.forEach(b => m.appendChild(b)); }
      document.querySelectorAll('details.sjx-dd[open]').forEach(d => { if (!d.matches(':hover')) d.open = false; }); },
    /* 위험성 관리와 같은 화면 짜임: 제목줄(오른쪽에 동작) → 필터 카드 → 목록 */
    layout() { const main = document.getElementById('main'); if (!main || main.querySelector(':scope>.sjx-mark')) return;   /* 다시 그려지면 표시가 사라짐 → 다시 정리 */
      main.querySelectorAll('.banner').forEach(b => { if (/회신 파일|공유 폴더|reply file|shared folder/i.test(b.textContent)) b.remove(); });
      const h1 = [...main.children].find(e => e.tagName === 'H1'); if (h1 && !h1.closest('.sjx-ph')) { const ph = document.createElement('div'); ph.className = 'sjx-ph'; h1.parentNode.insertBefore(ph, h1); ph.appendChild(h1); const act = document.createElement('div'); act.className = 'sjx-act'; ph.appendChild(act);
        const pr = main.querySelector('[data-act=prt9]'), prd = pr && pr.closest('.sjx-dd'); if (prd) act.appendChild(prd); else if (pr && h1.contains(pr)) { pr.innerHTML = '🖨 ' + T('출력', 'Print'); act.appendChild(pr); }
        ['defNew', 'spNew', 'eqAdd', 'calAdd', 'clsNew'].forEach(a => { const b = main.querySelector(`.toolbar [data-act="${a}"]`); if (b) { b.classList.add('pri'); act.appendChild(b); } }); }
      const FC = ['sfibar', 'toolbar', 'chips', 'tabs9', 'caltabs', 'dfsub']; let run = [];
      const flush = () => { if (run.length) { const fc = document.createElement('div'); fc.className = 'sjx-fc'; run[0].parentNode.insertBefore(fc, run[0]); run.forEach(e => fc.appendChild(e)); } run = []; };
      [...main.children].forEach(e => { const ok = FC.some(c => e.classList && e.classList.contains(c)) && !e.closest('.sjx-fc') && e.querySelector('button,input,select'); if (ok) run.push(e); else flush(); }); flush();
      /* 줄마다 이름 (위험성 평가 목록과 같게) + 상태 줄은 이어 붙인 선택 버튼 */
      const r = route(), lab = e => { const c = e.classList; if (c.contains('toolbar')) return e.querySelector('input') ? '🔎 ' + T('검색', 'Search') : T('작업', 'Actions'); if (c.contains('sfibar')) return T('SFI 분류', 'SFI group');
          if (c.contains('dfsub')) return T('진행 단계', 'Step'); if (c.contains('tabs9') || c.contains('caltabs')) return T('보기', 'View'); if (c.contains('chips')) return r === 'spares' ? T('구분', 'Category') : T('상태', 'Status'); return T('필터', 'Filter'); };
      const DOT = { od: '#E57373', d7: '#E3C26B', d30: '#C9B26B', nd: '#B8C0CC', ok: '#8BC34A', all: '#B8C0CC', def: '#E57373', low: '#E57373', crit: '#E8A400' };
      main.querySelectorAll('.sjx-fc').forEach(fc => [...fc.children].forEach(e => { if (e.classList.contains('sjx-row')) return; const w = document.createElement('div'); w.className = 'sjx-row'; w.innerHTML = `<span class="sjx-lb">${lab(e)}</span><div class="sjx-rc"></div>`; fc.insertBefore(w, e); w.lastChild.appendChild(e);
        if ((e.classList.contains('chips') || e.classList.contains('tabs9') || e.classList.contains('caltabs')) && e.querySelectorAll('button').length <= 8 && !e.classList.contains('dfsub')) { e.classList.add('sjx-seg'); e.querySelectorAll('button').forEach(b => { b.classList.add('chip'); const k = Object.values(b.dataset).join(' '); const m = Object.keys(DOT).find(x => new RegExp('\\b' + x + '\\b').test(k)); if (m) b.style.setProperty('--dot', DOT[m]); }); } }));
      /* 목록 위 'N건' */
      const fc = main.querySelector('.sjx-fc'), tw = fc && fc.nextElementSibling; if (tw && tw.classList && tw.classList.contains('tw') && !main.querySelector('.sjx-cnt')) { let n = [...tw.querySelectorAll('tbody tr')].filter(t => !t.classList.contains('pgrp') && !t.hidden && t.querySelectorAll('td').length >= 3).length; const ac = fc.querySelector('.sjx-seg .chip.on, .sjx-seg .chip.active, .sjx-seg [aria-pressed="true"]'); const an = ac && (ac.textContent.match(/(\d[\d,]*)\s*$/) || [])[1]; if (n && an && +an.replace(/,/g, '') > n) n = +an.replace(/,/g, ''); if (n) tw.insertAdjacentHTML('beforebegin', `<div class="sjx-cnt">${n.toLocaleString()}${T('건', ' items')}</div>`); }
      if (!main.querySelector('.sjx-pcnote')) { const ph2 = main.querySelector('.sjx-ph'); if (ph2 && ['ck', 'cal', 'cls', 'spares', 'defects', 'jobs', 'due'].includes(route())) ph2.insertAdjacentHTML('afterend', `<div class="sjx-pcnote">📱 ${T('휴대폰 화면은 입력 위주로 간단히 보입니다 — 출력·엑셀·품목/장비 등록은 PC·노트북에서 하세요.', 'Phone view is simplified for data entry — printing, Excel and registration are on PC.')}</div>`); }
      main.dataset.sjx = route(); const mk = document.createElement('i'); mk.className = 'sjx-mark'; mk.hidden = true; main.appendChild(mk); },
    after() { setTimeout(() => { try { PMS.group(); } catch (e) { } }, 0);   /* 늦게 붙는 출력 버튼도 '출력 ▾'로 묶기 */
      try { if (MODE === 'admin' && OFFICE.wiped) { OFFICE.wiped = false; if (typeof ensureVessels === 'function') ensureVessels(); KV.set('office', OFFICE); ['sejul_cloud_pms_seen', 'sejul_cloud_pms_pushed'].forEach(k => localStorage.removeItem(k)); setTimeout(() => { try { if (window.SJCLOUD && SJCLOUD.A) SJCLOUD.sync(SJCLOUD.A, true); } catch (e) { } }, 1500); setTimeout(() => { try { render(); } catch (e) { } }, 0); } } catch (e) { }
      try { const main = document.getElementById('main'); if (main) { main.querySelectorAll('select').forEach(sl => { const e = [...sl.options].filter(o => o.value === ''); if (e.length > 1) { const sel = sl.value === ''; e.slice(1).forEach(o => o.remove()); if (sel) sl.selectedIndex = [...sl.options].indexOf(e[0]); } });   /* 이름 없는 빈 선택 항목 정리 */ } } catch (e) { } try { PMS.group(); } catch (e) { } try { PMS.layout(); } catch (e) { console.warn('layout', e); } try { PMS.home(); } catch (e) { console.warn('home', e); } if (MODE !== 'admin') return; const main = document.getElementById('main'); if (!main) return; const view = C.get('view') || '';
      if (!view || route() === 'fleet') { const S = (U.sum('pms') || {}).ships || {};
        main.innerHTML = `<div class="sjx-empty"><h2>${T('선박을 고르세요', 'Choose a vessel')}</h2>${T('사무실 기기는 선박을 하나 골라 그 선박의 계획정비를 봅니다 (왼쪽 위 [보는 선박]으로도 바꿉니다). 선대 전체 현황은 <a href="../index.html">앱 홈</a>에 있습니다.', 'Pick one vessel (or use Viewing at top left). The fleet overview is on the <a href="../index.html">app home</a>.')}<div class="sjx-pick">${U.VES.map(v => `<button data-sjpick="${U.esc(v)}"><b>${U.esc(v)}</b><small>${OFFICE.ships[v] ? (S[v] ? T(`기한 초과 ${S[v].od} · 미결 결함 ${S[v].def}`, `Overdue ${S[v].od} · defects ${S[v].def}`) : T('자료 있음', 'Has data')) : T('아직 받은 자료 없음', 'No data yet')}</small></button>`).join('')}</div></div>`; return; }
      if (!OFFICE.ships[view] && typeof newDB === 'function') { try { const nd = newDB(view); if (nd.master) nd.master.adminHash = OFFICE.adminHash; OFFICE.ships[view] = nd; OFFICE.sel = view; setTimeout(() => { try { render(); } catch (e) { } }, 0); } catch (e) { main.innerHTML = noData(view, T('계획정비', 'Maintenance')); } } },
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
    /* 계획정비 홈 — 앱 공통 홈 틀 (머리말 · 오늘 할 일 · 숫자 카드 · 처리할 일 · 빠른 작업 · 접어 둔 도구별 칸) */
    home() { if (route() !== 'home') return; const main = document.getElementById('main'); if (!main || main.querySelector(':scope>.sjh')) return;
      const off = MODE === 'admin', db = off ? OFFICE.ships[C.get('view') || OFFICE.sel] : SHIP; if (!db) return;
      try { PMS.sum(); } catch (e) { } const v = db.ship.name, sp = U.sum('pms'), s = sp && sp.ships && sp.ships[v], H = U.H, c = shipStats(db).c;
      const d = k => ({ d: { v9due: k } }), hh = k => ({ d: { sjgo: k } });
      const items = U.items(v, '../').filter(x => x.k !== 'r');
      const quick = H.quick(off ? [{ d: { sjgo: 'defects' }, bg: '#FDECEC', fg: '#C62828', ic: 'M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z', t: T('결함 확인·서명', 'Review defects'), sub: T('선박이 보낸 결함 보고', 'Defect reports from the ship') },
        { d: { sjgo: 'spares' }, bg: '#E8F5EE', fg: '#2E7D32', ic: 'M3 7h18M6 7v13h12V7M9 11h6', t: T('청구서 처리', 'Requisitions'), sub: T('접수 · 발주 · 취소', 'Ack · order · cancel') },
        { d: { act: 'monthlyReport' }, bg: '#EEF3FB', fg: '#1B2F5B', ic: 'M7 3h7l5 5v13H7zM14 3v5h5', t: T('월간 이행 보고서', 'Monthly report'), sub: T('출력', 'Print') }]
        : [{ d: { v9due: 'od' }, bg: '#EEF3FB', fg: '#1B2F5B', ic: 'M20 6 9 17l-5-5', t: T('작업 실시 입력', 'Record a job'), sub: T('기한 초과부터', 'Overdue first') },
        { d: { act: 'defNew' }, bg: '#FDECEC', fg: '#C62828', ic: 'M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z', t: T('결함 등록', 'Report a defect'), sub: T('결함 보고서 STEP 1~7', 'Defect report steps 1–7') },
        { d: { sjgo: 'ck' }, bg: '#FFF4D6', fg: '#8A5A00', ic: 'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11', t: T('점검표 입력', 'Checklists'), sub: T('회사 서식 9종', 'Company forms') },
        { d: { act: 'reqNew' }, bg: '#E8F5EE', fg: '#2E7D32', ic: 'M3 7h18M6 7v13h12V7M9 11h6', t: T('청구서 작성', 'New requisition'), sub: T('예비품 · 선용품', 'Spares · stores') },
        { d: { act: 'monthlyReport' }, bg: '#F1F3F7', fg: '#475467', ic: 'M7 3h7l5 5v13H7zM14 3v5h5', t: T('월간 이행 보고서', 'Monthly report'), sub: T('출력', 'Print') }]);
      const keep = { sfi: [...main.querySelectorAll('.sech,.sfitiles')], grp: [...main.querySelectorAll('.homeg')] };
      const w = document.createElement('div'); w.className = 'sjh';
      w.innerHTML = H.page({ kicker: U.esc(v) + ' · ' + new Date().toLocaleDateString(T('ko-KR', 'en-GB'), { month: 'long', day: 'numeric', weekday: 'short' }), title: T('계획정비', 'Planned maintenance'), actions: off ? '' : H.btn('＋ ' + T('결함 등록', 'Report defect'), { d: { act: 'defNew' } }) + ' ' + H.btn(T('📝 실시 입력', '📝 Record job'), d('od'), true) })
        + U.pmsHero(s, v, d, off) + U.pmsKpis(s, d, hh)
        + H.cols(H.card(T('처리할 일', 'To do') + ` <small>${T('결함 · 청구 · 선급 검사 · 재고', 'defects · requisitions · class · stock')}</small>`, H.rows(items)), H.card(T('빠른 작업', 'Quick actions'), quick))
        + (keep.sfi.length ? H.extra('🗂 ' + T('SFI 분류 바로가기', 'SFI shortcuts'), '', 'sjhSfi') : '') + (keep.grp.length ? H.extra('🔔 ' + T('담당자별 작업 알림 · 최근 기록 · 미결 결함', 'By rank · recent · open defects'), '', 'sjhGrp') : '')
        + H.foot(`${T('기준일', 'As of')} ${today()} · ${T('작업', 'Jobs')} ${c.n} · ${T('마스터', 'Master')} v${(db.master && db.master.version) || 0}`);
      const put = (id, nodes) => { const x = w.querySelector('#' + id + ' .in'); if (x) nodes.forEach(n => x.appendChild(n)); };
      put('sjhSfi', keep.sfi.filter(n => !n.classList.contains('sech'))); put('sjhGrp', keep.grp);
      try { const k = 'sejul_home_open', o = JSON.parse(localStorage.getItem(k) || '{}'); w.querySelectorAll('details.sjh-x').forEach(dt => { if (o[dt.id]) dt.open = true; dt.addEventListener('toggle', () => { o[dt.id] = dt.open; localStorage.setItem(k, JSON.stringify(o)); }); }); } catch (e) { }
      main.innerHTML = ''; main.appendChild(w); },
    /* 계획정비 홈 맨 위: 오늘 할 일 한 줄 + 바로 실시 입력 */
    hero() { if (route() !== 'home') return; const main = document.getElementById('main'); if (!main || main.querySelector('.sjx-hero')) return;
      const db = MODE === 'admin' ? OFFICE.ships[C.get('view') || ''] : SHIP; if (!db) return; const c = shipStats(db).c, n = (c.od || 0) + (c.d7 || 0); if (!c.n) { const h = document.createElement('div'); h.className = 'sjx-hero ok'; h.style.borderLeftColor = '#B8C0CC'; h.innerHTML = `<div class="tx"><small>${T('오늘 할 일', 'Today')} · ${U.esc(db.ship && db.ship.name || '')}</small><b>${T('아직 등록된 작업이 없습니다', 'No jobs registered yet')}</b><span>${T('선박 기기가 승인되면 선박의 계획정비 자료가 자동으로 들어옵니다.', 'Vessel data arrives automatically once a ship device is approved.')}</span></div>`; const h1 = main.querySelector('h1'), ph = (h1 && (h1.closest('.sjx-ph') || h1)) || main.firstElementChild; if (ph) ph.insertAdjacentElement('afterend', h); return; }
      const h = document.createElement('div'); h.className = 'sjx-hero' + (n ? '' : ' ok');
      h.innerHTML = `<div class="tx"><small>${T('오늘 할 일', 'Today')} · ${U.esc(db.ship && db.ship.name || '')}</small><b>${n ? `${T('기한 초과', 'Overdue')} <em class="r">${c.od}</em> · ${T('7일 이내', '≤ 7 days')} <em class="y">${c.d7}</em>` : '✅ ' + T('급한 작업이 없습니다', 'Nothing urgent')}</b><span>${n ? T('작업을 누르고 실시 기록을 입력하면 목록에서 빠집니다.', 'Open a job and record it to clear it.') : T('30일 이내 작업과 기록 없는 작업은 작업 목록에서 봅니다.', 'See upcoming jobs in the job list.')}</span></div>
        <button class="btn pri big" data-v9due="${n ? 'od' : 'd30'}">${n ? T('바로 실시 입력 →', 'Record now →') : T('작업 목록 보기 →', 'Job list →')}</button>`;
      const h1 = main.querySelector('h1'), ph = (h1 && (h1.closest('.sjx-ph') || h1)) || main.firstElementChild; if (ph) ph.insertAdjacentElement('afterend', h); else main.prepend(h); },
    sum() { const ships = MODE === 'admin' ? OFFICE.ships : (SHIP ? { [SHIP.ship.name]: SHIP } : {}), out = {};
      for (const [n, db] of Object.entries(ships)) { try { const { c } = shipStats(db), td = typeof opsTodo === 'function' ? opsTodo(db) : { O: [], S: [] };
        out[n] = { od: c.od, d7: c.d7, d30: c.d30, nd: c.nd, cri: c.cri, def: c.def, defA: c.defA, low: c.low, n: c.n, E: c.E, S: td.S.slice(0, 15), O: td.O.slice(0, 15),
          D: td.O.filter(x => x[0] === 'def').slice(0, 30).map(x => [x[1], x[2], x[3]]),
          R: (typeof RQS === 'function' ? RQS(db) : []).filter(r => r.st === 'sent').slice(0, 30).map(r => [r.id, r.no + (r.kind === 'rep' ? ' (수리 repair)' : '') + ' · ' + (r.items || []).length + '건', r.urg === 'u' ? 'u' : 'n']),
          /* 작업 연기: P = 승인 대기(사무실 알림) / Q = 최근 30일 결정(선박 알림) */
          P: (db.ppr || []).filter(r => r.st === 'req').slice(0, 30).map(r => [r.id, r.no + ' ' + String(r.desc || '').slice(0, 50) + ' → ' + r.due + (r.cri ? ' (CRI)' : '')]),
          Q: (db.ppr || []).filter(r => (r.st === 'ok' || r.st === 'rej') && Date.now() - (r.upd || 0) < 30 * 864e5).slice(-30).map(r => [r.id, r.no + ' ' + String(r.desc || '').slice(0, 50) + (r.st === 'ok' ? ' → ' + (r.dDue || r.due) : ' — ' + String(r.dNote || '').slice(0, 60)), r.st]) }; } catch (e) { } }
      localStorage.setItem('sejul_sum_pms', JSON.stringify({ at: Date.now(), mode: MODE, ships: out }));
      /* 앱 전체 검색용 목록 (장비 · 작업 · 결함 · 품목) */
      try { const ix = {}; for (const [n, db] of Object.entries(ships)) { const cut = x => String(x || '').slice(0, 70);
          ix[n] = { e: eqList(db).map(e => [e.id, cut(e.name), e.sfi, cut(e.maker)]), j: db.master.jobs.map(j => [j.code, cut(j.desc), j.eq, j.pid || '']),
            d: (typeof DFS === 'function' ? DFS(db) : []).map(d => [d.id, d.no || '', cut(d.title), d.st === 'closed' ? 1 : 0]), s: spItems(db).map(i => [i.id, cut(i.name), cut(i.pno), i.impa || '']),
            r: (typeof RQS === 'function' ? RQS(db) : []).filter(r => !(MODE === 'admin' && r.st === 'draft')).map(r => [r.id, r.no || '', (r.items || []).slice(0, 3).map(x => cut(x.name)).join(', '), r.st]) }; }
        const js = JSON.stringify({ at: Date.now(), v: ix }); if (localStorage.getItem('sejul_idx_pms_h') !== String(js.length)) { localStorage.setItem('sejul_idx_pms', js); localStorage.setItem('sejul_idx_pms_h', String(js.length)); } } catch (e) { console.warn('idx', e); } },
    hookRender() { const r0 = render; render = function () { try { const v = C.get('view') || ''; if (MODE === 'admin' && v && OFFICE.ships[v] && OFFICE.sel !== v) OFFICE.sel = v; } catch (e) { }   /* 사무실: 항상 왼쪽 메뉴에서 고른 선박 */
      const x = r0.apply(this, arguments); try { PMS.after(); } catch (e) { } navDeco(); sumSoon(PMS); return x; };
      /* 저장·동기화 때 상단 줄만 다시 그려도(renderTop) 새 탭 모양 유지 — 예전 모양으로 깜빡이지 않게 */
      try { if (typeof renderTop === 'function' && !renderTop.sjx) { const t0 = renderTop; renderTop = function () { const y = t0.apply(this, arguments); navDeco(); sumSoon(PMS); return y; }; renderTop.sjx = 1; } } catch (e) { } }
  };
  /* ---------- 위험성 관리 ---------- */
  const RSK = {
    /* 위험성 관리 홈 — 앱 공통 홈 틀 */
    home() { const H = U.H, off = DB.settings.site === 'office', vn = off ? (C.get('view') || '') : (typeof vesselName === 'function' ? vesselName() : '');
      const cnt = (arr, fn, k) => (arr || []).filter(x => { try { return fn(x)[0] === k; } catch (e) { return false; } }).length;
      const mocw = (DB.mocs || []).filter(m => { try { return mocStatus(m)[0] === 'wait' && m.cls !== 'emg'; } catch (e) { return false; } }).length;
      const r = { draft: cnt(DB.ras, raStatus, 'draft'), wait: cnt(DB.ras, raStatus, 'wait') + mocw, stop: cnt(DB.ras, raStatus, 'stop'), act: cnt(DB.ptws, ptwStatus, 'act'), moc: (DB.mocs || []).filter(m => !(m.close && m.close.apvDate)).length };
      const cont = typeof contList === 'function' ? contList() : [], k = v => ({ d: { a: 'kpiGo', v } });
      const hero = r.stop ? { tone: 'r', title: `${T('작업 중지', 'Stopped')} <em class="r">${r.stop}</em>${T('건 — 대책 보완 필요', ' — revise controls')}`, sub: T('잔여 위험 "불가" 평가가 있습니다. 대책을 보완하고 다시 평가하세요.', 'Residual risk is unacceptable — revise and re-assess.'), btn: Object.assign({ label: T('확인하기 →', 'Review →') }, k('raList:stop')) }
        : off && r.wait ? { tone: 'y', title: `${T('회사 승인 대기', 'Awaiting approval')} <em class="y">${r.wait}</em>${T('건', '')}`, sub: T('선박이 보낸 위험성 평가·MoC 승인 요청입니다.', 'Approval requests from the ship.'), btn: { label: T('검토·결정 →', 'Review →'), d: { a: 'go', v: 'dpa' } } }
        : cont.length ? { tone: 'b', title: `${T('진행 중인 작업', 'Work in progress')} <em>${cont.length}</em>${T('건', '')}`, sub: cont.slice(0, 2).map(([x]) => (x.no ? x.no + ' ' : '') + (x.title || '')).map(U.esc).join(' · '), btn: { label: T('이어서 하기 →', 'Continue →'), d: { a: 'contOpen' } } }
        : r.wait ? { tone: 'y', title: `${T('DPA·회사 승인 대기', 'Awaiting approval')} <em class="y">${r.wait}</em>${T('건', '')}`, sub: T('승인되면 알림이 옵니다.', 'You will be notified when approved.'), btn: Object.assign({ label: T('보기 →', 'View →') }, k('raList:wait')) }
        : off ? { tone: 'g', title: '✅ ' + T('승인 대기 중인 요청이 없습니다', 'No pending approvals'), sub: '' }
        : { tone: 'g', title: '✅ ' + T('진행 중인 작업이 없습니다', 'No work in progress'), sub: T('작업 전에 위험성 평가 → TBM → 작업허가(PTW) 순서로 진행합니다.', 'Before work: RA → TBM → PTW.'), btn: { label: T('새 작업 시작 →', 'Start work →'), d: { a: 'newRA' } } };
      hero.kicker = T('오늘 할 일', 'Today') + (vn ? ' · ' + U.esc(vn) : '');
      let al = []; try { al = alerts(); } catch (e) { }
      const rows = al.filter(x => x.l !== 'ok').map(x => { const [a, ...b] = String(x.m).split(' — '); return { bar: x.l === 'err' ? 'r' : x.l === 'warn' ? 'y' : '', t: a, sub: b.join(' — '), act: x.a ? T('열기', 'Open') : '', d: x.a ? Object.assign({ a: x.a }, x.d || {}) : null }; });
      const kindL = { ra: T('위험성 평가', 'RA'), ptw: 'PTW', moc: 'MoC', rir: T('식별 보고', 'Risk ID') };
      const rec = [...(DB.ras || []).map(x => ['ra', x, x.title, raStatus]), ...(DB.ptws || []).map(x => ['ptw', x, typeof ptwDesc === 'function' ? ptwDesc(x) : x.desc, ptwStatus]), ...(DB.mocs || []).map(x => ['moc', x, x.title, mocStatus]), ...(DB.rirs || []).map(x => ['rir', x, x.desc, null])].sort((a, b) => (b[1].updatedAt || 0) - (a[1].updatedAt || 0)).slice(0, 6)
        .map(([kk, x, tt, fn]) => { let st = ''; try { st = fn ? fn(x)[1] : ''; } catch (e) { } return { t: `${kindL[kk]} ${x.no || ''} ${tt || ''}`, sub: [st, x.updatedAt ? new Date(x.updatedAt).toLocaleDateString() : ''].filter(Boolean).join(' · '), act: T('열기', 'Open'), d: { a: 'open', k: kk, id: x.id } }; });
      const quick = H.quick((off ? [] : [{ d: { a: 'newRA' }, bg: '#EEF3FB', fg: '#1B2F5B', ic: 'M12 5v14M5 12h14', t: T('새 작업 시작 (위험성 평가)', 'Start work (RA)'), sub: T('작업 선택 → RA → TBM → PTW → 출력', 'RA → TBM → PTW → print') },
        { d: { a: 'contOpen' }, bg: '#E8F5EE', fg: '#2E7D32', ic: 'M5 3l14 9-14 9z', t: T('진행 중 작업 이어서 하기', 'Continue work') + (cont.length ? ` (${cont.length})` : ''), sub: T('작성 중인 RA·PTW', 'Drafts and active permits') }])
        .concat([{ d: { a: 'newMoC' }, bg: '#F1ECFA', fg: '#5B3FA0', ic: 'M4 4v6h6M20 20v-6h-6M20 9A8 8 0 0 0 5.6 5.6L4 10M4 15a8 8 0 0 0 14.4 3.4L20 14', t: T('변화관리(MoC) 제안', 'Management of Change'), sub: T('변화평가표 · 점검표 · 긴급 MoC', 'Change form · checklist') },
          { d: { a: 'newRIR' }, bg: '#FFF4D6', fg: '#8A5A00', ic: 'M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z', t: T('위험성 식별 보고', 'Risk identification report'), sub: T('새 위험 발견 시 선장 보고', 'Report a new hazard') },
          { d: { a: 'blankForms' }, bg: '#F1F3F7', fg: '#475467', ic: 'M6 9V3h12v6M6 18H4v-6h16v6h-2M8 14h8v7H8z', t: T('빈 양식 출력', 'Blank forms'), sub: T('F-RSK 6종 · F-SAF 7종', 'F-RSK ×6 · F-SAF ×7') }]));
      let band = '', crewX = ''; try { if (!off) { const nC = (DB.settings.crew || []).length; if (nC) crewX = H.extra('👥 ' + T(`승무원 명단 (Crew List) · ${nC}명`, `Crew list · ${nC}`), crewCardHTML(), 'sjhCrew'); else band = crewCardHTML(); } } catch (e) { }
      return `<div class="sjh">${H.page({ kicker: (vn ? U.esc(vn) + ' · ' : '') + (typeof today === 'function' ? today() : ''), title: off ? T('위험성 관리 · 회사 승인', 'Risk · approvals') : T('위험성 관리', 'Risk management'), actions: off ? H.btn(T('DPA·회사 승인 →', 'Approvals →'), { d: { a: 'go', v: 'dpa' } }, true) : H.btn('＋ ' + T('새 작업 시작', 'Start work'), { d: { a: 'newRA' } }, true) })}
        ${band ? `<div class="sjh-crew">${band}</div>` : ''}${H.hero(hero)}${U.rskKpis(r, k)}
        ${H.cols(H.card(T('확인 필요 항목', 'Action items'), H.rows(rows, { empty: '✅ ' + T('확인 필요 항목이 없습니다.', 'No action items.') })), H.card(T('빠른 작업', 'Quick actions'), quick))}
        ${crewX}${H.card(T('최근 작업', 'Recent'), H.rows(rec, { empty: T('아직 작성한 문서가 없습니다.', 'No documents yet.') }))}
        ${H.foot('RSK-P-01 R-0 · ' + (typeof APP_VER !== 'undefined' ? APP_VER : ''))}</div>`; },

    ok: () => typeof fsMerge === 'function' && typeof DB !== 'undefined' && typeof V !== 'undefined' && typeof A !== 'undefined' && typeof raStatus === 'function',
    hook() {
      try { const sm = setupMissing; setupMissing = () => sm().filter(x => !['fs', 'pc', 'vessel'].includes(x[0])); } catch (e) { }
      if (localStorage.getItem('sejul_restore_rsk')) { ['sejul_cloud_rsk_seen', 'sejul_cloud_rsk_pushed', 'sejul_restore_rsk'].forEach(k => localStorage.removeItem(k)); C.restoring = true; }
      try { fsCard = () => appCard('card') + '<div>'; pcNameHTML = () => ''; } catch (e) { }
      try { const h0 = V.home; V.home = () => h0().replace(/<div class="al (?:warn|err)" style="margin-bottom:14px"><span class="ic">(?:🔓|💾)[\s\S]*?<\/div>/, ''); } catch (e) { }
      try { const h1 = V.home; V.home = () => { try { return RSK.home(); } catch (e) { console.warn('rsk home', e); return h1(); } }; } catch (e) { }
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
    /* 승인: 전화·카톡·승인 코드 대신 서버로 (선박 요청 → 사무실 결정 → 선박 반영) */
    approvals() {
      const T2 = T, phone = () => { const s = DB.settings; return s.dpaPhone ? ` <span class="sub">(${T2('급하면 DPA에게 전화', 'urgent: call the DPA')} ☎ ${U.esc(s.dpaPhone)})</span>` : ''; };
      /* 선박 — 위험성 평가 ③ DPA 단계 */
      A.sjApprove = d => { const ra = (DB.ras || []).find(x => x.id === d.id); if (ra) return A.dpaFromRA({ id: ra.id });
        const m = (DB.mocs || []).find(x => x.id === d.id); if (!m) return toast(T2('항목을 찾지 못했습니다 — 동기화 후 다시', 'Not found — try after sync'));
        const q = dqAdd({ kind: 'moc', raNo: m.no, rq: mocRq(m), vessel: m.vessel, task: m.title, mocId: m.id, reason: T2('변화관리 회사 승인', 'MoC company approval') }); save(); go({ name: 'dpa' }); A.dqOpen({ id: q.id }); };
      A.sjMocReq = d => { const m = (DB.mocs || []).find(x => x.id === d.id); if (!m) return; m.reports = m.reports || []; m.reports.push({ at: nowLocal(), kind: 'request', to: T2('회사 서버', 'company server'), file: '' }); touch(m); save(); render(); toast(T2('회사에 승인 요청을 보냈습니다 — 결정되면 알림이 옵니다', 'Sent to the office — you will be notified')); };
      try { const mc0 = mocApvCard; mocApvCard = function (m, closed) { const a = m.apv, dec = a.dec || (a.date ? 'ok' : ''), h = mc0(m, closed); if (dec && dec !== 'reject') return h;
          const i = h.indexOf('<div class="stepbox"'), head = i > 0 ? h.slice(0, i) : (dec ? h : ''), sent = (m.reports || []).some(r => r.kind === 'request');
          return head + `<div class="sjx-srv">📡 <b>${sent ? T2('회사 승인 요청됨 — 서버로 전달', 'Approval requested via the server') : T2('회사 승인 요청', 'Ask the office for approval')}</b><br>${sent ? T2('사무실이 앱에서 결정하면 이 화면에 자동으로 반영되고 알림이 옵니다.', 'The office decision appears here automatically, with a notification.') : T2('변화평가표를 마쳤으면 아래 버튼을 누르세요. 회사(사무실 앱)에 바로 전달됩니다.', 'When the form is complete, press the button — it goes straight to the office app.')}${phone()}<br><button class="btn g big" data-a="sjMocReq" data-id="${m.id}" ${closed ? 'disabled' : ''}>📡 ${sent ? T2('다시 요청', 'Request again') : T2('회사에 승인 요청', 'Request approval')}</button></div>`; }; } catch (e) { }
      /* 사무실 — [DPA·회사 승인] 화면: 서버로 받은 요청 목록 */
      try { V.dpa = () => { const ras = (DB.ras || []).filter(r => { try { return raStatus(r)[0] === 'wait'; } catch (e) { return false; } }), mocs = (DB.mocs || []).filter(m => { try { return m.cls !== 'emg' && mocStatus(m)[0] === 'wait'; } catch (e) { return false; } });
          const done = (DB.dpaq || []).filter(x => x.dec).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)).slice(0, 20);
          const row = (k, x) => `<tr><td><b>${U.esc(x.vessel || '')}</b></td><td>${k === 'moc' ? '🔄 MoC' : '📋 RA'} ${U.esc(x.no || '')}</td><td>${U.esc((x.title || '').split(' / ')[0])}</td><td>${k === 'ra' ? (gb ? gb(raMaxR(x)) : '') : ''}</td><td style="text-align:right"><button class="btn g" data-a="sjApprove" data-id="${x.id}">✍️ ${T2('검토·결정', 'Review & decide')}</button></td></tr>`;
          return `<div class="page-h"><h2>${bi('DPA·회사 승인', 'Approvals')}</h2></div>
            <div class="card"><h3>📥 ${T2('승인 요청', 'Requests')} <span class="sub">${T2('선박이 보낸 요청이 서버로 자동으로 들어옵니다 — 결정하면 선박 화면에 바로 반영되고 선박에 알림이 갑니다', 'Requests arrive via the server; decisions reach the ship automatically')}</span></h3>
            ${ras.length + mocs.length ? `<div class="tw"><table class="t"><tr><th>${T2('선박', 'Vessel')}</th><th>${T2('구분·번호', 'Type / No.')}</th><th>${T2('작업·제목', 'Task / title')}</th><th>${T2('잔여 위험', 'Residual')}</th><th></th></tr>${ras.map(x => row('ra', x)).join('')}${mocs.map(x => row('moc', x)).join('')}</table></div>` : `<div class="al ok"><span class="ic">✅</span><span class="tx">${T2('기다리는 승인 요청이 없습니다.', 'No requests waiting.')}</span></div>`}</div>
            ${done.length ? `<div class="card"><h3>🗂 ${T2('최근 결정', 'Recent decisions')}</h3><div class="tw"><table class="t"><tr><th>${T2('결정일', 'Date')}</th><th>${T2('선박', 'Vessel')}</th><th>${T2('번호', 'No.')}</th><th>${T2('결정', 'Decision')}</th><th>DPA</th></tr>${done.map(x => `<tr><td>${U.esc(x.decAt || '')}</td><td>${U.esc(x.vessel || '')}</td><td>${U.esc(x.raNo || '')}</td><td>${U.esc(t(DPA_DEC[x.dec][0], DPA_DEC[x.dec][1]))}</td><td>${U.esc(x.dpaName || '')}</td></tr>`).join('')}</table></div></div>` : ''}`; }; } catch (e) { }
      try { const t0 = toast; toast = function (m) { if (/^(승인 코드 발급|Code issued)/.test(String(m))) m = T2('결정을 저장했습니다 — 선박으로 전달됩니다', 'Decision saved — sent to the ship'); return t0.apply(this, [m].concat([].slice.call(arguments, 1))); }; } catch (e) { }
      /* 사무실 결정 → MoC도 동기화되게 (갱신 시각) */
      try { const iss = A.dqIssue; A.dqIssue = () => { const q = MODAL && dqOf(MODAL.id); iss(); try { if (q && q.mocId) { const m = DB.mocs.find(x => x.id === q.mocId); if (m) { touch(m); save(); } } } catch (e) { } }; } catch (e) { }
      /* 결정 창: 코드·카톡 대신 '서버로 전달' 안내 */
      try { const rm0 = renderModal; renderModal = function () { const x = rm0.apply(this, arguments); try { if (MODAL && MODAL.k === 'dq') { const el = document.getElementById('modal'); if (!el) return x;
            const ib = el.querySelector('[data-a=dqIssue]'); if (ib) ib.innerHTML = '✅ ' + T2('결정 저장 · 선박으로 전달', 'Save decision · send to ship');
            const eb = el.querySelector('[data-a=dqEdit]'); if (eb) eb.textContent = '✎ ' + T2('결정 변경', 'Change decision');
            el.querySelectorAll('h4.dqsec').forEach(h => { if (/선박에 전달|Send to the ship/.test(h.textContent) && !h.dataset.sj) { h.dataset.sj = 1; h.innerHTML = '📡 ' + T2('선박에 전달 — 서버로 자동', 'Sent to the ship automatically'); let n = h.nextElementSibling; if (n && n.classList.contains('sub')) n.innerHTML = T2('결정이 저장되었습니다. 선박 기기가 인터넷에 연결되면 위험성 평가 화면에 바로 반영되고, 선박에 알림이 갑니다. 전화·카톡·메일로 따로 알릴 필요가 없습니다.', 'Saved. It reaches the ship automatically when it is online, with a notification. No call, chat or e-mail needed.'); } }); } } catch (e) { } return x; }; } catch (e) { }
    },
    shipStep() { if (DB.settings.site === 'office') return; const k = document.querySelector('[data-a=dpaKakao]'); if (!k) return; const box = k.closest('.stepbox'); if (!box || box.dataset.sj) return;
      const S = DB.settings; box.dataset.sj = 1; box.outerHTML = `<div class="sjx-srv">📡 <b>${T('DPA 승인 요청 — 서버로 자동 전달됨', 'DPA approval requested via the server')}</b><br>${T('DPA가 사무실 앱에서 결정하면 이 화면에 바로 반영되고 알림이 옵니다. 요청번호·승인 코드·카톡·메일은 필요 없습니다.', 'The DPA decides in the office app; the result appears here with a notification. No request number, code, chat or e-mail needed.')}${S.dpaPhone ? ` <span class="sub">(${T('급하면 DPA에게 전화', 'urgent: call the DPA')} ☎ ${U.esc(S.dpaPhone)})</span>` : ''}</div>`;
      const c = document.getElementById('dpaCodeIn'); if (c) { const b2 = c.closest('.stepbox'); if (b2) b2.style.display = 'none'; } },
    sum() { const by = {}, g = n => by[n] = by[n] || { draft: 0, wait: 0, stop: 0, act: 0, moc: 0, items: [] };
      const st = (f, x) => { try { return f(x)[0]; } catch (e) { return ''; } };
      (DB.ras || []).forEach(r => { const k = st(raStatus, r), b = g(r.vessel || '—'); if (b[k] != null && k !== 'act') { b[k]++; if (b.items.length < 10) b.items.push([k, r.id, (r.no ? r.no + ' ' : '') + (r.title || '')]); } });
      (DB.ptws || []).forEach(p => { if (st(ptwStatus, p) !== 'act') return; const b = g(p.vessel || '—'); b.act++; const e = p.to ? new Date(p.to) : null; if (e && !isNaN(e)) (b.ptw = b.ptw || []).push({ id: p.id, no: p.no || 'PTW', t: String(p.desc || p.location || '').slice(0, 60), end: e.toISOString() }); });
      (DB.ras || []).forEach(r => { const dec = r.apv && r.apv.dpaDecision; if (dec) (g(r.vessel || '—').dpa = g(r.vessel || '—').dpa || []).push({ id: r.id, no: r.no || '', t: String(r.title || '').slice(0, 60), dec }); });
      (DB.mocs || []).forEach(m => { if (!(m.close && m.close.apvDate)) g(m.vessel || '—').moc++; let ms = ''; try { ms = mocStatus(m)[0]; } catch (e) { } if (ms === 'wait' && m.cls !== 'emg') { const b = g(m.vessel || '—'); b.wait++; if (b.items.length < 12) b.items.push(['mocw', m.id, 'MoC ' + (m.no || '') + ' ' + (m.title || '')]); } });
      localStorage.setItem('sejul_sum_rsk', JSON.stringify({ at: Date.now(), site: DB.settings.site, crew: (DB.settings.crew || []).length, v: by }));
      try { const ix = {}, cut = x => String(x || '').slice(0, 80), add = (k, x, t) => ((ix[x.vessel || '—'] = ix[x.vessel || '—'] || []).push([k, x.id, x.no || '', cut(t)]));
        (DB.ras || []).forEach(x => add('ra', x, x.title)); (DB.ptws || []).forEach(x => add('ptw', x, x.desc || x.location)); (DB.mocs || []).forEach(x => add('moc', x, x.title)); (DB.rirs || []).forEach(x => add('rir', x, x.desc));
        localStorage.setItem('sejul_idx_rsk', JSON.stringify({ at: Date.now(), v: ix })); } catch (e) { } },
    hookRender() { const r0 = render; render = function () { const v = C.get('view') || '', off = DB.settings.site === 'office', K = ['ras', 'ptws', 'mocs', 'rirs'], keep = {};
        if (off && v) K.forEach(k => { keep[k] = DB[k] || []; DB[k] = keep[k].filter(x => x.vessel === v); });   /* 사무실: 고른 선박만 보이게 (그리는 동안만) */
        let x; try { x = r0.apply(this, arguments); } finally { if (off && v) K.forEach(k => { const shown = DB[k]; DB[k] = keep[k].filter(y => y.vessel !== v || shown.includes(y)).concat(shown.filter(y => !keep[k].includes(y))); }); }
        try { if (off && v) { const h = document.querySelector('.page-h h2'); if (h && !h.querySelector('.sjv')) h.insertAdjacentHTML('beforeend', ` <span class="sjv" style="font-size:14px;color:#5B6474;font-weight:500">· ${U.esc(v)}</span>`); } } catch (e) { }
        try { RSK.shipStep(); } catch (e) { }
        try { const n = NAV.find(z => z[0] === 'dpa'); if (n) { n[1] = 'DPA·회사 승인'; n[2] = 'Approvals'; } } catch (e) { }
        navDeco(); sumSoon(RSK); return x; }; }
  };
  /* ---------- 시작 ---------- */
  let tries = 0;
  const boot = () => { const X = TOOL === 'pms' ? (PMS.ok() ? PMS : null) : (RSK.ok() ? RSK : null);
    if (!X) { if (++tries < 60) setTimeout(boot, 500); return; }
    try { const m = U.me(); if (!C.get('pcname') && m && m.pc) C.set('pcname', m.pc); } catch (e) { }
    X.hook(); try { X.apply(); } catch (e) { console.warn('shell apply', e); }
    if (C.restoring) setTimeout(() => { try { if (window.SJCLOUD && SJCLOUD.A) SJCLOUD.sync(SJCLOUD.A, true); } catch (e) { } }, 6000);
    if (X === RSK && /^#settings/.test(location.hash)) { try { A.go({ v: 'settings' }); } catch (e) { } }
    if (X === RSK) { try { RSK.approvals(); } catch (e) { console.warn('apv', e); } }
    X.hookRender(); try { render(); } catch (e) { } C.booted = 1;
    C.ensureBar(); setInterval(C.ensureBar, 1000); setInterval(U.syncPaint, 20e3); setTimeout(C.ready, 150);
    U.onView = v => { try { X.view(v); } catch (e) { } railRefresh(); };
    /* PTW 만료 30분 전 — 이 기기에서 위험성 관리를 열어 둔 동안 (인터넷 없어도) */
    if (X === RSK && !BG) setInterval(() => { try { if (!('Notification' in window) || Notification.permission !== 'granted' || DB.settings.site === 'office') return; const pf = SJCLOUD.prefs ? SJCLOUD.prefs() : {}; if ((pf.types || {}).ptw === false) return; if (pf.quiet && !pf.ptw) { const d = new Date(), m = d.getHours() * 60 + d.getMinutes(), f = pf.from, t2 = pf.to; if (f !== t2 && (f < t2 ? m >= f && m < t2 : m >= f || m < t2)) return; } const v = vesselName(), now = Date.now(); let seen = {}; try { seen = JSON.parse(localStorage.getItem('sejul_ptw_alerted') || '{}'); } catch (e) { }
      (DB.ptws || []).forEach(p => { if (p.vessel !== v || ptwStatus(p)[0] !== 'act' || !p.to) return; const e = new Date(p.to).getTime(), k = p.id + ':' + p.to; if (seen[k] || e - now > 30 * 60e3 || now - e > 10 * 60e3) return; seen[k] = now;
        navigator.serviceWorker && navigator.serviceWorker.ready.then(reg => reg.showNotification(v + ' — ' + T('PTW 곧 만료', 'Permit expiring'), { body: (p.no || 'PTW') + ' ' + (p.desc || p.location || '') + ' — ' + String(p.to).slice(11, 16) + T(' 만료', ' expires'), tag: 'ptw-' + p.id, icon: '../icon-192.png', data: { url: 'tools/rsk.html' } })); });
      localStorage.setItem('sejul_ptw_alerted', JSON.stringify(seen)); } catch (e) { } }, 60e3);
    /* 앱 홈에서 누른 항목으로 이동 */
    /* 홈 카드: 도구 안 화면 이동 · 같은 도구로 가는 ?go 링크는 새로 열지 않고 바로 실행 */
    document.addEventListener('click', e => { const f = e.target.closest && e.target.closest('[data-sjfn]'); if (!f || !/^(openEquip|openJob|openDefect)$/.test(f.dataset.sjfn)) return; e.preventDefault(); e.stopPropagation();   /* 검색 결과 → 그 항목 바로 열기 */
      try { const fn = new Function('return typeof ' + f.dataset.sjfn + ' === "function" ? ' + f.dataset.sjfn + ' : null')(); if (fn) fn(f.dataset.arg); } catch (er) { console.warn(er); } }, true);
    document.addEventListener('click', e => { const g = e.target.closest && e.target.closest('[data-sjgo]'); if (g) { e.preventDefault(); location.hash = '#/' + g.dataset.sjgo; return; }
      const a = e.target.closest && e.target.closest('a[href*="?go="]'); if (!a) return; const u = new URL(a.href, location.href); if (u.pathname !== location.pathname) return; e.preventDefault();
      try { const o = JSON.parse(u.searchParams.get('go')); if (o.hash) location.hash = o.hash; if (o.attrs) setTimeout(() => fire(o.attrs), o.hash ? 250 : 0); } catch (er) { } }, true);
    const q = BG ? null : new URLSearchParams(location.search).get('go'); if (q) { setTimeout(() => { try { const o = JSON.parse(q); if (o.view && typeof MODE !== 'undefined' && MODE === 'admin' && OFFICE.ships[o.view]) { OFFICE.sel = o.view; } if (o.hash) location.hash = o.hash; if (o.attrs) setTimeout(() => fire(o.attrs), 300); } catch (e) { } history.replaceState(null, '', location.pathname + location.hash); }, 900); }
    addEventListener('storage', e => { if (/^sejul_common_(vessel|role|lang|company|pcname)$/.test(e.key || '')) { try { X.apply(); } catch (er) { } railRefresh(); } });
    addEventListener('pageshow', () => { try { X.apply(); } catch (er) { } railRefresh(); }); };
  if (document.readyState === 'complete') setTimeout(boot, 50); else addEventListener('load', () => setTimeout(boot, 50));
})();
