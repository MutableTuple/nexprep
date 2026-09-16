-- Cached LLM classification of each question into an interactive
-- simulator. Populated once by scripts/backfill-visualizers.mjs; read
-- for free at request time. The rule-based matcher in
-- app/_lib/question-simulator-matcher.js is checked first, so this
-- column only needs to cover questions the rules can't classify.
--
-- Shape (nullable — null means "no simulator for this question"):
--   { "kind": "lcr-phasor", "params": { "R": 100, "XL": 100, "XC": 100 }, "confidence": 0.9 }

alter table public.questions
  add column if not exists simulator_spec jsonb,
  add column if not exists simulator_spec_model text,
  add column if not exists simulator_spec_generated_at timestamptz;

-- Partial index so the backfill script can quickly find rows still
-- pending classification.
create index if not exists questions_simulator_pending_idx
  on public.questions (id)
  where simulator_spec is null and simulator_spec_generated_at is null;
