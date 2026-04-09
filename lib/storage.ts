import type { LearnerSettings, WordProgress } from "@/types/vocab";

export const PROGRESS_STORAGE_KEY = "violet-french-progress";
export const SETTINGS_STORAGE_KEY = "violet-french-settings";

export const DEFAULT_SETTINGS: LearnerSettings = {
  wordsPerDay: 20,
  sourceList: "All Sources",
  alphabeticalSort: false
};

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
    return stored
      ? { ...DEFAULT_SETTINGS, ...(JSON.parse(stored) as Partial<LearnerSettings>) }
      : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: LearnerSettings) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}
