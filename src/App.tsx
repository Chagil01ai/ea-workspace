import React from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import type { AppState, ChecklistState, TabId } from "./types/app";

import Header from "./components/layout/Header";
import Tabs from "./components/layout/Tabs";
import DashboardView from "./components/views/DashboardView.tsx";
import GanttView from "./components/views/GanttView.tsx";
import CalendarView from "./components/views/CalendarView.tsx";
import NotionView from "./components/views/NotionView.tsx";
import TutorView from "./components/views/TutorView.tsx";
import McqPracticeView from "./components/views/McqPracticeView.tsx";
import AnalyticsView from "./components/views/AnalyticsView.tsx";
import ExamSimulatorView from "./components/views/ExamSimulatorView.tsx";
import FlashcardsView from "./components/views/FlashcardsView.tsx";
import ReferenceLibraryView from "./components/views/ReferenceLibraryView.tsx";
import ProfileBackupView from "./components/views/ProfileBackupView.tsx";

const STORAGE_KEY = "eaWorkspaceState_v2";

const defaultChecklist: ChecklistState = {
  daily: [false, false, false, false, false, false],
  weekly: [false, false, false, false, false],
  progressLeft: [false, false, false, false],
  progressRight: [false, false, false, false],
};

const defaultState: AppState = {
  activeTab: "dashboard",
  checklist: defaultChecklist,
};

const App: React.FC = () => {
  const [state, setState] = useLocalStorage<AppState>(STORAGE_KEY, defaultState);

  const setActiveTab = (tab: TabId) => {
    setState((prev) => ({ ...prev, activeTab: tab }));
  };

  const toggleChecklistItem = (list: keyof ChecklistState, index: number) => {
    setState((prev) => {
      const updatedList = [...prev.checklist[list]];
      updatedList[index] = !updatedList[index];
      return {
        ...prev,
        checklist: {
          ...prev.checklist,
          [list]: updatedList,
        },
      };
    });
  };

  return (
    <div
      data-theme="eaTheme"
      className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black text-slate-100"
    >
      <div className="max-w-5xl mx-auto px-4 pt-4 pb-10">
        <Header />
        <Tabs activeTab={state.activeTab} onTabChange={setActiveTab} />

        <main className="mt-3 space-y-4">
          {state.activeTab === "dashboard" && (
            <DashboardView
              checklist={state.checklist}
              toggleChecklistItem={toggleChecklistItem}
            />
          )}
          {state.activeTab === "gantt" && <GanttView />}
          {state.activeTab === "calendar" && <CalendarView />}
          {state.activeTab === "notion" && <NotionView />}
          {state.activeTab === "tutor" && <TutorView />}
          {state.activeTab === "mcq" && <McqPracticeView />}
          {state.activeTab === "analytics" && <AnalyticsView />}
          {state.activeTab === "exam" && <ExamSimulatorView />}
          {state.activeTab === "flashcards" && <FlashcardsView />}
          {state.activeTab === "library" && <ReferenceLibraryView />}
          {state.activeTab === "profile" && <ProfileBackupView />}
        </main>
      </div>
    </div>
  );
};

export default App;
