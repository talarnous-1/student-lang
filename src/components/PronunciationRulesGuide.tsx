import React from 'react';
import { Volume2, Sparkles, BookOpen, Star, HelpCircle, CheckCircle, Smile } from 'lucide-react';
import { speakFrench, playSound } from '../utils/audio';

interface RuleItem {
  id: string;
  title: string;
  badge: string;
  summary: string;
  teacherStory: string;
  examples: { french: string; arabic: string; highlight: string }[];
  funTip: string;
}

const RULES: RuleItem[] = [
  {
    id: 'silent-letters',
    title: 'سر الحروف النائمة (Les lettres muettes)',
    badge: 'القاعدة #1 الأهم',
    summary: 'معظم الحروف الساكنة في نهاية الكلمات الفرنسية تكون نائمة ولا تنطق أبداً!',
    teacherStory:
      'تخيلي يا بطلة أن الحروف (S, T, D, P, X, Z) في نهاية الكلمات هي حروف نائمة في سريرها. عندما تصلين إلى نهاية الكلمة، دعيها نائمة ولا توقظيها!',
    examples: [
      { french: 'mais', arabic: 'لكن', highlight: 'حرف s صامت تماماً -> ننطقها (مِيهْ)' },
      { french: 'dans', arabic: 'في / بداخل', highlight: 'حرف s صامت -> ننطقها (دَانْ)' },
      { french: 'anonymat', arabic: 'مجهولية', highlight: 'حرف t صامت -> ننطقها (آنونيما)' },
      { french: 'quartier', arabic: 'حي سكني', highlight: 'حرف r صامت -> ننطقها (كارتييه)' },
    ],
    funTip: 'قاعدة الحروف النائمة تجمعها كلمة: (C-A-R-E-F-U-L) هي التي تنطق غالباً، وباقي الحروف في النهاية تنام!',
  },
  {
    id: 'nasal-vowels',
    title: 'الأصوات الأنفية الموسيقية (Les voyelles nasales)',
    badge: 'القاعدة #2 نكهة الفرنسية',
    summary: 'عندما يتصل حرف صوتي بحرف N أو M، يخرج الهواء مع رنين جميل من الأنف!',
    teacherStory:
      'اللغة الفرنسية تشبه الغناء! عندما ترين (AN / EN / IN / ON)، لا تنطقي حرف النون عادياً كالعربية، بل دعي الصوت يتردد داخل أنفكِ كأنكِ تغنين نغمة سرية.',
    examples: [
      { french: 'voisin', arabic: 'جار', highlight: 'in في النهاية صوت أنفي رنان (فوازان)' },
      { french: 'demain', arabic: 'غداً', highlight: 'ain صوت أنفي مبتسم ومفتوح (دمان)' },
      { french: 'rencontrer', arabic: 'يلتقي', highlight: 'ren و con مقطعان أنفيان في كلمة واحدة!' },
      { french: 'augmenter', arabic: 'يزيد', highlight: 'en رنين أنفي فخم (أوغمونتيه)' },
    ],
    funTip: 'جربي وضع إصبعكِ برفق على أنفكِ؛ إذا شعرتِ باهتزاز خفيف، فأنتِ تنطقين الصوت الأنفي بإتقان 100%!',
  },
  {
    id: 'french-u',
    title: 'سر حرف U الفرنسي الساحر (Le son [y])',
    badge: 'القاعدة #3 سر التفوق',
    summary: 'حرف U في الفرنسية يختلف تماماً عن OU! إنه يحتاج حركة شفتين خاصة.',
    teacherStory:
      'كيف ننطق حرف U الفرنسي بدقة؟ انطقي حرف (إي) بالعربية، وأثناء نطقكِ له، زمّي شفتيكِ إلى الأمام وكأنكِ تستعدين للتصفير! سيخرج صوت U الفرنسي النقي فوراً.',
    examples: [
      { french: 'juste', arabic: 'فقط / عادل', highlight: 'زمّي الشفتين مع ج ناعمة -> (جْيُوسْت)' },
      { french: 'une seule fois', arabic: 'مرة واحدة', highlight: 'une تبدأ بصوت U الفرنسي الدقيق' },
      { french: 'solitude', arabic: 'وحدة', highlight: 'المقطع tude بزم الشفتين' },
      { french: 'réduire', arabic: 'يقلل', highlight: 'duire رقيقة وناعمة' },
    ],
    funTip: 'لا تخلطي بين OU (مثل كلمة où = أين) وبين U (مثل une). الفرق كله في استدارة الشفتين!',
  },
  {
    id: 'french-accents',
    title: 'الحركات والأكسنت السحرية (Les accents)',
    badge: 'القاعدة #4 إتقان الكتابة',
    summary: 'الحركات ليست مجرد زينة، بل تغير نطق ومعنى الكلمة تماماً!',
    teacherStory:
      'الحركات الفرنسية تشبه التشكيل في لغتنا العربية الجميلة، وتساعدك على معرفة كيف تفتحين فمك أو تمدين الحرف.',
    examples: [
      { french: 'collée', arabic: 'ملصوقة', highlight: 'é نبرة حادة (Aigu): ابتسامة عريضة مفتوحة للأعلى' },
      { french: 'fête', arabic: 'حفلة', highlight: 'ê قبعة (Circonflexe): مدة لطيفة مثل كلمة بَيْت' },
      { french: 'là', arabic: 'هناك', highlight: 'à نبرة هابطة (Grave): تفرق بين هناك (là) وبين (la)' },
      { french: 'réduire', arabic: 'يقلل', highlight: 'é واضحة ومميزة في بداية الفعل' },
    ],
    funTip: 'عندما ترين النبرة الحادة (é)، تذكري أنها تشبه الابتسامة المشرقة!',
  },
  {
    id: 'verb-endings',
    title: 'نهايات أفعال المجموعة الأولى (-ER)',
    badge: 'القاعدة #5 أفعال الدرس',
    summary: 'أي فعل ينتهي بالحرفين -er، ينطق دائماً مثل حرف (é) ولا ننطق الـ R أبداً!',
    teacherStory:
      'معظم أفعال اللغة الفرنسية تنتهي بـ -er. القاعدة الذهبية تقول: لا تنطقي الراء في آخر الفعل أبداً! بل انطقيها وكأنها كاف كاف مكسورة أو ياء فرنسية (إيه).',
    examples: [
      { french: 'rencontrer', arabic: 'يلتقي', highlight: 'تنطق: رانكونترِيهْ (بلا حرف R في النهاية!)' },
      { french: 'augmenter', arabic: 'يزيد', highlight: 'تنطق: أوغمانتِيهْ' },
      { french: 'diminuer', arabic: 'يقلل / يُخفف', highlight: 'تنطق: ديمينْوِيهْ' },
    ],
    funTip: 'أي فعل ترين في آخره er، تذكري أن الـ r أخذت إجازة صامتة!',
  },
];

export const PronunciationRulesGuide: React.FC = () => {
  const handlePlayWord = (french: string) => {
    playSound('pop');
    speakFrench(french, 'normal');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 rounded-3xl p-6 md:p-8 text-white shadow-xl space-y-2">
        <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
          <BookOpen className="w-4 h-4 text-amber-300" />
          <span>الدليل الشامل للفظ الفرنسي للأميرات الصغيرات</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black">
          أسرار وقواعد النطق الذهبية مع أستاذ الفرنسية 🎓
        </h2>
        <p className="text-emerald-100 text-sm max-w-2xl leading-relaxed">
          هنا جمعنا لكِ القواعد الخمس الذهبية التي ستجعلكِ تنطقين كل كلمات الدرس وكأنكِ تعيشين في باريس! انقري على أي كلمة لسماع نطقها فوراً.
        </p>
      </div>

      {/* Rules Accordion / Cards List */}
      <div className="space-y-6">
        {RULES.map((rule, idx) => (
          <div
            key={rule.id}
            className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200/80 shadow-md hover:border-indigo-200 transition-all space-y-5"
          >
            {/* Title & Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-black text-lg">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">
                    {rule.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {rule.summary}
                  </p>
                </div>
              </div>

              <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full">
                {rule.badge}
              </span>
            </div>

            {/* Teacher's Friendly Story */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3">
              <Smile className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-950 leading-relaxed">
                {rule.teacherStory}
              </p>
            </div>

            {/* Interactive Audio Examples */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 block">
                أمثلة تطبيقية مباشرة من ورقة الدرس (انقري للاستماع):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {rule.examples.map((ex, i) => (
                  <div
                    key={i}
                    onClick={() => handlePlayWord(ex.french)}
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-french font-bold text-lg text-indigo-900 group-hover:text-indigo-600">
                          {ex.french}
                        </span>
                        <span className="text-xs font-medium text-slate-500">
                          ({ex.arabic})
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        {ex.highlight}
                      </p>
                    </div>

                    <div className="p-2 rounded-xl bg-white border border-slate-200 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <Volume2 className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fun Tip Pill */}
            <div className="bg-indigo-50/60 rounded-xl p-3 flex items-center gap-2 text-xs text-indigo-900 font-semibold">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>{rule.funTip}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
