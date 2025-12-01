import type { ExamPart } from "./exam";

export type TopicId = string;

// Syllabus topic (ex: "Filing Status", "Depreciation", "Partnership Basis")
export type Topic = {
  id: TopicId;
  part: ExamPart;
  code: string;             // e.g. "P1-01", "P2-DPR-03"
  name: string;
  description?: string;

  parentId?: TopicId;       // for hierarchical topics
  order: number;            // ordering within part
  weightPercent?: number;   // approximate weight on exam
};

// Progress / mastery level for a topic
export type MasteryLevel = "NOT_STARTED" | "LEARNING" | "REVIEW" | "MASTERED";

export type TopicProgress = {
  topicId: TopicId;
  part: ExamPart;

  // content completion
  contentCompletionPercent: number;   // 0–100

  // performance-based metrics
  attempts: number;
  correct: number;

  masteryLevel: MasteryLevel;
  lastStudiedAt?: string;
};
