import React, { useState } from 'react';
import {
  FolderPlus,
  Play,
  CheckCircle2,
  Edit2,
  Trash2,
  Sparkles,
  BookOpen,
  Volume2,
  Layers,
  Star,
  Check,
  Plus,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VocabularyWord, WordGroup, AppLanguage, TrainingLanguage } from '../types';
import { speakVocabularyWord, playSound } from '../utils/audio';

interface WordGroupsViewProps {
  groups: WordGroup[];
  words: VocabularyWord[];
  activeGroupId: string | null;
  onSelectActiveGroup: (groupId: string | null) => void;
  onOpenCreateGroupModal: (groupToEdit?: WordGroup | null) => void;
  onDeleteGroup: (groupId: string) => void;
  appLang: AppLanguage;
  trainingLang: TrainingLanguage;
  onNavigateToTab: (tab: 'learn' | 'pronounce' | 'spelling' | 'game') => void;
}

export const WordGroupsView: React.FC<WordGroupsViewProps> = ({
  groups,
  words,
  activeGroupId,
  onSelectActiveGroup,
  onOpenCreateGroupModal,
  onDeleteGroup,
  appLang,
  trainingLang,
  onNavigateToTab,
}) => {
  const isEn = appLang === 'en';
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);

  const handleStartTraining = (group: WordGroup) => {
    playSound('bell');
    confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
    onSelectActiveGroup(group.id);
    onNavigateToTab('learn');
  };

  const handleClearFilter = () => {
    playSound('pop');
    onSelectActiveGroup(null);
  };

  const getGroupWords = (group: WordGroup) => {
    return words.filter((w) => group.wordIds.includes(w.id));
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold text-amber-200 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isEn ? 'Personalized Word Collections' : 'مجموعات الكلمات المخصصة للطفل'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              {isEn ? 'My Custom Word Groups 📂' : 'مجموعاتي الدراسية المخصصة 📂'}
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100 max-w-xl mt-1 leading-relaxed">
              {isEn
                ? 'Create unlimited custom word lists! Pick your favorite words, organize for weekly quizzes, and train on just that group anytime across all learning modes.'
                : 'اجمعي كلماتك المفضلة أو كلمات اختبارك القادم في مجموعات خاصة يمكنك تسميتها، والعودة إليها للتدريب عليها بمفردها في أي وقت!'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenCreateGroupModal(null)}
              className="px-5 py-3 rounded-2xl bg-white text-indigo-700 hover:bg-amber-300 hover:text-indigo-900 font-extrabold text-sm shadow-lg transition transform active:scale-95 flex items-center gap-2 shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{isEn ? 'Create New Group' : 'إنشاء مجموعة جديدة'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Notice if set */}
      {activeGroupId && (
        <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-xl shrink-0 shadow-sm">
              {groups.find((g) => g.id === activeGroupId)?.icon || '🎯'}
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-800">
                {isEn ? '🎯 Currently Practicing Only on Group:' : '🎯 أنت تتدربين حالياً فقط على كلمات مجموعة:'}
              </div>
              <div className="font-black text-sm text-emerald-950">
                {groups.find((g) => g.id === activeGroupId)?.name}
                <span className="ms-2 font-semibold text-xs text-emerald-700">
                  ({groups.find((g) => g.id === activeGroupId)?.wordIds.length || 0} {isEn ? 'words' : 'كلمة'})
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateToTab('learn')}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isEn ? 'Continue Practice' : 'متابعة التدريب'}</span>
            </button>
            <button
              onClick={handleClearFilter}
              className="px-3.5 py-1.5 rounded-xl bg-white text-slate-700 border border-slate-200 text-xs font-bold hover:bg-slate-100 transition"
            >
              {isEn ? 'Show All Words ✕' : 'إلغاء والعودة لكل الكلمات ✕'}
            </button>
          </div>
        </div>
      )}

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {groups.map((group) => {
          const groupWords = getGroupWords(group);
          const masteredCount = groupWords.filter((w) => w.isMastered).length;
          const isActive = group.id === activeGroupId;
          const isExpanded = expandedGroupId === group.id;

          const colorStyles: Record<string, { border: string; badge: string; accent: string }> = {
            indigo: { border: 'border-indigo-200', badge: 'bg-indigo-100 text-indigo-700', accent: 'bg-indigo-600 text-white' },
            emerald: { border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', accent: 'bg-emerald-600 text-white' },
            amber: { border: 'border-amber-200', badge: 'bg-amber-100 text-amber-800', accent: 'bg-amber-500 text-white' },
            rose: { border: 'border-rose-200', badge: 'bg-rose-100 text-rose-700', accent: 'bg-rose-600 text-white' },
            sky: { border: 'border-sky-200', badge: 'bg-sky-100 text-sky-700', accent: 'bg-sky-600 text-white' },
            purple: { border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700', accent: 'bg-purple-600 text-white' },
          };

          const style = colorStyles[group.color] || colorStyles.indigo;

          return (
            <div
              key={group.id}
              className={`rounded-3xl border-2 transition duration-200 bg-white/95 backdrop-blur-xs flex flex-col shadow-sm hover:shadow-md ${
                isActive ? 'border-emerald-500 ring-2 ring-emerald-400' : style.border
              }`}
            >
              {/* Card Header */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl shadow-inner shrink-0">
                      {group.icon}
                    </div>
                    <div>
                      <h3 className="font-black text-base text-slate-900 leading-tight">
                        {group.name}
                      </h3>
                      {group.description && (
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                          {group.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {isActive && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-black tracking-wide shrink-0 animate-pulse">
                      {isEn ? 'ACTIVE' : 'نشطة للتدريب'}
                    </span>
                  )}
                </div>

                {/* Stats row */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                    <Layers className="w-4 h-4 text-slate-400" />
                    <span>
                      {groupWords.length} {isEn ? 'Words' : 'كلمات'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 font-bold text-amber-600">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>
                      {masteredCount} / {groupWords.length} {isEn ? 'mastered' : 'متقنة'}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-400 to-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${groupWords.length > 0 ? (masteredCount / groupWords.length) * 100 : 0}%`,
                    }}
                  />
                </div>

                {/* Expanded word previews */}
                {isExpanded && (
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 max-h-48 overflow-y-auto">
                    {groupWords.length === 0 ? (
                      <div className="text-center py-3 text-xs text-slate-400">
                        {isEn ? 'No words in this group yet. Click edit to add words!' : 'لا توجد كلمات بهذه المجموعة، انقري تعديل لإضافتها!'}
                      </div>
                    ) : (
                      groupWords.map((word) => (
                        <div
                          key={word.id}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-50 text-xs hover:bg-slate-100 transition"
                        >
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                speakVocabularyWord(word, trainingLang, 'normal');
                              }}
                              className="p-1 rounded-lg text-indigo-600 hover:bg-indigo-100"
                              title={isEn ? 'Listen' : 'استمع'}
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-bold text-slate-800">
                              {trainingLang === 'en' ? word.englishMeaning : word.french}
                            </span>
                            <span className="text-slate-400">({word.arabicMeaning})</span>
                          </div>
                          {word.isMastered && (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="p-3 bg-slate-50/80 rounded-b-3xl border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setExpandedGroupId(isExpanded ? null : group.id)}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition"
                  >
                    {isExpanded ? (isEn ? 'Hide words' : 'إخفاء') : (isEn ? 'Show words' : 'عرض الكلمات')}
                  </button>

                  <button
                    onClick={() => onOpenCreateGroupModal(group)}
                    className="p-1.5 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
                    title={isEn ? 'Edit group' : 'تعديل المجموعة'}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          isEn
                            ? `Are you sure you want to delete "${group.name}"?`
                            : `هل أنتِ متأكدة من رغبتكِ في حذف مجموعة "${group.name}"؟`
                        )
                      ) {
                        onDeleteGroup(group.id);
                      }
                    }}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title={isEn ? 'Delete group' : 'حذف المجموعة'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {isActive ? (
                  <button
                    onClick={handleClearFilter}
                    className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition"
                  >
                    {isEn ? 'Stop Training' : 'إنهاء التدريب'}
                  </button>
                ) : (
                  <button
                    onClick={() => handleStartTraining(group)}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 transform active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isEn ? 'Practice Group 🚀' : 'تدريب على المجموعة 🚀'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
