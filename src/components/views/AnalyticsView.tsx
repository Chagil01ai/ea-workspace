import React, { useEffect, useState } from "react";
import type { ExamPart } from "../../store/questionStore";
import {
  getTopicAccuracyByPart,
  getWeakTopicsByPart,
  type TopicAccuracy,
} from "../../store/analyticsStore";

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

const AnalyticsView: React.FC = () => {
  const [selectedPart, setSelectedPart] =
    useState<ExamPart>("PART3_REPRESENTATION");
  const [topicStats, setTopicStats] = useState<TopicAccuracy[]>([]);
  const [weakTopics, setWeakTopics] = useState<TopicAccuracy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    (async () => {
      try {
        const stats = await getTopicAccuracyByPart(selectedPart);
        const weak = await getWeakTopicsByPart(selectedPart, {
          minAttempts: 3,
          maxAccuracyPercent: 70,
        });

        if (!isMounted) return;

        setTopicStats(stats);
        setWeakTopics(weak);
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

  const totalAttempts = topicStats.reduce(
    (sum, t) => sum + t.attempts,
    0
  );
  const totalCorrect = topicStats.reduce(
    (sum, t) => sum + t.correct,
    0
  );
  const overallAccuracy =
    totalAttempts > 0
      ? Math.round((totalCorrect / totalAttempts) * 100)
      : 0;

  const practicedTopics = topicStats.filter((t) => t.attempts > 0).length;

  const handlePartChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as ExamPart;
    setSelectedPart(value);
  };

  return (
    <div className="card bg-base-200/60 border border-slate-800 shadow-xl">
      <div className="card-body p-4 md:p-5 space-y-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="space-y-1">
            <h2 className="card-title text-base md:text-lg flex items-center gap-2">
              📈 EA Analytics – Weak Topics
            </h2>
            <p className="text-xs md:text-sm text-slate-400">
              Based on your MCQ attempts, see which areas are strong and which
              need more attention.
            </p>
          </div>

          <div className="flex flex-col items-stretch md:items-end gap-2">
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
                Total attempts: {totalAttempts}
              </span>
              <span className="badge badge-outline border-slate-500 text-slate-300">
                Overall accuracy: {overallAccuracy}%
              </span>
            </div>
          </div>
        </div>

        {/* Top-level summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-3">
            <div className="text-xs text-slate-400 mb-1">
              Topics practiced
            </div>
            <div className="text-xl font-semibold text-slate-50">
              {practicedTopics}{" "}
              <span className="text-xs text-slate-400">/ {topicStats.length}</span>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-3">
            <div className="text-xs text-slate-400 mb-1">
              Overall accuracy
            </div>
            <div className="text-xl font-semibold text-slate-50">
              {overallAccuracy}%
            </div>
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-3">
            <div className="text-xs text-slate-400 mb-1">
              Weak topics (≥3 attempts, ≤70% correct)
            </div>
            <div className="text-xl font-semibold text-slate-50">
              {weakTopics.length}
            </div>
          </div>
        </div>

        {/* Loading indicator */}
        {loading && (
          <p className="text-xs md:text-sm text-slate-400">
            Updating analytics…
          </p>
        )}

        {/* Weak topics list */}
        <div className="space-y-2">
          <h3 className="text-sm md:text-base font-semibold text-slate-100">
            🚨 Focus Areas
          </h3>
          {weakTopics.length === 0 ? (
            <p className="text-xs md:text-sm text-slate-400">
              No weak topics identified yet. Either you haven’t answered enough
              questions for this part, or your accuracy is above the threshold.
            </p>
          ) : (
            <div className="space-y-2">
              {weakTopics.map((t) => (
                <div
                  key={t.topicId}
                  className="rounded-xl border border-rose-700/70 bg-rose-900/20 p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="text-sm font-semibold text-rose-100">
                        {t.topicName}
                      </div>
                      <div className="text-[0.7rem] text-rose-200/80">
                        {t.topicId}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-rose-100">
                        {t.accuracyPercent}%
                      </div>
                      <div className="text-[0.7rem] text-rose-200/80">
                        {t.correct}/{t.attempts} correct
                      </div>
                    </div>
                  </div>
                  {t.lastAttemptAt && (
                    <div className="mt-1 text-[0.7rem] text-rose-200/70">
                      Last attempted:{" "}
                      {new Date(t.lastAttemptAt).toLocaleString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* All topics table */}
        <div className="space-y-2">
          <h3 className="text-sm md:text-base font-semibold text-slate-100">
            📚 Topic-by-topic breakdown
          </h3>

          <div className="overflow-x-auto">
            <table className="table table-xs md:table-sm">
              <thead>
                <tr className="text-[0.7rem] md:text-xs text-slate-400">
                  <th>Topic</th>
                  <th className="text-right">Attempts</th>
                  <th className="text-right">Correct</th>
                  <th className="text-right">Accuracy</th>
                  <th>Last Attempt</th>
                </tr>
              </thead>
              <tbody>
                {topicStats.map((t) => {
                  const isWeak = weakTopics.some(
                    (w) => w.topicId === t.topicId
                  );
                  return (
                    <tr
                      key={t.topicId}
                      className={isWeak ? "bg-rose-900/10" : ""}
                    >
                      <td className="text-xs md:text-sm">
                        <div className="font-semibold text-slate-100">
                          {t.topicName}
                        </div>
                        <div className="text-[0.65rem] text-slate-400">
                          {t.topicId}
                        </div>
                      </td>
                      <td className="text-right text-xs md:text-sm">
                        {t.attempts}
                      </td>
                      <td className="text-right text-xs md:text-sm">
                        {t.correct}
                      </td>
                      <td className="text-right text-xs md:text-sm">
                        {t.accuracyPercent}%
                      </td>
                      <td className="text-[0.65rem] text-slate-400">
                        {t.lastAttemptAt
                          ? new Date(t.lastAttemptAt).toLocaleString()
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
