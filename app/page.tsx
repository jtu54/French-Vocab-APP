import { FrenchLearningApp } from "@/components/FrenchLearningApp";
import { getVocabularyLibrary } from "@/lib/vocabulary";

export default function HomePage() {
  return <FrenchLearningApp initialWords={getVocabularyLibrary()} />;
}
