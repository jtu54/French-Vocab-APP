import type {
  DailyDeckEntry,
  DeckSummary,
  LearnerSettings,
  VocabularyWord,
  WordProgress
} from "@/types/vocab";

import { matchesSelectedSource } from "@/lib/vocabulary";

export const EBBINGHAUS_INTERVALS = [1, 2, 4, 7, 15, 30] as const;
export const PAGE_SIZE = 25;

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * DAY_IN_MS);
}

export function getDisplayFrench(word: VocabularyWord) {
  if ((word.partOfSpeech === "noun" || word.partOfSpeech === "adjective") && word.article) {
    return `${word.article} ${word.french}`;
  }

  return word.french;
}

export function isLearned(progress?: WordProgress) {
  return Boolean(progress && progress.stage > 0);
}

export function isReviewDue(progress: WordProgress | undefined, now = new Date()) {
  if (!progress || progress.stage <= 0) {
    return false;
  }

  if (!progress.nextReviewAt) {
    return true;
  }

  return new Date(progress.nextReviewAt).getTime() <= now.getTime();
}

export function getStageInterval(stage: number) {
  if (stage <= 0) {
    return EBBINGHAUS_INTERVALS[0];
  }

  const safeIndex = Math.min(stage - 1, EBBINGHAUS_INTERVALS.length - 1);
  return EBBINGHAUS_INTERVALS[safeIndex];
}

export function updateWordProgress(
  previous: WordProgress | undefined,
  remembered: boolean,
  now = new Date()
): WordProgress {
  const nextStage = remembered
    ? Math.min((previous?.stage ?? 0) + 1, EBBINGHAUS_INTERVALS.length)
    : 1;
  const nextReviewAt = addDays(now, getStageInterval(nextStage));

  return {
    stage: nextStage,
    learnedAt: previous?.learnedAt ?? now.toISOString(),
    lastReviewedAt: now.toISOString(),
    nextReviewAt: nextReviewAt.toISOString(),
    totalReviews: (previous?.totalReviews ?? 0) + 1,
    recallStrength: remembered
      ? Math.min(1, (previous?.recallStrength ?? 0.18) + 0.16)
      : 0.2,
    lastResult: remembered ? "remembered" : "forgot"
  };
}

export function formatReviewDate(progress?: WordProgress) {
  if (!progress?.nextReviewAt) {
    return "New word";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric"
  }).format(new Date(progress.nextReviewAt));
}

function sortWords(words: VocabularyWord[], alphabetical: boolean) {
  if (!alphabetical) {
    return words;
  }

  return [...words].sort((left, right) => getDisplayFrench(left).localeCompare(getDisplayFrench(right)));
}

export function getNextWords(
  words: VocabularyWord[],
  progressById: Record<string, WordProgress>,
  settings: LearnerSettings,
  excludedWordIds = new Set<string>()
) {
  return sortWords(
    words.filter((word) => matchesSelectedSource(word, settings.sourceList)),
    settings.alphabeticalSort
  )
    .filter((word) => !isLearned(progressById[word.id]))
    .filter((word) => !excludedWordIds.has(word.id))
    .slice(0, settings.wordsPerDay);
}

export function buildDailyDeck(
  words: VocabularyWord[],
  progressById: Record<string, WordProgress>,
  settings: LearnerSettings,
  now = new Date()
): DeckSummary {
  const filteredWords = sortWords(
    words.filter((word) => matchesSelectedSource(word, settings.sourceList)),
    settings.alphabeticalSort
  );

  const reviewCards: DailyDeckEntry[] = filteredWords
    .filter((word) => isReviewDue(progressById[word.id], now))
    .map((word) => ({
      word,
      kind: "review",
      progress: progressById[word.id]
    }));

  const excludedWordIds = new Set(reviewCards.map((entry) => entry.word.id));
  const newCards: DailyDeckEntry[] = getNextWords(words, progressById, settings, excludedWordIds)
    .map((word) => ({
      word,
      kind: "new",
      progress: progressById[word.id]
    }));

  return {
    cards: [...reviewCards, ...newCards],
    reviewCount: reviewCards.length,
    newCount: newCards.length
  };
}

export function buildVault(words: VocabularyWord[], progressById: Record<string, WordProgress>, settings: LearnerSettings) {
  const filteredWords = sortWords(
    words.filter((word) => matchesSelectedSource(word, settings.sourceList)),
    settings.alphabeticalSort
  );

  return filteredWords
    .filter((word) => isLearned(progressById[word.id]))
    .map((word) => ({
      word,
      kind: isReviewDue(progressById[word.id]) ? "review" : "new",
      progress: progressById[word.id]
    })) satisfies DailyDeckEntry[];
}
