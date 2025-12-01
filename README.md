# EA Workspace

A personal **Enrolled Agent (EA) exam preparation workspace** built with:

- React + TypeScript
- Vite
- Tailwind CSS + DaisyUI
- LocalStorage-based persistence
- Local AI tutor (via Ollama)

It’s designed for a working professional in tax / transfer pricing who is preparing for the EA exam under **Scenario B**:

> Part 3 → Part 1 → Part 2, with completion by late 2026.

---

## ✨ Features

### 1. EA Study Dashboard

- Daily “micro-habit” checklist
- Weekly goals (modules, MCQs, deep work sessions)
- Big-rock progress (per-part milestones like “Part 3 modules watched” and “3,000+ MCQs completed”)
- Uses `localStorage` to persist checkbox states between sessions

### 2. Scenario B Timeline (Gantt View)

- Gantt-style bar chart (animated with staggered delays)
- High-level schedule:
  - Nov 2025–Jan 2026: Part 3 – Representation
  - Jan–Mar 2026: Part 1 – Individuals
  - Apr 2026: Light review
  - May–Sep 2026: Part 2 – Business
  - Oct–Nov 2026: Buffer / retake window
- Fully responsive and scrollable

### 3. Calendar View (Month-by-Month Plan)

- “Card-style” overview for each month from Nov 2025 to Nov 2026
- Each month specifies:
  - Target phase (e.g., “Part 3 core”, “Light review”, “Part 2 – Depreciation”)
  - Narrative study focus
- Conceptually maps to a Notion calendar

### 4. Notion Automation Guide

- Detailed guide for building a **Notion-based EA study system**, including:
  - Weekly templates
  - Module progress formulas (completion %)
  - Reminder automations (Zapier/Make)
  - Gantt & calendar views
  - Spaced repetition for flashcards (Next Review formula)

### 5. EA Tutor Agent (Ollama-Powered)

- React chat UI with DaisyUI chat bubbles
- LocalStorage-based chat history
- Connects to an **Ollama** LLM model (e.g. `llama3`)
- System prompt tuned to:
  - EA exam scope (Parts 1–3)
  - Step-by-step explanations
  - Short practice questions on demand
- Quick prompts for:
  - Part 3 quizzes
  - Basis explanations
  - Timed questions

### 6. MCQ Practice (Prototype) – Part 3

- Loads a small JSON question bank for Part 3
- Shows one question at a time
- Lets you select an answer, see whether it’s correct, and view explanation
- Tracks attempts and stores them in `localStorage`
- Shows basic session stats:
  - Questions answered
  - Correct vs incorrect
  - Accuracy %

> This prototype is the foundation for the bigger **MCQ bank + mock exam** feature set.

---

## 🧱 Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS, DaisyUI
- **State persistence:** `localStorage` via custom hooks and stores
- **AI Tutor:** Ollama (local LLM API)
- **Linting:** ESLint, TypeScript ESLint
- **Styling lint (optional):** Stylelint + Tailwind config

---

## 🗂 Project Structure

High-level layout:

```text
ea-workspace/
├─ package.json
├─ vite.config.ts
├─ tsconfig.json
├─ tsconfig.app.json
├─ tsconfig.node.json
├─ postcss.config.cjs
├─ tailwind.config.cjs
├─ index.html
├─ README.md
└─ src/
   ├─ main.tsx
   ├─ App.tsx
   ├─ index.css
   │
   ├─ config/
   │  └─ ollamaConfig.ts
   │
   ├─ hooks/
   │  └─ useLocalStorage.ts
   │
   ├─ types/
   │  ├─ app.ts
   │  └─ tutor.ts
   │
   ├─ data/
   │  ├─ questions.part3.sample.json   # sample EA Part 3 MCQs
   │  └─ (future) topics & other parts
   │
   ├─ store/
   │  └─ questionStore.ts              # load questions + save attempts
   │
   └─ components/
      ├─ layout/
      │  ├─ Header.tsx
      │  └─ Tabs.tsx
      │
      ├─ common/
      │  ├─ GanttRow.tsx
      │  ├─ ChatMessageBubble.tsx
      │  └─ (future) ProgressBar.tsx
      │
      └─ views/
         ├─ DashboardView.tsx
         ├─ GanttView.tsx
         ├─ CalendarView.tsx
         ├─ NotionView.tsx
         ├─ TutorView.tsx
         └─ McqPracticeView.tsx       # new MCQ practice prototype
# ea-workspace
