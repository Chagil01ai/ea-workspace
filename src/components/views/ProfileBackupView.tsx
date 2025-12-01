// src/components/views/ProfileBackupView.tsx
import React, { useMemo, useState } from "react";
import { getAllAttempts } from "../../store/questionStore";
import { getAllFlashcards } from "../../store/flashcardStore";
import { getAllAnnotations } from "../../store/referenceStore";
import {
  exportProfileSnapshot,
  importProfileSnapshot,
  type EaProfileSnapshot,
} from "../../store/profileStore";

type ImportMode = "merge" | "replace";

const ProfileBackupView: React.FC = () => {
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [importMode, setImportMode] = useState<ImportMode>("merge");

  const attemptsCount = useMemo(
    () => getAllAttempts().length,
    []
  );
  const flashcardCount = useMemo(
    () => getAllFlashcards().length,
    []
  );
  const annotationCount = useMemo(
    () => getAllAnnotations().length,
    []
  );

  const handleExport = () => {
    try {
      const snapshot = exportProfileSnapshot();
      const json = JSON.stringify(snapshot, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      const date = snapshot.exportedAt.slice(0, 10);
      a.download = `ea-profile-${date}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to export profile snapshot.");
    }
  };

  const handleImportFile: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportStatus("Reading file…");

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result ?? "");
        const parsed = JSON.parse(text) as EaProfileSnapshot;
        importProfileSnapshot(parsed, importMode);
        setImportStatus(
          `Imported profile successfully using '${importMode}' mode. Reload the app to reflect all changes.`
        );
      } catch (error) {
        console.error(error);
        setImportStatus(
          "Failed to import profile. Make sure you selected a valid EA profile JSON file."
        );
      } finally {
        e.target.value = "";
      }
    };
    reader.onerror = () => {
      setImportStatus("Failed to read file.");
      e.target.value = "";
    };
    reader.readAsText(file);
  };

  return (
    <div className="card bg-base-200/60 border border-slate-800 shadow-xl">
      <div className="card-body p-4 md:p-5 space-y-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="space-y-1">
            <h2 className="card-title text-base md:text-lg">
              👤 Profile & Backup
            </h2>
            <p className="text-xs md:text-sm text-slate-400">
              Export or import your EA study data (MCQ attempts, flashcards,
              and library notes) as a single JSON file. Perfect for backups or
              moving between devices.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-3">
            <div className="text-xs text-slate-400 mb-1">MCQ attempts</div>
            <div className="text-xl font-semibold text-slate-50">
              {attemptsCount}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-3">
            <div className="text-xs text-slate-400 mb-1">Flashcards</div>
            <div className="text-xl font-semibold text-slate-50">
              {flashcardCount}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-3">
            <div className="text-xs text-slate-400 mb-1">Library notes</div>
            <div className="text-xl font-semibold text-slate-50">
              {annotationCount}
            </div>
          </div>
        </div>

        {/* Export / Import controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Export */}
          <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4 space-y-2">
            <h3 className="text-sm md:text-base font-semibold text-slate-100">
              ⬇️ Export profile
            </h3>
            <p className="text-xs md:text-sm text-slate-400">
              Downloads a JSON file containing all study data stored in this
              browser. Keep it somewhere safe or sync via OneDrive/Dropbox.
            </p>
            <button
              type="button"
              className="btn btn-xs md:btn-sm btn-primary mt-1"
              onClick={handleExport}
            >
              Download profile JSON
            </button>
          </div>

          {/* Import */}
          <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4 space-y-2">
            <h3 className="text-sm md:text-base font-semibold text-slate-100">
              ⬆️ Import profile
            </h3>
            <p className="text-xs md:text-sm text-slate-400">
              Choose a previously exported profile JSON file. You can either
              merge it with your current data or replace your current data
              entirely.
            </p>

            <div className="flex items-center gap-3">
              <div className="form-control">
                <div className="label pb-1">
                  <span className="label-text text-[0.7rem] text-slate-300">
                    Import mode
                  </span>
                </div>
                <select
                  className="select select-xs bg-slate-950 border-slate-700 text-xs"
                  value={importMode}
                  onChange={(e) =>
                    setImportMode(e.target.value as ImportMode)
                  }
                  title="Select how to apply the imported profile data"
                >
                  <option value="merge">Merge (keep & add)</option>
                  <option value="replace">Replace (overwrite)</option>
                </select>
              </div>

              <div className="form-control">
                <div className="label pb-1">
                  <span className="label-text text-[0.7rem] text-slate-300">
                    Choose file
                  </span>
                </div>
                <input
                  type="file"
                  accept="application/json"
                  className="file-input file-input-xs bg-slate-950 border-slate-700 text-xs"
                  onChange={handleImportFile}
                  title="Select an exported EA profile JSON file to import"
                />
              </div>
            </div>

            {importStatus && (
              <p className="mt-2 text-[0.7rem] md:text-xs text-slate-300">
                {importStatus}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileBackupView;
