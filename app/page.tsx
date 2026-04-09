import { FrenchLearningApp } from "@/components/FrenchLearningApp";
import vocabularyData from "@/data/vocabulary.sample.json";
import type { VocabularyWord } from "@/types/vocab";

export default function HomePage() {
  return <FrenchLearningApp initialWords={vocabularyData as VocabularyWord[]} />;
}
