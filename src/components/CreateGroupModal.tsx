import React, { useState } from 'react';
import { X, Search, Check, Sparkles, FolderPlus, CheckSquare, Square } from 'lucide-react';
import confetti from 'canvas-confetti';
import { VocabularyWord, WordGroup, AppLanguage } from '../types';
import { playSound } from '../utils/audio';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveGroup: (group: WordGroup) => void;
  words: VocabularyWord[];
  initialGroup?: WordGroup | null;
  appLang: AppLanguage;
  initialSelectedWordIds?: string[];
}

const EMOJI_OPTIONS = ['🎒', '🐾', '⚡', '🌟', '🍎', '🚀', '🎨', '🏡', '📚', '🏆', '🎯', '💡', '🦁', '🌈'];
const COLOR_OPTIONS = [
  { id: 'indigo', nameAr: 'نيلي', nameEn: 'Indigo', bg: 'bg-indigo-500', border: 'border-indigo-500' },
  { id: 'emerald', nameAr: 'زمردي', nameEn: 'Emerald', bg: 'bg-emerald-500', border: 'border-emerald-500' },
  { id: 'amber', nameAr: 'ذهبي', nameEn: 'Amber', bg: 'bg-amber-500', border: 'border-amber-500' },
  { id: 'rose', nameAr: 'وردي', nameEn: 'Rose', bg: 'bg-rose-500', border: 'border-rose-500' },
  { id: 'sky', nameAr: 'سماوي', nameEn: 'Sky', bg: 'bg-sky-500', border: 'border-sky-500' },
  { id: 'purple', nameAr: 'بنفسجي', nameEn: 'Purple', bg: 'bg-purple-500', border: 'border-purple-500' },
];

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
  onSaveGroup,
  words,
  initialGroup,
  appLang,
  initialSelectedWordIds = [],
}) => {
  const isEn = appLang === 'en';

  const [name, setName] = useState(initialGroup ? initialGroup.name : '');
  const [description, setDescription] = useState(initialGroup?.description || '');
  const [selectedIcon, setSelectedIcon] = useState(initialGroup?.icon || '🎒');
  const [selectedColor, setSelectedColor] = useState(initialGroup?.color || 'indigo');
  const [selectedWordIds, setSelectedWordIds] = useState<string[]>(
    initialGroup ? initialGroup.wordIds : initialSelectedWordIds
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'primary' | 'selected'>('all');

  // Reset or initialize on open
  React.useEffect(() => {
    if (initialGroup) {
      setName(initialGroup.name);
      setDescription(initialGroup.description || '');
      setSelectedIcon(initialGroup.icon);
      setSelectedColor(initialGroup.color);
      setSelectedWordIds(initialGroup.wordIds);
    } else {
      setName('');
      setDescription('');
      setSelectedIcon('🎒');
      setSelectedColor('indigo');
      setSelectedWordIds(initialSelectedWordIds);
    }
    setSearchQuery('');
    setFilterMode('all');
  }, [initialGroup, initialSelectedWordIds, isOpen]);

  if (!isOpen) return null;

  const toggleWord = (wordId: string) => {
    playSound('pop');
    setSelectedWordIds((prev) =>
      prev.includes(wordId) ? prev.filter((id) => id !== wordId) : [...prev, wordId]
    );
  };

  const selectAllFiltered = (filteredList: VocabularyWord[]) => {
    playSound('pop');
    const idsToAdd = filteredList.map((w) => w.id);
    setSelectedWordIds((prev) => Array.from(new Set([...prev, ...idsToAdd])));
  };

  const clearAllSelected = () => {
    playSound('pop');
    setSelectedWordIds([]);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const group: WordGroup = {
      id: initialGroup ? initialGroup.id : `group-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      icon: selectedIcon,
      color: selectedColor,
      createdAt: initialGroup ? initialGroup.createdAt : Date.now(),
      wordIds: selectedWordIds,
    };

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    playSound('success');
    onSaveGroup(group);
    onClose();
  };

  // Filter word list
  const filteredWords = words.filter((w) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      w.french.toLowerCase().includes(q) ||
      w.englishMeaning.toLowerCase().includes(q) ||
      w.arabicMeaning.toLowerCase().includes(q) ||
      w.arabicPhonetic.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (filterMode === 'primary') return !!w.isPrimarySchool;
    if (filterMode === 'selected') return selectedWordIds.includes(w.id);
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-indigo-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-inner">
              {selectedIcon}
            </div>
            <div>
              <h2 className="text-lg font-black flex items-center gap-2">
                {initialGroup
                  ? isEn
                    ? 'Edit Word Group'
                    : 'تعديل مجموعة الكلمات'
                  : isEn
                  ? 'Create New Word Group'
                  : 'إنشاء مجموعة كلمات جديدة'}
                <Sparkles className="w-4 h-4 text-amber-300" />
              </h2>
              <p className="text-xs text-indigo-100">
                {isEn
                  ? 'Choose a name, icon, and pick words to train on anytime!'
                  : 'حددي اسماً وأيقونة واختاري الكلمات للتدريب عليها بشكل مخصص!'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Group Name & Icon */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isEn ? 'Group Name *' : 'اسم المجموعة *'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isEn ? 'e.g. My Favorite Animals, Friday Quiz' : 'مثال: حيواناتي المفضلة، اختبار الخميس...'}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-bold text-slate-800 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isEn ? 'Theme Color' : 'لون السمة'}
              </label>
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedColor(c.id)}
                    className={`w-6 h-6 rounded-full ${c.bg} transition transform ${
                      selectedColor === c.id ? 'scale-125 ring-2 ring-offset-2 ring-indigo-500 shadow-md' : 'opacity-70 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isEn ? 'Description or Note (Optional)' : 'ملاحظة أو وصف مختصر (اختياري)'}
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={isEn ? 'e.g. Words I need to practice for the test' : 'مثال: كلمات هامة للتدرب على إملائها هذا الأسبوع'}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {isEn ? 'Choose Icon' : 'اختاري أيقونة المجموعة:'}
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedIcon(emoji)}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center shrink-0 transition ${
                    selectedIcon === emoji
                      ? 'bg-indigo-100 border-2 border-indigo-600 shadow-sm scale-110'
                      : 'bg-slate-100 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Word Selection Header & Filters */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <FolderPlus className="w-4 h-4 text-indigo-600" />
                  <span>{isEn ? 'Select Words for this Group' : 'اختاري الكلمات التابعة لهذه المجموعة:'}</span>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-black">
                    {selectedWordIds.length} {isEn ? 'selected' : 'محددة'}
                  </span>
                </label>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => selectAllFiltered(filteredWords)}
                  className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold transition flex items-center gap-1"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Select Visible' : 'تحديد الظاهرة'}</span>
                </button>
                {selectedWordIds.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAllSelected}
                    className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold transition flex items-center gap-1"
                  >
                    <Square className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Clear All' : 'إلغاء التحديد'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Search and category quick filters */}
            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute start-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isEn ? 'Search words in French, English, Arabic...' : 'ابحث عن كلمة بالفرنسية، الإنجليزية، أو العربية...'}
                  className="w-full ps-9 pe-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold shrink-0">
                <button
                  type="button"
                  onClick={() => setFilterMode('all')}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    filterMode === 'all' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600'
                  }`}
                >
                  {isEn ? 'All' : 'الكل'} ({words.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterMode('primary')}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    filterMode === 'primary' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600'
                  }`}
                >
                  {isEn ? '🎒 Primary' : '🎒 ابتدائي'}
                </button>
                <button
                  type="button"
                  onClick={() => setFilterMode('selected')}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    filterMode === 'selected' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600'
                  }`}
                >
                  {isEn ? '✓ Chosen' : '✓ المختارة'} ({selectedWordIds.length})
                </button>
              </div>
            </div>

            {/* Word Selection Grid */}
            <div className="border border-slate-200 rounded-2xl max-h-56 overflow-y-auto p-2 divide-y divide-slate-100 bg-slate-50/50">
              {filteredWords.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  {isEn ? 'No words matched your search.' : 'لا توجد كلمات مطابقة للبحث.'}
                </div>
              ) : (
                filteredWords.map((word) => {
                  const isSelected = selectedWordIds.includes(word.id);
                  return (
                    <div
                      key={word.id}
                      onClick={() => toggleWord(word.id)}
                      className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition select-none ${
                        isSelected
                          ? 'bg-indigo-50 border border-indigo-200 shadow-xs'
                          : 'hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center transition ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'border-2 border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-slate-900">
                              {word.french}
                            </span>
                            <span className="text-xs font-bold text-indigo-600">
                              / {word.englishMeaning}
                            </span>
                            {word.isPrimarySchool && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">
                                ابتدائي
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 font-medium">
                            {word.arabicMeaning} • <span className="font-mono text-slate-400">{word.arabicPhonetic}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-xs font-semibold text-slate-400">
                        #{word.orderNumber}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
            >
              {isEn ? 'Cancel' : 'إلغاء'}
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-black shadow-md transition disabled:opacity-50 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>
                {initialGroup
                  ? isEn
                    ? 'Save Changes'
                    : 'حفظ التعديلات'
                  : isEn
                  ? 'Create Group'
                  : 'حفظ وإنشاء المجموعة'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
