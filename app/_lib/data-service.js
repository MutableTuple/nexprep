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
  limit = 25,
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

// DATA SERVICE FOR PROFILE CRUD OPS

function handle({ data, error }) {
  if (error) throw error;
  return data;
}

/* ============================================================
   PROFILES
   ============================================================ */

export async function getProfile(userId) {
  if (!userId) return null;

  try {
    return await handle(
      await supabase.from("profiles").select("*").eq("id", userId).single(),
    );
  } catch (err) {
    console.error("getProfile failed:", err.message);
    return null; // caller falls back to the auth user object
  }
}

export async function isUsernameAvailable(username) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .maybeSingle();
  if (error) throw error;
  return !data;
}
export async function getProfileByUsername(username) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createProfile(profile) {
  return handle(
    await supabase.from("profiles").insert(profile).select().single(),
  );
}

export async function updateProfile(userId, updates) {
  return handle(
    await supabase
      .from("profiles")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", userId)
      .select()
      .single(),
  );
}

export async function deleteProfile(userId) {
  return handle(await supabase.from("profiles").delete().eq("id", userId));
}

export async function searchProfiles(query, limit = 20) {
  return handle(
    await supabase
      .from("profiles")
      .select("*")
      .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
      .limit(limit),
  );
}

/* ============================================================
   QUESTIONS
   ============================================================ */

export async function getQuestion(id) {
  return handle(
    await supabase.from("questions").select("*").eq("id", id).single(),
  );
}

export async function listQuestions({
  subject,
  chapter,
  topic,
  difficulty,
  exam,
  status = "published",
  page = 1,
  pageSize = 20,
} = {}) {
  let query = supabase.from("questions").select("*", { count: "exact" });

  if (subject) query = query.eq("subject", subject);
  if (chapter) query = query.eq("chapter", chapter);
  if (topic) query = query.eq("topic", topic);
  if (difficulty) query = query.eq("difficulty", difficulty);
  if (exam) query = query.eq("exam", exam);
  if (status) query = query.eq("status", status);

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { data, count };
}

export async function searchQuestions(query, limit = 20) {
  return handle(
    await supabase
      .from("questions")
      .select("*")
      .textSearch("search_text", query)
      .limit(limit),
  );
}

export async function createQuestion(question) {
  return handle(
    await supabase.from("questions").insert(question).select().single(),
  );
}

export async function updateQuestion(id, updates) {
  return handle(
    await supabase
      .from("questions")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single(),
  );
}

export async function deleteQuestion(id) {
  return handle(await supabase.from("questions").delete().eq("id", id));
}

export async function incrementQuestionAttempts(id, isCorrect) {
  return handle(
    await supabase.rpc("increment_question_attempts", {
      question_id: id,
      correct: isCorrect,
    }),
  );
}

/* ============================================================
   SOLVED QUESTIONS
   ============================================================ */

export async function getSolvedQuestion(id) {
  return handle(
    await supabase.from("solved_questions").select("*").eq("id", id).single(),
  );
}

export async function listSolvedQuestionsByUser(
  userId,
  { page = 1, pageSize = 20 } = {},
) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  return handle(
    await supabase
      .from("solved_questions")
      .select("*, questions(*)")
      .eq("user_id", userId)
      .order("solved_at", { ascending: false })
      .range(from, to),
  );
}

export async function getSolvedQuestionForUser(userId, questionId) {
  const { data, error } = await supabase
    .from("solved_questions")
    .select("*")
    .eq("user_id", userId)
    .eq("question_id", questionId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function recordSolvedQuestion(entry) {
  const { data, error } = await supabase
    .from("solved_questions")
    .upsert(entry, { onConflict: "user_id,question_id" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateSolvedQuestion(id, updates) {
  return handle(
    await supabase
      .from("solved_questions")
      .update(updates)
      .eq("id", id)
      .select()
      .single(),
  );
}

export async function deleteSolvedQuestion(id) {
  return handle(await supabase.from("solved_questions").delete().eq("id", id));
}

export async function toggleSolvedQuestionBookmark(id, bookmarked) {
  return handle(
    await supabase
      .from("solved_questions")
      .update({ bookmarked })
      .eq("id", id)
      .select()
      .single(),
  );
}

/* ============================================================
   BOOKMARKS
   ============================================================ */

export async function listBookmarksByUser(userId) {
  return handle(
    await supabase
      .from("bookmarks")
      .select("*, questions(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
  );
}

export async function isBookmarked(userId, questionId) {
  const { data, error } = await supabase
    .from("bookmarks")
    .select("user_id")
    .eq("user_id", userId)
    .eq("question_id", questionId)
    .maybeSingle();
  if (error) throw error;
  return Boolean(data);
}

export async function addBookmark(userId, questionId) {
  return handle(
    await supabase
      .from("bookmarks")
      .insert({ user_id: userId, question_id: questionId })
      .select()
      .single(),
  );
}

export async function removeBookmark(userId, questionId) {
  return handle(
    await supabase
      .from("bookmarks")
      .delete()
      .eq("user_id", userId)
      .eq("question_id", questionId),
  );
}

export async function toggleBookmark(userId, questionId) {
  const bookmarked = await isBookmarked(userId, questionId);
  if (bookmarked) {
    await removeBookmark(userId, questionId);
    return false;
  }
  await addBookmark(userId, questionId);
  return true;
}

/* ============================================================
   FRIENDSHIPS
   ============================================================ */

export async function getFriendship(id) {
  return handle(
    await supabase.from("friendships").select("*").eq("id", id).single(),
  );
}

export async function listFriendships(userId, status) {
  let query = supabase
    .from("friendships")
    .select("*")
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);
  if (status) query = query.eq("status", status);
  return handle(await query.order("created_at", { ascending: false }));
}

export async function listPendingFriendRequests(userId) {
  return handle(
    await supabase
      .from("friendships")
      .select("*, profiles!friendships_sender_id_fkey(*)")
      .eq("receiver_id", userId)
      .eq("status", "pending")
      .order("created_at", { ascending: false }),
  );
}

export async function sendFriendRequest(senderId, receiverId) {
  return handle(
    await supabase
      .from("friendships")
      .insert({
        sender_id: senderId,
        receiver_id: receiverId,
        status: "pending",
      })
      .select()
      .single(),
  );
}

export async function respondToFriendRequest(id, status) {
  return handle(
    await supabase
      .from("friendships")
      .update({ status })
      .eq("id", id)
      .select()
      .single(),
  );
}

export async function deleteFriendship(id) {
  return handle(await supabase.from("friendships").delete().eq("id", id));
}

export async function getFriendLeaderboard(limit = 50) {
  return handle(
    await supabase
      .from("friend_leaderboard")
      .select("*")
      .order("xp", { ascending: false })
      .limit(limit),
  );
}

/* ============================================================
   STUDY SESSIONS
   ============================================================ */

export async function getStudySession(id) {
  return handle(
    await supabase.from("study_sessions").select("*").eq("id", id).single(),
  );
}

export async function listStudySessionsByUser(
  userId,
  { page = 1, pageSize = 20 } = {},
) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  return handle(
    await supabase
      .from("study_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("started_at", { ascending: false })
      .range(from, to),
  );
}

export async function startStudySession(userId) {
  return handle(
    await supabase
      .from("study_sessions")
      .insert({ user_id: userId, started_at: new Date().toISOString() })
      .select()
      .single(),
  );
}

export async function endStudySession(
  id,
  { questionsAttempted, questionsCorrect },
) {
  const endedAt = new Date().toISOString();
  const session = await getStudySession(id);
  const durationSeconds = Math.round(
    (new Date(endedAt) - new Date(session.started_at)) / 1000,
  );

  return handle(
    await supabase
      .from("study_sessions")
      .update({
        ended_at: endedAt,
        duration_seconds: durationSeconds,
        questions_attempted: questionsAttempted,
        questions_correct: questionsCorrect,
      })
      .eq("id", id)
      .select()
      .single(),
  );
}

export async function deleteStudySession(id) {
  return handle(await supabase.from("study_sessions").delete().eq("id", id));
}

/* ============================================================
   USER BADGES
   ============================================================ */

export async function listUserBadges(userId) {
  return handle(
    await supabase
      .from("user_badges")
      .select("*")
      .eq("user_id", userId)
      .order("unlocked_at", { ascending: false }),
  );
}

export async function hasUserBadge(userId, badgeSlug) {
  const { data, error } = await supabase
    .from("user_badges")
    .select("id")
    .eq("user_id", userId)
    .eq("badge_slug", badgeSlug)
    .maybeSingle();
  if (error) throw error;
  return Boolean(data);
}

export async function unlockUserBadge(userId, badgeSlug) {
  return handle(
    await supabase
      .from("user_badges")
      .insert({ user_id: userId, badge_slug: badgeSlug })
      .select()
      .single(),
  );
}

export async function deleteUserBadge(id) {
  return handle(await supabase.from("user_badges").delete().eq("id", id));
}

/* ============================================================
   USER GOALS  (1:1 with user, keyed by user_id)
   ============================================================ */

export async function getUserGoals(userId) {
  return handle(
    await supabase
      .from("user_goals")
      .select("*")
      .eq("user_id", userId)
      .single(),
  );
}

export async function upsertUserGoals(userId, goals) {
  return handle(
    await supabase
      .from("user_goals")
      .upsert({ user_id: userId, ...goals })
      .select()
      .single(),
  );
}

export async function deleteUserGoals(userId) {
  return handle(
    await supabase.from("user_goals").delete().eq("user_id", userId),
  );
}

/* ============================================================
   USER PREFERENCES  (1:1 with user, keyed by user_id)
   ============================================================ */

export async function getUserPreferences(userId) {
  return handle(
    await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", userId)
      .single(),
  );
}

export async function upsertUserPreferences(userId, prefs) {
  return handle(
    await supabase
      .from("user_preferences")
      .upsert({ user_id: userId, ...prefs })
      .select()
      .single(),
  );
}

export async function deleteUserPreferences(userId) {
  return handle(
    await supabase.from("user_preferences").delete().eq("user_id", userId),
  );
}

/* ============================================================
   USER PRIVACY  (1:1 with user, keyed by user_id)
   ============================================================ */

export async function getUserPrivacy(userId) {
  return handle(
    await supabase
      .from("user_privacy")
      .select("*")
      .eq("user_id", userId)
      .single(),
  );
}

export async function upsertUserPrivacy(userId, settings) {
  return handle(
    await supabase
      .from("user_privacy")
      .upsert({ user_id: userId, ...settings })
      .select()
      .single(),
  );
}

export async function deleteUserPrivacy(userId) {
  return handle(
    await supabase.from("user_privacy").delete().eq("user_id", userId),
  );
}

/* ============================================================
   USER STATS  (1:1 with user, keyed by user_id)
   ============================================================ */

export async function getUserStats(userId) {
  return handle(
    await supabase
      .from("user_stats")
      .select("*")
      .eq("user_id", userId)
      .single(),
  );
}

export async function upsertUserStats(userId, stats) {
  return handle(
    await supabase
      .from("user_stats")
      .upsert({
        user_id: userId,
        ...stats,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single(),
  );
}

export async function deleteUserStats(userId) {
  return handle(
    await supabase.from("user_stats").delete().eq("user_id", userId),
  );
}

// export async function getLeaderboard(limit = 50) {
//   return handle(
//     await supabase
//       .from("user_stats")
//       .select("*, profiles(username, display_name, avatar_url)")
//       .order("xp", { ascending: false })
//       .limit(limit),
//   );
// }
// //

export async function getLastSolveDate(userId) {
  const { data, error } = await supabase
    .from("solved_questions")
    .select("solved_at")
    .eq("user_id", userId)
    .order("solved_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data?.solved_at ?? null;
}
export async function getLatestPersonalGoal(userId) {
  const { data, error } = await supabase
    .from("personal_goals")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createPersonalGoal(
  userId,
  { title, description, targetDate },
) {
  const { data, error } = await supabase
    .from("personal_goals")
    .insert({
      user_id: userId,
      title,
      description: description || null,
      target_date: targetDate,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}
export async function getSolvedDatesSince(userId, sinceDate) {
  const { data, error } = await supabase
    .from("solved_questions")
    .select("solved_at")
    .eq("user_id", userId)
    .gte("solved_at", sinceDate.toISOString())
    .order("solved_at", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getMyRank(userId) {
  const { data: me, error: meErr } = await supabase
    .from("user_stats")
    .select("xp")
    .eq("user_id", userId)
    .single();
  if (meErr) throw meErr;

  const { count, error } = await supabase
    .from("user_stats")
    .select("*", { count: "exact", head: true })
    .gt("xp", me.xp);
  if (error) throw error;

  return count + 1;
}

export async function getLeaderboard(limit = 100) {
  const { data, error } = await supabase
    .from("user_stats")
    .select("*, profiles(username, display_name, avatar_url)")
    .order("xp", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

export async function getPeriodLeaderboard(sinceDate, limit = 100) {
  const { data, error } = await supabase.rpc("get_leaderboard_for_period", {
    since: sinceDate.toISOString(),
    result_limit: limit,
  });
  if (error) throw error;
  return data;
}
