import React, { useState, useRef, useEffect } from 'react';
import { Volume2, Snail, Check, X, RotateCcw, Lightbulb, Trophy, Sparkles, ArrowLeft, ArrowRight, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { VocabularyWord } from '../types';
import { speakFrench, playSound, normalizeFrench } from '../utils/audio';

interface SpellingLabProps {
  words: VocabularyWord[];
  onWordMastered: (id: string) => void;
}

const ACCENT_KEYS = ['é', 'è', 'ê', 'à', 'â', 'î', 'ï', 'ô', 'ù', 'û', 'ç', 'œ'];

export const SpellingLab: React.FC<SpellingLabProps> = ({ words, onWordMastered }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const currentWord = words[currentIndex] || words[0];

  // Primary French spelling (if has slash, check against both or primary)
  const acceptedSpellings = currentWord.french.split('/').map((s) => s.trim().toLowerCase());
  const primarySpelling = acceptedSpellings[0];

  useEffect(() => {
    // Reset state for new word
    setUserInput('');
    setIsSubmitted(false);
    setIsCorrect(false);
    setShowHint(false);
    // Auto play audio gently when moving to new word
    speakFrench(currentWord.french, 'normal');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex, currentWord.french]);

  const insertAccent = (char: string) => {
    playSound('pop');
    if (inputRef.current) {
      const start = inputRef.current.selectionStart || userInput.length;
      const end = inputRef.current.selectionEnd || userInput.length;
      const updated = userInput.substring(0, start) + char + userInput.substring(end);
      setUserInput(updated);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.setSelectionRange(start + 1, start + 1);
          inputRef.current.focus();
        }
      }, 0);
    } else {
      setUserInput((prev) => prev + char);
    }
  };

  const handleCheck = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userInput.trim()) return;

    const trimmedInput = userInput.trim().toLowerCase();
    
    // Exact or accepted match
    const exactMatch = acceptedSpellings.some((sp) => sp.toLowerCase() === trimmedInput);
    // Normalized match (ignore accents/punctuation just in case)
    const normalizedMatch = acceptedSpellings.some((sp) => normalizeFrench(sp) === normalizeFrench(trimmedInput));

    setIsSubmitted(true);

    if (exactMatch) {
      setIsCorrect(true);
      setScore((prev) => prev + 10);
      setStreak((prev) => prev + 1);
      playSound('celebration');
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
      });
      onWordMastered(currentWord.id);
    } else if (normalizedMatch) {
      // Correct letters, but missed an accent mark!
      setIsCorrect(false);
      playSound('wrong');
    } else {
      setIsCorrect(false);
      setStreak(0);
      playSound('wrong');
    }
  };

  const handleNextWord = () => {
    playSound('click');
    if (currentIndex < words.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  // Build character by character diff for feedback
  const renderComparisonDiff = () => {
    const target = primarySpelling;
    const input = userInput.trim().toLowerCase();

    return (
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 py-2">
          {/* Target */}
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl px-5 py-3 text-center">
            <span className="text-xs font-bold text-emerald-800 block mb-1">الكتابة الصحيحة المتقنة:</span>
            <span className="text-2xl md:text-3xl font-french font-bold text-emerald-950 tracking-wider">
              {currentWord.french}
            </span>
          </div>

          {/* User Input */}
          <div
            className={`border-2 rounded-2xl px-5 py-3 text-center ${
              isCorrect ? 'bg-emerald-50 border-emerald-300' : 'bg-rose-50 border-rose-300'
            }`}
          >
            <span className="text-xs font-bold text-slate-600 block mb-1">ما كتبتِه أنتِ:</span>
            <span
              className={`text-2xl md:text-3xl font-french font-bold tracking-wider ${
                isCorrect ? 'text-emerald-950' : 'text-rose-950'
              }`}
            >
              {userInput || '(فارغ)'}
            </span>
          </div>
        </div>

        {/* Diagnostic Tip */}
        <div className="text-sm bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
          {isCorrect ? (
            <span className="text-emerald-700 font-bold flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
              أحسنتِ صنعاً يا بطلة الإملاء! كتابة صحيحة 100% مع الحركات بدقة متناهية.
            </span>
          ) : (
            <div className="space-y-1 text-slate-700">
              <span className="font-bold text-rose-700 block">
                تلميح التصحيح من الأستاذ:
              </span>
              <span>
                {currentWord.pronunciationTip}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 rounded-3xl p-6 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-0.5 rounded-full text-xs font-bold">
            <Trophy className="w-3.5 h-3.5 text-amber-300" />
            <span>استوديو الإملاء والكتابة الفرنسية (Dictée)</span>
          </div>
          <h2 className="text-2xl font-black">
            استمعي جيداً واكتبي الكلمة بحروفها الصحيحة ✍️
          </h2>
          <p className="text-xs text-indigo-100">
            استخدمي شريط الحركات الفرنسية بالأسفل لوضع النبرات (Accents) بسهولة!
          </p>
        </div>

        {/* Score & Streak Counters */}
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
          <div className="text-center">
            <span className="text-[10px] text-indigo-200 block font-bold">النقاط</span>
            <span className="text-xl font-black text-amber-300">{score}</span>
          </div>
          <div className="w-px h-8 bg-white/20"></div>
          <div className="text-center">
            <span className="text-[10px] text-indigo-200 block font-bold">التتالي 🔥</span>
            <span className="text-xl font-black text-white">{streak}</span>
          </div>
        </div>
      </div>

      {/* Main Dictation Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border-2 border-indigo-100 space-y-6">
        {/* Audio Clue Section */}
        <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-6 text-center space-y-4">
          <span className="text-xs font-bold text-indigo-800 bg-white px-3 py-1 rounded-full border border-indigo-200 shadow-2xs">
            الكلمة #{currentWord.orderNumber} من {words.length}
          </span>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                playSound('pop');
                speakFrench(currentWord.french, 'normal');
              }}
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-sm shadow-md shadow-indigo-200 flex items-center gap-2 cursor-pointer transition-all"
            >
              <Volume2 className="w-5 h-5 text-indigo-200" />
              <span>استمعي للكلمة</span>
            </button>

            <button
              onClick={() => {
                playSound('pop');
                speakFrench(currentWord.french, 'slow');
              }}
              className="px-5 py-3 rounded-2xl bg-white border-2 border-indigo-300 hover:bg-indigo-50 active:scale-95 text-indigo-700 font-bold text-sm flex items-center gap-2 cursor-pointer transition-all"
            >
              <Snail className="w-5 h-5 text-indigo-500" />
              <span>استمعي ببطء</span>
            </button>
          </div>

          {/* Meaning context clue */}
          <div className="pt-2 text-slate-700">
            <span className="text-xs font-bold text-slate-500 block mb-1">المعنى المطلوب بالعربية:</span>
            <span className="text-2xl font-black text-indigo-950">
              {currentWord.arabicMeaning}
            </span>
          </div>

          {/* Optional Hint */}
          <div>
            {!showHint ? (
              <button
                onClick={() => setShowHint(true)}
                className="text-xs text-amber-700 hover:text-amber-800 font-bold inline-flex items-center gap-1.5 cursor-pointer underline underline-offset-4"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>أريد تلميحاً صغيراً يا أستاذ</span>
              </button>
            ) : (
              <div className="inline-block bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900">
                <span>الحرف الأول هو: </span>
                <span className="font-french font-bold text-base text-amber-950 underline px-1">
                  {primarySpelling[0].toUpperCase()}
                </span>
                <span> • عدد المقاطع: {currentWord.syllables.filter(s => s !== '—').length}</span>
              </div>
            )}
          </div>
        </div>

        {/* Input & Form */}
        <form onSubmit={handleCheck} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 block">
              اكتبي الكلمة باللغة الفرنسية هنا:
            </label>
            <input
              ref={inputRef}
              type="text"
              dir="ltr"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Tapez le mot ici..."
              disabled={isSubmitted && isCorrect}
              className={`w-full py-4 px-5 text-2xl md:text-3xl font-french font-bold text-center rounded-2xl border-2 outline-none transition-all shadow-inner ${
                isSubmitted
                  ? isCorrect
                    ? 'border-emerald-500 bg-emerald-50/50 text-emerald-950'
                    : 'border-rose-400 bg-rose-50/50 text-rose-950'
                  : 'border-indigo-300 focus:border-indigo-600 bg-slate-50 focus:bg-white text-slate-800'
              }`}
            />
          </div>

          {/* Virtual French Accents Bar */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
            <div className="text-[11px] font-bold text-slate-500 mb-2 flex items-center justify-between">
              <span>شريط الحركات والأكسنت الفرنسية (انقري لإدراج الحرف فوراً):</span>
              <span className="text-[10px] text-indigo-600 font-semibold">Accents français</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-1.5" dir="ltr">
              {ACCENT_KEYS.map((acc) => (
                <button
                  key={acc}
                  type="button"
                  onClick={() => insertAccent(acc)}
                  className="w-10 h-10 rounded-xl bg-white border border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50 text-indigo-800 font-french font-bold text-lg active:scale-90 shadow-2xs transition-all cursor-pointer"
                >
                  {acc}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback & Actions */}
          {isSubmitted ? (
            <div className="space-y-5">
              {renderComparisonDiff()}

              <div className="flex items-center justify-center gap-4 pt-2">
                {!isCorrect && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      if (inputRef.current) inputRef.current.focus();
                    }}
                    className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md shadow-amber-200 flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>سأحاول كتابتها مجدداً</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleNextWord}
                  className="px-8 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 flex items-center gap-2 cursor-pointer transition-all"
                >
                  <span>الكلمة التالية</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <button
              type="submit"
              disabled={!userInput.trim()}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-base shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Check className="w-5 h-5" />
              <span>تحقق من صحة الإملاء والكتابة</span>
            </button>
          )}
        </form>

        {/* Word Switcher Footbar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="text-slate-600 hover:text-slate-900 font-bold flex items-center gap-1 disabled:opacity-30 cursor-pointer"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>السابق</span>
          </button>

          <span className="text-slate-500 font-semibold">
            {currentIndex + 1} / {words.length}
          </span>

          <button
            onClick={() => setCurrentIndex((prev) => Math.min(words.length - 1, prev + 1))}
            disabled={currentIndex === words.length - 1}
            className="text-slate-600 hover:text-slate-900 font-bold flex items-center gap-1 disabled:opacity-30 cursor-pointer"
          >
            <span>التالي</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
