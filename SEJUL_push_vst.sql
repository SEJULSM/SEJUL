-- =====================================================================
-- SEJUL 알림: 감독 방선 보고서 · 공무 특별점검 (사무실 기기 푸시)
-- Supabase 대시보드 → SQL Editor → New query → 전체 붙여넣기 → Run
-- 여러 번 실행해도 안전 (있으면 건너뛰거나 덮어씀) · 기존 알림(정비·PTW·DPA·기기)은 그대로
-- =====================================================================

-- 1) 기기 소속 팀 (SQOT·TST·MAT·ALL) — 공무 특별점검은 공무팀(TST)·전체만 받음
alter table public.sj_devices add column if not exists team text;

-- 2) 방선 알림 대기열 (보고서를 고친 기기가 올림 → 10분마다 sj-push가 보내고 지움)
create table if not exists public.sj_note (
  id bigserial primary key,
  k text unique,                 -- 같은 알림 두 번 방지
  kind text not null,            -- 'vst' 방선 보고서 / 'vsx' 공무 특별점검
  ship text not null default '',
  device uuid,                   -- 고친 기기 (그 기기에는 안 보냄)
  title text, body text, url text,
  at timestamptz not null default now()
);
alter table public.sj_note enable row level security;   -- 정책 없음 = 앱에서 직접 읽기·쓰기 불가 (아래 함수로만)

-- 3) 앱 → 팀 알려 주기
create or replace function public.sj_team(p_key text, p_team text)
returns json language plpgsql security definer set search_path to 'public', 'extensions' as $$
declare d public.sj_devices := public.sj__dev(p_key);
begin
  if d.id is null then raise exception 'not registered'; end if;
  update public.sj_devices set team = case when p_team in ('SQOT', 'TST', 'MAT', 'ALL') then p_team else null end where id = d.id;
  return json_build_object('ok', true);
end $$;

-- 4) 앱 → 방선 알림 올리기 (최대 30건씩)
create or replace function public.sj_note_put(p_key text, p_kind text, p_ship text, p_items jsonb)
returns json language plpgsql security definer set search_path to 'public', 'extensions' as $$
declare d public.sj_devices := public.sj__dev(p_key); n int;
begin
  if d.id is null or d.status <> 'approved' then raise exception 'not approved'; end if;
  if p_kind not in ('vst', 'vsx') then raise exception 'bad kind'; end if;
  if d.role = 'ship' and coalesce(p_ship, '') <> d.ship then raise exception 'wrong ship'; end if;
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) > 30 then raise exception 'bad items'; end if;
  insert into public.sj_note(k, kind, ship, device, title, body, url)
  select left(x->>'k', 200), p_kind, coalesce(p_ship, ''), d.id, left(coalesce(x->>'t', ''), 200), left(coalesce(x->>'b', ''), 300),
         case when coalesce(x->>'u', '') ~ '^(tools/vst\.html|index\.html)' then left(x->>'u', 300) else 'tools/vst.html' end
  from jsonb_array_elements(p_items) x where coalesce(x->>'k', '') <> ''
  on conflict (k) do nothing;
  get diagnostics n = row_count;
  return json_build_object('ok', true, 'n', n);
end $$;

-- 5) 서버 전용: 대기열 → 받을 기기 목록 (선박·종류별로 묶음 · 고친 기기 제외 · 특별점검은 TST·ALL만)
create or replace function public.sj__alerts_vst()
returns table(sub_id bigint, endpoint text, p256dh text, auth text, title text, body text, url text, tag text)
language plpgsql security definer set search_path to 'public', 'extensions' as $$
begin
  return query
  with n as (delete from public.sj_note returning *),
  r as (select s.sub_id, s.endpoint, s.p256dh, s.auth, n.kind, n.ship, n.title as t, n.body as b, n.url as u, n.at
        from n join public.sj_v_subs s on s.role = 'office' and s.dev is distinct from n.device
        join public.sj_devices dv on dv.id = s.dev and dv.status = 'approved'
        where n.at > now() - interval '1 day'
          and (n.kind <> 'vsx' or coalesce(dv.team, '') in ('', 'TST', 'ALL'))),
  g as (select r.sub_id, r.endpoint, r.p256dh, r.auth, r.kind, r.ship, count(*)::int as cnt,
               array_agg(r.t order by r.at) as ts, array_agg(r.b order by r.at) as bs, array_agg(r.u order by r.at) as us
        from r group by r.sub_id, r.endpoint, r.p256dh, r.auth, r.kind, r.ship)
  select g.sub_id, g.endpoint, g.p256dh, g.auth,
         case when g.cnt = 1 then g.ts[1]
              else case when g.kind = 'vsx' then '🔧 ' || g.ship || ' — 공무 특별점검 ' else g.ship || ' — 방선 보고서 ' end || g.cnt || '건 / ' || g.cnt || ' updates' end,
         case when g.cnt = 1 then g.bs[1] else left(array_to_string(g.ts, E'\n'), 300) end,
         g.us[g.cnt],
         g.kind || '-' || g.ship
  from g;
end $$;

-- 6) 기존 알림 모음에 방선 알림 더하기 (나머지는 그대로 · 방선 알림에 문제가 있어도 기존 알림은 나감)
create or replace function public.sj__alerts()
 returns table(sub_id bigint, endpoint text, p256dh text, auth text, title text, body text, url text, tag text)
 language plpgsql security definer set search_path to 'public', 'extensions'
as $function$
begin
  create temp table if not exists _sj_a (sub_id bigint, endpoint text, p256dh text, auth text, title text, body text, url text, tag text) on commit drop;
  truncate _sj_a;
  insert into _sj_a select * from public.sj__alerts_raw();
  begin
    insert into _sj_a select * from public.sj__alerts_vst();
  exception when others then raise warning 'sj__alerts_vst: %', sqlerrm;
  end;
  return query
  with a as (select x.*, case when x.tag = 'daily' then 'daily' when x.tag like 'ptw-%' then 'ptw' when x.tag like 'dpa-%' or x.tag like 'pp-%' then 'dpa' when x.tag like 'off-%' then 'off' when x.tag like 'dev-%' then 'dev' when x.tag like 'vst-%' or x.tag like 'vsx-%' then 'vst' else 'other' end as typ from _sj_a x),
  s as (select a.*, p.quiet_on, p.q_from, p.q_to, p.q_ptw, p.types, p.tz_min from a join public.sj_push p on p.id = a.sub_id),
  ok as (select s.* from s where coalesce((s.types->>s.typ)::boolean, true)),
  q as (select ok.*, (public.sj__quiet(ok.quiet_on, ok.q_from, ok.q_to, ok.tz_min) and not (ok.typ = 'ptw' and ok.q_ptw)) as hold from ok),
  held as (insert into public.sj_queue(sub_id, title, body, url, tag) select q.sub_id, q.title, q.body, q.url, q.tag from q where q.hold returning 1)
  select q.sub_id, q.endpoint, q.p256dh, q.auth, q.title, q.body, q.url, q.tag from q where not q.hold;
  -- 방해 금지가 끝난 기기: 모아 둔 알림 보내기 (여러 건이면 한 개로 묶음)
  return query
  with rel as (delete from public.sj_queue qq using public.sj_push p where p.id = qq.sub_id and not public.sj__quiet(p.quiet_on, p.q_from, p.q_to, p.tz_min) returning qq.*),
  g as (select rel.sub_id, count(*) as n, array_agg(rel.title order by rel.at) as ts, array_agg(rel.body order by rel.at) as bs, array_agg(rel.url order by rel.at) as us, array_agg(rel.tag order by rel.at) as gs from rel group by rel.sub_id)
  select p.id, p.endpoint, p.p256dh, p.auth,
         case when g.n = 1 then g.ts[1] else '방해 금지 동안 알림 ' || g.n || '건 / ' || g.n || ' while quiet' end,
         case when g.n = 1 then g.bs[1] else left(array_to_string(g.ts, E'\n'), 300) end,
         case when g.n = 1 then g.us[1] else 'index.html' end,
         case when g.n = 1 then g.gs[1] else 'held' end
  from g join public.sj_push p on p.id = g.sub_id;
  delete from public.sj_queue where at < now() - interval '3 days';
end $function$;

-- 7) 권한: 앱용 함수만 열고, 서버 전용 함수는 닫음
grant execute on function public.sj_team(text, text) to anon, authenticated;
grant execute on function public.sj_note_put(text, text, text, jsonb) to anon, authenticated;
revoke execute on function public.sj__alerts_vst() from public, anon, authenticated;

-- 8) 확인 (결과가 나오면 성공)
select 'ok' as result, (select count(*) from public.sj_note) as queued;
