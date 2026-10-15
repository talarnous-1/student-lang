import React, { useState } from 'react';
import { Plus, Search, Edit3, Trash2, Volume2, CheckCircle2, Bookmark, RotateCcw, Printer, Sparkles, X, Check, FolderPlus, Layers, CheckSquare, Square } from 'lucide-react';
import { VocabularyWord, WordCategory, AppLanguage, TrainingLanguage, WordGroup } from '../types';
import { UI_TEXT } from '../translations';
import { speakFrench, speakEnglish, playSound } from '../utils/audio';
import { WordGroupDropdown } from './WordGroupDropdown';

interface VocabularyManagerProps {
  words: VocabularyWord[];
  onAddWord: (word: Omit<VocabularyWord, 'id' | 'orderNumber'>) => void;
  onUpdateWord: (word: VocabularyWord) => void;
  onDeleteWord: (id: string) => void;
  onResetDefaults: () => void;
  onToggleMastered: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  appLang: AppLanguage;
  trainingLang: TrainingLanguage;
  groups?: WordGroup[];
  onToggleWordInGroup?: (groupId: string, wordId: string) => void;
  onOpenCreateGroupModal?: (group?: WordGroup | null, preselectedWordIds?: string[]) => void;
}

export const VocabularyManager: React.FC<VocabularyManagerProps> = ({
  words,
  onAddWord,
  onUpdateWord,
  onDeleteWord,
  onResetDefaults,
  onToggleMastered,
  onToggleFavorite,
  appLang,
  trainingLang,
  groups = [],
  onToggleWordInGroup,
  onOpenCreateGroupModal,
}) => {
  const t = appLang === 'en' ? UI_TEXT.en : UI_TEXT.ar;
  const [selectedForBatchGroup, setSelectedForBatchGroup] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const toggleWordSelection = (wordId: string) => {
    playSound('pop');
    setSelectedForBatchGroup((prev) =>
      prev.includes(wordId) ? prev.filter((id) => id !== wordId) : [...prev, wordId]
    );
  };

  const handleSelectAllFiltered = () => {
    playSound('pop');
    const ids = filteredWords.map((w) => w.id);
    setSelectedForBatchGroup((prev) => Array.from(new Set([...prev, ...ids])));
  };

  const handleClearSelection = () => {
    playSound('pop');
    setSelectedForBatchGroup([]);
  };

  const handleCreateGroupWithSelected = () => {
    if (selectedForBatchGroup.length === 0) return;
    playSound('celebration');
    onOpenCreateGroupModal?.(null, selectedForBatchGroup);
  };

  const handleAddSelectedToExistingGroup = (groupId: string) => {
    if (!groupId || selectedForBatchGroup.length === 0 || !onToggleWordInGroup) return;
    playSound('correct');
    const targetGroup = groups.find((g) => g.id === groupId);
    if (!targetGroup) return;
    selectedForBatchGroup.forEach((wId) => {
      if (!targetGroup.wordIds.includes(wId)) {
        onToggleWordInGroup(groupId, wId);
      }
    });
    setSelectedForBatchGroup([]);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterMastered, setFilterMastered] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<VocabularyWord | null>(null);

  // Form State
  const [french, setFrench] = useState('');
  const [arabicMeaning, setArabicMeaning] = useState('');
  const [englishMeaning, setEnglishMeaning] = useState('');
  const [arabicPhonetic, setArabicPhonetic] = useState('');
  const [englishPhonetic, setEnglishPhonetic] = useState('');
  const [englishArabicPhonetic, setEnglishArabicPhonetic] = useState('');
  const [ipa, setIpa] = useState('');
  const [syllablesInput, setSyllablesInput] = useState('');
  const [englishSyllablesInput, setEnglishSyllablesInput] = useState('');
  const [category, setCategory] = useState<WordCategory>('noun');
  const [categoryLabelAr, setCategoryLabelAr] = useState('اسم (Nom)');
  const [categoryLabelEn, setCategoryLabelEn] = useState('Noun');
  const [pronunciationTip, setPronunciationTip] = useState('');
  const [englishPronunciationTipAr, setEnglishPronunciationTipAr] = useState('');
  const [exampleFrench, setExampleFrench] = useState('');
  const [exampleArabic, setExampleArabic] = useState('');
  const [exampleEnglish, setExampleEnglish] = useState('');
  const [synonymsOrNotes, setSynonymsOrNotes] = useState('');

  const openAddModal = () => {
    setEditingWord(null);
    setFrench('');
    setArabicMeaning('');
    setEnglishMeaning('');
    setArabicPhonetic('');
    setEnglishPhonetic('');
    setEnglishArabicPhonetic('');
    setIpa('');
    setSyllablesInput('');
    setEnglishSyllablesInput('');
    setCategory('noun');
    setCategoryLabelAr('اسم (Nom)');
    setCategoryLabelEn('Noun');
    setPronunciationTip('');
    setEnglishPronunciationTipAr('');
    setExampleFrench('');
    setExampleArabic('');
    setExampleEnglish('');
    setSynonymsOrNotes('');
    setIsModalOpen(true);
    playSound('pop');
  };

  const openEditModal = (word: VocabularyWord) => {
    setEditingWord(word);
    setFrench(word.french);
    setArabicMeaning(word.arabicMeaning);
    setEnglishMeaning(word.englishMeaning || '');
    setArabicPhonetic(word.arabicPhonetic);
    setEnglishPhonetic(word.englishPhonetic || '');
    setEnglishArabicPhonetic(word.englishArabicPhonetic || '');
    setIpa(word.ipa);
    setSyllablesInput(word.syllables.join(' - '));
    setEnglishSyllablesInput(word.englishSyllables ? word.englishSyllables.join(' - ') : '');
    setCategory(word.category);
    setCategoryLabelAr(word.categoryLabelAr);
    setCategoryLabelEn(word.categoryLabelEn || 'Noun');
    setPronunciationTip(word.pronunciationTip);
    setEnglishPronunciationTipAr(word.englishPronunciationTipAr || '');
    setExampleFrench(word.exampleFrench);
    setExampleArabic(word.exampleArabic);
    setExampleEnglish(word.exampleEnglish || '');
    setSynonymsOrNotes(word.synonymsOrNotes || '');
    setIsModalOpen(true);
    playSound('pop');
  };

  const handleCategoryChange = (cat: WordCategory) => {
    setCategory(cat);
    switch (cat) {
      case 'verb':
        setCategoryLabelAr('فعل (Verbe)');
        setCategoryLabelEn('Verb');
        break;
      case 'adjective':
        setCategoryLabelAr('صفة (Adjectif)');
        setCategoryLabelEn('Adjective');
        break;
      case 'adverb':
        setCategoryLabelAr('ظرف (Adverbe)');
        setCategoryLabelEn('Adverb');
        break;
      case 'expression':
        setCategoryLabelAr('تعبير (Expression)');
        setCategoryLabelEn('Expression');
        break;
      case 'conjunction':
        setCategoryLabelAr('أداة ربط (Conjonction)');
        setCategoryLabelEn('Conjunction');
        break;
      case 'preposition':
        setCategoryLabelAr('حرف جر (Préposition)');
        setCategoryLabelEn('Preposition');
        break;
      default:
        setCategoryLabelAr('اسم (Nom)');
        setCategoryLabelEn('Noun');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!french.trim() && !englishMeaning.trim()) {
      alert('يرجى إدخال الكلمة بالفرنسية أو بالإنجليزية مع معناها.');
      return;
    }

    const frSyllablesArray = syllablesInput
      .split(/[-–—, ]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    const enSyllablesArray = englishSyllablesInput
      .split(/[-–—, ]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    const finalFrSyllables = frSyllablesArray.length > 0 ? frSyllablesArray : [french.trim() || '—'];
    const finalEnSyllables = enSyllablesArray.length > 0 ? enSyllablesArray : [englishMeaning.trim() || '—'];

    const wordData = {
      french: french.trim() || englishMeaning.trim(),
      arabicMeaning: arabicMeaning.trim() || '—',
      englishMeaning: englishMeaning.trim() || french.trim(),
      arabicPhonetic: arabicPhonetic.trim() || '—',
      englishPhonetic: englishPhonetic.trim() || french.trim().toLowerCase(),
      englishArabicPhonetic: englishArabicPhonetic.trim() || '—',
      ipa: ipa.trim() || `[${french.trim().toLowerCase()}]`,
      syllables: finalFrSyllables,
      englishSyllables: finalEnSyllables,
      category,
      categoryLabelAr,
      categoryLabelEn,
      pronunciationTip: pronunciationTip.trim() || 'انتبهي لنطق الحروف ومخارج الأصوات بدقة.',
      englishPronunciationTipAr: englishPronunciationTipAr.trim() || 'انتبهي للحروف الصامتة وأصوات المد في الكلمة الإنجليزية.',
      exampleFrench: exampleFrench.trim() || french.trim(),
      exampleArabic: exampleArabic.trim() || arabicMeaning.trim(),
      exampleEnglish: exampleEnglish.trim() || englishMeaning.trim(),
      synonymsOrNotes: synonymsOrNotes.trim(),
    };

    if (editingWord) {
      onUpdateWord({
        ...editingWord,
        ...wordData,
      });
    } else {
      onAddWord({
        ...wordData,
        isMastered: false,
        isFavorite: false,
        practiceScore: 0,
      });
    }

    setIsModalOpen(false);
    playSound('correct');
  };

  const handleTestAudioFrench = () => {
    if (!french.trim()) return;
    playSound('pop');
    speakFrench(french.trim(), 'normal');
  };

  const handleTestAudioEnglish = () => {
    if (!englishMeaning.trim()) return;
    playSound('pop');
    speakEnglish(englishMeaning.trim(), 'normal');
  };

  // Filter words
  const filteredWords = words.filter((w) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      w.french.toLowerCase().includes(q) ||
      w.arabicMeaning.toLowerCase().includes(q) ||
      (w.englishMeaning && w.englishMeaning.toLowerCase().includes(q)) ||
      w.arabicPhonetic.toLowerCase().includes(q) ||
      (w.englishPhonetic && w.englishPhonetic.toLowerCase().includes(q));

    const matchesCategory =
      selectedCategory === 'all' || w.category === selectedCategory;

    const matchesMastered =
      filterMastered === 'all'
        ? true
        : filterMastered === 'primary'
        ? !!w.isPrimarySchool
        : filterMastered === 'mastered'
        ? w.isMastered
        : filterMastered === 'unmastered'
        ? !w.isMastered
        : filterMastered === 'favorite'
        ? w.isFavorite
        : filterMastered.startsWith('group:')
        ? !!groups.find((g) => g.id === filterMastered.replace('group:', ''))?.wordIds.includes(w.id)
        : true;

    return matchesSearch && matchesCategory && matchesMastered;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-right">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/30 px-3 py-1 rounded-full text-xs font-semibold text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>فهرس الكلمات متعدد اللغات (فرنسي وإنجليزي)</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black">
            فهرس كلمات الفرنسية والإنجليزية 📋
          </h2>
          <p className="text-xs text-slate-300 max-w-xl">
            يمكنكِ إضافة كلمات جديدة بالإنجليزية أو بالفرنسية، تعديل النطق الصوتي والمقاطع، أو تجربة الاستماع لأي كلمة باللغتين!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={openAddModal}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-300 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addWordBtn}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 flex items-center gap-2 cursor-pointer transition-all"
            title="Print list"
          >
            <Printer className="w-4 h-4" />
            <span>{t.printBtn}</span>
          </button>

          <button
            onClick={() => {
              if (confirm('هل ترغبين باستعادة قائمة الكلمات الأصلية؟')) {
                onResetDefaults();
                playSound('celebration');
              }
            }}
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs border border-white/20 cursor-pointer"
            title="Restore original words"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 border-2 border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحثي بالفرنسية، الإنجليزية، أو العربية..."
              className="w-full pr-12 pl-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="shrink-0 w-full md:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-auto px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 font-bold text-xs outline-none cursor-pointer"
            >
              <option value="all">{t.allCategories}</option>
              <option value="noun">أسماء (Noms / Nouns)</option>
              <option value="verb">أفعال (Verbes / Verbs)</option>
              <option value="adjective">صفات (Adjectifs / Adjectives)</option>
              <option value="adverb">ظروف (Adverbes / Adverbs)</option>
              <option value="expression">تعبيرات (Expressions)</option>
            </select>
          </div>

          {/* Mastered Filter */}
          <div className="shrink-0 w-full md:w-auto">
            <select
              value={filterMastered}
              onChange={(e) => setFilterMastered(e.target.value)}
              className="w-full md:w-auto px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 font-bold text-xs outline-none cursor-pointer"
            >
              <option value="all">{t.allStatuses}</option>
              <option value="primary">🎒 كلمات الابتدائي (Primary)</option>
              <option value="mastered">{t.masteredOnly}</option>
              <option value="unmastered">{t.learningOnly}</option>
              <option value="favorite">{t.favoritesOnly}</option>
              {groups.length > 0 && (
                <optgroup label="📂 المجموعات المخصصة">
                  {groups.map((g) => (
                    <option key={g.id} value={`group:${g.id}`}>
                      {g.icon} {g.name} ({g.wordIds.length})
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>
        </div>

        {/* Counter and Multi-Select Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span>
              عرض <span className="font-bold text-indigo-600">{filteredWords.length}</span> من أصل <span className="font-bold text-slate-800">{words.length}</span> كلمة
            </span>
            {words.some((w) => w.isMastered) && (
              <span className="text-emerald-700 font-bold hidden sm:inline">
                • ✓ أُتقنت {words.filter((w) => w.isMastered).length}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              playSound('pop');
              setIsSelectionMode(!isSelectionMode);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              isSelectionMode || selectedForBatchGroup.length > 0
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
            }`}
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>
              {isSelectionMode || selectedForBatchGroup.length > 0
                ? `وضع التحديد (${selectedForBatchGroup.length} محددة)`
                : 'تحديد كلمات لمجموعة 📂'}
            </span>
          </button>
        </div>
      </div>

      {/* Floating / Sticky Batch Action Bar when words are selected or selection mode is active */}
      {(isSelectionMode || selectedForBatchGroup.length > 0) && (
        <div className="bg-gradient-to-r from-indigo-900 to-indigo-950 text-white rounded-2xl p-4 shadow-lg border border-indigo-700 flex flex-col md:flex-row items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2 text-sm font-bold">
            <span className="p-1.5 bg-indigo-500/30 rounded-lg text-amber-300">
              <CheckSquare className="w-4 h-4" />
            </span>
            <span>
              تم اختيار <span className="text-amber-300 font-black text-base">{selectedForBatchGroup.length}</span> كلمة
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={handleSelectAllFiltered}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-all cursor-pointer"
            >
              تحديد كل المعروض ({filteredWords.length})
            </button>

            {selectedForBatchGroup.length > 0 && (
              <button
                onClick={handleClearSelection}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-rose-200 transition-all cursor-pointer"
              >
                إلغاء التحديد
              </button>
            )}

            {/* Add to Existing Group Dropdown */}
            {groups.length > 0 && selectedForBatchGroup.length > 0 && (
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddSelectedToExistingGroup(e.target.value);
                    e.target.value = '';
                  }
                }}
                defaultValue=""
                className="px-3 py-1.5 rounded-xl bg-indigo-800 text-white text-xs font-bold border border-indigo-600 outline-none cursor-pointer"
              >
                <option value="" disabled>
                  + إضافة إلى مجموعة...
                </option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.icon} {g.name}
                  </option>
                ))}
              </select>
            )}

            <button
              disabled={selectedForBatchGroup.length === 0}
              onClick={handleCreateGroupWithSelected}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-indigo-950 text-xs font-black shadow-md flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <FolderPlus className="w-4 h-4" />
              <span>إنشاء مجموعة جديدة بالكلمات 🌟</span>
            </button>
          </div>
        </div>
      )}

      {/* Words Table / List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredWords.map((word) => (
          <div
            key={word.id}
            className={`bg-white rounded-2xl p-5 border-2 transition-all space-y-4 hover:shadow-md ${
              selectedForBatchGroup.includes(word.id)
                ? 'border-indigo-500 ring-2 ring-indigo-200 bg-indigo-50/15'
                : word.isMastered
                ? 'border-emerald-200 bg-emerald-50/10'
                : 'border-slate-200 hover:border-indigo-200'
            }`}
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                {/* Select checkbox */}
                <button
                  type="button"
                  onClick={() => toggleWordSelection(word.id)}
                  className={`mt-0.5 p-1.5 rounded-xl border transition-all cursor-pointer ${
                    selectedForBatchGroup.includes(word.id)
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                      : 'border-slate-200 text-slate-300 hover:border-indigo-400 hover:text-indigo-600 bg-slate-50'
                  }`}
                  title={selectedForBatchGroup.includes(word.id) ? 'إلغاء التحديد' : 'تحديد الكلمة للمجموعة'}
                >
                  {selectedForBatchGroup.includes(word.id) ? (
                    <CheckSquare className="w-4 h-4 text-white" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">
                      #{word.orderNumber}
                    </span>
                    <span className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                      {word.categoryLabelAr} • {word.categoryLabelEn || 'Noun'}
                    </span>
                    {word.isMastered && (
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {t.mastered}
                      </span>
                    )}
                  </div>

                {/* French & English titles with speech buttons */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-500">🇫🇷</span>
                    <h3 className="text-2xl font-french font-bold text-slate-900" dir="ltr">
                      {word.french}
                    </h3>
                    <button
                      onClick={() => {
                        playSound('pop');
                        speakFrench(word.french, 'normal');
                      }}
                      className="p-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 cursor-pointer"
                      title="استمع للفرنسية"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-500">🇬🇧</span>
                    <h4 className="text-xl font-french font-bold text-blue-900" dir="ltr">
                      {word.englishMeaning}
                    </h4>
                    <button
                      onClick={() => {
                        playSound('pop');
                        speakEnglish(word.englishMeaning, 'normal');
                      }}
                      className="p-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 cursor-pointer"
                      title="Listen to English"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
              <div className="flex items-center gap-1">
                {onToggleWordInGroup && onOpenCreateGroupModal && (
                  <WordGroupDropdown
                    wordId={word.id}
                    groups={groups}
                    onToggleWordInGroup={onToggleWordInGroup}
                    onOpenCreateGroupModal={() => onOpenCreateGroupModal(null)}
                    appLang={appLang}
                  />
                )}

                <button
                  onClick={() => onToggleFavorite(word.id)}
                  className={`p-2 rounded-xl border transition-all ${
                    word.isFavorite
                      ? 'bg-amber-100 border-amber-300 text-amber-800'
                      : 'border-slate-200 text-slate-400 hover:text-slate-600'
                  }`}
                  title="Bookmark"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => openEditModal(word)}
                  className="p-2 rounded-xl border border-slate-200 text-indigo-600 hover:bg-indigo-50 transition-colors"
                  title="تعديل الكلمة"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    if (confirm(`هل أنتِ متأكدة من حذف (${word.french} / ${word.englishMeaning})؟`)) {
                      onDeleteWord(word.id);
                      playSound('click');
                    }
                  }}
                  className="p-2 rounded-xl border border-slate-200 text-rose-500 hover:bg-rose-50 transition-colors"
                  title="حذف"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Meanings & Phonetics */}
            <div className="space-y-1.5 bg-slate-50 rounded-xl p-3">
              <div className="text-base font-bold text-indigo-950">
                {word.arabicMeaning}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
                <span className="text-indigo-800 font-bold bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-lg">
                  نطق فرنسي: {word.arabicPhonetic}
                </span>
                {word.englishArabicPhonetic && (
                  <span className="text-blue-800 font-bold bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-lg">
                    نطق إنجليزي: {word.englishArabicPhonetic}
                  </span>
                )}
              </div>
            </div>

            {/* Syllables */}
            <div className="text-xs space-y-1 text-slate-600">
              <div className="flex items-center gap-1">
                <span className="font-bold text-slate-500">مقاطع فرنسية:</span>
                <span className="font-french font-semibold text-indigo-700" dir="ltr">
                  {word.syllables.join(' • ')}
                </span>
              </div>
              {word.englishSyllables && (
                <div className="flex items-center gap-1">
                  <span className="font-bold text-slate-500">مقاطع إنجليزية:</span>
                  <span className="font-french font-semibold text-blue-700" dir="ltr">
                    {word.englishSyllables.join(' • ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Word Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 space-y-6 shadow-2xl border border-indigo-100 my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  {editingWord ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    {editingWord ? 'تعديل بيانات الكلمة' : 'إضافة كلمة جديدة (فرنسي / إنجليزي)'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    أدخلي الكلمة مع إمكانية تجربة النطق الصوتي فوراً بالفرنسية والإنجليزية
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* French Word with Audio Test */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  الكلمة بالفرنسية (French Word)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    dir="ltr"
                    value={french}
                    onChange={(e) => setFrench(e.target.value)}
                    placeholder="Ex: papillon, bonjour..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 font-french font-bold text-lg outline-none"
                  />
                  {french.trim() && (
                    <button
                      type="button"
                      onClick={handleTestAudioFrench}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>صوت فرنسي 🇫🇷</span>
                    </button>
                  )}
                </div>
              </div>

              {/* English Word with Audio Test */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  الكلمة بالإنجليزية (English Word)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    dir="ltr"
                    value={englishMeaning}
                    onChange={(e) => setEnglishMeaning(e.target.value)}
                    placeholder="Ex: butterfly, hello, neighbor..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-french font-bold text-lg outline-none"
                  />
                  {englishMeaning.trim() && (
                    <button
                      type="button"
                      onClick={handleTestAudioEnglish}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>صوت إنجليزي 🇬🇧</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Arabic Meaning */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  المعنى باللغة العربية *
                </label>
                <input
                  type="text"
                  required
                  value={arabicMeaning}
                  onChange={(e) => setArabicMeaning(e.target.value)}
                  placeholder="مثال: فراشة، مرحباً، جار..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none text-sm font-semibold"
                />
              </div>

              {/* Arabic Phonetics for both */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    نطق الفرنسي بالعربي (شِيرْ)
                  </label>
                  <input
                    type="text"
                    value={arabicPhonetic}
                    onChange={(e) => setArabicPhonetic(e.target.value)}
                    placeholder="مثال: بَا-بِي-يُونْ"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    نطق الإنجليزي بالعربي (بَاتَرْفْلَاي)
                  </label>
                  <input
                    type="text"
                    value={englishArabicPhonetic}
                    onChange={(e) => setEnglishArabicPhonetic(e.target.value)}
                    placeholder="مثال: نِيبُورْ"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none text-sm"
                  />
                </div>
              </div>

              {/* Syllables inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    مقاطع الفرنسية (pa - pil - lon)
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={syllablesInput}
                    onChange={(e) => setSyllablesInput(e.target.value)}
                    placeholder="pa - pil - lon"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none text-sm font-french"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    مقاطع الإنجليزية (neigh - bor)
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={englishSyllablesInput}
                    onChange={(e) => setEnglishSyllablesInput(e.target.value)}
                    placeholder="but - ter - fly"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none text-sm font-french"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  نوع الكلمة (Catégorie)
                </label>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value as WordCategory)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-xs outline-none"
                >
                  <option value="noun">اسم (Noun / Nom)</option>
                  <option value="verb">فعل (Verb / Verbe)</option>
                  <option value="adjective">صفة (Adjective / Adjectif)</option>
                  <option value="adverb">ظرف (Adverb / Adverbe)</option>
                  <option value="expression">تعبير (Expression)</option>
                </select>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingWord ? 'حفظ التعديلات' : 'إضافة الكلمة إلى الفهرس'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
