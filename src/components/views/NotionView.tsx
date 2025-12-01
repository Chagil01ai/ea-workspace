import React from "react";

const NotionView: React.FC = () => {
  return (
    <div className="card bg-base-200/60 border border-slate-800 shadow-xl">
      <div className="card-body p-4 md:p-5 space-y-3">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h2 className="card-title text-base md:text-lg">
            ⚙️ Notion Automation Guide
          </h2>
          <span className="badge badge-sm badge-outline border-slate-600 text-slate-300">
            For your EA Notion workspace
          </span>
        </div>
        <p className="text-xs md:text-sm text-slate-400">
          Use these patterns to make your Notion EA workspace behave more like
          an app: templates, formulas, reminders, and spaced repetition.
        </p>

        {/* 1. Weekly templates */}
        <div className="collapse collapse-arrow bg-slate-900/70 border border-slate-700">
          <input
            type="checkbox"
            defaultChecked
            aria-label="Toggle weekly templates section"
          />
          <div className="collapse-title text-sm font-medium">
            1️⃣ Recurring weekly pages (templates)
          </div>
          <div className="collapse-content text-xs md:text-sm text-slate-300 space-y-2">
            <ul className="list-disc list-inside space-y-1">
              <li>
                Create a database <strong>“Weeks”</strong> with properties:{" "}
                <code>Week Name</code> (Title), <code>Start</code> (Date),{" "}
                <code>End</code> (Date), <code>Part</code> (Select).
              </li>
              <li>
                In one entry, add weekly checklist blocks (matching this
                app’s “This Week” section).
              </li>
              <li>
                Turn that entry into a <strong>template</strong> called{" "}
                <em>“Standard EA Study Week”</em>.
              </li>
              <li>
                Each Sunday, use <strong>+ New → Standard EA Study Week</strong>{" "}
                to spawn a fresh week with everything preloaded.
              </li>
            </ul>
          </div>
        </div>

        {/* 2. Auto-progress */}
        <div className="collapse collapse-arrow bg-slate-900/70 border border-slate-700">
          <input
            type="checkbox"
            aria-label="Toggle auto-progress section"
          />
          <div className="collapse-title text-sm font-medium">
            2️⃣ Auto-progress in your Modules database (formula)
          </div>
          <div className="collapse-content text-xs md:text-sm text-slate-300 space-y-2">
            <p>
              In your <strong>Modules</strong> DB, add:
              <code className="ml-1">
                Video Progress, Reading Progress, MCQs Completed, MCQ Goal,
                Completion %
              </code>
            </p>
            <p>Use this formula in <code>Completion %</code>:</p>
            <pre className="bg-slate-950/80 border border-slate-700 rounded-lg p-2 text-xs overflow-x-auto">
{`if(
  round(
    (
      (if(prop("Video Progress") == "Watched", 1, if(prop("Video Progress") == "Half", 0.5, 0))) +
      (if(prop("Reading Progress") == "Complete", 1, if(prop("Reading Progress") == "Skimmed", 0.5, 0))) +
      (if(prop("MCQ Goal") == 0, 0, prop("MCQs Completed") / prop("MCQ Goal")))
    ) / 3 * 100
  ) > 100,
  100,
  round(
    (
      (if(prop("Video Progress") == "Watched", 1, if(prop("Video Progress") == "Half", 0.5, 0))) +
      (if(prop("Reading Progress") == "Complete", 1, if(prop("Reading Progress") == "Skimmed", 0.5, 0))) +
      (if(prop("MCQ Goal") == 0, 0, prop("MCQs Completed") / prop("MCQ Goal")))
    ) / 3 * 100
  )
)`}
            </pre>
            <p>
              This gives you a 0–100% sense of how complete each module is,
              blending video, reading, and MCQs.
            </p>
          </div>
        </div>

        {/* 3. Reminders */}
        <div className="collapse collapse-arrow bg-slate-900/70 border border-slate-700">
          <input
            type="checkbox"
            aria-label="Toggle reminders automation section"
          />
          <div className="collapse-title text-sm font-medium">
            3️⃣ Reminders via Zapier/Make + Notion
          </div>
          <div className="collapse-content text-xs md:text-sm text-slate-300 space-y-2">
            <ul className="list-disc list-inside space-y-1">
              <li>
                Add a <code>Next Review</code> date property to your Weeks or
                Modules DB.
              </li>
              <li>
                Use <strong>Zapier</strong> or <strong>Make</strong>:
                <ul className="list-disc list-inside ml-4">
                  <li>Trigger: database item where Next Review = today.</li>
                  <li>
                    Action: send yourself an email / Slack / another notification.
                  </li>
                </ul>
              </li>
              <li>
                For quick native reminders, sprinkle <code>@reminder</code>{" "}
                tags into Notion text blocks (e.g.{" "}
                <code>@tomorrow 7am review Part 2 partnerships</code>).
              </li>
            </ul>
          </div>
        </div>

        {/* 4. Gantt & Calendar views */}
        <div className="collapse collapse-arrow bg-slate-900/70 border border-slate-700">
          <input
            type="checkbox"
            aria-label="Toggle Gantt and calendar section"
          />
          <div className="collapse-title text-sm font-medium">
            4️⃣ Gantt & Calendar views inside Notion
          </div>
          <div className="collapse-content text-xs md:text-sm text-slate-300 space-y-2">
            <ul className="list-disc list-inside space-y-1">
              <li>
                Create a DB <strong>“Phases”</strong> with{" "}
                <code>Phase Name</code>, <code>Start</code>, <code>End</code>,{" "}
                <code>Part</code>.
              </li>
              <li>
                Add a <strong>Timeline view</strong> grouped by Part to mimic
                this app’s Gantt chart.
              </li>
              <li>
                Add a <strong>Calendar view</strong> using <code>Start</code> as
                the date; each phase becomes a block on the calendar.
              </li>
            </ul>
          </div>
        </div>

        {/* 5. Spaced repetition */}
        <div className="collapse collapse-arrow bg-slate-900/70 border border-slate-700">
          <input
            type="checkbox"
            aria-label="Toggle spaced repetition section"
          />
          <div className="collapse-title text-sm font-medium">
            5️⃣ Spaced repetition in a Flashcards DB
          </div>
          <div className="collapse-content text-xs md:text-sm text-slate-300 space-y-2">
            <p>
              In your <strong>Flashcards</strong> DB, add{" "}
              <code>Confidence</code>, <code>Last Reviewed</code>, and{" "}
              <code>Next Review</code>.
            </p>
            <p>Use this formula for <code>Next Review</code>:</p>
            <pre className="bg-slate-950/80 border border-slate-700 rounded-lg p-2 text-xs overflow-x-auto">
{`if(
  prop("Confidence") == "Low",
  dateAdd(prop("Last Reviewed"), 1, "days"),
  if(
    prop("Confidence") == "Medium",
    dateAdd(prop("Last Reviewed"), 3, "days"),
    dateAdd(prop("Last Reviewed"), 7, "days")
  )
)`}
            </pre>
            <p>
              Then create a view filtered where <code>Next Review</code> is{" "}
              <em>on or before today</em> — that’s your daily review queue.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotionView;
