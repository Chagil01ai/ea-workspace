import type { ExamPart } from "./exam";
import type { TopicId } from "./topic";

export type WeakTopicSummary = {
  topicId: TopicId;
  part: ExamPart;

  attempts: number;
  correct: number;
  accuracyPercent: number;      // 0–100

  avgTimeSeconds?: number;
  lastAttemptAt?: string;

  // high-level suggestions the engine/tutor can surface
  recommendedActions: string[];
};

export type UserReadiness = {
  part: ExamPart;
  // some combined score 0–100
  readinessScore: number;

  // simple segmentation: "FAR", "CLOSE", "READY"
  level: "FAR" | "CLOSE" | "READY";

  lastUpdatedAt: string;
};

export type UserMetrics = {
  lastUpdatedAt: string;
  readinessByPart: UserReadiness[];
  weakTopics: WeakTopicSummary[];
};
