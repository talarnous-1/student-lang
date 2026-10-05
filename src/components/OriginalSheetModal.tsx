import React from 'react';
import { X, Volume2, Sparkles, BookOpen, CheckCircle, Printer } from 'lucide-react';
import { VocabularyWord } from '../types';
import { speakFrench, playSound } from '../utils/audio';

interface OriginalSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  words: VocabularyWord[];
}

export const OriginalSheetModal: React.FC<OriginalSheetModalProps> = ({
  isOpen,
  onClose,
  words,
}) => {
  if (!isOpen) return null;

  const handlePlayWord = (french: string) => {
    playSound('pop');
    speakFrench(french, 'normal');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-amber-50/40 bg-white rounded-3xl max-w-4xl w-full p-6 md:p-8 space-y-6 shadow-2xl border-4 border-indigo-200 my-6 relative">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b-2 border-indigo-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                ورقة الدرس الأصلية: Compréhension orale (النص الأول)
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                مطابقة طبق الأصل للورقة المرفقة مع إمكانية الاستماع الفوري لأي كلمة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="طباعة الورقة"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Paper look container */}
        <div className="bg-white border-2 border-slate-300 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
          {/* Header of the paper */}
          <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3 text-sm font-bold text-slate-800">
            <div className="font-french text-base tracking-wide">
              Compréhension orale
            </div>
            <div className="text-base text-indigo-900">
              النص الأول (الوحدة المدرسية)
            </div>
          </div>

          {/* Margin Handwritten Notes Banner (matching the photo notes) */}
          <div className="bg-amber-100/60 border border-amber-300 rounded-xl p-3 text-xs text-amber-900 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 font-bold">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>ملاحظات الأستاذ المكتوبة على هامش الورقة:</span>
            </div>
            <div className="font-semibold text-amber-800">
              «بارك الله جهودكِ.. لا تنسي التدقيق والتكرار الصوتي.. الزمان كفيل بالتفوق بالمثابرة»
            </div>
          </div>

          {/* Table of the 20 words */}
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse border border-slate-300 text-sm">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-black">
                  <th className="border border-slate-300 p-2.5 w-14 text-center">#</th>
                  <th className="border border-slate-300 p-2.5 text-left font-french">الكلمة بالفرنسية</th>
                  <th className="border border-slate-300 p-2.5">المعنى بالعربية</th>
                  <th className="border border-slate-300 p-2.5 text-center w-24">اللفظ الصوتي</th>
                </tr>
              </thead>
              <tbody>
                {words.slice(0, 20).map((w) => (
                  <tr
                    key={w.id}
                    className="hover:bg-indigo-50/50 transition-colors border-b border-slate-200"
                  >
                    <td className="border border-slate-300 p-2 text-center font-bold text-slate-500">
                      {w.orderNumber}
                    </td>
                    <td className="border border-slate-300 p-2 font-french font-bold text-base text-left text-indigo-950" dir="ltr">
                      {w.french}
                    </td>
                    <td className="border border-slate-300 p-2 font-bold text-slate-800">
                      {w.arabicMeaning}
                    </td>
                    <td className="border border-slate-300 p-2 text-center">
                      <button
                        onClick={() => handlePlayWord(w.french)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold cursor-pointer transition-all active:scale-95"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>نطق</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
          <span>نصيحة المعلم: كرري الاستماع مرتين لكل كلمة لترسيخ اللفظ الصحيح في الذاكرة.</span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer"
          >
            إغلاق العرض
          </button>
        </div>
      </div>
    </div>
  );
};
