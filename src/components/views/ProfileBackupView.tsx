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
import { useAuth } from "../../context/AuthContext";

type ImportMode = "merge" | "replace";

const ProfileBackupView: React.FC = () => {
  const { user, loading, signInWithEmail, signUpWithEmail, signOut } = useAuth();
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
        {/* Auth panel */}
        <div className="mb-4 rounded-2xl border border-slate-700 bg-slate-900/80 p-4 space-y-2">
          <h2 className="text-sm md:text-base font-semibold text-slate-100">
            🔐 Account
          </h2>

          {loading ? (
            <p className="text-xs md:text-sm text-slate-400">
              Checking sign-in status…
            </p>
          ) : user ? (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div className="text-xs md:text-sm text-slate-300">
                Signed in as{" "}
                <span className="font-semibold">
                  {user.email ?? "EA Workspace user"}
                </span>
              </div>
              <button
                type="button"
                className="btn btn-xs md:btn-sm btn-outline btn-error"
                onClick={() => {
                  void signOut();
                }}
              >
                Sign out
              </button>
            </div>
          ) : (
            <AuthForm
              onSignIn={signInWithEmail}
              onSignUp={signUpWithEmail}
            />
          )}
        </div>
        
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

interface AuthFormProps {
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<void>;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSignIn, onSignUp }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [mode, setMode] = React.useState<"signin" | "signup">("signin");
  const [status, setStatus] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      if (mode === "signin") {
        await onSignIn(email, password);
        setStatus("Signed in successfully.");
      } else {
        await onSignUp(email, password);
        setStatus("Sign-up successful. Check your email for confirmation if required.");
      }
    } catch (err: any) {
      setStatus(err.message ?? "Authentication error.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      className="grid gap-2 text-xs md:text-sm"
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <label className="form-control">
          <span className="label-text text-xs text-slate-300 mb-1">
            Email
          </span>
          <input
            type="email"
            className="input input-xs md:input-sm bg-slate-950 border-slate-700 text-xs md:text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            title="Email address for your EA Workspace account"
          />
        </label>
        <label className="form-control">
          <span className="label-text text-xs text-slate-300 mb-1">
            Password
          </span>
          <input
            type="password"
            className="input input-xs md:input-sm bg-slate-950 border-slate-700 text-xs md:text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            title="Password for your EA Workspace account"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-2 items-center justify-between mt-1">
        <div className="join">
          <button
            type="button"
            className={`btn btn-xs md:btn-sm join-item ${
              mode === "signin"
                ? "btn-primary"
                : "btn-outline border-slate-600"
            }`}
            onClick={() => setMode("signin")}
          >
            Sign in
          </button>
          <button
            type="button"
            className={`btn btn-xs md:btn-sm join-item ${
              mode === "signup"
                ? "btn-accent"
                : "btn-outline border-slate-600"
            }`}
            onClick={() => setMode("signup")}
          >
            Sign up
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-xs md:btn-sm btn-success"
          disabled={submitting}
        >
          {submitting
            ? "Working..."
            : mode === "signin"
            ? "Sign in"
            : "Create account"}
        </button>
      </div>

      {status && (
        <p className="text-[0.7rem] md:text-xs text-slate-300 mt-1">
          {status}
        </p>
      )}
    </form>
  );
};


export default ProfileBackupView;
