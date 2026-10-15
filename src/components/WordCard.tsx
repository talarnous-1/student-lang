import React, { useState } from 'react';
import { Volume2, Sparkles, CheckCircle2, Bookmark, Edit3, HelpCircle, ArrowLeft, ArrowRight, Snail, Music } from 'lucide-react';
import { VocabularyWord, AppLanguage, TrainingLanguage, WordGroup } from '../types';
import { UI_TEXT } from '../translations';
import { speakFrench, speakArabic, speakEnglish, playSound } from '../utils/audio';
import { WordGroupDropdown } from './WordGroupDropdown';

interface WordCardProps {
  word: VocabularyWord;
  onToggleMastered: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onEdit: (word: VocabularyWord) => void;
  onNext?: () => void;
  onPrev?: () => void;
  currentIndex?: number;
  totalWords?: number;
  appLang: AppLanguage;
  trainingLang: TrainingLanguage;
  groups?: WordGroup[];
  onToggleWordInGroup?: (groupId: string, wordId: string) => void;
  onOpenCreateGroupModal?: () => void;
}

export const WordCard: React.FC<WordCardProps> = ({
  word,
  onToggleMastered,
  onToggleFavorite,
  onEdit,
  onNext,
  onPrev,
  currentIndex,
  totalWords,
  appLang,
  trainingLang,
  groups = [],
  onToggleWordInGroup,
  onOpenCreateGroupModal,
}) => {
  const t = appLang === 'en' ? UI_TEXT.en : UI_TEXT.ar;

  const [isPlayingNormal, setIsPlayingNormal] = useState(false);
  const [isPlayingSlow, setIsPlayingSlow] = useState(false);
  const [isPlayingSyllables, setIsPlayingSyllables] = useState(false);
  const [activeSyllableIndex, setActiveSyllableIndex] = useState<number | null>(null);

  // Target word depending on training track
  const isEnglishTrack = trainingLang === 'en';
  const targetWord = isEnglishTrack ? word.englishMeaning : word.french;
  const secondaryWord = isEnglishTrack ? word.french : word.englishMeaning;
  const currentSyllables = isEnglishTrack
    ? word.englishSyllables || [word.englishMeaning]
    : word.syllables;

  const handlePlayNormal = async () => {
    setIsPlayingNormal(true);
    playSound('pop');
    if (isEnglishTrack) {
      await speakEnglish(targetWord, 'normal');
    } else {
      await speakFrench(targetWord, 'normal');
    }
    setIsPlayingNormal(false);
  };

  const handlePlaySlow = async () => {
    setIsPlayingSlow(true);
    playSound('pop');
    if (isEnglishTrack) {
      await speakEnglish(targetWord, 'slow');
    } else {
      await speakFrench(targetWord, 'slow');
    }
    setIsPlayingSlow(false);
  };

  const handlePlaySyllables = async () => {
    setIsPlayingSyllables(true);
    playSound('pop');
    for (let i = 0; i < currentSyllables.length; i++) {
      if (currentSyllables[i] === '—') continue;
      setActiveSyllableIndex(i);
      if (isEnglishTrack) {
        await speakEnglish(currentSyllables[i], 'slow');
      } else {
        await speakFrench(currentSyllables[i], 'slow');
      }
    }
    setActiveSyllableIndex(null);
    setIsPlayingSyllables(false);
  };

  const handlePlaySingleSyllable = async (syll: string, idx: number) => {
    if (syll === '—') return;
    setActiveSyllableIndex(idx);
    playSound('pop');
    if (isEnglishTrack) {
      await speakEnglish(syll, 'slow');
    } else {
      await speakFrench(syll, 'slow');
    }
    setActiveSyllableIndex(null);
  };

  const handlePlayExample = async () => {
    playSound('click');
    if (isEnglishTrack) {
      await speakEnglish(word.exampleEnglish || word.englishMeaning, 'normal');
    } else {
      await speakFrench(word.exampleFrench, 'normal');
    }
  };

  const handlePlayArabic = async () => {
    playSound('click');
    await speakArabic(word.arabicMeaning);
  };

  const handlePlayCounterpart = async () => {
    playSound('click');
    if (isEnglishTrack) {
      await speakFrench(word.french, 'normal');
    } else {
      await speakEnglish(word.englishMeaning, 'normal');
    }
  };

  const categoryLabel =
    appLang === 'en'
      ? word.categoryLabelEn || word.category
      : appLang === 'bilingual'
      ? `${word.categoryLabelAr} • ${word.categoryLabelEn || word.category}`
      : word.categoryLabelAr;

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 border-2 border-indigo-100 overflow-hidden transition-all duration-300">
      {/* Top Banner with Badges and Actions */}
      <div className={`p-4 text-white flex items-center justify-between transition-colors ${
        isEnglishTrack
          ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500'
          : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'
      }`}>
        <div className="flex items-center gap-2">
          <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold tracking-wide">
            {isEnglishTrack ? '🇬🇧 كلمة إنجليزية' : '🇫🇷 كلمة فرنسية'} #{word.orderNumber}
          </span>
          <span className="bg-white/25 px-3 py-1 rounded-full text-xs font-semibold">
            {categoryLabel}
          </span>
          {word.isMastered && (
            <span className="bg-emerald-400 text-emerald-950 font-bold px-2.5 py-0.5 rounded-full text-xs flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {t.mastered}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {onToggleWordInGroup && onOpenCreateGroupModal && (
            <WordGroupDropdown
              wordId={word.id}
              groups={groups}
              onToggleWordInGroup={onToggleWordInGroup}
              onOpenCreateGroupModal={onOpenCreateGroupModal}
              appLang={appLang}
              buttonClassName="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-white/20 hover:bg-white/30 text-white transition backdrop-blur-xs"
            />
          )}

          <button
            onClick={() => onToggleFavorite(word.id)}
            title="Bookmark"
            className={`p-2 rounded-full transition-all ${
              word.isFavorite ? 'bg-amber-400 text-amber-950 scale-110' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Bookmark className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(word)}
            title="Edit word"
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        {/* Main Word Display */}
        <div className="text-center space-y-3">
          <div className="inline-block relative">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-wide font-french select-all" dir="ltr">
              {targetWord}
            </h2>
            <div className={`h-1.5 rounded-full mt-2 mx-auto w-3/4 ${
              isEnglishTrack
                ? 'bg-gradient-to-r from-blue-400 via-teal-400 to-indigo-300'
                : 'bg-gradient-to-r from-indigo-400 via-pink-400 to-amber-300'
            }`}></div>
          </div>

          {/* Phonetics & IPA */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {/* Arabic Phonetics for Target */}
            <div className="bg-amber-50 border border-amber-200 text-amber-900 px-3.5 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-xs">
              <span className="text-xs font-bold text-amber-700">النطق بالعربي:</span>
              <span className="text-base font-black text-amber-950 tracking-wider">
                {isEnglishTrack ? (word.englishArabicPhonetic || word.englishMeaning) : word.arabicPhonetic}
              </span>
            </div>

            {/* English Phonetic Guide (for French track) or IPA */}
            {!isEnglishTrack && word.englishPhonetic && (
              <div className="bg-blue-50 border border-blue-200 text-blue-900 px-3.5 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-xs" dir="ltr">
                <span className="text-xs font-bold text-blue-700">Sounds like:</span>
                <span className="text-base font-bold text-blue-950 font-french">
                  "{word.englishPhonetic}"
                </span>
              </div>
            )}

            <div className="bg-slate-100 text-slate-600 px-3 py-1 rounded-xl text-xs font-mono font-medium" dir="ltr">
              {isEnglishTrack ? (word.ipaEnglish || word.ipa) : word.ipa}
            </div>
          </div>

          {/* Meaning (Arabic) & Other Language Counterpart */}
          <div className="pt-2 space-y-2">
            <div>
              <button
                onClick={handlePlayArabic}
                title="استمع للمعنى بالعربية"
                className="group inline-flex items-center gap-2 text-2xl md:text-3xl font-bold text-indigo-900 hover:text-indigo-600 transition-colors"
              >
                <span>{word.arabicMeaning}</span>
                <Volume2 className="w-5 h-5 text-indigo-400 group-hover:text-indigo-600 group-hover:scale-110 transition-transform" />
              </button>
            </div>

            {/* Counterpart badge */}
            <div className="inline-block">
              <button
                onClick={handlePlayCounterpart}
                className="inline-flex items-center gap-2 px-3.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                title="Click to hear counterpart in other language"
              >
                <span>{isEnglishTrack ? '🇫🇷 الفرنسية المقابلة:' : '🇬🇧 الإنجليزية المقابلة:'}</span>
                <span className="font-french text-sm font-black text-indigo-950" dir="ltr">
                  {secondaryWord}
                </span>
                <Volume2 className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Audio Action Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Normal Speed */}
          <button
            onClick={handlePlayNormal}
            disabled={isPlayingNormal}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl active:scale-95 text-white font-bold text-sm shadow-md transition-all cursor-pointer ${
              isEnglishTrack
                ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
            }`}
          >
            <Volume2 className={`w-5 h-5 ${isPlayingNormal ? 'animate-bounce text-amber-300' : ''}`} />
            <span>{isEnglishTrack ? 'نطق إنجليزي طبيعي' : t.normalSpeed}</span>
          </button>

          {/* Slow Speed */}
          <button
            onClick={handlePlaySlow}
            disabled={isPlayingSlow}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold text-sm shadow-md shadow-purple-200 transition-all cursor-pointer"
          >
            <Snail className={`w-5 h-5 ${isPlayingSlow ? 'animate-spin text-amber-300' : ''}`} />
            <span>{t.slowSpeed}</span>
          </button>

          {/* Syllables Spaced */}
          <button
            onClick={handlePlaySyllables}
            disabled={isPlayingSyllables}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-pink-500 hover:bg-pink-600 active:scale-95 text-white font-bold text-sm shadow-md shadow-pink-200 transition-all cursor-pointer"
          >
            <Music className={`w-5 h-5 ${isPlayingSyllables ? 'animate-pulse text-yellow-200' : ''}`} />
            <span>{t.syllablesSpaced}</span>
          </button>
        </div>

        {/* Interactive Syllable Chips */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
              <span>{t.syllablesInstruction}</span>
            </span>
            <span className="text-[11px] text-slate-600 font-medium">
              {isEnglishTrack ? 'English Syllables' : 'Syllabes françaises'}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2" dir="ltr">
            {currentSyllables.map((syll, idx) => {
              if (syll === '—') {
                return (
                  <span key={idx} className="text-slate-600 font-bold px-1">
                    /
                  </span>
                );
              }
              const isActive = activeSyllableIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handlePlaySingleSyllable(syll, idx)}
                  className={`px-4 py-2 rounded-xl font-french font-bold text-base transition-all transform active:scale-95 cursor-pointer shadow-xs ${
                    isActive
                      ? 'bg-amber-400 text-amber-950 scale-110 shadow-md ring-2 ring-amber-300'
                      : 'bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 hover:border-indigo-400'
                  }`}
                >
                  {syll} 🔊
                </button>
              );
            })}
          </div>
        </div>

        {/* Teacher's Pronunciation Secret Tip */}
        <div className="bg-amber-50/70 border-r-4 border-amber-400 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>{isEnglishTrack ? 'سر النطق الإنجليزي من الأستاذ:' : t.teacherTip}</span>
          </div>
          <p className="text-amber-950 text-sm leading-relaxed pr-6">
            {isEnglishTrack
              ? (word.englishPronunciationTipAr || word.englishPronunciationTipEn || word.pronunciationTip)
              : word.pronunciationTip}
          </p>
          {isEnglishTrack && word.englishPronunciationTipEn && (
            <p className="text-amber-900 text-xs leading-relaxed font-medium" dir="ltr">
              💡 {word.englishPronunciationTipEn}
            </p>
          )}
        </div>

        {/* Example Sentence Section */}
        <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-700 flex items-center gap-1">
              <span>{t.exampleTitle}</span>
            </span>
            <button
              onClick={handlePlayExample}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{t.listenSentence}</span>
            </button>
          </div>
          <div className="space-y-1">
            <p className="text-indigo-950 font-french font-semibold text-base leading-snug" dir="ltr">
              "{isEnglishTrack ? (word.exampleEnglish || word.exampleFrench) : word.exampleFrench}"
            </p>
            <p className="text-slate-600 text-sm font-medium">
              "{word.exampleArabic}"
            </p>
          </div>
        </div>

        {/* Notes / Synonyms */}
        {(word.synonymsOrNotes || word.synonymsOrNotesEn) && (
          <div className="flex items-start gap-2 text-xs text-slate-500 bg-slate-50 rounded-xl p-3">
            <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              {word.synonymsOrNotes && <div>{word.synonymsOrNotes}</div>}
              {word.synonymsOrNotesEn && (
                <div dir="ltr" className="text-slate-600 font-medium">
                  {word.synonymsOrNotesEn}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Navigation & Mastery Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
          <button
            onClick={() => {
              playSound(word.isMastered ? 'click' : 'celebration');
              onToggleMastered(word.id);
            }}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              word.isMastered
                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200 active:scale-95'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{word.isMastered ? t.alreadyMastered : t.markMastered}</span>
          </button>

          {/* Prev / Next controls */}
          {(onPrev || onNext) && (
            <div className="flex items-center gap-2">
              <button
                onClick={onPrev}
                disabled={!onPrev}
                className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                title={t.prevWord}
              >
                <ArrowRight className="w-4 h-4" />
              </button>

              {currentIndex !== undefined && totalWords !== undefined && (
                <span className="text-xs font-bold text-slate-500 px-2">
                  {currentIndex + 1} / {totalWords}
                </span>
              )}

              <button
                onClick={onNext}
                disabled={!onNext}
                className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                title={t.nextWord}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
