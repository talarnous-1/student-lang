import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, Star, ChevronLeft, ChevronRight, BookOpen, Mic, PenTool, Trophy, ListFilter, HelpCircle, FileText, ArrowRight, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { VocabularyWord, ActiveTab } from './types';
import { INITIAL_VOCABULARY } from './data/initialVocabulary';
import { Navbar } from './components/Navbar';
import { WordCard } from './components/WordCard';
import { PronunciationTrainer } from './components/PronunciationTrainer';
import { SpellingLab } from './components/SpellingLab';
import { MatchingGame } from './components/MatchingGame';
import { PronunciationRulesGuide } from './components/PronunciationRulesGuide';
import { VocabularyManager } from './components/VocabularyManager';
import { OriginalSheetModal } from './components/OriginalSheetModal';
import { playSound } from './utils/audio';

const STORAGE_KEY_WORDS = 'le_francais_facile_words_v2';

export default function App() {
  const [words, setWords] = useState<VocabularyWord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WORDS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_VOCABULARY;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('learn');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isOriginalSheetOpen, setIsOriginalSheetOpen] = useState(false);
  const [learnViewMode, setLearnViewMode] = useState<'card' | 'grid'>('card');
  const [editingWordForModal, setEditingWordForModal] = useState<VocabularyWord | null>(null);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WORDS, JSON.stringify(words));
    } catch {
      // Ignore
    }
  }, [words]);

  // Mastered count
  const masteredCount = words.filter((w) => w.isMastered).length;

  const handleToggleMastered = (id: string) => {
    setWords((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          const newState = !w.isMastered;
          if (newState) {
            confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
          }
          return { ...w, isMastered: newState };
        }
        return w;
      })
    );
  };

  const handleToggleFavorite = (id: string) => {
    playSound('pop');
    setWords((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isFavorite: !w.isFavorite } : w))
    );
  };

  const handleWordMastered = (id: string) => {
    setWords((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMastered: true } : w))
    );
  };

  const handleAddWord = (newWordData: Omit<VocabularyWord, 'id' | 'orderNumber'>) => {
    const newWord: VocabularyWord = {
      ...newWordData,
      id: `word-custom-${Date.now()}`,
      orderNumber: words.length + 1,
    };
    setWords((prev) => [...prev, newWord]);
  };

  const handleUpdateWord = (updatedWord: VocabularyWord) => {
    setWords((prev) =>
      prev.map((w) => (w.id === updatedWord.id ? updatedWord : w))
    );
  };

  const handleDeleteWord = (id: string) => {
    setWords((prev) =>
      prev
        .filter((w) => w.id !== id)
        .map((w, idx) => ({ ...w, orderNumber: idx + 1 }))
    );
    setCurrentWordIndex((prev) => Math.max(0, Math.min(prev, words.length - 2)));
  };

  const handleResetDefaults = () => {
    setWords(INITIAL_VOCABULARY);
    setCurrentWordIndex(0);
  };

  const currentWord = words[currentWordIndex] || words[0];

  const handleNextWord = () => {
    playSound('click');
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex((prev) => prev + 1);
    } else {
      setCurrentWordIndex(0);
    }
  };

  const handlePrevWord = () => {
    playSound('click');
    if (currentWordIndex > 0) {
      setCurrentWordIndex((prev) => prev - 1);
    } else {
      setCurrentWordIndex(words.length - 1);
    }
  };

  // Keyboard navigation for carousel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab !== 'learn') return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowRight') {
        handlePrevWord();
      } else if (e.key === 'ArrowLeft') {
        handleNextWord();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, currentWordIndex, words.length]);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans">
      {/* Top Sticky Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        masteredCount={masteredCount}
        totalCount={words.length}
        onOpenOriginalSheet={() => setIsOriginalSheetOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* TAB 1: LEARN CARDS */}
        {activeTab === 'learn' && (
          <div className="space-y-6">
            {/* Header controls & Quick Word Selector */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-indigo-100 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">
                  انتقال سريع للكلمات:
                </span>
                <div className="flex items-center gap-1 overflow-x-auto max-w-xs sm:max-w-md py-1 no-scrollbar">
                  {words.map((w, idx) => {
                    const isCurrent = idx === currentWordIndex;
                    return (
                      <button
                        key={w.id}
                        onClick={() => {
                          playSound('click');
                          setCurrentWordIndex(idx);
                        }}
                        className={`w-7 h-7 shrink-0 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-indigo-600 text-white shadow-xs scale-110'
                            : w.isMastered
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        title={`${w.french} - ${w.arabicMeaning}`}
                      >
                        {w.orderNumber}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* View mode toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLearnViewMode('card')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    learnViewMode === 'card'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  بطاقة مكبرة
                </button>
                <button
                  onClick={() => setLearnViewMode('grid')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    learnViewMode === 'grid'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  شبكة كل الكلمات
                </button>
              </div>
            </div>

            {/* View Mode: Card Carousel vs All Grid */}
            {learnViewMode === 'card' ? (
              <div className="max-w-2xl mx-auto">
                {currentWord && (
                  <WordCard
                    word={currentWord}
                    onToggleMastered={handleToggleMastered}
                    onToggleFavorite={handleToggleFavorite}
                    onEdit={(w) => {
                      setEditingWordForModal(w);
                      setActiveTab('index');
                    }}
                    onNext={handleNextWord}
                    onPrev={handlePrevWord}
                    currentIndex={currentWordIndex}
                    totalWords={words.length}
                  />
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {words.map((w, idx) => (
                  <div key={w.id}>
                    <WordCard
                      word={w}
                      onToggleMastered={handleToggleMastered}
                      onToggleFavorite={handleToggleFavorite}
                      onEdit={(wordToEdit) => {
                        setEditingWordForModal(wordToEdit);
                        setActiveTab('index');
                      }}
                      currentIndex={idx}
                      totalWords={words.length}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PRONUNCIATION TRAINER */}
        {activeTab === 'pronounce' && (
          <PronunciationTrainer
            words={words}
            onWordMastered={handleWordMastered}
          />
        )}

        {/* TAB 3: SPELLING LAB */}
        {activeTab === 'spelling' && (
          <SpellingLab
            words={words}
            onWordMastered={handleWordMastered}
          />
        )}

        {/* TAB 4: MATCHING GAME */}
        {activeTab === 'game' && (
          <MatchingGame
            words={words}
            onWordMastered={handleWordMastered}
          />
        )}

        {/* TAB 5: PRONUNCIATION RULES */}
        {activeTab === 'rules' && <PronunciationRulesGuide />}

        {/* TAB 6: VOCABULARY INDEX & CRUD */}
        {activeTab === 'index' && (
          <VocabularyManager
            words={words}
            onAddWord={handleAddWord}
            onUpdateWord={handleUpdateWord}
            onDeleteWord={handleDeleteWord}
            onResetDefaults={handleResetDefaults}
            onToggleMastered={handleToggleMastered}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      </main>

      {/* Original Sheet Modal */}
      <OriginalSheetModal
        isOpen={isOriginalSheetOpen}
        onClose={() => setIsOriginalSheetOpen(false)}
        words={words}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500 space-y-1">
        <p className="font-bold text-slate-700">
          Le Français Facile • أستاذ الفرنسية الذكي للفتيات والطلاب (12 سنة)
        </p>
        <p>
          مبني على منهج وحدة الفهم الشفهي (Compréhension orale) بمراعاة أصوات الحروف الفرنسية وتدقيق الإملاء
        </p>
      </footer>
    </div>
  );
}
