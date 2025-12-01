export type TabId = "dashboard" | "gantt" | "calendar" | "notion" | "tutor" | "mcq" | "analytics" | "exam" | "flashcards" | "library" | "profile";

export type ChecklistState = {
  daily: boolean[];
  weekly: boolean[];
  progressLeft: boolean[];
  progressRight: boolean[];
};

export type AppState = {
  activeTab: TabId;
  checklist: ChecklistState;
};
