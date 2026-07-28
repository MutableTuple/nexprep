-- ============================================================================
--  JoSAA cutoffs + college predictor
--  Run this in the Supabase SQL Editor, THEN import supabase/josaa_cutoffs.csv
--  into the josaa_cutoffs table (Table Editor -> josaa_cutoffs -> Insert ->
--  Import data from CSV). The CSV header matches these column names exactly.
--
--  Data: official JoSAA final-round opening/closing ranks, 2016-2024.
--  IIT ranks are JEE Advanced ranks; NIT/IIIT/GFTI ranks are JEE Main ranks.
-- ============================================================================

-- ─── Table ──────────────────────────────────────────────────────────────────

create table if not exists public.josaa_cutoffs (
  id                   bigint generated always as identity primary key,
  year                 smallint not null,
  round                smallint not null,
  institute_slug       text     not null,
  institute_name       text     not null,
  institute_full_name  text     not null,
  institute_type       text     not null,   -- IIT | NIT | IIIT | GFTI
  branch               text     not null,
  degree               text,
  duration_years       smallint,
  quota                text     not null,   -- AI | OS | HS | GO | JK | LA
  category             text     not null,   -- OPEN | EWS | OBC-NCL | SC | ST (+ PwD variants)
  gender               text     not null,   -- Gender-Neutral | Female-only
  opening_rank         integer  not null,
  closing_rank         integer  not null
);

comment on table public.josaa_cutoffs is
  'Official JoSAA final-round seat allotment opening/closing ranks, 2016-2024. Historical results only - not predictions.';

-- ─── Indexes ────────────────────────────────────────────────────────────────
-- The predictor always filters category + gender and scans a recent-year
-- window, so lead with those; the rest support the per-institute pages.

create index if not exists josaa_cutoffs_predict_idx
  on public.josaa_cutoffs (category, gender, year, closing_rank);

create index if not exists josaa_cutoffs_institute_idx
  on public.josaa_cutoffs (institute_slug, year);

create index if not exists josaa_cutoffs_type_idx
  on public.josaa_cutoffs (institute_type);

create index if not exists josaa_cutoffs_branch_idx
  on public.josaa_cutoffs (branch);

-- ─── Row Level Security ─────────────────────────────────────────────────────
-- Public reference data: readable by anyone, writable by no one through the
-- API. Loading/refreshing happens via CSV import or the service role, both of
-- which bypass RLS.

alter table public.josaa_cutoffs enable row level security;

drop policy if exists "josaa_cutoffs are publicly readable" on public.josaa_cutoffs;
create policy "josaa_cutoffs are publicly readable"
  on public.josaa_cutoffs
  for select
  to anon, authenticated
  using (true);

-- ─── Predictor ──────────────────────────────────────────────────────────────
--
--  Given a rank, report every institute+branch whose recent closing ranks
--  bracket it, and how safe that is.
--
--  Chance is derived from the actual spread of closing ranks over the last
--  p_years_back years — no invented probabilities:
--
--    strictest_rank = MIN(closing_rank)  -- the hardest year in the window
--    typical_rank   = AVG(closing_rank)
--    loosest_rank   = MAX(closing_rank)  -- the easiest year in the window
--
--    rank <= strictest  -> 'Safe'      (would have been admitted every year)
--    rank <= typical    -> 'Likely'    (better than the average year)
--    rank <= loosest    -> 'Reach'     (only cleared it in the easiest year)
--    otherwise          -> 'Unlikely'  (never cleared it in this window)
--
--  Options are returned WITH their underlying numbers so a student can judge
--  the call themselves rather than trusting a single label.

create or replace function public.predict_colleges(
  p_rank        integer,
  p_category    text    default 'OPEN',
  p_gender      text    default 'Gender-Neutral',
  p_quota       text    default null,   -- null = any quota
  p_types       text[]  default null,   -- null = all institute types
  p_years_back  integer default 3,
  p_include_unlikely boolean default false,
  p_limit       integer default 300
)
returns table (
  institute_slug  text,
  institute_name  text,
  institute_type  text,
  branch          text,
  degree          text,
  quota           text,
  chance          text,
  latest_year     smallint,
  latest_rank     integer,
  strictest_rank  integer,
  typical_rank    integer,
  loosest_rank    integer,
  years_observed  smallint
)
language sql
stable
security invoker
set search_path = public
as $$
  with bounds as (
    select max(year) as max_year from public.josaa_cutoffs
  ),
  windowed as (
    select c.*
    from public.josaa_cutoffs c, bounds b
    where c.year > b.max_year - greatest(p_years_back, 1)
      and c.category = p_category
      and c.gender   = p_gender
      and (p_quota is null or c.quota = p_quota)
      and (p_types is null or c.institute_type = any (p_types))
  ),
  grouped as (
    select
      w.institute_slug,
      w.institute_name,
      w.institute_type,
      w.branch,
      w.degree,
      w.quota,
      min(w.closing_rank)::integer                       as strictest_rank,
      round(avg(w.closing_rank))::integer                as typical_rank,
      max(w.closing_rank)::integer                       as loosest_rank,
      count(distinct w.year)::smallint                   as years_observed,
      max(w.year)::smallint                              as latest_year,
      (array_agg(w.closing_rank order by w.year desc))[1]::integer as latest_rank
    from windowed w
    group by 1, 2, 3, 4, 5, 6
  ),
  classified as (
    select
      g.*,
      case
        when p_rank <= g.strictest_rank then 'Safe'
        when p_rank <= g.typical_rank   then 'Likely'
        when p_rank <= g.loosest_rank   then 'Reach'
        else 'Unlikely'
      end as chance
    from grouped g
  )
  select
    institute_slug,
    institute_name,
    institute_type,
    branch,
    degree,
    quota,
    chance,
    latest_year,
    latest_rank,
    strictest_rank,
    typical_rank,
    loosest_rank,
    years_observed
  from classified
  where p_include_unlikely or chance <> 'Unlikely'
  order by
    case chance
      when 'Safe'     then 1
      when 'Likely'   then 2
      when 'Reach'    then 3
      else 4
    end,
    typical_rank asc
  limit greatest(p_limit, 1);
$$;

comment on function public.predict_colleges is
  'Match a JEE rank against historical JoSAA closing ranks. Returns options bucketed Safe/Likely/Reach with the underlying min/avg/max closing ranks. Historical guidance, not a guarantee.';

-- Anonymous visitors use the tool without signing in.
grant execute on function public.predict_colleges(
  integer, text, text, text, text[], integer, boolean, integer
) to anon, authenticated;

-- ─── Filter options helper ──────────────────────────────────────────────────
-- Populates the form's dropdowns from what is actually in the table, so the
-- UI can never offer a filter that returns nothing.

create or replace function public.josaa_filter_options()
returns json
language sql
stable
security invoker
set search_path = public
as $$
  select json_build_object(
    'categories', (select json_agg(distinct category order by category) from public.josaa_cutoffs),
    'genders',    (select json_agg(distinct gender   order by gender)   from public.josaa_cutoffs),
    'quotas',     (select json_agg(distinct quota    order by quota)    from public.josaa_cutoffs),
    'types',      (select json_agg(distinct institute_type order by institute_type) from public.josaa_cutoffs),
    'min_year',   (select min(year) from public.josaa_cutoffs),
    'max_year',   (select max(year) from public.josaa_cutoffs)
  );
$$;

grant execute on function public.josaa_filter_options() to anon, authenticated;

-- ─── Sanity checks (run after importing the CSV) ────────────────────────────
--
--   select count(*) from public.josaa_cutoffs;               -- expect 72929
--   select min(year), max(year) from public.josaa_cutoffs;   -- expect 2016, 2024
--
--   -- IIT Bombay CSE 2024 should be opening 1, closing 68:
--   select opening_rank, closing_rank
--   from public.josaa_cutoffs
--   where institute_slug = 'iit-bombay'
--     and branch = 'Computer Science and Engineering'
--     and year = 2024 and quota = 'AI'
--     and category = 'OPEN' and gender = 'Gender-Neutral';
--
--   -- Someone with AIR 500 (Open, gender-neutral, All India):
--   select * from public.predict_colleges(500, 'OPEN', 'Gender-Neutral', 'AI');
