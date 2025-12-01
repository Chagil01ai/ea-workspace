import React from "react";
import type { ChecklistState } from "../../types/app";

interface DashboardProps {
  checklist: ChecklistState;
  toggleChecklistItem: (list: keyof ChecklistState, index: number) => void;
}

const DashboardView: React.FC<DashboardProps> = ({ checklist, toggleChecklistItem }) => (
  <>
    {/* Study Today */}
    <div className="card bg-base-200/60 border border-slate-800 shadow-xl">
      <div className="card-body p-4 md:p-5">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h2 className="card-title text-base md:text-lg flex items-center gap-2">
            🟪 Study Today
          </h2>
          <span className="badge badge-sm badge-outline border-slate-600 text-slate-300">
            Light but effective · ~60–90 min
          </span>
        </div>
        <p className="text-xs md:text-sm text-slate-400 mb-2">
          Use this daily checklist and let local storage remember your progress.
        </p>
        <ul className="space-y-1">
          {[
            "Review 5–10 flashcards (credits, basis, penalties).",
            "Replay yesterday’s incorrect MCQs in Becker (10–15 questions).",
            "Complete 20–30 MCQs from today’s module or weak topic.",
            "Watch your assigned Becker lecture segment (10–20 minutes).",
            "Add 2–3 flashcards for rules you missed today.",
            "Write down 1 “Keystone Rule” you want to remember long-term.",
          ].map((text, idx) => (
            <li className="flex items-start gap-2 text-xs md:text-sm" key={idx}>
              <input
                type="checkbox"
                className="checkbox checkbox-xs checkbox-primary mt-0.5"
                title={`Toggle daily checklist item: ${text}`}
                aria-label={`Toggle daily checklist item: ${text}`}
                checked={checklist.daily[idx]}
                onChange={() => toggleChecklistItem("daily", idx)}
              />
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>

    {/* This Week + Phase Overview */}
    <div className="grid md:grid-cols-2 gap-4">
      {/* This Week */}
      <div className="card bg-base-200/60 border border-slate-800 shadow-xl">
        <div className="card-body p-4 md:p-5">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h2 className="card-title text-base md:text-lg">📆 This Week</h2>
            <span className="badge badge-sm badge-outline border-slate-600 text-slate-300">
              Target · 8–12 hours
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mb-2">
            Scenario B: steady pace that fits around full-time consulting.
          </p>
          <ul className="space-y-1">
            {[
              "Complete 1–3 Becker modules for your current part.",
              "Finish 100–150 MCQs (Part 3) / 120–180 (Part 1) / 150–225 (Part 2).",
              "Run 1 short Becker quiz (10–20 mixed questions).",
              "Do a Saturday deep session (2.5–4 hours).",
              "Do a Sunday recap (20–30 MCQs & Keystone Rule review).",
            ].map((text, idx) => (
              <li className="flex items-start gap-2 text-xs md:text-sm" key={idx}>
                <input
                  type="checkbox"
                  className="checkbox checkbox-xs checkbox-accent mt-0.5"
                  title={`Toggle weekly checklist item: ${text}`}
                  aria-label={`Toggle weekly checklist item: ${text}`}
                  checked={checklist.weekly[idx]}
                  onChange={() => toggleChecklistItem("weekly", idx)}
                />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Phase Overview */}
      <div className="card bg-base-200/60 border border-slate-800 shadow-xl">
        <div className="card-body p-4 md:p-5">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h2 className="card-title text-base md:text-lg">🎯 Phase Overview</h2>
            <span className="badge badge-sm badge-outline border-slate-600 text-slate-300">
              Scenario B timeline
            </span>
          </div>
          <div className="flex flex-wrap gap-2 my-1">
            <span className="badge badge-outline border-purple-400 text-purple-200 text-[0.65rem]">
              Nov 16 2025 – Jan 15 2026 · Part 3
            </span>
            <span className="badge badge-outline border-sky-400 text-sky-200 text-[0.65rem]">
              Jan 16 2026 – Mar 15 2026 · Part 1
            </span>
            <span className="badge badge-outline border-slate-500 text-slate-300 text-[0.65rem]">
              Mar 16 2026 – Apr 30 2026 · Light Break
            </span>
            <span className="badge badge-outline border-emerald-400 text-emerald-200 text-[0.65rem]">
              May 1 2026 – Sept 30 2026 · Part 2
            </span>
            <span className="badge badge-outline border-amber-400 text-amber-200 text-[0.65rem]">
              Oct – Nov 2026 · Buffer / Retake
            </span>
          </div>
          <div className="divider my-2" />
          <p className="text-xs md:text-sm text-slate-400">
            Check-in: <span className="font-semibold">What phase am I in right now?</span>{" "}
            Only schedule modules and MCQs from that phase. Ignore the rest.
          </p>
        </div>
      </div>
    </div>

    {/* Progress Snapshot */}
    <div className="card bg-base-200/60 border border-slate-800 shadow-xl">
      <div className="card-body p-4 md:p-5">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h2 className="card-title text-base md:text-lg">📈 Progress Snapshot (Manual)</h2>
          <span className="badge badge-sm badge-outline border-slate-600 text-slate-300">
            Update weekly
          </span>
        </div>
        <p className="text-xs md:text-sm text-slate-400 mb-2">
          Quick panel for big rocks; keep granular tracking in Notion if you want.
        </p>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <ul className="space-y-1">
              {[
                "Part 3: All modules watched once.",
                "Part 3: 900+ MCQs completed.",
                "Part 1: All 13 modules watched one.",
                "Part 1: 1,200+ MCQs completed.",
              ].map((text, idx) => (
                <li className="flex items-start gap-2 text-xs md:text-sm" key={idx}>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-xs checkbox-info mt-0.5"
                    title={`Toggle progress left item: ${text}`}
                    aria-label={`Toggle progress left item: ${text}`}
                    checked={checklist.progressLeft[idx]}
                    onChange={() => toggleChecklistItem("progressLeft", idx)}
                  />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <ul className="space-y-1">
              {[
                "Start full-length practice exam.",
                "Identify weakest topics and schedule review.",
              ].map((text, idx) => (
                <li className="flex items-start gap-2 text-xs md:text-sm" key={idx}>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-xs checkbox-success mt-0.5"
                    title={`Toggle progress right item: ${text}`}
                    aria-label={`Toggle progress right item: ${text}`}
                    checked={checklist.progressRight[idx]}
                    onChange={() => toggleChecklistItem("progressRight", idx)}
                  />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
      </div>
    </div>
  </div>
  </div>
 </>

);

export default DashboardView;
