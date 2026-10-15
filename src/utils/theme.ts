import { AppTheme } from '../types';

export interface ThemeConfig {
  id: AppTheme;
  nameAr: string;
  nameEn: string;
  icon: string;
  mascot: string;
  taglineAr: string;
  taglineEn: string;
  previewColor: string; // CSS color or hex
  accentRing: string;
  bgPage: string;
  navBg: string;
  navBorder: string;
  activeTabClass: string;
  primaryButton: string;
  secondaryButton: string;
  accentBadge: string;
  cardBg: string;
  cardBorder: string;
  bannerBg: string;
  bannerBorder: string;
  bannerTextColor: string;
  particleColors: string[];
  ambientDecorations: string[];
}

export const APP_THEMES: Record<AppTheme, ThemeConfig> = {
  default: {
    id: 'default',
    nameAr: 'البنفسجي الذكي (الافتراضي)',
    nameEn: 'Smart Indigo (Default)',
    icon: '🎨',
    mascot: '🦉',
    taglineAr: 'طابع كلاسيكي أنيق ومريح ومناسب للدراسة والتركيز',
    taglineEn: 'Classic elegant indigo style, focused and clean',
    previewColor: '#6366f1',
    accentRing: 'ring-indigo-400',
    bgPage: 'bg-slate-100/80 text-slate-800',
    navBg: 'bg-white/95 backdrop-blur-md',
    navBorder: 'border-indigo-100',
    activeTabClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-200',
    primaryButton: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200',
    secondaryButton: 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200',
    accentBadge: 'bg-indigo-100 text-indigo-800',
    cardBg: 'bg-white',
    cardBorder: 'border-indigo-100 hover:border-indigo-300',
    bannerBg: 'bg-indigo-50',
    bannerBorder: 'border-indigo-200',
    bannerTextColor: 'text-indigo-900',
    particleColors: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'],
    ambientDecorations: ['✨', '📚', '⭐', '🎈'],
  },
  ocean: {
    id: 'ocean',
    nameAr: 'أعماق البحار والمحيط',
    nameEn: 'Ocean Explorer',
    icon: '🌊',
    mascot: '🐬',
    taglineAr: 'أمواج فيروزية دافئة، دلافين مرحة وفقاعات مبهجة',
    taglineEn: 'Turquoise ocean waves, playful dolphins & deep sea breeze',
    previewColor: '#0ea5e9',
    accentRing: 'ring-cyan-400',
    bgPage: 'bg-gradient-to-br from-cyan-50/90 via-sky-50 to-teal-50 text-slate-800',
    navBg: 'bg-white/90 backdrop-blur-md',
    navBorder: 'border-cyan-200',
    activeTabClass: 'bg-cyan-600 text-white shadow-md shadow-cyan-200',
    primaryButton: 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-200',
    secondaryButton: 'bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border-cyan-200',
    accentBadge: 'bg-cyan-100 text-cyan-900',
    cardBg: 'bg-white/95 backdrop-blur-xs',
    cardBorder: 'border-cyan-200 hover:border-cyan-400',
    bannerBg: 'bg-gradient-to-r from-cyan-100/90 to-teal-50',
    bannerBorder: 'border-cyan-300',
    bannerTextColor: 'text-cyan-950',
    particleColors: ['#06b6d4', '#0ea5e9', '#38bdf8', '#2dd4bf', '#fbbf24'],
    ambientDecorations: ['🌊', '🐬', '🫧', '🐚', '🐠'],
  },
  forest: {
    id: 'forest',
    nameAr: 'مغامرة الغابة السحرية',
    nameEn: 'Jungle Safari',
    icon: '🌿',
    mascot: '🦁',
    taglineAr: 'طبيعة زمردية خضراء، طيور مغردة وروح المغامرة والاستكشاف',
    taglineEn: 'Lush emerald canopy, safari animals & fresh discovery',
    previewColor: '#10b981',
    accentRing: 'ring-emerald-400',
    bgPage: 'bg-gradient-to-br from-emerald-50/90 via-green-50 to-lime-50 text-slate-800',
    navBg: 'bg-white/90 backdrop-blur-md',
    navBorder: 'border-emerald-200',
    activeTabClass: 'bg-emerald-600 text-white shadow-md shadow-emerald-200',
    primaryButton: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200',
    secondaryButton: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200',
    accentBadge: 'bg-emerald-100 text-emerald-900',
    cardBg: 'bg-white/95 backdrop-blur-xs',
    cardBorder: 'border-emerald-200 hover:border-emerald-400',
    bannerBg: 'bg-gradient-to-r from-emerald-100/80 to-lime-50',
    bannerBorder: 'border-emerald-300',
    bannerTextColor: 'text-emerald-950',
    particleColors: ['#10b981', '#059669', '#84cc16', '#eab308', '#065f46'],
    ambientDecorations: ['🌿', '🦁', '🦜', '🍃', '🌻'],
  },
  space: {
    id: 'space',
    nameAr: 'رواد الفضاء والنجوم',
    nameEn: 'Cosmic Galaxy',
    icon: '🚀',
    mascot: '🪐',
    taglineAr: 'مغامرة كونية بين المجرات والكواكب وبريق النجوم الساطعة',
    taglineEn: 'Journey among distant galaxies, cosmic planets & starlight',
    previewColor: '#8b5cf6',
    accentRing: 'ring-purple-400',
    bgPage: 'bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950 text-slate-100',
    navBg: 'bg-slate-900/90 backdrop-blur-md',
    navBorder: 'border-purple-800/60',
    activeTabClass: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/30',
    primaryButton: 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-900/50',
    secondaryButton: 'bg-purple-900/40 hover:bg-purple-900/70 text-purple-200 border-purple-700',
    accentBadge: 'bg-purple-900/80 text-purple-200 border border-purple-700',
    cardBg: 'bg-slate-800/90 backdrop-blur-md border border-purple-800/40',
    cardBorder: 'border-purple-800/50 hover:border-purple-400',
    bannerBg: 'bg-gradient-to-r from-purple-900/60 to-indigo-900/60',
    bannerBorder: 'border-purple-700',
    bannerTextColor: 'text-purple-100',
    particleColors: ['#a855f7', '#6366f1', '#38bdf8', '#facc15', '#ec4899'],
    ambientDecorations: ['🚀', '🪐', '⭐', '☄️', '🛸'],
  },
  candy: {
    id: 'candy',
    nameAr: 'مملكة الحلوى والورود',
    nameEn: 'Sweet Candy Land',
    icon: '🍭',
    mascot: '🦄',
    taglineAr: 'ألوان حلوى وردية مبهجة، فراشات ملونة، وبريق ساحر',
    taglineEn: 'Cheerful cotton candy pinks, magical butterflies & sprinkles',
    previewColor: '#ec4899',
    accentRing: 'ring-pink-400',
    bgPage: 'bg-gradient-to-br from-pink-50/90 via-rose-50 to-purple-50 text-slate-800',
    navBg: 'bg-white/90 backdrop-blur-md',
    navBorder: 'border-pink-200',
    activeTabClass: 'bg-pink-600 text-white shadow-md shadow-pink-200',
    primaryButton: 'bg-pink-600 hover:bg-pink-700 text-white shadow-pink-200',
    secondaryButton: 'bg-pink-50 hover:bg-pink-100 text-pink-800 border-pink-200',
    accentBadge: 'bg-pink-100 text-pink-900',
    cardBg: 'bg-white/95 backdrop-blur-xs',
    cardBorder: 'border-pink-200 hover:border-pink-400',
    bannerBg: 'bg-gradient-to-r from-pink-100/90 to-purple-50',
    bannerBorder: 'border-pink-300',
    bannerTextColor: 'text-pink-950',
    particleColors: ['#ec4899', '#f43f5e', '#a855f7', '#fbcfe8', '#f59e0b'],
    ambientDecorations: ['🍭', '🦄', '🎀', '🧁', '🌸'],
  },
};

export function getTheme(theme: AppTheme): ThemeConfig {
  return APP_THEMES[theme] || APP_THEMES.default;
}
