import { supabase } from "./supabase";

const SELECT_LIST =
  "id, slug, subject, chapter, topic, difficulty, marks, negative_marks, estimated_time_seconds, question_text, question_type, hints, tags, exam, data, explanation";

const SELECT_FULL = "*";

function buildSlug(topic) {
  return topic
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function mapQuestion(q) {
  return {
    id: q.id,
    slug: q.slug,
    href: `/problems/solve/${buildSlug(q.topic)}/${q.id}`,
    images: q.images ?? [],
    title: q.topic,
    question: q.question_text,
    subject: q.subject,
    chapter: q.chapter,
    difficulty: q.difficulty,

    xp: q.marks * 25,
    time: `${Math.ceil(q.estimated_time_seconds / 60)} min`,
    marks: q.marks,
    negativeMarks: q.negative_marks,

    options: q.data?.options ?? [],
    correctOption:
      q.data?.correctOptionId ?? q.data?.correctOptionIds?.[0] ?? "",
    correctValue: q.data?.correctValue ?? null,

    explanation: q.explanation ?? "",
    solutionSteps: q.data?.solutionSteps ?? [],
    formula: q.data?.formula ?? "",
    hint: q.hints?.[0]?.text ?? "",
    hints: (q.hints ?? []).map((h) => h.text),

    exam: q.exam,
    tags: q.tags ?? [],
    questionType: q.question_type,

    solved: false,
    bookmarked: false,
  };
}

export async function getQuestions({
  subject,
  difficulties = [],
  search = "",
  page = 1,
  limit = 50,
} = {}) {
  let query = supabase
    .from("questions")
    .select(SELECT_LIST)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (subject && subject !== "All") {
    query = query.eq("subject", subject);
  }

  if (difficulties.length > 0) {
    query = query.in("difficulty", difficulties);
  }

  if (search.trim()) {
    query = query.textSearch("search_text", search.trim(), {
      type: "websearch",
      config: "english",
    });
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(mapQuestion);
}

export async function getQuestionById(id) {
  const { data, error } = await supabase
    .from("questions")
    .select(SELECT_FULL)
    .eq("id", id)
    .eq("status", "published")
    .single();
  if (error) throw error;
  return mapQuestion(data);
}

export async function getQuestionBySlug(slug) {
  const { data, error } = await supabase
    .from("questions")
    .select(SELECT_FULL)
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  if (error) throw error;
  return mapQuestion(data);
}

export async function getAllQuestionIds() {
  const { data, error } = await supabase
    .from("questions")
    .select("id, topic")
    .eq("status", "published");
  if (error) throw error;
  return (data ?? []).map((q) => ({
    id: q.id,
    problemname: buildSlug(q.topic),
  }));
}
export async function getSimilarQuestions({
  subject,
  chapter,
  topic,
  currentQuestionId,
  limit = 6,
}) {
  const questions = await getQuestions({
    subject,
    limit: 500,
  });

  return questions
    .filter(
      (q) =>
        q.subject === subject &&
        q.chapter === chapter &&
        q.topic === topic &&
        q.id !== currentQuestionId,
    )
    .slice(0, limit);
}
