"use client";

import { formatReviewDate, getDisplayFrench } from "@/lib/srs";
import { normalizeSourceLabel } from "@/lib/vocabulary";
import type { DailyDeckEntry, VocabularyWord } from "@/types/vocab";

interface WordCardProps {
  entry: DailyDeckEntry;
  showActions: boolean;
  onRateWord: (word: VocabularyWord, remembered: boolean) => void;
  onOpenVerb: (word: VocabularyWord) => void;
}

export function WordCard({ entry, showActions, onRateWord, onOpenVerb }: WordCardProps) {
  const { word, kind, progress } = entry;
  const isVerb = word.partOfSpeech === "verb";

  return (
    <article
      className={`inventory-slot pixel-corners flex h-full min-h-[260px] flex-col rounded-lg p-4 ${
        kind === "review" ? "review-slot" : ""
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#4c301d] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#f8eac4]">
              {normalizeSourceLabel(word.source)}
            </span>
            <span className="rounded-full bg-[#f8ecd0] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#6b4328]">
              {word.partOfSpeech}
            </span>
            {kind === "review" ? (
              <span className="rounded-full bg-[#607d46] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#f3f8dd]">
                ★ Review
              </span>
            ) : null}
          </div>
          <h3 className="font-pixel text-sm uppercase leading-6 text-[#4b2f1a]">
            {getDisplayFrench(word)}
          </h3>
        </div>

        {isVerb ? (
          <button
            type="button"
            className="pixel-button pixel-corners rounded-md px-3 py-2 text-[10px] font-bold text-bark"
            onClick={() => onOpenVerb(word)}
          >
            ➜ Verb
          </button>
        ) : null}
      </div>

      <div className="pixel-divider mb-4 rounded-full" />

      <div className="flex flex-1 flex-col justify-between">
        <div className="space-y-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6f4c2d]">Meaning</p>
            <p className="mt-1 text-lg font-bold text-[#2d2218]">{word.english}</p>
          </div>

          {word.notes ? (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6f4c2d]">Hint</p>
              <p className="mt-1 text-sm leading-6 text-[#3f3022]">{word.notes}</p>
            </div>
          ) : null}

          <div className="grid grid-cols-2 gap-2 text-sm text-[#4d3826]">
            <div className="rounded-md bg-[#fff3d8]/70 px-3 py-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8a6037]">Stage</p>
              <p className="mt-1 font-bold">{progress?.stage ?? word.memoryStabilityLevel}</p>
            </div>
            <div className="rounded-md bg-[#fff3d8]/70 px-3 py-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8a6037]">Next Review</p>
              <p className="mt-1 font-bold">{formatReviewDate(progress)}</p>
            </div>
          </div>
        </div>

        {showActions ? (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="pixel-button pixel-corners rounded-md px-3 py-3 text-[11px] font-bold text-bark"
              onClick={() => onRateWord(word, false)}
            >
              Need Review
            </button>
            <button
              type="button"
              className="pixel-button pixel-corners is-active rounded-md px-3 py-3 text-[11px] font-bold"
              onClick={() => onRateWord(word, true)}
            >
              I Know It
            </button>
          </div>
        ) : null}
      </div>
    </article>
  );
}
