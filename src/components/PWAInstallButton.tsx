import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../utils/usePWAInstall';
import { AppLanguage } from '../types';

interface PWAInstallButtonProps {
  appLang: AppLanguage;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ appLang }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const isEn = appLang === 'en';

  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold shadow-sm hover:from-emerald-600 hover:to-teal-700 transition transform active:scale-95"
        title={isEn ? 'Install App on your device (PWA)' : 'تثبيت التطبيق على جهازك (PWA)'}
      >
        <Download className="w-3.5 h-3.5 animate-bounce" />
        <span>{isEn ? 'Install App' : 'تثبيت التطبيق'}</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition transform active:scale-95"
          title={isEn ? 'Install on iPhone / iPad' : 'تثبيت على الآيفون / الآيباد'}
        >
          <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
          <span>{isEn ? 'Install App' : 'تثبيت التطبيق'}</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-indigo-100 text-slate-800">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📲</span>
                  <h3 className="font-bold text-base text-slate-900">
                    {isEn ? 'Install on iPhone / iPad' : 'تثبيت على آيفون أو آيباد'}
                  </h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-xs mt-0.5">
                    1
                  </div>
                  <p>
                    {isEn
                      ? 'Tap the Share button at the bottom of Safari.'
                      : 'اضغط على زر المشاركة (Share) في شريط متصفح سفاري السفلي.'}
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-xs mt-0.5">
                    2
                  </div>
                  <p>
                    {isEn
                      ? 'Scroll down and select "Add to Home Screen".'
                      : 'مرر للأسفل واختر "إضافة إلى الشاشة الرئيسية" (Add to Home Screen).'}
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-xs mt-0.5">
                    3
                  </div>
                  <p>
                    {isEn
                      ? 'Tap "Add" in the top right corner. The app will work offline like a native app!'
                      : 'اضغط "إضافة" في الزاوية العلوية، وسيصبح التطبيق متاحاً على شاشتك الرئيسية ويعمل دون انترنت!'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition"
              >
                {isEn ? 'Got it!' : 'فهمت، حسناً!'}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback triggerable install button so desktop/laptop browsers can also see it
  return (
    <button
      onClick={() => {
        alert(isEn ? 'To install: In Chrome/Edge, click the install icon in your browser address bar.' : 'للتثبيت: من متصفح كروم أو إيدج اضغط على أيقونة التثبيت بجوار شريط العنوان بالأعلى.');
      }}
      className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
      title={isEn ? 'PWA Offline Ready' : 'تطبيق ويب تقدمي PWA'}
    >
      <Download className="w-3.5 h-3.5 text-slate-500" />
      <span>{isEn ? 'PWA Ready' : 'تطبيق PWA'}</span>
    </button>
  );
};
