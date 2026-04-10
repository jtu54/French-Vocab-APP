"use client";

import type { LearnerSettings, SourceList } from "@/types/vocab";

interface ControlPanelProps {
  availableSources: SourceList[];
  isRefilling: boolean;
  settings: LearnerSettings;
  view: "daily" | "vault";
  onRefillQueue: () => void;
  onSettingsChange: (next: LearnerSettings) => void;
  onViewChange: (view: "daily" | "vault") => void;
  onStartQuiz: () => void;
}

const WORD_OPTIONS = [5, 10, 20, 25, 40, 50, 75, 100];

export function ControlPanel({
  availableSources,
  isRefilling,
  settings,
  view,
  onRefillQueue,
  onSettingsChange,
  onViewChange,
  onStartQuiz
}: ControlPanelProps) {
  return (
    <div className="space-y-5">
      <section className="wood-panel pixel-corners rounded-lg p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="font-pixel text-[10px] uppercase tracking-[0.2em] text-cream sm:text-xs">
            Setup
          </h2>
          <div className="rounded-full bg-[#3c2415]/65 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#f8e8bf]">
            Daily Load Builder
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr_auto]">
          <label className="space-y-2">
            <span className="block text-sm font-bold uppercase tracking-[0.12em] text-[#fff4cf]">
              Words per Day
            </span>
            <select
              className="pixel-select pixel-corners w-full rounded-md px-4 py-3 text-sm font-semibold text-bark"
              value={settings.wordsPerDay}
              onChange={(event) =>
                onSettingsChange({
                  ...settings,
                  wordsPerDay: Number(event.target.value)
                })
              }
            >
              {WORD_OPTIONS.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="block text-sm font-bold uppercase tracking-[0.12em] text-[#fff4cf]">
              Source List
            </span>
            <select
              className="pixel-select pixel-corners w-full rounded-md px-4 py-3 text-sm font-semibold text-bark"
              value={settings.sourceList}
              onChange={(event) =>
                onSettingsChange({
                  ...settings,
                  sourceList: event.target.value as SourceList
                })
              }
            >
              {availableSources.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          <label className="flex min-h-[84px] items-end">
            <span className="wood-panel pixel-corners flex w-full items-center justify-between gap-4 rounded-md px-4 py-3 text-[#fff4cf]">
              <span className="text-sm font-bold uppercase tracking-[0.12em]">Alphabetical Sort</span>
              <button
                type="button"
                className={`pixel-button pixel-corners min-w-[106px] rounded-md px-3 py-2 text-[11px] font-bold ${
                  settings.alphabeticalSort ? "is-active" : ""
                }`}
                onClick={() =>
                  onSettingsChange({
                    ...settings,
                    alphabeticalSort: !settings.alphabeticalSort
                  })
                }
              >
                {settings.alphabeticalSort ? "On" : "Off"}
              </button>
            </span>
          </label>
        </div>
      </section>

      <section className="wood-panel pixel-corners rounded-lg p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="font-pixel text-[10px] uppercase tracking-[0.2em] text-cream sm:text-xs">
            Navigation
          </h2>
          <div className="rounded-full bg-[#3c2415]/65 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#f8e8bf]">
            Study Flow
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <button
            type="button"
            className={`pixel-button pixel-corners rounded-md px-5 py-4 text-sm font-bold text-bark ${
              view === "vault" ? "is-active" : ""
            }`}
            onClick={() => onViewChange("vault")}
          >
            Vault: Learned Words
          </button>
          <button
            type="button"
            className={`pixel-button pixel-corners rounded-md px-5 py-4 text-sm font-bold text-bark ${
              view === "daily" ? "is-active" : ""
            }`}
            onClick={onStartQuiz}
          >
            Start Daily Quiz
          </button>
          <button
            type="button"
            className="pixel-button pixel-corners rounded-md px-5 py-4 text-sm font-bold text-bark disabled:cursor-not-allowed disabled:opacity-70"
            onClick={onRefillQueue}
            disabled={isRefilling}
          >
            {isRefilling ? "Loading..." : "Refill Queue"}
          </button>
        </div>
      </section>
    </div>
  );
}
