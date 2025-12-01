import type { ExamPart } from "./exam";
import type { TopicId } from "./topic";

export type FlashcardSource =
  | "MANUAL"
  | "FROM_QUESTION"
  | "TUTOR_GENERATED";

export type FlashcardRating = "AGAIN" | "HARD" | "GOOD" | "EASY";

export type Flashcard = {
  id: string;
  part: ExamPart;
  topicId: TopicId;

  front: string;         // question / prompt
  back: string;          // answer / explanation
  tags: string[];

  source: FlashcardSource;
  linkedQuestionId?: string;

  createdAt: string;
  updatedAt?: string;

  // Spaced repetition scheduling fields (Anki-like)
  easeFactor: number;       // e.g. default 2.5
  intervalDays: number;     // days until next review
  dueDate: string;          // ISO date
  lastReviewedAt?: string;

  correctStreak: number;
  lapses: number;           // times failed after “learned”
};

export type FlashcardReview = {
  id: string;
  cardId: string;
  rating: FlashcardRating;
  reviewedAt: string;

  previousIntervalDays: number;
  newIntervalDays: number;
  previousEaseFactor: number;
  newEaseFactor: number;
};
