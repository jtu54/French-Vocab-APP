import dictionaryData from "@/data/dictionary.json";
import sampleData from "@/data/vocabulary.sample.json";
import type { PartOfSpeech, VocabularyWord } from "@/types/vocab";

type RawDictionaryWord = Partial<VocabularyWord> & {
  id?: string;
  french?: string;
  english?: string;
  partOfSpeech?: PartOfSpeech;
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeDictionaryEntry(entry: RawDictionaryWord, index: number): VocabularyWord | null {
  if (!entry.french || !entry.english) {
    return null;
  }

  const normalizedFrench = entry.french.trim();
  const normalizedEnglish = entry.english.trim();

  if (!normalizedFrench || !normalizedEnglish) {
    return null;
  }

  return {
    id: entry.id?.trim() || slugify(normalizedFrench) || `dictionary-${index + 1}`,
    french: normalizedFrench,
    english: normalizedEnglish,
    partOfSpeech: entry.partOfSpeech ?? "noun",
    source: "Dictionary",
    article: entry.article,
    gender: entry.gender,
    memoryStabilityLevel: entry.memoryStabilityLevel ?? 0,
    notes: entry.notes,
    tags: entry.tags,
    verbMeta: entry.verbMeta
  };
}

function mergeVocabularyLibraries(baseWords: VocabularyWord[], dictionaryWords: VocabularyWord[]) {
  const merged = [...baseWords];
  const seenIds = new Set(baseWords.map((word) => word.id));
  const seenFrench = new Set(baseWords.map((word) => word.french.toLowerCase()));

  for (const word of dictionaryWords) {
    const normalizedFrench = word.french.toLowerCase();

    if (seenIds.has(word.id) || seenFrench.has(normalizedFrench)) {
      continue;
    }

    seenIds.add(word.id);
    seenFrench.add(normalizedFrench);
    merged.push(word);
  }

  return merged;
}

export function getVocabularyLibrary(): VocabularyWord[] {
  const baseWords = sampleData as VocabularyWord[];
  const normalizedDictionaryWords = (dictionaryData as RawDictionaryWord[])
    .map(normalizeDictionaryEntry)
    .filter((word): word is VocabularyWord => Boolean(word));

  return mergeVocabularyLibraries(baseWords, normalizedDictionaryWords);
}
