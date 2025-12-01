import React from "react";
import type { TabId } from "../../types/app";

interface TabsProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange }) => {
  const tabClass = (tab: TabId) =>
    `tab flex-1 text-xs md:text-sm ${
      activeTab === tab ? "tab-active" : ""
    }`;

  return (
    <div className="mt-3">
      <div className="tabs tabs-boxed bg-slate-900/60 border border-slate-700/60 shadow-lg rounded-2xl">
        <button
          className={tabClass("dashboard")}
          onClick={() => onTabChange("dashboard")}
        >
          🏠 Dashboard
        </button>
        <button
          className={tabClass("gantt")}
          onClick={() => onTabChange("gantt")}
        >
          📊 Gantt
        </button>
        <button
          className={tabClass("calendar")}
          onClick={() => onTabChange("calendar")}
        >
          📅 Calendar
        </button>
        <button
          className={tabClass("notion")}
          onClick={() => onTabChange("notion")}
        >
          ⚙️ Notion Guide
        </button>
        <button
          className={tabClass("tutor")}
          onClick={() => onTabChange("tutor")}
        >
          🤖 Tutor
        </button>
        <button
          className={tabClass("mcq")}
          onClick={() => onTabChange("mcq")}
        >
          ✅ MCQ Practice
        </button>
        <button
          className={tabClass("analytics")}
          onClick={() => onTabChange("analytics")}
        >
          📈 Analytics
        </button>
        <button
          className={tabClass("exam")}
          onClick={() => onTabChange("exam")}
        >
          ⏱ Exam Simulator
        </button>
        <button
          className={tabClass("flashcards")}
          onClick={() => onTabChange("flashcards")}
        >
          🧠 Flashcards
        </button>
        <button
          className={tabClass("library")}
          onClick={() => onTabChange("library")}
        >
          📚 Library
        </button>
        <button
          className={tabClass("profile")}
          onClick={() => onTabChange("profile")}
        >
          👤 Profile
        </button>
      </div>
    </div>
  );
};

export default Tabs;
