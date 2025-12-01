// src/store/flashcardStore.ts
import type { ExamPart } from "./questionStore";
import type {
  Flashcard,
  FlashcardRating,
} from "../domain/models/flashcard";
import {
  applyFlashcardReview,
  type FlashcardReviewResult,
} from "../domain/services/spacedRepetitionService";

const STORAGE_KEY = "eaFlashcards_v1";

function loadFlashcardsRaw(): Flashcard[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Flashcard[];
  } catch {
    return [];
  }
}

function saveFlashcardsRaw(cards: Flashcard[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  } catch {
    // ignore
  }
}

export function getAllFlashcards(): Flashcard[] {
  return loadFlashcardsRaw();
}

export function upsertFlashcard(card: Flashcard): Flashcard[] {
  const cards = loadFlashcardsRaw();
  const idx = cards.findIndex((c) => c.id === card.id);
  if (idx === -1) {
    cards.push(card);
  } else {
    cards[idx] = card;
  }
  saveFlashcardsRaw(cards);
  return cards;
}

export function createFlashcard(params: {
  part: ExamPart;
  topicId: string;
  front: string;
  back: string;
  tags?: string[];
  linkedQuestionId?: string;
}): Flashcard {
  const now = new Date();
  const isoNow = now.toISOString();

  const card: Flashcard = {
    id: crypto.randomUUID(),
    part: params.part,
    topicId: params.topicId,
    front: params.front.trim(),
    back: params.back.trim(),
    tags: params.tags ?? [],
    source: params.linkedQuestionId ? "FROM_QUESTION" : "MANUAL",
    linkedQuestionId: params.linkedQuestionId,

    createdAt: isoNow,
    updatedAt: isoNow,

    easeFactor: 2.5,
    intervalDays: 0,
    dueDate: isoNow,
    lastReviewedAt: undefined,
    correctStreak: 0,
    lapses: 0,
  };

  const cards = loadFlashcardsRaw();
  cards.push(card);
  saveFlashcardsRaw(cards);

  return card;
}

export function getDueFlashcards(today: Date): Flashcard[] {
  const cards = loadFlashcardsRaw();
  const todayMidnight = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  ).getTime();

  return cards.filter((card) => {
    if (!card.dueDate) return true;
    const dueTime = new Date(card.dueDate).getTime();
    return dueTime <= todayMidnight;
  });
}

export function reviewFlashcard(
  cardId: string,
  rating: FlashcardRating,
  today: Date
): FlashcardReviewResult | null {
  const cards = loadFlashcardsRaw();
  const idx = cards.findIndex((c) => c.id === cardId);
  if (idx === -1) return null;

  const card = cards[idx];
  const result = applyFlashcardReview(card, rating, today);

  cards[idx] = result.updatedCard;
  saveFlashcardsRaw(cards);

  return result;
}

export function replaceAllFlashcards(cards: Flashcard[]): void {
  saveFlashcardsRaw(cards);
}
