// Which EA part / exam segment a thing belongs to
export type ExamPart = "PART1_INDIVIDUALS" | "PART2_BUSINESS" | "PART3_REPRESENTATION";

export type ExamMode = "PRACTICE" | "MOCK" | "CUSTOM";

export type QuestionDifficulty = "EASY" | "MEDIUM" | "HARD";

export type QuestionSource =
  | "BUILT_IN"
  | "CUSTOM_USER"
  | "TUTOR_GENERATED"
  | "EXTERNAL_IMPORT";

export type QuestionTag = string;

// A question option (choice)
export type QuestionOption = {
  id: string;           // e.g. "A", "B", "C", "D" or uuid
  label: string;        // "A", "B", "C", "D"
  text: string;         // full answer text
  // we won't expose this to UI unless reviewing
  isCorrect: boolean;
};

// A single EA-style MCQ
export type Question = {
  id: string;
  part: ExamPart;
  topicId: string;         // links to syllabus topic
  subtopicId?: string;     // optional finer granularity

  stem: string;            // question text
  options: QuestionOption[];
  correctOptionId: string; // convenience field

  explanation?: string;    // why the answer is correct
  difficulty: QuestionDifficulty;
  source: QuestionSource;
  tags: QuestionTag[];

  createdAt: string;       // ISO date
  updatedAt?: string;

  // performance stats (aggregated from attempts)
  stats?: QuestionStats;
};

export type QuestionStats = {
  attempts: number;
  correct: number;
  avgTimeSeconds?: number;
  lastAttemptAt?: string;
};

// When user answers a question (practice or exam)
export type QuestionAttempt = {
  id: string;
  questionId: string;
  part: ExamPart;
  topicId: string;
  subtopicId?: string;

  selectedOptionId: string | null; // null if skipped
  isCorrect: boolean;
  timeSeconds: number;

  flagged: boolean; // user flagged to review later
  examSessionId?: string; // if part of an exam session

  attemptedAt: string; // ISO date
};

// A question inside an exam session
export type ExamSessionQuestion = {
  questionId: string;
  order: number;                 // position in exam
  attemptId?: string;            // link to attempt
  flagged: boolean;              // user flag
};

export type ExamSessionSettings = {
  mode: ExamMode;
  part: ExamPart | "MIXED";
  totalQuestions: number;
  timeLimitMinutes: number;      // e.g. 210 for real SEE
  allowReview: boolean;          // can move back & forth?
  showExplanationsImmediately: boolean;
};

export type ExamSessionStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "ABANDONED";

export type ExamSessionResultSummary = {
  totalQuestions: number;
  totalAnswered: number;
  totalCorrect: number;
  totalIncorrect: number;
  totalSkipped: number;

  // by topic accuracy
  accuracyByTopic: TopicAccuracy[];

  avgTimePerQuestionSeconds?: number;
  finishedWithinTime: boolean;

  // simple “readiness” estimate (0–100)
  readinessScore?: number;
};

export type TopicAccuracy = {
  topicId: string;
  attempts: number;
  correct: number;
};

export type ExamSession = {
  id: string;
  settings: ExamSessionSettings;
  status: ExamSessionStatus;

  startedAt?: string;
  endedAt?: string;

  questions: ExamSessionQuestion[];
  result?: ExamSessionResultSummary;
};
