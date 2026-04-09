"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { ControlPanel } from "@/components/ControlPanel";
import { Pagination } from "@/components/Pagination";
import { VerbModal } from "@/components/VerbModal";
import { WordCard } from "@/components/WordCard";
import { buildDailyDeck, buildVault, PAGE_SIZE, updateWordProgress } from "@/lib/srs";
import { getAvailableSourceOptions } from "@/lib/vocabulary";
import {
  DEFAULT_SETTINGS,
  loadProgress,
  loadSettings,
  saveProgress,
  saveSettings
} from "@/lib/storage";
import type { VocabularyWord, WordProgress } from "@/types/vocab";

interface FrenchLearningAppProps {
  initialWords: VocabularyWord[];
}

export function FrenchLearningApp({ initialWords }: FrenchLearningAppProps) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [progressById, setProgressById] = useState<Record<string, WordProgress>>({});
  const [view, setView] = useState<"daily" | "vault">("daily");
  const [selectedVerb, setSelectedVerb] = useState<VocabularyWord | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hydrated, setHydrated] = useState(false);
  const gridRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setSettings(loadSettings());
    setProgressById(loadProgress());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    saveSettings(settings);
  }, [hydrated, settings]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    saveProgress(progressById);
  }, [hydrated, progressById]);

  const availableSources = useMemo(() => getAvailableSourceOptions(initialWords), [initialWords]);
  const dailyDeck = useMemo(
    () => buildDailyDeck(initialWords, progressById, settings),
    [initialWords, progressById, settings]
  );
  const vaultDeck = useMemo(
    () => buildVault(initialWords, progressById, settings),
    [initialWords, progressById, settings]
  );
  const activeDeck = view === "daily" ? dailyDeck.cards : vaultDeck;
  const totalPages = Math.max(1, Math.ceil(activeDeck.length / PAGE_SIZE));
  const visibleCards = activeDeck.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    setCurrentPage(1);
  }, [view, settings.sourceList, settings.wordsPerDay, settings.alphabeticalSort, dailyDeck.cards.length, vaultDeck.length]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  function handleRateWord(word: VocabularyWord, remembered: boolean) {
    setProgressById((current) => ({
      ...current,
      [word.id]: updateWordProgress(current[word.id], remembered)
    }));
  }

  function handleStartQuiz() {
    setView("daily");
    setCurrentPage(1);
    gridRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1500px]">
        <header className="wood-panel pixel-corners mx-auto max-w-5xl rounded-xl px-6 py-8 text-center shadow-pixel">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.3em] text-[#ffefc0]">
            Personal Study Homestead
          </p>
          <h1 className="font-pixel text-lg uppercase leading-8 text-[#fff9e7] sm:text-2xl sm:leading-[3rem]">
            Violet’s French Learning Path
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-[#f3e3b9] sm:text-base">
            A cozy, pixel-art vocabulary board with grammar-aware cards, Ebbinghaus review timing,
            and a local verb workshop for deeper conjugation practice.
          </p>
        </header>

        <section className="mt-8">
          <ControlPanel
            availableSources={availableSources}
            settings={settings}
            view={view}
            onSettingsChange={setSettings}
            onViewChange={setView}
            onStartQuiz={handleStartQuiz}
          />
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div className="wood-panel pixel-corners rounded-lg p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#fff1c8]">
              Today&apos;s Words
            </p>
            <p className="mt-2 font-pixel text-sm uppercase leading-6 text-[#fff9e1]">
              {dailyDeck.cards.length} cards ready
            </p>
          </div>
          <div className="wood-panel pixel-corners rounded-lg p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#fff1c8]">
              New Words
            </p>
            <p className="mt-2 font-pixel text-sm uppercase leading-6 text-[#fff9e1]">
              {dailyDeck.newCount}
            </p>
          </div>
          <div className="wood-panel pixel-corners rounded-lg p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#fff1c8]">
              Review Words
            </p>
            <p className="mt-2 font-pixel text-sm uppercase leading-6 text-[#fff9e1]">
              {dailyDeck.reviewCount}
            </p>
          </div>
        </section>

        <section ref={gridRef} className="mt-10">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#f8f0d4]">
                {view === "daily" ? "Daily Quiz Board" : "Vault Inventory"}
              </p>
              <h2 className="mt-2 font-pixel text-sm uppercase leading-6 text-[#fff9e1] sm:text-base">
                {view === "daily"
                  ? "New words plus due reviews from the Ebbinghaus engine"
                  : "All learned words saved in local storage"}
              </h2>
            </div>
            <div className="rounded-full bg-[#4d2f1a]/80 px-4 py-2 text-sm font-semibold text-[#f0deb4]">
              25 cards per page
            </div>
          </div>

          {visibleCards.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
              {visibleCards.map((entry) => (
                <WordCard
                  key={`${entry.word.id}-${entry.kind}`}
                  entry={entry}
                  showActions={view === "daily"}
                  onRateWord={handleRateWord}
                  onOpenVerb={setSelectedVerb}
                />
              ))}
            </div>
          ) : (
            <div className="inventory-slot pixel-corners rounded-lg p-8 text-center">
              <p className="font-pixel text-sm uppercase leading-6 text-[#4b2f1a]">
                {view === "daily" ? "No cards match this setup yet." : "Your learned-word vault is empty."}
              </p>
              <p className="mt-3 text-sm leading-6 text-[#4b3828]">
                Adjust the source list, raise the daily word count, or mark a few cards as learned to
                start filling the archive.
              </p>
            </div>
          )}

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </section>

        <VerbModal word={selectedVerb} open={Boolean(selectedVerb)} onClose={() => setSelectedVerb(null)} />
      </div>
    </main>
  );
}
