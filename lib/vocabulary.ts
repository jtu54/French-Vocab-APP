import dictionaryData from "@/data/dictionary.json";
import sampleData from "@/data/vocabulary.sample.json";
import type { PartOfSpeech, SourceList, VocabularySource, VocabularyWord } from "@/types/vocab";

type RawDictionaryWord = Partial<VocabularyWord> & {
  id?: string;
  french?: string;
  english?: string;
  partOfSpeech?: PartOfSpeech;
};

export const DEFAULT_DICTIONARY_SOURCE: VocabularySource = "Lefff (Comprehensive)";
export const ALL_SOURCE_OPTION: SourceList = "All Sources";
export const SOURCE_DISPLAY_ORDER: VocabularySource[] = [
  "Lexique (Common French)",
  "Lefff (Comprehensive)",
  "Collins Essential"
];

const SOURCE_ALIASES: Record<string, VocabularySource> = {
  Textbook: "Lexique (Common French)",
  Dictionary: "Lefff (Comprehensive)",
  "Lexique (Common French)": "Lexique (Common French)",
  "Lefff (Comprehensive)": "Lefff (Comprehensive)",
  "Collins Essential": "Collins Essential"
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeSourceLabel(source?: string): VocabularySource {
  return SOURCE_ALIASES[source ?? ""] ?? DEFAULT_DICTIONARY_SOURCE;
}

export function normalizeSourceListValue(source?: string): SourceList {
  if (!source || source === ALL_SOURCE_OPTION) {
    return ALL_SOURCE_OPTION;
  }

  return normalizeSourceLabel(source);
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
    source: normalizeSourceLabel(entry.source),
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
  const baseWords = (sampleData as VocabularyWord[]).map((word) => ({
    ...word,
    source: normalizeSourceLabel(word.source)
  }));
  const normalizedDictionaryWords = (dictionaryData as RawDictionaryWord[])
    .map(normalizeDictionaryEntry)
    .filter((word): word is VocabularyWord => Boolean(word));

  return mergeVocabularyLibraries(baseWords, normalizedDictionaryWords);
}

export function getAvailableSourceOptions(words: VocabularyWord[]): SourceList[] {
  const available = new Set<VocabularySource>();

  for (const word of words) {
    available.add(normalizeSourceLabel(word.source));
  }

  return [
    ALL_SOURCE_OPTION,
    ...SOURCE_DISPLAY_ORDER.filter((source) => available.has(source))
  ];
}

export function matchesSelectedSource(word: VocabularyWord, selectedSource: SourceList) {
  if (normalizeSourceListValue(selectedSource) === ALL_SOURCE_OPTION) {
    return true;
  }

  return normalizeSourceLabel(word.source) === normalizeSourceLabel(selectedSource);
}
