import React from 'react';
import { X, Check, Sparkles, Palette } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AppLanguage, AppTheme } from '../types';
import { APP_THEMES, ThemeConfig } from '../utils/theme';
import { playSound } from '../utils/audio';
import { UI_TEXT } from '../translations';

interface ThemeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: AppTheme;
  onSelectTheme: (theme: AppTheme) => void;
  appLang: AppLanguage;
}

export const ThemeSettingsModal: React.FC<ThemeSettingsModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
  appLang,
}) => {
  if (!isOpen) return null;

  const t = appLang === 'en' ? UI_TEXT.en : UI_TEXT.ar;
  const themesList = Object.values(APP_THEMES);

  const handleChooseTheme = (theme: ThemeConfig) => {
    playSound('celebration');
    onSelectTheme(theme.id);
    confetti({
      particleCount: 55,
      spread: 70,
      colors: theme.particleColors,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl border border-slate-200 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 flex items-center justify-center text-white shadow-md text-2xl">
              🎨
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl md:text-2xl font-black text-slate-900">
                  {t.themesModalTitle}
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {t.themesModalDesc}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="p-2.5 rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {themesList.map((theme) => {
            const isSelected = currentTheme === theme.id;
            return (
              <div
                key={theme.id}
                onClick={() => handleChooseTheme(theme)}
                className={`group relative p-4 rounded-3xl border-2 transition-all cursor-pointer text-right flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
                  isSelected
                    ? `${theme.accentRing} ring-3 border-transparent bg-slate-50/90 scale-102`
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                }`}
              >
                {/* Visual Header / Avatar Banner */}
                <div className="flex items-center justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl p-2 rounded-2xl bg-white shadow-xs border border-slate-100 group-hover:scale-110 transition-transform">
                      {theme.icon}
                    </span>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                        <span>{appLang === 'en' ? theme.nameEn : theme.nameAr}</span>
                        <span className="text-sm">{theme.mascot}</span>
                      </h4>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span
                          className="w-3 h-3 rounded-full border border-white shadow-xs inline-block"
                          style={{ backgroundColor: theme.previewColor }}
                        />
                        <span className="text-[10px] text-slate-600 font-semibold">
                          {theme.ambientDecorations.join(' ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs shrink-0">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Theme Description */}
                <p className="text-xs text-slate-600 font-medium mb-3">
                  {appLang === 'en' ? theme.taglineEn : theme.taglineAr}
                </p>

                {/* Mini Preview Chip */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-xl transition-all ${
                      isSelected
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                    }`}
                  >
                    {isSelected ? t.activeThemeBadge : (appLang === 'en' ? 'Click to apply' : 'انقري للتطبيق 👆')}
                  </span>

                  <div className="flex items-center gap-1">
                    {theme.particleColors.slice(0, 3).map((c, i) => (
                      <span
                        key={i}
                        className="w-2.5 h-2.5 rounded-full inline-block opacity-80"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              {appLang === 'en'
                ? 'Your selected theme is automatically saved on this device!'
                : 'يتم حفظ السمة المختارة تلقائياً وتطبيقها على جميع شاشات التطبيق والأزرار والبطاقات!'}
            </span>
          </div>

          <button
            onClick={() => {
              playSound('pop');
              onClose();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold cursor-pointer transition-all active:scale-95"
          >
            {appLang === 'en' ? 'Done' : 'تم، العودة للدرس ✓'}
          </button>
        </div>
      </div>
    </div>
  );
};
