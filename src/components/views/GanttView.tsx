import React from "react";
import GanttRow from "../common/GanttRow";

const GanttView: React.FC = () => {
  return (
    <div className="card bg-base-200/60 border border-slate-800 shadow-xl">
      <div className="card-body p-4 md:p-5">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h2 className="card-title text-base md:text-lg">
            📊 Scenario B Gantt Timeline
          </h2>
          <span className="badge badge-sm badge-outline border-slate-600 text-slate-300">
            Nov 2025 – Nov 2026
          </span>
        </div>
        <p className="text-xs md:text-sm text-slate-400 mb-3">
          A high-level bar view of your EA prep phases across Scenario B.
        </p>

        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            {/* Header */}
            <div className="grid grid-cols-[160px,repeat(13,1fr)] gap-1 text-[0.65rem] text-slate-400 mb-2">
              <div></div>
              <div className="text-center">Nov 25</div>
              <div className="text-center">Dec 25</div>
              <div className="text-center">Jan 26</div>
              <div className="text-center">Feb 26</div>
              <div className="text-center">Mar 26</div>
              <div className="text-center">Apr 26</div>
              <div className="text-center">May 26</div>
              <div className="text-center">Jun 26</div>
              <div className="text-center">Jul 26</div>
              <div className="text-center">Aug 26</div>
              <div className="text-center">Sep 26</div>
              <div className="text-center">Oct 26</div>
              <div className="text-center">Nov 26</div>
            </div>

            <GanttRow
              index={0}
              label="🟪 Part 3 – Representation"
              className="from-purple-500 to-indigo-500"
              start={1}
              end={4}
            />
            <GanttRow
              index={1}
              label="🔵 Part 1 – Individuals"
              className="from-sky-500 to-blue-500"
              start={3}
              end={6}
            />
            <GanttRow
              index={2}
              label="☕ Break / Light Review"
              className="from-amber-300 to-amber-500"
              start={5}
              end={7}
            />
            <GanttRow
              index={3}
              label="🟢 Part 2 – Business"
              className="from-emerald-400 to-teal-400"
              start={7}
              end={12}
            />
            <GanttRow
              index={4}
              label="🛟 Buffer / Retake Window"
              className="from-orange-300 to-amber-400"
              start={12}
              end={14}
            />
          </div>
        </div>

        <div className="divider my-3" />
        <p className="text-xs md:text-sm text-slate-400">
          Purple = representation, Blue = individual tax, Green = business tax,
          Gold = lighter / buffer periods.
        </p>
      </div>
    </div>
  );
};

export default GanttView;
