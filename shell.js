/* ===== SEJUL 앱 셸 — 앱(PWA) 안에서 도구를 열 때만 =====
   · 모든 도구가 같은 왼쪽 메뉴(ui.js) + 흰 머리글 + 같은 바탕
   · 기기 종류(선박/사무실)·선박·PC 이름·언어·회사 정보·동기화·백업 폴더는 앱 [설정] 한 곳 → 도구 화면의 해당 단추·안내는 숨김
   · 선박 기기 = 자기 선박만 / 사무실 기기 = 선대 전체 (왼쪽 위 '보는 선박')
   · 도구 상태를 요약해 앱 홈 '오늘 할 일'·선대 현황에 보냄 (sejul_sum_pms / sejul_sum_rsk)
   · 앱 홈에서 누른 항목으로 바로 이동 (?go=data-속성 JSON) */
(function () {
  const C = window.SJAPP; if (!C || C.isHub) return; C.shell = true;
  const U = window.SJUI, T = U.T; try { document.documentElement.classList.add('sj-intool'); } catch (e) { }
  const CO0 = { dpaName: 'Noh You Seok', dpaPhone: '+82-10-6588-7959', dpaEmail: 'nohys@sejulsm.com', sqEmail: 'sjsm@sejulsm.com' };
  C.company = () => { let o = {}; try { o = JSON.parse(C.get('company') || '{}') || {}; } catch (e) { } Object.keys(CO0).forEach(k => { if (!o[k]) o[k] = CO0[k]; }); return o; };
  C.mode = () => U.role() === 'office' && U.officeOK() ? 'office' : 'ship';
  const TOOL = /rsk\.html/.test(location.pathname) ? 'rsk' : 'pms', SUB = TOOL === 'rsk' ? 'rsk' : (window.SJ_SUB = window.SJ_SUB || (['inv', 'cert'].includes(new URLSearchParams(location.search).get('sub')) ? new URLSearchParams(location.search).get('sub') : '')) || 'pms';   /* 재고·구매(inv)·증서·검사(cert)는 계획정비와 같은 묶음·같은 자료 */
  const SUBN = () => ({ pms: T('계획정비', 'Maintenance'), rsk: T('위험성 관리', 'Risk'), inv: T('재고·구매', 'Stores & purchasing'), cert: T('증서·검사', 'Certificates & surveys') })[SUB];
  const BG = new URLSearchParams(location.search).has('bg'); C.bg = BG;   /* 앱 홈이 요약만 만들려고 보이지 않게 연 창 */

  /* ---------- 디자인 ---------- */
  let css = U.css + `
:root{--sjx-bg:var(--sj-sf2,#F7F9FC);--sjx-line:var(--sj-bd,#E1E6EE);--sjx-ink:var(--sj-tx,#1A2233);--sjx-navy:var(--sj-navy,#14244A);--sjx-mut:var(--sj-gry,#8A94A6)}
:root{--bg:var(--sjx-bg)!important;--sj-bg:var(--sjx-bg)!important;--line:var(--sjx-line);--sj-line:var(--sjx-line)}
body{background:var(--sjx-bg)!important;font-family:'Pretendard','Noto Sans KR','Malgun Gothic','Apple SD Gothic Neo',system-ui,sans-serif!important}
@media (min-width:900px){
 body{padding-left:var(--sjr-w,248px)!important}
 #top.sj-top,#sjFoot{left:var(--sjr-w,248px)!important}
 #top .sjbar,header.top .bar{background:var(--sj-sf,#FFFFFF)!important;color:var(--sjx-ink)!important;box-shadow:none!important;border-bottom:0!important;min-height:64px!important;padding-left:28px!important;padding-right:28px!important}
 #top .sjbar .logo,header.top .bar .logo{color:var(--sjx-ink)!important;font-size:22px!important;font-weight:800!important}
 #top .sjbar .logo .en{color:var(--sjx-mut)!important;font-size:13px!important;font-weight:500!important}
 #top .sjbar .logo small,header.top .bar .logo small{color:var(--sjx-mut)!important;font-size:12px!important;opacity:1!important}
 #top .sj-tool{background:var(--sj-sf,#FFFFFF)!important;color:var(--sjx-ink)!important;border:1px solid var(--sj-bd2,#C9D1DD)!important}
 #top .sj-tool:disabled{opacity:.45}
 #top .sj-nav,header.top .nav{background:var(--sj-sf,#FFFFFF)!important;border-bottom:1px solid var(--sjx-line)!important;padding-left:18px!important;box-shadow:none!important}
 #top .sj-nav>button,header.top .nav>button{color:var(--sjx-mut)!important;background:transparent!important;border-radius:0!important;box-shadow:none!important;border-bottom:3px solid transparent!important;font-weight:500!important}
 #top .sj-nav>button:hover,header.top .nav>button:hover{color:var(--sjx-ink)!important}
 #top .sj-nav>button.on{color:var(--sjx-navy)!important;border-bottom-color:var(--sjx-navy)!important;font-weight:700!important}
 header.top .nav>button.on{color:var(--sj-org-fg,#B85C00)!important;border-bottom-color:var(--sj-org,#E07A1F)!important;font-weight:700!important}
 .sjx-home{display:none!important}
}
#top .sj-lang,#top .sj-fs,#top .sj-site,#top .sj-ves,header.top #lang,header.top #fsst,header.top .siteSw,header.top #ves,
.mtmode,.mtr:has([data-a=siteSet]),.mtr:has([data-a=lang]),#mtab [data-act^=lang],.sj-sheet [data-act^=lang],.sj-sheet [data-sjsite],[data-act=shipChange],
.sj-card:has([data-sjconf=dpaName]),[data-act=spXlsx],.morebar:has([data-invmore]),[data-act=opsReply],[data-act=opsOpen],[data-act=openShipData],[data-a=dqCopyK],[data-a=dqCopy],[data-a=dqEml],#modal details.dqtxt,#modal .dqres .lbl,#modal .dqres .code,.sj-card.wipe,[data-a=resetAll],[data-a=pcNameReset],#top .sj-nav [data-go=fleet],#top .sj-nav [data-go=settings],#mtab [data-go=fleet],#sjFoot [data-go=fleet],#mtab [data-go=settings],.sj-sheet [data-go=settings],#top .sj-nav>[data-go=fleet],#top .sj-nav>[data-go=settings],#mtab [data-go=settings],.sj-sheet [data-go=settings],.sj-card.wipe,.resetbox,[data-a=delAll],[data-a=resetAll],.sj-card:has(#npw),.card:has(> .grid input[data-b=dpaName]),label:has(> select[data-b=vessel]),.f:has(> select[data-b=vessel]),.f:has(input[data-b=vesselOther]){display:none!important}
.sjx-home{display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:9px;background:#ffffff1f;color:var(--sj-on,#FFFFFF);text-decoration:none;font-size:18px;flex:none;margin-right:4px}
.sjx-card{border:1px solid var(--sjx-line);border-radius:14px;background:var(--sj-sf,#FFFFFF);padding:14px 16px;margin-bottom:14px;display:flex;gap:14px;align-items:center;flex-wrap:wrap}
.sjx-card .tx{flex:1;min-width:220px;font-size:14px;color:var(--sj-tx,#1A2233);line-height:1.55}.sjx-card b{color:var(--sjx-ink);font-size:14px}
.sjx-pick{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;margin-top:16px}.sjx-pick button{text-align:left;background:var(--sj-sf,#FFFFFF);border:1px solid var(--sjx-line);border-radius:14px;padding:16px;font:inherit;cursor:pointer;min-height:64px}.sjx-pick button:hover{border-color:var(--sj-bd3,#9AA4B2)}.sjx-pick b{display:block;font-size:16px}.sjx-pick small{color:var(--sjx-mut)}.sjx-empty{background:var(--sj-sf,#FFFFFF);border:1px solid var(--sjx-line);border-radius:16px;padding:28px;margin:8px 0;font-size:14px;line-height:1.7;color:var(--sj-tx,#1A2233)}.sjx-empty h2{margin:0 0 6px;font-size:20px;color:var(--sjx-ink)}
.sjx-srv{border:2px solid var(--sj-blu,#1F64B8);background:var(--sj-sf2,#F7F9FC);border-radius:14px;padding:14px 16px;margin:8px 0;font-size:14px;line-height:1.65;color:var(--sj-tx,#1A2233)}.sjx-srv b{font-size:16px}.sjx-srv .btn{margin-top:8px}
.sjx-dd{position:relative;display:inline-block}.sjx-dd>summary{list-style:none;cursor:pointer;display:inline-flex;align-items:center;gap:6px;user-select:none}.sjx-dd>summary::-webkit-details-marker{display:none}
.sjx-ddm{position:absolute;z-index:60;top:calc(100% + 6px);left:0;min-width:260px;background:var(--sj-sf,#FFFFFF);border:1px solid var(--sjx-line);border-radius:12px;box-shadow:0 12px 30px #0f172a26;padding:6px;display:flex;flex-direction:column;gap:2px}
.sjx-ddm>*{width:100%;justify-content:flex-start!important;text-align:left;border:0!important;background:none!important;box-shadow:none!important;border-radius:8px!important;padding:10px 12px!important;margin:0!important}.sjx-ddm>*:hover{background:var(--sj-sf3,#EEF1F6)!important}
/* 각 도구의 '사용법' 탭 숨김 (내용이 지금 앱과 맞지 않음) */
[data-go=help],button[data-v=help],#mtab [data-v=help]{display:none!important}
.sjx-ddm .sjx-ddh{font-size:12px;color:var(--sjx-mut);padding:6px 12px 2px!important;pointer-events:none}
.sjx-ph{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin:2px 0 14px}.sjx-ph h1{margin:0!important;font-size:24px!important;flex:1;min-width:220px;display:flex;align-items:baseline;gap:8px;flex-wrap:wrap}.sjx-ph .sjx-act{display:flex;gap:8px;flex-wrap:wrap}
.sjx-fc{background:var(--sj-sf,#FFFFFF);border:1px solid var(--sjx-line);border-radius:14px;padding:12px 16px;margin:0 0 14px;display:flex;flex-direction:column;gap:10px}.sjx-fc>*{margin:0!important}.sjx-fc>*+*{border-top:1px dashed var(--sj-bd,#E1E6EE);padding-top:10px!important}
#main .hsub,#main p.hsub{color:var(--sjx-mut)!important;font-size:14px!important;margin:-6px 0 14px!important}
#main .btn.prt9,#main [data-act=ckBlankMenu],#main .btn.or,#main .btn.warn:not(.danger){background:var(--sj-sf,#FFFFFF)!important;border:1.5px solid var(--sj-blu,#1F64B8)!important;color:var(--sj-blu-fg,#1D5FAE)!important;font-weight:700!important;font-size:14px!important;padding:8px 16px!important;border-radius:9px!important;margin:0!important;box-shadow:none!important}
#main .btn{border-radius:9px}#main .btn.pri{background:var(--sj-blu,#1F64B8);border-color:var(--sj-blu,#1F64B8)}
#main .chips .chip,#main .chip{border:1.5px solid var(--sj-bd2,#C9D1DD)!important;background:var(--sj-sf,#FFFFFF)!important;border-radius:20px!important;padding:6px 14px!important;font-size:14px!important;color:var(--sj-tx,#1A2233)!important;box-shadow:none!important}
#main .chip b{display:inline-block;min-width:20px;text-align:center;background:var(--sj-blu-bg,#E8F0FB);color:var(--sj-blu-fg,#1D5FAE);border-radius:10px;padding:0 7px;margin-left:4px;font-size:13px}
#main .chip.on{background:var(--sj-blu,#1F64B8)!important;border-color:var(--sj-blu,#1F64B8)!important;color:var(--sj-on,#FFFFFF)!important}#main .chip.on b{background:rgba(255,255,255,.22);color:var(--sj-on,#FFFFFF)}
#main .viewsw{background:var(--sj-sf,#FFFFFF);border:1px solid var(--sjx-line);border-radius:12px;padding:4px;display:inline-flex!important;gap:2px!important;margin:0 0 14px!important}#main .viewsw .lb{padding:0 8px;color:var(--sjx-mut);font-size:13px}
#main .viewsw button{border:0!important;border-radius:9px!important;background:transparent!important;color:var(--sj-tx,#1A2233)!important;font-weight:600!important;padding:8px 14px!important}#main .viewsw button.on{background:var(--sj-blu,#1F64B8)!important;color:var(--sj-on,#FFFFFF)!important}
#main .kpis{gap:10px!important}#main .kp{align-items:flex-start!important;text-align:left!important;min-width:120px!important;padding:12px 14px!important;border:1px solid var(--sjx-line)!important;border-left:4px solid var(--sj-bd2,#C9D1DD)!important;border-radius:12px!important;background:var(--sj-sf,#FFFFFF)!important;box-shadow:none!important}
#main .kp b{font-size:26px!important}#main .kp span{font-size:13px!important;color:var(--sjx-mut)!important}#main .kp.od{border-left-color:var(--sj-red,#D93636)!important}#main .kp.d7{border-left-color:var(--sj-amb,#E0A100)!important}#main .kp.d30{border-left-color:var(--sj-bd3,#9AA4B2)!important}#main .kp.cr{border-left-color:var(--sj-amb,#E0A100)!important;background:var(--sj-sf,#FFFFFF)!important}#main .kp.dn{border-left-color:var(--sj-grn,#2FA36B)!important}
#main .card,#main .tw{border-radius:14px!important;border-color:var(--sjx-line)!important;box-shadow:none!important}
.vesbar{display:none!important}
.sjx-fc{padding:6px 18px!important;gap:0!important}.sjx-fc>.sjx-row{display:grid;grid-template-columns:96px 1fr;gap:12px;align-items:center;padding:12px 0!important}.sjx-fc>.sjx-row+.sjx-row{border-top:1px dashed var(--sj-bd,#E1E6EE)}
.sjx-lb{font-weight:700;font-size:14px;color:var(--sj-tx,#1A2233);display:flex;align-items:center;gap:6px}.sjx-rc{min-width:0}.sjx-rc>*{margin:0!important}
#main .sjx-fc input[type=search],#main .sjx-fc input[type=text]{border:1.5px solid var(--sj-blu,#1F64B8)!important;border-radius:10px!important;min-height:40px}
#main .sjx-seg{display:inline-flex!important;flex-wrap:wrap;gap:0!important;border:1.5px solid var(--sj-blu,#1F64B8);border-radius:10px;overflow:hidden;background:var(--sj-sf,#FFFFFF)}
#main .sjx-seg .chip{border:0!important;border-radius:0!important;border-right:1px solid var(--sj-bd,#E1E6EE)!important;padding:9px 14px!important;color:var(--sj-tx2,#4A5568)!important;font-weight:600}
#main .sjx-seg .chip:last-child{border-right:0!important}#main .sjx-seg .chip.on{background:var(--sj-blu,#1F64B8)!important;color:var(--sj-on,#FFFFFF)!important}
#main .sjx-seg .chip::before{content:'';display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--dot,var(--sj-bd2,#C9D1DD));margin-right:6px;vertical-align:1px}#main .sjx-seg .chip.on::before{background:var(--sj-sf,#FFFFFF)}
.sjx-rc>.dfsub>span.small{display:none}
.sjx-cnt{font-weight:700;font-size:16px;margin:2px 0 8px;color:var(--sj-tx,#1A2233)}
@media (max-width:760px){.sjx-fc>.sjx-row{grid-template-columns:1fr;gap:6px}}
#main .opsp{box-shadow:none!important;border:1px solid var(--sjx-line)!important;border-left:4px solid var(--sj-red,#D93636)!important;border-radius:14px!important}
.sjx-card a{background:var(--sjx-navy);color:var(--sj-on,#FFFFFF);text-decoration:none;border-radius:9px;padding:8px 14px;font-weight:700;font-size:14px}
.sjx-hero{display:flex;align-items:center;gap:18px;background:var(--sj-sf,#FFFFFF);border:1px solid var(--sjx-line);border-left:6px solid var(--sj-red,#D93636);border-radius:16px;padding:18px 22px;margin:4px 0 18px}.sjx-hero.ok{border-left-color:var(--sj-grn,#2FA36B)}.sjx-hero .tx{flex:1;min-width:0}.sjx-hero small{display:block;color:var(--sjx-mut);font-size:14px;font-weight:600}.sjx-hero b{display:block;font-size:22px;margin:4px 0 4px;color:var(--sjx-ink)}.sjx-hero em{font-style:normal}.sjx-hero em.r{color:var(--sj-red-fg,#C62828)}.sjx-hero em.y{color:var(--sj-org-fg,#B85C00)}.sjx-hero span{color:var(--sjx-mut);font-size:14px}.sjx-hero .btn{white-space:nowrap;font-size:16px!important;padding:12px 18px!important;background:var(--sj-navy,#14244A)!important;color:var(--sj-on,#FFFFFF)!important;border-radius:12px!important}
@media (max-width:640px){.sjx-hero{flex-direction:column;align-items:stretch;padding:16px}.sjx-hero b{font-size:20px}}
#main .kpu{font-size:13px!important}#main .small,#main small{font-size:max(12.5px,.85em)}
/* 입력 창(팝업) — 위험성 관리와 같은 짜임 */
#mback .modal{border-radius:18px!important;box-shadow:0 24px 60px rgba(15,23,42,.28)!important}
#mback .modal .mh{padding:18px 24px!important;font-size:20px!important;font-weight:800!important;background:var(--sj-sf,#FFFFFF)!important;border-bottom:1px solid var(--sjx-line)!important}
#mback .modal .mb{padding:20px 24px!important}#mback .modal .mf{background:var(--sj-sf2,#F7F9FC)!important;border-top:1px solid var(--sjx-line)!important;padding:12px 24px!important}
#mback .modal .mb label{font-weight:700;color:var(--sj-tx,#1A2233)}
#mback .modal .mb :is(input:not([type=radio]):not([type=checkbox]),select,textarea){border:1.5px solid var(--sj-bd2,#C9D1DD)!important;border-radius:10px!important;min-height:42px;font-size:16px!important}
#mback .modal .mb :is(input,select,textarea):focus{border-color:var(--sj-blu,#1F64B8)!important;box-shadow:0 0 0 3px rgba(47,84,150,.15)!important;outline:0!important}
#mback .modal .dfh{background:var(--sj-sf2,#F7F9FC);border:0!important;border-left:5px solid var(--sj-blu,#1F64B8)!important;border-radius:8px;padding:9px 14px!important;margin:18px 0 12px!important;font-size:16px!important}
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
 #main [data-act=prt9],#main .prt9,#main .prt9s,#main .sjx-dd,#main .sjx-prt,#main [data-act=ckPrintMenu],#main [data-act=ckBlankMenu],#main [data-act=sfiPrint],#main [data-act=clsPrint],#main [data-act=clsBlank],#main [data-act=monthlyReport],
 #main .sjx-ph [data-act=eqAdd],#main .sjx-ph [data-act=calAdd],#main .sjx-ph [data-act=clsNew],#main .sjx-ph [data-act=spNew],#main [data-act=sfiAdd]{display:none!important}
 #main .sjx-row:has([data-act=ckBlankMenu]):not(:has(input,select)),#main .sjx-fc:has([data-act=ckBlankMenu]):not(:has(input,select)){display:none!important}
 #main h1{font-size:22px!important}#main .sjx-ph{margin-bottom:6px}
 .sjx-pcnote{display:block!important}
}
.sjx-pcnote{display:none;font-size:13px;color:var(--sj-tx2,#4A5568);background:var(--sj-blu-bg,#E8F0FB);border-radius:10px;padding:8px 12px;margin:0 0 12px}
/* 도구 자체 큰 머리말(계획정비 시스템 · 위험성 관리 도구) 숨김 — 왼쪽 메뉴·홈 머리말이 대신함 */
html body #top .sjbar,html body header.top .bar{display:none!important}
.sjh-crew{margin:0 0 12px}.sjh-crew>*{margin:0!important}
#main>.sjh,.sjh{padding-top:4px}
/* 목록 표 — 홈·SFI 화면과 같은 흰 카드 · 옅은 머리줄 */
#main .tw{background:var(--sj-sf,#FFFFFF);border:1px solid var(--sjx-line);border-radius:14px}
#main table.g thead th,#main table.g>tr:first-child>th{background:var(--sj-sf2,#F7F9FC)!important;color:var(--sj-tx2,#4A5568)!important;font-weight:700!important;font-size:13px!important;border-bottom:1px solid var(--sj-bd,#E1E6EE)!important;text-transform:none}
#main table.g tbody tr:hover>td{background:var(--sj-sf2,#F7F9FC)}
/* ===== 도구 안 탭 줄: 도구 이름표 · 아이콘 · 숫자 · 고른 탭은 남색 알약 · 더보기(PC) · 전체 메뉴(휴대폰) ===== */
html body #top .sj-nav,html body header.top #nav{display:flex!important;align-items:center!important;gap:4px!important;flex-wrap:nowrap!important;background:var(--sj-sf,#FFFFFF)!important;border-bottom:1px solid var(--sj-bd,#E1E6EE)!important;box-shadow:0 2px 8px rgba(15,23,42,.06)!important;padding:8px 14px!important;overflow:visible}
html body #top .sj-nav>button,html body header.top #nav>button,html body .sjtb-more .sjtb-mm>button{display:inline-flex!important;align-items:center!important;gap:6px!important;flex:0 0 auto!important;white-space:nowrap!important;color:var(--sj-tx,#1A2233)!important;background:transparent!important;border:0!important;border-radius:9px!important;padding:8px 12px!important;font-size:14px!important;font-weight:600!important;box-shadow:none!important;margin:0!important;line-height:1.2!important}
html body #top .sj-nav>button:hover,html body header.top #nav>button:hover{background:var(--sj-sf2,#F7F9FC)!important;color:var(--sj-tx,#1A2233)!important}
html body #top .sj-nav>button.on,html body header.top #nav>button.on{background:var(--sj-navy,#14244A)!important;color:var(--sj-on,#FFFFFF)!important;font-weight:800!important;border:0!important}
.sjtb-ic{display:inline-flex;opacity:.8}button.on .sjtb-ic{opacity:1}
.sjtb-n{font-size:12px;font-weight:800;border-radius:9px;padding:0 6px;line-height:18px;background:var(--sj-red-bg,#FDECEC);color:var(--sj-red-fg,#C62828)}.sjtb-n.y{background:var(--sj-amb-bg,#FFF6D6);color:var(--sj-amb-fg,#8A6400)}.sjtb-n.b{background:var(--sj-blu-bg,#E8F0FB);color:var(--sj-tx,#1A2233)}button.on .sjtb-n{background:var(--sj-sf,#FFFFFF)}
.sjtb-id{display:inline-flex;align-items:center;gap:8px;padding:4px 14px 4px 2px;margin-right:6px;border-right:1px solid var(--sj-bd,#E1E6EE);font-weight:800;font-size:16px;color:var(--sj-tx,#1A2233);white-space:nowrap;flex:none}.sjtb-id i{width:28px;height:28px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;font-style:normal}
.sjtb-id.pms i{background:var(--sj-blu-bg,#E8F0FB);color:var(--sj-tx,#1A2233)}.sjtb-id.rsk i{background:var(--sj-org-bg,#FFF0E0);color:var(--sj-org-fg,#B85C00)}
.sjtb-more{position:relative;margin-left:auto;flex:none}.sjtb-more>summary{list-style:none;cursor:pointer;padding:8px 12px;border-radius:9px;font-weight:700;font-size:14px;color:var(--sj-tx,#1A2233);white-space:nowrap}.sjtb-more>summary::-webkit-details-marker{display:none}.sjtb-more>summary:hover{background:var(--sj-sf2,#F7F9FC)}.sjtb-more.on>summary{background:var(--sj-navy,#14244A);color:var(--sj-on,#FFFFFF)}
.sjtb-mm{position:absolute;right:0;top:calc(100% + 6px);z-index:60;background:var(--sj-sf,#FFFFFF);border:1px solid var(--sj-blu-bd,#B5CDEE);border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.15);padding:6px;min-width:220px;display:flex;flex-direction:column}.sjtb-mm>button{width:100%;justify-content:flex-start}.sjtb-mm>button.on{background:var(--sj-navy,#14244A)!important;color:var(--sj-on,#FFFFFF)!important}
.sjtb-all{display:none}
html body #top .sj-nav>button[data-go=help],html body #top .sj-nav>button[data-go=settings],html body header.top #nav>button[data-v=help],html body header.top #nav>button[data-v=settings],html body #top .sj-nav>button.sjtb-all,html body header.top #nav>button.sjtb-all{display:none!important}
@media (max-width:899px){
 html body #top .sj-nav>button.sjtb-all,html body header.top #nav>button.sjtb-all{display:flex!important;position:fixed!important;right:0!important;width:56px!important;height:50px!important;padding:0 8px 0 0!important;align-items:center!important;justify-content:flex-end!important;border:0!important;border-radius:0!important;background:linear-gradient(90deg,rgba(255,255,255,0),var(--sj-sf,#FFFFFF) 40%)!important}
 html body #top .sj-nav,html body header.top #nav{padding:8px 52px 8px 10px!important;overflow-x:auto!important;gap:6px!important;position:relative}
 html body #top .sj-nav>button,html body header.top #nav>button{border:1px solid var(--sj-blu-bd,#B5CDEE)!important;border-radius:18px!important;padding:7px 12px!important;font-size:14px!important}
 html body #top .sj-nav>button.on,html body header.top #nav>button.on{border-color:var(--sj-blu,#1F64B8)!important}
 .sjtb-id{display:none}.sjtb-more{display:contents}.sjtb-more>summary{display:none}.sjtb-more .sjtb-mm{display:contents}
 .sjtb-all{display:flex;position:fixed;right:0;width:52px;height:52px;align-items:center;justify-content:center;background:linear-gradient(90deg,rgba(255,255,255,0),var(--sj-sf,#FFFFFF) 35%);border:0;z-index:5;cursor:pointer;color:var(--sj-tx,#1A2233)}
 .sjtb-all span{display:flex;width:34px;height:34px;border-radius:10px;border:1px solid var(--sj-blu-bd,#B5CDEE);background:var(--sj-sf,#FFFFFF);align-items:center;justify-content:center}
}
.sjtb-sh{position:fixed;inset:0;z-index:2100}.sjtb-sh[hidden]{display:none}.sjtb-sh .bg{position:absolute;inset:0;background:rgba(15,23,42,.45)}.sjtb-sh .pn{position:absolute;left:0;right:0;bottom:0;background:var(--sj-sf,#FFFFFF);border-radius:18px 18px 0 0;padding:10px 12px calc(16px + env(safe-area-inset-bottom));max-height:80vh;overflow:auto;font-family:'Pretendard','Noto Sans KR','Malgun Gothic',system-ui,sans-serif}
.sjtb-sh h3{margin:6px 6px 10px;font-size:18px;display:flex;align-items:center}.sjtb-sh h3 button{margin-left:auto;border:0;background:var(--sj-sf2,#F7F9FC);border-radius:50%;width:34px;height:34px;font-size:16px}
.sjtb-sh .pn>button.it{display:flex;align-items:center;gap:12px;width:100%;text-align:left;border:0;border-bottom:1px solid var(--sj-bd,#E1E6EE);background:none;padding:14px 10px;font:inherit;font-size:16px;font-weight:700;color:var(--sj-tx,#1A2233);cursor:pointer}.sjtb-sh .pn>button.it.on{background:var(--sj-blu-bg,#E8F0FB);box-shadow:inset 4px 0 0 var(--sj-amb,#E0A100)}.sjtb-sh .pn>button.it .sjtb-n{margin-left:auto}
/* 이전/다음 막대 없앰 (위 탭·왼쪽 메뉴로 이동) · 실행 취소 단추는 저장 알림의 [되돌리기]로 · 위험성 관리 '설정' 탭은 앱 설정으로 */
#sjFoot{display:none!important}#top .sj-nav [data-go=help],#nav [data-v=help],#mtab [data-v=help],#mtsheet [data-v=help],#drawer [data-go=help],#drawer [data-v=help]{display:none!important}#top .sj-tool[data-act=undo],#top .sj-tool[data-act=redo]{display:none!important}#nav [data-v=settings],#mtab [data-v=settings]{display:none!important}
#toasts .toast button:not(.tx){white-space:nowrap;flex:none;background:var(--sj-amb,#E0A100)!important;color:var(--sj-tx,#1A2233)!important;border:0!important;border-radius:8px!important;font-weight:800!important;padding:5px 12px!important}
@media (max-width:899px){
 html body #top .sjbar,html body header.top .bar,html body #mtab,html body #mtsheet{display:none!important}
 html body #top.sj-top,html body header.top{top:54px!important}html.sj-hasupd #top.sj-top,html.sj-hasupd header.top{top:100px!important}
 html body #top .sj-nav,html body header.top .nav,html body header.top #nav{display:flex!important;flex-wrap:nowrap!important;overflow-x:auto!important;background:var(--sj-sf,#FFFFFF)!important;border-bottom:1px solid var(--sj-bd,#E1E6EE)!important;padding:0 6px!important;scrollbar-width:none;box-shadow:none!important;gap:0!important}
 #top .sj-nav::-webkit-scrollbar,header.top .nav::-webkit-scrollbar{display:none}
 #top .sj-nav>button,header.top .nav>button{flex:0 0 auto!important;white-space:nowrap;color:var(--sj-tx2,#4A5568)!important;background:transparent!important;border:0!important;border-bottom:3px solid transparent!important;border-radius:0!important;padding:13px 12px 10px!important;font-size:16px!important;font-weight:600!important;box-shadow:none!important}
 #top .sj-nav>button.on,header.top .nav>button.on{color:var(--sj-tx,#1A2233)!important;border-bottom-color:var(--sj-blu,#1F64B8)!important;font-weight:800!important}
 #top .sj-nav .sj-site{display:none!important}
 html body #toasts{top:auto!important;bottom:84px!important;left:10px!important;right:10px!important}html body{padding-top:54px!important;padding-bottom:84px!important}html.sj-hasupd body{padding-top:100px!important}html body #foot{bottom:66px!important}#drawer{bottom:66px!important}#selbar{bottom:66px!important}
}`;
  css += `
html body .sjx-hid,html body header.top #nav>button.sjx-hid,html body #nav button.sjx-hid{display:none!important}
/* 상세 보기 규칙: 한 화면으로 끝나는 것(작업·장비·결함 상세) = 오른쪽 서랍 / 단계가 있는 문서(위험성 평가·PTW·MoC) = 전체 페이지 — 머리 모양은 같게 */
#drawer .dh{padding:16px 20px 12px!important;border-bottom:1px solid var(--sj-blu-bd,#B5CDEE)!important;background:var(--sj-sf,#FFFFFF)!important}#drawer .dh>div>div[style*='font-size:18px']{font-size:20px!important;font-weight:800!important;color:var(--sj-tx,#1A2233);line-height:1.35}#drawer .dh .x{font-size:22px!important;color:var(--sj-tx2,#4A5568)!important}#drawer .df{background:var(--sj-sf2,#F7F9FC)!important;border-top:1px solid var(--sj-blu-bd,#B5CDEE)!important;padding:12px 20px!important}



@media (min-width:900px){html body .modal-bg{left:var(--sjr-w,248px)!important;width:auto!important;right:0!important}html body .modal-bg .modal{max-width:calc(100vw - var(--sjr-w,248px) - 42px)!important}}
@media (min-width:900px){html body #mback{left:var(--sjr-w,248px)!important;width:auto!important;right:0!important}html body #mback .modal{max-width:calc(100vw - var(--sjr-w,248px) - 42px)!important}}
`;
  const st = document.createElement('style'); st.textContent = css; (document.head || document.documentElement).appendChild(st);
  /* 도구가 앱 설정(선박·사무실)을 적용할 때까지 내용 숨김 — 예전 모양·다른 선박이 잠깐 보이는 것 방지 */
  const wait = document.createElement('style'); wait.id = 'sjxWait'; wait.textContent = 'body>*:not(.sjr):not(.sjmob){visibility:hidden!important}body{background:var(--sj-sf2,#F7F9FC)!important}'; (document.head || document.documentElement).appendChild(wait);
  /* 불러오는 동안 보이는 화면 (빈 화면 대신) */
  if (!BG) { const l = document.createElement('div'); l.id = 'sjxLoad'; const nm = SUBN();
    l.innerHTML = `<style>#sjxLoad{position:fixed;inset:0;z-index:890;background:var(--sj-bg,#F3F5F9);font-family:'Pretendard','Noto Sans KR','Malgun Gothic',system-ui,sans-serif;padding:26px 28px;overflow:hidden;transition:opacity .2s}@media (min-width:900px){#sjxLoad{left:var(--sjr-w,248px)}}@media (max-width:899px){#sjxLoad{top:54px;bottom:66px;padding:18px 16px}}#sjxLoad .lb{display:flex;align-items:center;gap:10px;color:var(--sj-tx2,#4A5568);font-size:13px;font-weight:600;margin-bottom:18px}#sjxLoad .lb u{width:14px;height:14px;border-radius:50%;border:2px solid var(--sj-blu-bd,#B5CDEE);border-top-color:var(--sj-blu,#1F64B8);animation:sjxsp .8s linear infinite}#sjxLoad i{display:block;border-radius:10px;background:linear-gradient(90deg,var(--sj-sf3,#EEF1F6) 0,var(--sj-bd,#E1E6EE) 40%,var(--sj-sf3,#EEF1F6) 80%) 0 0/200% 100%;animation:sjxsk 1.2s linear infinite}#sjxLoad .t{height:14px;width:180px;margin-bottom:10px}#sjxLoad .h{height:30px;width:260px;margin-bottom:22px}#sjxLoad .hero{height:110px;margin-bottom:14px;border-radius:14px}#sjxLoad .k{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-bottom:14px}#sjxLoad .k i{height:84px;border-radius:12px}#sjxLoad .c{display:grid;grid-template-columns:2fr 1fr;gap:14px}#sjxLoad .c i{height:260px;border-radius:12px}@media (max-width:899px){#sjxLoad .c{grid-template-columns:1fr}}@keyframes sjxsp{to{transform:rotate(360deg)}}@keyframes sjxsk{to{background-position:-200% 0}}@media (prefers-reduced-motion:reduce){#sjxLoad *{animation:none!important}}</style><div class="lb" role="status"><u></u>${nm} ${T('불러오는 중…', 'loading…')} <small style="font-weight:400;color:var(--sj-tx3,#6B7588)">${T('처음 열 때는 몇 초 걸릴 수 있습니다', 'The first open can take a few seconds')}</small></div><i class="t"></i><i class="h"></i><i class="hero"></i><div class="k"><i></i><i></i><i></i><i></i><i></i></div><div class="c"><i></i><i></i></div>`;
    /* PC: 지난번에 본 같은 화면을 먼저 보여 줌 (같은 탭에서 도구를 오갈 때) — 도구가 준비되면 실제 화면으로 바뀜. 누를 수는 없음(잠깐) */
    let snap = null; const snapKey = () => 'sejul_snap|' + TOOL + '|' + SUB + '|' + (location.hash.replace(/^#\/?/, '').replace(/^home$/, '')) + '|' + (C.get('view') || '') + '|' + (C.get('vessel') || '') + '|' + (C.get('theme') || '') + '|' + (C.get('lang') || '');
    try { if (!(U.phone && U.phone())) snap = JSON.parse(sessionStorage.getItem(snapKey()) || 'null'); } catch (e) { }
    if (snap && snap.main) try { const na = document.createElement('style'); na.textContent = '.sjh>*{animation:none!important}'; document.documentElement.appendChild(na); const iv = setInterval(() => { if (!document.getElementById('sjxLoad')) { clearInterval(iv); setTimeout(() => na.remove(), 1200); } }, 300); } catch (e) { }   /* 지난 화면 → 실제 화면으로 바뀔 때 깜빡임(다시 나타나는 효과) 없이 */
    if (snap && snap.main) { l.className = 'snap pre'; { const iv = setInterval(() => { if (window.SJLOOK || !l.isConnected) { clearInterval(iv); l.classList.remove('pre'); } }, 40); }   /* 도구 모양(CSS)이 준비된 뒤에 보여 줌 — 옛 모양이 잠깐 보이지 않게 */
      l.className = 'snap pre'; l.innerHTML = `<style>#sjxLoad.snap{position:fixed;inset:0;z-index:890;background:var(--sj-bg,#F3F5F9);overflow:hidden;transition:opacity .15s}@media (min-width:900px){#sjxLoad.snap{left:var(--sjr-w,248px)}}#sjxLoad.snap.pre>:not(style){visibility:hidden}#sjxLoad.snap *{pointer-events:none!important;animation:none!important;transition:none!important}#sjxLoad .snapb{position:fixed;right:18px;bottom:18px;z-index:5;display:flex;align-items:center;gap:8px;padding:8px 14px;border-radius:999px;background:var(--sj-inv,#2A3242);color:var(--sj-on,#FFFFFF);font:600 13px 'Pretendard','Malgun Gothic',sans-serif}#sjxLoad .snapb u{width:12px;height:12px;border-radius:50%;border:2px solid var(--sj-bd3,#9AA4B2);border-top-color:var(--sj-on,#FFFFFF);animation:sjxsp .8s linear infinite!important}@keyframes sjxsp{to{transform:rotate(360deg)}}</style><div class="snapb" role="status"><u></u>${T('최신 자료 확인 중…', 'Refreshing…')}</div><div id="top" class="${snap.tc || ''}" inert>${snap.top || ''}</div><${snap.mt || 'main'} id="main" class="${snap.mc || ''}" inert>${snap.main}</${snap.mt || 'main'}>`; }
    /* 실제 #top·#main 보다 뒤에 오도록 body 뒤에 붙임 (id 조회는 항상 실제 화면이 먼저) */
    const put = () => { if (!document.body) return false; document.documentElement.appendChild(l); if (snap && snap.y) { try { l.scrollTop = snap.y; } catch (e) { } } return true; };
    if (!put()) { document.documentElement.appendChild(l); const mo = new MutationObserver(() => { if (document.body) { mo.disconnect(); put(); } }); mo.observe(document.documentElement, { childList: true }); }
    addEventListener('pagehide', () => { try { if (!C.booted || (U.phone && U.phone()) || document.querySelector('#mback.on,.modal-bg[style*=flex]')) return; const m = document.querySelector('body #main'), t = document.querySelector('body #top'); if (!m) return; const o = { main: m.innerHTML, mc: m.className, mt: m.tagName.toLowerCase(), top: t ? t.innerHTML : '', tc: t ? t.className : '', y: 0 }; const j = JSON.stringify(o); if (j.length < 400000) sessionStorage.setItem(snapKey(), j); else sessionStorage.removeItem(snapKey()); } catch (e) { } }); }
  C.ready = () => { const w = document.getElementById('sjxWait'); if (w) w.remove(); const l = document.getElementById('sjxLoad'); if (l) { l.style.opacity = '0'; setTimeout(() => l.remove(), 220); } };
  /* 비상용: 도구가 끝내 준비되지 않을 때만 가림막을 걷음 (느린 휴대폰에서 예전 화면이 먼저 보이지 않도록 넉넉히) */
  setTimeout(() => { if (!C.booted) C.ready(); }, 20000); setTimeout(C.ready, 30000);
  const early = () => { try { C.ensureBar(); } catch (e) { } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', early); else setTimeout(early, 0);

  /* ---------- 왼쪽 메뉴 ---------- */
  C.ensureBar = function () {
    let r = document.querySelector('.sjr'); if (!r) { document.querySelectorAll('.sjmob').forEach(x => x.remove()); const w = document.createElement('div'); w.innerHTML = U.rail(SUB, '../'); [...w.children].forEach(x => document.body.appendChild(x)); U.syncPaint(); U.updPaint(); C.updBar && C.updBar(); }
    const bar = document.querySelector('#top .sjbar, header.top .bar'); /* 휴대폰: 머리글에 ⌂ */
    if (bar && !bar.querySelector('.sjx-home')) { const a = document.createElement('a'); a.className = 'sjx-home'; a.href = '../index.html'; a.title = T('앱 홈', 'App home'); a.textContent = '⌂'; bar.insertBefore(a, bar.firstChild); } };
  /* 탭 줄 꾸미기 — 도구가 다시 그릴 때마다 */
  const TBI = { home: 'home', jobs: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01', due: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01', ck: 'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11', defects: 'M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z', spares: 'M21 8 12 3 3 8v8l9 5 9-5zM3 8l9 5 9-5M12 13v8', fleet: 'bld',
    raList: 'M9 4h6v3H9zM7 5H5v16h14V5h-2M9 12h6M9 16h4', ptwList: 'M7 3h7l5 5v13H7zM14 3v5h5M10 14l2 2 4-4', mocList: 'M4 4v6h6M20 20v-6h-6M20 9A8 8 0 0 0 5.6 5.6L4 10M4 15a8 8 0 0 0 14.4 3.4L20 14', rirList: 'M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z', register: 'M4 4h12a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4zM8 4v16', dpa: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4' };

  /* 공통 모양(아이콘·상태 색·설명 접기·출력 버튼)은 도구 원본의 공통 부품 apps/shared/sjlook.js — 여기서는 불러 쓰기만 */
  const descFold = (...a) => window.SJLOOK && SJLOOK.descFold(...a), prtNode = (...a) => window.SJLOOK && SJLOOK.prtNode(...a);
  /* 같은 기기에서 다른 창·미리 준비된 화면이 저장하면: 이 창이 가진 자료가 옛것 → 보이는 순간 새로 불러옴 (덮어쓰기 방지)
     계획정비·재고·구매·증서·검사는 같은 자료(pms), 위험성 관리는 rsk */
  const DVK = 'sejul_dv_' + TOOL, PAGE = Math.random().toString(36).slice(2, 8); let dvMine = '';
  const dvGet = () => { try { return localStorage.getItem(DVK) || ''; } catch (e) { return ''; } };
  const dvBump = t => { try { dvMine = Date.now() + ':' + PAGE; localStorage.setItem('sejul_dv_' + t, dvMine); } catch (e) { } try { U.saved(); } catch (e) { } };
  const dv0 = dvGet(); let dvStale = false;
  const dvCheck = () => { if (BG || document.hidden || document.prerendering) return; const cur = dvGet(); if (cur && cur !== dv0 && cur !== dvMine && !cur.endsWith(':' + PAGE)) { const a = document.activeElement; if (a && a.matches && a.matches('input,textarea,select') && a.value) { dvStale = true; return; } location.reload(); } };
  if (!BG && !window.SJ_NODV) { document.addEventListener("visibilitychange", dvCheck); document.addEventListener('prerenderingchange', () => setTimeout(dvCheck, 0)); addEventListener('pageshow', e => { if (e.persisted) dvCheck(); }); addEventListener('storage', e => { if (e.key === DVK) setTimeout(dvCheck, 300); }); }
  /* 사무실: 선박을 안 골랐을 때 — 모든 도구 같은 '선박 고르기' 카드 (선대 전체 처리는 승인함·앱 홈) */
  const pickHTML = (sub, tone) => `<div class="sjx-empty"><h2>${T('선박을 고르세요', 'Choose a vessel')}</h2>${T(`사무실 기기는 선박을 하나 골라 그 선박의 ${SUBN()}을(를) 봅니다. 선대 전체 현황은 <a href="../index.html">앱 홈</a>, 결정·서명할 일은 🔔 승인함에 있습니다.`, 'Pick one vessel. The fleet overview is on the <a href="../index.html">app home</a>; approvals are in the inbox.')}<div class="sjx-pick">${U.VES.map(v => `<button data-sjpick="${U.esc(v)}" class="${tone ? tone(v) : ''}"><b>${U.esc(v)}</b><small>${sub(v)}</small></button>`).join('')}</div></div>`;
  const navDeco = () => { try { const pms = TOOL === 'pms', nav = document.querySelector(pms ? '#top .sj-nav' : 'header.top #nav'); if (!nav) return;
      const key = b => pms ? b.dataset.go : b.dataset.v, off = U.role() === 'office', v = off ? (C.get('view') || '') : (C.get('vessel') || '');
      const sp = (U.sum('pms') || {}).ships || {}, s = sp[v] || {}, r = ((U.sum('rsk') || {}).v || {})[v] || {};
      const CNT = pms ? { jobs: [s.od, ''], defects: [s.def, s.defA ? '' : 'y'], spares: [s.low, 'y'] } : { raList: [(r.wait || 0) + (r.stop || 0), r.stop ? '' : 'y'], ptwList: [r.act, 'b'], dpa: [r.wait, 'y'] };
      if (!nav.querySelector('.sjtb-id')) nav.insertAdjacentHTML('afterbegin', `<span class="sjtb-id ${SUB}"><i>${U.ic((U.TOOLS().find(x => x[0] === SUB) || [])[2] || SUB, 17)}</i>${SUBN()}</span>`);
      const btns = [...nav.querySelectorAll(':scope>button, :scope>.sjtb-more .sjtb-mm>button')];
      /* 사무실 DPA·회사 승인 탭 → 승인함(🔔)과 공통 결정 창으로 대체 — 탭 숨김 */
      if (!pms && off) btns.forEach(b => { if (key(b) === 'dpa') b.classList.add('sjx-hid'); });
      btns.forEach(b => { const k = key(b); if (!k) return; if (k === 'dpa' && /승인 코드/.test(b.textContent)) b.textContent = T('DPA·회사 승인', 'Approvals'); if (pms && k === 'home' && /선박 현황|Vessel/.test(b.textContent)) b.textContent = T('홈', 'Home');
        if (!b.querySelector('.sjtb-ic') && TBI[k]) b.insertAdjacentHTML('afterbegin', `<span class="sjtb-ic k-${k}">${U.ic(TBI[k], 16)}</span>`);
        b.querySelectorAll('.sjtb-n').forEach(x => x.remove()); const c = CNT[k]; if (c && c[0]) b.insertAdjacentHTML('beforeend', `<span class="sjtb-n ${c[1]}">${c[0]}</span>`); });
      if (!pms) { let more = nav.querySelector('.sjtb-more'); const mv = []; /* 위험성 식별 보고·등록부는 변화관리 옆 탭으로 그대로 둠 (더보기로 숨기지 않음) */
        if (mv.length) { if (!more) { more = document.createElement('details'); more.className = 'sjtb-more'; more.innerHTML = `<summary>${T('더보기', 'More')} ▾</summary><div class="sjtb-mm"></div>`; nav.appendChild(more); more.addEventListener('click', e => { if (e.target.closest('.sjtb-mm>button')) more.open = false; }); }
          mv.forEach(b => { if (b.parentNode !== more.querySelector('.sjtb-mm')) more.querySelector('.sjtb-mm').appendChild(b); }); more.classList.toggle('on', mv.some(b => b.classList.contains('on'))); } }
      let all = nav.querySelector('.sjtb-all'); if (!all) { nav.insertAdjacentHTML('beforeend', `<button type="button" class="sjtb-all" aria-label="${T('전체 메뉴', 'All sections')}"><span>${U.ic('M4 6h16M4 12h16M4 18h16', 18)}</span></button>`); all = nav.querySelector('.sjtb-all'); all.onclick = e => { e.stopPropagation(); navSheet(nav, key); }; }
      if (window.matchMedia('(max-width: 899px)').matches) setTimeout(() => { const on = nav.querySelector('button.on:not(.sjtb-all)'); if (!on) return; const a = on.getBoundingClientRect(), n = nav.getBoundingClientRect(); if (a.left < n.left || a.right > n.right - 56) nav.scrollLeft += a.left - n.left - 12; }, 60);
    } catch (e) { console.warn('nav', e); } };
  const navSheet = (nav, key) => { let sh = document.querySelector('.sjtb-sh'); if (!sh) { sh = document.createElement('div'); sh.className = 'sjtb-sh'; document.body.appendChild(sh); }
    const bs = [...nav.querySelectorAll('button')].filter(b => !b.classList.contains('sjtb-all') && key(b) && getComputedStyle(b).display !== 'none');
    sh.innerHTML = `<div class="bg"></div><div class="pn"><h3>${TOOL === 'pms' ? T('계획정비', 'Maintenance') : T('위험성 관리', 'Risk')}<button type="button" aria-label="${T('닫기', 'Close')}">✕</button></h3>${bs.map((b, i) => `<button type="button" class="it ${b.classList.contains('on') ? 'on' : ''}" data-i="${i}">${b.innerHTML}</button>`).join('')}</div>`;
    sh.hidden = false; sh.onclick = e => { const it = e.target.closest('.it'); if (it) { sh.hidden = true; bs[+it.dataset.i].click(); return; } if (e.target.closest('.bg,h3 button')) sh.hidden = true; }; };
  const railRefresh = () => { setTimeout(navDeco, 0); const open = document.querySelector('.sjs:not([hidden])'), oc = open && (open.classList.contains('sjmore') ? '.sjmore' : '.sjves'); document.querySelectorAll('.sjr,.sjmob').forEach(x => x.remove()); C.ensureBar(); if (oc) { const sh = document.querySelector('.sjs' + oc); if (sh) sh.hidden = false; } };
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
      if (!BG) { try { const cm0 = commit; commit = function () { const r = cm0.apply(this, arguments); dvBump('pms'); return r; }; } catch (e) { } }   /* 사람이 고친 것만 (켤 때 정리 저장은 제외) */
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
                 ['prt', '🖨 ' + T('출력', 'Print'), [], T('인쇄 · PDF로 저장', 'Print / save as PDF'), 99]];   /* 출력은 prtHead가 제목줄 오른쪽에 하나로 */
      for (const [k, label, acts, hint, min] of G) { const bs = acts.map(a => main.querySelector(`[data-act="${a}"]`)).filter(b => b && !b.closest('.sjx-dd'));
        if (bs.length < (min || 1)) continue; if (k === 'prt') { const lb = { prt9: '📋 ' + T('작업 목록 출력', 'Print job list'), sfiPrint: '🌳 ' + T('SFI 트리 출력', 'Print SFI tree') }; bs.forEach(b => { if (lb[b.dataset.act]) b.innerHTML = lb[b.dataset.act]; b.classList.remove('pri'); }); } const d = document.createElement('details'); d.className = 'sjx-dd'; d.dataset.k = k;
        d.innerHTML = `<summary class="${bs[0].className.replace(/\b(pri|danger|g)\b/g, '')}">${label} ▾</summary><div class="sjx-ddm"><span class="sjx-ddh">${hint}</span></div>`;
        bs[0].parentNode.insertBefore(d, bs[0]); const m = d.querySelector('.sjx-ddm'); bs.forEach(b => m.appendChild(b)); }
      document.querySelectorAll('details.sjx-dd[open]').forEach(d => { if (!d.matches(':hover')) d.open = false; });
      try { PMS.prtHead(); } catch (e) { console.warn('prt', e); }
      try { const ph = document.querySelector('#main .sjx-ph'); if (ph) descFold(ph, ph.querySelector('h1')); } catch (e) { } },
    /* 제목줄 오른쪽 = [가져오기 ▾] [내보내기 ▾] [출력] [+ 주 동작] — 모든 계획정비 화면 같은 순서 */
    prtHead() { const main = document.getElementById('main'); if (!main) return; const r = route();
      if (r === 'home') { const hd = main.querySelector('.sjh-hd'); if (hd && !hd.querySelector('.sjx-prt')) prtNode(hd, hd.querySelector('.sp') ? hd.querySelector('.sp').nextElementSibling : null, [[T('월간 보고서', 'Monthly report'), () => ACT.prt9()]]); return; }
      const act = main.querySelector('.sjx-act'); if (!act) return;
      ['imp', 'exp'].forEach(k => { const d = main.querySelector(`details.sjx-dd[data-k="${k}"]`); if (d && d.parentNode !== act) act.insertBefore(d, act.firstChild); });
      if (act.querySelector('.sjx-prt')) return;
      const L = { prt9: T('이 화면 출력 (목록·계획서·대장)', 'Print this screen'), sfiPrint: T('SFI 트리 출력', 'Print SFI tree'), ckBlankMenu: T('점검표 빈 서식·기록', 'Checklist forms'), clsPrint: T('선급 검사 목록 출력', 'Survey list'), clsBlank: T('선급 검사 빈 서식', 'Blank survey forms') };
      const bs = Object.keys(L).map(k => main.querySelector(`[data-act="${k}"]`)).filter(b => b && !b.closest('table,.modal,#drawer'));
      if (!bs.length) return; const items = bs.map(b => [L[b.dataset.act], () => { if (b.dataset.act === 'prt9') ACT.prt9(); else b.click(); }]);
      const keep = document.createElement('div'); keep.hidden = true; keep.className = 'sjx-hidebtn'; bs.forEach(b => { const dd = b.closest('details.sjx-dd'); keep.appendChild(b); if (dd && !dd.querySelector('[data-act]')) dd.remove(); }); main.appendChild(keep);
      const pri = [...act.children].find(x => x.matches('.btn.pri,.pri')); prtNode(act, pri || null, items); },
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
      const r = route(), lab = e => { const c = e.classList; if (c.contains('toolbar')) return e.querySelector('input') ? T('검색', 'Search') : T('작업', 'Actions'); if (c.contains('sfibar')) return T('SFI 분류', 'SFI group');
          if (c.contains('dfsub')) return T('진행 단계', 'Step'); if (c.contains('tabs9') || c.contains('caltabs')) return T('보기', 'View'); if (c.contains('chips')) return r === 'spares' ? T('구분', 'Category') : T('상태', 'Status'); return T('필터', 'Filter'); };
      const DOT = { od: '#E5484D', d7: '#E0A100', d30: '#D4B44A', nd: '#9AA4B2', ok: '#2FA36B', all: '#9AA4B2', def: '#E5484D', low: '#E5484D', crit: '#E0A100' };   /* 상태 색 한 벌 (위험성 관리와 같음) */
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
        main.innerHTML = pickHTML(v => OFFICE.ships[v] ? (S[v] ? (SUB === 'inv' ? T(`재고 부족 ${S[v].low || 0} · 청구 ${(S[v].O || []).filter(x => x[0] === 'req').length}`, `Low ${S[v].low || 0}`) : SUB === 'cert' ? T(`선급 검사 할 일 ${(S[v].O || []).concat(S[v].S || []).filter(x => x[0] === 'cls').length}`, 'Surveys') : T(`기한 초과 ${S[v].od} · 미결 결함 ${S[v].def}`, `Overdue ${S[v].od} · defects ${S[v].def}`)) : T('자료 있음', 'Has data')) : T('아직 받은 자료 없음', 'No data yet'), v => S[v] && (SUB === 'pms' ? S[v].od : SUB === 'inv' ? S[v].low : 0) ? 'r' : ''); return; }
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
      else if (want === 'ship' && v && !SHIP && ACT.v9pickVessel) {   /* 저장된 자료를 다 읽기 전에 새 선박 자료를 만들면 기존 자료를 덮어씀 → 저장소를 먼저 확인 */
        (async () => { try { if (KV.open && !KV.db) await KV.open(); const x = await KV.get('ship'); if (SHIP) return; if (x && x.ship && x.ship.name === v) { SHIP = x; render(); return; } } catch (e) { } if (SHIP) return;
          const b = document.createElement('button'); b.dataset.name = v; ACT.v9pickVessel(b);
          setTimeout(() => { const m = document.querySelector('#mback .modal:last-child'), ok = m && m.querySelector('.mf button:last-child'); if (SHIP) { if (m && m._close) m._close(); return; } if (ok && /선박|vessel/i.test(m.textContent || '')) ok.click(); }, 60); })(); }
      if (ch) render(); },
    view(v) { if (MODE !== 'admin') return; if (!v) { location.href = '../index.html'; return; } if (OFFICE.ships[v]) OFFICE.sel = v; location.hash = '#/home'; render(); },
    /* 계획정비 홈 — 앱 공통 홈 틀 (머리말 · 오늘 할 일 · 숫자 카드 · 처리할 일 · 빠른 작업 · 접어 둔 도구별 칸) */
    home() { if (route() !== 'home') return; const main = document.getElementById('main'); if (!main || main.querySelector(':scope>.sjh')) return;
      const off = MODE === 'admin', db = off ? OFFICE.ships[C.get('view') || OFFICE.sel] : SHIP; if (!db) return;
      try { PMS.sum(); } catch (e) { } const v = db.ship.name, sp = U.sum('pms'), s = sp && sp.ships && sp.ships[v], H = U.H, c = shipStats(db).c;
      const d = k => ({ d: { v9due: k } }), hh = k => ({ d: { sjgo: k } });
      const items = U.items(v, '../').filter(x => x.k !== 'r');
      const quick = H.quick(off ? [{ d: { sjgo: 'defects' }, bg: 'var(--sj-red-bg,#FDECEC)', fg: 'var(--sj-red-fg,#C62828)', ic: 'M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z', t: T('결함 확인·서명', 'Review defects'), sub: T('선박이 보낸 결함 보고', 'Defect reports from the ship') },
        { d: { sjgo: 'spares' }, bg: 'var(--sj-grn-bg,#E6F5EC)', fg: 'var(--sj-grn-fg,#1E7A45)', ic: 'M3 7h18M6 7v13h12V7M9 11h6', t: T('청구서 처리', 'Requisitions'), sub: T('접수 · 발주 · 취소', 'Ack · order · cancel') },
        { d: { act: 'monthlyReport' }, bg: 'var(--sj-blu-bg,#E8F0FB)', fg: 'var(--sj-tx,#1A2233)', ic: 'M7 3h7l5 5v13H7zM14 3v5h5', t: T('월간 보고서', 'Monthly report'), sub: T('출력', 'Print') }]
        : [{ d: { v9due: 'od' }, bg: 'var(--sj-blu-bg,#E8F0FB)', fg: 'var(--sj-tx,#1A2233)', ic: 'M20 6 9 17l-5-5', t: T('작업 실시 입력', 'Record a job'), sub: T('기한 초과부터', 'Overdue first') },
        { d: { act: 'defNew' }, bg: 'var(--sj-red-bg,#FDECEC)', fg: 'var(--sj-red-fg,#C62828)', ic: 'M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z', t: T('결함 등록', 'Report a defect'), sub: T('결함 보고서 STEP 1~7', 'Defect report steps 1–7') },
        { d: { sjgo: 'ck' }, bg: 'var(--sj-amb-bg,#FFF6D6)', fg: 'var(--sj-amb-fg,#8A6400)', ic: 'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11', t: T('점검표 입력', 'Checklists'), sub: T('회사 서식 9종', 'Company forms') },
        { d: { act: 'reqNew' }, bg: 'var(--sj-grn-bg,#E6F5EC)', fg: 'var(--sj-grn-fg,#1E7A45)', ic: 'M3 7h18M6 7v13h12V7M9 11h6', t: T('청구서 작성', 'New requisition'), sub: T('예비품 · 선용품', 'Spares · stores') },
        { d: { act: 'monthlyReport' }, bg: 'var(--sj-sf2,#F7F9FC)', fg: 'var(--sj-tx2,#4A5568)', ic: 'M7 3h7l5 5v13H7zM14 3v5h5', t: T('월간 보고서', 'Monthly report'), sub: T('출력', 'Print') }]);
      const keep = { sfi: [...main.querySelectorAll('.sech,.sfitiles')], grp: [...main.querySelectorAll('.homeg')] };
      const w = document.createElement('div'); w.className = 'sjh';
      w.innerHTML = H.page({ kicker: U.esc(v) + ' · ' + new Date().toLocaleDateString(T('ko-KR', 'en-GB'), { month: 'long', day: 'numeric', weekday: 'short' }), title: T('계획정비', 'Planned maintenance'), actions: off ? '' : H.btn('＋ ' + T('결함 등록', 'Report defect'), { d: { act: 'defNew' } }) + ' ' + H.btn(T('📝 실시 입력', '📝 Record job'), d('od'), true) })
        + U.pmsHero(s, v, d, off) + U.pmsKpis(s, d, hh)
        + (s && s.fw ? H.cols(H.card(T('앞으로 기한', 'Coming due') + ` <small>${T('주별 작업 수', 'jobs per week')}</small>`, U.chart.cols(s.fw, null, { ranges: [8, 12, 26], key: 'pmsfw', tone: 'warn', aria: T('앞으로 주별 기한 작업 수', 'Jobs due per week'), empty: T('이 기간에 기한이 오는 작업이 없습니다', 'Nothing due in this range') })), H.card(T('최근 실시', 'Recently done') + ` <small>${T('주별 실시 기록', 'records per week')}</small>`, U.chart.cols(s.wk || [], null, { ranges: [8, 12, 26], r: 12, back: 1, key: 'pmswk', tone: 'ok', empty: T('이 기간에 실시 기록이 없습니다 — 실시 입력을 하면 여기에 쌓입니다', 'No work recorded in this range'), aria: T('주별 실시 기록 수', 'Records per week') }))) : '')
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
          /* 그래프: 최근 12주 실시 건수 · 앞으로 8주 기한 건수 */
          /* 실시율: 월간 보고서와 같은 계산 (실시 ÷ (계획 − 아직 기한 전)) — 이번 달 · 지난달 */
          mr: (() => { try { if (typeof mrData !== 'function') return null; const t = today(), ym = t.slice(0, 7), d = new Date(Number(ym.slice(0, 4)), Number(ym.slice(5, 7)) - 2, 1), pm = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); return [ym, pm].map(m => { const r = mrData(db, m); return [m, r.plan, r.done, r.pend]; }); } catch (e) { return null; } })(),
          wk: (() => { const a = Array(26).fill(0), t0 = Date.parse(today()); (db.hist || []).forEach(h => { const d = Math.floor((t0 - Date.parse(h.date)) / (7 * 864e5)); if (d >= 0 && d < 26) a[25 - d]++; }); return a; })(),
          fw: (() => { const a = Array(26).fill(0), t0 = Date.parse(today()); try { calcAll(db).forEach(x => { if (!x.s.due) return; const d = Math.floor((Date.parse(x.s.due) - t0) / (7 * 864e5)); if (d >= 0 && d < 26) a[d]++; }); } catch (e) { } return a; })(),
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
        : off && r.wait ? { tone: 'y', title: `${T('회사 승인 대기', 'Awaiting approval')} <em class="y">${r.wait}</em>${T('건', '')}`, sub: T('선박이 보낸 위험성 평가·MoC 승인 요청입니다.', 'Approval requests from the ship.'), btn: { label: T('검토·결정 →', 'Review →'), d: { sjinb: 'apv' } } }
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
      const quick = H.quick((off ? [] : [{ d: { a: 'newRA' }, bg: 'var(--sj-blu-bg,#E8F0FB)', fg: 'var(--sj-tx,#1A2233)', ic: 'M12 5v14M5 12h14', t: T('새 작업 시작 (위험성 평가)', 'Start work (RA)'), sub: T('작업 선택 → RA → TBM → PTW → 출력', 'RA → TBM → PTW → print') },
        { d: { a: 'contOpen' }, bg: 'var(--sj-grn-bg,#E6F5EC)', fg: 'var(--sj-grn-fg,#1E7A45)', ic: 'M5 3l14 9-14 9z', t: T('진행 중 작업 이어서 하기', 'Continue work') + (cont.length ? ` (${cont.length})` : ''), sub: T('작성 중인 RA·PTW', 'Drafts and active permits') }])
        .concat([{ d: { a: 'newMoC' }, bg: 'var(--sj-pur-bg,#F1ECFB)', fg: 'var(--sj-blu-fg,#1D5FAE)', ic: 'M4 4v6h6M20 20v-6h-6M20 9A8 8 0 0 0 5.6 5.6L4 10M4 15a8 8 0 0 0 14.4 3.4L20 14', t: T('변화관리(MoC) 제안', 'Management of Change'), sub: T('변화평가표 · 점검표 · 긴급 MoC', 'Change form · checklist') },
          { d: { a: 'newRIR' }, bg: 'var(--sj-amb-bg,#FFF6D6)', fg: 'var(--sj-amb-fg,#8A6400)', ic: 'M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z', t: T('위험성 식별 보고', 'Risk identification report'), sub: T('새 위험 발견 시 선장 보고', 'Report a new hazard') },
          { d: { a: 'blankForms' }, bg: 'var(--sj-sf2,#F7F9FC)', fg: 'var(--sj-tx2,#4A5568)', ic: 'M6 9V3h12v6M6 18H4v-6h16v6h-2M8 14h8v7H8z', t: T('빈 양식 출력', 'Blank forms'), sub: T('F-RSK 6종 · F-SAF 7종', 'F-RSK ×6 · F-SAF ×7') }]));
      let band = '', crewX = ''; try { if (!off) { const nC = (DB.settings.crew || []).length; if (nC) crewX = H.extra('👥 ' + T(`승무원 명단 (Crew List) · ${nC}명`, `Crew list · ${nC}`), crewCardHTML(), 'sjhCrew'); else band = crewCardHTML(); } } catch (e) { }
      return `<div class="sjh">${H.page({ kicker: (vn ? U.esc(vn) + ' · ' : '') + (typeof today === 'function' ? today() : ''), title: off ? T('위험성 관리 · 회사 승인', 'Risk · approvals') : T('위험성 관리', 'Risk management'), actions: off ? H.btn(T('승인함 →', 'Approvals →'), { d: { sjinb: 'apv' } }, true) : H.btn('＋ ' + T('새 작업 시작', 'Start work'), { d: { a: 'newRA' } }, true) })}
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
      /* 사무실 — 공통 결정 창 (승인함·홈·알림에서 열림): 위험성 평가 DPA 승인 / MoC 회사 승인 — 계획정비의 연기·청구·결함과 같은 모양 */
      A.sjApprove0 = A.sjApprove;
      A.sjApprove = d => { if (DB.settings.site !== 'office' || !U.decide) return A.sjApprove0(d); try { return RSK.decide(d.id); } catch (e) { console.warn('decide', e); return A.sjApprove0(d); } };
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
    decide(id) { const ra = (DB.ras || []).find(x => x.id === id), m = ra ? null : (DB.mocs || []).find(x => x.id === id); if (!ra && !m) return toast(T('항목을 찾지 못했습니다 — 동기화 후 다시', 'Not found — try after sync'));
      const q = ra ? dqFromRA(ra) : dqAdd({ kind: 'moc', raNo: m.no, rq: mocRq(m), vessel: m.vessel, task: m.title, mocId: m.id, reason: T('변화관리 회사 승인', 'MoC company approval') }); save();
      const hi = q.kind !== 'moc' && dqHigh(q), stx = ra ? raStatus(ra) : mocStatus(m), tone = { wait: 'wait', stop: 'rej', ok: 'ok', act: 'prog', draft: 'draft', done: 'done' }[stx[0]] || 'prog';
      const TY = { prejob: T('작업 전 위험성 평가', 'Pre-job RA'), periodic: T('정기 위험성 평가', 'Periodic RA'), unplanned: T('비계획 / 임시 평가', 'Unplanned RA'), simops: T('동시작업 (SIMOPS)', 'SIMOPS') };
      const rows = ra ? [[T('평가 구분', 'Type'), U.esc(TY[ra.type] || ra.type || '')], [T('작업 장소', 'Location'), U.esc(ra.location || '-')], [T('작업 예정일', 'Work date'), U.esc(ra.workDate || ra.date || '-')], [T('평가팀', 'Team'), U.esc((ra.team || []).map(x => typeof x === 'string' ? x : [x.rank, x.name].filter(Boolean).join(' ')).join(', ') || '-')],
          [T('작업허가', 'Permits'), U.esc((ra.ptw || []).join(', ') || '-')], [T('위험도', 'Risk'), `${T('초기', 'Initial')} ${gb(maxG(ra.hazards.map(hzI)))} → ${T('잔여', 'Residual')} ${gb(raMaxR(ra))}`], [T('승인 사유', 'Why DPA'), U.esc(q.reason || '-')], [T('선장 승인', 'Master'), U.esc([ra.apv.master, ra.apv.masterDate].filter(Boolean).join(' · ') || '-')]]
        : [[T('구분', 'Category'), U.esc([m.cat, m.cls].filter(Boolean).join(' · '))], [T('제안자', 'Proposed by'), U.esc([m.proposerRank, m.proposer, m.date].filter(Boolean).join(' · '))], [T('필요성', 'Need'), U.esc(m.need || '-')], [T('변경 내용', 'Change'), U.esc(m.content || '-')], [T('영향', 'Impact'), U.esc(m.impact || '-')], [T('기간', 'Duration'), U.esc(m.dur === 'temp' ? T('임시', 'Temporary') + ` ${m.start || ''} ~ ${m.end || ''}` : T('영구', 'Permanent'))]];
      const hz = ra && ra.hazards.length ? U.sjdTable(['#', T('위험 요인', 'Hazard'), T('초기', 'Initial'), T('감소 대책', 'Controls'), T('잔여', 'Residual')], ra.hazards.map((h, i) => [i + 1, `<b>${U.esc(h.hazard)}</b>`, gb(hzI(h)), h.controls.map(c => U.esc(c.t)).join('<br>'), gb(hzR(h))])) : '';
      const last = ra && ra.apv.lastReject ? [[ra.apv.lastReject.at, ra.apv.lastReject.name, T('이전 반려: ', 'Returned before: ') + (ra.apv.lastReject.items || '')]] : [];
      const run = dec => v => { if (dec === 'ok' && hi) return T('잔여 위험 "높음" — 조건부 승인 또는 반려만 가능합니다 (RSK-P-01 3.4)', 'Residual High: conditional approval or return only');
        Object.assign(q, { dec, dpaName: v.name, cond: v.cond, code: apvCode(q.rq, dec, q.kind === 'moc' ? 'MOC' : ''), decAt: today(), updatedAt: Date.now() }); DB.settings.dpaName = v.name;
        if (m) { mocApplyRec(m, dec, q.dpaName, q.cond, f6(q.code)); touch(m); }
        if (ra) { if (dec === 'reject') ra.apv.lastReject = { at: nowLocal(), name: q.dpaName, items: q.cond }; Object.assign(ra.apv, { dpaDecision: dec, dpaName: q.dpaName, dpaDecDate: q.decAt, dpaComment: q.cond, dpaCode: q.code, rq: q.rq }); dpaApply(ra); touch(ra); }
        save(); render(); toast(T('결정을 저장했습니다 — 선박으로 전달됩니다', 'Decision saved — sent to the ship')); };
      U.decide({ kind: ra ? T('위험성 평가 · DPA 승인', 'Risk assessment · DPA') : T('변화관리 · 회사 승인', 'MoC · company approval'), tool: 'rsk', vessel: (ra || m).vessel, no: (ra || m).no, title: String((ra || m).title || '').split(' / ')[0], sub: hi ? `<b style="color:var(--sj-red-fg,#C62828)">${T('잔여 위험 "높음" — 조건 없는 승인 불가', 'Residual High — plain approval not allowed')}</b>` : '', st: [stx[1], tone],
        rows, secs: [{ h: T('위험 요인 · 대책', 'Hazards & controls'), html: hz }], hist: last,
        fields: [{ id: 'name', label: T('DPA 성명', 'DPA name'), value: DB.settings.dpaName || '', req: 1 }, { id: 'cond', label: T('승인 조건 / 보완 요청 사항 (한 줄에 하나 — 조건부·반려 시 필수)', 'Conditions / items to revise (one per line)'), type: 'ta', value: q.cond || '' }],
        acts: [{ k: 'open', label: T('문서 전체 보기', 'Open document'), tone: 'neu', run: () => { A.open({ k: ra ? 'ra' : 'moc', id }); } },
          { k: 'reject', label: '↩ ' + T('반려', 'Return'), tone: 'rej', need: ['name', 'cond'], run: run('reject') }, { k: 'cond', label: T('조건부 승인', 'Approve w/ conditions'), tone: 'cond', need: ['name', 'cond'], run: run('cond') },
          { k: 'ok', label: '✓ ' + T('승인', 'Approve'), tone: 'ok', need: ['name'], off: hi ? T('잔여 위험 높음 — 조건부 승인 또는 반려', 'Residual High') : '', run: run('ok') }] }); },
    shipStep() { if (DB.settings.site === 'office') return; const k = document.querySelector('[data-a=dpaKakao]'); if (!k) return; const box = k.closest('.stepbox'); if (!box || box.dataset.sj) return;
      const S = DB.settings; box.dataset.sj = 1; box.outerHTML = `<div class="sjx-srv">📡 <b>${T('DPA 승인 요청 — 서버로 자동 전달됨', 'DPA approval requested via the server')}</b><br>${T('DPA가 사무실 앱에서 결정하면 이 화면에 바로 반영되고 알림이 옵니다. 요청번호·승인 코드·카톡·메일은 필요 없습니다.', 'The DPA decides in the office app; the result appears here with a notification. No request number, code, chat or e-mail needed.')}${S.dpaPhone ? ` <span class="sub">(${T('급하면 DPA에게 전화', 'urgent: call the DPA')} ☎ ${U.esc(S.dpaPhone)})</span>` : ''}</div>`;
      const c = document.getElementById('dpaCodeIn'); if (c) { const b2 = c.closest('.stepbox'); if (b2) b2.style.display = 'none'; } },
    sum() { const by = {}, g = n => by[n] = by[n] || { draft: 0, wait: 0, stop: 0, act: 0, moc: 0, items: [] };
      const st = (f, x) => { try { return f(x)[0]; } catch (e) { return ''; } };
      (DB.ras || []).forEach(r => { const k = st(raStatus, r), b = g(r.vessel || '—'); if (b[k] != null && k !== 'act') { b[k]++; if (b.items.length < 10) b.items.push([k, r.id, (r.no ? r.no + ' ' : '') + (r.title || '')]); } });
      (DB.ptws || []).forEach(p => { if (st(ptwStatus, p) !== 'act') return; const b = g(p.vessel || '—'); b.act++; const e = p.to ? new Date(p.to) : null; if (e && !isNaN(e)) (b.ptw = b.ptw || []).push({ id: p.id, no: p.no || 'PTW', t: String(p.desc || p.location || '').slice(0, 60), end: e.toISOString() }); });
      (DB.ras || []).forEach(r => { const dec = r.apv && r.apv.dpaDecision; if (dec) (g(r.vessel || '—').dpa = g(r.vessel || '—').dpa || []).push({ id: r.id, no: r.no || '', t: String(r.title || '').slice(0, 60), dec }); });
      (DB.mocs || []).forEach(m => { if (!(m.close && m.close.apvDate)) g(m.vessel || '—').moc++; let ms = ''; try { ms = mocStatus(m)[0]; } catch (e) { } if (ms === 'wait' && m.cls !== 'emg') { const b = g(m.vessel || '—'); b.wait++; if (b.items.length < 12) b.items.push(['mocw', m.id, 'MoC ' + (m.no || '') + ' ' + (m.title || '')]); } });
      /* 월별 건수 (월간 보고서용): 위험성 평가 · 작업허가 · TBM · MoC */
      const mo = (v, d, k) => { const ym = String(d || '').slice(0, 7); if (!/^\d{4}-\d{2}$/.test(ym)) return; const b = g(v || '—'); b.mo = b.mo || {}; (b.mo[ym] = b.mo[ym] || { ra: 0, ptw: 0, tbm: 0, moc: 0 })[k]++; };
      (DB.ras || []).forEach(r => { mo(r.vessel, r.date, 'ra'); if (r.tbm && r.tbm.date) mo(r.vessel, r.tbm.date, 'tbm'); }); (DB.ptws || []).forEach(p => mo(p.vessel, p.from || p.issuedAt, 'ptw')); (DB.mocs || []).forEach(m => mo(m.vessel, m.date || m.propDate, 'moc'));
      localStorage.setItem('sejul_sum_rsk', JSON.stringify({ at: Date.now(), site: DB.settings.site, crew: (DB.settings.crew || []).length, v: by }));
      try { const ix = {}, cut = x => String(x || '').slice(0, 80), add = (k, x, t) => ((ix[x.vessel || '—'] = ix[x.vessel || '—'] || []).push([k, x.id, x.no || '', cut(t)]));
        (DB.ras || []).forEach(x => add('ra', x, x.title)); (DB.ptws || []).forEach(x => add('ptw', x, x.desc || x.location)); (DB.mocs || []).forEach(x => add('moc', x, x.title)); (DB.rirs || []).forEach(x => add('rir', x, x.desc));
        localStorage.setItem('sejul_idx_rsk', JSON.stringify({ at: Date.now(), v: ix })); } catch (e) { } },
    /* 출력 버튼 자리 통일: 모든 화면 제목줄 오른쪽 (주 버튼 왼쪽) — 목록 화면은 대장 출력, 문서 화면은 그 문서 출력 */
    prtHead() { const main = document.getElementById('main'), ph = main && (main.querySelector(':scope>.page-h') || main.querySelector('.sjh-hd')); if (!ph || ph.querySelector('.sjx-prt')) return;
      const vn = VIEW.name, LIST = ['home', 'raList', 'ptwList', 'mocList', 'rirList', 'register', 'dpa'], items = [];
      const own = [...document.querySelectorAll('#main button[data-a], #foot button[data-a]')].filter(b => !ph.contains(b) && !b.closest('table,.modal,.sjx-prt') && (/^(print|pkgPdf)/i.test(b.dataset.a) || /^\s*🖨/.test(b.textContent)));
      own.forEach(b => items.push([b.textContent.replace(/^\s*🖨\s*/, '').trim(), () => b.click()]));
      if (!own.length) { const st = [...main.querySelectorAll('.steps button')].find(b => /출력|Print/.test(b.textContent)); if (st) items.push([T('출력 단계로 가기 — 문서 고르기', 'Go to the print step'), () => st.click()]); }
      if (LIST.includes(vn)) { const R = [['printRegShip', T('위험성 등록부 (F-RSK-02 발췌)', 'Risk register (F-RSK-02)')], ['printMoCReg', T('변화관리 대장 (F-RSK-06)', 'MoC register (F-RSK-06)')], ['printPtwLog', T('작업허가서(PTW) 발행 대장', 'PTW log')]];
        const first = vn === 'ptwList' ? 'printPtwLog' : vn === 'mocList' ? 'printMoCReg' : 'printRegShip'; R.sort((a, b) => (b[0] === first) - (a[0] === first));
        R.forEach(([fn, l]) => { if (!items.some(x => x[0] === l) && typeof A[fn] === 'function') items.push([l, () => A[fn]({}, null, null)]); }); }
      if (!items.length) return; const sp = ph.querySelector(':scope>.sp'), pri = ph.querySelector('.btn.p, .btn.big, .sjh-btn') || (sp && sp.nextElementSibling && sp.nextElementSibling.matches('.btn') ? sp.nextElementSibling : null); prtNode(ph, pri, items); },
    /* 엑셀·PDF 라이브러리: 도구에 넣지 않고 앱 공용 파일(../lib)을 필요할 때만 불러옴 — 계획정비와 같이 씀, 업데이트 때 다시 받지 않음 */
    libs() { try { needLib = async k => { const ld = n => new Promise((ok, no) => { if (document.querySelector(`script[data-sjlib="${n}"]`)) return ok(); const sc = document.createElement('script'); sc.src = '../lib/' + n; sc.dataset.sjlib = n; sc.onload = ok; sc.onerror = () => { sc.remove(); no(new Error(T('엑셀·PDF 기능을 불러오지 못했습니다 — 인터넷에 연결된 상태에서 한 번 열면 그 뒤로는 인터넷 없이도 됩니다', 'Could not load the Excel/PDF library — open once while online'))); }; document.head.appendChild(sc); });
        if (k === 'xlsx' && !window.XLSX) await ld('xlsx.full.min.js'); if (k === 'pdf' && !window.pdfjsLib) { await ld('pdf.worker.min.js'); await ld('pdf.min.js'); } }; } catch (e) { console.warn('libs', e); } },
    hookRender() { if (!BG) { try { const s0 = save; save = function () { dvBump('rsk'); return s0.apply(this, arguments); }; } catch (e) { } }
      const r0 = render; render = function () { const v = C.get('view') || '', off = DB.settings.site === 'office', K = ['ras', 'ptws', 'mocs', 'rirs'], keep = {};
        if (off && v) K.forEach(k => { keep[k] = DB[k] || []; DB[k] = keep[k].filter(x => x.vessel === v); });   /* 사무실: 고른 선박만 보이게 (그리는 동안만) */
        let x; try { x = r0.apply(this, arguments); } finally { if (off && v) K.forEach(k => { const shown = DB[k]; DB[k] = keep[k].filter(y => y.vessel !== v || shown.includes(y)).concat(shown.filter(y => !keep[k].includes(y))); }); }
        try { if (off && v) { const h = document.querySelector('.page-h h2'); if (h && !h.querySelector('.sjv')) h.insertAdjacentHTML('beforeend', ` <span class="sjv" style="font-size:14px;color:var(--sj-tx2,#4A5568);font-weight:500">· ${U.esc(v)}</span>`); } } catch (e) { }
        try { if (off && !v && ['home', 'raList', 'ptwList', 'mocList', 'rirList'].includes(VIEW.name)) { const sr = (U.sum('rsk') || {}).v || {}, m = document.getElementById('main');
            if (m) { m.innerHTML = pickHTML(n => { const r = sr[n]; return r ? T(`승인 대기 ${r.wait || 0} · 작업 중 PTW ${r.act || 0} · 진행 MoC ${r.moc || 0}`, `Waiting ${r.wait || 0} · PTW ${r.act || 0} · MoC ${r.moc || 0}`) : T('아직 받은 자료 없음', 'No data yet'); }, n => (sr[n] || {}).wait ? 'y' : ''); const f = document.getElementById('foot'); if (f) f.innerHTML = ''; } } } catch (e) { console.warn('pick', e); }
        try { RSK.shipStep(); } catch (e) { }
        try { RSK.prtHead(); } catch (e) { console.warn('prt', e); }
        try { const ph = document.querySelector('#main>.page-h'); if (ph) descFold(ph, ph.querySelector('h2')); } catch (e) { }
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
    if (X === RSK) RSK.libs();
    X.hookRender(); try { render(); } catch (e) { } C.booted = 1;
    C.ensureBar(); setInterval(C.ensureBar, 1000); setInterval(U.syncPaint, 20e3); setTimeout(C.ready, 150);
    U.onView = v => { try { X.view(v); } catch (e) { } railRefresh(); };
    /* 미리 준비된(prerender) 화면을 열 때: 그 사이 사무실에서 고른 선박이 바뀌었으면 맞춤, 요약·메뉴 새로 */
    if (document.prerendering) { const k = () => U.role() === 'office' ? (C.get('view') || '') : (C.get('vessel') || ''), v0 = k();
      document.addEventListener('prerenderingchange', () => { try { const v = k(); if (v !== v0) U.onView(v); else { railRefresh(); try { render(); } catch (e) { } } } catch (e) { } }, { once: true }); }
    /* PTW 만료 30분 전 — 이 기기에서 위험성 관리를 열어 둔 동안 (인터넷 없어도) */
    if (X === RSK && !BG) setInterval(() => { try { if (!('Notification' in window) || Notification.permission !== 'granted' || DB.settings.site === 'office') return; const pf = SJCLOUD.prefs ? SJCLOUD.prefs() : {}; if ((pf.types || {}).ptw === false) return; if (pf.quiet && !pf.ptw) { const d = new Date(), m = d.getHours() * 60 + d.getMinutes(), f = pf.from, t2 = pf.to; if (f !== t2 && (f < t2 ? m >= f && m < t2 : m >= f || m < t2)) return; } const v = vesselName(), now = Date.now(); let seen = {}; try { seen = JSON.parse(localStorage.getItem('sejul_ptw_alerted') || '{}'); } catch (e) { }
      (DB.ptws || []).forEach(p => { if (p.vessel !== v || ptwStatus(p)[0] !== 'act' || !p.to) return; const e = new Date(p.to).getTime(), k = p.id + ':' + p.to; if (seen[k] || e - now > 30 * 60e3 || now - e > 10 * 60e3) return; seen[k] = now;
        navigator.serviceWorker && navigator.serviceWorker.ready.then(reg => reg.showNotification(v + ' — ' + T('PTW 곧 만료', 'Permit expiring'), { body: (p.no || 'PTW') + ' ' + (p.desc || p.location || '') + ' — ' + String(p.to).slice(11, 16) + T(' 만료', ' expires'), tag: 'ptw-' + p.id, icon: '../sj2-icon-192.png', data: { url: 'tools/rsk.html' } })); });
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
  /* ===== 긴 표 가볍게: 100줄 넘는 표는 80줄만 먼저 그리고, 아래로 내리면 200줄씩 더 보여 줌 (출력·검색은 전체 대상) ===== */
  try { if (!BG) { const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting && e.target._more) e.target._more(); }), { rootMargin: '600px' }) : null;
      const lazy = () => { document.querySelectorAll('body #main table > tbody').forEach(tb => { if (tb._lz || tb.rows.length <= 100 || tb.querySelector('tr.invg')) return;   /* 접고 펼치는 분류 표는 제외 */ tb._lz = 1; const rows = [...tb.rows]; let n = 80; rows.slice(n).forEach(r => r.classList.add('sjlz'));
          const tbl = tb.parentNode, m = document.createElement('button'); m.type = 'button'; m.className = 'sjlz-more';
          const lab = () => { m.textContent = T(`아래로 내리면 더 보입니다 — 남은 ${rows.length - n}줄 (누르면 바로 보기)`, `Scroll for more — ${rows.length - n} rows left (tap to show)`); };
          m._more = () => { rows.slice(n, n + 200).forEach(r => r.classList.remove('sjlz')); n += 200; if (n >= rows.length) { if (io) io.unobserve(m); m.remove(); } else lab(); };
          m.onclick = () => { while (m.isConnected) m._more(); }; lab(); (tbl.closest('.tw') || tbl).after(m); if (io) io.observe(m); }); };
      let lt; const kick = () => { clearTimeout(lt); lt = setTimeout(lazy, 60); };
      const st2 = document.createElement('style'); st2.textContent = 'tr.sjlz{display:none}.sjlz-more{display:block;width:100%;margin:8px 0 16px;padding:10px;border:1px dashed var(--sj-bd2,#C9D1DD);border-radius:10px;background:var(--sj-sf2,#F7F9FC);color:var(--sj-tx2,#4A5568);font-size:13px;cursor:pointer}@media print{tr.sjlz{display:table-row!important}.sjlz-more{display:none!important}}'; document.documentElement.appendChild(st2);
      addEventListener('load', () => { const m = document.querySelector('body #main'); if (m) { new MutationObserver(kick).observe(m, { childList: true, subtree: true }); kick(); } });
      /* 찾기(Ctrl+F)·출력 전에는 전부 펼침 */
      addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && (e.key === 'f' || e.key === 'p')) document.querySelectorAll('.sjlz-more').forEach(m => m.click()); }, true); addEventListener('beforeprint', () => document.querySelectorAll('.sjlz-more').forEach(m => m.click())); } } catch (e) { console.warn('lazy rows', e); }
  /* ===== 휴대폰 간단 화면 — 현장 기록 (작업 실시 완료 · 예비품 사용 · 대기 측정 · 서명) =====
     작성·편집·출력·첨부는 PC·태블릿에서 (sjphone.css 가 해당 단추를 숨김). 여기는 휴대폰에서 고르기 쉬운 목록 창만 만듦 */
  const PH = (() => { let box = null, st = null;
    const ready = () => TOOL === 'pms' ? (typeof cur === 'function' && cur()) : (typeof DB !== 'undefined' && DB && DB.ras);
    const wait = (f, n = 0) => { if (ready()) return f(); if (n > 60) return; setTimeout(() => wait(f, n + 1), 400); };
    function sheet(o) { st = o; if (!box) { box = document.createElement('div'); box.className = 'sjph'; document.body.appendChild(box);
        box.addEventListener('click', e => { if (e.target.closest('[data-phx]')) return close(); const f = e.target.closest('[data-phf]'); if (f) { st.f = f.dataset.phf; return paint(); }
          const r = e.target.closest('[data-phi]'); if (r) { const id = r.dataset.phi; box.hidden = true; try { st.pick(id); } catch (er) { console.warn(er); } reopen(); } });
        box.addEventListener('input', e => { if (e.target.matches('[data-phq]')) { st.q = e.target.value; paintList(); } }); }
      st.f = st.f || (st.filters ? st.filters[0][0] : ''); st.q = '';
      box.innerHTML = `<div class="sjph-h"><b>${st.title}</b><button type="button" data-phx aria-label="${T('닫기', 'Close')}">✕</button></div><div class="sjph-s">${st.search ? `<input type="search" data-phq placeholder="${st.search}" autocomplete="off">` : ''}${st.filters ? `<div class="sjph-f"></div>` : ''}${st.note ? `<small style="color:var(--sj-tx3,#6B7588)">${st.note}</small>` : ''}</div><div class="sjph-l" role="list"></div>`;
      box.hidden = false; paint(); }
    function paint() { const f = box.querySelector('.sjph-f'); if (f) f.innerHTML = st.filters.map(([k, l]) => `<button type="button" data-phf="${k}" class="${st.f === k ? 'on' : ''}">${l}</button>`).join(''); paintList(); }
    function paintList() { let L = []; try { L = st.items(st.f, (st.q || '').trim().toLowerCase()); } catch (e) { console.warn(e); }
      box.querySelector('.sjph-l').innerHTML = L.length ? L.slice(0, 200).map(x => `<button type="button" class="sjph-r" role="listitem" data-phi="${U.esc(x.id)}"><span class="tx"><b>${U.esc(x.t)}</b>${x.s ? `<small>${U.esc(x.s)}</small>` : ''}</span>${x.bd ? `<span class="bd ${x.bc || 'n'}">${U.esc(x.bd)}</span>` : ''}${U.ic('M9 18l6-6-6-6', 18)}</button>`).join('') + (L.length > 200 ? `<div class="sjph-e">${T('200건까지 보입니다 — 검색으로 좁히세요', 'First 200 shown — narrow with search')}</div>` : '')
        : `<div class="sjph-e">${st.empty || T('해당 항목이 없습니다', 'Nothing here')}</div>`; }
    /* 고른 뒤 열린 입력 창이 닫히면 목록으로 돌아옴 (방금 기록한 것은 목록에서 빠짐) */
    function reopen() { if (st.stay === false) return; let n = 0; const iv = setInterval(() => { n++; const open = [...document.querySelectorAll('#mback .modal,.modal-bg .modal,.sgpanel-bg,.sjd:not([hidden])')].some(m => m.offsetParent || (m.style && m.style.display === 'flex'));
        if (!open && n > 2) { clearInterval(iv); if (box && st) { box.hidden = false; paintList(); } } if (n > 1500) clearInterval(iv); }, 400); }
    function close() { if (box) box.hidden = true; st = null; }
    const has = (q, ...a) => !q || a.some(v => String(v || '').toLowerCase().includes(q));
    const A = {
      done() { const db = cur(), T0 = today(); sheet({ title: T('작업 실시 완료', 'Record a job'), search: T('장비·작업·코드 검색', 'Search equipment / job / code'), note: T('작업을 누르면 실시일·실시자·비고를 입력합니다', 'Tap a job to enter date, who and remarks'),
        filters: [['due', T('기한 초과·7일', 'Overdue · 7 days')], ['d30', T('30일 이내', '≤30 days')], ['all', T('전체', 'All')]],
        items: (f, q) => calcAll(cur()).filter(x => x.s && x.s.due && (f === 'all' || (f === 'due' ? x.s.days <= 7 : x.s.days <= 30)) && has(q, x.j.code, x.j.desc, x.j.mach)).sort((a, b) => (a.s.due < b.s.due ? -1 : 1))
          .map(x => ({ id: x.j.code, t: x.j.desc, s: (x.j.mach || '') + ' · ' + x.j.code + ' · ' + T('기한', 'due') + ' ' + x.s.due, bd: x.s.days < 0 ? T('초과', 'over') + ' ' + (-x.s.days) + T('일', 'd') : x.s.days <= 7 ? x.s.days + T('일', 'd') : x.s.days + T('일', 'd'), bc: x.s.days < 0 ? 'od' : x.s.days <= 7 ? 'd7' : 'n' })),
        empty: T('기한이 다가온 작업이 없습니다 ✓', 'Nothing due ✓'), pick: c => doneDialog([c]) }); },
      use() { sheet({ title: T('예비품 사용 (재고 빼기)', 'Use spares'), search: T('품명·부품번호·장비 검색', 'Search name / part no. / equipment'), note: T('품목을 누르고 사용 수량을 입력합니다', 'Tap an item and enter the quantity used'),
        items: (f, q) => { const db = cur(), rob = robMap(db); return SPS(db).items.filter(x => !x.del && (rob[x.id] || 0) > 0 && has(q, x.name, x.pno, x.eq, x.maker)).map(x => ({ id: x.id, t: x.name, s: [x.pno, x.eq].filter(Boolean).join(' · '), bd: 'ROB ' + (rob[x.id] || 0) + (x.unit ? ' ' + x.unit : ''), bc: (rob[x.id] || 0) < (x.min || 0) ? 'od' : 'ok' })).slice(0, 400); },
        empty: T('검색어를 바꿔 보세요 (재고 0인 품목은 빠짐)', 'Try another search (items with 0 stock are hidden)'), pick: id => spTxForm(id, 'use') }); },
      gas() { sheet({ title: T('대기 측정 기록 (작업허가)', 'Gas reading (permit)'), note: T('작업 중인 작업허가서를 누르면 측정 칸으로 갑니다', 'Tap an active permit to go to the readings'),
        items: () => DB.ptws.filter(p => ptwStatus(p)[0] === 'act' && Array.isArray(p.gas)).map(p => ({ id: p.id, t: p.desc || p.title || p.no || 'PTW', s: [p.no, p.loc].filter(Boolean).join(' · '), bd: ptwStatus(p)[1], bc: 'ok' })),
        empty: T('대기 측정이 필요한 작업 중 허가서가 없습니다', 'No active permit needs readings'), stay: false,
        pick: id => { go({ name: 'ptw', id }); setTimeout(() => { const b = document.querySelector('[data-a=esGasAdd]') || document.querySelector('.al.err'); if (b) { b.scrollIntoView({ block: 'center' }); b.classList.add('sjph-hl'); } }, 500); } }); },
      sign() { const need = (doc, slots) => slots.some(x => x.name && !x.wait && !sigOK(doc, x.key, x.name));
        const L = [...DB.ras.filter(r => raStatus(r)[0] !== 'closed' && need(r, raSigSlots(r))).map(r => ['ra', r]), ...DB.ptws.filter(p => ptwStatus(p)[0] !== 'closed' && need(p, ptwSigSlots(p))).map(p => ['ptw', p])];
        sheet({ title: T('서명하기', 'Sign'), note: T('서명할 칸이 남은 문서입니다 — 누르면 서명 창이 열립니다 (손가락으로 서명)', 'Documents with unsigned slots — tap to sign with your finger'),
          items: () => L.filter(([k, d]) => k === 'ra' ? need(d, raSigSlots(d)) : need(d, ptwSigSlots(d))).map(([k, d]) => ({ id: k + ':' + d.id, t: (k === 'ra' ? T('위험성 평가', 'RA') + ' · ' + (d.title || '') : T('작업허가', 'Permit') + ' · ' + (d.desc || d.no || '')), s: (k === 'ra' ? raStatus(d) : ptwStatus(d))[1], bd: T('서명 필요', 'to sign'), bc: 'd7' })),
          empty: T('서명할 문서가 없습니다 ✓', 'Nothing to sign ✓'), pick: id => { const [k, i] = id.split(':'); sigPanel([[k, i]]); } }); } };
    Object.assign(A, {
      recv() { sheet({ title: T('예비품 입고', 'Receive spares'), search: T('품명·부품번호·장비 검색', 'Search name / part no. / equipment'), note: T('품목을 누르고 받은 수량을 입력합니다 (재고 부족 품목이 위에)', 'Tap an item and enter the quantity received (low stock first)'),
        items: (f, q) => { const db = cur(), rob = robMap(db); return SPS(db).items.filter(x => !x.del && has(q, x.name, x.pno, x.eq, x.maker)).map(x => ({ x, r: rob[x.id] || 0 })).sort((a, b) => ((a.r < (a.x.min || 0)) === (b.r < (b.x.min || 0)) ? 0 : a.r < (a.x.min || 0) ? -1 : 1)).slice(0, 400)
          .map(({ x, r }) => ({ id: x.id, t: x.name, s: [x.pno, x.eq].filter(Boolean).join(' · '), bd: 'ROB ' + r + (x.unit ? ' ' + x.unit : '') + (r < (x.min || 0) ? ' · ' + T('부족', 'low') : ''), bc: r < (x.min || 0) ? 'od' : 'ok' })); },
        empty: T('검색어를 바꿔 보세요', 'Try another search'), pick: id => spTxForm(id, 'recv') }); },
      /* 최근 실시 기록: 날짜 고치기·기록 삭제 — 고치면 새 기록으로 바꿔 넣고 이전 기록은 삭제 표시(다른 PC에도 반영) */
      hist() { sheet({ title: T('최근 실시 기록', 'Recent records'), search: T('장비·작업·코드 검색', 'Search'), note: T('기록을 누르면 실시일을 고치거나 삭제할 수 있습니다 (최근 90일)', 'Tap a record to fix the date or delete it (last 90 days)'),
        items: (f, q) => { const db = cur(), lim = new Date(Date.now() - 90 * 864e5).toISOString().slice(0, 10); return (db.hist || []).filter(h => h.date >= lim).map(h => ({ h, j: jobByCode(db, h.code) || {} })).filter(({ h, j }) => has(q, h.code, j.desc, j.mach)).sort((a, b) => a.h.date < b.h.date ? 1 : a.h.date > b.h.date ? -1 : (b.h.at || 0) - (a.h.at || 0))
          .map(({ h, j }) => ({ id: h.id, t: j.desc || h.code, s: (j.mach || '') + ' · ' + h.code + (h.by ? ' · ' + h.by : ''), bd: h.date, bc: 'n' })); },
        empty: T('최근 90일 실시 기록이 없습니다', 'No records in the last 90 days'), pick: id => histEdit(id) }); },
      dsign() { const off = MODE === 'admin', keys = off ? ['tstl', 'dpa6'] : ['ce', 'master'], dbs = off ? Object.values(OFFICE.ships || {}) : [cur()];
        sheet({ title: T('결함 보고서 서명', 'Defect report signatures'), note: T('STEP 6 서명이 남은 결함입니다 — 누르면 결함 보고서가 열리고 서명 칸에서 서명합니다', 'Defects waiting for STEP 6 signatures — tap to open and sign'),
          items: () => dbs.flatMap(db => DFS(db).filter(d => d.st !== 'closed' && (d.steps || [])[5] && keys.some(k => !((d.sigs || {})[k]))).map(d => ({ id: d.id, t: d.no + ' · ' + (d.title || d.desc || ''), s: (db.ship && db.ship.name || '') + ' · ' + keys.filter(k => !((d.sigs || {})[k])).map(k => ({ ce: T('기관장', 'C/E'), master: T('선장', 'Master'), tstl: T('공무 팀장', 'TST leader'), dpa6: 'DPA' })[k]).join(', ') + ' ' + T('서명 필요', 'to sign'), bd: T('서명', 'Sign'), bc: 'd7' }))),
          empty: T('서명할 결함 보고서가 없습니다 ✓', 'Nothing to sign ✓'), stay: false, pick: id => { PP.hide(); openDefect(id); } }); } });
    function histEdit(id) { const db = cur(), h = (db.hist || []).find(x => x.id === id); if (!h) return; const j = jobByCode(db, h.code) || {};
      modal({ title: T('실시 기록 고치기', 'Fix record'), body: `<div class="desc" style="margin-bottom:4px">${U.esc(j.desc || h.code)}</div><div class="small" style="margin-bottom:14px">${U.esc(j.mach || '')} · ${U.esc(h.code)}</div>
        <label class="f"><span>${T('실시일', 'Date done')}</span><input type="date" id="phD" value="${h.date}" max="${today()}"></label><label class="f"><span>${T('비고', 'Remarks')}</span><textarea id="phR">${U.esc(h.rmk || '')}</textarea></label><div id="phE" class="err"></div>`,
        buttons: [{ label: T('기록 삭제', 'Delete'), cls: 'danger', act: m => { if (!confirm(T('이 실시 기록을 삭제할까요? 다른 PC에서도 지워집니다.', 'Delete this record? It is removed on other PCs too.'))) return false; if ((db.locked || []).includes(h.date.slice(0, 7))) { m.querySelector('#phE').textContent = T('보고 완료로 잠긴 달의 기록은 지울 수 없습니다', 'That month is locked'); return false; } commit(T('실시 기록 삭제 ', 'Record deleted ') + h.code, () => { db.hist = db.hist.filter(x => x.id !== h.id); }); } },
          { label: T('취소', 'Cancel') },
          { label: T('저장', 'Save'), cls: 'grn', act: m => { const d = m.querySelector('#phD').value, r = m.querySelector('#phR').value.trim(), E = t => { m.querySelector('#phE').textContent = t; return false; };
            if (!d) return E(T('실시일을 입력하세요', 'Enter the date')); if (d > today()) return E(T('미래 날짜는 안 됩니다', 'No future dates')); if ([d, h.date].some(x => (db.locked || []).includes(x.slice(0, 7)))) return E(T('보고 완료로 잠긴 달입니다', 'Month is locked'));
            if (d === h.date && r === (h.rmk || '')) return;
            commit(T('실시일 수정 ', 'Record date fixed ') + h.code + ' ' + h.date + ' → ' + d, () => { db.hist = db.hist.filter(x => x.id !== h.id); db.hist.push(Object.assign({}, h, { id: uid(), date: d, rmk: r, at: Date.now(), fix: h.id })); }); } }] }); }
    document.addEventListener('click', e => { const b = e.target.closest && e.target.closest('[data-sjm]'); if (!b) return; e.preventDefault(); const k = b.dataset.sjm; if (A[k]) wait(() => A[k]()); }, true);
    return { A, close }; })();
  /* ===== 휴대폰 간단 화면 — 정비 · 위험성 페이지 (도구 원래 화면 대신 보이는 휴대폰 전용 첫 화면) =====
     문서·목록을 누르면 도구 화면(보기 전용)으로 들어가고, 위 '‹ 정비 / ‹ 위험성' 단추로 돌아옴. PC 화면으로 보기(설정)면 쓰지 않음 */
  const PP = (() => { let el = null, back = null, on = false, vsh = (location.search.match(/[?&]ppv=([^&]+)/) || [])[1], vInit = !!vsh; if (vsh) vsh = decodeURIComponent(vsh);
    /* 사무실 휴대폰: 위에서 고른 선박(선대 전체 / 선박)을 정비·위험성 탭 모두 똑같이 따름 */
    const isOff = () => TOOL === 'rsk' ? DB.settings.site === 'office' : MODE === 'admin';
    const setView = v => { try { C.set('view', v || ''); if (TOOL === 'pms' && v && OFFICE && OFFICE.ships[v]) OFFICE.sel = v; } catch (e) { } try { railRefresh(); } catch (e) { } };
    const home = TOOL === 'rsk' || SUB === 'pms';
    const name = TOOL === 'rsk' ? T('위험성', 'Risk') : T('정비', 'PMS');
    const kpi = (n, l, c, act) => `<button type="button" class="sjpp-kp ${c || ''}" ${act ? `data-ppa="${act}"` : 'disabled'}><b>${n}</b><span>${l}</span></button>`;
    const btn = (act, ic, l, sub, cls) => `<button type="button" class="sjpp-b ${cls || ''}" data-ppa="${act}">${U.ic(ic, 22)}<span>${l}${sub ? `<small>${sub}</small>` : ''}</span></button>`;
    const row = (act, id, t, s2, bd, bc) => `<button type="button" class="sjph-r" data-ppa="${act}" data-id="${U.esc(id)}"><span class="tx"><b>${U.esc(t)}</b>${s2 ? `<small>${U.esc(s2)}</small>` : ''}</span>${bd ? `<span class="bd ${bc || 'n'}">${U.esc(bd)}</span>` : ''}${U.ic('M9 18l6-6-6-6', 18)}</button>`;
    const sec = (title, body, more) => `<section class="sjpp-s"><h2>${title}${more || ''}</h2>${body}</section>`;
    const low = db => { const rob = robMap(db); return SPS(db).items.filter(x => !x.del && (x.min || 0) > 0 && (rob[x.id] || 0) < x.min); };
    const pmsShip = () => { const db = cur(); if (!db) return ''; const A = calcAll(db), od = A.filter(x => x.s.st === 'od').length, d7 = A.filter(x => x.s.st === 'd7').length, D = DFS(db).filter(d => d.st !== 'closed'), lw = low(db);
      const due = A.filter(x => x.s.due && x.s.days <= 7).sort((a, b) => a.s.due < b.s.due ? -1 : 1).slice(0, 6);
      const sg = D.filter(d => (d.steps || [])[5] && ['ce', 'master'].some(k => !((d.sigs || {})[k]))).length;
      return `<div class="sjpp-k">${U.esc(db.ship.name)} · ${today()}</div><h1>${T('정비', 'Maintenance')}</h1>
        <div class="sjpp-kg">${kpi(od, T('기한 초과', 'Overdue'), od ? 'r' : '', 'done')}${kpi(d7, T('7일 이내', 'Due ≤7d'), d7 ? 'y' : '', 'done')}${kpi(D.length, T('미결 결함', 'Open defects'), D.length ? 'p' : '', 'defs')}${kpi(lw.length, T('재고 부족', 'Low stock'), lw.length ? 'y' : '', 'recv')}</div>
        <div class="sjpp-bg">${btn('done', 'M20 6 9 17l-5-5', T('작업 실시 완료', 'Job done'), T('기한 작업 → 기록', 'due job → record'), 'pri')}${btn('hist', 'M12 8v4l3 2M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5', T('최근 실시 기록', 'Recent records'), T('날짜 고치기 · 삭제', 'fix date · delete'))}${btn('use', 'M5 12h14', T('예비품 사용', 'Use spares'), T('재고 빼기', 'stock out'))}${btn('recv', 'M12 5v14M5 12h14', T('예비품 입고', 'Receive spares'), T('재고 더하기', 'stock in'))}${btn('dsign', 'M3 21c3-1 5-6 8-6s2 4 5 4 3-3 5-3M14 4l6 6-9 9H5v-6z', T('결함 보고서 서명', 'Sign defect reports'), sg ? sg + T('건 서명 필요', ' to sign') : T('서명할 것 없음', 'nothing to sign'), sg ? 'hl' : '')}</div>
        ${sec(T('기한 다가온 작업', 'Due soon'), due.length ? due.map(x => row('job', x.j.code, x.j.desc, (x.j.mach || '') + ' · ' + T('기한', 'due') + ' ' + x.s.due, x.s.days < 0 ? T('초과', 'over') + ' ' + (-x.s.days) + T('일', 'd') : x.s.days + T('일', 'd'), x.s.days < 0 ? 'od' : 'd7')).join('') : `<div class="sjph-e">${T('7일 안에 할 작업이 없습니다 ✓', 'Nothing due in 7 days ✓')}</div>`, `<a href="#" data-ppa="done">${T('전체', 'All')} ›</a>`)}
        ${sec(T('미결 결함', 'Open defects'), D.length ? D.slice(0, 5).map(d => row('def', d.id, d.no + ' · ' + (d.title || d.desc || ''), d.eq || d.mach || '', d.st === 'closed' ? '' : T('진행', 'open'), 'n')).join('') : `<div class="sjph-e">${T('미결 결함이 없습니다 ✓', 'No open defects ✓')}</div>`)}
        ${sec(T('재고·구매 · 증서·검사', 'Stores · Certificates'), `<div class="sjpp-bg">${btn('inv', U.TOOLS()[2][2], T('재고·구매 보기', 'Stores (view)'), lw.length ? T('부족 ', 'low ') + lw.length : '')}${btn('cert', U.TOOLS()[3][2], T('증서·검사 보기', 'Certificates (view)'), '')}</div>`)}`; };
    const RQL = { sent: T('접수 대기', 'Sent'), ack: T('접수됨', 'Received'), done: T('완료', 'Done'), cancel: T('취소', 'Cancelled'), closed: T('종결', 'Closed') };
    const reqRows = (pairs, withShip) => pairs.length ? pairs.map(([v, r]) => row('req', v + '|' + r.id, (r.no || T('청구서', 'Requisition')) + (r.title ? ' · ' + r.title : '') , [withShip ? v : '', (r.items || []).length + T('품목', ' items'), (typeof INV_CAT !== 'undefined' && INV_CAT[r.cat]) ? T(INV_CAT[r.cat][0], INV_CAT[r.cat][1]) : (r.cat || ''), r.sent || r.date || ''].filter(Boolean).join(' · '), RQL[r.st] || r.st, r.st === 'sent' ? 'd7' : r.st === 'ack' ? 'n' : 'ok')).join('') : `<div class="sjph-e">${T('받은 청구서가 없습니다', 'No requisitions')}</div>`;
    const pickShip = v => { try { C.set('view', v); if (OFFICE && OFFICE.ships[v]) OFFICE.sel = v; } catch (e) { } };
    /* 받은 청구서 보기 (휴대폰): 품목·수량·재고·기록 + 사무실 처리 단추(접수·발주·보류·취소) — 작성 화면이 아님 */
    function reqShow(v, id) { const db = OFFICE.ships[v] || cur(), r = RQS(db).find(x => x.id === id); if (!r) return; const R = robMap(db), lg = (r.log || []).slice(-3).reverse();
      const it = (r.items || []).map(x => { const s2 = SPS(db).items.find(i => i.id === x.id) || {}; return `<div class="sjrq-i"><div><b>${U.esc(x.name || s2.name || '')}</b><small>${U.esc([x.pno || s2.pno, s2.eq].filter(Boolean).join(' · '))}</small></div><span><b>${U.esc(String(x.qty ?? ''))}</b> ${U.esc(x.unit || s2.unit || '')}<small>ROB ${R[x.id] || 0}</small></span></div>`; }).join('');
      const acts = [r.st === 'sent' ? ['ack', T('접수', 'Acknowledge'), 'pri'] : null, ['sent', 'ack', 'hold'].includes(r.st) ? ['order', T('발주', 'Order'), ''] : null, ['sent', 'ack'].includes(r.st) ? ['hold', T('보류', 'Hold'), ''] : null, ['sent', 'ack', 'hold', 'order', 'part'].includes(r.st) ? ['xcancel', T('취소', 'Cancel'), 'danger'] : null].filter(Boolean);
      modal({ title: T('청구서', 'Requisition') + ' ' + U.esc(r.no || ''), body: `<div class="sjrq"><div class="sjrq-h"><span class="badge">${RQL[r.st] || r.st}</span>${r.urg === 'u' ? `<span class="badge b-od">${T('긴급', 'URGENT')}</span>` : ''}<small>${U.esc(v)} · ${U.esc(r.date || '')}${r.port ? ' · ' + U.esc(r.port) : ''}</small></div>${r.title ? `<div class="sjrq-t">${U.esc(r.title)}</div>` : ''}${r.note ? `<div class="sjrq-n">${U.esc(r.note)}</div>` : ''}
        <div class="sjrq-l">${it || `<div class="sjph-e">${T('품목 없음', 'No items')}</div>`}</div>${lg.length ? `<div class="sjrq-g">${lg.map(l => `<div>${U.esc(l.at || '')} · ${l.side === 'office' ? T('사무실', 'Office') : T('선박', 'Ship')} ${U.esc(l.by || '')} — ${U.esc(RQL[l.st] || l.st || '')}${l.note ? ' · ' + U.esc(l.note) : ''}</div>`).join('')}</div>` : ''}</div>`,
        buttons: [{ label: T('닫기', 'Close') }].concat(acts.map(([k, l, c]) => ({ label: l, cls: c === 'pri' ? 'grn' : c, act: () => { pickShip(v); setTimeout(() => reqAct(id, k), 50); } }))) }); }
    const pmsOfficeShip = v => { const db = OFFICE.ships[v]; if (!db) { vsh = null; return pmsOffice(); } pickShip(v); let A = []; try { A = calcAll(db); } catch (e) { }
      const od = A.filter(x => x.s.st === 'od').length, d7 = A.filter(x => x.s.st === 'd7').length, D = DFS(db).filter(d => d.st !== 'closed'), lw = low(db), due = A.filter(x => x.s.due && x.s.days <= 7).sort((a, b) => a.s.due < b.s.due ? -1 : 1).slice(0, 8);
      const RQ = RQS(db).filter(r => ['sent', 'ack'].includes(r.st)).sort((a, b) => (a.st === 'sent' ? 0 : 1) - (b.st === 'sent' ? 0 : 1)).map(r => [v, r]);
      return `<button type="button" class="sjpp-up" data-ppa="fleet">${U.ic('M15 18l-6-6 6-6', 16)}${T('선대 전체', 'Whole fleet')}</button><div class="sjpp-k">${T('사무실', 'Office')} · ${today()}</div><h1>${U.esc(v)}</h1>
        <div class="sjpp-kg">${kpi(od, T('기한 초과', 'Overdue'), od ? 'r' : '')}${kpi(d7, T('7일 이내', 'Due ≤7d'), d7 ? 'y' : '')}${kpi(D.length, T('미결 결함', 'Open defects'), D.length ? 'p' : '')}${kpi(lw.length, T('재고 부족', 'Low stock'), lw.length ? 'y' : '')}</div>
        ${sec(T('받은 청구서', 'Requisitions'), reqRows(RQ, false))}
        ${sec(T('미결 결함', 'Open defects'), D.length ? D.slice(0, 8).map(d => row('def', v + '|' + d.id, d.no + ' · ' + (d.title || d.desc || ''), d.eq || d.mach || '', T('진행', 'open'), 'n')).join('') : `<div class="sjph-e">${T('미결 결함이 없습니다 ✓', 'No open defects ✓')}</div>`)}
        ${sec(T('기한 다가온 작업', 'Due soon') + ` <small>${T('보기', 'view')}</small>`, due.length ? due.map(x => `<div class="sjph-r sjpp-ro"><span class="tx"><b>${U.esc(x.j.desc)}</b><small>${U.esc((x.j.mach || '') + ' · ' + T('기한', 'due') + ' ' + x.s.due)}</small></span><span class="bd ${x.s.days < 0 ? 'od' : 'd7'}">${x.s.days < 0 ? T('초과', 'over') + ' ' + (-x.s.days) + T('일', 'd') : x.s.days + T('일', 'd')}</span></div>`).join('') : `<div class="sjph-e">${T('7일 안에 할 작업이 없습니다 ✓', 'Nothing due in 7 days ✓')}</div>`)}`; };
    const pmsOffice = () => { const S = Object.entries(OFFICE.ships || {}); let tod = 0, tdef = 0;
      const rows = S.map(([k, db]) => { let A = []; try { A = calcAll(db); } catch (e) { } const od = A.filter(x => x.s.st === 'od').length, d7 = A.filter(x => x.s.st === 'd7').length, df = DFS(db).filter(d => d.st !== 'closed').length; tod += od; tdef += df; return row('ship', k, k, T('7일 이내', '≤7d') + ' ' + d7 + ' · ' + T('미결 결함', 'defects') + ' ' + df, od ? T('초과', 'over') + ' ' + od : '✓', od ? 'od' : 'ok'); }).join('');
      return `<div class="sjpp-k">${T('사무실', 'Office')} · ${today()}</div><h1>${T('정비 — 선대', 'Maintenance — fleet')}</h1>
        <div class="sjpp-kg">${kpi(tod, T('기한 초과 (선대)', 'Overdue (fleet)'), tod ? 'r' : '')}${kpi(tdef, T('미결 결함', 'Open defects'), tdef ? 'p' : '')}</div>
        <div class="sjpp-bg">${btn('apv', 'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11', T('승인함', 'Approvals'), T('연기 · 청구 · 결함', 'postpone · requisition · defect'), 'pri')}${btn('dsign', 'M3 21c3-1 5-6 8-6s2 4 5 4 3-3 5-3M14 4l6 6-9 9H5v-6z', T('결함 보고서 서명', 'Sign defect reports'), T('공무 팀장 · DPA', 'TST leader · DPA'))}</div>
        ${sec(T('받은 청구서', 'Requisitions received') + ` <small>${T('접수 대기·접수됨', 'sent · received')}</small>`, reqRows(S.flatMap(([k, db]) => RQS(db).filter(r => ['sent', 'ack'].includes(r.st)).map(r => [k, r])).sort((a, b) => (a[1].st === 'sent' ? 0 : 1) - (b[1].st === 'sent' ? 0 : 1)), true))}
        ${sec(T('선박별', 'By vessel') + ` <small>${T('누르면 그 선박 요약', 'tap for vessel summary')}</small>`, rows || `<div class="sjph-e">${T('받은 선박 자료가 없습니다', 'No vessel data yet')}</div>`)}`; };
    const rskShip = vv => { const off = !!vv, v = vv || (DB.settings && DB.settings.vessel) || '', ras = DB.ras.filter(r => !v || !r.vessel || r.vessel === v), ptws = DB.ptws.filter(p => !v || !p.vessel || p.vessel === v);
      const draft = ras.filter(r => raStatus(r)[0] === 'draft'), wait = ras.filter(r => raStatus(r)[0] === 'wait'), act = ptws.filter(p => ptwStatus(p)[0] === 'act'), pdr = ptws.filter(p => ptwStatus(p)[0] === 'draft');
      const need = (doc, sl) => sl.some(x => x.name && !x.wait && !sigOK(doc, x.key, x.name)), sg = ras.filter(r => raStatus(r)[0] !== 'closed' && need(r, raSigSlots(r))).length + ptws.filter(p => ptwStatus(p)[0] !== 'closed' && need(p, ptwSigSlots(p))).length;
      const gas = act.filter(p => Array.isArray(p.gas)).length;
      return `${off ? `<button type="button" class="sjpp-up" data-ppa="fleet">${U.ic('M15 18l-6-6 6-6', 16)}${T('선대 전체', 'Whole fleet')}</button>` : ''}<div class="sjpp-k">${off ? T('사무실', 'Office') + ' · ' : ''}${U.esc(v)} · ${today()}</div><h1>${off ? U.esc(v) : T('위험성 관리', 'Risk')}</h1>
        <div class="sjpp-kg">${kpi(act.length, T('작업 중 허가서', 'Active permits'), act.length ? 'g' : '')}${kpi(draft.length + pdr.length, T('작성 중', 'Drafts'), '')}${kpi(wait.length, T('DPA 승인 대기', 'Awaiting DPA'), wait.length ? 'y' : '')}${kpi(sg, T('서명 필요', 'To sign'), sg ? 'y' : '', off ? '' : 'sign')}</div>
        ${off ? `<div class="sjpp-bg">${btn('apv', 'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11', T('승인함 (DPA)', 'Approvals (DPA)'), wait.length ? wait.length + T('건 대기', ' waiting') : T('대기 없음', 'none waiting'), wait.length ? 'pri' : '')}</div>` : `<div class="sjpp-bg">${btn('sign', 'M3 21c3-1 5-6 8-6s2 4 5 4 3-3 5-3M14 4l6 6-9 9H5v-6z', T('서명하기', 'Sign'), sg ? sg + T('건 — RA · TBM · PTW', ' — RA · TBM · PTW') : T('서명할 것 없음', 'nothing to sign'), sg ? 'pri' : '')}${btn('gas', 'M12 2v6M8 5h8M6 22h12l-1-12H7z', T('대기 측정 기록', 'Gas readings'), gas ? T('측정 대상 ', '') + gas + T('건', ' permits') : T('작업 중 허가서 없음', 'no active permit'))}</div>`}

        ${sec(T('작업 중 작업허가 (PTW)', 'Active permits'), act.length ? act.map(p => row('ptw', p.id, p.desc || p.no || 'PTW', [p.no, p.loc, p.to ? T('~', 'until ') + String(p.to).replace('T', ' ').slice(5, 16) : ''].filter(Boolean).join(' · '), ptwStatus(p)[1], 'ok')).join('') : `<div class="sjph-e">${T('작업 중인 허가서가 없습니다', 'No active permits')}</div>`)}
        ${sec(T('진행 중 위험성 평가', 'Risk assessments in progress'), draft.concat(wait).length ? draft.concat(wait).slice(0, 8).map(r => row('ra', r.id, r.title || r.no || 'RA', r.no || '', raStatus(r)[1], raStatus(r)[0] === 'wait' ? 'd7' : 'n')).join('') : `<div class="sjph-e">${T('진행 중인 평가가 없습니다', 'None in progress')}</div>`)}
        <p class="sjpp-note">${T('새 위험성 평가·작업허가 작성은 PC·태블릿에서 합니다.', 'Write new RA / permits on PC or tablet.')}</p>`; };
    const rskOffice = () => { const V = [...new Set([...(U.VES || []), ...DB.ras.map(x => x.vessel), ...DB.ptws.map(x => x.vessel)].filter(Boolean))];
      const rows = V.map(v => { const r = DB.ras.filter(x => x.vessel === v), p = DB.ptws.filter(x => x.vessel === v), w = r.filter(x => raStatus(x)[0] === 'wait').length, a = p.filter(x => ptwStatus(x)[0] === 'act').length; return row('vsl', v, v, T('작업 중 PTW', 'active PTW') + ' ' + a + ' · ' + T('RA', 'RA') + ' ' + r.length, w ? 'DPA ' + w : '✓', w ? 'd7' : 'ok'); }).join('');
      const w = DB.ras.filter(x => raStatus(x)[0] === 'wait').length, a = DB.ptws.filter(x => ptwStatus(x)[0] === 'act').length;
      return `<div class="sjpp-k">${T('사무실', 'Office')} · ${today()}</div><h1>${T('위험성 — 선대', 'Risk — fleet')}</h1>
        <div class="sjpp-kg">${kpi(w, T('DPA 승인 대기', 'Awaiting DPA'), w ? 'y' : '', 'apv')}${kpi(a, T('작업 중 허가서', 'Active permits'), a ? 'g' : '')}</div>
        <div class="sjpp-bg">${btn('apv', 'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11', T('승인함 (DPA)', 'Approvals (DPA)'), w ? w + T('건 대기', ' waiting') : T('대기 없음', 'none waiting'), w ? 'pri' : '')}</div>
        ${sec(T('선박별', 'By vessel'), rows || `<div class="sjph-e">${T('받은 선박 자료가 없습니다', 'No vessel data yet')}</div>`)}`; };
    const ready = () => TOOL === 'pms' ? (typeof cur === 'function' && (MODE === 'admin' ? !!OFFICE : !!cur())) : (typeof DB !== 'undefined' && DB && DB.ras);
    function paint() { if (!el || !on) return; let h = ''; if (!vInit) { vInit = true; try { if (isOff()) vsh = C.get('view') || null; } catch (e) { } } try { h = TOOL === 'rsk' ? (DB.settings.site === 'office' ? (vsh ? rskShip(vsh) : rskOffice()) : rskShip()) : (MODE === 'admin' ? (vsh ? pmsOfficeShip(vsh) : pmsOffice()) : pmsShip()); } catch (e) { console.warn('pp', e); h = `<div class="sjph-e">${T('불러오는 중…', 'Loading…')}</div>`; }
      const html = `<div class="sjpp-in">${h}<button type="button" class="sjpp-full" data-ppa="tool">${T('도구 화면 그대로 보기 (보기 전용)', 'Open the tool view (read-only)')} ›</button></div>`;
      const live = ready(); if (html !== last || el.dataset.stale) { const y = el.scrollTop; el.innerHTML = html; el.scrollTop = y; last = html; if (live) { try { localStorage.setItem(snapKey(), html); } catch (e) { } } }
      if (live && el.dataset.stale) { delete el.dataset.stale; if (pend) { const q = pend; pend = null; setTimeout(() => { const b = el.querySelector(`[data-ppa="${q.a}"]` + (q.id ? `[data-id="${CSS.escape(q.id)}"]` : '')); if (b) b.click(); }, 30); } } }
    /* 빠른 첫 화면: 지난번에 본 화면을 먼저 보여 주고(0.1초 안), 도구가 준비되면 최신 자료로 바꿈. 그 사이 누른 단추는 준비되는 즉시 실행 */
    let last = '', pend = null;
    const snapKey = () => 'sejul_pp_' + TOOL + '_' + (vsh || '');
    function mk() { if (el) return; el = document.createElement('div'); el.className = 'sjpp'; document.body.appendChild(el); el.addEventListener('click', click);
      back = document.createElement('button'); back.type = 'button'; back.className = 'sjpp-back'; back.hidden = true; back.innerHTML = U.ic('M15 18l-6-6 6-6', 16) + '<span>' + name + ' ' + T('홈', 'home') + '</span>'; back.onclick = () => show(); document.body.appendChild(back); }
    function early() { try { if (!U.phone || !U.phone() || BG || !home || /[?&]go=/.test(location.search) || /^#\/(?!home)./.test(location.hash)) return; if (!vsh) { try { if ((C.get('role') || (U.role && U.role())) === 'office') vsh = C.get('view') || null; } catch (e) { } }
        const h = localStorage.getItem(snapKey()); if (!h) return; const put = () => { if (el || !document.body) return !!el; mk(); el.dataset.stale = '1'; el.innerHTML = h; last = h; on = true; document.documentElement.classList.add('sjpp-on'); return true; };
        if (!put()) { const mo = new MutationObserver(() => { if (put()) mo.disconnect(); }); mo.observe(document.documentElement, { childList: true }); } } catch (e) { } }
    function show() { mk();
      on = true; el.hidden = false; back.hidden = true; document.documentElement.classList.add('sjpp-on'); paint(); }
    function hide() { if (!el) return; on = false; el.hidden = true; back.hidden = false; document.documentElement.classList.remove('sjpp-on'); }
    function click(e) { const b = e.target.closest('[data-ppa]'); if (!b) return; e.preventDefault(); const a = b.dataset.ppa, id = b.dataset.id;
      if (el.dataset.stale && !ready()) { pend = { a, id }; b.classList.add('sjpp-wait'); return; }
      if (PH.A[a]) return PH.A[a]();
      if (a === 'job') return doneDialog([id]);
      if (a === 'defs') { hide(); return (location.hash = '#/defects'); }
      if (a === 'def') { let d = id; if (id.includes('|')) { const [v, x] = id.split('|'); pickShip(v); d = x; } hide(); return openDefect(d); }
      if (a === 'inv' || a === 'cert') return (location.href = U.toolUrl('../', a).replace('../tools/', ''));
      if (a === 'apv') return U.inb && U.inb.open ? U.inb.open('apv') : document.querySelector('[data-sjinb]') && document.querySelector('[data-sjinb]').click();
      if (a === 'ship' || a === 'vsl') { vsh = id; setView(id); paint(); el.scrollTop = 0; return; }
      if (a === 'fleet') { vsh = null; setView(''); paint(); el.scrollTop = 0; return; }
      if (a === 'req') { const [v, rid] = id.split('|'); pickShip(v); return reqShow(v, rid); }
      if (a === 'ptw') { hide(); return go({ name: 'ptw', id }); }
      if (a === 'ra') { hide(); return go({ name: 'ra', id, step: 1 }); }
      if (a === 'tool') return hide(); }
    const start = () => { if (!U.phone || !U.phone() || BG || !home) return; if (/[?&]go=/.test(location.search) || /^#\/(?!home)./.test(location.hash)) { show(); hide(); return; }
      let n = 0; const w = () => { if (ready()) { show(); return; } if (++n < 200) setTimeout(w, 100); }; w(); };
    /* 기록하면 바로 숫자·목록 갱신 */
    setInterval(() => { if (on && document.visibilityState === 'visible' && !document.querySelector('#mback.on,.sjph:not([hidden]),.sgpanel-bg[style*=flex]')) paint(); }, 2500);
    U.onPhoneShip = v => { vInit = true; vsh = v || null; setView(vsh); show(); if (el) el.scrollTop = 0; };
    early();
    return { start, show, hide, paint }; })();
  if (document.readyState !== 'loading') setTimeout(PP.start, 0); else addEventListener('DOMContentLoaded', () => setTimeout(PP.start, 0));
  /* 재고·구매 / 증서·검사 (휴대폰): 위에 '‹ 정비' 단추 */
  try { if (U.phone && U.phone() && !BG && TOOL === 'pms' && SUB !== 'pms') addEventListener('load', () => { const b = document.createElement('a'); b.className = 'sjpp-back'; b.href = 'pms.html'; b.innerHTML = U.ic('M15 18l-6-6 6-6', 16) + '<span>' + T('정비 홈', 'PMS home') + '</span>'; document.body.appendChild(b); }); } catch (e) { }
  if (document.readyState === 'complete') setTimeout(boot, 50); else addEventListener('load', () => setTimeout(boot, 50));
})();
