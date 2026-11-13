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
  const FB = /\/tools\//.test(location.pathname) ? '../' : '';   /* 글꼴 파일 위치 (앱 홈 / 도구) */
  /* 화면 밝기: 밝게(기본) · 어둡게(야간 당직) · 기기 설정 따라 — 켜자마자 적용 */
  U.theme = t => { if (t != null) C.set('theme', t); t = C.get('theme') || 'light'; const sys = window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches; const m = t === 'night' ? 'night' : (t === 'dark' || (t === 'auto' && sys)) ? 'dark' : 'light'; const R = document.documentElement; R.setAttribute('data-sjt', m); R.classList.toggle('sj-dark', m !== 'light'); const tc = document.querySelector('meta[name=theme-color]'); if (tc) tc.content = m === 'night' ? '#000000' : m === 'dark' ? '#0B1427' : '#14244A'; return t; };
  /* 휴대폰 간단 화면: 기기 화면이 작고(짧은 변 600px 미만) 터치인 기기 = 휴대폰. PC 창을 좁혀도·태블릿은 전체 화면.
     설정 '휴대폰에서도 전체 화면' (fullUI=1) 이면 휴대폰도 전체 화면 */
  U.phoneDev = () => { try { if (/[?&]phone=1/.test(location.search)) return true; const s = Math.min(screen.width, screen.height); return s > 0 && s < 600 && matchMedia('(pointer:coarse)').matches; } catch (e) { return false; } };
  U.phone = () => U.phoneDev() && C.get('fullUI') !== '1';
  U.phoneApply = () => { const on = U.phone(); document.documentElement.classList.toggle('sj-phone', on); return on; };
  try { U.phoneApply(); } catch (e) { }
  try { U.theme(); if (window.matchMedia) matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => U.theme()); addEventListener('storage', e => { if (/theme/.test(e.key || '')) U.theme(); }); } catch (e) { }
  U.css = `/* ===== SEJUL 디자인 기준값 (Design tokens) — 계획정비·위험성 관리·앱 홈 공통 =====
   밝게(기본) / 어둡게(data-sjt=dark) / 선교 야간(data-sjt=night, 붉은 빛) — 출력물은 항상 밝게.
   도구 원본의 색은 tokenize.py 로 var(--sj-…) 로 바뀌어 있음. 새 색을 직접 쓰지 말 것 (빌드 검사가 경고). */
:root{
 --sj-bg:#F3F5F9;--sj-sf:#FFFFFF;--sj-sf2:#F7F9FC;--sj-sf3:#EEF1F6;--sj-bd:#E1E6EE;--sj-bd2:#C9D1DD;--sj-bd3:#9AA4B2;
 --sj-tx:#1A2233;--sj-tx2:#4A5568;--sj-tx3:#6B7588;--sj-on:#FFFFFF;--sj-on2:#DCE6F5;--sj-inv:#2A3242;--sj-gry:#8A94A6;--sj-navy:#14244A;--sj-navy2:#22396B;
 --sj-red-fg:#C62828;--sj-red:#D93636;--sj-red-bg:#FDECEC;--sj-red-bd:#F4B8B8;
 --sj-org-fg:#B85C00;--sj-org:#E07A1F;--sj-org-bg:#FFF0E0;--sj-org-bd:#F6C99A;
 --sj-amb-fg:#8A6400;--sj-amb:#E0A100;--sj-amb-bg:#FFF6D6;--sj-amb-bd:#EED68A;
 --sj-grn-fg:#1E7A45;--sj-grn:#2FA36B;--sj-grn-bg:#E6F5EC;--sj-grn-bd:#A9DCC0;
 --sj-blu-fg:#1D5FAE;--sj-blu:#1F64B8;--sj-blu-bg:#E8F0FB;--sj-blu-bd:#B5CDEE;
 --sj-pur-fg:#6A3FB5;--sj-pur:#7C4DDB;--sj-pur-bg:#F1ECFB;--sj-pur-bd:#CDBDF0;
 --sj-brand:#0B5FB3;--sj-brand2:#1BA6EA;--sj-focus:#2F6FD6;
 --sj-sh1:0 1px 2px rgba(16,24,40,.05),0 1px 3px rgba(16,24,40,.06);--sj-sh2:0 4px 14px rgba(16,24,40,.08),0 1px 3px rgba(16,24,40,.06);--sj-sh3:0 18px 50px rgba(16,24,40,.22);
 --sj-r1:6px;--sj-r2:8px;--sj-r3:12px;--sj-r4:16px;
 --sj-f1:11px;--sj-f2:12px;--sj-f3:13px;--sj-f4:14px;--sj-f5:16px;--sj-f6:18px;--sj-f7:22px;--sj-f8:26px;
 --sj-g1:4px;--sj-g2:8px;--sj-g3:12px;--sj-g4:16px;--sj-g5:20px;--sj-g6:28px;
 --sj-scrim:rgba(15,23,42,.5);--sj-img:none;color-scheme:light;
 /* 도구 원본 변수 → 기준값 (계획정비) */
 --bg:var(--sj-bg);--panel:var(--sj-sf);--ink:var(--sj-tx);--sub:var(--sj-tx2);--mute:var(--sj-tx3);--line:var(--sj-bd);--line2:var(--sj-sf3);
 --pri:var(--sj-blu);--pri-d:var(--sj-navy2);--pri-l:var(--sj-blu-bg);
 --red:var(--sj-red-fg);--red-l:var(--sj-red-bg);--org:var(--sj-org-fg);--org-l:var(--sj-org-bg);--yel:var(--sj-amb-fg);--yel-l:var(--sj-amb-bg);
 --grn:var(--sj-grn-fg);--grn-l:var(--sj-grn-bg);--gry:var(--sj-tx3);--gry-l:var(--sj-sf3);--pur:var(--sj-pur-fg);--pur-l:var(--sj-pur-bg);
 --shadow:var(--sj-sh1);
 /* (위험성 관리) */
 --navy:var(--sj-navy);--navy2:var(--sj-navy2);--pale:var(--sj-blu-bg);--card:var(--sj-sf);
 --gL:var(--sj-grn-fg);--gLb:var(--sj-grn-bg);--gM:var(--sj-amb-fg);--gMb:var(--sj-amb-bg);--gH:var(--sj-org-fg);--gHb:var(--sj-org-bg);--gX:var(--sj-red-fg);--gXb:var(--sj-red-bg);
 --en:var(--sj-blu-fg);--ok:var(--sj-grn-fg);--warn:var(--sj-amb-fg);--err:var(--sj-red-fg);
}
html[data-sjt=dark]{
 --sj-bg:#0E131D;--sj-sf:#161C28;--sj-sf2:#1B2230;--sj-sf3:#222A3A;--sj-bd:#2B3446;--sj-bd2:#3A4458;--sj-bd3:#5A657A;
 --sj-tx:#E6EAF2;--sj-tx2:#B7C0CF;--sj-tx3:#8B96A9;--sj-on:#FFFFFF;--sj-on2:#C9D5EA;--sj-inv:#3A4458;--sj-gry:#6B7588;--sj-navy:#0B1427;--sj-navy2:#1E3260;
 --sj-red-fg:#FF8080;--sj-red:#E5484D;--sj-red-bg:#3B1A1E;--sj-red-bd:#6E2B31;
 --sj-org-fg:#FFA761;--sj-org:#D9701A;--sj-org-bg:#3A2614;--sj-org-bd:#6B4423;
 --sj-amb-fg:#F5C451;--sj-amb:#C99400;--sj-amb-bg:#352B10;--sj-amb-bd:#66551E;
 --sj-grn-fg:#63D69A;--sj-grn:#279160;--sj-grn-bg:#12301F;--sj-grn-bd:#23573A;
 --sj-blu-fg:#86B9F7;--sj-blu:#2F74D0;--sj-blu-bg:#15273F;--sj-blu-bd:#284A73;
 --sj-pur-fg:#BBA2F7;--sj-pur:#7C4DDB;--sj-pur-bg:#261D3D;--sj-pur-bd:#46367A;
 --sj-brand:#4C9BEA;--sj-focus:#6AA8F2;
 --sj-sh1:0 1px 2px rgba(0,0,0,.4);--sj-sh2:0 4px 14px rgba(0,0,0,.45);--sj-sh3:0 18px 50px rgba(0,0,0,.6);--sj-scrim:rgba(0,0,0,.62);color-scheme:dark;
}
html[data-sjt=night]{
 --sj-bg:#000000;--sj-sf:#0A0202;--sj-sf2:#0F0303;--sj-sf3:#160505;--sj-bd:#2A0808;--sj-bd2:#3D0D0D;--sj-bd3:#5C1515;
 --sj-tx:#E04848;--sj-tx2:#BA3A3A;--sj-tx3:#9E3232;--sj-on:#FF9090;--sj-on2:#C04040;--sj-inv:#2A0808;--sj-gry:#6A1C1C;--sj-navy:#080101;--sj-navy2:#1C0505;
 --sj-red-fg:#FF5050;--sj-red:#9E1C1C;--sj-red-bg:#260606;--sj-red-bd:#5A1010;
 --sj-org-fg:#E8633A;--sj-org:#80240F;--sj-org-bg:#210704;--sj-org-bd:#4D150A;
 --sj-amb-fg:#E07A3C;--sj-amb:#7A2A10;--sj-amb-bg:#1F0804;--sj-amb-bd:#4A180A;
 --sj-grn-fg:#C04040;--sj-grn:#5A1414;--sj-grn-bg:#160404;--sj-grn-bd:#3A0C0C;
 --sj-blu-fg:#D05050;--sj-blu:#6A1616;--sj-blu-bg:#180404;--sj-blu-bd:#3F0E0E;
 --sj-pur-fg:#C84868;--sj-pur:#5E1428;--sj-pur-bg:#1A0408;--sj-pur-bd:#420C1A;
 --sj-brand:#C03030;--sj-brand2:#E04848;--sj-focus:#FF5050;
 --sj-sh1:none;--sj-sh2:none;--sj-sh3:0 0 0 1px #3D0D0D;--sj-scrim:rgba(0,0,0,.75);color-scheme:dark;
}
html[data-sjt=night] :is(img,video,canvas,svg image){filter:brightness(.55) sepia(1) hue-rotate(-45deg) saturate(2.5)}
html[data-sjt=dark] :is(img:not([src$=".svg"]),video){filter:brightness(.9)}
/* 서명·도면 그림은 흰 바탕 유지 (읽기 쉽게) */
html:is([data-sjt=dark],[data-sjt=night]) :is(canvas.esig,.esig canvas,.sig canvas,canvas[data-sig]){background:#fff}
@media print{html[data-sjt]{
 --sj-bg:#FFFFFF;--sj-sf:#FFFFFF;--sj-sf2:#F7F9FC;--sj-sf3:#EEF1F6;--sj-bd:#C9D1DD;--sj-bd2:#9AA4B2;--sj-bd3:#6B7588;--sj-tx:#000000;--sj-tx2:#333B48;--sj-tx3:#555F70;--sj-on:#FFFFFF;--sj-on2:#DCE6F5;--sj-inv:#2A3242;--sj-gry:#8A94A6;--sj-navy:#14244A;--sj-navy2:#22396B;
 --sj-red-fg:#C62828;--sj-red:#D93636;--sj-red-bg:#FDECEC;--sj-red-bd:#F4B8B8;--sj-org-fg:#B85C00;--sj-org:#E07A1F;--sj-org-bg:#FFF0E0;--sj-org-bd:#F6C99A;--sj-amb-fg:#8A6400;--sj-amb:#E0A100;--sj-amb-bg:#FFF6D6;--sj-amb-bd:#EED68A;
 --sj-grn-fg:#1E7A45;--sj-grn:#2FA36B;--sj-grn-bg:#E6F5EC;--sj-grn-bd:#A9DCC0;--sj-blu-fg:#1D5FAE;--sj-blu:#1F64B8;--sj-blu-bg:#E8F0FB;--sj-blu-bd:#B5CDEE;--sj-pur-fg:#6A3FB5;--sj-pur:#7C4DDB;--sj-pur-bg:#F1ECFB;--sj-pur-bd:#CDBDF0;color-scheme:light}
 html[data-sjt] :is(img,video,canvas){filter:none!important}}

/* ===== 기본 ===== */
html,body{background:var(--sj-bg);color:var(--sj-tx)}
::selection{background:var(--sj-blu-bd)}
a{color:var(--sj-blu-fg)}
hr{border:0;border-top:1px solid var(--sj-bd)}
:focus-visible{outline:2px solid var(--sj-focus)!important;outline-offset:2px}

/* ===== 공통 부품: 버튼 ===== (계획정비 .btn.pri/.grn/.danger/.red · 위험성 관리 .btn.p/.g/.r/.rr) */
html .btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:40px;padding:0 14px;border:1px solid var(--sj-bd2);border-radius:var(--sj-r2);background:var(--sj-sf);color:var(--sj-tx);font-size:var(--sj-f4);font-weight:600;line-height:1.2;cursor:pointer;white-space:nowrap;box-shadow:var(--sj-sh1);transition:background .15s,border-color .15s,box-shadow .15s,transform .08s}
html .btn:hover{background:var(--sj-sf2);border-color:var(--sj-bd3)}
html .btn:active{transform:translateY(1px);box-shadow:none}
html .btn:disabled,html .btn[disabled]{opacity:.45;cursor:not-allowed;transform:none}
html .btn :is(.en){color:inherit;opacity:.75}
html :is(.btn.pri,.btn.p){background:var(--sj-blu);border-color:var(--sj-blu);color:var(--sj-on)}
html :is(.btn.pri,.btn.p):hover{background:var(--sj-navy2);border-color:var(--sj-navy2)}
html :is(.btn.grn,.btn.g){background:var(--sj-grn);border-color:var(--sj-grn);color:var(--sj-on)}
html :is(.btn.grn,.btn.g):hover{filter:brightness(.93)}
html :is(.btn.red,.btn.rr){background:var(--sj-red);border-color:var(--sj-red);color:var(--sj-on)}
html :is(.btn.danger,.btn.r,.btn.del){background:var(--sj-sf);border-color:var(--sj-red-bd);color:var(--sj-red-fg)}
html :is(.btn.danger,.btn.r,.btn.del):hover{background:var(--sj-red-bg);border-color:var(--sj-red)}
html .btn.ghost{background:transparent;border-color:transparent;box-shadow:none;color:var(--sj-tx2)}
html .btn.ghost:hover{background:var(--sj-sf3)}
html .btn.sm{min-height:32px;padding:0 10px;font-size:var(--sj-f3);border-radius:var(--sj-r1)}
html .btn.xs{min-height:26px;padding:0 8px;font-size:var(--sj-f2);border-radius:var(--sj-r1);box-shadow:none}
html .btn.big{min-height:48px;padding:0 20px;font-size:var(--sj-f5);border-radius:var(--sj-r3)}
html .btn.blocked{background:var(--sj-org-bg);border-color:var(--sj-org);color:var(--sj-org-fg)}
html .btn.allyes{background:var(--sj-grn-bg);border-color:var(--sj-grn-bd);color:var(--sj-grn-fg)}

/* ===== 입력칸 ===== */
html :is(input[type=text],input[type=number],input[type=date],input[type=month],input[type=time],input[type=datetime-local],input[type=password],input[type=search],input[type=email],input[type=tel],input:not([type]),select,textarea){border:1px solid var(--sj-bd2);border-radius:var(--sj-r2);background:var(--sj-sf);color:var(--sj-tx);font-size:var(--sj-f4);padding:8px 10px;min-height:40px;transition:border-color .15s,box-shadow .15s}
html textarea{min-height:72px;line-height:1.5}
html :is(input,select,textarea):hover:not(:disabled):not(:focus){border-color:var(--sj-bd3)}
html :is(input,select,textarea):focus{outline:none!important;border-color:var(--sj-focus);box-shadow:0 0 0 3px color-mix(in srgb,var(--sj-focus) 22%,transparent)}
html :is(input,select,textarea):disabled{background:var(--sj-sf3);color:var(--sj-tx3)}
html ::placeholder{color:var(--sj-tx3);opacity:1}
html input:is([type=checkbox],[type=radio]){accent-color:var(--sj-blu);width:18px;height:18px;min-height:0}
html label{color:inherit}

/* ===== 칩·뱃지 ===== */
html .chip{display:inline-flex;align-items:center;gap:4px;min-height:34px;padding:0 13px;border:1px solid var(--sj-bd2);border-radius:999px;background:var(--sj-sf);color:var(--sj-tx2);font-size:var(--sj-f3);font-weight:500;cursor:pointer;white-space:nowrap;transition:background .15s,border-color .15s,color .15s}
html .chip:hover{border-color:var(--sj-bd3);color:var(--sj-tx)}
html .chip.on{background:var(--sj-navy2);border-color:var(--sj-navy2);color:var(--sj-on);font-weight:600}
html .chip.on :is(.en,.sub){color:inherit;opacity:.8}
html .badge{display:inline-flex;align-items:center;gap:3px;border-radius:var(--sj-r1);padding:2px 7px;font-size:var(--sj-f2);font-weight:700;line-height:1.35;white-space:nowrap}

/* ===== 카드·표 ===== */
html .card{background:var(--sj-sf);border:1px solid var(--sj-bd);border-radius:var(--sj-r3);box-shadow:var(--sj-sh1)}
html .tw{background:var(--sj-sf);border:1px solid var(--sj-bd);border-radius:var(--sj-r3);box-shadow:var(--sj-sh1)}
html :is(table.g,table.t){border-collapse:separate;border-spacing:0;width:100%;background:var(--sj-sf);font-size:var(--sj-f4)}
html :is(table.g,table.t) th{background:var(--sj-sf2);color:var(--sj-tx2);font-size:var(--sj-f3);font-weight:700;text-align:left;padding:10px 12px;border-bottom:1px solid var(--sj-bd);white-space:nowrap}
html :is(table.g,table.t) th :is(.en){color:var(--sj-tx3)}
html :is(table.g,table.t) td{padding:10px 12px;border-bottom:1px solid var(--sj-sf3);vertical-align:top;color:var(--sj-tx)}
html :is(table.g,table.t) tr:last-child td{border-bottom:0}
html :is(table.g tr.r,table.t tr.click):hover td{background:var(--sj-blu-bg)}
html table.g tr.sel td{background:var(--sj-blu-bg)}
html table.t{border:1px solid var(--sj-bd);border-radius:var(--sj-r2);overflow:hidden}

/* ===== 창(모달) ===== */
html .modal-bg{background:var(--sj-scrim);backdrop-filter:blur(2px)}
html .modal{background:var(--sj-sf);color:var(--sj-tx);border:1px solid var(--sj-bd);border-radius:var(--sj-r4);box-shadow:var(--sj-sh3);animation:sjdsPop .18s ease-out}
html .modal .mh{padding:16px 20px;border-bottom:1px solid var(--sj-bd);font-size:var(--sj-f6);font-weight:700;color:var(--sj-tx)}
html .modal .mh h3{font-size:var(--sj-f6)}
html .modal .mb{padding:18px 20px}
html .modal .mf{padding:12px 20px;border-top:1px solid var(--sj-bd);background:var(--sj-sf2);border-radius:0 0 var(--sj-r4) var(--sj-r4)}
@keyframes sjdsPop{from{opacity:0;transform:translateY(8px) scale(.985)}to{opacity:1;transform:none}}

/* ===== 제목·글자 단계 ===== */
html h1{font-size:var(--sj-f8);font-weight:800;letter-spacing:-.3px;color:var(--sj-tx)}
html h2{font-size:var(--sj-f6);font-weight:700;color:var(--sj-tx)}
html h3{font-size:var(--sj-f5);font-weight:700}
html :is(.hsub,.sub){color:var(--sj-tx2)}

/* ===== 불러오는 중 뼈대 화면 ===== */
.sj-skel{display:grid;gap:14px;padding:4px 0}
.sj-skel i{display:block;height:16px;border-radius:8px;background:linear-gradient(90deg,var(--sj-sf3) 0,var(--sj-bd) 40%,var(--sj-sf3) 80%) 0 0/200% 100%;animation:sjSk 1.2s linear infinite}
.sj-skel i.h{height:26px;width:40%}.sj-skel i.c{height:92px;border-radius:12px}.sj-skel i.s{width:70%}
@keyframes sjSk{to{background-position:-200% 0}}

/* ===== 저장 반응 ===== */
.sj-saved{position:fixed;right:18px;bottom:18px;z-index:9990;display:flex;align-items:center;gap:8px;padding:9px 14px;border-radius:999px;background:var(--sj-inv);color:var(--sj-on);font-size:var(--sj-f3);font-weight:600;box-shadow:var(--sj-sh2);opacity:0;transform:translateY(8px);transition:opacity .2s,transform .2s;pointer-events:none}
.sj-saved.on{opacity:1;transform:none}
.sj-saved b{width:18px;height:18px;border-radius:50%;background:var(--sj-grn);display:inline-flex;align-items:center;justify-content:center}
@media (max-width:760px){.sj-saved{bottom:76px;right:50%;transform:translate(50%,8px)}.sj-saved.on{transform:translate(50%,0)}}

@media (prefers-reduced-motion:reduce){html *{animation:none!important;transition:none!important}}

/* 제목줄 동작 칸에 옮겨진 원본 단추 (class 없는 button) → 공통 단추 모양 */
html .sjx-act>button:not(.btn):not([class^=sj]){display:inline-flex;align-items:center;gap:6px;min-height:40px;padding:0 14px;border:1px solid var(--sj-bd2);border-radius:var(--sj-r2);background:var(--sj-sf);color:var(--sj-tx);font-size:var(--sj-f4);font-weight:600;cursor:pointer;box-shadow:var(--sj-sh1)}
html .sjx-act>button.pri:not(.btn){background:var(--sj-blu);border-color:var(--sj-blu);color:var(--sj-on)}
html button:not([class]){color:inherit}
html .steps button .k{color:var(--sj-blu-fg)}
html.sj-phone :is([data-act=eqAdd],[data-act=eqEdit],[data-act=eqAddAt],[data-act=eqJobAdd],[data-act=jobEdit9],[data-act=sfiEdit],[data-act=sfiAdd],[data-act=sfiDrop],[data-act=defNew],[data-act=defEdit],[data-act=defStep],[data-act=defDel],[data-act=defReopen],[data-act=defNA],[data-act=defXlsx],[data-act=reqNew],[data-act=reqPrt],[data-act=spNew],[data-act=spEdit],[data-act=spImport],[data-act=spXlsx],[data-act=importMaster],[data-act=importCompany],[data-act=impaImport],[data-act=impMaster9],[data-act=impErp9],[data-act=impSfi9],[data-act=prt9],[data-act=prtDef9],[data-act=prtEq9],[data-act=sfiPrint],[data-act=ckPrintMenu],[data-act=ckBlankMenu],[data-act=ckBlank16],[data-act=ckBatch16],[data-act=ckUnitEdit],[data-act=ckErpXlsx],[data-act=ckRec16],[data-act=clsNew],[data-act=clsEdit],[data-act=clsDel],[data-act=clsPrint],[data-act=clsBlank],[data-act=clsCk],[data-act=clsDone],[data-act=calAdd],[data-act=calInfoEdit],[data-act=calKindSet],[data-act=calXlsx],[data-act=calOff],[data-act=eqXlsx],[data-act=invExp],[data-act=invErpXlsx],[data-act=monthlyReport],[data-act=backup],[data-act=obackup],[data-act=orestore],[data-act=wipeAll],[data-act=shipDel],[data-act=shipChange],[data-act=vesSave],[data-act=saveVesselMaster],[data-act=ranks],[data-act=pwSave],[data-act=reapplyBuiltin],[data-act=eqDel9],[data-act=eqReport],[data-act=folder],[data-act=refolder],[data-act=undo],[data-act=redo],[data-act=fsSave],[data-act=fsOff],[data-act=adoptOffice],[data-act=openShipData],[data-act=criToggle],[data-a=newRA],[data-a=newPTW],[data-a=newMoC],[data-a=newRIR],[data-a=startRA],[data-a=copyRA],[data-a=raFromRIR],[data-a=raFromPTW],[data-a=raFromMoC],[data-a=ptwFromRA],[data-a=dpaFromRA],[data-a=addHz],[data-a=addRow],[data-a=delRow],[data-a=delHz],[data-a=mvHz],[data-a=addCtl],[data-a=delCtl],[data-a=libHz],[data-a=addLibHz],[data-a=jsaTog],[data-a=jsaOther],[data-a=jsaOn],[data-a=jsaBulk],[data-a=jsaBatch],[data-a=jsaPick],[data-a=jsaNone],[data-a=jsaAll],[data-a=simWEdit],[data-a=simSet],[data-a=simCell],[data-a=sim2Del],[data-a=simWSave],[data-a=simWDel],[data-a=simReset],[data-a=simRA],[data-a=seMv],[data-a=seSave],[data-a=seReset],[data-a=seRemove],[data-a=seDel],[data-a=seCtlDel],[data-a=seCtlAdd],[data-a=seAdd],[data-a=stdNew],[data-a=stdMode],[data-a=stdExport],[data-a=stdEdit],[data-a=printHome],[data-a=printRAset],[data-a=blankPrint],[data-a=blankWord],[data-a=printReg],[data-a=printRegShip],[data-a=printPtwLog],[data-a=printMoCReg],[data-a=recPrint],[data-a=dqPrint],[data-a=pkgPdf],[data-a=pkgJson],[data-a=pkgEml],[data-a=pkgDoc],[data-a=pkgCopy],[data-a=prtTogP],[data-a=prtTog],[data-a=csv],[data-a=exportData],[data-a=fsPick],[data-a=fsAllow],[data-a=fsSave],[data-a=fsOff],[data-a=fsGo],[data-a=crewApply],[data-a=clearCrew],[data-a=crewToggle],[data-a=impFormDo],[data-a=siteSet],[data-a=pcNameSet],[data-a=pcNameReset],[data-a=pcPreset],[data-a=resetAll],[data-a=del],[data-a=delRecent],[data-a=dqDel],[data-a=listClear],[data-a=regClear],[data-a=issuePTW],[data-a=revokePTW],[data-a=reopenPTW],[data-a=reopenMoC],[data-a=closeMoC],[data-a=unapprove],[data-a=unokHz],[data-a=chgType],[data-a=setType],[data-a=manAddX],[data-a=manAddOk],[data-a=mReg],[data-a=regSK],[data-a=mocUnApv],[data-a=mocRaUnlink]),html.sj-phone :is(.sjx-prt,[data-act=spTx]:not([data-k=use]),input[type=file],label:has(>input[type=file]),.btn:has(>input[type=file])){display:none!important}html.sj-phone .sjs-big{min-height:64px}html.sj-phone .sjs-big .sj-vn{display:flex;flex-direction:column;gap:2px;font-size:16px;font-weight:700}html.sj-phone .sjs-big small{font-size:12.5px;font-weight:500;color:var(--sj-tx3,#6B7588)}.sjs-note{margin:10px 6px 4px;font-size:12.5px;line-height:1.55;color:var(--sj-tx3,#6B7588)}.sjb-n{position:absolute;top:4px;left:calc(50% + 6px);min-width:18px;height:18px;padding:0 5px;border-radius:9px;background:var(--sj-red,#D93636);color:var(--sj-on,#FFFFFF);font-size:11px;font-weight:700;display:inline-flex;align-items:center;justify-content:center}.sjph-bar{display:flex;align-items:center;gap:8px;margin:0 0 12px;padding:8px 12px;border-radius:10px;background:var(--sj-blu-bg,#E8F0FB);color:var(--sj-blu-fg,#1D5FAE);font-size:12.5px;line-height:1.45}.sjph-bar b{font-weight:700}.sjph{position:fixed;inset:0;z-index:960;background:var(--sj-bg,#F3F5F9);display:flex;flex-direction:column}.sjph[hidden]{display:none}.sjph-h{display:flex;align-items:center;gap:10px;padding:12px 14px;background:var(--sj-sf,#FFFFFF);border-bottom:1px solid var(--sj-bd,#E1E6EE)}.sjph-h b{font-size:17px;flex:1}.sjph-h button{min-width:44px;min-height:44px;border:0;background:none;font-size:20px;color:var(--sj-tx2,#4A5568)}.sjph-s{padding:10px 14px;background:var(--sj-sf,#FFFFFF);border-bottom:1px solid var(--sj-bd,#E1E6EE);display:grid;gap:8px}.sjph-s input{width:100%;box-sizing:border-box;min-height:46px;font-size:16px}.sjph-f{display:flex;gap:6px;overflow-x:auto}.sjph-f button{flex:none;min-height:36px;padding:0 12px;border-radius:999px;border:1px solid var(--sj-bd2,#C9D1DD);background:var(--sj-sf,#FFFFFF);color:var(--sj-tx2,#4A5568);font-size:13px;font-weight:600}.sjph-f button.on{background:var(--sj-navy2,#22396B);border-color:var(--sj-navy2,#22396B);color:var(--sj-on,#FFFFFF)}.sjph-l{flex:1;overflow-y:auto;padding:8px 10px 90px}.sjph-r{display:flex;align-items:center;gap:12px;width:100%;text-align:left;padding:12px;margin:0 0 8px;border:1px solid var(--sj-bd,#E1E6EE);border-radius:12px;background:var(--sj-sf,#FFFFFF);color:var(--sj-tx,#1A2233);min-height:64px;box-sizing:border-box}.sjph-r .tx{flex:1;min-width:0}.sjph-r .tx b{display:block;font-size:15px;line-height:1.35}.sjph-r .tx small{display:block;margin-top:3px;font-size:12.5px;color:var(--sj-tx3,#6B7588)}.sjph-r .bd{flex:none;font-size:12px;font-weight:700;padding:3px 8px;border-radius:6px}.sjph-r .bd.od{background:var(--sj-red-bg,#FDECEC);color:var(--sj-red-fg,#C62828)}.sjph-r .bd.d7{background:var(--sj-amb-bg,#FFF6D6);color:var(--sj-amb-fg,#8A6400)}.sjph-r .bd.ok{background:var(--sj-grn-bg,#E6F5EC);color:var(--sj-grn-fg,#1E7A45)}.sjph-r .bd.n{background:var(--sj-sf3,#EEF1F6);color:var(--sj-tx2,#4A5568)}.sjph-e{padding:40px 16px;text-align:center;color:var(--sj-tx3,#6B7588);font-size:14px;line-height:1.6}html.sj-phone .modal{max-width:100vw!important;width:100vw!important;max-height:92vh;border-radius:16px 16px 0 0!important;margin:auto 0 0!important}html.sj-phone .modal-bg{align-items:flex-end!important;padding:0!important}html.sj-phone .modal .mf .btn,html.sj-phone .modal .mbtns .btn{min-height:48px;flex:1}.sjph-hl{outline:3px solid var(--sj-amb,#E0A100);outline-offset:3px;border-radius:8px}.sj-toast1{max-width:calc(100vw - 32px);white-space:normal;line-height:1.45;border-radius:14px}html.sj-phone :is(#mback,.modal-bg,.sgpanel-bg,#pv){z-index:1200!important}html.sj-phone #mback{padding:10px 0 0!important;align-items:flex-end!important;left:0!important}html.sj-phone #mback .modal{max-height:calc(100vh - 10px);display:flex;flex-direction:column}html.sj-phone #mback .modal .mb{overflow:auto}.sjb-n[hidden]{display:none!important}html.sj-phone .sjph{z-index:1100}html.sj-phone .sj-toast1{bottom:auto!important;top:64px}
html.sj-phone .sj-toast1{top:auto!important;bottom:84px!important}.sjpp{position:fixed;left:0;right:0;top:54px;bottom:0;z-index:940;background:var(--sj-bg,#F3F5F9);overflow-y:auto;-webkit-overflow-scrolling:touch;font-family:'Pretendard','Noto Sans KR',system-ui,sans-serif;color:var(--sj-tx,#1A2233)}.sjpp[hidden]{display:none}
html.sj-hasupd .sjpp{top:100px}
.sjpp-in{padding:16px 14px calc(96px + env(safe-area-inset-bottom));max-width:640px;margin:0 auto}
.sjpp-k{font-size:12.5px;font-weight:600;color:var(--sj-tx3,#6B7588)}.sjpp h1{font-size:24px;font-weight:800;margin:2px 0 14px;letter-spacing:-.3px}
.sjpp-kg{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px}
.sjpp-kp{display:flex;flex-direction:column;align-items:flex-start;gap:2px;padding:12px 14px;border:1px solid var(--sj-bd,#E1E6EE);border-radius:14px;background:var(--sj-sf,#FFFFFF);color:var(--sj-tx,#1A2233);text-align:left;min-height:74px}
.sjpp-kp b{font-size:26px;font-weight:800;line-height:1.1}.sjpp-kp span{font-size:13px;color:var(--sj-tx2,#4A5568);font-weight:600}.sjpp-kp:disabled{opacity:1}
.sjpp-kp.r b{color:var(--sj-red-fg,#C62828)}.sjpp-kp.y b{color:var(--sj-amb-fg,#8A6400)}.sjpp-kp.p b{color:var(--sj-pur-fg,#6A3FB5)}.sjpp-kp.g b{color:var(--sj-grn-fg,#1E7A45)}
.sjpp-bg{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px}
.sjpp-b{display:flex;flex-direction:column;align-items:flex-start;gap:8px;padding:14px;min-height:96px;border:1px solid var(--sj-bd,#E1E6EE);border-radius:14px;background:var(--sj-sf,#FFFFFF);color:var(--sj-blu-fg,#1D5FAE);text-align:left;box-shadow:var(--sj-sh1)}
.sjpp-b span{display:flex;flex-direction:column;gap:3px;font-size:15px;font-weight:700;color:var(--sj-tx,#1A2233);line-height:1.3}.sjpp-b small{font-size:12px;font-weight:500;color:var(--sj-tx3,#6B7588)}
.sjpp-b.pri{background:var(--sj-blu,#1F64B8);border-color:var(--sj-blu,#1F64B8);color:var(--sj-on,#FFFFFF)}.sjpp-b.pri span,.sjpp-b.pri small{color:var(--sj-on,#FFFFFF)}
.sjpp-b.hl{border-color:var(--sj-amb,#E0A100);background:var(--sj-amb-bg,#FFF6D6)}
.sjpp-b:active,.sjpp-kp:active,.sjph-r:active{transform:scale(.985)}
.sjpp-s{margin:6px 0 16px}.sjpp-s h2{display:flex;align-items:baseline;gap:8px;font-size:16px;font-weight:800;margin:0 2px 8px}.sjpp-s h2 small{font-size:12px;font-weight:500;color:var(--sj-tx3,#6B7588)}.sjpp-s h2 a{margin-left:auto;font-size:13px;font-weight:600;color:var(--sj-blu-fg,#1D5FAE);text-decoration:none}
.sjpp .sjph-r{margin-bottom:8px}.sjpp .sjph-e{padding:18px 12px;background:var(--sj-sf,#FFFFFF);border:1px dashed var(--sj-bd2,#C9D1DD);border-radius:12px}
.sjpp-note{font-size:12.5px;color:var(--sj-tx3,#6B7588);margin:4px 2px 12px}
.sjpp-full{display:block;width:100%;margin-top:6px;padding:12px;border:0;background:none;color:var(--sj-tx3,#6B7588);font-size:13px;text-decoration:underline}
.sjpp-back{position:fixed;left:10px;top:62px;z-index:945;display:inline-flex;align-items:center;gap:4px;padding:7px 12px 7px 8px;border-radius:999px;border:1px solid var(--sj-bd2,#C9D1DD);background:var(--sj-sf,#FFFFFF);color:var(--sj-tx,#1A2233);font-size:13px;font-weight:700;box-shadow:var(--sj-sh2);text-decoration:none}.sjpp-back[hidden]{display:none}
html.sj-hasupd .sjpp-back{top:108px}
html.sj-phone body:not(.x) #top .sj-nav,html.sj-phone header.top #nav{scrollbar-width:none}
html.sj-phone #top.sj-top,html.sj-phone body header.top{display:none!important}
html.sj-phone:not(.sjpp-on) #main{padding-top:44px!important}
.sjpp-up{display:inline-flex;align-items:center;gap:4px;margin:0 0 10px -4px;padding:6px 10px 6px 6px;border:0;border-radius:999px;background:var(--sj-sf3,#EEF1F6);color:var(--sj-tx2,#4A5568);font-size:13px;font-weight:700}
.sjpp .sjpp-ro{cursor:default}.sjpp .sjpp-ro:active{transform:none}
.sjrq-h{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-bottom:8px}.sjrq-h small{color:var(--sj-tx3,#6B7588);font-size:12.5px}.sjrq-t{font-size:16px;font-weight:700;margin:4px 0}.sjrq-n{font-size:13px;color:var(--sj-tx2,#4A5568);margin-bottom:6px}
.sjrq-l{border:1px solid var(--sj-bd,#E1E6EE);border-radius:12px;overflow:hidden;margin:10px 0}.sjrq-i{display:flex;justify-content:space-between;gap:10px;padding:10px 12px;border-bottom:1px solid var(--sj-sf3,#EEF1F6)}.sjrq-i:last-child{border-bottom:0}.sjrq-i b{font-size:14px}.sjrq-i small{display:block;font-size:12px;color:var(--sj-tx3,#6B7588);margin-top:2px}.sjrq-i>span{text-align:right;white-space:nowrap;font-size:13px}
.sjrq-g{font-size:12px;color:var(--sj-tx3,#6B7588);line-height:1.6}
@font-face{font-family:'Pretendard';font-weight:100 550;font-display:swap;src:url(${FB}fonts/Pretendard-Regular.subset.woff2) format('woff2')}@font-face{font-family:'Pretendard';font-weight:551 900;font-display:swap;src:url(${FB}fonts/Pretendard-Bold.subset.woff2) format('woff2')}
html body,html body :is(button,input,select,textarea,table){font-family:'Pretendard','Noto Sans KR','Malgun Gothic','Apple SD Gothic Neo',system-ui,sans-serif}
:root{--sj-brand:var(--sj-blu,#1F64B8);--sj-brand2:var(--sj-blu,#1F64B8);--sj-focus:var(--sj-blu,#1F64B8)}
.sj-mk{background:var(--sj-sf,#FFFFFF)!important;display:flex!important;align-items:center;justify-content:center;overflow:hidden}.sj-mk img{width:78%;height:auto;display:block}
.sjr .sj-it.on::before,.sjr .sj-vs.on::before{background:var(--sj-brand2)!important}.sjr .sj-vs.cur{box-shadow:inset 0 0 0 1.5px var(--sj-brand2)!important}.sjr .sj-lg small{color:var(--sj-blu-fg,#1D5FAE)!important}
/* 접근성: 키보드로 움직일 때 보이는 테두리 · 작은 글씨 대비 */
:is(a,button,summary,input,select,textarea,[tabindex]):focus-visible{outline:2.5px solid var(--sj-focus)!important;outline-offset:2px!important;border-radius:6px}
.sjr :is(a,button):focus-visible{outline-color:var(--sj-blu-bd,#B5CDEE)!important}
.sjr .sj-hd{color:var(--sj-blu-fg,#1D5FAE)!important}.sjr .sj-it .sj-lt small{color:var(--sj-blu-fg,#1D5FAE)!important}
/* 움직임: 짧고 가볍게 (움직임 줄이기 설정이면 끔) */
@keyframes sjIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}@keyframes sjSide{from{transform:translateX(24px);opacity:.4}to{transform:none;opacity:1}}@keyframes sjPop{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:none}}@keyframes sjFade{from{opacity:0}to{opacity:1}}
.sji:not([hidden]) .sji-p{animation:sjSide .22s cubic-bezier(.2,.8,.2,1)}.sji:not([hidden]) .sji-bg,.sjd-bg,.sjq:not([hidden]) .sjq-bg{animation:sjFade .18s ease}.sjd-p,.sjq:not([hidden]) .sjq-p{animation:sjPop .18s cubic-bezier(.2,.8,.2,1)}.sjs:not([hidden]) .sjs-p{animation:sjIn .2s ease}
.sjh>*{animation:sjIn .25s ease both}.sjh>*:nth-child(2){animation-delay:.03s}.sjh>*:nth-child(3){animation-delay:.06s}.sjh>*:nth-child(4){animation-delay:.09s}.sjh>*:nth-child(n+5){animation-delay:.12s}
:is(.sjh-btn,.sjd-ft button,.sji-go,.qi,.kc,.sjc-hr){transition:transform .12s ease,box-shadow .15s ease,background-color .15s ease}:is(.sjh-btn,.sjd-ft button,.sji-go):active{transform:scale(.97)}.sjh .sjh-k>.kc:hover{transform:translateY(-2px);box-shadow:0 6px 16px rgba(20,36,74,.10)}
.sjr .sj-it,.sjr .sj-vs{transition:background-color .15s ease,color .15s ease}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important}}
/* 그래프 */
.sjc-pad{padding:6px 18px 16px}.sjc-cols{display:flex;align-items:flex-end;gap:6px;height:150px;padding:14px 16px 4px}.sjc-c{flex:1;min-width:0;height:100%;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:3px}
.sjc-c i{display:block;width:100%;max-width:34px;min-height:2px;border-radius:5px 5px 2px 2px;background:var(--sj-blu-bg,#E8F0FB);transition:height .4s ease}.sjc-c.hi i{background:var(--sj-blu,#1F64B8)}.sjc-cols .sjc-c.t-warn.hi i{background:var(--sj-amb,#E0A100)}.sjc-cols .sjc-c.t-warn i{background:var(--sj-amb-bd,#EED68A)}.sjc-cols .sjc-c.t-ok i{background:var(--sj-grn-bd,#A9DCC0)}.sjc-cols .sjc-c.t-ok.hi i{background:var(--sj-grn,#2FA36B)}.sjc-cols .sjc-c.t-brand i{background:var(--sj-blu-bd,#B5CDEE)}.sjc-cols .sjc-c.t-brand.hi i{background:var(--sj-blu,#1F64B8)}.sjc-c{position:relative;outline:none}.sjc-c:is(:hover,:focus-visible)::after{content:attr(data-tip);position:absolute;bottom:calc(100% - 14px);left:50%;transform:translateX(-50%);background:var(--sj-inv,#2A3242);color:var(--sj-on,#FFFFFF);font-size:12px;font-weight:600;padding:5px 9px;border-radius:6px;white-space:nowrap;z-index:5;pointer-events:none;box-shadow:var(--sj-sh2)}.sjc-c:is(:hover,:focus-visible) i{filter:brightness(.9)}.sjc-w .sjc-bar{display:flex;align-items:center;gap:10px;padding:10px 16px 0;margin:0}.sjc-sum{font-size:12px;color:var(--sj-tx3,#6B7588)}.sjc-sum b{color:var(--sj-tx,#1A2233);font-size:14px}.sjc-rg{margin-left:auto;display:inline-flex;background:var(--sj-sf3,#EEF1F6);border-radius:8px;padding:2px}.sjc-w .sjc-rg button{border:0;background:none;color:var(--sj-tx2,#4A5568);font-size:12px;font-weight:600;padding:4px 9px;border-radius:6px;cursor:pointer}.sjc-w .sjc-rg button.on{background:var(--sj-sf,#FFFFFF);color:var(--sj-tx,#1A2233);box-shadow:var(--sj-sh1)}.sjc-none{height:150px;display:flex;align-items:center;justify-content:center;color:var(--sj-tx3,#6B7588);font-size:13px;background:repeating-linear-gradient(0deg,transparent 0 37px,var(--sj-sf3,#EEF1F6) 37px 38px)}.sjc-c{background:none!important;padding:0!important;border:0!important}
.sjc-c small{font-size:12px;color:var(--sj-tx2,#4A5568);white-space:nowrap}.sjc-v{font-size:12px;font-weight:700;color:var(--sj-tx,#1A2233);min-height:16px}
.sjc-leg{display:flex;flex-wrap:wrap;gap:6px 16px;font-size:13px;color:var(--sj-tx2,#4A5568);margin:4px 0 10px}.sjc-leg span{display:inline-flex;align-items:center;gap:6px}.sjc-leg i{width:10px;height:10px;border-radius:3px}
.sjc-h{display:flex;flex-direction:column;gap:6px}.sjc-hr{display:grid;grid-template-columns:118px 1fr 34px;align-items:center;gap:10px;width:100%;border:0;background:none;padding:4px 6px;border-radius:8px;font:inherit;text-align:left;cursor:default}button.sjc-hr{cursor:pointer}button.sjc-hr:hover{background:var(--sj-sf2,#F7F9FC)}
.sjc-hl{font-size:13px;font-weight:700;color:var(--sj-tx,#1A2233);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sjc-hb{display:flex;height:16px;border-radius:5px;overflow:hidden;background:var(--sj-sf2,#F7F9FC)}.sjc-hb i{display:block;height:100%}.sjc-hb em{font-style:normal;font-size:12px;color:var(--sj-tx3,#6B7588);padding-left:6px;line-height:16px}.sjc-ht{font-size:13px;font-weight:800;color:var(--sj-tx,#1A2233);text-align:right}
/* 빈 화면 안내 */
.sjh-empty,.sjx-empty0{display:flex;flex-direction:column;align-items:center;gap:6px;padding:26px 16px!important;color:var(--sj-tx2,#4A5568);text-align:center}.sjh-empty::before{content:'';width:44px;height:44px;border-radius:50%;background:var(--sj-grn-bg,#E6F5EC) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231E7F4E' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 6 9 17l-5-5'/%3E%3C/svg%3E") center/22px no-repeat;margin-bottom:4px}

.sjr{position:fixed;left:0;top:0;bottom:0;width:var(--sjr-w);transition:width .15s;z-index:900;box-sizing:border-box;background:var(--sj-navy,#14244A);color:var(--sj-on2,#DCE6F5);font-family:'Pretendard','Noto Sans KR','Malgun Gothic','Apple SD Gothic Neo',system-ui,sans-serif;display:flex;flex-direction:column;padding:16px 14px;gap:4px;overflow-y:auto}
:root{--sjr-w:248px}html.sj-railmin{--sjr-w:76px}
.sjr .sj-lgr{display:flex;align-items:center;gap:4px}.sjr .sj-lgr .sj-lg{flex:1;min-width:0}.sjr .sj-srch{position:relative}.sjr .sj-min{flex:none;width:30px;height:30px;border-radius:8px;border:0;background:none;color:var(--sj-blu-fg,#1D5FAE);cursor:pointer;display:flex;align-items:center;justify-content:center;margin-bottom:10px}.sjr .sj-min:hover{background:var(--sj-navy2,#22396B);color:var(--sj-on,#FFFFFF)}
.sjr .sj-ft .sj-it{min-height:40px}.sjr .sj-ftl{display:flex;align-items:center;gap:6px;background:var(--sj-navy,#14244A);border-radius:12px;padding:4px 6px 4px 4px}.sjr .sj-ftl .sj-sy{flex:1;min-width:0;background:none!important;padding:6px 8px!important}.sjr .sj-ftl .sj-sy .sj-t{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:13px}
.sjr .sj-ftl .sj-up{flex:none;padding:4px 8px;border-radius:8px;min-height:0}.sjr .sj-ftl .sj-up .sj-ut span{font-size:12px;color:var(--sj-blu-fg,#1D5FAE)}.sjr .sj-ftl .sj-up .sj-ut small{display:none}.sjr .sj-ftl .sj-up.has .sj-ut small{display:block;font-size:11px}.sjr .sj-ftl .sj-up:hover{background:var(--sj-navy2,#22396B)}
html.sj-railmin .sjr{padding:16px 10px}html.sj-railmin .sjr .sj-lg span,html.sj-railmin .sjr .sj-lt,html.sj-railmin .sjr .sj-srch span,html.sj-railmin .sjr .sj-srch kbd,html.sj-railmin .sjr .sj-vt,html.sj-railmin .sjr .sj-vl,html.sj-railmin .sjr .sj-hd span,html.sj-railmin .sjr .sj-ftl .sj-t,html.sj-railmin .sjr .sj-ftl .sj-up{display:none!important}
html.sj-railmin .sjr .sj-lgr{flex-direction:column}html.sj-railmin .sjr .sj-min{transform:rotate(180deg);margin:0 0 8px}html.sj-railmin .sjr .sj-lg{padding:4px 0 6px;justify-content:center}html.sj-railmin .sjr .sj-it,html.sj-railmin .sjr .sj-srch{justify-content:center;padding:9px 0;gap:0}html.sj-railmin .sjr .sj-vb{justify-content:center;padding:8px 0}
html.sj-railmin .sjr .sj-it .sj-bd,html.sj-railmin .sjr .sj-srch .sj-bd{position:absolute;top:3px;right:4px;padding:0 5px!important;font-size:11px!important;margin:0}html.sj-railmin .sjr .sj-hd{margin:8px 4px 2px}html.sj-railmin .sjr .sj-it.on::before{left:-10px}html.sj-railmin .sjr .sj-ftl{justify-content:center;padding:6px 0}html.sj-railmin .sjr .sj-ftl .sj-sy{flex:none;padding:6px!important}
.sji-k.inv{background:var(--sj-pur-bg,#F1ECFB);color:var(--sj-pur-fg,#6A3FB5)}
.sjr .sj-flr{display:flex;align-items:center;gap:2px;margin-top:6px}.sjr .sj-flr .sj-it{flex:1;min-width:0}.sjr .sj-vtg{flex:none;width:32px;height:32px;border:0;border-radius:8px;background:none;color:var(--sj-blu-fg,#1D5FAE);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .15s}.sjr .sj-vtg:hover{background:var(--sj-navy2,#22396B);color:var(--sj-on,#FFFFFF)}.sjr .sj-vtg.min{transform:rotate(-90deg)}
html.sj-railmin .sjr .sj-vtg{display:none}html.sj-railmin .sjr .sj-flr{margin-top:4px}
.sjr *{box-sizing:border-box}.sjr [hidden]{display:none!important}.sjr a{text-decoration:none}
.sjr .sj-lg{display:flex;align-items:center;gap:10px;padding:4px 8px 14px;color:var(--sj-on,#FFFFFF)}.sjr .sj-lg i{width:36px;height:36px;border-radius:10px;background:var(--sj-amb,#E0A100);color:var(--sj-tx,#1A2233);display:flex;align-items:center;justify-content:center;font:800 18px/1 inherit;font-style:normal}
.sjr .sj-lg b{display:block;font-size:16px}.sjr .sj-lg small{display:block;font-size:12px;color:var(--sj-blu-fg,#1D5FAE);letter-spacing:.05em}
.sjr .sj-vb{display:flex;align-items:center;gap:10px;background:var(--sj-navy,#14244A);border:1px solid var(--sj-blu,#1F64B8);border-radius:12px;padding:9px 11px;margin-bottom:8px;color:var(--sj-on,#FFFFFF);width:100%;text-align:left;font:inherit}
.sjr .sj-vb .sj-vi{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex:none}.sjr .sj-vb .sj-vi.s{background:var(--sj-blu-bg,#E8F0FB);color:var(--sj-tx,#1A2233)}.sjr .sj-vb .sj-vi.o{background:var(--sj-amb-bg,#FFF6D6);color:var(--sj-amb-fg,#8A6400)}
.sjr .sj-vb .sj-vt{flex:1;min-width:0}.sjr .sj-vb .sj-vt small{display:block;font-size:13px;color:var(--sj-blu-fg,#1D5FAE)}.sjr .sj-vb .sj-vt b{display:block;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sjr .sj-vb select{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;color:var(--sj-tx,#1A2233);background:var(--sj-sf,#FFFFFF)}.sjr .sj-vb select option{color:var(--sj-tx,#1A2233);background:var(--sj-sf,#FFFFFF)}.sjr .sj-vbw{position:relative}
.sjr .sj-hd{font-size:12px;font-weight:800;letter-spacing:.12em;color:var(--sj-blu-fg,#1D5FAE);text-transform:uppercase;margin:12px 10px 4px;display:flex;align-items:center;gap:8px}.sjr .sj-hd::after{content:'';flex:1;height:1px;background:var(--sj-navy2,#22396B)}
.sjr .sj-it{position:relative;display:flex;align-items:center;gap:12px;padding:9px 12px;border-radius:10px;color:var(--sj-on2,#DCE6F5);font-size:16px;font-weight:600;min-height:46px}
.sjr .sj-it .sj-lt{display:flex;flex-direction:column;line-height:1.2;min-width:0}.sjr .sj-it .sj-lt small{font-size:13px;font-weight:500;color:var(--sj-blu-fg,#1D5FAE);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sjr .sj-it:not(.on):hover{background:var(--sj-navy2,#22396B)}.sjr .sj-it .sj-ii{color:var(--sj-blu-fg,#1D5FAE);display:flex}
.sjr .sj-it.on,.sjr .sj-vs.on{background:var(--sj-sf,#FFFFFF);color:var(--sj-tx,#1A2233);font-weight:800;box-shadow:0 2px 10px rgba(0,0,0,.25)}.sjr .sj-it.on .sj-ii{color:var(--sj-blu-fg,#1D5FAE)}.sjr .sj-it.on .sj-lt small{color:var(--sj-blu-fg,#1D5FAE)}
.sjr .sj-it.on::before,.sjr .sj-vs.on::before{content:'';position:absolute;left:-14px;top:8px;bottom:8px;width:5px;border-radius:0 4px 4px 0;background:var(--sj-amb,#E0A100)}
.sjr .sj-it .sj-bd,.sjr .sj-vs .sj-bd{margin-left:auto;background:var(--sj-red,#D93636);color:var(--sj-on,#FFFFFF);border-radius:10px;padding:1px 8px;font-size:12px;font-weight:700}.sjr .sj-bd.y{background:var(--sj-amb,#E0A100)!important;color:var(--sj-tx,#1A2233)!important}
.sjr .sj-vl{display:flex;flex-direction:column;gap:2px;margin:2px 0 0 14px;padding-left:10px;border-left:2px solid var(--sj-blu,#1F64B8)}
.sjr .sj-vs{position:relative;display:flex;align-items:center;gap:9px;padding:5px 10px;border-radius:8px;color:var(--sj-on2,#DCE6F5);font-size:14px;font-weight:600;min-height:31px;letter-spacing:.01em}.sjr .sj-vs:not(.on):hover{background:var(--sj-navy2,#22396B);color:var(--sj-on,#FFFFFF)}.sjr .sj-vs.on::before{left:-25px}
.sjr .sj-vs.cur{background:var(--sj-navy2,#22396B);color:var(--sj-on,#FFFFFF);font-weight:800;box-shadow:inset 0 0 0 1.5px var(--sj-amb,#E0A100)}
.sjr .sj-vs .sj-vn{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sjr .sj-dt{width:9px;height:9px;border-radius:50%;background:var(--sj-blu,#1F64B8);flex:none}.sjr .sj-dt.r{background:var(--sj-red,#D93636)}.sjr .sj-dt.y{background:var(--sj-amb,#E0A100)}.sjr .sj-dt.g{background:var(--sj-grn,#2FA36B)}
.sjr .sj-soon{display:flex;align-items:center;gap:6px;margin:10px 10px 0;font-size:13px;white-space:nowrap;color:var(--sj-blu-fg,#1D5FAE)}.sjr .sj-soon span{border:1px solid var(--sj-blu,#1F64B8);border-radius:10px;padding:0 7px;font-size:11px;color:var(--sj-blu-fg,#1D5FAE)}
.sjr .sj-up .sj-ut{display:flex;flex-direction:column;line-height:1.25}.sjr .sj-up .sj-ut span{font-size:13px;color:var(--sj-blu-fg,#1D5FAE)}.sjr .sj-up .sj-ut small{font-size:13px;color:var(--sj-blu-fg,#1D5FAE)}.sjr .sj-up.has{background:var(--sj-amb,#E0A100)!important;color:var(--sj-tx,#1A2233)!important}.sjr .sj-up.has .sj-ii,.sjr .sj-up.has .sj-ut span,.sjr .sj-up.has .sj-ut small{color:var(--sj-tx,#1A2233)!important;font-weight:700}
.sjr .sj-ft{margin-top:auto;display:flex;flex-direction:column;gap:6px;padding-top:10px}
.sjr .sj-sy{display:flex;align-items:center;gap:9px;background:var(--sj-navy,#14244A);border-radius:12px;padding:10px 12px;font-size:14px;color:var(--sj-blu-fg,#1D5FAE)}.sjr .sj-sy .sj-d{width:9px!important;height:9px!important;min-width:0!important;padding:0!important;border-radius:50%;background:var(--sj-blu,#1F64B8);flex:none}.sjr .sj-sy .sj-d.ok{background:var(--sj-grn,#2FA36B)}.sjr .sj-sy .sj-d.warn{background:var(--sj-amb,#E0A100)}.sjr .sj-sy .sj-d.err{background:var(--sj-red,#D93636)}
@media (max-width:899px){.sjr{display:none!important}}
@media print{.sjr,.sjmob,.sjq,.sji{display:none!important}}
.sjd{position:fixed;inset:0;z-index:1500;font-family:'Pretendard','Noto Sans KR','Malgun Gothic','Apple SD Gothic Neo',system-ui,sans-serif;display:flex;align-items:center;justify-content:center}.sjd-bg{position:absolute;inset:0;background:rgba(10,20,40,.45)}
@media (min-width:900px){.sjd{left:var(--sjr-w)}}
.sjd-p{position:relative;width:min(760px,96vw);max-height:92vh;background:var(--sj-sf,#FFFFFF);border-radius:18px;box-shadow:0 24px 60px rgba(15,23,42,.35);display:flex;flex-direction:column;overflow:hidden}
.sjd-h{padding:16px 22px 12px;border-bottom:1px solid var(--sj-blu-bd,#B5CDEE)}.sjd-ct{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.sjd-h h2{margin:8px 0 0;font-size:20px;line-height:1.35;color:var(--sj-tx,#1A2233)}.sjd-sub{font-size:14px;color:var(--sj-tx2,#4A5568);margin-top:4px}
.sjd-k{font-size:12px;font-weight:800;border-radius:6px;padding:3px 8px;background:var(--sj-blu-bg,#E8F0FB);color:var(--sj-blu-fg,#1D5FAE)}.sjd-k.rsk{background:var(--sj-org-bg,#FFF0E0);color:var(--sj-org-fg,#B85C00)}.sjd-v{font-weight:800;color:var(--sj-tx,#1A2233);font-size:14px}.sjd-no{font-size:13px;color:var(--sj-tx2,#4A5568);font-weight:600}
.sjd-x{margin-left:auto;border:0;background:none;font-size:20px;color:var(--sj-tx2,#4A5568);cursor:pointer;padding:2px 6px}
.sjd-b{overflow:auto;padding:14px 22px 6px}.sjd-kv{display:grid;grid-template-columns:120px 1fr;gap:6px 14px;margin:0 0 6px;font-size:14px}.sjd-kv dt{color:var(--sj-tx2,#4A5568)}.sjd-kv dd{margin:0;color:var(--sj-tx,#1A2233);font-weight:600;white-space:pre-line}
.sjd-s{margin-top:14px}.sjd-s h3{font-size:13px;font-weight:800;color:var(--sj-tx2,#4A5568);margin:0 0 6px;letter-spacing:.02em}.sjd-s p{margin:0;font-size:14px;line-height:1.55;white-space:pre-line}
.sjd-tw{overflow:auto;max-height:280px;border:1px solid var(--sj-blu-bd,#B5CDEE);border-radius:10px}.sjd-t{width:100%;border-collapse:collapse;font-size:13px}.sjd-t th{background:var(--sj-sf2,#F7F9FC);text-align:left;padding:7px 9px;position:sticky;top:0;font-weight:700;color:var(--sj-tx,#1A2233)}.sjd-t td{padding:7px 9px;border-top:1px solid var(--sj-bd,#E1E6EE);vertical-align:top}.sjd-t input{width:80px;padding:4px 6px;border:1px solid var(--sj-bd2,#C9D1DD);border-radius:6px}
.sjd-tl{list-style:none;margin:0;padding:0 0 0 14px;border-left:2px solid var(--sj-blu-bd,#B5CDEE);font-size:13px}.sjd-tl li{margin:0 0 6px;position:relative}.sjd-tl li:before{content:'';position:absolute;left:-19px;top:6px;width:8px;height:8px;border-radius:50%;background:var(--sj-bd2,#C9D1DD)}.sjd-tl span{display:block;color:var(--sj-tx2,#4A5568)}
.sjd-in{background:var(--sj-sf2,#F7F9FC);border:1px solid var(--sj-blu-bd,#B5CDEE);border-radius:12px;padding:12px 14px}.sjd-fs{display:flex;flex-wrap:wrap;gap:10px}.sjd-f{display:flex;flex-direction:column;gap:4px;flex:1 1 200px;font-size:13px;font-weight:700;color:var(--sj-tx,#1A2233)}.sjd-f.w{flex-basis:100%}.sjd-f i{color:var(--sj-red-fg,#C62828);font-style:normal}
.sjd-f input,.sjd-f textarea{font:inherit;font-weight:400;font-size:16px;padding:9px 11px;border:1.5px solid var(--sj-bd2,#C9D1DD);border-radius:10px;background:var(--sj-sf,#FFFFFF)}.sjd-f textarea{resize:vertical}
.sjd-err{color:var(--sj-red-fg,#C62828);font-weight:700;font-size:14px;min-height:18px;margin:8px 0 4px}
.sjd-ft{display:flex;gap:8px;align-items:center;padding:12px 22px;border-top:1px solid var(--sj-blu-bd,#B5CDEE);background:var(--sj-sf2,#F7F9FC);flex-wrap:wrap}.sjd-ft .sp{flex:1}
.sjd-ft button{font:inherit;font-size:16px;font-weight:700;border-radius:10px;padding:10px 16px;cursor:pointer;border:1.5px solid var(--sj-bd2,#C9D1DD);background:var(--sj-sf,#FFFFFF);color:var(--sj-tx,#1A2233)}
.sjd-a.ok{background:var(--sj-grn,#2FA36B);border-color:var(--sj-grn,#2FA36B);color:var(--sj-on,#FFFFFF)}.sjd-a.cond{background:var(--sj-sf,#FFFFFF);border-color:var(--sj-amb,#E0A100);color:var(--sj-amb-fg,#8A6400)}.sjd-a.rej{background:var(--sj-sf,#FFFFFF);border-color:var(--sj-red,#D93636);color:var(--sj-red-fg,#C62828)}.sjd-a.neu{background:var(--sj-sf,#FFFFFF)}.sjd-a[disabled]{opacity:.45;cursor:not-allowed}
@media (max-width:640px){.sjd-p{width:100vw;max-height:100vh;height:100vh;border-radius:0}.sjd-kv{grid-template-columns:96px 1fr}.sjd-ft{position:sticky;bottom:0}.sjd-ft button{flex:1 1 auto}}
.sjst{display:inline-flex;align-items:center;gap:5px;border-radius:999px;padding:2px 10px;font-size:12px;font-weight:800;line-height:1.6;white-space:nowrap}.sjst:before{content:'';width:7px;height:7px;border-radius:50%;background:currentColor;opacity:.85}
.sjst.wait{background:var(--sj-amb-bg,#FFF6D6);color:var(--sj-amb-fg,#8A6400)}.sjst.prog{background:var(--sj-blu-bg,#E8F0FB);color:var(--sj-blu-fg,#1D5FAE)}.sjst.ok{background:var(--sj-grn-bg,#E6F5EC);color:var(--sj-grn-fg,#1E7A45)}.sjst.rej{background:var(--sj-red-bg,#FDECEC);color:var(--sj-red-fg,#C62828)}.sjst.done{background:var(--sj-sf3,#EEF1F6);color:var(--sj-tx2,#4A5568)}.sjst.draft{background:var(--sj-sf3,#EEF1F6);color:var(--sj-tx2,#4A5568)}
@media print{.sjd{display:none!important}}

.sjr .sj-inb{margin-top:6px}.sjr .sj-inb .sj-bd{margin-left:auto;background:var(--sj-red,#D93636);color:var(--sj-on,#FFFFFF);border-radius:10px;padding:1px 8px;font-size:12px;font-weight:800}.sjr .sj-inb .sj-bd[hidden]{display:none}.sjm-inb{position:relative}.sjm-inb b{position:absolute;top:3px;right:1px;min-width:17px;height:17px;padding:0 4px;border-radius:9px;background:var(--sj-red,#D93636);color:var(--sj-on,#FFFFFF);font-size:11px;line-height:17px;text-align:center}.sjm-inb b[hidden]{display:none}
.sji{position:fixed;inset:0;z-index:2000;font-family:'Pretendard','Noto Sans KR','Malgun Gothic','Apple SD Gothic Neo',system-ui,sans-serif}.sji[hidden]{display:none}.sji-bg{position:absolute;inset:0;background:rgba(10,20,40,.35)}.sji-p{position:absolute;top:0;right:0;bottom:0;width:min(440px,100vw);background:var(--sj-sf,#FFFFFF);display:flex;flex-direction:column;box-shadow:-10px 0 40px rgba(0,0,0,.25)}.sji-h{display:flex;align-items:center;gap:8px;padding:14px 16px;border-bottom:1px solid var(--sj-blu-bd,#B5CDEE)}.sji-h b{font-size:18px;color:var(--sj-tx,#1A2233);flex:1}.sji-h button{border:1px solid var(--sj-blu-bd,#B5CDEE);background:var(--sj-sf,#FFFFFF);border-radius:8px;padding:6px 10px;font:inherit;font-size:13px;cursor:pointer;color:var(--sj-tx,#1A2233)}.sji-h .x{border:0;font-size:18px}.sji-f{display:flex;gap:6px;padding:10px 16px;flex-wrap:wrap;border-bottom:1px solid var(--sj-bd,#E1E6EE)}.sji-f button{border:1px solid var(--sj-blu-bd,#B5CDEE);background:var(--sj-sf,#FFFFFF);border-radius:16px;padding:4px 11px;font:inherit;font-size:13px;cursor:pointer;color:var(--sj-tx,#1A2233)}.sji-f button.on{background:var(--sj-navy,#14244A);color:var(--sj-on,#FFFFFF);border-color:var(--sj-blu,#1F64B8)}.sji-l{flex:1;overflow:auto}.sji-tb{display:flex;gap:0;padding:0 16px;border-bottom:1px solid var(--sj-blu-bd,#B5CDEE)}.sji-tb button{flex:1;border:0;background:none;padding:12px 8px;font:inherit;font-size:16px;font-weight:600;color:var(--sj-tx2,#4A5568);cursor:pointer;border-bottom:3px solid transparent}.sji-tb button.on{color:var(--sj-tx,#1A2233);border-bottom-color:var(--sj-blu,#1F64B8)}.sji-tb b{display:inline-block;min-width:20px;padding:0 6px;border-radius:10px;background:var(--sj-blu-bg,#E8F0FB);color:var(--sj-tx,#1A2233);font-size:12px;margin-left:4px}.sji-tb b.y{background:var(--sj-amb,#E0A100);color:var(--sj-on,#FFFFFF)}.sji-tb b.r{background:var(--sj-red,#D93636);color:var(--sj-on,#FFFFFF)}.sji-f[hidden],[data-sjiall][hidden]{display:none!important}.sji-ah{padding:10px 16px;font-size:13px;color:var(--sj-tx2,#4A5568);background:var(--sj-sf2,#F7F9FC);border-bottom:1px solid var(--sj-bd,#E1E6EE)}.sji-c{position:relative;padding:12px 16px 12px;border-bottom:1px solid var(--sj-bd,#E1E6EE);display:flex;flex-direction:column;gap:3px}.sji-c b{font-size:14px;color:var(--sj-tx,#1A2233)}.sji-c small{font-size:13px;color:var(--sj-tx2,#4A5568);line-height:1.45}.sji-ct{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-bottom:2px}.sji-k{font-size:12px;font-weight:700;border-radius:6px;padding:2px 7px;background:var(--sj-blu-bg,#E8F0FB);color:var(--sj-blu-fg,#1D5FAE)}.sji-k.rsk{background:var(--sj-org-bg,#FFF0E0);color:var(--sj-org-fg,#B85C00)}.sji-k.dev{background:var(--sj-sf3,#EEF1F6);color:var(--sj-tx2,#4A5568)}.sji-v{font-size:13px;font-weight:700;color:var(--sj-tx,#1A2233)}.sji-st{margin-left:auto;font-size:12px;font-weight:700;border-radius:10px;padding:2px 8px}.sji-st.y{background:var(--sj-amb-bg,#FFF6D6);color:var(--sj-amb-fg,#8A6400)}.sji-st.b{background:var(--sj-blu-bg,#E8F0FB);color:var(--sj-blu-fg,#1D5FAE)}.sji-st.g{background:var(--sj-sf3,#EEF1F6);color:var(--sj-tx2,#4A5568)}.sji-st.r{background:var(--sj-red-bg,#FDECEC);color:var(--sj-red-fg,#C62828)}.sji-go{align-self:flex-end;margin-top:6px;border:1px solid var(--sj-blu-bd,#B5CDEE);background:var(--sj-sf,#FFFFFF);color:var(--sj-tx,#1A2233);border-radius:8px;padding:7px 12px;font:inherit;font-size:14px;font-weight:700;cursor:pointer}.sji-go.pri{background:var(--sj-navy,#14244A);color:var(--sj-on,#FFFFFF);border-color:var(--sj-blu,#1F64B8)}.sji-r{display:flex;gap:11px;width:100%;text-align:left;padding:12px 16px;border:0;border-bottom:1px solid var(--sj-bd,#E1E6EE);background:var(--sj-sf,#FFFFFF);font:inherit;cursor:pointer;align-items:flex-start}.sji-r:hover{background:var(--sj-sf2,#F7F9FC)}.sji-r.un{background:var(--sj-blu-bg,#E8F0FB)}.sji-r .ic{flex:none;width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;color:var(--sj-on,#FFFFFF);background:var(--sj-gry,#8A94A6)}.sji-r .ic.pms{background:var(--sj-blu,#1F64B8)}.sji-r .ic.rsk{background:var(--sj-org,#E07A1F)}.sji-r .ic.apv{background:var(--sj-grn,#2FA36B)}.sji-r .ic.rej{background:var(--sj-red,#D93636)}.sji-r .tx{flex:1;min-width:0}.sji-r .tx b{display:block;font-size:14px;color:var(--sj-tx,#1A2233);font-weight:600}.sji-r.un .tx b{font-weight:800}.sji-r .tx small{display:block;color:var(--sj-tx2,#4A5568);font-size:13px;margin-top:2px;white-space:pre-line;overflow:hidden;text-overflow:ellipsis;max-height:3.2em}.sji-r .tm{flex:none;font-size:12px;color:var(--sj-blu-fg,#1D5FAE);white-space:nowrap}.sji-r .dot{flex:none;width:8px;height:8px;border-radius:50%;background:var(--sj-blu,#1F64B8);margin-top:6px}.sji-r:not(.un) .dot{visibility:hidden}.sji-e{padding:40px 20px;text-align:center;color:var(--sj-tx2,#4A5568);font-size:14px;line-height:1.7}.sji-ft{padding:10px 16px;font-size:12px;color:var(--sj-blu-fg,#1D5FAE);border-top:1px solid var(--sj-bd,#E1E6EE)}
.sjr .sj-srch{display:flex;align-items:center;gap:10px;width:100%;margin:10px 0 2px;padding:9px 12px;border-radius:10px;border:1px solid var(--sj-blu,#1F64B8);background:var(--sj-navy,#14244A);color:var(--sj-blu-fg,#1D5FAE);font:inherit;font-size:14px;cursor:pointer;text-align:left}.sjr .sj-srch:hover{background:var(--sj-navy2,#22396B);color:var(--sj-on,#FFFFFF)}.sjr .sj-srch span{flex:1}.sjr .sj-srch kbd{font:inherit;font-size:11px;color:var(--sj-blu-fg,#1D5FAE);border:1px solid var(--sj-blu,#1F64B8);border-radius:5px;padding:0 5px}
.sjm-sr{background:none;border:0;color:var(--sj-on,#FFFFFF);width:38px;height:38px;display:flex;align-items:center;justify-content:center;cursor:pointer}
.sjq{position:fixed;inset:0;z-index:2000;font-family:'Pretendard','Noto Sans KR','Malgun Gothic','Apple SD Gothic Neo',system-ui,sans-serif}.sjq[hidden]{display:none}.sjq-bg{position:absolute;inset:0;background:rgba(15,23,42,.45)}
.sjq-p{position:relative;margin:8vh auto 0;width:min(680px,94vw);max-height:78vh;display:flex;flex-direction:column;background:var(--sj-sf,#FFFFFF);border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.3);overflow:hidden}
.sjq-i{display:flex;align-items:center;gap:10px;padding:12px 16px;border-bottom:1px solid var(--sj-bd,#E1E6EE);color:var(--sj-tx2,#4A5568)}.sjq-i input{flex:1;border:0;outline:0;font:inherit;font-size:18px;padding:6px 0;color:var(--sj-tx,#1A2233);background:none}.sjq-x{border:0;background:var(--sj-sf2,#F7F9FC);border-radius:50%;width:32px;height:32px;cursor:pointer}
.sjq-l{overflow:auto;padding:6px 0 10px}.sjq-g{font-size:13px;font-weight:800;color:var(--sj-tx2,#4A5568);padding:10px 18px 4px}.sjq-g span{color:var(--sj-tx3,#6B7588);font-weight:600}
.sjq-r{display:block;width:100%;text-align:left;border:0;background:none;padding:9px 18px;cursor:pointer;font:inherit;color:var(--sj-tx,#1A2233)}.sjq-r:hover,.sjq-r.on{background:var(--sj-blu-bg,#E8F0FB)}.sjq-r b{display:block;font-size:14px;font-weight:700}.sjq-r small{display:block;font-size:13px;color:var(--sj-tx2,#4A5568)}.sjq-e{padding:24px 18px;color:var(--sj-tx2,#4A5568);font-size:14px;line-height:1.7}
@media (max-width:640px){.sjq-p{margin:0;width:100vw;max-height:100vh;height:100vh;border-radius:0}}

.sjh{max-width:1200px;color:var(--sj-tx,#1A2233)}.sjh *{box-sizing:border-box}.sjh a{text-decoration:none}.sjh button{font:inherit;color:inherit;text-align:inherit;background:none;border:0;margin:0;cursor:pointer}
.sjh-hd{display:flex;align-items:flex-end;gap:10px;margin:2px 0 16px;flex-wrap:wrap}.sjh-hd small{display:block;color:var(--sj-tx2,#4A5568);font-size:14px;font-weight:600}.sjh-hd h1{margin:2px 0 0;font-size:26px;font-weight:800;color:var(--sj-tx,#1A2233);letter-spacing:-.01em}.sjh .sp{flex:1}
.sjh .sjh-btn,.sjh-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;border-radius:11px;padding:9px 15px;font-weight:800;font-size:14px;border:1.5px solid var(--sj-bd2,#C9D1DD);background:var(--sj-sf,#FFFFFF);color:var(--sj-tx,#1A2233)!important;cursor:pointer;white-space:nowrap;font-family:inherit}.sjh-btn:hover{border-color:var(--sj-blu,#1F64B8)}
.sjh .sjh-btn.pri,.sjh-btn.pri{background:var(--sj-navy,#14244A);border-color:var(--sj-blu,#1F64B8);color:var(--sj-on,#FFFFFF)!important}.sjh-btn.pri:hover{background:var(--sj-navy2,#22396B)}.sjh-btn.big{font-size:16px;padding:12px 18px;border-radius:12px}.sjh-btn.s{padding:6px 12px;font-size:14px;border-radius:9px}
.sjh-band{display:flex;align-items:center;gap:10px;border-radius:12px;padding:10px 14px;background:var(--sj-amb-bg,#FFF6D6);border:1px solid var(--sj-amb-bd,#EED68A);color:var(--sj-amb-fg,#8A6400);font-size:14px;margin:0 0 12px}.sjh-band>*{margin:0!important}
.sjh-hero{display:flex;gap:18px;align-items:center;background:var(--sj-sf,#FFFFFF);border:1px solid var(--sj-bd,#E1E6EE);border-left:6px solid var(--sj-red,#D93636);border-radius:16px;padding:18px 22px;margin:0 0 14px}.sjh-hero.y{border-left-color:var(--sj-amb,#E0A100)}.sjh-hero.g{border-left-color:var(--sj-grn,#2FA36B)}.sjh-hero.n{border-left-color:var(--sj-bd2,#C9D1DD)}.sjh-hero.b{border-left-color:var(--sj-blu,#1F64B8)}
.sjh-hero .sjh-tx{flex:1;min-width:0}.sjh-hero small{display:block;color:var(--sj-tx2,#4A5568);font-size:14px;font-weight:600}.sjh-hero b{display:block;font-size:22px;margin:4px 0;font-weight:800}.sjh-hero em{font-style:normal}.sjh-hero em.r{color:var(--sj-red-fg,#C62828)}.sjh-hero em.y{color:var(--sj-org-fg,#B85C00)}.sjh-hero .sjh-tx>span{color:var(--sj-tx2,#4A5568);font-size:14px}
.sjh-k{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin:0 0 16px}.sjh .sjh-k>.kc{display:block;width:100%;text-align:left!important;background:var(--sj-sf,#FFFFFF);border:1px solid var(--sj-bd,#E1E6EE);border-radius:14px;padding:14px 16px;color:inherit;cursor:pointer}.sjh .sjh-k>.kc:hover{border-color:var(--sj-blu,#1F64B8)}
.sjh-k b{display:block;font-size:30px;font-weight:800;line-height:1.1}.sjh-k span{color:var(--sj-tx2,#4A5568);font-size:14px;font-weight:600}.sjh-k .t-r b{color:var(--sj-red-fg,#C62828)}.sjh-k .t-y b{color:var(--sj-org-fg,#B85C00)}.sjh-k .t-b b{color:var(--sj-blu-fg,#1D5FAE)}.sjh-k .zero b{color:var(--sj-tx3,#6B7588)}
.sjh-c{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(280px,1fr);gap:16px;align-items:start}
.sjh-card{background:var(--sj-sf,#FFFFFF);border:1px solid var(--sj-bd,#E1E6EE);border-radius:16px;overflow:hidden;margin:0 0 16px}.sjh-card>h2{display:flex;align-items:center;gap:8px;margin:0;padding:14px 18px;font-size:16px;font-weight:800;border-bottom:1px solid var(--sj-bd,#E1E6EE);color:var(--sj-tx,#1A2233)}.sjh-card>h2 small{font-size:13px;color:var(--sj-tx2,#4A5568);font-weight:600}
.sjh-r{display:flex;align-items:center;gap:12px;padding:12px 18px;border-bottom:1px solid var(--sj-bd,#E1E6EE)}.sjh-r:last-child{border-bottom:0}.sjh-r .sjh-bar{width:4px;align-self:stretch;border-radius:3px;flex:none}.sjh-r .sjh-bar.r{background:var(--sj-red,#D93636)}.sjh-r .sjh-bar.y{background:var(--sj-amb,#E0A100)}
.sjh-r .sjh-tx{flex:1;min-width:0}.sjh-r .sjh-tx b{font-size:14px;font-weight:700;word-break:keep-all}.sjh-r .sjh-tx small{display:block;color:var(--sj-tx2,#4A5568);font-size:13px;margin-top:2px;word-break:keep-all}
.sjh-r .sjh-tag{font-size:12px;font-weight:800;border-radius:6px;padding:1px 7px;margin-right:6px;background:var(--sj-blu-bg,#E8F0FB);color:var(--sj-tx,#1A2233)}.sjh-r .sjh-tag.r{background:var(--sj-org-bg,#FFF0E0);color:var(--sj-org-fg,#B85C00)}.sjh-r .sjh-tag.c{background:var(--sj-pur-bg,#F1ECFB);color:var(--sj-blu-fg,#1D5FAE)}
.sjh-r .sjh-due{font-size:13px;font-weight:800;white-space:nowrap}.sjh-r .sjh-due.r{color:var(--sj-red-fg,#C62828)}.sjh-r .sjh-due.y{color:var(--sj-org-fg,#B85C00)}.sjh-r .sjh-due.g{color:var(--sj-tx2,#4A5568)}
.sjh-empty{padding:26px 18px;text-align:center;color:var(--sj-tx2,#4A5568);font-size:14px}
.sjh .sjh-q .qi{display:flex;width:100%;text-align:left;background:var(--sj-sf,#FFFFFF);gap:12px;align-items:center;padding:12px 18px;border-bottom:1px solid var(--sj-bd,#E1E6EE);color:inherit;cursor:pointer}.sjh-q .qi:last-child{border-bottom:0}.sjh-q .qi:hover{background:var(--sj-sf2,#F7F9FC)}.sjh-q .sjh-ic{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex:none}.sjh-q b{display:block;font-size:14px;font-weight:700}.sjh-q small{display:block;color:var(--sj-tx2,#4A5568);font-size:13px}
.sjh-x{background:var(--sj-sf,#FFFFFF);border:1px solid var(--sj-bd,#E1E6EE);border-radius:16px;margin:0 0 16px}.sjh-x>summary{padding:14px 18px;font-weight:800;font-size:16px;cursor:pointer;list-style:none;display:flex;align-items:center;gap:8px}.sjh-x>summary::-webkit-details-marker{display:none}.sjh-x>summary::after{content:'▾';margin-left:auto;color:var(--sj-tx2,#4A5568)}.sjh-x[open]>summary::after{content:'▴'}.sjh-x>.sjh-in{padding:0 18px 18px}
.sjh-ft{color:var(--sj-tx3,#6B7588);font-size:12px;text-align:right;margin:4px 0 24px}
@media (max-width:899px){.sjh-hd>.sjh-btn{display:none}.sjh-card>h2{flex-wrap:wrap}.sjh-card>h2 .seg{flex-basis:100%;display:flex}.sjh-card>h2 .seg button{flex:1}.sjh .sjh-k>.kc{padding:10px 14px}.sjh-k b{font-size:24px}.sjh-c{grid-template-columns:1fr}.sjh-k{grid-template-columns:repeat(2,minmax(0,1fr))}.sjh-k>:first-child:nth-last-child(odd){grid-column:1/-1}.sjh-hero{flex-direction:column;align-items:stretch;padding:16px}.sjh-hero b{font-size:20px}.sjh-hd h1{font-size:22px}.sjh-r{padding:12px 14px;flex-wrap:wrap}.sjh-r .sjh-tx{flex-basis:calc(100% - 20px)}.sjh-r .sjh-due{margin-left:16px}.sjh-r .sjh-btn{margin-left:auto}}

.sjmob{display:none}
@media (max-width:899px){
 .sjmob{display:block;font-family:'Pretendard','Noto Sans KR','Malgun Gothic','Apple SD Gothic Neo',system-ui,sans-serif}.sjmob *{box-sizing:border-box}.sjmob a{text-decoration:none}.sjmob [hidden]{display:none!important}
 .sjm{position:fixed;top:0;left:0;right:0;height:54px;z-index:950;background:var(--sj-navy,#14244A);color:var(--sj-on,#FFFFFF);display:flex;align-items:center;gap:10px;padding:0 12px;box-shadow:0 2px 8px rgba(0,0,0,.18)}html.sj-hasupd .sjm{top:46px}
 .sjm-lg i{width:34px;height:34px;border-radius:10px;background:var(--sj-amb,#E0A100);color:var(--sj-tx,#1A2233);display:flex;align-items:center;justify-content:center;font:800 17px/1 inherit;font-style:normal}
 .sjm-v{display:flex;align-items:center;gap:8px;background:var(--sj-navy2,#22396B);border:1px solid var(--sj-blu,#1F64B8);color:var(--sj-on,#FFFFFF);border-radius:22px;padding:7px 12px 7px 11px;font:inherit;font-size:16px;min-width:0;max-width:62vw}.sjm-v b{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}button.sjm-v{cursor:pointer}
 .sjm-sp{flex:1}.sjm-up{background:var(--sj-amb,#E0A100);color:var(--sj-tx,#1A2233);border-radius:16px;padding:5px 10px;font-size:13px;font-weight:800;white-space:nowrap}
 .sjm-sy{display:flex;align-items:center;justify-content:center;width:34px;height:34px}.sjm .sjm-sy .sj-d{width:11px!important;height:11px!important;min-width:0!important;padding:0!important;border:0!important;border-radius:50%;background:var(--sj-blu,#1F64B8)}.sjm-sy .sj-d.ok{background:var(--sj-grn,#2FA36B)}.sjm-sy .sj-d.warn{background:var(--sj-amb,#E0A100)}.sjm-sy .sj-d.err{background:var(--sj-red,#D93636)}
 .sjb{position:fixed;left:0;right:0;bottom:0;z-index:950;background:var(--sj-sf,#FFFFFF);border-top:1px solid var(--sj-blu-bd,#B5CDEE);display:grid;grid-auto-flow:column;grid-auto-columns:1fr;padding:4px 0 calc(6px + env(safe-area-inset-bottom));box-shadow:0 -2px 10px rgba(0,0,0,.06)}
 .sjb a{position:relative;display:flex;flex-direction:column;align-items:center;gap:2px;padding:6px 0 2px;color:var(--sj-tx2,#4A5568);font-size:13px;font-weight:600}.sjb a.on{color:var(--sj-tx,#1A2233);font-weight:800}.sjb a.on::before{content:'';position:absolute;top:-5px;left:28%;right:28%;height:3px;border-radius:0 0 3px 3px;background:var(--sj-amb,#E0A100)}
 .sjb .sj-bd{position:absolute;top:0;left:calc(50% + 8px);background:var(--sj-red,#D93636);color:var(--sj-on,#FFFFFF);border-radius:9px;padding:0 6px;font-size:11px;font-weight:800;line-height:17px}.sjb .sj-bd.y{background:var(--sj-amb,#E0A100);color:var(--sj-tx,#1A2233)}
 .sjs{position:fixed;inset:0;z-index:960}.sjs-bg{position:absolute;inset:0;background:rgba(15,23,42,.45)}.sjs-p{position:absolute;left:0;right:0;bottom:0;max-height:82vh;overflow:auto;background:var(--sj-sf,#FFFFFF);border-radius:18px 18px 0 0;padding:8px 12px calc(16px + env(safe-area-inset-bottom));box-shadow:0 -6px 24px rgba(0,0,0,.2)}
 .sjs-h{display:flex;align-items:center;justify-content:space-between;padding:10px 6px 8px;font-size:18px;color:var(--sj-tx,#1A2233)}.sjs-h button{border:0;background:var(--sj-sf2,#F7F9FC);border-radius:50%;width:34px;height:34px;font-size:16px;cursor:pointer}
 .sjs-r{display:flex;align-items:center;gap:12px;padding:13px 12px;border-radius:12px;color:var(--sj-tx,#1A2233);font-size:16px;font-weight:700;border-bottom:1px solid var(--sj-bd,#E1E6EE)}.sjs-r.on{background:var(--sj-blu-bg,#E8F0FB);box-shadow:inset 4px 0 0 var(--sj-amb,#E0A100)}.sjs-r small{font-weight:500;color:var(--sj-tx2,#4A5568);font-size:13px}.sjs-r .sj-vn{flex:1;min-width:0}.sjs-r small.od{color:var(--sj-red-fg,#C62828);font-weight:700}.sjs-r .sj-bd{background:var(--sj-amb,#E0A100);color:var(--sj-tx,#1A2233);border-radius:10px;padding:1px 8px;font-size:12px}
 .sjs-r .sj-dt{width:11px;height:11px;border-radius:50%;background:var(--sj-bd2,#C9D1DD);flex:none}.sjs-r .sj-dt.r{background:var(--sj-red,#D93636)}.sjs-r .sj-dt.y{background:var(--sj-amb,#E0A100)}.sjs-r .sj-dt.g{background:var(--sj-grn,#2FA36B)}.sjs-r .sj-dt.b{width:auto;height:auto;background:none;color:var(--sj-blu-fg,#1D5FAE);display:flex}
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
    return `<nav class="sjr" aria-label="${T('도구 메뉴', 'Tools')}"><div class="sj-lgr"><a class="sj-lg" href="${base}index.html" title="${T('앱 홈', 'App home')}"><i class="sj-mk"><img src="${base}logo.svg" alt="" width="26" height="25"></i><span><b>${T('세줄선박관리', 'SEJUL Ship Mgmt')}</b><small>SEJUL FLEET APPS</small></span></a><button type="button" class="sj-min" data-sjmin aria-label="${T('메뉴 접기·펴기', 'Collapse menu')}" title="${T('메뉴 접기·펴기', 'Collapse / expand')}">${U.ic('M11 17l-5-5 5-5M18 17l-5-5 5-5', 16)}</button></div>
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
    const pcNav = U.phone() ? '' : `<nav class="sjb">${tab('home', base + 'index.html', off ? T('선대', 'Fleet') : T('홈', 'Home'), off ? 'bld' : 'home')}${tab('pms', base + 'tools/pms.html', T('정비', 'PMS'), 'pms', B.pms)}${tab('rsk', base + 'tools/rsk.html', T('위험성', 'Risk'), 'rsk', B.rsk)}${tab('inv', U.toolUrl(base, 'inv'), T('재고', 'Stores'), U.TOOLS()[2][2], B.inv)}<a href="#" class="${more ? 'on' : ''}" data-sjmore>${U.ic('M4 6h16M4 12h16M4 18h16', 22)}<span>${T('더보기', 'More')}</span>${B.cert || ''}</a></nav>
      <div class="sjs sjmore" hidden><div class="sjs-bg" data-sjmore></div><div class="sjs-p" role="dialog" aria-label="${T('더보기', 'More')}"><div class="sjs-h"><b>${T('더보기', 'More')}</b><button type="button" data-sjmore aria-label="${T('닫기', 'Close')}">✕</button></div>
        <a class="sjs-r" href="${U.toolUrl(base, 'cert')}"><span class="sj-dt b">${U.ic(U.TOOLS()[3][2], 15)}</span><span class="sj-vn">${T('증서·검사', 'Certificates & surveys')}</span>${B.cert || ''}</a>${off ? `<a class="sjs-r" href="${base}index.html#devices"><span class="sj-dt b">${U.ic('dev', 15)}</span><span class="sj-vn">${T('기기 승인', 'Devices')}</span><span class="sj-bd y" data-sjpend hidden></span></a>` : ''}<a class="sjs-r" href="${base}index.html#settings"><span class="sj-dt b">${U.ic('set', 15)}</span><span class="sj-vn">${T('설정', 'Settings')}</span></a></div></div>
`;
    return `<div class="sjmob"><header class="sjm"><a class="sjm-lg" href="${base}index.html" aria-label="${T('앱 홈', 'App home')}"><i class="sj-mk"><img src="${base}logo.svg" alt="" width="24" height="23"></i></a>
      ${off ? `<button class="sjm-v" data-sjsheet type="button">${U.ic('bld', 17)}<b>${U.esc(name)}</b>${U.ic('m6 9 6 6 6-6', 16)}</button>` : `<span class="sjm-v">${U.ic('ship', 17)}<b>${U.esc(name)}</b></span>`}
      <span class="sjm-sp"></span><button class="sjm-sr sjm-inb" data-sjinb type="button" aria-label="${T('알림함', 'Inbox')}">${U.ic('M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0', 21)}<b data-sjinbn hidden></b></button>${U.phone() ? `<a class="sjm-sr" href="${base}index.html#settings" aria-label="${T('설정', 'Settings')}">${U.ic('set', 21)}</a>` : `<button class="sjm-sr" data-sjsearch type="button" aria-label="${T('검색', 'Search')}">${U.ic('M21 21l-4.3-4.3M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14z', 21)}</button>`}<a class="sjm-up" href="#" data-sjupd hidden>⬆ ${T('업데이트', 'Update')}</a><a class="sjm-sy" href="${base}index.html#settings/sync" aria-label="${T('동기화', 'Sync')}"><span class="sj-d"></span></a></header>
      ${U.phone() ? U.mobPhone(act, base, o) : ''}${pcNav}      ${off ? `<div class="sjs sjves" hidden><div class="sjs-bg" data-sjsheet></div><div class="sjs-p" role="dialog" aria-label="${T('선박 고르기', 'Choose vessel')}"><div class="sjs-h"><b>${T('선박 고르기', 'Choose vessel')}</b><button type="button" data-sjsheet aria-label="${T('닫기', 'Close')}">✕</button></div>${U.fleetRows(act, base, view, sp, sr, 'sjs-r')}</div></div>` : ''}</div>`; };
  /* 휴대폰 아래 탭: 할 일(선대) · 승인 · 검색 · 기록(선박만) · 더보기 — 작성·편집은 PC·태블릿에서 */
  U.mobPhone = function (act, base, o) { const T = U.T, { off } = o;
    const t = (on, attrs, label, ic, bd) => `<a class="${on ? 'on' : ''}" ${attrs}>${U.ic(ic, 22)}<span>${label}</span>${bd || ''}</a>`;
    return `<nav class="sjb sjb-ph">${t(act === 'home', `href="${base}index.html"`, off ? T('선대', 'Fleet') : T('할 일', 'Today'), off ? 'bld' : 'home')}${t(false, 'href="#" data-sjinb="apv"', T('승인', 'Approve'), 'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11', '<b class="sjb-n" data-sjapvn hidden></b>')}${t(['pms', 'inv', 'cert'].includes(act), `href="${base}tools/pms.html"`, T('정비', 'PMS'), 'pms')}${t(act === 'rsk', `href="${base}tools/rsk.html"`, T('위험성', 'Risk'), 'rsk')}</nav>`; };
  document.addEventListener('click', e => { const a = e.target.closest && e.target.closest('[data-sjrec]'); if (!a) return; e.preventDefault(); const sh = document.querySelector('.sjrec'); if (sh) sh.hidden = !sh.hidden; });
  document.addEventListener('click', e => { const a = e.target.closest && e.target.closest('[data-sjfull]'); if (!a) return; e.preventDefault(); C.set('fullUI', a.dataset.sjfull === '1' ? '1' : ''); location.reload(); });
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
  U.updPaint = function (msg) { const H = !!(C.updHas || C.updAvail); document.querySelectorAll('.sjm-up').forEach(x => x.hidden = !H); const a = document.querySelector('.sjr [data-sjupd]'); if (!a) return; const has = H; a.classList.toggle('has', has); const sm = a.querySelector('small'); if (sm) sm.textContent = has ? U.T('⬆ 새 버전 — 눌러서 업데이트', '⬆ New version — tap to update') : (msg || U.T('업데이트 확인', 'Check for updates')); };
  document.addEventListener('click', async e => { const a = e.target.closest && e.target.closest('[data-sjupd]'); if (!a) return; e.preventDefault();
    if ((C.updHas || C.updAvail) && C.updNow && await C.updNow()) return; U.updPaint(U.T('확인 중…', 'Checking…')); const r = C.updCheck ? await C.updCheck() : 'none'; if (r === 'has' && C.updNow) return C.updNow();
    U.updPaint(r === 'latest' ? U.T('최신 버전입니다 ✓', 'Up to date ✓') : r === 'offline' ? U.T('오프라인 — 나중에 다시', 'Offline — try later') : r === 'has' ? '' : U.T('업데이트 확인', 'Check for updates')); });
  /* 선박 고르기 시트 열고 닫기 (좁은 화면) */
  document.addEventListener('click', e => { const a = e.target.closest && e.target.closest('[data-sjsheet]'); if (!a) return; e.preventDefault(); const sh = document.querySelector('.sjs.sjves'); if (sh) sh.hidden = !sh.hidden; });
  /* 선대 목록에서 선박 고르기 (사무실) */
  /* 휴대폰(사무실): 선박을 고르면 도구 화면이 아니라 휴대폰 전용 선박 요약으로 */
  U.phoneShip = n => { if (U.onPhoneShip) return U.onPhoneShip(n); location.href = (/\/tools\//.test(location.pathname) ? '' : 'tools/') + 'pms.html?ppv=' + encodeURIComponent(n); };
  document.addEventListener('click', e => { const a = e.target.closest && e.target.closest('[data-sjves]'); if (!a || !U.phone() || !a.dataset.sjves) return; e.preventDefault(); e.stopImmediatePropagation(); document.querySelectorAll('.sjs').forEach(sh => sh.hidden = true); C.set('view', a.dataset.sjves); U.phoneShip(a.dataset.sjves); }, true);
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
    function paint() { let p = 0; try { p = pend().filter(x => x.st !== 'mine').length; } catch (e) { } const n = unread() + p; document.querySelectorAll('[data-sjinbn]').forEach(b => { b.hidden = !n; b.textContent = n > 99 ? '99+' : n; b.title = U.T(`승인·처리 ${p} · 새 알림 ${n - p}`, `${p} to decide · ${n - p} new`); }); document.querySelectorAll('[data-sjapvn]').forEach(b => { b.hidden = !p; b.textContent = p > 99 ? '99+' : p; }); if (box && !box.hidden) list(); }
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

  /* ================= 작은 그래프 (라이브러리 없이 — 가볍고 인터넷 없이 됨) =================
     U.chart.cols(값[], 이름[], {hi, tone, unit}) — 세로 막대 · U.chart.hbars(줄[], 구분[]) — 선박별 누적 가로 막대 */
  U.chart = {
    /* o.ranges: [8, 12, 26] → 기간 바꾸기 단추 (vals 는 가장 긴 기간 길이), o.back: 지난 주들 (끝이 이번 주) */
    cols(vals, labels, o) { o = o || {};
      if (o.ranges) { const id = 'sjc' + (++U.chart._n), M = Math.max(...o.ranges), pad = Array(Math.max(0, M - vals.length)).fill(0); vals = o.back ? pad.concat(vals) : vals.concat(pad); if (o.key) { try { const r = +localStorage.getItem('sejul_cr_' + o.key); if (o.ranges.includes(r)) o.r = r; } catch (x) { } } U.chart._d[id] = { vals, o }; return `<div class="sjc-w" data-sjcw="${id}">${U.chart._seg(id, o.r || o.ranges[0])}</div>`; }
      if (!vals.some(v => v > 0)) return `<div class="sjc-none">${U.esc(o.empty || '아직 기록이 없습니다 · No records yet')}</div>`;
      const mx = Math.max(1, ...vals), sum = vals.reduce((x, y) => x + y, 0), thin = vals.length > 13 ? 4 : vals.length > 8 ? 2 : 1;
      return `<div class="sjc-cols" role="img" aria-label="${U.esc((o.aria || '') + ' — ' + U.T('합계', 'total') + ' ' + sum)}">${vals.map((v, i) => `<div class="sjc-c ${o.hi === i ? 'hi' : ''} ${o.tone ? 't-' + o.tone : ''}" tabindex="0" data-tip="${U.esc(labels[i] + ' · ' + v + (o.unit || U.T('건', '')))}"><span class="sjc-v">${v || ''}</span><i style="height:${Math.round(v / mx * 100)}%"></i><small>${i % thin && i !== o.hi ? '&nbsp;' : U.esc(labels[i])}</small></div>`).join('')}</div>`; },
    _n: 0, _d: {},
    _seg(id, r) { const D = U.chart._d[id], o = D.o, v = o.back ? D.vals.slice(-r) : D.vals.slice(0, r), lab = U.chart.weeks(r, o.back), sum = v.reduce((x, y) => x + y, 0);
      return `<div class="sjc-bar"><span class="sjc-sum">${U.T('합계', 'Total')} <b>${sum}</b>${U.T('건', '')}</span><span class="sjc-rg" role="group" aria-label="${U.T('기간', 'Range')}">${o.ranges.map(n => `<button type="button" data-sjcr="${id}:${n}" class="${n === r ? 'on' : ''}" aria-pressed="${n === r}">${n}${U.T('주', 'w')}</button>`).join('')}</span></div>`
        + U.chart.cols(v, lab, Object.assign({}, o, { ranges: null, hi: o.back ? r - 1 : 0 })); },
    hbars(rows, defs, o) { o = o || {}; const mx = Math.max(1, ...rows.map(r => r.segs.reduce((a, b) => a + b, 0)));
      return `<div class="sjc-leg">${defs.map(([n, c]) => `<span><i style="background:${c}"></i>${U.esc(n)}</span>`).join('')}</div><div class="sjc-h">${rows.map(r => { const t = r.segs.reduce((a, b) => a + b, 0);
        return `<${r.d ? 'button type="button"' : 'div'} class="sjc-hr" ${r.d ? Object.entries(r.d).map(([k, v]) => `data-${k}="${U.esc(v)}"`).join(' ') : ''} title="${U.esc(r.label + ' · ' + defs.map((d, i) => d[0] + ' ' + r.segs[i]).join(' · '))}"><span class="sjc-hl">${U.esc(r.label)}</span><span class="sjc-hb">${t ? r.segs.map((n, i) => n ? `<i style="width:${n / mx * 100}%;background:${defs[i][1]}"></i>` : '').join('') : `<em>${U.T('없음', 'none')}</em>`}</span><span class="sjc-ht">${t || ''}</span></${r.d ? 'button' : 'div'}>`; }).join('')}</div>`; },
    weeks(n, back) { const out = [], d0 = new Date(); for (let i = 0; i < n; i++) { const d = new Date(d0.getTime() + (back ? -(n - 1 - i) : i) * 7 * 864e5); out.push(back && i === n - 1 ? U.T('이번 주', 'This wk') : !back && i === 0 ? U.T('이번 주', 'This wk') : (d.getMonth() + 1) + '/' + d.getDate()); } return out; } };
  /* 저장 반응: 고친 내용이 저장되면 오른쪽 아래(휴대폰은 아래 가운데)에 '저장됨' 잠깐 표시 */
  U.saved = (() => { let el = null, tm = 0, t0 = 0, act = 0; ['pointerdown', 'keydown'].forEach(k => addEventListener(k, () => { act = Date.now(); }, true)); return msg => { if (Date.now() - t0 < 600 || Date.now() - act > 8000) return; t0 = Date.now(); try { if (!el) { el = document.createElement('div'); el.className = 'sj-saved'; el.setAttribute('role', 'status'); el.setAttribute('aria-live', 'polite'); document.body.appendChild(el); }
    el.innerHTML = `<b>${U.ic('M20 6 9 17l-5-5', 12)}</b>${U.esc(msg || U.T('저장됨', 'Saved'))}`; el.style.color = ''; requestAnimationFrame(() => el.classList.add('on')); clearTimeout(tm); tm = setTimeout(() => el.classList.remove('on'), 1600); } catch (e) { } }; })();
  U.toast = (msg, ms) => { try { let el = document.querySelector('.sj-toast1'); if (!el) { el = document.createElement('div'); el.className = 'sj-saved sj-toast1'; el.setAttribute('role', 'status'); document.body.appendChild(el); } el.textContent = msg; requestAnimationFrame(() => el.classList.add('on')); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('on'), ms || 4500); } catch (e) { } };
  document.addEventListener('click', e => { const b = e.target.closest && e.target.closest('[data-sjcr]'); if (!b) return; const [id, n] = b.dataset.sjcr.split(':'), w = b.closest('[data-sjcw]'); if (w && U.chart._d[id]) { w.innerHTML = U.chart._seg(id, +n); try { localStorage.setItem('sejul_cr_' + (U.chart._d[id].o.key || ''), n); } catch (x) { } } });
  U.CC = { od: 'var(--sj-red,#D93636)', d7: 'var(--sj-amb,#E0A100)', def: 'var(--sj-pur,#7C4DDB)', apv: 'var(--sj-blu,#1F64B8)', ok: 'var(--sj-grn,#2FA36B)', g: 'var(--sj-gry,#8A94A6)', brand: 'var(--sj-blu,#1F64B8)' };
})();
