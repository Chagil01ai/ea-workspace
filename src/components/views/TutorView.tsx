import React, { useState } from "react";
import type { TutorMessage } from "../../types/tutor";
import ChatMessageBubble from "../common/ChatMessageBubble";
import {
  EA_TUTOR_SYSTEM_PROMPT,
  OLLAMA_BASE_URL,
  OLLAMA_MODEL,
} from "../../config/ollamaConfig";
import WeakTopicCoach from "../tutor/WeakTopicCoach";

const TUTOR_STORAGE_KEY = "eaTutorMessages_v1";

function loadInitialMessages(): TutorMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(TUTOR_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as TutorMessage[];
  } catch {
    return [];
  }
}

function saveMessages(messages: TutorMessage[]) {
  try {
    window.localStorage.setItem(TUTOR_STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // ignore
  }
}

const TutorView: React.FC = () => {
  const [messages, setMessages] = useState<TutorMessage[]>(() =>
    loadInitialMessages()
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMessage = (msg: TutorMessage) => {
    setMessages((prev) => {
      const updated = [...prev, msg];
      saveMessages(updated);
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: TutorMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      timestamp: Date.now(),
    };

    addMessage(userMessage);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const chatMessages = [
        { role: "system", content: EA_TUTOR_SYSTEM_PROMPT },
        ...messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        { role: "user", content: userMessage.content },
      ];

      const res = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          messages: chatMessages,
          stream: false,
        }),
      });

      if (!res.ok) {
        throw new Error(`Ollama error ${res.status}`);
      }

      const data = await res.json();

      const assistantContent =
        data?.message?.content ??
        (Array.isArray(data)
          ? data.map((d: any) => d?.message?.content ?? "").join("")
          : "");

      const assistantMessage: TutorMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: assistantContent || "I couldn't generate a response.",
        timestamp: Date.now(),
      };

      addMessage(assistantMessage);
    } catch (err) {
      console.error(err);
      setError(
        "Could not reach the EA tutor. Make sure Ollama is running on localhost:11434 and that the model is pulled (e.g. `ollama pull llama3`)."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput((prev) => (prev ? prev + " " + prompt : prompt));
  };

  return (
    <div className="card bg-base-200/60 border border-slate-800 shadow-xl h-[70vh] md:h-[75vh]">
      <div className="card-body p-4 md:p-5 flex flex-col h-full">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h2 className="card-title text-base md:text-lg flex items-center gap-2">
            🤖 EA Tutor Agent
          </h2>
          <span className="badge badge-sm badge-outline border-slate-600 text-slate-300">
            Powered by Ollama · {OLLAMA_MODEL}
          </span>
        </div>
        <p className="text-xs md:text-sm text-slate-400 mb-2">
          Ask practice questions, request explanations, or simulate exam
          scenarios. Your chat history is saved locally in this browser.
        </p>

        {/* Chat Area */}
        <div className="flex-1 min-h-0 border border-slate-800 rounded-2xl bg-slate-950/70 mb-2 overflow-y-auto p-3 space-y-2">
          {messages.length === 0 && (
            <div className="text-xs md:text-sm text-slate-400">
              Try one of the quick prompts below, for example:
              <ul className="list-disc list-inside mt-1">
                <li>“Quiz me on Part 3 representation procedures.”</li>
                <li>“Give me 5 EA-style multiple-choice questions on filing status.”</li>
                <li>“Explain S corporation shareholder basis like I’m a new associate.”</li>
              </ul>
            </div>
          )}
          {messages.map((m) => (
            <ChatMessageBubble key={m.id} message={m} />
          ))}
          {loading && (
            <div className="text-xs text-slate-400 animate-pulse">
              EA Tutor is thinking…
            </div>
          )}
        </div>

        {error && (
          <div className="alert alert-error py-2 px-3 text-xs md:text-sm mb-2">
            <span>{error}</span>
          </div>
        )}

        <WeakTopicCoach
          onPromptReady={(prompt) => {
            // Drop prompt into the input box; you can also append if you prefer
            setInput(prompt);
          }}
        />

        {/* Quick prompts */}
        <div className="flex flex-wrap gap-2 mb-2">
          <button
            type="button"
            className="btn btn-xs md:btn-sm btn-outline btn-primary"
            onClick={() =>
              handleQuickPrompt(
                "Quiz me on Part 3 representation with 3 EA exam-style questions."
              )
            }
          >
            Part 3 Quiz
          </button>
          <button
            type="button"
            className="btn btn-xs md:btn-sm btn-outline btn-secondary"
            onClick={() =>
              handleQuickPrompt(
                "Explain the differences between partnership and S corporation shareholder basis with a numeric example."
              )
            }
          >
            Basis Explainer
          </button>
          <button
            type="button"
            className="btn btn-xs md:btn-sm btn-outline btn-accent"
            onClick={() =>
              handleQuickPrompt(
                "Give me a timed EA practice question and then wait for my answer before revealing the solution."
              )
            }
          >
            Timed Question
          </button>
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="mt-auto" aria-label="EA tutor chat input">
          <label className="input input-bordered flex items-center gap-2 bg-slate-900/80 border-slate-700">
            <input
              className="grow bg-transparent outline-none text-xs md:text-sm"
              placeholder="Ask the EA tutor anything... (e.g., 'Walk me through an installment agreement example.')"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              aria-label="Tutor message input"
            />
            <button
              type="submit"
              className={`btn btn-sm btn-primary px-4 ${
                loading ? "btn-disabled" : ""
              }`}
            >
              Send
            </button>
          </label>
        </form>
      </div>
    </div>
  );
};

export default TutorView;
