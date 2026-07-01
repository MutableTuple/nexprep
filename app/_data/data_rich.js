// ============================================================================
// JEE QUESTION — JS object shape matching questions-supabase-schema.sql
// ============================================================================
// Insert this directly via supabase.from('questions').insert(question)
// ============================================================================

export const exampleQuestion = {
  slug: "roots-of-quadratic-alpha-sq-beta-sq",
  status: "published",

  subject: "Mathematics",
  chapter: "Quadratic Equations",
  topic: "Roots of Quadratic Equation",
  sub_topic: "Relationship Between Roots",
  exam: "JEE Main",
  difficulty: "Easy",

  marks: 4,
  negative_marks: -1,
  estimated_time_seconds: 90,

  question_type: "MCQ_SINGLE",
  question_text:
    "If α and β are the roots of x² − 5x + 6 = 0, then find α² + β².",
  question_latex:
    "\\text{If } \\alpha,\\beta \\text{ are roots of } x^2-5x+6=0, \\text{ find } \\alpha^2+\\beta^2.",
  explanation: "For x²−5x+6=0, α+β=5 and αβ=6. So α²+β² = 25 − 12 = 13.",
  hints: [
    { level: 1, text: "Use Vieta's formulas to find α+β and αβ." },
    { level: 2, text: "Recall α²+β² = (α+β)² − 2αβ." },
  ],
  images: [],

  data: {
    options: [
      { id: "A", text: "11" },
      { id: "B", text: "13" },
      { id: "C", text: "15" },
      { id: "D", text: "17" },
    ],
    correctOptionId: "B",
  },

  tags: ["Quadratic", "Roots", "Vieta", "Algebra"],
};

// ----------------------------------------------------------------------------
// Validation with zod — run this before every insert (admin form, CSV import,
// AI-generated batch). This is the part that actually keeps a jsonb column
// safe; Postgres won't catch a malformed `data` object on its own.
//   npm install zod
// ----------------------------------------------------------------------------

import { z } from "zod";

const mcqOption = z.object({ id: z.string(), text: z.string() });

const dataByType = {
  MCQ_SINGLE: z.object({
    options: z.array(mcqOption).min(2),
    correctOptionId: z.string(),
  }),
  MCQ_MULTIPLE: z.object({
    options: z.array(mcqOption).min(2),
    correctOptionIds: z.array(z.string()).min(1),
  }),
  INTEGER: z.object({ correctValue: z.number().int() }),
  NUMERICAL: z.object({
    correctValue: z.number(),
    tolerance: z.number(),
    unit: z.string().optional(),
  }),
  FILL_IN_THE_BLANK: z.object({
    blanks: z.array(
      z.object({ id: z.string(), acceptedAnswers: z.array(z.string()).min(1) }),
    ),
  }),
  TRUE_FALSE: z.object({ correctValue: z.boolean() }),
  MATCH_THE_COLUMN: z.object({
    pairs: z.array(
      z.object({
        leftId: z.string(),
        leftText: z.string(),
        rightId: z.string(),
        rightText: z.string(),
      }),
    ),
    correctMapping: z.record(z.string()),
  }),
  MATRIX_MATCH: z.object({
    rows: z.array(z.object({ id: z.string(), text: z.string() })),
    columns: z.array(z.object({ id: z.string(), text: z.string() })),
    correctMapping: z.record(z.array(z.string())),
  }),
  ASSERTION_REASON: z.object({
    assertion: z.string(),
    reason: z.string(),
    options: z.array(mcqOption),
    correctOptionId: z.string(),
  }),
  SEQUENCE: z.object({
    items: z.array(z.object({ id: z.string(), text: z.string() })),
    correctOrder: z.array(z.string()),
  }),
  COMPREHENSION: z.object({
    passage: z.string(),
    childQuestionIds: z.array(z.string()),
  }),
  CASE_STUDY: z.object({
    scenario: z.string(),
    childQuestionIds: z.array(z.string()),
  }),
};

export const questionSchema = z
  .object({
    slug: z.string(),
    status: z.enum(["draft", "in_review", "published", "archived"]),
    subject: z.enum(["Mathematics", "Physics", "Chemistry"]),
    chapter: z.string(),
    topic: z.string(),
    sub_topic: z.string().optional(),
    exam: z.enum(["JEE Main", "JEE Advanced", "BITSAT", "NEET", "Other"]),
    difficulty: z.enum(["Easy", "Medium", "Hard"]),
    marks: z.number(),
    negative_marks: z.number(),
    estimated_time_seconds: z.number(),
    question_type: z.enum(Object.keys(dataByType)),
    question_text: z.string().min(1),
    question_latex: z.string().optional(),
    explanation: z.string().min(1),
    hints: z
      .array(
        z.object({
          level: z.union([z.literal(1), z.literal(2), z.literal(3)]),
          text: z.string(),
        }),
      )
      .optional(),
    images: z
      .array(
        z.object({
          url: z.string(),
          alt: z.string(),
          width: z.number().optional(),
          height: z.number().optional(),
        }),
      )
      .optional(),
    tags: z.array(z.string()).optional(),
    data: z.any(),
  })
  .superRefine((q, ctx) => {
    const schema = dataByType[q.question_type];
    const result = schema.safeParse(q.data);
    if (!result.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `data does not match ${q.question_type}: ${result.error.message}`,
        path: ["data"],
      });
    }
  });

// Usage before insert:
// const parsed = questionSchema.safeParse(exampleQuestion);
// if (!parsed.success) throw new Error(parsed.error.message);
// await supabase.from('questions').insert(parsed.data);

/*** -- ============================================================================
-- JEE QUESTIONS — SUPABASE SCHEMA
-- ============================================================================
-- Philosophy: flat columns for anything you'll filter/sort/index on.
-- One jsonb column ("data") for type-specific content (options, pairs, etc).
-- This keeps queries like "Easy Algebra MCQs in JEE Main" fast and simple,
-- while staying flexible enough to add new question types without migrations.
-- ============================================================================

create table questions (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  status          text not null default 'draft'
                    check (status in ('draft','in_review','published','archived')),

  -- classification (flat = indexable = fast filtering)
  subject         text not null check (subject in ('Mathematics','Physics','Chemistry')),
  chapter         text not null,
  topic           text not null,
  sub_topic       text,
  exam            text not null default 'JEE Main'
                    check (exam in ('JEE Main','JEE Advanced','BITSAT','NEET','Other')),
  difficulty      text not null check (difficulty in ('Easy','Medium','Hard')),

  -- marking
  marks           int not null default 4,
  negative_marks  int not null default -1,
  estimated_time_seconds int not null default 90,

  -- content
  question_type   text not null check (question_type in (
                    'MCQ_SINGLE','MCQ_MULTIPLE','INTEGER','NUMERICAL',
                    'FILL_IN_THE_BLANK','TRUE_FALSE','MATCH_THE_COLUMN',
                    'MATRIX_MATCH','ASSERTION_REASON','SEQUENCE',
                    'COMPREHENSION','CASE_STUDY'
                  )),
  question_text   text not null,            -- plain text, always present (search/screen readers)
  question_latex  text,                      -- optional LaTeX/markdown version for rendering
  explanation     text not null,
  hints           jsonb default '[]',        -- [{level, text}]
  images          jsonb default '[]',        -- [{url, alt, width, height}]

  -- type-specific payload (options, pairs, correct answers, etc.)
  data            jsonb not null,

  -- discovery
  tags            text[] default '{}',
  search_text     text generated always as (
                    coalesce(question_text,'') || ' ' || coalesce(array_to_string(tags,' '),'')
                  ) stored,

  -- denormalized analytics (update via RPC/trigger, not client writes)
  attempts        int not null default 0,
  correct_attempts int not null default 0,
  avg_time_seconds numeric default 0,

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- indexes for the filters you'll actually use
create index idx_questions_subject_chapter on questions (subject, chapter);
create index idx_questions_topic on questions (topic);
create index idx_questions_difficulty on questions (difficulty);
create index idx_questions_status on questions (status);
create index idx_questions_tags on questions using gin (tags);
create index idx_questions_data on questions using gin (data jsonb_path_ops);
create index idx_questions_search on questions using gin (to_tsvector('english', search_text));

-- keep updated_at fresh
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_questions_updated_at
  before update on questions
  for each row execute function set_updated_at();

-- RLS: public can read published questions, only authenticated/admin can write
alter table questions enable row level security;

create policy "Published questions are publicly readable"
  on questions for select
  using (status = 'published');

create policy "Authenticated users can manage questions"
  on questions for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ============================================================================
-- `data` jsonb shape per question_type (enforce with zod in the app, see below)
-- ============================================================================
-- MCQ_SINGLE        { options: [{id,text}], correctOptionId }
-- MCQ_MULTIPLE      { options: [{id,text}], correctOptionIds: [] }
-- INTEGER           { correctValue: number }
-- NUMERICAL         { correctValue: number, tolerance: number, unit? }
-- FILL_IN_THE_BLANK { blanks: [{id, acceptedAnswers: []}] }
-- TRUE_FALSE        { correctValue: boolean }
-- MATCH_THE_COLUMN  { pairs: [{leftId,leftText,rightId,rightText}], correctMapping }
-- MATRIX_MATCH      { rows: [], columns: [], correctMapping: { rowId: [colId] } }
-- ASSERTION_REASON  { assertion, reason, options: [], correctOptionId }
-- SEQUENCE          { items: [{id,text}], correctOrder: [] }
-- COMPREHENSION     { passage, childQuestionIds: [] }
-- CASE_STUDY        { scenario, childQuestionIds: [] }


***/
