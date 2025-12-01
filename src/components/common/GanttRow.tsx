import React from "react";

interface GanttRowProps {
  label: string;
  /** Tailwind gradient class, e.g. "from-purple-500 to-indigo-500" */
  className: string;
  /** 1–13 (grid column start) */
  start: number;
  /** 2–14 (grid column end, exclusive) */
  end: number;
  /** 0-based index for staggered animation delay */
  index: number;
}

const GanttRow: React.FC<GanttRowProps> = ({
  label,
  className,
  start,
  end,
  index,
}) => {
  const colClass = `col-start-${start} col-end-${end}`;
  const delayIndex = Math.min(index, 4); // cap at 4 for safety
  const delayClass = `gantt-delay-${delayIndex}`;

  return (
    <div className="grid grid-cols-[160px,repeat(13,1fr)] gap-1 items-center mb-1">
      <div className="text-right pr-2 text-[0.72rem] text-slate-400">
        {label}
      </div>

      <div className="col-span-13 grid grid-cols-13 gap-1 h-5">
        <div
          className={[
            "h-full rounded-full bg-gradient-to-r",
            className,
            "shadow-[0_0_0_1px_rgba(15,23,42,0.9),0_0_18px_rgba(56,189,248,0.6)]",
            "transition-all duration-500 ease-out",
            "animate-gantt-grow",
            delayClass,
            colClass,
          ].join(" ")}
        />
      </div>
    </div>
  );
};

export default GanttRow;
