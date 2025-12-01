// src/components/views/ReferenceLibraryView.tsx
import React, { useEffect, useMemo, useState } from "react";
import type { ExamPart } from "../../store/questionStore";
import {
  getReferenceDocsByPart,
  searchReferenceDocs,
  getAnnotationsForDoc,
  addAnnotation,
  deleteAnnotation,
} from "../../store/referenceStore";
import type {
  ReferenceDoc,
  ReferenceAnnotation,
} from "../../domain/models/reference";

type PartFilter = "ALL" | ExamPart;

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

const ReferenceLibraryView: React.FC = () => {
  const [partFilter, setPartFilter] = useState<PartFilter>("ALL");
  const [query, setQuery] = useState("");
  const [docs, setDocs] = useState<ReferenceDoc[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [annotations, setAnnotations] = useState<ReferenceAnnotation[]>([]);

  const [newNoteText, setNewNoteText] = useState("");

  useEffect(() => {
    const initialDocs = getReferenceDocsByPart(partFilter);
    setDocs(initialDocs);
  }, [partFilter]);

  useEffect(() => {
    if (!selectedDocId) {
      setAnnotations([]);
      return;
    }
    const ann = getAnnotationsForDoc(selectedDocId);
    setAnnotations(ann);
  }, [selectedDocId]);

  const filteredDocs = useMemo(() => {
    if (!query.trim()) return docs;
    return searchReferenceDocs(query, partFilter === "ALL" ? "ALL" : partFilter);
  }, [docs, query, partFilter]);

  const handlePartChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as PartFilter;
    setPartFilter(value);
    setSelectedDocId(null);
    setQuery("");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSelectDoc = (docId: string) => {
    setSelectedDocId(docId);
  };

  const selectedDoc = useMemo(
    () => filteredDocs.find((d) => d.id === selectedDocId) ?? filteredDocs[0],
    [filteredDocs, selectedDocId]
  );

  useEffect(() => {
    if (!selectedDoc) {
      setAnnotations([]);
      return;
    }
    const ann = getAnnotationsForDoc(selectedDoc.id);
    setAnnotations(ann);
    setSelectedDocId(selectedDoc.id);
  }, [selectedDoc?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoc) return;
    if (!newNoteText.trim()) return;

    addAnnotation({
      docId: selectedDoc.id,
      note: newNoteText,
      tags: [],
      linkedTopicIds: selectedDoc.topicIds ?? [],
    });

    const ann = getAnnotationsForDoc(selectedDoc.id);
    setAnnotations(ann);
    setNewNoteText("");
  };

  const handleDeleteNote = (id: string) => {
    deleteAnnotation(id);
    if (!selectedDoc) return;
    const ann = getAnnotationsForDoc(selectedDoc.id);
    setAnnotations(ann);
  };

  const formatDateTimeShort = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString();
  };

  const totalDocs = filteredDocs.length;

  return (
    <div className="card bg-base-200/60 border border-slate-800 shadow-xl">
      <div className="card-body p-4 md:p-5 space-y-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="space-y-1">
            <h2 className="card-title text-base md:text-lg">
              📚 EA Reference Library
            </h2>
            <p className="text-xs md:text-sm text-slate-400">
              Quick access to key IRS forms, publications, and Circular 230,
              organized by EA exam part. Attach your own study notes so each
              document becomes an active learning tool.
            </p>
          </div>

          <div className="flex flex-col items-stretch md:items-end gap-2">
            <label className="form-control w-full md:w-auto">
              <span className="label-text text-xs text-slate-300 mb-1">
                Filter by EA Part
              </span>
              <select
                className="select select-xs md:select-sm bg-slate-900 border-slate-700 text-xs md:text-sm"
                value={partFilter}
                onChange={handlePartChange}
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
                Docs: {totalDocs}
              </span>
            </div>
          </div>
        </div>

        {/* Search + Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left: Docs list */}
          <div className="space-y-2 lg:col-span-1">
            <label className="form-control">
              <span className="label-text text-xs text-slate-300 mb-1">
                Search documents
              </span>
              <input
                type="search"
                className="input input-xs md:input-sm bg-slate-900 border-slate-700 text-xs md:text-sm"
                placeholder="e.g. Circular 230, Pub 17, travel expenses"
                value={query}
                onChange={handleSearchChange}
              />
            </label>

            <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-2 max-h-[320px] overflow-y-auto">
              {filteredDocs.length === 0 ? (
                <p className="text-xs md:text-sm text-slate-400 p-2">
                  No documents match your search and filter. Try clearing your
                  search query or switching parts.
                </p>
              ) : (
                <ul className="menu menu-xs md:menu-sm">
                  {filteredDocs.map((doc) => {
                    const isActive = selectedDoc?.id === doc.id;
                    const part = doc.parts[0] as ExamPart | undefined;
                    return (
                      <li key={doc.id}>
                        <button
                          type="button"
                          className={
                            isActive
                              ? "bg-slate-800/90 text-slate-50 rounded-lg"
                              : "rounded-lg"
                          }
                          onClick={() => handleSelectDoc(doc.id)}
                        >
                          <div className="flex flex-col items-start">
                            <span className="text-xs md:text-sm font-semibold">
                              {doc.refCode
                                ? `${doc.refCode} – ${doc.title}`
                                : doc.title}
                            </span>
                            <span className="text-[0.65rem] text-slate-400">
                              {part
                                ? `${partEmoji[part]} ${
                                    partLabelMap[part]
                                  }`
                                : ""}
                            </span>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          {/* Right: Details + Notes */}
          <div className="space-y-3 lg:col-span-2">
            {selectedDoc ? (
              <>
                {/* Doc details */}
                <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4 space-y-2">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <div className="text-sm md:text-base font-semibold text-slate-50">
                        {selectedDoc.refCode
                          ? `${selectedDoc.refCode} – ${selectedDoc.title}`
                          : selectedDoc.title}
                      </div>
                      <div className="text-xs text-slate-400">
                        {selectedDoc.type === "FORM" ? "Form" : "Publication"}
                      </div>
                    </div>
                    {selectedDoc.url && (
                      <a
                        href={selectedDoc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-xs md:btn-sm btn-primary"
                      >
                        Open on IRS site
                      </a>
                    )}
                  </div>
                  {selectedDoc.description && (
                    <p className="text-xs md:text-sm text-slate-300 mt-1">
                      {selectedDoc.description}
                    </p>
                  )}
                  {selectedDoc.topicIds && selectedDoc.topicIds.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {selectedDoc.topicIds.map((tid) => (
                        <span
                          key={tid}
                          className="badge badge-outline border-slate-600 text-[0.65rem] text-slate-300"
                        >
                          {tid}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Notes section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Add note */}
                  <form
                    className="rounded-2xl border border-slate-700 bg-slate-900/80 p-3 space-y-2"
                    onSubmit={handleAddNote}
                  >
                    <h3 className="text-sm md:text-base font-semibold text-slate-100">
                      📝 Add a note
                    </h3>
                    <p className="text-[0.7rem] md:text-xs text-slate-400">
                      Use this space to summarize key rules, highlight EA exam
                      angles, or note Becker module tie-ins.
                    </p>
                    <label className="form-control">
                      <span className="label-text sr-only">
                        Note text
                      </span>
                      <textarea
                        className="textarea textarea-xs md:textarea-sm bg-slate-950 border-slate-700 text-xs md:text-sm min-h-[80px]"
                        value={newNoteText}
                        onChange={(e) => setNewNoteText(e.target.value)}
                        placeholder="Example: In Circular 230, focus on conflicts of interest rules, written consent requirements, and standards for advising clients about penalties."
                      />
                    </label>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="btn btn-xs md:btn-sm btn-primary"
                        disabled={!newNoteText.trim()}
                      >
                        Save note
                      </button>
                    </div>
                  </form>

                  {/* Existing notes */}
                  <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-3 space-y-2">
                    <h3 className="text-sm md:text-base font-semibold text-slate-100">
                      📌 Your notes
                    </h3>
                    {annotations.length === 0 ? (
                      <p className="text-xs md:text-sm text-slate-400">
                        No notes yet for this document. Add a few key ideas or
                        exam reminders, and this section will turn into your
                        personalized mini-outline.
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-[220px] overflow-y-auto">
                        {annotations.map((a) => (
                          <div
                            key={a.id}
                            className="rounded-xl border border-slate-700 bg-slate-950/80 p-2"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[0.65rem] text-slate-500">
                                {formatDateTimeShort(a.updatedAt ?? a.createdAt)}
                              </span>
                              <button
                                type="button"
                                className="btn btn-ghost btn-xs text-[0.65rem] text-slate-400 hover:text-rose-300"
                                onClick={() => handleDeleteNote(a.id)}
                              >
                                Delete
                              </button>
                            </div>
                            <p className="text-xs md:text-sm text-slate-100 whitespace-pre-line">
                              {a.note}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4">
                <p className="text-xs md:text-sm text-slate-400">
                  Select a document from the left to view its details and add
                  notes.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferenceLibraryView;
