import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { VocabularyWord, ActiveTab, AppLanguage, TrainingLanguage, AppTheme, WordGroup } from './types';
import { INITIAL_VOCABULARY } from './data/initialVocabulary';
import { INITIAL_GROUPS } from './data/initialGroups';
import { UI_TEXT } from './translations';
import { Navbar } from './components/Navbar';
import { WordCard } from './components/WordCard';
import { PronunciationTrainer } from './components/PronunciationTrainer';
import { SpellingLab } from './components/SpellingLab';
import { MatchingGame } from './components/MatchingGame';
import { PronunciationRulesGuide } from './components/PronunciationRulesGuide';
import { VocabularyManager } from './components/VocabularyManager';
import { WordGroupsView } from './components/WordGroupsView';
import { CreateGroupModal } from './components/CreateGroupModal';
import { OriginalSheetModal } from './components/OriginalSheetModal';
import { ThemeSettingsModal } from './components/ThemeSettingsModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { DeployModal } from './components/DeployModal';
import { playSound } from './utils/audio';
import { getTheme } from './utils/theme';

const STORAGE_KEY_WORDS = 'le_francais_facile_words_v5';
const STORAGE_KEY_LANG = 'le_francais_facile_lang_v5';
const STORAGE_KEY_TRAIN_LANG = 'le_francais_facile_train_lang_v5';
const STORAGE_KEY_THEME = 'le_francais_facile_theme_v5';
const STORAGE_KEY_GROUPS = 'le_francais_facile_groups_v5';
const STORAGE_KEY_ACTIVE_GROUP = 'le_francais_facile_active_group_v5';

export default function App() {
  const [trainingLang, setTrainingLang] = useState<TrainingLanguage>(() => {
    try {
      const savedTrainLang = localStorage.getItem(STORAGE_KEY_TRAIN_LANG);
      if (savedTrainLang === 'fr' || savedTrainLang === 'en') {
        return savedTrainLang;
      }
    } catch {
      // ignore
    }
    return 'fr';
  });

  const [appLang, setAppLang] = useState<AppLanguage>(() => {
    try {
      const savedLang = localStorage.getItem(STORAGE_KEY_LANG);
      if (savedLang === 'ar' || savedLang === 'en' || savedLang === 'bilingual') {
        return savedLang;
      }
    } catch {
      // ignore
    }
    return 'bilingual';
  });

  const [words, setWords] = useState<VocabularyWord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WORDS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const mergedExisting = parsed.map((item: VocabularyWord) => {
            const initialMatch = INITIAL_VOCABULARY.find((iv) => iv.id === item.id);
            return {
              ...item,
              englishMeaning: item.englishMeaning || initialMatch?.englishMeaning || item.french,
              englishPhonetic: item.englishPhonetic || initialMatch?.englishPhonetic || '',
              englishArabicPhonetic: item.englishArabicPhonetic || initialMatch?.englishArabicPhonetic || '',
              englishSyllables: item.englishSyllables || initialMatch?.englishSyllables || [item.englishMeaning],
              ipaEnglish: item.ipaEnglish || initialMatch?.ipaEnglish || '',
              pronunciationTipEn: item.pronunciationTipEn || initialMatch?.pronunciationTipEn || '',
              englishPronunciationTipAr: item.englishPronunciationTipAr || initialMatch?.englishPronunciationTipAr || '',
              englishPronunciationTipEn: item.englishPronunciationTipEn || initialMatch?.englishPronunciationTipEn || '',
              exampleEnglish: item.exampleEnglish || initialMatch?.exampleEnglish || '',
              categoryLabelEn: item.categoryLabelEn || initialMatch?.categoryLabelEn || '',
              isPrimarySchool: item.isPrimarySchool !== undefined ? item.isPrimarySchool : initialMatch?.isPrimarySchool,
              gradeLevel: item.gradeLevel || initialMatch?.gradeLevel,
            };
          });

          // Ensure any new primary school words from INITIAL_VOCABULARY are included
          const existingIds = new Set(mergedExisting.map((w: VocabularyWord) => w.id));
          const missingWords = INITIAL_VOCABULARY.filter((iv) => !existingIds.has(iv.id));
          return [...mergedExisting, ...missingWords];
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_VOCABULARY;
  });

  // Custom Word Groups State
  const [groups, setGroups] = useState<WordGroup[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_GROUPS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_GROUPS;
  });

  const [activeGroupId, setActiveGroupId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_ACTIVE_GROUP) || null;
    } catch {
      return null;
    }
  });

  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [editingGroupForModal, setEditingGroupForModal] = useState<WordGroup | null>(null);
  const [batchGroupWordIds, setBatchGroupWordIds] = useState<string[]>([]);

  const [activeTab, setActiveTab] = useState<ActiveTab>('learn');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isOriginalSheetOpen, setIsOriginalSheetOpen] = useState(false);
  const [learnViewMode, setLearnViewMode] = useState<'card' | 'grid'>('card');
  const [editingWordForModal, setEditingWordForModal] = useState<VocabularyWord | null>(null);

  const [currentTheme, setCurrentTheme] = useState<AppTheme>(() => {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEY_THEME);
      if (savedTheme && ['default', 'ocean', 'forest', 'space', 'candy'].includes(savedTheme)) {
        return savedTheme as AppTheme;
      }
    } catch {
      // ignore
    }
    return 'default';
  });

  const [isThemesModalOpen, setIsThemesModalOpen] = useState(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);

  const t = appLang === 'en' ? UI_TEXT.en : UI_TEXT.ar;
  const isRTL = appLang === 'ar' || appLang === 'bilingual';
  const themeConfig = getTheme(currentTheme);

  // Persistence effects
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_THEME, currentTheme);
    } catch {
      // ignore
    }
  }, [currentTheme]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TRAIN_LANG, trainingLang);
    } catch {
      // ignore
    }
  }, [trainingLang]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LANG, appLang);
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
      document.documentElement.lang = appLang === 'en' ? 'en' : 'ar';
    } catch {
      // ignore
    }
  }, [appLang, isRTL]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WORDS, JSON.stringify(words));
    } catch {
      // ignore
    }
  }, [words]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_GROUPS, JSON.stringify(groups));
    } catch {
      // ignore
    }
  }, [groups]);

  useEffect(() => {
    try {
      if (activeGroupId) {
        localStorage.setItem(STORAGE_KEY_ACTIVE_GROUP, activeGroupId);
      } else {
        localStorage.removeItem(STORAGE_KEY_ACTIVE_GROUP);
      }
    } catch {
      // ignore
    }
  }, [activeGroupId]);

  // Active Group Resolution
  const activeGroup = groups.find((g) => g.id === activeGroupId) || null;
  const effectiveWords = activeGroup
    ? words.filter((w) => activeGroup.wordIds.includes(w.id))
    : words;

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
      prev.map((w) => {
        if (w.id === id) {
          return { ...w, isFavorite: !w.isFavorite };
        }
        return w;
      })
    );
  };

  const handleWordMastered = (id: string) => {
    handleToggleMastered(id);
  };

  // Group Handlers
  const handleSaveGroup = (group: WordGroup) => {
    setGroups((prev) => {
      const exists = prev.some((g) => g.id === group.id);
      if (exists) {
        return prev.map((g) => (g.id === group.id ? group : g));
      }
      return [...prev, group];
    });
  };

  const handleDeleteGroup = (groupId: string) => {
    playSound('pop');
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
    if (activeGroupId === groupId) {
      setActiveGroupId(null);
    }
  };

  const handleToggleWordInGroup = (groupId: string, wordId: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          const hasWord = g.wordIds.includes(wordId);
          const newWordIds = hasWord
            ? g.wordIds.filter((id) => id !== wordId)
            : [...g.wordIds, wordId];
          return { ...g, wordIds: newWordIds };
        }
        return g;
      })
    );
  };

  const handleOpenCreateGroupModal = (
    groupToEdit?: WordGroup | null,
    preselectedWordIds: string[] = []
  ) => {
    setEditingGroupForModal(groupToEdit || null);
    setBatchGroupWordIds(preselectedWordIds);
    setIsCreateGroupModalOpen(true);
  };

  // Word CRUD
  const handleAddWord = (newWordData: Omit<VocabularyWord, 'id' | 'orderNumber'>) => {
    const newWord: VocabularyWord = {
      ...newWordData,
      id: `word-${Date.now()}`,
      orderNumber: words.length + 1,
      isMastered: false,
      practiceScore: 0,
    };
    setWords((prev) => [...prev, newWord]);
  };

  const handleUpdateWord = (updatedWord: VocabularyWord) => {
    setWords((prev) =>
      prev.map((w) => (w.id === updatedWord.id ? updatedWord : w))
    );
  };

  const handleDeleteWord = (id: string) => {
    setWords((prev) => {
      const filtered = prev.filter((w) => w.id !== id);
      return filtered.map((w, index) => ({
        ...w,
        orderNumber: index + 1,
      }));
    });
    // Remove from groups
    setGroups((prev) =>
      prev.map((g) => ({
        ...g,
        wordIds: g.wordIds.filter((wId) => wId !== id),
      }))
    );
  };

  const handleResetDefaults = () => {
    setWords(INITIAL_VOCABULARY);
    setGroups(INITIAL_GROUPS);
    setActiveGroupId(null);
    setCurrentWordIndex(0);
  };

  // Safe index within effectiveWords
  const safeWordIndex = Math.min(
    currentWordIndex,
    Math.max(0, effectiveWords.length - 1)
  );
  const currentWord = effectiveWords[safeWordIndex] || effectiveWords[0] || null;

  const handleNextWord = () => {
    if (safeWordIndex < effectiveWords.length - 1) {
      playSound('click');
      setCurrentWordIndex(safeWordIndex + 1);
    } else {
      playSound('celebration');
      setCurrentWordIndex(0);
    }
  };

  const handlePrevWord = () => {
    if (safeWordIndex > 0) {
      playSound('click');
      setCurrentWordIndex(safeWordIndex - 1);
    } else {
      playSound('click');
      setCurrentWordIndex(effectiveWords.length - 1);
    }
  };

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`min-h-screen ${themeConfig.bgPage} flex flex-col font-sans transition-colors duration-300 relative`}
    >
      {/* Top Sticky Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        masteredCount={masteredCount}
        totalCount={words.length}
        onOpenOriginalSheet={() => setIsOriginalSheetOpen(true)}
        onOpenDeployModal={() => setIsDeployModalOpen(true)}
        appLang={appLang}
        setAppLang={setAppLang}
        trainingLang={trainingLang}
        setTrainingLang={setTrainingLang}
        currentTheme={currentTheme}
        onOpenThemesModal={() => setIsThemesModalOpen(true)}
        activeGroupName={activeGroup?.name || null}
        onClearActiveGroup={() => setActiveGroupId(null)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Active Training Group Banner (shown on training modes when a group filter is active) */}
        {activeGroup && activeTab !== 'groups' && (
          <div className="bg-emerald-50 border-2 border-emerald-400 rounded-3xl p-4 sm:p-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-2xl shadow-inner shrink-0">
                {activeGroup.icon}
              </div>
              <div>
                <div className="text-xs font-black text-emerald-800 uppercase tracking-wider">
                  {appLang === 'en'
                    ? '🎯 Training Mode: Specific Word Group'
                    : '🎯 وضع التدريب: مجموعة كلمات مخصصة'}
                </div>
                <div className="font-black text-base text-emerald-950 flex items-center gap-2">
                  <span>{activeGroup.name}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-xs font-bold">
                    {effectiveWords.length} {appLang === 'en' ? 'words' : 'كلمات'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('groups')}
                className="px-4 py-2 rounded-xl bg-white text-emerald-800 text-xs font-extrabold border border-emerald-300 hover:bg-emerald-100 transition shadow-2xs"
              >
                {appLang === 'en' ? 'Manage Group' : 'إدارة المجموعة'}
              </button>
              <button
                onClick={() => {
                  playSound('pop');
                  setActiveGroupId(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-extrabold hover:bg-emerald-700 transition shadow-sm"
              >
                {appLang === 'en' ? 'Show All Words ✕' : 'إلغاء والعودة لكل الكلمات ✕'}
              </button>
            </div>
          </div>
        )}

        {/* TAB 1: LEARN CARDS */}
        {activeTab === 'learn' && (
          <div className="space-y-6">
            {effectiveWords.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border-2 border-indigo-100 shadow-sm max-w-lg mx-auto space-y-4">
                <span className="text-5xl">📂</span>
                <h3 className="text-lg font-black text-slate-800">
                  {appLang === 'en'
                    ? 'This group has no words yet!'
                    : 'هذه المجموعة لا تحتوي على كلمات بعد!'}
                </h3>
                <p className="text-xs text-slate-500">
                  {appLang === 'en'
                    ? 'Add words from the Word Index or click below to return to all words.'
                    : 'أضيفي كلمات من فهرس الكلمات أو اضغطي بالأسفل للعودة لعرض كل الكلمات.'}
                </p>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    onClick={() => setActiveTab('groups')}
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                  >
                    {appLang === 'en' ? 'Edit Group Words' : 'تعديل كلمات المجموعة'}
                  </button>
                  <button
                    onClick={() => setActiveGroupId(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                  >
                    {appLang === 'en' ? 'Show All Words' : 'عرض كل الكلمات'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Header controls & Quick Word Selector */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-indigo-100 shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">
                      {t.quickJump}
                    </span>
                    <div className="flex items-center gap-1 overflow-x-auto max-w-xs sm:max-w-md py-1 no-scrollbar">
                      {effectiveWords.map((w, idx) => {
                        const isCurrent = idx === safeWordIndex;
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
                            title={`${w.french} - ${w.englishMeaning}`}
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
                      {t.viewCard}
                    </button>
                    <button
                      onClick={() => setLearnViewMode('grid')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        learnViewMode === 'grid'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {t.viewGrid}
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
                        currentIndex={safeWordIndex}
                        totalWords={effectiveWords.length}
                        appLang={appLang}
                        trainingLang={trainingLang}
                        groups={groups}
                        onToggleWordInGroup={handleToggleWordInGroup}
                        onOpenCreateGroupModal={() => handleOpenCreateGroupModal(null)}
                      />
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {effectiveWords.map((w, idx) => (
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
                          totalWords={effectiveWords.length}
                          appLang={appLang}
                          trainingLang={trainingLang}
                          groups={groups}
                          onToggleWordInGroup={handleToggleWordInGroup}
                          onOpenCreateGroupModal={() => handleOpenCreateGroupModal(null)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* TAB 2: PRONUNCIATION TRAINER */}
        {activeTab === 'pronounce' && (
          <PronunciationTrainer
            words={effectiveWords}
            onWordMastered={handleWordMastered}
            appLang={appLang}
            trainingLang={trainingLang}
          />
        )}

        {/* TAB 3: SPELLING LAB */}
        {activeTab === 'spelling' && (
          <SpellingLab
            words={effectiveWords}
            onWordMastered={handleWordMastered}
            appLang={appLang}
            trainingLang={trainingLang}
          />
        )}

        {/* TAB 4: MATCHING GAME */}
        {activeTab === 'game' && (
          <MatchingGame
            words={effectiveWords}
            onWordMastered={handleWordMastered}
            appLang={appLang}
            trainingLang={trainingLang}
          />
        )}

        {/* TAB 5: PRONUNCIATION RULES */}
        {activeTab === 'rules' && (
          <PronunciationRulesGuide
            appLang={appLang}
            trainingLang={trainingLang}
          />
        )}

        {/* TAB 6: CUSTOM WORD GROUPS */}
        {activeTab === 'groups' && (
          <WordGroupsView
            groups={groups}
            words={words}
            activeGroupId={activeGroupId}
            onSelectActiveGroup={setActiveGroupId}
            onOpenCreateGroupModal={handleOpenCreateGroupModal}
            onDeleteGroup={handleDeleteGroup}
            appLang={appLang}
            trainingLang={trainingLang}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {/* TAB 7: VOCABULARY INDEX & CRUD */}
        {activeTab === 'index' && (
          <VocabularyManager
            words={words}
            onAddWord={handleAddWord}
            onUpdateWord={handleUpdateWord}
            onDeleteWord={handleDeleteWord}
            onResetDefaults={handleResetDefaults}
            onToggleMastered={handleToggleMastered}
            onToggleFavorite={handleToggleFavorite}
            appLang={appLang}
            trainingLang={trainingLang}
            groups={groups}
            onToggleWordInGroup={handleToggleWordInGroup}
            onOpenCreateGroupModal={handleOpenCreateGroupModal}
          />
        )}
      </main>

      {/* Create / Edit Word Group Modal */}
      <CreateGroupModal
        isOpen={isCreateGroupModalOpen}
        onClose={() => setIsCreateGroupModalOpen(false)}
        onSaveGroup={handleSaveGroup}
        words={words}
        initialGroup={editingGroupForModal}
        appLang={appLang}
        initialSelectedWordIds={batchGroupWordIds}
      />

      {/* Original Sheet Modal */}
      <OriginalSheetModal
        isOpen={isOriginalSheetOpen}
        onClose={() => setIsOriginalSheetOpen(false)}
        words={words}
        appLang={appLang}
      />

      {/* Theme Settings Modal */}
      <ThemeSettingsModal
        isOpen={isThemesModalOpen}
        onClose={() => setIsThemesModalOpen(false)}
        currentTheme={currentTheme}
        onSelectTheme={setCurrentTheme}
        appLang={appLang}
      />

      {/* Offline Status Indicator for PWA */}
      <OfflineIndicator appLang={appLang} />

      {/* Free Server Deployment Guide Modal */}
      <DeployModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
        appLang={appLang}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500 space-y-2">
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => {
              playSound('celebration');
              setIsDeployModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white font-bold text-xs shadow-xs cursor-pointer transition-all"
          >
            <span>🚀 نشر التطبيق على سيرفر مجاني للجميع</span>
          </button>
        </div>
        <p className="font-bold text-slate-700 font-french">
          Le Français Facile & English For Kids • {t.appBadge}
        </p>
        <p>
          منصة تعليم وتدريب نطق وكتابة وحفظ مفردات اللغتين الفرنسية والإنجليزية للأطفال والطلاب مع المجموعات المخصصة وتطبيق الويب التقدمي (PWA)
        </p>
      </footer>
    </div>
  );
}
