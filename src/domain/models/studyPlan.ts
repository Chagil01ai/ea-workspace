import type { ExamPart } from "./exam";
import type { TopicId } from "./topic";

export type StudyTaskType =
  | "READING"
  | "MCQ_PRACTICE"
  | "FLASHCARDS"
  | "MOCK_EXAM"
  | "REFERENCE_REVIEW"
  | "TUTOR_SESSION";

export type StudyTaskStatus = "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "SKIPPED";

export type StudyTask = {
  id: string;
  type: StudyTaskType;

  part: ExamPart | "MIXED";
  topicIds: TopicId[];

  plannedDate: string;         // date-only (YYYY-MM-DD)
  plannedMinutes?: number;

  // e.g. "25 MCQs", "100 flashcards"
  targetQuestionCount?: number;
  targetFlashcardCount?: number;

  status: StudyTaskStatus;

  actualMinutes?: number;
  completedAt?: string;        // ISO date

  notes?: string;
};

export type StudyWeek = {
  id: string;
  startDate: string;    // Monday of week
  endDate: string;      // Sunday of week

  taskIds: string[];
  reflectionNote?: string;
};
