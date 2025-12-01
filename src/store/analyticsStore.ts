import type { ExamPart } from "./questionStore";
import { getAllAttempts } from "./questionStore";
import type { Topic } from "./topicStore";
import { getTopicsForPart, 
    //findTopicById 
} from "./topicStore";

export type TopicAccuracy = {
  topicId: string;
  topicName: string;
  part: ExamPart;
  attempts: number;
  correct: number;
  accuracyPercent: number;
  lastAttemptAt?: string;
};

export type WeakTopicOptions = {
  minAttempts?: number;        // ignore topics with fewer attempts
  maxAccuracyPercent?: number; // treat at/below as "weak"
};

export async function getTopicAccuracyByPart(
  part: ExamPart
): Promise<TopicAccuracy[]> {
  const attempts = getAllAttempts().filter((a) => a.part === part);
  const topics = await getTopicsForPart(part);

  const byTopic = new Map<
    string,
    { attempts: number; correct: number; lastAttemptAt?: string }
  >();

  for (const a of attempts) {
    const key = a.topicId;
    const entry = byTopic.get(key) ?? {
      attempts: 0,
      correct: 0,
      lastAttemptAt: undefined,
    };

    entry.attempts += 1;
    if (a.isCorrect) entry.correct += 1;

    if (
      !entry.lastAttemptAt ||
      new Date(a.attemptedAt) > new Date(entry.lastAttemptAt)
    ) {
      entry.lastAttemptAt = a.attemptedAt;
    }

    byTopic.set(key, entry);
  }

  const results: TopicAccuracy[] = topics.map((topic: Topic) => {
    const entry = byTopic.get(topic.id);
    const attemptsCount = entry?.attempts ?? 0;
    const correctCount = entry?.correct ?? 0;
    const accuracyPercent =
      attemptsCount > 0
        ? Math.round((correctCount / attemptsCount) * 100)
        : 0;

    return {
      topicId: topic.id,
      topicName: topic.name,
      part: topic.part,
      attempts: attemptsCount,
      correct: correctCount,
      accuracyPercent,
      lastAttemptAt: entry?.lastAttemptAt,
    };
  });

  // Sort by order of syllabus topic (if we want we can map by code or order)
  // For now, keep order from topics json (which is already ordered).
  return results;
}

export async function getWeakTopicsByPart(
  part: ExamPart,
  options: WeakTopicOptions = {}
): Promise<TopicAccuracy[]> {
  const { minAttempts = 3, maxAccuracyPercent = 70 } = options;
  const all = await getTopicAccuracyByPart(part);

  return all.filter(
    (t) =>
      t.attempts >= minAttempts && t.accuracyPercent <= maxAccuracyPercent
  );
}
