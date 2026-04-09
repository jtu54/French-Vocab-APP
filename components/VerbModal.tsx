"use client";

import { useEffect, useState } from "react";

import { getVerbConjugationSections } from "@/lib/verbs";
import type { ConjugationSection, VocabularyWord } from "@/types/vocab";

interface VerbModalProps {
  word: VocabularyWord | null;
  open: boolean;
  onClose: () => void;
}

export function VerbModal({ word, open, onClose }: VerbModalProps) {
  const [sections, setSections] = useState<ConjugationSection[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !word) {
      return;
    }

    let cancelled = false;
    const activeWord = word;

    async function loadConjugations() {
      setLoading(true);
      setError(null);

      try {
        const nextSections = await getVerbConjugationSections(activeWord);

        if (!cancelled) {
          setSections(nextSections);
        }
      } catch {
        if (!cancelled) {
          setError("Unable to load local conjugations. Install dependencies and try again.");
          setSections([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadConjugations();

    return () => {
      cancelled = true;
    };
  }, [open, word]);

  if (!open || !word) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2d1a10]/70 p-4">
      <div className="wood-panel pixel-corners scrollbar-wood max-h-[88vh] w-full max-w-5xl overflow-y-auto rounded-xl p-5 sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#fff1c8]">
              Verb Conjugation Ledger
            </p>
            <h2 className="mt-2 font-pixel text-sm uppercase leading-6 text-[#fff9e1] sm:text-base">
              {word.french}
            </h2>
            <p className="mt-2 text-sm text-[#f2e2b7]">{word.english}</p>
          </div>
          <button
            type="button"
            className="pixel-button pixel-corners rounded-md px-4 py-3 text-[11px] font-bold text-bark"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        {loading ? (
          <div className="inventory-slot pixel-corners rounded-lg p-6 text-sm font-semibold text-[#4b2f1a]">
            Loading local `french-verbs` conjugations...
          </div>
        ) : null}

        {error ? (
          <div className="inventory-slot pixel-corners rounded-lg p-6 text-sm font-semibold text-[#7a2f22]">
            {error}
          </div>
        ) : null}

        {!loading && !error ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {sections.map((section) => (
              <section
                key={section.label}
                className="inventory-slot pixel-corners rounded-lg p-4 text-[#2d2218]"
              >
                <div className="mb-3 flex items-start justify-between gap-4">
                  <h3 className="font-pixel text-[10px] uppercase leading-5 text-[#4b2f1a]">
                    {section.label}
                  </h3>
                  {section.note ? (
                    <span className="rounded-full bg-[#d7e3b3] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#4c6332]">
                      Local Build
                    </span>
                  ) : null}
                </div>

                <div className="space-y-2">
                  {section.rows.map((row) => (
                    <div
                      key={`${section.label}-${row.subject}`}
                      className="grid grid-cols-[96px_1fr] gap-3 rounded-md bg-[#fff3d8]/75 px-3 py-2 text-sm"
                    >
                      <span className="font-bold text-[#7a5230]">{row.subject}</span>
                      <span className="font-semibold text-[#33261b]">{row.value}</span>
                    </div>
                  ))}
                </div>

                {section.note ? (
                  <p className="mt-3 text-xs leading-5 text-[#5d4b3e]">{section.note}</p>
                ) : null}
              </section>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
