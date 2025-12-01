import React from "react";

const CalendarView: React.FC = () => {
  const months = [
    {
      label: "Nov 2025",
      badge: "Start",
      phaseClass:
        "badge badge-sm border-purple-400 text-purple-100 bg-purple-500/10",
      phase: "🟪 Part 3 – Representation",
      text: "Nov 16–30: M1–M3 · Circular 230, penalties, IRS basics.",
    },
    {
      label: "Dec 2025",
      badge: "Part 3 core",
      phaseClass:
        "badge badge-sm border-purple-400 text-purple-100 bg-purple-500/10",
      phase: "🟪 Part 3 – Representation",
      text: "Audits, appeals, collections, OIC, authorizations. Finish all Part 3 modules + 2 practice exams.",
    },
    {
      label: "Jan 2026",
      badge: "Exam + Part 1 start",
      phase: "",
      phaseClass: "",
      text: "Early Jan: Part 3 exam. Mid-late Jan: start Part 1 (filing status, income, adjustments).",
    },
    {
      label: "Feb 2026",
      badge: "Part 1 core",
      phase: "🔵 Part 1 – Individuals",
      phaseClass:
        "badge badge-sm border-sky-400 text-sky-100 bg-sky-500/10",
      text: "Credits, capital gains, property, retirement, AMT. 1–2 practice exams by month’s end.",
    },
    {
      label: "Mar 2026",
      badge: "Part 1 exam & break",
      phase: "",
      phaseClass: "",
      text: "Mid-March: Part 1 exam. Late March: slide into light review / break.",
    },
    {
      label: "Apr 2026",
      badge: "Light review",
      phase: "☕ Low-intensity maintenance",
      phaseClass:
        "badge badge-sm border-amber-300 text-amber-100 bg-amber-400/10",
      text: "2–3 hrs/week: flashcards + mixed MCQs. Get ready for business tax.",
    },
    {
      label: "May 2026",
      badge: "Part 2 starts",
      phase: "🟢 Part 2 – Fundamentals",
      phaseClass:
        "badge badge-sm border-emerald-400 text-emerald-100 bg-emerald-500/10",
      text: "Entities, business income, key deductions (M1–M3).",
    },
    {
      label: "Jun 2026",
      badge: "Depreciation",
      phase: "🟢 Part 2 – Depreciation",
      phaseClass:
        "badge badge-sm border-emerald-400 text-emerald-100 bg-emerald-500/10",
      text: "MACRS, §179, bonus; 1 mini exam.",
    },
    {
      label: "Jul 2026",
      badge: "Partnerships",
      phase: "🟢 Part 2 – Partnerships",
      phaseClass:
        "badge badge-sm border-emerald-400 text-emerald-100 bg-emerald-500/10",
      text: "Basis, liabilities, distributions. Heavy MCQ focus.",
    },
    {
      label: "Aug 2026",
      badge: "S Corps & C Corps",
      phase: "🟢 Part 2 – S & C Corps",
      phaseClass:
        "badge badge-sm border-emerald-400 text-emerald-100 bg-emerald-500/10",
      text: "AAA, DRD, E&P, stock vs distribution rules.",
    },
    {
      label: "Sep 2026",
      badge: "Part 2 exam",
      phase: "",
      phaseClass: "",
      text: "Early Sept: final review, trusts & estates, payroll basics. Late Sept: Part 2 exam.",
    },
    {
      label: "Oct 2026",
      badge: "Buffer",
      phase: "🛟 Retake window / paperwork",
      phaseClass:
        "badge badge-sm border-amber-300 text-amber-100 bg-amber-400/10",
      text: "Use only if needed; otherwise start EA application process.",
    },
    {
      label: "Nov 2026",
      badge: "Finish line",
      phase: "",
      phaseClass: "",
      text: "Final retake buffer; ensure EA status is processed before Dec 31.",
    },
  ];

  return (
    <div className="card bg-base-200/60 border border-slate-800 shadow-xl">
      <div className="card-body p-4 md:p-5">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h2 className="card-title text-base md:text-lg">
            📅 Scenario B Calendar View
          </h2>
          <span className="badge badge-sm badge-outline border-slate-600 text-slate-300">
            Month-by-month overview
          </span>
        </div>
        <p className="text-xs md:text-sm text-slate-400 mb-3">
          Think of this as a Notion-style calendar in card form. It keeps each
          month’s focus crystal clear.
        </p>

        <div className="grid gap-3 md:grid-cols-2">
          {months.map((m) => (
            <div
              key={m.label}
              className="rounded-2xl border border-slate-700 bg-slate-900/70 p-3 shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold text-sm">{m.label}</div>
                <span className="badge badge-xs border-slate-500 text-slate-300 bg-slate-800/70">
                  {m.badge}
                </span>
              </div>
              {m.phase && (
                <div className="mt-2">
                  <span className={m.phaseClass}>{m.phase}</span>
                </div>
              )}
              <p className="mt-2 text-xs md:text-sm text-slate-300">
                {m.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
