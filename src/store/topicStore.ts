import type { ExamPart } from "./questionStore";
import topicsPart1Raw from "../data/topics.part1.json";
import topicsPart2Raw from "../data/topics.part2.json";
import topicsPart3Raw from "../data/topics.part3.json";

export type Topic = {
  id: string;
  part: ExamPart;
  code: string;
  name: string;
  description?: string;
  order: number;
  weightPercent?: number;
};

const TOPICS_PART1: Topic[] = topicsPart1Raw as Topic[];
const TOPICS_PART2: Topic[] = topicsPart2Raw as Topic[];
const TOPICS_PART3: Topic[] = topicsPart3Raw as Topic[];

const ALL_TOPICS: Topic[] = [
  ...TOPICS_PART1,
  ...TOPICS_PART2,
  ...TOPICS_PART3,
];

export async function getTopicsForPart(part: ExamPart): Promise<Topic[]> {
  switch (part) {
    case "PART1_INDIVIDUALS":
      return TOPICS_PART1;
    case "PART2_BUSINESS":
      return TOPICS_PART2;
    case "PART3_REPRESENTATION":
      return TOPICS_PART3;
    default:
      return [];
  }
}

export function findTopicById(topicId: string): Topic | undefined {
  return ALL_TOPICS.find((t) => t.id === topicId);
}
