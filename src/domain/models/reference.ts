import type { ExamPart } from "./exam";
import type { TopicId } from "./topic";

export type ReferenceType = "FORM" | "PUBLICATION" | "NOTE";

export type ReferenceDoc = {
  id: string;
  title: string;
  refCode?: string;       // ex: "Form 1040", "Pub 17", "Circ 230"
  description?: string;

  type: ReferenceType;
  parts: ExamPart[];      // which exam parts this is relevant to
  topicIds: TopicId[];

  // file / link
  url?: string;           // external URL
  localPath?: string;     // if packaged with app

  createdAt: string;
  updatedAt?: string;
};

export type ReferenceAnnotation = {
  id: string;
  docId: string;

  // location inside the doc
  page?: number;
  selectionText?: string;

  note: string;
  createdAt: string;
  updatedAt?: string;

  tags: string[];
  linkedTopicIds: TopicId[];
  linkedQuestionIds: string[];
};
