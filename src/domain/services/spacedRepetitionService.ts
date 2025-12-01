// src/domain/services/spacedRepetitionService.ts
import type {
  Flashcard,
  FlashcardRating,
} from "../models/flashcard";

export type FlashcardReviewResult = {
  updatedCard: Flashcard;
  log: {
    oldEaseFactor: number;
    newEaseFactor: number;
    oldIntervalDays: number;
    newIntervalDays: number;
    rating: FlashcardRating;
    reviewedAt: string;
  };
};

/**
 * Very simple SM-2–style spaced repetition update.
 * Not perfect, but good enough for a first pass.
 */
export function applyFlashcardReview(
  card: Flashcard,
  rating: FlashcardRating,
  today: Date
): FlashcardReviewResult {
  const reviewedAt = today.toISOString();

  const oldEase = card.easeFactor ?? 2.5;
  const oldInterval = card.intervalDays ?? 0;

  let newEase = oldEase;
  let newInterval = oldInterval;

  // Adjust ease factor based on rating
  switch (rating) {
    case "AGAIN":
      newEase = Math.max(1.3, oldEase - 0.3);
      newInterval = 1;
      break;
    case "HARD":
      newEase = Math.max(1.3, oldEase - 0.15);
      newInterval = Math.max(1, Math.round(oldInterval * 1.2));
      break;
    case "GOOD":
      newEase = oldEase;
      newInterval =
        oldInterval === 0 ? 1 : Math.round(oldInterval * newEase);
      break;
    case "EASY":
      newEase = oldEase + 0.1;
      newInterval =
        oldInterval === 0 ? 3 : Math.round(oldInterval * (newEase + 0.2));
      break;
    default:
      // safety default
      newInterval = Math.max(1, oldInterval || 1);
      break;
  }

  const updatedCard: Flashcard = {
    ...card,
    easeFactor: newEase,
    intervalDays: newInterval,
    dueDate: new Date(
      today.getTime() + newInterval * 24 * 60 * 60 * 1000
    ).toISOString(),
    lastReviewedAt: reviewedAt,
    correctStreak:
      rating === "AGAIN" ? 0 : (card.correctStreak ?? 0) + 1,
    lapses:
      rating === "AGAIN" ? (card.lapses ?? 0) + 1 : card.lapses ?? 0,
  };

  return {
    updatedCard,
    log: {
      oldEaseFactor: oldEase,
      newEaseFactor: newEase,
      oldIntervalDays: oldInterval,
      newIntervalDays: newInterval,
      rating,
      reviewedAt,
    },
  };
}
