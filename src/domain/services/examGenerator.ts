// src/services/examGenerator.ts
import { EXAM_METADATA, type ExamSectionId } from "../../config/examMetadata";
import type { ExamPart, Question } from "../models/question";
import { getQuestionsByPartAndSection } from "../../store/questionStore";

export interface GeneratedExamQuestion extends Question {
  /** 1-based order within the exam */
  examOrder: number;
  /** Narrower type for section id if your questions are tagged consistently */
  sectionId: ExamSectionId;
}

export interface GenerateExamOptions {
  part: ExamPart;
  /**
   * Total number of questions in the simulated exam.
   * Defaults to the part's fullExamQuestions (usually 100).
   */
  totalQuestions?: number;
}

/**
 * Generate a SEE-like exam for the given part, honoring section weights
 * derived from the official study guides.
 */
export function generateExam({
  part,
  totalQuestions,
}: GenerateExamOptions): GeneratedExamQuestion[] {
  const meta = EXAM_METADATA[part];
  const requestedTotal = totalQuestions ?? meta.fullExamQuestions;

  // 1) Allocate questions per section according to weights
  const allocations = allocateSectionCounts(meta.sections, requestedTotal);

  // 2) Sample questions from each section pool
  const collected: GeneratedExamQuestion[] = [];

  for (const section of meta.sections) {
    const count = allocations[section.id] ?? 0;
    if (count <= 0) continue;

    const pool = getQuestionsByPartAndSection(part, section.id);
    if (!pool.length) continue;

    const sampled = sampleQuestions(pool, count).map((q) => ({
      ...q,
      sectionId: section.id,
      examOrder: 0, // will set later
    }));

    collected.push(...sampled);
  }

  // 3) Shuffle globally and trim to the requested total
  const shuffled = shuffleArray(collected).slice(0, requestedTotal);

  // 4) Assign examOrder
  return shuffled.map((q, idx) => ({
    ...q,
    examOrder: idx + 1,
  }));
}

function allocateSectionCounts(
  sections: { id: ExamSectionId; weight: number }[],
  total: number
): Record<ExamSectionId, number> {
  const result: Record<ExamSectionId, number> = {} as Record<
    ExamSectionId,
    number
  >;

  let remaining = total;

  sections.forEach((section, index) => {
    let count: number;

    if (index === sections.length - 1) {
      // Last section takes whatever remains (avoid rounding drift)
      count = remaining;
    } else {
      count = Math.max(1, Math.round(section.weight * total));
      remaining -= count;
    }

    result[section.id] = count;
  });

  return result;
}

function sampleQuestions(pool: Question[], count: number): Question[] {
  if (pool.length <= count) {
    return [...pool];
  }
  const shuffled = shuffleArray(pool);
  return shuffled.slice(0, count);
}

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
