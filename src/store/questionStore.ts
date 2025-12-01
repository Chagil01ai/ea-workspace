// src/store/questionStore.ts
import part1Questions from "../data/questions.part1.sample.json";
import part2Questions from "../data/questions.part2.sample.json";
import part3Questions from "../data/questions.part3.sample.json";

import type {
  ExamPart,
  Question,
  QuestionOption,
  QuestionAttempt,
} from "../domain/models/question.ts";

// Re-export types so components can import from here
export type { ExamPart, Question, QuestionOption, QuestionAttempt };

const ATTEMPTS_STORAGE_KEY = "eaQuestionAttempts_v1";

// ---- Question bank ----

const QUESTION_BANK: Record<ExamPart, Question[]> = {
  PART1_INDIVIDUALS: part1Questions as Question[],
  PART2_BUSINESS: part2Questions as Question[],
  PART3_REPRESENTATION: part3Questions as Question[],
};

function getQuestionsForPartSync(part: ExamPart): Question[] {
  return QUESTION_BANK[part] ?? [];
}

/**
 * Async wrapper for consistency with views that `await` this.
 */
export async function getQuestionsForPart(part: ExamPart): Promise<Question[]> {
  return getQuestionsForPartSync(part);
}

/**
 * All questions for a given part, synchronously.
 */
export function getAllQuestionsForPart(part: ExamPart): Question[] {
  return getQuestionsForPartSync(part);
}

/**
 * All questions for a part + SEE section (using string sectionId).
 */
export function getQuestionsByPartAndSection(
  part: ExamPart,
  sectionId: string
): Question[] {
  const all = getQuestionsForPartSync(part);
  return all.filter((q) => q.sectionId === sectionId);
}

/**
 * Convenience helper in case you want to look up a specific question.
 */
export function findQuestionById(part: ExamPart, questionId: string): Question | undefined {
  const all = getQuestionsForPartSync(part);
  return all.find((q) => q.id === questionId);
}

// ---- Attempts persistence ----

function loadAttemptsRaw(): QuestionAttempt[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ATTEMPTS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as QuestionAttempt[];
  } catch {
    return [];
  }
}

function saveAttemptsRaw(attempts: QuestionAttempt[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ATTEMPTS_STORAGE_KEY, JSON.stringify(attempts));
  } catch {
    // ignore write failures
  }
}

/**
 * Get all recorded attempts (for analytics, etc.)
 */
export function getAllAttempts(): QuestionAttempt[] {
  return loadAttemptsRaw();
}

/**
 * Get attempts for a specific part (useful for analytics).
 */
export function getAttemptsForPart(part: ExamPart): QuestionAttempt[] {
  return loadAttemptsRaw().filter((a) => a.part === part);
}

/**
 * Record a new attempt and persist it.
 */
export function recordQuestionAttempt(
  input: Omit<QuestionAttempt, "id" | "attemptedAt">
): QuestionAttempt {
  const attempts = loadAttemptsRaw();
  const attemptedAt = new Date().toISOString();

  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const attempt: QuestionAttempt = {
    id,
    attemptedAt,
    ...input,
  };

  attempts.push(attempt);
  saveAttemptsRaw(attempts);

  return attempt;
}

/**
 * Used by profile import to replace the entire attempt history.
 */
export function setAllAttemptsForImport(attempts: QuestionAttempt[]): void {
  saveAttemptsRaw(attempts);
}
