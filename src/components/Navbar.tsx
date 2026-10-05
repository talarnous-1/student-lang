import React from 'react';
import { Sparkles, Star, Trophy, BookOpen, Mic, PenTool, LayoutGrid, ListFilter, FileText } from 'lucide-react';
import { ActiveTab } from '../types';
import { playSound } from '../utils/audio';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  masteredCount: number;
  totalCount: number;
  onOpenOriginalSheet: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  masteredCount,
  totalCount,
  onOpenOriginalSheet,
}) => {
  const tabs = [
    { id: 'learn', label: 'بطاقات التعلم', icon: BookOpen, desc: 'سماع ومقاطع وأمثلة' },
    { id: 'pronounce', label: 'مختبر اللفظ', icon: Mic, desc: 'تسجيل ومقارنة الصوت' },
    { id: 'spelling', label: 'استوديو الإملاء', icon: PenTool, desc: 'كتابة بالحركات' },
    { id: 'game', label: 'تحدي المطابقة', icon: Trophy, desc: 'ألعاب الذكاء والسرعة' },
    { id: 'rules', label: 'قواعد النطق', icon: Sparkles, desc: 'أسرار الحروف الصامتة' },
    { id: 'index', label: 'فهرس الكلمات', icon: ListFilter, desc: 'تعديل وإضافة كلمات' },
  ];

  const handleTabChange = (tabId: ActiveTab) => {
    playSound('click');
    setActiveTab(tabId);
  };

  const masteryPercent = totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0;

  return (
    <header className="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-indigo-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Brand & Stats Header */}
        <div className="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-slate-100">
          {/* Logo & Identity */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* French Flag Mascot Badge */}
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 text-2xl">
                  🇫🇷
                </div>
                <span className="absolute -bottom-1 -left-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Le Français Facile
                  </h1>
                  <span className="bg-indigo-100 text-indigo-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    الأستاذ الذكي
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  منصة تعليمية تفاعلية مخصصة لإتقان نطق وكتابة وحفظ مفردات الفرنسية (12 سنة)
                </p>
              </div>
            </div>

            {/* Quick Original Sheet Button (Mobile) */}
            <button
              onClick={onOpenOriginalSheet}
              className="md:hidden p-2 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center gap-1 border border-indigo-200"
            >
              <FileText className="w-4 h-4" />
              <span>الورقة</span>
            </button>
          </div>

          {/* Progress & Quick Actions */}
          <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4">
            {/* Original Sheet Preview Button (Desktop) */}
            <button
              onClick={onOpenOriginalSheet}
              className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-bold transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>ورقة الدرس الأصلية (20 كلمة)</span>
            </button>

            {/* Star & Mastery Progress Bar */}
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 px-3.5 py-1.5 rounded-2xl">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-black text-slate-800 text-sm">
                  {masteredCount} / {totalCount}
                </span>
              </div>

              <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden hidden sm:block">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${masteryPercent}%` }}
                ></div>
              </div>

              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg">
                {masteryPercent}% إتقان
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <nav className="py-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as ActiveTab)}
                className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-102'
                    : 'bg-transparent text-slate-600 hover:bg-indigo-50/60 hover:text-indigo-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
