import {
  getAllAttempts,
  setAllAttemptsForImport,
  type QuestionAttempt,
} from "./questionStore";
import {
  getAllFlashcards,
  replaceAllFlashcards,
} from "./flashcardStore";
import {
  getAllAnnotations,
  replaceAllAnnotations,
} from "./referenceStore";
import type { Flashcard } from "../domain/models/flashcard";
import type { ReferenceAnnotation } from "../domain/models/reference";

export type EaProfileSnapshot = {
  version: 1;
  exportedAt: string;
  attempts: QuestionAttempt[];
  flashcards: Flashcard[];
  annotations: ReferenceAnnotation[];
};

export function exportProfileSnapshot(): EaProfileSnapshot {
  const nowIso = new Date().toISOString();
  const attempts = getAllAttempts();
  const flashcards = getAllFlashcards();
  const annotations = getAllAnnotations();

  return {
    version: 1,
    exportedAt: nowIso,
    attempts,
    flashcards,
    annotations,
  };
}

type ImportMode = "merge" | "replace";

export function importProfileSnapshot(
  snapshot: EaProfileSnapshot,
  mode: ImportMode = "merge"
): void {
  if (!snapshot || snapshot.version !== 1) {
    throw new Error("Unsupported or missing profile snapshot version.");
  }

  // --- Attempts ---
  const existingAttempts = getAllAttempts();
  let newAttempts: QuestionAttempt[];

  if (mode === "replace") {
    newAttempts = snapshot.attempts ?? [];
  } else {
    const byId = new Map<string, QuestionAttempt>();
    for (const a of existingAttempts) byId.set(a.id, a);
    for (const a of snapshot.attempts ?? []) byId.set(a.id, a);
    newAttempts = Array.from(byId.values());
  }
  setAllAttemptsForImport(newAttempts);

  // --- Flashcards ---
  const existingCards = getAllFlashcards();
  let newCards: Flashcard[];
  if (mode === "replace") {
    newCards = snapshot.flashcards ?? [];
  } else {
    const byId = new Map<string, Flashcard>();
    for (const c of existingCards) byId.set(c.id, c);
    for (const c of snapshot.flashcards ?? []) byId.set(c.id, c);
    newCards = Array.from(byId.values());
  }
  replaceAllFlashcards(newCards);

  // --- Annotations ---
  const existingAnnotations = getAllAnnotations();
  let newAnnotations: ReferenceAnnotation[];
  if (mode === "replace") {
    newAnnotations = snapshot.annotations ?? [];
  } else {
    const byId = new Map<string, ReferenceAnnotation>();
    for (const a of existingAnnotations) byId.set(a.id, a);
    for (const a of snapshot.annotations ?? []) byId.set(a.id, a);
    newAnnotations = Array.from(byId.values());
  }
  replaceAllAnnotations(newAnnotations);
}
