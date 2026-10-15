import React, { useState, useEffect } from 'react';
import { Sparkles, RotateCcw, Volume2, Trophy, Clock, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { VocabularyWord, AppLanguage, TrainingLanguage } from '../types';
import { UI_TEXT } from '../translations';
import { speakFrench, speakEnglish, playSound } from '../utils/audio';

interface MatchingGameProps {
  words: VocabularyWord[];
  onWordMastered: (id: string) => void;
  appLang: AppLanguage;
  trainingLang: TrainingLanguage;
}

interface GameCard {
  id: string;
  wordId: string;
  type: 'target' | 'meaning';
  text: string;
  isMatched: boolean;
  phonetic?: string;
}

export const MatchingGame: React.FC<MatchingGameProps> = ({
  words,
  onWordMastered,
  appLang,
  trainingLang,
}) => {
  const t = appLang === 'en' ? UI_TEXT.en : UI_TEXT.ar;
  const isEnglishTrack = trainingLang === 'en';

  const [cards, setCards] = useState<GameCard[]>([]);
  const [selectedTarget, setSelectedTarget] = useState<GameCard | null>(null);
  const [selectedMeaning, setSelectedMeaning] = useState<GameCard | null>(null);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [batchOffset, setBatchOffset] = useState(0);

  const BATCH_SIZE = 6;

  const startNewGame = (offset = batchOffset) => {
    // Pick 6 words
    const sliceWords = words.slice(offset, offset + BATCH_SIZE);
    const selectedWords = sliceWords.length >= 3 ? sliceWords : words.slice(0, BATCH_SIZE);

    const targetCards: GameCard[] = selectedWords.map((w) => ({
      id: `target-${w.id}`,
      wordId: w.id,
      type: 'target',
      text: isEnglishTrack ? w.englishMeaning : w.french,
      phonetic: isEnglishTrack
        ? w.englishArabicPhonetic || w.englishMeaning
        : w.arabicPhonetic,
      isMatched: false,
    }));

    const meaningCards: GameCard[] = selectedWords.map((w) => ({
      id: `meaning-${w.id}`,
      wordId: w.id,
      type: 'meaning',
      text: w.arabicMeaning,
      isMatched: false,
    }));

    // Shuffle both independently
    setCards([
      ...targetCards.sort(() => Math.random() - 0.5),
      ...meaningCards.sort(() => Math.random() - 0.5),
    ]);

    setSelectedTarget(null);
    setSelectedMeaning(null);
    setMoves(0);
    setSeconds(0);
    setIsGameActive(true);
    setIsCompleted(false);
  };

  useEffect(() => {
    startNewGame(0);
  }, [words, trainingLang]);

  // Timer
  useEffect(() => {
    if (!isGameActive || isCompleted) return;
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isGameActive, isCompleted]);

  const handleCardClick = (card: GameCard) => {
    if (card.isMatched) return;

    playSound('pop');

    if (card.type === 'target') {
      if (isEnglishTrack) {
        speakEnglish(card.text, 'normal');
      } else {
        speakFrench(card.text, 'normal');
      }
      if (selectedTarget?.id === card.id) {
        setSelectedTarget(null);
        return;
      }
      setSelectedTarget(card);

      // Check match if meaning already selected
      if (selectedMeaning) {
        checkMatch(card, selectedMeaning);
      }
    } else {
      if (selectedMeaning?.id === card.id) {
        setSelectedMeaning(null);
        return;
      }
      setSelectedMeaning(card);

      // Check match if target already selected
      if (selectedTarget) {
        checkMatch(selectedTarget, card);
      }
    }
  };

  const checkMatch = (tCard: GameCard, mCard: GameCard) => {
    setMoves((prev) => prev + 1);

    if (tCard.wordId === mCard.wordId) {
      // Correct Match!
      playSound('correct');
      setCards((prev) =>
        prev.map((c) =>
          c.wordId === tCard.wordId ? { ...c, isMatched: true } : c
        )
      );
      onWordMastered(tCard.wordId);

      setSelectedTarget(null);
      setSelectedMeaning(null);

      // Check if all matched
      setTimeout(() => {
        setCards((latest) => {
          const allMatched = latest.every((c) => c.isMatched);
          if (allMatched) {
            setIsCompleted(true);
            playSound('celebration');
            confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
          }
          return latest;
        });
      }, 300);
    } else {
      // Mismatch
      playSound('wrong');
      setTimeout(() => {
        setSelectedTarget(null);
        setSelectedMeaning(null);
      }, 700);
    }
  };

  const handleNextRound = () => {
    const nextOffset = (batchOffset + BATCH_SIZE) % Math.max(1, words.length);
    setBatchOffset(nextOffset);
    startNewGame(nextOffset);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const targetColumnCards = cards.filter((c) => c.type === 'target');
  const meaningColumnCards = cards.filter((c) => c.type === 'meaning');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Banner */}
      <div className={`rounded-3xl p-6 text-white shadow-xl flex flex-wrap items-center justify-between gap-4 transition-colors ${
        isEnglishTrack
          ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600'
          : 'bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600'
      }`}>
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-0.5 rounded-full text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
            <span>{isEnglishTrack ? 'تحدي مطابقة الكلمات الإنجليزية' : t.gameBadge}</span>
          </div>
          <h2 className="text-2xl font-black">
            {isEnglishTrack
              ? 'صلي كل كلمة إنجليزية بمعناها العربي المناسب 🎯'
              : t.gameTitle}
          </h2>
          <p className="text-xs text-white/90">
            {isEnglishTrack
              ? 'انقري على الكلمة الإنجليزية لتسمعي نطقها ثم اختاري معناها بالعربي بأسرع وقت!'
              : t.gameDesc}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-200" />
            <span className="font-mono font-bold text-base">{formatTime(seconds)}</span>
          </div>
          <div className="w-px h-5 bg-white/20"></div>
          <div className="text-xs font-bold">
            <span>{t.attempts} </span>
            <span className="text-amber-200">{moves}</span>
          </div>
        </div>
      </div>

      {/* Completion Modal / Banner */}
      {isCompleted ? (
        <div className="bg-white rounded-3xl p-8 md:p-12 text-center shadow-xl border-2 border-emerald-200 space-y-6 animate-pulse-subtle">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Trophy className="w-10 h-10 animate-bounce" />
          </div>

          <div className="space-y-2">
            <h3 className="text-3xl font-black text-slate-800">
              {t.gameWonTitle}
            </h3>
            <p className="text-slate-600 text-base max-w-md mx-auto">
              أنجزتِ مطابقة جميع الكلمات في <span className="font-bold text-indigo-600">{formatTime(seconds)}</span> وبعدد محاولات <span className="font-bold text-indigo-600">{moves}</span>!
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => startNewGame(batchOffset)}
              className="px-6 py-3 rounded-2xl bg-white border-2 border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-sm flex items-center gap-2 cursor-pointer transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.retryRound}</span>
            </button>

            <button
              onClick={handleNextRound}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md shadow-emerald-200 flex items-center gap-2 cursor-pointer transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.newRound}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Game Dual Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Target Column (French or English based on training track) */}
          <div className="space-y-3">
            <div className="bg-indigo-100/70 text-indigo-900 px-4 py-2 rounded-2xl text-xs font-bold flex items-center justify-between">
              <span>{isEnglishTrack ? 'الكلمات الإنجليزية (English Words):' : 'الكلمات الفرنسية (En Français):'}</span>
              <span className="text-[11px] text-indigo-600 font-medium">اضغطي للاستماع</span>
            </div>

            <div className="space-y-2.5">
              {targetColumnCards.map((card) => {
                const isSelected = selectedTarget?.id === card.id;
                return (
                  <button
                    key={card.id}
                    disabled={card.isMatched}
                    onClick={() => handleCardClick(card)}
                    className={`w-full p-4 rounded-2xl border-2 text-right transition-all flex items-center justify-between cursor-pointer ${
                      card.isMatched
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 opacity-60 cursor-default'
                        : isSelected
                        ? 'bg-indigo-600 border-indigo-700 text-white shadow-lg shadow-indigo-300 scale-[1.02]'
                        : 'bg-white border-indigo-100 hover:border-indigo-300 text-slate-800 hover:bg-indigo-50/50 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Volume2
                        className={`w-5 h-5 shrink-0 ${
                          isSelected ? 'text-amber-300' : 'text-indigo-400'
                        }`}
                      />
                      <div>
                        <div className="font-french font-bold text-xl tracking-wide" dir="ltr">
                          {card.text}
                        </div>
                        {card.phonetic && (
                          <div
                            className={`text-xs mt-0.5 font-medium ${
                              isSelected ? 'text-indigo-100' : 'text-amber-800'
                            }`}
                          >
                            {card.phonetic}
                          </div>
                        )}
                      </div>
                    </div>

                    {card.isMatched && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Meaning Column (Arabic) */}
          <div className="space-y-3">
            <div className="bg-amber-100/70 text-amber-900 px-4 py-2 rounded-2xl text-xs font-bold flex items-center justify-between">
              <span>المعاني باللغة العربية:</span>
              <span className="text-[11px] text-amber-700 font-medium">
                اختاري المعنى المقابل
              </span>
            </div>

            <div className="space-y-2.5">
              {meaningColumnCards.map((card) => {
                const isSelected = selectedMeaning?.id === card.id;
                return (
                  <button
                    key={card.id}
                    disabled={card.isMatched}
                    onClick={() => handleCardClick(card)}
                    className={`w-full p-4 rounded-2xl border-2 text-right transition-all flex items-center justify-between cursor-pointer ${
                      card.isMatched
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 opacity-60 cursor-default'
                        : isSelected
                        ? 'bg-amber-500 border-amber-600 text-white shadow-lg shadow-amber-200 scale-[1.02]'
                        : 'bg-white border-amber-100 hover:border-amber-300 text-slate-800 hover:bg-amber-50/40 shadow-xs'
                    }`}
                  >
                    <div className="font-bold text-lg text-slate-900 pr-2">
                      {card.text}
                    </div>

                    {card.isMatched && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
