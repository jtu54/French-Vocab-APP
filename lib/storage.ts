import type { DailyStudyState, LearnerSettings, WordProgress } from "@/types/vocab";

import { normalizeSourceListValue } from "@/lib/vocabulary";

export const PROGRESS_STORAGE_KEY = "violet-french-progress";
export const SETTINGS_STORAGE_KEY = "violet-french-settings";
export const DAILY_STUDY_STORAGE_KEY = "violet-french-daily-study";

export const DEFAULT_SETTINGS: LearnerSettings = {
  wordsPerDay: 20,
  sourceList: "All Sources",
  alphabeticalSort: false
};

function getLocalDateStamp(now = new Date()) {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function createEmptyDailyStudyState(sourceList: LearnerSettings["sourceList"]): DailyStudyState {
  return {
    sessionDate: getLocalDateStamp(),
    queuedWordIds: [],
    wordsStudiedToday: 0,
    sourceList: normalizeSourceListValue(sourceList)
  };
}

export function loadProgress(): Record<string, WordProgress> {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const stored = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Record<string, WordProgress>) : {};
  } catch {
    return {};
  }
}

export function saveProgress(progress: Record<string, WordProgress>) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
}

export function loadSettings(): LearnerSettings {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS;
  }

  try {
    const stored = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!stored) {
      return DEFAULT_SETTINGS;
    }

    const parsed = { ...DEFAULT_SETTINGS, ...(JSON.parse(stored) as Partial<LearnerSettings>) };
    return {
      ...parsed,
      sourceList: normalizeSourceListValue(parsed.sourceList)
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: LearnerSettings) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    SETTINGS_STORAGE_KEY,
    JSON.stringify({
      ...settings,
      sourceList: normalizeSourceListValue(settings.sourceList)
    })
  );
}

export function loadDailyStudyState(sourceList: LearnerSettings["sourceList"]): DailyStudyState {
  if (typeof window === "undefined") {
    return createEmptyDailyStudyState(sourceList);
  }

  try {
    const stored = window.localStorage.getItem(DAILY_STUDY_STORAGE_KEY);
    if (!stored) {
      return createEmptyDailyStudyState(sourceList);
    }

    const parsed = JSON.parse(stored) as Partial<DailyStudyState>;
    const normalizedDate = getLocalDateStamp();

    if (parsed.sessionDate !== normalizedDate) {
      return createEmptyDailyStudyState(sourceList);
    }

    return {
      sessionDate: normalizedDate,
      queuedWordIds: Array.isArray(parsed.queuedWordIds) ? parsed.queuedWordIds : [],
      wordsStudiedToday:
        typeof parsed.wordsStudiedToday === "number" ? parsed.wordsStudiedToday : 0,
      sourceList: normalizeSourceListValue(parsed.sourceList ?? sourceList)
    };
  } catch {
    return createEmptyDailyStudyState(sourceList);
  }
}

export function saveDailyStudyState(state: DailyStudyState) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    DAILY_STUDY_STORAGE_KEY,
    JSON.stringify({
      ...state,
      sessionDate: getLocalDateStamp(),
      sourceList: normalizeSourceListValue(state.sourceList)
    })
  );
}
