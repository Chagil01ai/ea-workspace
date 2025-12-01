import React, { useEffect, useMemo, useState } from "react";
import type {
  Question,
  QuestionOption,
  ExamPart,
  QuestionAttempt,
} from "../../store/questionStore";
import {
  getQuestionsForPart,
  recordQuestionAttempt,
  getAllAttempts,
} from "../../store/questionStore";

type GlobalAttemptsSummary = {
  total: number;
  correct: number;
  incorrect: number;
};

function getAttemptsSummaryForQuestions(
  questions: Question[],
  attempts: QuestionAttempt[]
): GlobalAttemptsSummary {
  if (questions.length === 0 || attempts.length === 0) {
    return { total: 0, correct: 0, incorrect: 0 };
  }

  const questionIds = new Set(questions.map((q) => q.id));

  let total = 0;
  let correct = 0;

  for (const attempt of attempts) {
    if (!questionIds.has(attempt.questionId)) continue;
    total += 1;
    if (attempt.isCorrect) correct += 1;
  }

  const incorrect = total - correct;

  return { total, correct, incorrect };
}

const partLabelMap: Record<ExamPart, string> = {
  PART1_INDIVIDUALS: "Part 1 – Individuals",
  PART2_BUSINESS: "Part 2 – Businesses",
  PART3_REPRESENTATION: "Part 3 – Representation",
};

const partBadgeEmoji: Record<ExamPart, string> = {
  PART1_INDIVIDUALS: "🔵",
  PART2_BUSINESS: "🟢",
  PART3_REPRESENTATION: "🟪",
};

const McqPracticeView: React.FC = () => {
  const [selectedPart, setSelectedPart] =
    useState<ExamPart>("PART3_REPRESENTATION");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load questions whenever selectedPart changes
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setShowExplanation(false);

    (async () => {
      try {
        const q = await getQuestionsForPart(selectedPart);
        if (!isMounted) return;

        setQuestions(q);
        setCurrentIndex(0);
        setQuestionStartTime(Date.now());
      } catch {
        if (isMounted) {
          setError("Failed to load questions.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [selectedPart]);

  const currentQuestion: Question | null = useMemo(() => {
    if (questions.length === 0) return null;
    if (currentIndex < 0 || currentIndex >= questions.length) return null;
    return questions[currentIndex];
  }, [questions, currentIndex]);

  const stats = useMemo(() => {
    if (questions.length === 0) {
      return { total: 0, correct: 0, incorrect: 0, accuracy: 0 };
    }

    // All attempts for this part, across sessions
    const allAttempts = getAllAttempts().filter(
      (a) => a.part === selectedPart
    );

    const summary = getAttemptsSummaryForQuestions(questions, allAttempts);
    const accuracy =
      summary.total > 0
        ? Math.round((summary.correct / summary.total) * 100)
        : 0;

    return {
      total: summary.total,
      correct: summary.correct,
      incorrect: summary.incorrect,
      accuracy,
    };
  }, [questions, selectedPart]);

  const handleOptionClick = (option: QuestionOption) => {
    if (!currentQuestion || showExplanation) return;

    const now = Date.now();
    const timeSeconds =
      questionStartTime != null
        ? Math.floor((now - questionStartTime) / 1000)
        : 0;
    const isCorrect = option.id === currentQuestion.correctOptionId;

    setSelectedOptionId(option.id);
    setShowExplanation(true);

    recordQuestionAttempt({
      questionId: currentQuestion.id,
      part: currentQuestion.part,
      topicId: currentQuestion.topicId,
      subtopicId: currentQuestion.subtopicId,
      selectedOptionId: option.id,
      isCorrect,
      timeSeconds,
      flagged: false,
    });
  };

  const handleNext = () => {
    if (!questions.length) return;

    const nextIndex = (currentIndex + 1) % questions.length;
    setCurrentIndex(nextIndex);
    setSelectedOptionId(null);
    setShowExplanation(false);
    setQuestionStartTime(Date.now());
  };

  const handleFlag = () => {
    alert("Flagging not yet persisted — future feature!");
  };

  const handlePartChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as ExamPart;
    setSelectedPart(value);
  };

  if (loading) {
    return (
      <div className="card bg-base-200/60 border border-slate-800 shadow-xl">
        <div className="card-body p-4 md:p-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="card-title text-base md:text-lg">
              🎯 EA MCQ Practice
            </h2>
            <span className="badge badge-outline border-slate-600 text-slate-300">
              Loading questions…
            </span>
          </div>
          <p className="text-sm text-slate-300">
            Loading {partLabelMap[selectedPart]} questions.
          </p>
        </div>
      </div>
    );
  }

  if (error || !currentQuestion) {
    return (
      <div className="card bg-base-200/60 border border-red-800/60 shadow-xl">
        <div className="card-body p-4 md:p-5 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="card-title text-base md:text-lg text-red-200">
              MCQ Practice Error
            </h2>
            <span className="badge badge-outline border-slate-600 text-slate-300">
              {partLabelMap[selectedPart]}
            </span>
          </div>
          <p className="text-sm text-slate-200 mt-1">
            {error ?? "No questions available for this part yet."}
          </p>
        </div>
      </div>
    );
  }

  const isCorrectSelection =
    selectedOptionId != null &&
    selectedOptionId === currentQuestion.correctOptionId;

  return (
    <div className="card bg-base-200/60 border border-slate-800 shadow-xl">
      <div className="card-body p-4 md:p-5 space-y-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="space-y-1">
            <h2 className="card-title text-base md:text-lg flex items-center gap-2">
              🎯 EA MCQ Practice
            </h2>
            <p className="text-xs md:text-sm text-slate-400">
              Drill exam-style questions by EA part. Perfect for targeted
              practice between tutor sessions.
            </p>
          </div>

          <div className="flex flex-col items-stretch md:items-end gap-2">
            {/* Part selector */}
            <label className="form-control w-full md:w-auto">
              <span className="label-text text-xs text-slate-300 mb-1">
                Select EA Part
              </span>
              <select
                className="select select-xs md:select-sm bg-slate-900 border-slate-700 text-xs md:text-sm"
                value={selectedPart}
                onChange={handlePartChange}
              >
                <option value="PART1_INDIVIDUALS">Part 1 – Individuals</option>
                <option value="PART2_BUSINESS">Part 2 – Businesses</option>
                <option value="PART3_REPRESENTATION">
                  Part 3 – Representation
                </option>
              </select>
            </label>

            <div className="flex flex-wrap gap-2 text-xs md:text-sm justify-end">
              <span className="badge badge-outline border-slate-600 text-slate-300">
                {partBadgeEmoji[selectedPart]} {partLabelMap[selectedPart]}
              </span>
              <span className="badge badge-outline border-slate-500 text-slate-300">
                Q {currentIndex + 1} / {questions.length}
              </span>
              <span className="badge badge-outline border-slate-500 text-slate-300">
                Answered: {stats.total} · Correct: {stats.correct} · Acc:{" "}
                {stats.accuracy}%
              </span>
            </div>
          </div>
        </div>

        {/* Question stem */}
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
            const isSelected = selectedOptionId === opt.id;
            const isCorrectOption =
              opt.id === currentQuestion.correctOptionId;

            let btnClass =
              "btn btn-sm md:btn-md w-full justify-start normal-case border border-slate-700 bg-slate-900/80";

            if (showExplanation) {
              if (isCorrectOption) {
                btnClass =
                  "btn btn-sm md:btn-md w-full justify-start normal-case border border-emerald-500 bg-emerald-900/40 text-emerald-100";
              } else if (isSelected && !isCorrectOption) {
                btnClass =
                  "btn btn-sm md:btn-md w-full justify-start normal-case border border-rose-500 bg-rose-900/40 text-rose-100";
              }
            } else if (isSelected) {
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

        {/* Feedback + explanation */}
        {showExplanation && (
          <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-3 space-y-2">
            <p className="text-sm md:text-base font-semibold">
              {isCorrectSelection ? "✅ Correct" : "❌ Not quite"}
            </p>
            <p className="text-xs md:text-sm text-slate-300 whitespace-pre-line">
              {currentQuestion.explanation ??
                "No explanation provided for this question yet."}
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-wrap gap-2 justify-between items-center">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-xs md:btn-sm btn-outline btn-warning"
              onClick={handleFlag}
            >
              🚩 Flag (future)
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-xs md:btn-sm btn-outline"
              onClick={() => {
                setSelectedOptionId(null);
                setShowExplanation(false);
                setQuestionStartTime(Date.now());
              }}
            >
              Reset
            </button>
            <button
              type="button"
              className="btn btn-xs md:btn-sm btn-primary"
              onClick={handleNext}
            >
              Next Question →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default McqPracticeView;
