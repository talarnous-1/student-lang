import React from 'react';
import { Sparkles, Star, BookOpen, Mic, PenTool, Trophy, ListFilter, FileText, Globe, Palette, Folder, Rocket } from 'lucide-react';
import { ActiveTab, AppLanguage, TrainingLanguage, AppTheme } from '../types';
import { UI_TEXT } from '../translations';
import { playSound } from '../utils/audio';
import { getTheme } from '../utils/theme';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  masteredCount: number;
  totalCount: number;
  onOpenOriginalSheet: () => void;
  onOpenDeployModal?: () => void;
  appLang: AppLanguage;
  setAppLang: (lang: AppLanguage) => void;
  trainingLang: TrainingLanguage;
  setTrainingLang: (lang: TrainingLanguage) => void;
  currentTheme: AppTheme;
  onOpenThemesModal: () => void;
  activeGroupName?: string | null;
  onClearActiveGroup?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  masteredCount,
  totalCount,
  onOpenOriginalSheet,
  onOpenDeployModal,
  appLang,
  setAppLang,
  trainingLang,
  setTrainingLang,
  currentTheme,
  onOpenThemesModal,
  activeGroupName,
  onClearActiveGroup,
}) => {
  const t = appLang === 'en' ? UI_TEXT.en : UI_TEXT.ar;
  const themeConfig = getTheme(currentTheme);

  const tabs = [
    { id: 'learn', label: t.tabs.learn, icon: BookOpen },
    { id: 'pronounce', label: t.tabs.pronounce, icon: Mic },
    { id: 'spelling', label: t.tabs.spelling, icon: PenTool },
    { id: 'game', label: t.tabs.game, icon: Trophy },
    { id: 'rules', label: t.tabs.rules, icon: Sparkles },
    { id: 'groups', label: t.tabs.groups, icon: Folder },
    { id: 'index', label: t.tabs.index, icon: ListFilter },
  ];

  const handleTabChange = (tabId: ActiveTab) => {
    playSound('click');
    setActiveTab(tabId);
  };

  const handleLanguageChange = (newLang: AppLanguage) => {
    playSound('pop');
    setAppLang(newLang);
  };

  const handleTrainingLangChange = (lang: TrainingLanguage) => {
    playSound('celebration');
    setTrainingLang(lang);
  };

  const masteryPercent = totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0;

  return (
    <header className={`${themeConfig.navBg} sticky top-0 z-40 border-b ${themeConfig.navBorder} shadow-xs transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Brand & Stats Header */}
        <div className="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-slate-100/60">
          {/* Logo & Identity */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mascot Badge (French or English flag based on training track!) */}
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md text-2xl transition-all">
                  {trainingLang === 'fr' ? '🇫🇷' : '🇬🇧'}
                </div>
                <span className="absolute -bottom-1 -left-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-french">
                    {trainingLang === 'fr' ? 'Le Français Facile' : 'English For Kids'}
                  </h1>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    trainingLang === 'fr' ? 'bg-indigo-100 text-indigo-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {trainingLang === 'fr' ? 'المسار الفرنسي' : 'المسار الإنجليزي'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                  <span>
                    {trainingLang === 'fr'
                      ? 'تدريب نطق وكتابة وإملاء كلمات اللغة الفرنسية (12 سنة)'
                      : 'Train on pronunciation, writing, and spelling of English words!'}
                  </span>
                  <span className="text-sm">{themeConfig.ambientDecorations[0]}</span>
                </p>
              </div>
            </div>

            {/* Quick Actions (Mobile) */}
            <div className="flex items-center gap-1.5 md:hidden">
              <button
                onClick={() => {
                  playSound('pop');
                  onOpenThemesModal();
                }}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 shadow-2xs"
                title={t.themesBtn}
              >
                <span>{themeConfig.icon}</span>
              </button>
              <button
                onClick={onOpenOriginalSheet}
                className="p-2 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center gap-1 border border-indigo-200"
              >
                <FileText className="w-4 h-4" />
                <span>{appLang === 'en' ? 'Sheet' : 'الورقة'}</span>
              </button>
              {onOpenDeployModal && (
                <button
                  onClick={() => {
                    playSound('celebration');
                    onOpenDeployModal();
                  }}
                  className="p-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
                  title="نشر واستضافة التطبيق مجاناً"
                >
                  <Rocket className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Controls: Training Track Selector, Theme Selector, Interface Lang & Progress */}
          <div className="flex flex-wrap items-center justify-between md:justify-end gap-2 sm:gap-3">
            {/* 🎯 MAIN TRAINING TRACK SELECTOR (FRENCH VS ENGLISH) */}
            <div className="flex items-center bg-indigo-50/90 border-2 border-indigo-200 p-1 rounded-2xl shadow-xs">
              <span className="text-[10px] font-extrabold text-indigo-600 px-2 hidden lg:inline">
                لغة التدريب:
              </span>
              <button
                onClick={() => handleTrainingLangChange('fr')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  trainingLang === 'fr'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-indigo-900 hover:bg-white/60'
                }`}
                title="تدرّبي على نطق وكتابة الفرنسية"
              >
                <span>🇫🇷</span>
                <span>تدريب فرنسي</span>
              </button>
              <button
                onClick={() => handleTrainingLangChange('en')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  trainingLang === 'en'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-blue-900 hover:bg-white/60'
                }`}
                title="Train on English words, pronunciation & spelling!"
              >
                <span>🇬🇧</span>
                <span>تدريب إنجليزي</span>
              </button>
            </div>

            {/* 🎨 THEMES PICKER BUTTON */}
            <button
              onClick={() => {
                playSound('pop');
                onOpenThemesModal();
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-xs border ${
                themeConfig.secondaryButton
              }`}
              title={t.themesBtn}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>{themeConfig.icon}</span>
              <span className="hidden xl:inline">{appLang === 'en' ? themeConfig.nameEn : themeConfig.nameAr}</span>
              <span
                className="w-2.5 h-2.5 rounded-full border border-white shadow-xs inline-block"
                style={{ backgroundColor: themeConfig.previewColor }}
              />
            </button>

            {/* Interface Language Selector Pill */}
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
              <button
                onClick={() => handleLanguageChange('ar')}
                className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                  appLang === 'ar'
                    ? 'bg-white text-indigo-900 shadow-xs'
                    : 'text-slate-600 hover:text-indigo-700'
                }`}
                title="واجهة بالعربي"
              >
                🇸🇦
              </button>
              <button
                onClick={() => handleLanguageChange('en')}
                className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                  appLang === 'en'
                    ? 'bg-white text-indigo-900 shadow-xs'
                    : 'text-slate-600 hover:text-indigo-700'
                }`}
                title="English UI"
              >
                🇬🇧
              </button>
              <button
                onClick={() => handleLanguageChange('bilingual')}
                className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                  appLang === 'bilingual'
                    ? 'bg-white text-indigo-900 shadow-xs'
                    : 'text-slate-600 hover:text-indigo-700'
                }`}
                title="Bilingual / كلاهما"
              >
                🌐
              </button>
            </div>

            {/* Original Sheet Preview Button (Desktop) */}
            <button
              onClick={onOpenOriginalSheet}
              className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-bold transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>{t.originalSheetBtn}</span>
            </button>

            {/* Deploy & Free Server Hosting Guide Button */}
            {onOpenDeployModal && (
              <button
                onClick={() => {
                  playSound('celebration');
                  onOpenDeployModal();
                }}
                className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer"
                title="طريقة نشر التطبيق على سيرفر مجاني ومشاركته"
              >
                <Rocket className="w-4 h-4 animate-pulse" />
                <span>نشر واستضافة مجانية 🚀</span>
              </button>
            )}

            {/* PWA Install Button */}
            <PWAInstallButton appLang={appLang} />

            {/* Star & Mastery Progress Bar */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-2.5 py-1.5 rounded-2xl">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-black text-slate-800 text-sm">
                  {masteredCount} / {totalCount}
                </span>
              </div>

              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg">
                {masteryPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="py-2.5 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <nav className="flex items-center gap-1.5 shrink-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id as ActiveTab)}
                  className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? `${themeConfig.activeTabClass} scale-102`
                      : 'bg-transparent text-slate-600 hover:bg-slate-100/60 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Active Training Group Pill in tab bar if filtered */}
          {activeGroupName && (
            <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold shadow-2xs">
              <span className="animate-pulse">🎯</span>
              <span className="truncate max-w-[140px]">{activeGroupName}</span>
              {onClearActiveGroup && (
                <button
                  onClick={onClearActiveGroup}
                  className="ms-1 p-0.5 text-emerald-600 hover:text-rose-600 rounded-full hover:bg-white transition"
                  title={appLang === 'en' ? 'Show all words' : 'إلغاء الفلترة وعرض الكل'}
                >
                  ✕
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
