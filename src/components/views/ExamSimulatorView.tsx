import React, { useCallback, useMemo, useState } from "react";
import {
  getQuestionsForPart,
  recordQuestionAttempt,
  type ExamPart,
  type Question,
  type QuestionOption,
} from "../../store/questionStore";
import { useCountdown } from "../../hooks/useCountdown";

type Stage = "SETUP" | "EXAM" | "REVIEW";

type ExamQuestionState = {
  questionId: string;
  selectedOptionId: string | null;
  isCorrect: boolean | null;
  flagged: boolean;
};

type ExamConfig = {
  part: ExamPart;
  questionCount: number;
  timeLimitMinutes: number;
};

const partLabelMap: Record<ExamPart, string> = {
  PART1_INDIVIDUALS: "Part 1 – Individuals",
  PART2_BUSINESS: "Part 2 – Businesses",
  PART3_REPRESENTATION: "Part 3 – Representation",
};

const partEmoji: Record<ExamPart, string> = {
  PART1_INDIVIDUALS: "🔵",
  PART2_BUSINESS: "🟢",
  PART3_REPRESENTATION: "🟪",
};

const presetQuestionCounts = [10, 20, 50, 100];
const presetTimeLimits = [
  { label: "15 min (quick block)", minutes: 15 },
  { label: "30 min", minutes: 30 },
  { label: "60 min", minutes: 60 },
  { label: "Full SEE (210 min)", minutes: 210 },
];

const ExamSimulatorView: React.FC = () => {
  const [stage, setStage] = useState<Stage>("SETUP");
  const [config, setConfig] = useState<ExamConfig>({
    part: "PART3_REPRESENTATION",
    questionCount: 20,
    timeLimitMinutes: 30,
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [states, setStates] = useState<ExamQuestionState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [examStartedAt, setExamStartedAt] = useState<string | null>(null);
  const [examEndsAt, setExamEndsAt] = useState<string | null>(null);
  const [examCompletedAt, setExamCompletedAt] = useState<string | null>(null);

  const examActive = stage === "EXAM";

  const handleTimerExpire = useCallback(() => {
    if (!examActive) return;
    finishExam();
  }, [examActive]); // eslint-disable-line react-hooks/exhaustive-deps

  const remainingSeconds = useCountdown(
    stage === "EXAM" ? examEndsAt : null,
    handleTimerExpire
  );

  const currentQuestion: Question | null = useMemo(() => {
    if (!questions.length) return null;
    if (currentIndex < 0 || currentIndex >= questions.length) return null;
    return questions[currentIndex];
  }, [questions, currentIndex]);

  const currentState: ExamQuestionState | null = useMemo(() => {
    if (!states.length) return null;
    if (currentIndex < 0 || currentIndex >= states.length) return null;
    return states[currentIndex];
  }, [states, currentIndex]);

  const answeredCount = useMemo(
    () => states.filter((s) => s.selectedOptionId !== null).length,
    [states]
  );
  const correctCount = useMemo(
    () => states.filter((s) => s.isCorrect === true).length,
    [states]
  );
  const accuracy = useMemo(
    () =>
      states.length > 0
        ? Math.round((correctCount / states.length) * 100)
        : 0,
    [correctCount, states.length]
  );

  const handleConfigChangePart = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const part = e.target.value as ExamPart;
    setConfig((prev) => ({ ...prev, part }));
  };

  const handleConfigChangeQuestions = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = Number(e.target.value) || 10;
    setConfig((prev) => ({ ...prev, questionCount: value }));
  };

  const handleConfigChangeTime = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = Number(e.target.value) || 30;
    setConfig((prev) => ({ ...prev, timeLimitMinutes: value }));
  };

  const startExam = async () => {
    // Load questions for selected part
    const pool = await getQuestionsForPart(config.part);
    if (!pool.length) {
      alert("No questions available for this part yet.");
      return;
    }

    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selectedCount = Math.min(config.questionCount, shuffled.length);
    const chosen = shuffled.slice(0, selectedCount);

    const initialStates: ExamQuestionState[] = chosen.map((q) => ({
      questionId: q.id,
      selectedOptionId: null,
      isCorrect: null,
      flagged: false,
    }));

    const now = new Date();
    const ends = new Date(
      now.getTime() + config.timeLimitMinutes * 60 * 1000
    );

    setQuestions(chosen);
    setStates(initialStates);
    setCurrentIndex(0);
    setExamStartedAt(now.toISOString());
    setExamEndsAt(ends.toISOString());
    setExamCompletedAt(null);
    setStage("EXAM");
  };

  const finishExam = () => {
    if (stage !== "EXAM") return;
    const nowIso = new Date().toISOString();
    setExamCompletedAt(nowIso);
    setStage("REVIEW");
  };

  const handleOptionClick = (opt: QuestionOption) => {
    if (!currentQuestion || !currentState) return;
    if (stage !== "EXAM") return;

    const isCorrect = opt.id === currentQuestion.correctOptionId;

    // Update local state
    setStates((prev) =>
      prev.map((s, idx) =>
        idx === currentIndex
          ? {
              ...s,
              selectedOptionId: opt.id,
              isCorrect,
            }
          : s
      )
    );

    // Record attempt into global attempt log for analytics
    recordQuestionAttempt({
      questionId: currentQuestion.id,
      part: currentQuestion.part,
      topicId: currentQuestion.topicId,
      subtopicId: currentQuestion.subtopicId,
      selectedOptionId: opt.id,
      isCorrect,
      timeSeconds: 0, // keeping it simple for now
      flagged: currentState.flagged,
    });
  };

  const handleToggleFlag = () => {
    if (!currentState) return;

    setStates((prev) =>
      prev.map((s, idx) =>
        idx === currentIndex ? { ...s, flagged: !s.flagged } : s
      )
    );
  };

  const goNext = () => {
    if (currentIndex < states.length - 1) {
      setCurrentIndex((idx) => idx + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((idx) => idx - 1);
    }
  };

  const goToQuestion = (index: number) => {
    if (index < 0 || index >= states.length) return;
    setCurrentIndex(index);
  };

  const formatTime = (seconds: number | null): string => {
    if (seconds === null) return "--:--";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  };

  // === RENDER ===

  if (stage === "SETUP") {
    return (
      <div className="card bg-base-200/60 border border-slate-800 shadow-xl">
        <div className="card-body p-4 md:p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="space-y-1">
              <h2 className="card-title text-base md:text-lg">
                ⏱ EA Exam Simulator
              </h2>
              <p className="text-xs md:text-sm text-slate-400">
                Configure a timed exam session that mimics the SEE: select an EA
                part, number of questions, and a time limit.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Part */}
            <label className="form-control w-full">
              <span className="label-text text-xs text-slate-300 mb-1">
                EA Part
              </span>
              <select
                className="select select-sm bg-slate-900 border-slate-700 text-xs md:text-sm"
                value={config.part}
                onChange={handleConfigChangePart}
              >
                <option value="PART1_INDIVIDUALS">Part 1 – Individuals</option>
                <option value="PART2_BUSINESS">Part 2 – Businesses</option>
                <option value="PART3_REPRESENTATION">
                  Part 3 – Representation
                </option>
              </select>
            </label>

            {/* Question count */}
            <label className="form-control w-full">
              <span className="label-text text-xs text-slate-300 mb-1">
                Number of questions
              </span>
              <select
                className="select select-sm bg-slate-900 border-slate-700 text-xs md:text-sm"
                value={config.questionCount}
                onChange={handleConfigChangeQuestions}
              >
                {presetQuestionCounts.map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </select>
            </label>

            {/* Time limit */}
            <label className="form-control w-full">
              <span className="label-text text-xs text-slate-300 mb-1">
                Time limit
              </span>
              <select
                className="select select-sm bg-slate-900 border-slate-700 text-xs md:text-sm"
                value={config.timeLimitMinutes}
                onChange={handleConfigChangeTime}
              >
                {presetTimeLimits.map((t) => (
                  <option key={t.minutes} value={t.minutes}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex justify-between items-center flex-wrap gap-2 mt-2">
            <p className="text-xs md:text-sm text-slate-400">
              {partEmoji[config.part]} {partLabelMap[config.part]} ·{" "}
              {config.questionCount} questions ·{" "}
              {config.timeLimitMinutes} minutes
            </p>
            <button
              type="button"
              className="btn btn-sm md:btn-md btn-primary"
              onClick={startExam}
            >
              Start Exam →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion || !currentState) {
    return (
      <div className="card bg-base-200/60 border border-red-800/60 shadow-xl">
        <div className="card-body p-4 md:p-5">
          <h2 className="card-title text-base md:text-lg text-red-200">
            Exam Error
          </h2>
          <p className="text-sm text-slate-200 mt-2">
            Something went wrong loading the exam. Try returning to setup and
            starting a new session.
          </p>
          <button
            type="button"
            className="btn btn-sm mt-3"
            onClick={() => setStage("SETUP")}
          >
            Back to Setup
          </button>
        </div>
      </div>
    );
  }

  const flaggedCount = states.filter((s) => s.flagged).length;

  if (stage === "EXAM") {
    return (
      <div className="card bg-base-200/60 border border-slate-800 shadow-xl">
        <div className="card-body p-4 md:p-5 space-y-4">
          {/* Top bar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="space-y-1">
              <h2 className="card-title text-base md:text-lg">
                ⏱ EA Exam Simulator
              </h2>
              <p className="text-xs md:text-sm text-slate-400">
                {partEmoji[config.part]} {partLabelMap[config.part]} ·{" "}
                Question {currentIndex + 1} of {states.length}
              </p>
            </div>

            <div className="flex flex-col items-stretch md:items-end gap-2">
              <div className="flex flex-wrap gap-2 justify-end text-xs md:text-sm">
                <span className="badge badge-outline border-slate-600 text-slate-300">
                  Time left: {formatTime(remainingSeconds)}
                </span>
                <span className="badge badge-outline border-slate-600 text-slate-300">
                  Answered: {answeredCount}/{states.length}
                </span>
                <span className="badge badge-outline border-slate-600 text-slate-300">
                  Flagged: {flaggedCount}
                </span>
              </div>
              <button
                type="button"
                className="btn btn-xs md:btn-sm btn-error btn-outline"
                onClick={finishExam}
              >
                Submit Exam
              </button>
            </div>
          </div>

          {/* Question area */}
          <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-3 md:p-4">
            <div className="text-[0.68rem] md:text-xs text-slate-400 mb-1 flex gap-2 flex-wrap">
              <span className="badge badge-xs border-slate-600 text-slate-300">
                {currentQuestion.topicId}
              </span>
              {currentQuestion.subtopicId && (
                <span className="badge badge-xs border-slate-600 text-slate-300">
                  {currentQuestion.subtopicId}
                </span>
              )}
              <span className="badge badge-xs border-slate-600 text-slate-300">
                Difficulty: {currentQuestion.difficulty.toLowerCase()}
              </span>
            </div>
            <p className="text-sm md:text-base text-slate-100 whitespace-pre-line">
              {currentQuestion.stem}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-2">
            {currentQuestion.options.map((opt) => {
              const isSelected = currentState.selectedOptionId === opt.id;

              let btnClass =
                "btn btn-sm md:btn-md w-full justify-start normal-case border border-slate-700 bg-slate-900/80";

              if (isSelected) {
                btnClass =
                  "btn btn-sm md:btn-md w-full justify-start normal-case border border-sky-400 bg-sky-900/40 text-sky-100";
              }

              return (
                <button
                  key={opt.id}
                  type="button"
                  className={btnClass}
                  onClick={() => handleOptionClick(opt)}
                >
                  <span className="font-semibold mr-2">{opt.label}.</span>
                  <span className="text-sm md:text-base">{opt.text}</span>
                </button>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={`btn btn-xs md:btn-sm ${
                  currentState.flagged
                    ? "btn-warning"
                    : "btn-outline btn-warning"
                }`}
                onClick={handleToggleFlag}
              >
                🚩 {currentState.flagged ? "Unflag" : "Flag"}
              </button>
            </div>
            <div className="flex flex-wrap gap-2 justify-end">
              <button
                type="button"
                className="btn btn-xs md:btn-sm btn-outline"
                onClick={goPrev}
                disabled={currentIndex === 0}
              >
                ← Previous
              </button>
              <button
                type="button"
                className="btn btn-xs md:btn-sm btn-outline"
                onClick={goNext}
                disabled={currentIndex === states.length - 1}
              >
                Next →
              </button>
            </div>
          </div>

          {/* Question navigator */}
          <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-3">
            <div className="text-[0.7rem] text-slate-400 mb-2">
              Question Navigator
            </div>
            <div className="flex flex-wrap gap-1">
              {states.map((s, idx) => {
                const answered = s.selectedOptionId !== null;
                const flagged = s.flagged;
                const isActive = idx === currentIndex;

                let btnClass =
                  "btn btn-xs border-slate-700 bg-slate-900 text-slate-200";

                if (answered) {
                  btnClass =
                    "btn btn-xs border-emerald-500 bg-emerald-900/40 text-emerald-100";
                }
                if (flagged) {
                  btnClass =
                    "btn btn-xs border-amber-500 bg-amber-900/40 text-amber-100";
                }
                if (isActive) {
                  btnClass =
                    "btn btn-xs border-sky-500 bg-sky-900/50 text-sky-100";
                }

                return (
                  <button
                    key={s.questionId}
                    type="button"
                    className={btnClass}
                    onClick={() => goToQuestion(idx)}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // REVIEW stage
  return (
    <div className="card bg-base-200/60 border border-slate-800 shadow-xl">
      <div className="card-body p-4 md:p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="space-y-1">
            <h2 className="card-title text-base md:text-lg">
              ✅ Exam Completed
            </h2>
            <p className="text-xs md:text-sm text-slate-400">
              {partEmoji[config.part]} {partLabelMap[config.part]} ·{" "}
              {states.length} questions
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs md:text-sm justify-end">
            <span className="badge badge-outline border-slate-600 text-slate-300">
              Answered: {answeredCount}/{states.length}
            </span>
            <span className="badge badge-outline border-slate-600 text-slate-300">
              Correct: {correctCount}
            </span>
            <span className="badge badge-outline border-slate-600 text-slate-300">
              Accuracy: {accuracy}%
            </span>
          </div>
        </div>

        {examStartedAt && examCompletedAt && (
          <p className="text-[0.7rem] md:text-xs text-slate-400">
            Started: {new Date(examStartedAt).toLocaleString()} · Finished:{" "}
            {new Date(examCompletedAt).toLocaleString()}
          </p>
        )}

        <div className="space-y-2">
          <h3 className="text-sm md:text-base font-semibold text-slate-100">
            Question breakdown
          </h3>
          <div className="overflow-x-auto">
            <table className="table table-xs md:table-sm">
              <thead>
                <tr className="text-[0.7rem] md:text-xs text-slate-400">
                  <th>#</th>
                  <th>Topic</th>
                  <th>Status</th>
                  <th>Flagged</th>
                </tr>
              </thead>
              <tbody>
                {states.map((s, idx) => {
                  const q = questions.find((qq) => qq.id === s.questionId);
                  const statusLabel =
                    s.selectedOptionId === null
                      ? "Not answered"
                      : s.isCorrect
                      ? "Correct"
                      : "Incorrect";

                  return (
                    <tr key={s.questionId}>
                      <td className="text-xs md:text-sm">{idx + 1}</td>
                      <td className="text-xs md:text-sm">
                        <div className="font-semibold text-slate-100">
                          {q?.topicId ?? "Unknown topic"}
                        </div>
                        {q?.subtopicId && (
                          <div className="text-[0.65rem] text-slate-400">
                            {q.subtopicId}
                          </div>
                        )}
                      </td>
                      <td className="text-xs md:text-sm">
                        {statusLabel}
                      </td>
                      <td className="text-xs md:text-sm">
                        {s.flagged ? "🚩" : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-between">
          <button
            type="button"
            className="btn btn-xs md:btn-sm btn-outline"
            onClick={() => setStage("SETUP")}
          >
            New Exam
          </button>
          <button
            type="button"
            className="btn btn-xs md:btn-sm btn-primary"
            onClick={() => setStage("EXAM")}
            disabled={!questions.length}
          >
            Review Questions (back)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamSimulatorView;
