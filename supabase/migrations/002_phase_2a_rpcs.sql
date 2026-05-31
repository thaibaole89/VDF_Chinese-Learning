-- Phase 2A.2a — server-side voice scoring + lockdown (IDEMPOTENT).
-- AUTO-GENERATED from content/*.json by scripts/gen-phase2a-rpcs.mjs.
-- Edit that script (or content/*.json then re-run) — do NOT hand-edit this file.
--
-- Apply in Supabase SQL Editor (paste & run). Re-runnable: no data loss.
-- Depends on: 001_phase_2a_core.sql must be applied first.
--
-- What this does:
--   1. Add reference table 'phrases' (id PK, zh, lesson_id) seeded from content.
--   2. Add 'phrase_progress' table (per-user phrase-learned; needed for cert eligibility).
--   3. Add aggregate columns on 'profiles': best_quiz_score, voice_pass_count, phrase_learned_count.
--   4. Add 5 SQL helper functions porting lib/voiceScoring.ts to PL/pgSQL.
--   5. Add 4 SECURITY DEFINER RPCs:
--      - submit_voice_attempt(p_phrase_id, p_lesson_id, p_transcript, p_manual)
--      - submit_quiz_attempt(p_quiz_id, p_lesson_id, p_correct_count, p_total_count)
--      - mark_phrase_learned(p_phrase_id, p_learned)
--      - mark_lesson_complete(p_lesson_id, p_completed)
--   6. REVOKE direct INSERT on voice_attempts from authenticated (forge-proof).
--      Drop the va_self_insert policy too (defense in depth).
--
-- Scoring thresholds (mirrors lib/voiceScoring.ts):
--   score >= 70 → 'pass'   ·   45..69 → 'near'   ·   <45 → 'retry'
-- Manual mark-as-practiced bypasses scoring (result = 'manual').
--
-- Phrases seeded: 91 from 11 content files.

-- ============================================================
-- 0. Aggregate columns on profiles (idempotent ADD COLUMN IF NOT EXISTS)
-- ============================================================
alter table public.profiles
  add column if not exists best_quiz_score      numeric  default 0,
  add column if not exists voice_pass_count     integer  default 0,
  add column if not exists phrase_learned_count integer  default 0;

-- ============================================================
-- 1. Reference table: phrases (read-only for staff)
-- ============================================================
create table if not exists public.phrases (
  id          text primary key,
  zh          text not null,
  lesson_id   text,
  updated_at  timestamptz not null default now()
);
alter table public.phrases enable row level security;
alter table public.phrases force  row level security;

revoke all    on public.phrases from anon, authenticated;
grant  select on public.phrases to   authenticated;

drop policy if exists phrases_read on public.phrases;
create policy phrases_read on public.phrases
  for select to authenticated using (true);

-- Seed (UPSERT) — generated from content/*.json
insert into public.phrases (id, zh, lesson_id) values
  ('sp_ask_brand', '您喜欢什么品牌？', 'lesson_cs_ask_needs'),
  ('sp_ask_what_product', '请问您想看什么产品？', 'lesson_cs_ask_needs'),
  ('sp_bestseller_basic', '这款很好卖。', 'lesson_cs_bestseller'),
  ('sp_bestseller_strong', '这款是我们的畅销产品。', 'lesson_cs_bestseller'),
  ('sp_browse_slowly', '您可以慢慢看。', 'lesson_cs_browsing'),
  ('sp_closing_1', '谢谢您。', 'lesson_p1_closing'),
  ('sp_closing_2', '请拿好您的商品和小票。', 'lesson_p1_closing'),
  ('sp_closing_3', '请拿好您的护照和登机牌。', 'lesson_p1_closing'),
  ('sp_closing_4', '祝您旅途愉快。', 'lesson_p1_closing'),
  ('sp_closing_5', '欢迎下次光临。', 'lesson_p1_closing'),
  ('sp_closing_6', '请慢走。', 'lesson_p1_closing'),
  ('sp_closing_7', '再见。', 'lesson_p1_closing'),
  ('sp_closing_8', '这是您的商品，请收好。', 'lesson_p1_closing'),
  ('sp_day1_1', '您好，欢迎光临！', 'lesson_day_one_10_phrases'),
  ('sp_day1_10', '谢谢您，祝您旅途愉快。', 'lesson_day_one_10_phrases'),
  ('sp_day1_2', '请问您想看什么产品？', 'lesson_day_one_10_phrases'),
  ('sp_day1_3', '您喜欢什么品牌？', 'lesson_day_one_10_phrases'),
  ('sp_day1_4', '我可以给您推荐几款。', 'lesson_day_one_10_phrases'),
  ('sp_day1_5', '这个是免税价格。', 'lesson_day_one_10_phrases'),
  ('sp_day1_6', '请出示您的护照和登机牌。', 'lesson_day_one_10_phrases'),
  ('sp_day1_7', '您要刷卡还是扫码支付？', 'lesson_day_one_10_phrases'),
  ('sp_day1_8', '付款成功了，这是您的小票。', 'lesson_day_one_10_phrases'),
  ('sp_day1_9', '不好意思，这款现在没有货。', 'lesson_day_one_10_phrases'),
  ('sp_dutyfree_1', '这是免税店。', 'lesson_p1_dutyfree'),
  ('sp_dutyfree_2', '这个是免税价格。', 'lesson_p1_dutyfree'),
  ('sp_dutyfree_3', '免税商品需要按规定购买。', 'lesson_p1_dutyfree'),
  ('sp_dutyfree_4', '具体规定我帮您确认一下。', 'lesson_p1_dutyfree'),
  ('sp_dutyfree_5', '免税商品比较便宜。', 'lesson_p1_dutyfree'),
  ('sp_dutyfree_6', '一般需要国际航班的登机牌。', 'lesson_p1_dutyfree'),
  ('sp_dutyfree_7', '这是机场免税店的价格。', 'lesson_p1_dutyfree'),
  ('sp_dutyfree_8', '关于海关规定，我帮您问一下。', 'lesson_p1_dutyfree'),
  ('sp_greeting_offer_help', '您好，需要帮忙吗？', 'lesson_cs_greeting'),
  ('sp_greeting_welcome', '您好，欢迎光临！', 'lesson_cs_greeting'),
  ('sp_liquor_imported', '我们这里有很多进口酒。', 'lesson_liquor'),
  ('sp_liquor_self_gift', '您是自己用还是送人？', 'lesson_liquor'),
  ('sp_liquor_what', '您想买什么酒？', 'lesson_liquor'),
  ('sp_liquor_whisky_cognac', '您喜欢威士忌还是干邑？', 'lesson_liquor'),
  ('sp_oos_1', '不好意思，这款现在没有货。', 'lesson_p1_oos'),
  ('sp_oos_2', '这款已经卖完了。', 'lesson_p1_oos'),
  ('sp_oos_3', '我可以给您推荐另外一款。', 'lesson_p1_oos'),
  ('sp_oos_4', '这款味道比较相似。', 'lesson_p1_oos'),
  ('sp_oos_5', '您可以看看这一款。', 'lesson_p1_oos'),
  ('sp_oos_6', '这是同一个品牌的。', 'lesson_p1_oos'),
  ('sp_oos_7', '这一款也很适合您。', 'lesson_p1_oos'),
  ('sp_oos_8', '这个牌子还有别的款。', 'lesson_p1_oos'),
  ('sp_oos_9', '要不要我帮您看看库存？', 'lesson_p1_oos'),
  ('sp_out_of_stock', '不好意思，这个现在没有货。', 'lesson_cs_out_of_stock'),
  ('sp_passport_1', '请出示您的护照和登机牌。', 'lesson_p1_passport'),
  ('sp_passport_2', '我需要核对一下您的信息。', 'lesson_p1_passport'),
  ('sp_passport_3', '请稍等，我帮您检查一下。', 'lesson_p1_passport'),
  ('sp_passport_4', '谢谢您的配合。', 'lesson_p1_passport'),
  ('sp_passport_5', '请问您的航班号是多少？', 'lesson_p1_passport'),
  ('sp_passport_6', '请问您飞往哪里？', 'lesson_p1_passport'),
  ('sp_passport_7', '买免税商品需要出示登机牌。', 'lesson_p1_passport'),
  ('sp_passport_8', '这是您的护照，请收好。', 'lesson_p1_passport'),
  ('sp_payment_1', '您要怎么付款？', 'lesson_p1_payment'),
  ('sp_payment_2', '您可以用支付宝、微信支付或者银联卡。', 'lesson_p1_payment'),
  ('sp_payment_3', '请扫这个二维码。', 'lesson_p1_payment'),
  ('sp_payment_4', '您要刷卡还是扫码支付？', 'lesson_p1_payment'),
  ('sp_payment_5', '付款成功了。', 'lesson_p1_payment'),
  ('sp_payment_6', '这是您的小票。', 'lesson_p1_payment'),
  ('sp_payment_7', '现金是否可以使用，我帮您确认一下。', 'lesson_p1_payment'),
  ('sp_payment_8', '请稍等，正在处理付款。', 'lesson_p1_payment'),
  ('sp_payment_9', '您的信用卡可以用。', 'lesson_p1_payment'),
  ('sp_payment_checkout', '我来帮您结账。', 'lesson_cs_payment'),
  ('sp_perfume_bestseller', '这款香水是畅销产品。', 'lesson_perfume'),
  ('sp_perfume_intensity', '这款香水味道很浓/很淡。', 'lesson_perfume'),
  ('sp_perfume_men_women', '您在寻找男士香水还是女士香水？', 'lesson_perfume'),
  ('sp_perfume_new', '这是新款香水。', 'lesson_perfume'),
  ('sp_perfume_scent', '您喜欢什么香味？', 'lesson_perfume'),
  ('sp_perfume_smell', '您想闻一下吗？', 'lesson_perfume'),
  ('sp_price_1', '这个是免税价格。', 'lesson_p1_price'),
  ('sp_price_2', '现在有优惠活动。', 'lesson_p1_price'),
  ('sp_price_3', '这款有折扣。', 'lesson_p1_price'),
  ('sp_price_4', '不好意思，这个价格已经是优惠价了。', 'lesson_p1_price'),
  ('sp_price_5', '我帮您确认一下价格。', 'lesson_p1_price'),
  ('sp_price_6', '这个比原价便宜。', 'lesson_p1_price'),
  ('sp_price_7', '这是现在的价格。', 'lesson_p1_price'),
  ('sp_price_8', '现在买一送一。', 'lesson_p1_price'),
  ('sp_price_9', '满一千有优惠。', 'lesson_p1_price'),
  ('sp_recommend', '我可以给您推荐几款。', 'lesson_cs_recommend'),
  ('sp_skincare_brand', '您在寻找哪个品牌？', 'lesson_skincare'),
  ('sp_skincare_gift', '您是买来送人还是自己用？', 'lesson_skincare'),
  ('sp_skincare_looking', '您在寻找护肤产品吗？', 'lesson_skincare'),
  ('sp_skincare_skintype', '您的皮肤是什么类型的？', 'lesson_skincare'),
  ('sp_skincare_type', '您在寻找哪种护肤产品？', 'lesson_skincare'),
  ('sp_sweets_gift', '这个很适合送礼。', 'lesson_confectionery'),
  ('sp_sweets_not_sweet', '这个不太甜。', 'lesson_confectionery'),
  ('sp_tobacco_light', '这个口味比较淡。', 'lesson_tobacco'),
  ('sp_tobacco_soft_hard', '您要软盒还是硬盒？', 'lesson_tobacco'),
  ('sp_verify_goods', '请您检查一下商品。', 'lesson_cs_verify_goods')
on conflict (id) do update set
  zh = excluded.zh,
  lesson_id = excluded.lesson_id,
  updated_at = now();

-- Clean up any phrases no longer present in content (so cert eligibility
-- doesn't count orphaned old phrases). Safe: deletes reference rows only.
delete from public.phrases
 where id not in ('sp_ask_brand', 'sp_ask_what_product', 'sp_bestseller_basic', 'sp_bestseller_strong', 'sp_browse_slowly', 'sp_closing_1', 'sp_closing_2', 'sp_closing_3', 'sp_closing_4', 'sp_closing_5', 'sp_closing_6', 'sp_closing_7', 'sp_closing_8', 'sp_day1_1', 'sp_day1_10', 'sp_day1_2', 'sp_day1_3', 'sp_day1_4', 'sp_day1_5', 'sp_day1_6', 'sp_day1_7', 'sp_day1_8', 'sp_day1_9', 'sp_dutyfree_1', 'sp_dutyfree_2', 'sp_dutyfree_3', 'sp_dutyfree_4', 'sp_dutyfree_5', 'sp_dutyfree_6', 'sp_dutyfree_7', 'sp_dutyfree_8', 'sp_greeting_offer_help', 'sp_greeting_welcome', 'sp_liquor_imported', 'sp_liquor_self_gift', 'sp_liquor_what', 'sp_liquor_whisky_cognac', 'sp_oos_1', 'sp_oos_2', 'sp_oos_3', 'sp_oos_4', 'sp_oos_5', 'sp_oos_6', 'sp_oos_7', 'sp_oos_8', 'sp_oos_9', 'sp_out_of_stock', 'sp_passport_1', 'sp_passport_2', 'sp_passport_3', 'sp_passport_4', 'sp_passport_5', 'sp_passport_6', 'sp_passport_7', 'sp_passport_8', 'sp_payment_1', 'sp_payment_2', 'sp_payment_3', 'sp_payment_4', 'sp_payment_5', 'sp_payment_6', 'sp_payment_7', 'sp_payment_8', 'sp_payment_9', 'sp_payment_checkout', 'sp_perfume_bestseller', 'sp_perfume_intensity', 'sp_perfume_men_women', 'sp_perfume_new', 'sp_perfume_scent', 'sp_perfume_smell', 'sp_price_1', 'sp_price_2', 'sp_price_3', 'sp_price_4', 'sp_price_5', 'sp_price_6', 'sp_price_7', 'sp_price_8', 'sp_price_9', 'sp_recommend', 'sp_skincare_brand', 'sp_skincare_gift', 'sp_skincare_looking', 'sp_skincare_skintype', 'sp_skincare_type', 'sp_sweets_gift', 'sp_sweets_not_sweet', 'sp_tobacco_light', 'sp_tobacco_soft_hard', 'sp_verify_goods');

-- ============================================================
-- 2. phrase_progress (per-user phrase learned)
-- ============================================================
create table if not exists public.phrase_progress (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  phrase_id   text not null,
  lesson_id   text,
  learned     boolean not null default false,
  learned_at  timestamptz,
  updated_at  timestamptz not null default now(),
  unique (user_id, phrase_id)
);
create index if not exists phrase_progress_user_id_idx on public.phrase_progress(user_id);
create index if not exists phrase_progress_lesson_idx  on public.phrase_progress(user_id, lesson_id);

alter table public.phrase_progress enable row level security;
alter table public.phrase_progress force  row level security;

revoke all on public.phrase_progress from anon, authenticated;
grant  select, insert, update on public.phrase_progress to authenticated;

drop policy if exists pp_self_select    on public.phrase_progress;
drop policy if exists pp_self_insert    on public.phrase_progress;
drop policy if exists pp_self_update    on public.phrase_progress;
drop policy if exists pp_manager_select on public.phrase_progress;

create policy pp_self_select on public.phrase_progress
  for select to authenticated using (user_id = auth.uid());
create policy pp_self_insert on public.phrase_progress
  for insert to authenticated with check (user_id = auth.uid());
create policy pp_self_update on public.phrase_progress
  for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy pp_manager_select on public.phrase_progress
  for select to authenticated using (public.user_role() = 'manager');

drop trigger if exists phrase_progress_touch_updated_at on public.phrase_progress;
create trigger phrase_progress_touch_updated_at
  before update on public.phrase_progress
  for each row execute function public.touch_updated_at();

-- ============================================================
-- 3. Voice scoring helpers (PL/pgSQL port of lib/voiceScoring.ts)
-- ============================================================

-- VDF-context important terms — keep in sync with lib/voiceScoring.ts IMPORTANT_TERMS.
create or replace function public.voice_important_terms()
returns text[]
language sql
immutable
as $$
  select array[
    '您好','欢迎光临','护照','登机牌','免税','价格','付款','支付','小票',
    '没有货','推荐','旅途愉快','支付宝','微信支付','银联卡','二维码','现金',
    '刷卡','扫码','品牌','香水','化妆品','口红','面霜','威士忌','香烟','巧克力'
  ]::text[]
$$;

-- Keep only CJK Unified Ideographs U+4E00–U+9FFF + Extension A U+3400–U+4DBF.
-- We use a wider range [U+3400..U+9FFF] for simplicity (includes a small
-- non-ideograph gap at U+4DC0..U+4DFF — irrelevant for our phrases).
create or replace function public.voice_only_chinese(s text)
returns text
language sql
immutable
as $$
  select regexp_replace(coalesce(s, ''), '[^㐀-鿿]', '', 'g')
$$;

-- Extract up to 5 keywords from a Chinese phrase.
create or replace function public.voice_extract_keywords(zh text)
returns text[]
language plpgsql
immutable
as $$
declare
  han        text   := public.voice_only_chinese(zh);
  important  text[] := public.voice_important_terms();
  found      text[] := array[]::text[];
  term       text;
  chunks     text[] := array[]::text[];
  i          int;
  ch         text;
begin
  if han = '' then return array[]::text[]; end if;

  foreach term in array important loop
    if position(term in han) > 0 then
      found := array_append(found, term);
    end if;
  end loop;
  if array_length(found, 1) is not null then
    return (select array_agg(distinct x) from unnest(found[1:5]) x);
  end if;

  if char_length(han) <= 4 then return array[han]; end if;

  -- 2-char non-overlapping chunks
  i := 1;
  while i <= char_length(han) - 1 and coalesce(array_length(chunks, 1), 0) < 5 loop
    ch := substr(han, i, 2);
    if not (ch = any(chunks)) then chunks := array_append(chunks, ch); end if;
    i := i + 2;
  end loop;
  return chunks;
end;
$$;

-- Char-overlap ratio: fraction of expected chars present anywhere in transcript.
create or replace function public.voice_char_overlap(expected text, transcript text)
returns numeric
language plpgsql
immutable
as $$
declare
  exp_len int := char_length(coalesce(expected, ''));
  tset    text[];
  hit     int := 0;
  i       int;
begin
  if exp_len = 0 then return 0; end if;
  tset := array(
    select distinct substr(coalesce(transcript, ''), gs, 1)
      from generate_series(1, char_length(coalesce(transcript, ''))) gs
  );
  for i in 1..exp_len loop
    if substr(expected, i, 1) = any(tset) then hit := hit + 1; end if;
  end loop;
  return hit::numeric / exp_len::numeric;
end;
$$;

-- Core scorer: returns (score 0..100, result enum).
create or replace function public.voice_score(expected_zh text, transcript text)
returns table(score int, result text)
language plpgsql
immutable
as $$
#variable_conflict use_column
declare
  exp_han   text := public.voice_only_chinese(expected_zh);
  t_han     text := public.voice_only_chinese(transcript);
  keywords  text[] := public.voice_extract_keywords(expected_zh);
  matched   int := 0;
  kw_cov    numeric;
  overlap   numeric;
  raw       numeric;
  s         int;
  r         text;
  kw        text;
begin
  if array_length(keywords, 1) is null then
    kw_cov := 0;
  else
    foreach kw in array keywords loop
      if position(kw in t_han) > 0 then matched := matched + 1; end if;
    end loop;
    kw_cov := matched::numeric / array_length(keywords, 1)::numeric;
  end if;

  overlap := public.voice_char_overlap(exp_han, t_han);

  -- Short phrases weight char-overlap; longer weight keyword coverage (mirrors TS).
  if char_length(exp_han) <= 4 then
    raw := 0.7 * overlap + 0.3 * kw_cov;
  else
    raw := 0.4 * overlap + 0.6 * kw_cov;
  end if;

  s := greatest(0, least(100, round(raw * 100)::int));

  if    s >= 70 then r := 'pass';
  elsif s >= 45 then r := 'near';
  else               r := 'retry';
  end if;

  -- Qualify OUT params to avoid ambiguity with table columns of same name
  -- (e.g. voice_attempts.result) when this function is called inline.
  voice_score.score  := s;
  voice_score.result := r;
  return next;
end;
$$;

-- Tighten access on helpers — only authenticated may execute (no anon).
revoke all on function public.voice_important_terms()             from public;
revoke all on function public.voice_only_chinese(text)            from public;
revoke all on function public.voice_extract_keywords(text)        from public;
revoke all on function public.voice_char_overlap(text, text)      from public;
revoke all on function public.voice_score(text, text)             from public;
grant execute on function public.voice_important_terms()          to authenticated;
grant execute on function public.voice_only_chinese(text)         to authenticated;
grant execute on function public.voice_extract_keywords(text)     to authenticated;
grant execute on function public.voice_char_overlap(text, text)   to authenticated;
grant execute on function public.voice_score(text, text)          to authenticated;

-- ============================================================
-- 4. RPCs (SECURITY DEFINER — server is source of truth)
-- ============================================================

-- submit_voice_attempt:
--   - Looks up expected zh from phrases table by phrase_id (rejects unknown).
--   - Computes score+result server-side via voice_score (ignores any client values).
--   - p_manual=true bypasses scoring and writes result='manual' with NULL score.
--   - Updates profiles.voice_pass_count (distinct phrases with pass or manual).
create or replace function public.submit_voice_attempt(
  p_phrase_id  text,
  p_lesson_id  text default null,
  p_transcript text default null,
  p_manual     boolean default false
)
returns table(score int, result text)
language plpgsql
security definer
set search_path = public
as $$
#variable_conflict use_column
declare
  uid          uuid := auth.uid();
  expected_zh  text;
  scored       record;
  s            int;
  r            text;
begin
  if uid is null then raise exception 'not authenticated'; end if;

  select zh into expected_zh from public.phrases where id = p_phrase_id;
  if expected_zh is null then
    raise exception 'unknown phrase: %', p_phrase_id using errcode = 'P0002';
  end if;

  if p_manual then
    s := null;
    r := 'manual';
  else
    select * into scored from public.voice_score(expected_zh, coalesce(p_transcript, ''));
    s := scored.score;
    r := scored.result;
  end if;

  insert into public.voice_attempts (user_id, phrase_id, lesson_id, transcript, score, result)
  values (
    uid,
    p_phrase_id,
    coalesce(p_lesson_id, (select lesson_id from public.phrases where id = p_phrase_id)),
    case when p_manual then null else p_transcript end,
    s,
    r
  );

  update public.profiles set voice_pass_count = (
    select count(distinct phrase_id)
      from public.voice_attempts
     where user_id = uid and result in ('pass', 'manual')
  ) where id = uid;

  -- Qualify OUT params (avoid clash with voice_attempts.result column above).
  submit_voice_attempt.score  := coalesce(s, 0);
  submit_voice_attempt.result := r;
  return next;
end;
$$;

-- submit_quiz_attempt: server computes score from correct/total; updates best on profile.
create or replace function public.submit_quiz_attempt(
  p_quiz_id        text,
  p_lesson_id      text,
  p_correct_count  int,
  p_total_count    int
)
returns table(score numeric, is_best boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  uid            uuid := auth.uid();
  computed       numeric;
  prev_best      numeric;
  became_best    boolean := false;
begin
  if uid is null then raise exception 'not authenticated'; end if;
  if p_total_count is null or p_total_count <= 0 then
    raise exception 'invalid total_count: %', p_total_count;
  end if;
  if p_correct_count is null or p_correct_count < 0 or p_correct_count > p_total_count then
    raise exception 'invalid correct_count: % of %', p_correct_count, p_total_count;
  end if;

  computed := round((p_correct_count::numeric / p_total_count::numeric) * 100, 1);

  select best_quiz_score into prev_best from public.profiles where id = uid;
  if prev_best is null or computed > prev_best then
    update public.profiles set best_quiz_score = computed where id = uid;
    became_best := true;
  end if;

  submit_quiz_attempt.score   := computed;
  submit_quiz_attempt.is_best := became_best;
  return next;
end;
$$;

-- mark_phrase_learned: convenience RPC; validates phrase_id; recomputes aggregate.
create or replace function public.mark_phrase_learned(
  p_phrase_id  text,
  p_learned    boolean default true
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  ph_lesson text;
begin
  if uid is null then raise exception 'not authenticated'; end if;
  select lesson_id into ph_lesson from public.phrases where id = p_phrase_id;
  if not found then
    raise exception 'unknown phrase: %', p_phrase_id using errcode = 'P0002';
  end if;

  insert into public.phrase_progress (user_id, phrase_id, lesson_id, learned, learned_at)
  values (uid, p_phrase_id, ph_lesson, p_learned, case when p_learned then now() else null end)
  on conflict (user_id, phrase_id) do update set
    learned    = excluded.learned,
    lesson_id  = coalesce(excluded.lesson_id, phrase_progress.lesson_id),
    learned_at = case
                   when excluded.learned and phrase_progress.learned_at is null then now()
                   when not excluded.learned then null
                   else phrase_progress.learned_at
                 end,
    updated_at = now();

  update public.profiles set phrase_learned_count = (
    select count(*) from public.phrase_progress
     where user_id = uid and learned = true
  ) where id = uid;
end;
$$;

-- mark_lesson_complete: convenience RPC for lesson-level completion.
create or replace function public.mark_lesson_complete(
  p_lesson_id  text,
  p_completed  boolean default true
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then raise exception 'not authenticated'; end if;
  if p_lesson_id is null or p_lesson_id = '' then raise exception 'lesson_id required'; end if;

  insert into public.lesson_progress (user_id, lesson_id, completed, completed_at)
  values (uid, p_lesson_id, p_completed, case when p_completed then now() else null end)
  on conflict (user_id, lesson_id) do update set
    completed    = excluded.completed,
    completed_at = case
                     when excluded.completed and lesson_progress.completed_at is null then now()
                     when not excluded.completed then null
                     else lesson_progress.completed_at
                   end,
    updated_at = now();
end;
$$;

-- Grant execute on RPCs (deny anon by default).
revoke all on function public.submit_voice_attempt(text, text, text, boolean) from public;
revoke all on function public.submit_quiz_attempt(text, text, int, int)       from public;
revoke all on function public.mark_phrase_learned(text, boolean)              from public;
revoke all on function public.mark_lesson_complete(text, boolean)             from public;
grant execute on function public.submit_voice_attempt(text, text, text, boolean) to authenticated;
grant execute on function public.submit_quiz_attempt(text, text, int, int)       to authenticated;
grant execute on function public.mark_phrase_learned(text, boolean)              to authenticated;
grant execute on function public.mark_lesson_complete(text, boolean)             to authenticated;

-- ============================================================
-- 5. LOCKDOWN — voice_attempts is now write-only via submit_voice_attempt RPC
-- ============================================================
revoke insert on public.voice_attempts from authenticated;
-- Drop the old va_self_insert policy too (defense in depth: even if INSERT is
-- accidentally re-granted later, no policy will allow it).
drop policy if exists va_self_insert on public.voice_attempts;

-- ============================================================
-- 6. Backfill aggregates on profiles from existing data (idempotent)
-- ============================================================
update public.profiles p set
  voice_pass_count = coalesce((
    select count(distinct va.phrase_id)
      from public.voice_attempts va
     where va.user_id = p.id and va.result in ('pass','manual')
  ), 0),
  phrase_learned_count = coalesce((
    select count(*) from public.phrase_progress pp
     where pp.user_id = p.id and pp.learned = true
  ), 0);

-- ============================================================
-- 7. Verify
-- ============================================================
select
  (select count(*) from public.phrases)                                                 as phrases_seeded,
  (select count(*) from public.phrase_progress)                                         as phrase_progress_rows,
  (select count(*) from pg_proc
     where pronamespace = 'public'::regnamespace
       and proname in ('voice_important_terms','voice_only_chinese','voice_extract_keywords',
                       'voice_char_overlap','voice_score',
                       'submit_voice_attempt','submit_quiz_attempt',
                       'mark_phrase_learned','mark_lesson_complete'))                   as functions_created,
  (select count(*) from pg_policies where schemaname='public' and tablename='phrase_progress') as pp_policy_count,
  (select count(*) from information_schema.table_privileges
     where grantee='authenticated' and table_name='voice_attempts' and privilege_type='INSERT') as voice_insert_grants;
-- Expected: phrases_seeded=91, functions_created=9, pp_policy_count=4, voice_insert_grants=0.

-- ============================================================
-- 8. Sanity-test the scorer (read-only; safe to run anytime)
-- ============================================================
-- Should print: pass / pass / near or retry / retry / manual-bypass
select 'exact match'             as label, * from public.voice_score('您好，欢迎光临！', '您好，欢迎光临！');
select 'partial keyword match'   as label, * from public.voice_score('请出示您的护照和登机牌。', '护照登机牌');
select 'random/empty transcript' as label, * from public.voice_score('请出示您的护照和登机牌。', '');
select 'unrelated text'          as label, * from public.voice_score('请出示您的护照和登机牌。', '今天天气真好。');
