// src/models/question.ts

// Which SEE part the question belongs to
export type ExamPart =
  | "PART1_INDIVIDUALS"
  | "PART2_BUSINESS"
  | "PART3_REPRESENTATION";

// Difficulty used for filtering / analytics
export type QuestionDifficulty = "EASY" | "MEDIUM" | "HARD";

// A single MCQ option (A, B, C, D)
export interface QuestionOption {
  /** Stable identifier, often "A", "B", "C", "D" */
  id: string;
  /** Label to display (usually same as id, but can differ) */
  label: string;
  /** Visible option text */
  text: string;
}

// A single EA-style MCQ
export interface Question {
  id: string;
  part: ExamPart;

  /**
   * Optional SEE section id (e.g. "P2_SEC2_BUSINESS_TAX_PREP").
   * Kept as string here to avoid circular imports with config.
   */
  sectionId?: string;

  /**
   * Your internal topic taxonomy, e.g.
   * "P2-ENTITIES-C-CORP-BASICS", "P1-CREDITS-CHILD-DEPENDENT", etc.
   */
  topicId: string;

  /** Optional finer-grained subtopic id */
  subtopicId?: string;

  difficulty: QuestionDifficulty;

  /** The question stem, can include line breaks */
  stem: string;

  /** All options (usually 4, but not required) */
  options: QuestionOption[];

  /** The id of the correct option (e.g. "A") */
  correctOptionId: string;

  /** Optional explanation shown after answering */
  explanation?: string;

  /**
   * Optional references to other resources, e.g. ["REF-PUB-17", "REF-CIRC-230"]
   * that you defined in referenceDocs.json.
   */
  referenceIds?: string[];
}

// A single recorded attempt at a question (for analytics)
export interface QuestionAttempt {
  id: string;
  questionId: string;
  part: ExamPart;

  /** Optional SEE section id (string, to match Question.sectionId) */
  sectionId?: string;

  topicId: string;
  subtopicId?: string;

  selectedOptionId: string;
  isCorrect: boolean;
  timeSeconds: number;
  flagged: boolean;

  /** ISO timestamp of when this attempt occurred */
  attemptedAt: string;
}