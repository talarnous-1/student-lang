import React, { useState, useEffect } from 'react';
import { Sparkles, RotateCcw, Volume2, Trophy, Clock, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { VocabularyWord } from '../types';
import { speakFrench, playSound } from '../utils/audio';

interface MatchingGameProps {
  words: VocabularyWord[];
  onWordMastered: (id: string) => void;
}

interface GameCard {
  id: string;
  wordId: string;
  type: 'french' | 'arabic';
  text: string;
  isMatched: boolean;
  phonetic?: string;
}

export const MatchingGame: React.FC<MatchingGameProps> = ({ words, onWordMastered }) => {
  const [cards, setCards] = useState<GameCard[]>([]);
  const [selectedFrench, setSelectedFrench] = useState<GameCard | null>(null);
  const [selectedArabic, setSelectedArabic] = useState<GameCard | null>(null);
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

    const frenchCards: GameCard[] = selectedWords.map((w) => ({
      id: `fr-${w.id}`,
      wordId: w.id,
      type: 'french',
      text: w.french,
      phonetic: w.arabicPhonetic,
      isMatched: false,
    }));

    const arabicCards: GameCard[] = selectedWords.map((w) => ({
      id: `ar-${w.id}`,
      wordId: w.id,
      type: 'arabic',
      text: w.arabicMeaning,
      isMatched: false,
    }));

    // Shuffle both independently
    setCards([
      ...frenchCards.sort(() => Math.random() - 0.5),
      ...arabicCards.sort(() => Math.random() - 0.5),
    ]);

    setSelectedFrench(null);
    setSelectedArabic(null);
    setMoves(0);
    setSeconds(0);
    setIsGameActive(true);
    setIsCompleted(false);
  };

  useEffect(() => {
    startNewGame(0);
  }, [words]);

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

    if (card.type === 'french') {
      speakFrench(card.text, 'normal');
      if (selectedFrench?.id === card.id) {
        setSelectedFrench(null);
        return;
      }
      setSelectedFrench(card);

      // Check match if arabic already selected
      if (selectedArabic) {
        checkMatch(card, selectedArabic);
      }
    } else {
      if (selectedArabic?.id === card.id) {
        setSelectedArabic(null);
        return;
      }
      setSelectedArabic(card);

      // Check match if french already selected
      if (selectedFrench) {
        checkMatch(selectedFrench, card);
      }
    }
  };

  const checkMatch = (frCard: GameCard, arCard: GameCard) => {
    setMoves((prev) => prev + 1);

    if (frCard.wordId === arCard.wordId) {
      // Correct Match!
      playSound('correct');
      setCards((prev) =>
        prev.map((c) =>
          c.wordId === frCard.wordId ? { ...c, isMatched: true } : c
        )
      );
      onWordMastered(frCard.wordId);

      setSelectedFrench(null);
      setSelectedArabic(null);

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
        setSelectedFrench(null);
        setSelectedArabic(null);
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

  const frenchColumnCards = cards.filter((c) => c.type === 'french');
  const arabicColumnCards = cards.filter((c) => c.type === 'arabic');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 rounded-3xl p-6 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-0.5 rounded-full text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
            <span>لعبة الذكاء والسرعة الفرنسية</span>
          </div>
          <h2 className="text-2xl font-black">
            صلي كل كلمة فرنسية بمعناها العربي الصحيح 🎯
          </h2>
          <p className="text-xs text-rose-100">
            انقري على الكلمة الفرنسية لتسمعي نطقها العذب، ثم اختاري معناها بالعربي بأسرع وقت!
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/20">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-200" />
            <span className="font-mono font-bold text-lg">{formatTime(seconds)}</span>
          </div>
          <div className="w-px h-6 bg-white/20"></div>
          <div className="text-xs font-bold">
            <span>المحاولات: </span>
            <span className="text-amber-200 text-sm">{moves}</span>
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
              أحسنتِ صنعاً يا أميرة الفرنسية! 🎉
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
              <span>إعادة هذه الجولة</span>
            </button>

            <button
              onClick={handleNextRound}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md shadow-emerald-200 flex items-center gap-2 cursor-pointer transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>جولة كلمات جديدة! 🚀</span>
            </button>
          </div>
        </div>
      ) : (
        /* Game Dual Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* French Column */}
          <div className="space-y-3">
            <div className="bg-indigo-100/70 text-indigo-900 px-4 py-2 rounded-2xl text-xs font-bold flex items-center justify-between">
              <span>الكلمات الفرنسية (En Français):</span>
              <span className="text-[11px] text-indigo-600 font-medium">اضغطي للاستماع</span>
            </div>

            <div className="space-y-2.5">
              {frenchColumnCards.map((card) => {
                const isSelected = selectedFrench?.id === card.id;
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
                            نطق: {card.phonetic}
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

          {/* Arabic Column */}
          <div className="space-y-3">
            <div className="bg-amber-100/70 text-amber-900 px-4 py-2 rounded-2xl text-xs font-bold flex items-center justify-between">
              <span>المعاني باللغة العربية:</span>
              <span className="text-[11px] text-amber-700 font-medium">اختاري المعنى المقابل</span>
            </div>

            <div className="space-y-2.5">
              {arabicColumnCards.map((card) => {
                const isSelected = selectedArabic?.id === card.id;
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
