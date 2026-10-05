export type WordCategory = 'noun' | 'verb' | 'adjective' | 'adverb' | 'expression' | 'conjunction' | 'preposition';

export interface VocabularyWord {
  id: string;
  orderNumber: number;
  french: string;
  arabicMeaning: string;
  arabicPhonetic: string; // Transliteration in Arabic with vowels (e.g. شِيرْ)
  ipa: string; // International Phonetic Alphabet (e.g. [ʃɛʁ])
  syllables: string[]; // e.g. ["ren", "con", "trer"]
  category: WordCategory;
  categoryLabelAr: string; // e.g. "فعل", "اسم مذكر", etc.
  pronunciationTip: string; // Teacher's practical tip for a 12yo learner
  exampleFrench: string;
  exampleArabic: string;
  synonymsOrNotes?: string;
  isMastered?: boolean;
  isFavorite?: boolean;
  practiceScore?: number; // 0 to 5
}

export type ActiveTab = 'learn' | 'pronounce' | 'spelling' | 'index' | 'game' | 'rules';

export interface UserProgress {
  stars: number;
  completedWords: string[];
  streakDays: number;
  pronunciationPractices: number;
  spellingScore: number;
}
