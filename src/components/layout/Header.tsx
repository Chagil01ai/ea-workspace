import React from "react";

const Header: React.FC = () => (
  <header className="mb-4">
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl md:text-3xl font-semibold flex items-center gap-2">
          <span>📚 EA Prep Workspace</span>
          <span className="badge badge-outline badge-sm border-slate-500 text-slate-300">
            Scenario B · Part 3 → 1 → 2
          </span>
        </h1>
      </div>
      <p className="text-sm text-slate-400">
        Personal EA study HQ – mobile-friendly, with Gantt, calendar, Notion integration, and an AI tutor.
      </p>
    </div>
  </header>
);

export default Header;
