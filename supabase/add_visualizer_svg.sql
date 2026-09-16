-- Adds a per-question, pre-rendered SVG visualization that the frontend
-- can drop into the QuestionCard preview area. The column is populated
-- once by scripts/backfill-visualizers.mjs (Gemini free tier) and then
-- read for free forever — no per-view LLM cost.
--
-- Fields:
--   visualizer_svg          : raw SVG source, viewBox-based, self-contained
--   visualizer_model        : which LLM generated it (for future regen filtering)
--   visualizer_generated_at : timestamp; a new content-hash → regen on mismatch
--   visualizer_quality      : 0..5, users flag bad ones for regeneration
--
-- The column stays TEXT (not JSONB) because the SVG is opaque to Postgres —
-- we never query into it, just fetch and render.

alter table public.questions
  add column if not exists visualizer_svg text,
  add column if not exists visualizer_model text,
  add column if not exists visualizer_generated_at timestamptz,
  add column if not exists visualizer_quality smallint;

-- Partial index so the backfill script can quickly find rows still missing
-- a visualization (avoids scanning the whole table each run).
create index if not exists questions_visualizer_pending_idx
  on public.questions (id)
  where visualizer_svg is null;
