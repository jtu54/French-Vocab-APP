export type LegacyVocabularySource = "Textbook" | "Dictionary";
export type VocabularySource =
  | "Lexique (Common French)"
  | "Lefff (Comprehensive)"
  | "Collins Essential";
export type SourceList = "All Sources" | VocabularySource | LegacyVocabularySource;
export type PartOfSpeech = "noun" | "adjective" | "verb" | "phrase";
export type Auxiliary = "AVOIR" | "ETRE";
export type ReviewState = "new" | "review";

export interface VerbMeta {
  auxiliary?: Auxiliary;
  pronominal?: boolean;
  agreeGender?: "M" | "F";
  agreeNumber?: "S" | "P";
}

export interface VocabularyWord {
  id: string;
  french: string;
  english: string;
  partOfSpeech: PartOfSpeech;
  source: VocabularySource | LegacyVocabularySource;
  article?: "un" | "une";
  gender?: "masculine" | "feminine";
  memoryStabilityLevel: number;
  notes?: string;
  tags?: string[];
  verbMeta?: VerbMeta;
}

export interface WordProgress {
  stage: number;
  learnedAt?: string;
  lastReviewedAt?: string;
  nextReviewAt?: string;
  totalReviews: number;
  recallStrength: number;
  lastResult?: "remembered" | "forgot";
}

export interface LearnerSettings {
  wordsPerDay: number;
  sourceList: SourceList;
  alphabeticalSort: boolean;
}

export interface DailyStudyState {
  sessionDate: string;
  queuedWordIds: string[];
  wordsStudiedToday: number;
  sourceList: SourceList;
}

export interface DailyDeckEntry {
  word: VocabularyWord;
  kind: ReviewState;
  progress?: WordProgress;
}

export interface DeckSummary {
  cards: DailyDeckEntry[];
  reviewCount: number;
  newCount: number;
}

export interface ConjugationRow {
  subject: string;
  value: string;
}

export interface ConjugationSection {
  label: string;
  rows: ConjugationRow[];
  note?: string;
}
