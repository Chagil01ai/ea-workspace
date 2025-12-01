// src/components/views/FlashcardsView.tsx
import React, { useEffect, useMemo, useState } from "react";
import type { ExamPart } from "../../store/questionStore";
import {
  getAllFlashcards,
  getDueFlashcards,
  createFlashcard,
  reviewFlashcard,
} from "../../store/flashcardStore";
import type {
  Flashcard,
  FlashcardRating,
} from "../../domain/models/flashcard";

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

type PartFilter = "ALL" | ExamPart;

const FlashcardsView: React.FC = () => {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [partFilter, setPartFilter] = useState<PartFilter>("ALL");
  const [activeCard, setActiveCard] = useState<Flashcard | null>(null);
  const [showBack, setShowBack] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);

  // New card form
  const [newPart, setNewPart] = useState<ExamPart>("PART3_REPRESENTATION");
  const [newTopicId, setNewTopicId] = useState("P3-REPRESENTATION-BASICS");
  const [newFront, setNewFront] = useState("");
  const [newBack, setNewBack] = useState("");

  useEffect(() => {
    const all = getAllFlashcards();
    setCards(all);
  }, []);

  const today = useMemo(() => new Date(), []);
  const dueCardsAllParts = useMemo(
    () => getDueFlashcards(today),
    [today, cards.length]
  );

  const filteredCards = useMemo(() => {
    if (partFilter === "ALL") return cards;
    return cards.filter((c) => c.part === partFilter);
  }, [cards, partFilter]);

  const dueCardsFiltered = useMemo(() => {
    if (partFilter === "ALL") return dueCardsAllParts;
    return dueCardsAllParts.filter((c) => c.part === partFilter);
  }, [dueCardsAllParts, partFilter]);

  useEffect(() => {
    if (dueCardsFiltered.length > 0) {
      setActiveCard(dueCardsFiltered[0]);
      setShowBack(false);
    } else {
      setActiveCard(null);
      setShowBack(false);
    }
  }, [dueCardsFiltered]);

  const totalCards = cards.length;
  const totalDue = dueCardsFiltered.length;
  const totalNew = cards.filter((c) => !c.lastReviewedAt).length;
  const totalOverdue = dueCardsFiltered.filter((c) => {
    if (!c.dueDate) return false;
    const due = new Date(c.dueDate).getTime();
    return due < today.getTime();
  }).length;

  const handleChangePartFilter = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value as PartFilter;
    setPartFilter(value);
  };

  const handleShowAnswer = () => {
    if (!activeCard) return;
    setShowBack(true);
  };

  const handleRating = (rating: FlashcardRating) => {
    if (!activeCard) return;
    setIsReviewing(true);
    const now = new Date();

    const result = reviewFlashcard(activeCard.id, rating, now);
    if (!result) {
      setIsReviewing(false);
      return;
    }

    const updatedCards = getAllFlashcards();
    setCards(updatedCards);
    setShowBack(false);
    setIsReviewing(false);

    const updatedDue = getDueFlashcards(today);
    const filtered =
      partFilter === "ALL"
        ? updatedDue
        : updatedDue.filter((c) => c.part === partFilter);

    setActiveCard(filtered[0] ?? null);
  };

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFront.trim() || !newBack.trim()) {
      alert("Please fill in both front and back for the flashcard.");
      return;
    }

    createFlashcard({
      part: newPart,
      topicId: newTopicId.trim() || "GENERAL",
      front: newFront,
      back: newBack,
      tags: [],
    });

    const updated = getAllFlashcards();
    setCards(updated);

    setNewFront("");
    setNewBack("");

    if (!activeCard) {
      const updatedDue = getDueFlashcards(today);
      const filtered =
        partFilter === "ALL"
          ? updatedDue
          : updatedDue.filter((c) => c.part === partFilter);
      setActiveCard(filtered[0] ?? null);
    }
  };

  const formatDateShort = (iso?: string) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString();
  };

  return (
    <div className="card bg-base-200/60 border border-slate-800 shadow-xl">
      <div className="card-body p-4 md:p-5 space-y-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="space-y-1">
            <h2 className="card-title text-base md:text-lg flex items-center gap-2">
              🧠 EA Flashcards & Spaced Repetition
            </h2>
            <p className="text-xs md:text-sm text-slate-400">
              Turn tricky EA topics into spaced-repetition flashcards. Review
              what’s due today, then add new cards as you study.
            </p>
          </div>

          <div className="flex flex-col items-stretch md:items-end gap-2">
            <label className="form-control w-full md:w-auto">
              <div className="label">
                <span className="label-text text-xs text-slate-300">
                  Filter by EA Part
                </span>
              </div>
              <select
                className="select select-xs md:select-sm bg-slate-900 border-slate-700 text-xs md:text-sm"
                value={partFilter}
                onChange={handleChangePartFilter}
              >
                <option value="ALL">All parts</option>
                <option value="PART1_INDIVIDUALS">
                  Part 1 – Individuals
                </option>
                <option value="PART2_BUSINESS">
                  Part 2 – Businesses
                </option>
                <option value="PART3_REPRESENTATION">
                  Part 3 – Representation
                </option>
              </select>
            </label>

            <div className="flex flex-wrap gap-2 text-xs md:text-sm justify-end">
              <span className="badge badge-outline border-slate-600 text-slate-300">
                Total cards: {totalCards}
              </span>
              <span className="badge badge-outline border-slate-600 text-slate-300">
                Due now: {totalDue}
              </span>
              <span className="badge badge-outline border-slate-600 text-slate-300">
                New: {totalNew}
              </span>
              <span className="badge badge-outline border-slate-600 text-slate-300">
                Overdue: {totalOverdue}
              </span>
            </div>
          </div>
        </div>

        {/* Active review + new card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Review queue */}
          <div className="space-y-2">
            <h3 className="text-sm md:text-base font-semibold text-slate-100">
              🔁 Review queue
            </h3>

            {activeCard ? (
              <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs text-slate-400">
                    {partEmoji[activeCard.part]}{" "}
                    {partLabelMap[activeCard.part]}
                    <div className="text-[0.65rem] text-slate-500">
                      Topic: {activeCard.topicId}
                    </div>
                  </div>
                  <div className="text-xs text-slate-400">
                    Due: {formatDateShort(activeCard.dueDate)}
                  </div>
                </div>

                <div className="border border-slate-700 rounded-xl bg-slate-950/80 p-3">
                  {!showBack ? (
                    <>
                      <div className="text-[0.7rem] text-slate-400 mb-1">
                        Front
                      </div>
                      <div className="text-sm md:text-base text-slate-50 whitespace-pre-line">
                        {activeCard.front}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-[0.7rem] text-slate-400 mb-1">
                        Back
                      </div>
                      <div className="text-sm md:text-base text-slate-50 whitespace-pre-line">
                        {activeCard.back}
                      </div>
                    </>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 justify-between">
                  {!showBack ? (
                    <button
                      type="button"
                      className="btn btn-xs md:btn-sm btn-primary"
                      onClick={handleShowAnswer}
                    >
                      Show answer
                    </button>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="btn btn-xs md:btn-sm btn-error"
                        disabled={isReviewing}
                        onClick={() => handleRating("AGAIN")}
                      >
                        Again
                      </button>
                      <button
                        type="button"
                        className="btn btn-xs md:btn-sm btn-warning"
                        disabled={isReviewing}
                        onClick={() => handleRating("HARD")}
                      >
                        Hard
                      </button>
                      <button
                        type="button"
                        className="btn btn-xs md:btn-sm btn-success"
                        disabled={isReviewing}
                        onClick={() => handleRating("GOOD")}
                      >
                        Good
                      </button>
                      <button
                        type="button"
                        className="btn btn-xs md:btn-sm btn-accent"
                        disabled={isReviewing}
                        onClick={() => handleRating("EASY")}
                      >
                        Easy
                      </button>
                    </div>
                  )}

                  <span className="text-[0.7rem] text-slate-500 self-center">
                    {totalDue} card{totalDue === 1 ? "" : "s"} due in this
                    filter
                  </span>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4">
                <p className="text-xs md:text-sm text-slate-400">
                  No cards are currently due for review in this filter. Add new
                  cards below or switch to another part to keep reviewing.
                </p>
              </div>
            )}
          </div>

          {/* Add new flashcard */}
          <div className="space-y-2">
            <h3 className="text-sm md:text-base font-semibold text-slate-100">
              ✍️ Add a new flashcard
            </h3>
            <form
              className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4 space-y-3"
              onSubmit={handleCreateCard}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="form-control">
                  <div className="label">
                    <span className="label-text text-xs text-slate-300">
                      EA Part
                    </span>
                  </div>
                  <select
                    className="select select-xs md:select-sm bg-slate-950 border-slate-700 text-xs md:text-sm"
                    value={newPart}
                    onChange={(e) =>
                      setNewPart(e.target.value as ExamPart)
                    }
                  >
                    <option value="PART1_INDIVIDUALS">
                      Part 1 – Individuals
                    </option>
                    <option value="PART2_BUSINESS">
                      Part 2 – Businesses
                    </option>
                    <option value="PART3_REPRESENTATION">
                      Part 3 – Representation
                    </option>
                  </select>
                </label>

                <label className="form-control">
                  <div className="label">
                    <span className="label-text text-xs text-slate-300">
                      Topic ID (e.g. P3-REPRESENTATION-BASICS)
                    </span>
                  </div>
                  <input
                    type="text"
                    className="input input-xs md:input-sm bg-slate-950 border-slate-700 text-xs md:text-sm"
                    value={newTopicId}
                    onChange={(e) => setNewTopicId(e.target.value)}
                  />
                </label>
              </div>

              <label className="form-control">
                <div className="label">
                  <span className="label-text text-xs text-slate-300">
                    Front (prompt / question)
                  </span>
                </div>
                <textarea
                  className="textarea textarea-xs md:textarea-sm bg-slate-950 border-slate-700 text-xs md:text-sm min-h-[64px]"
                  value={newFront}
                  onChange={(e) => setNewFront(e.target.value)}
                  placeholder="e.g. List the basic requirements for a qualifying child."
                />
              </label>

              <label className="form-control">
                <div className="label">
                  <span className="label-text text-xs text-slate-300">
                    Back (answer / explanation)
                  </span>
                </div>
                <textarea
                  className="textarea textarea-xs md:textarea-sm bg-slate-950 border-slate-700 text-xs md:text-sm min-h-[80px]"
                  value={newBack}
                  onChange={(e) => setNewBack(e.target.value)}
                  placeholder="e.g. Relationship, age, residency, support, and joint return tests, plus tie-breaker rules."
                />
              </label>

              <div className="flex justify-between items-center gap-2">
                <button
                  type="submit"
                  className="btn btn-xs md:btn-sm btn-primary"
                >
                  Add card
                </button>
                <span className="text-[0.7rem] text-slate-500">
                  New cards start due today with initial ease factor of 2.5.
                </span>
              </div>
            </form>
          </div>
        </div>

        {/* All cards table */}
        <div className="space-y-2">
          <h3 className="text-sm md:text-base font-semibold text-slate-100">
            📚 All flashcards
          </h3>
          {filteredCards.length === 0 ? (
            <p className="text-xs md:text-sm text-slate-400">
              No flashcards yet for this filter. Create a few key concepts or
              rules you want to remember.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-xs md:table-sm">
                <thead>
                  <tr className="text-[0.7rem] md:text-xs text-slate-400">
                    <th>Part / Topic</th>
                    <th>Front</th>
                    <th>Back</th>
                    <th>Due</th>
                    <th>Last</th>
                    <th>Int (days)</th>
                    <th>EF</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCards.map((c) => (
                    <tr key={c.id}>
                      <td className="text-xs md:text-sm">
                        <div className="font-semibold text-slate-100">
                          {partEmoji[c.part]} {partLabelMap[c.part]}
                        </div>
                        <div className="text-[0.65rem] text-slate-400">
                          {c.topicId}
                        </div>
                      </td>
                      <td className="text-xs md:text-sm max-w-[220px] truncate">
                        {c.front}
                      </td>
                      <td className="text-xs md:text-sm max-w-[220px] truncate">
                        {c.back}
                      </td>
                      <td className="text-[0.7rem] text-slate-300">
                        {formatDateShort(c.dueDate)}
                      </td>
                      <td className="text-[0.7rem] text-slate-300">
                        {formatDateShort(c.lastReviewedAt)}
                      </td>
                      <td className="text-[0.7rem] text-slate-300 text-right">
                        {c.intervalDays ?? 0}
                      </td>
                      <td className="text-[0.7rem] text-slate-300 text-right">
                        {c.easeFactor?.toFixed(2) ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlashcardsView;
