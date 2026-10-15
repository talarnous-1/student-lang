import React, { useState } from 'react';
import { X, Rocket, Globe, Copy, Check, ExternalLink, ShieldCheck, Terminal, UploadCloud, FolderCheck, Sparkles, AlertCircle } from 'lucide-react';
import { AppLanguage } from '../types';
import { playSound } from '../utils/audio';

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  appLang: AppLanguage;
}

export const DeployModal: React.FC<DeployModalProps> = ({ isOpen, onClose, appLang }) => {
  const [activeTab, setActiveTab] = useState<'netlify' | 'vercel' | 'github' | 'cloudflare'>('netlify');
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    playSound('pop');
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]"
        dir="rtl"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 text-white relative shrink-0">
          <button
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="absolute top-5 left-5 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all cursor-pointer text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <span className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-xs text-white">
              <Rocket className="w-6 h-6 animate-bounce" />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black">
                نشر التطبيق على سيرفر مجاني 🚀
              </h2>
              <p className="text-white/80 text-xs sm:text-sm font-medium">
                دليل كامل وسريع لنشر هذا التطبيق ومشاركته مع الأصدقاء والطلاب مجاناً 100%
              </p>
            </div>
          </div>

          {/* Quick Readiness Badge */}
          <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-bold">
            <span className="bg-white/20 px-2.5 py-1 rounded-xl flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              جاهز للنشر كـ SPA PWA
            </span>
            <span className="bg-white/20 px-2.5 py-1 rounded-xl flex items-center gap-1.5">
              <FolderCheck className="w-3.5 h-3.5 text-amber-300" />
              ملفات vercel.json و _redirects مدمجة
            </span>
            <span className="bg-white/20 px-2.5 py-1 rounded-xl flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-200" />
              أكثر من 550 كلمة تعليمية
            </span>
          </div>
        </div>

        {/* Platform Selection Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-3 gap-2 overflow-x-auto shrink-0">
          <button
            onClick={() => {
              playSound('pop');
              setActiveTab('netlify');
            }}
            className={`pb-2.5 px-4 rounded-t-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'netlify'
                ? 'border-emerald-500 text-emerald-700 bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UploadCloud className="w-4 h-4 text-emerald-500" />
            <span>1. Netlify Drop (الأسهل دون كود)</span>
          </button>

          <button
            onClick={() => {
              playSound('pop');
              setActiveTab('vercel');
            }}
            className={`pb-2.5 px-4 rounded-t-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'vercel'
                ? 'border-indigo-600 text-indigo-700 bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Globe className="w-4 h-4 text-indigo-600" />
            <span>2. Vercel (الأسرع والأشهر)</span>
          </button>

          <button
            onClick={() => {
              playSound('pop');
              setActiveTab('github');
            }}
            className={`pb-2.5 px-4 rounded-t-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'github'
                ? 'border-purple-600 text-purple-700 bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Terminal className="w-4 h-4 text-purple-600" />
            <span>3. GitHub Pages</span>
          </button>

          <button
            onClick={() => {
              playSound('pop');
              setActiveTab('cloudflare');
            }}
            className={`pb-2.5 px-4 rounded-t-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'cloudflare'
                ? 'border-amber-600 text-amber-700 bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Rocket className="w-4 h-4 text-amber-600" />
            <span>4. Cloudflare / Render</span>
          </button>
        </div>

        {/* Modal Body / Tab Contents */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* TAB 1: NETLIFY DROP */}
          {activeTab === 'netlify' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
                <div className="p-2 bg-emerald-100 rounded-xl text-emerald-700 shrink-0 font-bold">
                  ★ ممتاز للمبتدئين
                </div>
                <div className="text-xs text-emerald-900 leading-relaxed">
                  <p className="font-bold text-sm text-emerald-800 mb-1">
                    طريقة السحب والإفلات (Drag & Drop) بدون أي تعقيد أو كتابة أوامر!
                  </p>
                  يمكنك الحصول على موقع مجاني يعمل برابط دائم (مثال: <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-emerald-300">app-name.netlify.app</span>) وشهادة أمان HTTPS مجانية مدى الحياة.
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">1</span>
                  خطوات النشر على Netlify:
                </h3>

                <ol className="list-decimal list-inside space-y-3 pr-2 text-slate-700 text-xs sm:text-sm leading-relaxed">
                  <li className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="text-slate-900">بناء المشروع (إنشاء مجلد dist):</strong>
                    <p className="mt-1 text-slate-600 text-xs">
                      تم تجهيز المجلد المترجم مسبقاً، أو يمكنك تشغيل الأمر التالي في مجلد المشروع:
                    </p>
                    <div className="mt-2 flex items-center justify-between bg-slate-900 text-emerald-400 p-2.5 rounded-lg font-mono text-xs" dir="ltr">
                      <span>npm run build</span>
                      <button
                        onClick={() => copyToClipboard('npm run build', 'net-build')}
                        className="text-slate-400 hover:text-white p-1"
                        title="نسخ الأمر"
                      >
                        {copiedIndex === 'net-build' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </li>

                  <li className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="text-slate-900">افتح صفحة Netlify Drop:</strong>
                    <p className="mt-1 text-slate-600 text-xs">
                      تفضل بزيارة الرابط المباشر لرفع الملفات مجاناً (لا يتطلب حتى تسجيل الدخول في المرة الأولى!):
                    </p>
                    <a
                      href="https://app.netlify.com/drop"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs"
                    >
                      <span>الانتقال إلى Netlify Drop</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </li>

                  <li className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="text-slate-900">سحب وإفلات مجلد dist:</strong>
                    <p className="mt-1 text-slate-600 text-xs">
                      اسحب مجلد <code className="bg-slate-200 px-1 py-0.5 rounded text-indigo-700 font-bold">dist</code> وأفلته في الدائرة الظاهرة بالصفحة. سيبدأ الرفع وفي خلال 10 ثوانٍ ستحصل على رابط حي ومباشر لتطبيقه يمكنك إرساله للجميع!
                    </p>
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 2: VERCEL */}
          {activeTab === 'vercel' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex items-start gap-3">
                <div className="p-2 bg-indigo-100 rounded-xl text-indigo-700 shrink-0 font-bold">
                  ★ الأقوى والأسرع
                </div>
                <div className="text-xs text-indigo-900 leading-relaxed">
                  <p className="font-bold text-sm text-indigo-800 mb-1">
                    Vercel هي المنصة الأفضل لمشاريع Vite و React مع تحديثات تلقائية مستمرة.
                  </p>
                  كل تعديل تقوم به وترفعه إلى GitHub يتم نشره تلقائياً فوراً على الرابط المجاني الخاص بك.
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">1</span>
                  النشر بنقرة واحدة عبر GitHub & Vercel:
                </h3>

                <ol className="list-decimal list-inside space-y-3 pr-2 text-slate-700 text-xs sm:text-sm leading-relaxed">
                  <li className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="text-slate-900">رفع المشروع إلى GitHub:</strong>
                    <p className="mt-1 text-slate-600 text-xs">
                      قم بإنشاء مستودع جديد على GitHub ثم ادفع الكود إليه:
                    </p>
                    <div className="mt-2 bg-slate-900 text-indigo-300 p-3 rounded-lg font-mono text-xs space-y-1 relative" dir="ltr">
                      <p>git init</p>
                      <p>git add .</p>
                      <p>git commit -m "Launch Le Français Facile App"</p>
                      <p>git branch -M main</p>
                      <p>git remote add origin https://github.com/USERNAME/REPO.git</p>
                      <p>git push -u origin main</p>
                      <button
                        onClick={() => copyToClipboard('git init\ngit add .\ngit commit -m "Launch Le Français Facile App"\ngit branch -M main\ngit push -u origin main', 'git-all')}
                        className="absolute top-2 right-2 text-slate-400 hover:text-white p-1"
                        title="نسخ الأوامر"
                      >
                        {copiedIndex === 'git-all' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </li>

                  <li className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="text-slate-900">الربط مع Vercel:</strong>
                    <p className="mt-1 text-slate-600 text-xs">
                      ادخل على <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-indigo-600 font-bold underline">Vercel.com</a> وسجل دخولك بحساب GitHub.
                      اضغط <strong>"Add New Project"</strong> ثم اختر مستودعك، واضغط <strong>"Deploy"</strong> مباشرة!
                    </p>
                  </li>
                </ol>

                <div className="p-3 bg-slate-100 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-800 text-xs block mb-1">
                    أو النشر عبر سطر الأوامر (CLI):
                  </span>
                  <div className="flex items-center justify-between bg-slate-900 text-indigo-300 p-2.5 rounded-lg font-mono text-xs" dir="ltr">
                    <span>npx vercel</span>
                    <button
                      onClick={() => copyToClipboard('npx vercel', 'vercel-cli')}
                      className="text-slate-400 hover:text-white p-1"
                    >
                      {copiedIndex === 'vercel-cli' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GITHUB PAGES */}
          {activeTab === 'github' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-xl text-purple-700 shrink-0 font-bold">
                  GitHub Pages
                </div>
                <div className="text-xs text-purple-900 leading-relaxed">
                  <p className="font-bold text-sm text-purple-800 mb-1">
                    استضافة مجانية مباشرة من موقع GitHub
                  </p>
                  مناسبة جداً إذا كنت تستخدم GitHub لتخزين مشاريعك وتريد رابطاً مثل: <span className="font-mono bg-white px-1 py-0.5 rounded border border-purple-200">username.github.io/app</span>.
                </div>
              </div>

              <div className="space-y-3">
                <ol className="list-decimal list-inside space-y-3 pr-2 text-slate-700 text-xs sm:text-sm leading-relaxed">
                  <li className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="text-slate-900">تثبيت حزمة gh-pages:</strong>
                    <div className="mt-2 flex items-center justify-between bg-slate-900 text-purple-300 p-2.5 rounded-lg font-mono text-xs" dir="ltr">
                      <span>npm install -D gh-pages</span>
                      <button
                        onClick={() => copyToClipboard('npm install -D gh-pages', 'gh-inst')}
                        className="text-slate-400 hover:text-white p-1"
                      >
                        {copiedIndex === 'gh-inst' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </li>

                  <li className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="text-slate-900">النشر المباشر:</strong>
                    <div className="mt-2 flex items-center justify-between bg-slate-900 text-purple-300 p-2.5 rounded-lg font-mono text-xs" dir="ltr">
                      <span>npx gh-pages -d dist</span>
                      <button
                        onClick={() => copyToClipboard('npx gh-pages -d dist', 'gh-deploy')}
                        className="text-slate-400 hover:text-white p-1"
                      >
                        {copiedIndex === 'gh-deploy' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 4: CLOUDFLARE PAGES / RENDER */}
          {activeTab === 'cloudflare' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                <div className="p-2 bg-amber-100 rounded-xl text-amber-700 shrink-0 font-bold">
                  خيارات أخرى ممتازة
                </div>
                <div className="text-xs text-amber-900 leading-relaxed">
                  <p className="font-bold text-sm text-amber-800 mb-1">
                    Cloudflare Pages & Render Static Sites
                  </p>
                  توفر شبكة CDN عالمية فائقة السرعة مع نطاق ترددي غير محدود مجاناً 100%.
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs text-slate-700">
                <p className="font-bold text-slate-900 text-sm">
                  إعدادات البناء لأي منصة سحابية (Render أو Cloudflare Pages أو Firebase):
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[11px]">أمر البناء (Build Command):</span>
                    <span className="font-mono font-bold text-indigo-600 text-xs">npm run build</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[11px]">مجلد الإخراج (Publish / Output Directory):</span>
                    <span className="font-mono font-bold text-emerald-600 text-xs">dist</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Practical Tips Box */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <AlertCircle className="w-4 h-4 text-indigo-600" />
              <span>ملاحظات هامة لتجربة الطلاب:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 pr-2">
              <li>
                التطبيق يدعم العمل <strong>Offline كـ PWA</strong>: بمجرد فتح الرابط، يمكن للمستخدم أو الطالب النقر على "تثبيت التطبيق" ليعمل على هاتفه أو حاسوبه بدون إنترنت.
              </li>
              <li>
                خاصية النطق الصوتي تستخدم تقنية <strong>Web Speech API</strong> المدمجة في متصفحات الهواتف والكمبيوتر، ولا تحتاج إلى أي سيرفر أو تكلفة إضافية.
              </li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500">
            ملفات التهيئة جاهزة في المشروع: <span className="font-mono font-bold text-indigo-700">vercel.json</span> و <span className="font-mono font-bold text-emerald-700">_redirects</span>
          </div>
          <button
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs cursor-pointer transition-all"
          >
            إغلاق الدليل
          </button>
        </div>
      </div>
    </div>
  );
};
