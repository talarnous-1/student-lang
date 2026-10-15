export type WordCategory = 'noun' | 'verb' | 'adjective' | 'adverb' | 'expression' | 'conjunction' | 'preposition';

export type AppLanguage = 'ar' | 'en' | 'bilingual';

export type TrainingLanguage = 'fr' | 'en';

export type AppTheme = 'default' | 'ocean' | 'forest' | 'space' | 'candy';

export interface VocabularyWord {
  id: string;
  orderNumber: number;
  french: string;
  arabicMeaning: string;
  englishMeaning: string;
  arabicPhonetic: string; // Transliteration in Arabic for French (e.g. شِيرْ)
  englishPhonetic?: string; // English phonetic approximation for French (e.g. "shehr")
  englishArabicPhonetic?: string; // Transliteration in Arabic for the ENGLISH word (e.g. دِيرْ, نِيبُورْ)
  ipa: string; // International Phonetic Alphabet for French
  ipaEnglish?: string; // IPA for English
  syllables: string[]; // French syllables: ["ren", "con", "trer"]
  englishSyllables?: string[]; // English syllables: ["neigh", "bor"]
  category: WordCategory;
  categoryLabelAr: string;
  categoryLabelEn?: string;
  pronunciationTip: string;
  pronunciationTipEn?: string;
  englishPronunciationTipAr?: string; // Tip in Arabic on how to pronounce the English word
  englishPronunciationTipEn?: string; // Tip in English on how to pronounce the English word
  exampleFrench: string;
  exampleArabic: string;
  exampleEnglish?: string;
  synonymsOrNotes?: string;
  synonymsOrNotesEn?: string;
  isMastered?: boolean;
  isFavorite?: boolean;
  practiceScore?: number; // 0 to 5
  isPrimarySchool?: boolean;
  gradeLevel?: string;
}

export interface WordGroup {
  id: string;
  name: string;
  description?: string;
  color: string; // e.g. 'purple', 'emerald', 'sky', 'amber', 'rose', 'indigo'
  icon: string; // emoji e.g. '🎯', '🎒', '🐱', '🍎', '⭐', '🚀'
  createdAt: number;
  wordIds: string[];
}

export type ActiveTab = 'learn' | 'pronounce' | 'spelling' | 'index' | 'game' | 'rules' | 'groups';

export interface UserProgress {
  stars: number;
  completedWords: string[];
  streakDays: number;
  pronunciationPractices: number;
  spellingScore: number;
}

