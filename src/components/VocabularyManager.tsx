import React, { useState } from 'react';
import { Plus, Search, Filter, Edit3, Trash2, Volume2, CheckCircle2, Bookmark, RotateCcw, Printer, Sparkles, X, Check } from 'lucide-react';
import { VocabularyWord, WordCategory } from '../types';
import { speakFrench, playSound } from '../utils/audio';

interface VocabularyManagerProps {
  words: VocabularyWord[];
  onAddWord: (word: Omit<VocabularyWord, 'id' | 'orderNumber'>) => void;
  onUpdateWord: (word: VocabularyWord) => void;
  onDeleteWord: (id: string) => void;
  onResetDefaults: () => void;
  onToggleMastered: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export const VocabularyManager: React.FC<VocabularyManagerProps> = ({
  words,
  onAddWord,
  onUpdateWord,
  onDeleteWord,
  onResetDefaults,
  onToggleMastered,
  onToggleFavorite,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterMastered, setFilterMastered] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<VocabularyWord | null>(null);

  // Form State
  const [french, setFrench] = useState('');
  const [arabicMeaning, setArabicMeaning] = useState('');
  const [arabicPhonetic, setArabicPhonetic] = useState('');
  const [ipa, setIpa] = useState('');
  const [syllablesInput, setSyllablesInput] = useState('');
  const [category, setCategory] = useState<WordCategory>('noun');
  const [categoryLabelAr, setCategoryLabelAr] = useState('اسم (Nom)');
  const [pronunciationTip, setPronunciationTip] = useState('');
  const [exampleFrench, setExampleFrench] = useState('');
  const [exampleArabic, setExampleArabic] = useState('');
  const [synonymsOrNotes, setSynonymsOrNotes] = useState('');

  const openAddModal = () => {
    setEditingWord(null);
    setFrench('');
    setArabicMeaning('');
    setArabicPhonetic('');
    setIpa('');
    setSyllablesInput('');
    setCategory('noun');
    setCategoryLabelAr('اسم (Nom)');
    setPronunciationTip('');
    setExampleFrench('');
    setExampleArabic('');
    setSynonymsOrNotes('');
    setIsModalOpen(true);
    playSound('pop');
  };

  const openEditModal = (word: VocabularyWord) => {
    setEditingWord(word);
    setFrench(word.french);
    setArabicMeaning(word.arabicMeaning);
    setArabicPhonetic(word.arabicPhonetic);
    setIpa(word.ipa);
    setSyllablesInput(word.syllables.join(' - '));
    setCategory(word.category);
    setCategoryLabelAr(word.categoryLabelAr);
    setPronunciationTip(word.pronunciationTip);
    setExampleFrench(word.exampleFrench);
    setExampleArabic(word.exampleArabic);
    setSynonymsOrNotes(word.synonymsOrNotes || '');
    setIsModalOpen(true);
    playSound('pop');
  };

  const handleCategoryChange = (cat: WordCategory) => {
    setCategory(cat);
    switch (cat) {
      case 'verb':
        setCategoryLabelAr('فعل (Verbe)');
        break;
      case 'adjective':
        setCategoryLabelAr('صفة (Adjectif)');
        break;
      case 'adverb':
        setCategoryLabelAr('ظرف (Adverbe)');
        break;
      case 'expression':
        setCategoryLabelAr('تعبير (Expression)');
        break;
      case 'conjunction':
        setCategoryLabelAr('أداة ربط (Conjonction)');
        break;
      case 'preposition':
        setCategoryLabelAr('حرف جر (Préposition)');
        break;
      default:
        setCategoryLabelAr('اسم (Nom)');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!french.trim() || !arabicMeaning.trim()) {
      alert('يرجى كتابة الكلمة بالفرنسية ومعناها بالعربية.');
      return;
    }

    const syllablesArray = syllablesInput
      .split(/[-–—, ]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    const finalSyllables = syllablesArray.length > 0 ? syllablesArray : [french.trim()];

    if (editingWord) {
      // Update
      onUpdateWord({
        ...editingWord,
        french: french.trim(),
        arabicMeaning: arabicMeaning.trim(),
        arabicPhonetic: arabicPhonetic.trim() || '—',
        ipa: ipa.trim() || `[${french.trim().toLowerCase()}]`,
        syllables: finalSyllables,
        category,
        categoryLabelAr,
        pronunciationTip: pronunciationTip.trim() || 'انتبهي لنطق الحروف ومخارج الأصوات بدقة.',
        exampleFrench: exampleFrench.trim() || french.trim(),
        exampleArabic: exampleArabic.trim() || arabicMeaning.trim(),
        synonymsOrNotes: synonymsOrNotes.trim(),
      });
    } else {
      // Add
      onAddWord({
        french: french.trim(),
        arabicMeaning: arabicMeaning.trim(),
        arabicPhonetic: arabicPhonetic.trim() || '—',
        ipa: ipa.trim() || `[${french.trim().toLowerCase()}]`,
        syllables: finalSyllables,
        category,
        categoryLabelAr,
        pronunciationTip: pronunciationTip.trim() || 'انتبهي لنطق الحروف ومخارج الأصوات بدقة.',
        exampleFrench: exampleFrench.trim() || french.trim(),
        exampleArabic: exampleArabic.trim() || arabicMeaning.trim(),
        synonymsOrNotes: synonymsOrNotes.trim(),
        isMastered: false,
        isFavorite: false,
        practiceScore: 0,
      });
    }

    setIsModalOpen(false);
    playSound('correct');
  };

  const handleTestAudio = () => {
    if (!french.trim()) return;
    playSound('pop');
    speakFrench(french.trim(), 'normal');
  };

  // Filter words
  const filteredWords = words.filter((w) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      w.french.toLowerCase().includes(q) ||
      w.arabicMeaning.toLowerCase().includes(q) ||
      w.arabicPhonetic.toLowerCase().includes(q);

    const matchesCategory =
      selectedCategory === 'all' || w.category === selectedCategory;

    const matchesMastered =
      filterMastered === 'all'
        ? true
        : filterMastered === 'mastered'
        ? w.isMastered
        : filterMastered === 'unmastered'
        ? !w.isMastered
        : filterMastered === 'favorite'
        ? w.isFavorite
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
            <span>إدارة وتعديل الفهرس المدرسي</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black">
            فهرس كلمات اللغة الفرنسية والمعاني العربية 📋
          </h2>
          <p className="text-xs text-slate-300 max-w-xl">
            يمكنكِ هنا تعديل أي كلمة موجودة، إضافة كلمات جديدة مع نطقها ومعناها، أو طباعة الفهرس للدراسة الورقية!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={openAddModal}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-300 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة كلمة جديدة</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 flex items-center gap-2 cursor-pointer transition-all"
            title="طباعة قائمة الكلمات"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة</span>
          </button>

          <button
            onClick={() => {
              if (confirm('هل ترغبين باستعادة قائمة الكلمات الأصلية العشرين الموجودة في ورقة الدرس؟')) {
                onResetDefaults();
                playSound('celebration');
              }
            }}
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs border border-white/20 cursor-pointer"
            title="استعادة الكلمات العشرين الافتراضية للدرس"
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
              placeholder="ابحثي بالفرنسية أو بالعربية أو بالنطق..."
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
              <option value="all">كل التصنيفات (Tous)</option>
              <option value="noun">أسماء (Noms)</option>
              <option value="verb">أفعال (Verbes)</option>
              <option value="adjective">صفات (Adjectifs)</option>
              <option value="adverb">ظروف (Adverbes)</option>
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
              <option value="all">كل الحالات (Statut)</option>
              <option value="mastered">المتقنة فقط ⭐</option>
              <option value="unmastered">قيد التعلم ⏳</option>
              <option value="favorite">المفضلة فقط 🔖</option>
            </select>
          </div>
        </div>

        {/* Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>
            عرض <span className="font-bold text-indigo-600">{filteredWords.length}</span> من أصل <span className="font-bold text-slate-800">{words.length}</span> كلمة
          </span>
          {words.some((w) => w.isMastered) && (
            <span className="text-emerald-700 font-bold">
              ✓ تم إتقان {words.filter((w) => w.isMastered).length} كلمة
            </span>
          )}
        </div>
      </div>

      {/* Words Table / List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredWords.map((word) => (
          <div
            key={word.id}
            className={`bg-white rounded-2xl p-5 border-2 transition-all space-y-4 hover:shadow-md ${
              word.isMastered ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-200 hover:border-indigo-200'
            }`}
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">
                    #{word.orderNumber}
                  </span>
                  <span className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                    {word.categoryLabelAr}
                  </span>
                  {word.isMastered && (
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      متقنة
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-french font-bold text-slate-900" dir="ltr">
                    {word.french}
                  </h3>
                  <button
                    onClick={() => {
                      playSound('pop');
                      speakFrench(word.french, 'normal');
                    }}
                    className="p-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 cursor-pointer transition-colors"
                    title="استمع للنطق"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onToggleFavorite(word.id)}
                  className={`p-2 rounded-xl border transition-all ${
                    word.isFavorite
                      ? 'bg-amber-100 border-amber-300 text-amber-800'
                      : 'border-slate-200 text-slate-400 hover:text-slate-600'
                  }`}
                  title="المفضلة"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => openEditModal(word)}
                  className="p-2 rounded-xl border border-slate-200 text-indigo-600 hover:bg-indigo-50 transition-colors"
                  title="تعديل بيانات الكلمة"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    if (confirm(`هل أنتِ متأكدة من حذف الكلمة (${word.french}) من الفهرس؟`)) {
                      onDeleteWord(word.id);
                      playSound('click');
                    }
                  }}
                  className="p-2 rounded-xl border border-slate-200 text-rose-500 hover:bg-rose-50 transition-colors"
                  title="حذف الكلمة"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Arabic meaning & Phonetics */}
            <div className="space-y-1.5 bg-slate-50 rounded-xl p-3">
              <div className="text-base font-bold text-indigo-950">
                {word.arabicMeaning}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-amber-800 font-bold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">
                  نطق: {word.arabicPhonetic}
                </span>
                <span className="text-slate-500 font-mono text-[11px]" dir="ltr">
                  {word.ipa}
                </span>
              </div>
            </div>

            {/* Syllables & Tip Snippet */}
            <div className="text-xs space-y-1 text-slate-600">
              <div className="flex items-center gap-1">
                <span className="font-bold text-slate-500">المقاطع:</span>
                <span className="font-french font-semibold text-indigo-700" dir="ltr">
                  {word.syllables.join(' • ')}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1">
                💡 {word.pronunciationTip}
              </p>
            </div>
          </div>
        ))}

        {filteredWords.length === 0 && (
          <div className="col-span-full bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200 space-y-3">
            <p className="text-slate-500 font-bold text-base">
              لم نعثر على أي كلمات مطابقة لبحثكِ!
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setFilterMastered('all');
              }}
              className="text-xs text-indigo-600 hover:underline font-bold"
            >
              إلغاء فلاتر البحث وعرض كل الكلمات
            </button>
          </div>
        )}
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
                    {editingWord ? 'تعديل بيانات الكلمة' : 'إضافة كلمة جديدة إلى الفهرس'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    أدخلي الكلمة بالفرنسية مع معناها وطريقة نطقها بالعربية
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
            <form onSubmit={handleFormSubmit} className="space-y-4 text-right">
              {/* French Word */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  الكلمة باللغة الفرنسية (Mot en français) *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    dir="ltr"
                    required
                    value={french}
                    onChange={(e) => setFrench(e.target.value)}
                    placeholder="Ex: papillon, maison, chanter..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 font-french font-bold text-lg outline-none"
                  />
                  {french.trim() && (
                    <button
                      type="button"
                      onClick={handleTestAudio}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>تجربة النطق</span>
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
                  placeholder="مثال: فراشة، بيت، يغني..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 font-bold text-slate-800 outline-none text-sm"
                />
              </div>

              {/* Arabic Phonetics & Syllables */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    النطق التقريبي بالعربي (مع الحركات)
                  </label>
                  <input
                    type="text"
                    value={arabicPhonetic}
                    onChange={(e) => setArabicPhonetic(e.target.value)}
                    placeholder="مثال: بَا-بِي-يُونْ"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none text-sm font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    المقاطع الصوتية (مفصولة بمسافة أو شرطة)
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={syllablesInput}
                    onChange={(e) => setSyllablesInput(e.target.value)}
                    placeholder="Ex: pa - pil - lon"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none text-sm font-french"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  نوع الكلمة (Catégorie grammaticale)
                </label>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value as WordCategory)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-xs outline-none"
                >
                  <option value="noun">اسم (Nom)</option>
                  <option value="verb">فعل (Verbe)</option>
                  <option value="adjective">صفة (Adjectif)</option>
                  <option value="adverb">ظرف (Adverbe)</option>
                  <option value="expression">تعبير مركب (Expression)</option>
                  <option value="preposition">حرف جر (Préposition)</option>
                </select>
              </div>

              {/* Pronunciation Tip */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  سر ونصيحة الأستاذ لنطق الكلمة بسهولة
                </label>
                <textarea
                  rows={2}
                  value={pronunciationTip}
                  onChange={(e) => setPronunciationTip(e.target.value)}
                  placeholder="مثال: انتبهي، حرف الـ ill ينطق مثل الياء المشددة..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none text-xs leading-relaxed"
                />
              </div>

              {/* Example in French & Arabic */}
              <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-200/70">
                <span className="text-[11px] font-bold text-slate-600 block">
                  مثال في جملة مفيدة (اختياري لكن مفيد جداً):
                </span>
                <input
                  type="text"
                  dir="ltr"
                  value={exampleFrench}
                  onChange={(e) => setExampleFrench(e.target.value)}
                  placeholder="Ex: Le papillon vole dans le jardin."
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-french"
                />
                <input
                  type="text"
                  value={exampleArabic}
                  onChange={(e) => setExampleArabic(e.target.value)}
                  placeholder="ترجمة الجملة: الفراشة تطير في الحديقة."
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs"
                />
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
