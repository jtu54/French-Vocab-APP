import type {
  ComposedTenseOptions,
  FrenchAux,
  GendersMF,
  Numbers,
  Tense,
  Voice
} from "french-verbs";
import type { VerbsInfo } from "french-verbs-lefff";

import type { ConjugationSection, VocabularyWord } from "@/types/vocab";

type FrenchVerbsLibrary = typeof import("french-verbs");

const STANDARD_SUBJECTS = ["je", "tu", "il / elle", "nous", "vous", "ils / elles"];
const SUBJUNCTIVE_SUBJECTS = [
  "que je",
  "que tu",
  "qu’il / elle",
  "que nous",
  "que vous",
  "qu’ils / elles"
];
const IMPERATIVE_SUBJECTS = ["tu", "nous", "vous"];
const IMPERATIVE_PERSONS = [1, 3, 4];
const DEFAULT_VOICE: Voice = "Act";

interface ConjugationDefinition {
  label: string;
  tense: Tense;
  subjects?: readonly string[];
  imperative?: boolean;
}

const CONJUGATION_SETS: ConjugationDefinition[] = [
  { label: "Présent", tense: "PRESENT" },
  { label: "Passé Composé", tense: "PASSE_COMPOSE" },
  { label: "Imparfait", tense: "IMPARFAIT" },
  { label: "Futur Simple", tense: "FUTUR" },
  { label: "Plus-que-parfait", tense: "PLUS_QUE_PARFAIT" },
  { label: "Passé Simple", tense: "PASSE_SIMPLE" },
  { label: "Passé Antérieur", tense: "PASSE_ANTERIEUR" },
  { label: "Futur Antérieur", tense: "FUTUR_ANTERIEUR" },
  { label: "Conditionnel Présent", tense: "CONDITIONNEL_PRESENT" },
  { label: "Conditionnel Passé", tense: "CONDITIONNEL_PASSE_1" },
  { label: "Subjonctif Présent", tense: "SUBJONCTIF_PRESENT", subjects: SUBJUNCTIVE_SUBJECTS },
  { label: "Subjonctif Passé", tense: "SUBJONCTIF_PASSE", subjects: SUBJUNCTIVE_SUBJECTS },
  { label: "Impératif", tense: "IMPERATIF_PRESENT", imperative: true },
  { label: "Impératif Passé", tense: "IMPERATIF_PASSE", imperative: true }
];

let verbsModulePromise: Promise<{
  FrenchVerbs: FrenchVerbsLibrary;
  verbList: VerbsInfo;
}> | null = null;

function getVerbModule() {
  if (!verbsModulePromise) {
    verbsModulePromise = Promise.all([
      import("french-verbs"),
      import("french-verbs-lefff/dist/conjugations.json")
    ]).then(([verbsModule, listModule]) => ({
      FrenchVerbs: (verbsModule.default ?? verbsModule) as unknown as FrenchVerbsLibrary,
      verbList: (listModule.default ?? listModule) as VerbsInfo
    }));
  }

  return verbsModulePromise;
}

function getAuxiliary(word: VocabularyWord, library: FrenchVerbsLibrary) {
  if (word.verbMeta?.auxiliary) {
    return word.verbMeta.auxiliary;
  }

  return library.getAux(word.french, "AVOIR", word.verbMeta?.pronominal) ?? "AVOIR";
}

function getAgreementOptions(word: VocabularyWord, library: FrenchVerbsLibrary): ComposedTenseOptions {
  return {
    aux: getAuxiliary(word, library) as FrenchAux,
    agreeGender: (word.verbMeta?.agreeGender ?? "F") as GendersMF,
    agreeNumber: (word.verbMeta?.agreeNumber ?? "S") as Numbers
  };
}

function safeConjugation(
  library: FrenchVerbsLibrary,
  verbList: VerbsInfo,
  verb: string,
  tense: Tense,
  person: number,
  options: ComposedTenseOptions,
  pronominal = false
) {
  try {
    return (
      library.getConjugation(
        verbList,
        verb,
        tense,
        person,
        options,
        pronominal,
        undefined,
        undefined,
        DEFAULT_VOICE
      ) || "—"
    );
  } catch {
    return "—";
  }
}

function buildRows(
  library: FrenchVerbsLibrary,
  verbList: VerbsInfo,
  word: VocabularyWord,
  tense: Tense,
  subjects = STANDARD_SUBJECTS
) {
  return subjects.map((subject, person) => ({
    subject,
    value: safeConjugation(
      library,
      verbList,
      word.french,
      tense,
      person,
      getAgreementOptions(word, library),
      word.verbMeta?.pronominal ?? false
    )
  }));
}

function buildImperativeRows(
  library: FrenchVerbsLibrary,
  verbList: VerbsInfo,
  word: VocabularyWord,
  tense: Tense
) {
  return IMPERATIVE_SUBJECTS.map((subject, index) => ({
    subject,
    value: safeConjugation(
      library,
      verbList,
      word.french,
      tense,
      IMPERATIVE_PERSONS[index],
      getAgreementOptions(word, library),
      word.verbMeta?.pronominal ?? false
    )
  }));
}

function buildPeriphrasticRows(
  library: FrenchVerbsLibrary,
  verbList: VerbsInfo,
  helperVerb: "aller" | "venir",
  word: VocabularyWord,
  particle?: string
) {
  return STANDARD_SUBJECTS.map((subject, person) => {
    const helper = safeConjugation(
      library,
      verbList,
      helperVerb,
      "PRESENT",
      person,
      {},
      false
    );
    const pieces = [helper, particle, word.french].filter(Boolean);

    return {
      subject,
      value: pieces.join(" ")
    };
  });
}

export async function getVerbConjugationSections(word: VocabularyWord): Promise<ConjugationSection[]> {
  const { FrenchVerbs, verbList } = await getVerbModule();

  const sections: ConjugationSection[] = CONJUGATION_SETS.map((definition) => ({
    label: definition.label,
    rows: definition.imperative
      ? buildImperativeRows(FrenchVerbs, verbList, word, definition.tense)
      : buildRows(
          FrenchVerbs,
          verbList,
          word,
          definition.tense,
          definition.subjects ? [...definition.subjects] : [...STANDARD_SUBJECTS]
        )
  }));

  sections.splice(4, 0, {
    label: "Futur Proche",
    rows: buildPeriphrasticRows(FrenchVerbs, verbList, "aller", word),
    note: "Built locally from present tense of aller + infinitive."
  });

  sections.splice(8, 0, {
    label: "Passé Récent",
    rows: buildPeriphrasticRows(FrenchVerbs, verbList, "venir", word, "de"),
    note: "Built locally from present tense of venir + de + infinitive."
  });

  return sections;
}
