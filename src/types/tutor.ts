export type TutorRole = "user" | "assistant";

export type TutorMessage = {
  id: string;
  role: TutorRole;
  content: string;
  timestamp: number;
};
