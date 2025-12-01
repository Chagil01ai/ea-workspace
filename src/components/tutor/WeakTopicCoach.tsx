import React, { useState } from "react";
import type { ExamPart } from "../../store/questionStore";
import {
  getWeakTopicsByPart,
  type TopicAccuracy,
  type WeakTopicOptions,
} from "../../store/analyticsStore";

interface WeakTopicCoachProps {
  /**
   * Called when the component has built a good tutor prompt.
   * Typical usage in TutorView: onPromptReady(prompt => setInput(prompt)).
   */
  onPromptReady: (prompt: string) => void;
}

type LocalStatus = "IDLE" | "LOADING" | "READY" | "EMPTY" | "ERROR";

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

const DEFAULT_OPTIONS: WeakTopicOptions = {
  minAttempts: 3,
  maxAccuracyPercent: 75,
};

const WeakTopicCoach: React.FC<WeakTopicCoachProps> = ({ onPromptReady }) => {
  const [status, setStatus] = useState<LocalStatus>("IDLE");
  const [lastPart, setLastPart] = useState<ExamPart | null>(null);
  const [topics, setTopics] = useState<TopicAccuracy[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async (part: ExamPart) => {
    setStatus("LOADING");
    setError(null);
    setLastPart(part);

    try {
      const weak = await getWeakTopicsByPart(part, DEFAULT_OPTIONS);

      if (!weak.length) {
        setTopics([]);
        setStatus("EMPTY");

        const prompt = [
          "Please act as an EA exam tutor.",
          "I checked my MCQ analytics, but I don't yet have enough data to identify clear weak topics for this part.",
          `The part I'm working on is: ${partLabelMap[part]} (${part}).`,
          "",
          "Given that, please:",
          "1. Ask me 3–5 foundational questions that cover the most tested topics for this part.",
          "2. After each answer, briefly explain the correct answer and highlight common traps.",
          "3. Adjust the difficulty slightly upward if I’m consistently correct.",
        ].join("\n");

        onPromptReady(prompt);
        return;
      }

      setTopics(weak);
      setStatus("READY");

      const header = `My current weak EA topics (from my MCQ stats) for ${partLabelMap[part]} are:`;
      const bullets = weak.map(
        (t) =>
          `- ${t.topicName} (${t.topicId}): accuracy ${t.accuracyPercent}% over ${t.attempts} questions`
      );

      const promptLines: string[] = [
        "Please act as an EA exam tutor for me.",
        "",
        header,
        ...bullets,
        "",
        "Using only the topics above:",
        "1. Ask me one EA-style multiple-choice question at a time, focusing on the weak areas.",
        "2. Wait for my answer before revealing the correct answer.",
        "3. When you reveal the answer, explain:",
        "   - Why the correct choice is correct, and",
        "   - Why each incorrect choice is wrong.",
        "4. Occasionally include short scenario-based questions similar to the SEE exam style.",
        "5. Continue this until I say 'stop' or 'switch topics'.",
      ];

      const prompt = promptLines.join("\n");
      onPromptReady(prompt);
    } catch {
      setStatus("ERROR");
      setError("Unable to load weak topics. Try again after answering some MCQs.");
    }
  };

  const statusText = () => {
    if (!lastPart) {
      return "Click a part below to generate a targeted tutor prompt.";
    }

    if (status === "LOADING") {
      return `Analyzing weak topics for ${partLabelMap[lastPart]}…`;
    }
    if (status === "EMPTY") {
      return `Not enough data yet to identify weak topics for ${partLabelMap[lastPart]}. Try doing more MCQs first.`;
    }
    if (status === "ERROR") {
      return error ?? "There was a problem computing weak topics.";
    }
    if (status === "READY") {
      return `Weak topics loaded for ${partLabelMap[lastPart]}. A tutor prompt has been prepared in your chat input.`;
    }
    return "Click a part below to generate a targeted tutor prompt.";
  };

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-3 md:p-4 space-y-2">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h3 className="text-sm md:text-base font-semibold text-slate-100">
            🎯 Weak Topic Coach
          </h3>
          <p className="text-[0.7rem] md:text-xs text-slate-400">
            Use your MCQ analytics to generate a tutor prompt focused on your
            weakest EA topics. The prompt will be dropped into your chat input —
            you can tweak it and then hit send.
          </p>
        </div>
        <div className="flex flex-wrap gap-1 md:gap-2">
          <button
            type="button"
            className="btn btn-xs md:btn-sm btn-outline"
            onClick={() => handleClick("PART1_INDIVIDUALS")}
            disabled={status === "LOADING"}
          >
            {partEmoji.PART1_INDIVIDUALS} Part 1
          </button>
          <button
            type="button"
            className="btn btn-xs md:btn-sm btn-outline"
            onClick={() => handleClick("PART2_BUSINESS")}
            disabled={status === "LOADING"}
          >
            {partEmoji.PART2_BUSINESS} Part 2
          </button>
          <button
            type="button"
            className="btn btn-xs md:btn-sm btn-outline"
            onClick={() => handleClick("PART3_REPRESENTATION")}
            disabled={status === "LOADING"}
          >
            {partEmoji.PART3_REPRESENTATION} Part 3
          </button>
        </div>
      </div>

      <p className="text-[0.7rem] md:text-xs text-slate-400">{statusText()}</p>

      {status === "READY" && topics.length > 0 && (
        <div className="mt-1 space-y-1">
          <p className="text-[0.7rem] text-slate-400">
            Currently identified weak topics (≥{DEFAULT_OPTIONS.minAttempts} attempts,
            ≤{DEFAULT_OPTIONS.maxAccuracyPercent}% accuracy):
          </p>
          <ul className="text-[0.7rem] md:text-xs text-slate-300 list-disc list-inside space-y-0.5">
            {topics.map((t) => (
              <li key={t.topicId}>
                {t.topicName} ({t.topicId}): {t.accuracyPercent}% over{" "}
                {t.attempts} questions
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WeakTopicCoach;
