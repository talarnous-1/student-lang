import React, { useState } from 'react';
import { Volume2, Sparkles, BookOpen, Smile } from 'lucide-react';
import { AppLanguage, TrainingLanguage } from '../types';
import { UI_TEXT } from '../translations';
import { speakFrench, speakEnglish, playSound } from '../utils/audio';

interface RuleItem {
  id: string;
  titleAr: string;
  titleEn: string;
  badgeAr: string;
  badgeEn: string;
  summaryAr: string;
  summaryEn: string;
  teacherStoryAr: string;
  teacherStoryEn: string;
  examples: {
    word: string;
    translationAr: string;
    translationEn: string;
    highlightAr: string;
    highlightEn: string;
  }[];
  funTipAr: string;
  funTipEn: string;
}

const FRENCH_RULES: RuleItem[] = [
  {
    id: 'silent-letters',
    titleAr: 'سر الحروف النائمة (Les lettres muettes)',
    titleEn: 'The Secret of Silent Letters (Les lettres muettes)',
    badgeAr: 'القاعدة #1 الأهم',
    badgeEn: 'Rule #1 Most Important',
    summaryAr: 'معظم الحروف الساكنة في نهاية الكلمات الفرنسية تكون نائمة ولا تنطق أبداً!',
    summaryEn: 'Most final consonants in French words are silent and never pronounced!',
    teacherStoryAr:
      'تخيلي يا بطلة أن الحروف (S, T, D, P, X, Z) في نهاية الكلمات هي حروف نائمة في سريرها. عندما تصلين إلى نهاية الكلمة، دعيها نائمة ولا توقظيها!',
    teacherStoryEn:
      'Imagine that letters (S, T, D, P, X, Z) at the ends of words are fast asleep in bed. When you reach the end of the word, let them rest and do not pronounce them!',
    examples: [
      { word: 'mais', translationAr: 'لكن', translationEn: 'but', highlightAr: 'حرف s صامت تماماً -> ننطقها (مِيهْ)', highlightEn: 'Final "s" is silent -> sounds like "meh"' },
      { word: 'dans', translationAr: 'في / بداخل', translationEn: 'in', highlightAr: 'حرف s صامت -> ننطقها (دَانْ)', highlightEn: 'Final "s" is silent -> sounds like "dahn"' },
      { word: 'anonymat', translationAr: 'مجهولية', translationEn: 'anonymity', highlightAr: 'حرف t صامت -> ننطقها (آنونيما)', highlightEn: 'Final "t" is silent -> "ah-noh-nee-mah"' },
      { word: 'quartier', translationAr: 'حي سكني', translationEn: 'neighborhood', highlightAr: 'حرف r صامت -> ننطقها (كارتييه)', highlightEn: 'Final "r" in -er/-ier is silent' },
    ],
    funTipAr: 'قاعدة الحروف النائمة تجمعها كلمة: (C-A-R-E-F-U-L) هي التي تنطق غالباً، وباقي الحروف في النهاية تنام!',
    funTipEn: 'Mnemonic: Consonants in C-A-R-E-F-U-L (C, R, F, L) are usually sounded; others at the end stay quiet!',
  },
  {
    id: 'nasal-vowels',
    titleAr: 'الأصوات الأنفية الموسيقية (Les voyelles nasales)',
    titleEn: 'Musical Nasal Vowels (Les voyelles nasales)',
    badgeAr: 'القاعدة #2 نكهة الفرنسية',
    badgeEn: 'Rule #2 French Essence',
    summaryAr: 'عندما يتصل حرف صوتي بحرف N أو M، يخرج الهواء مع رنين جميل من الأنف!',
    summaryEn: 'When a vowel is followed by N or M, the sound resonates gently through your nose!',
    teacherStoryAr:
      'اللغة الفرنسية تشبه الغناء! عندما ترين (AN / EN / IN / ON)، لا تنطقي حرف النون عادياً، بل دعي الصوت يتردد داخل أنفكِ كأنكِ تغنين نغمة سرية.',
    teacherStoryEn:
      'French is melodic! When you see (AN / EN / IN / ON), do not pronounce a hard "N"; let the vowel resonate warmly through your nose like a secret chord.',
    examples: [
      { word: 'voisin', translationAr: 'جار', translationEn: 'neighbor', highlightAr: 'in في النهاية صوت أنفي رنان (فوازان)', highlightEn: '"-in" at the end is a ringing nasal sound' },
      { word: 'demain', translationAr: 'غداً', translationEn: 'tomorrow', highlightAr: 'ain صوت أنفي مبتسم ومفتوح (دمان)', highlightEn: '"-ain" is a smiling, open nasal sound' },
      { word: 'rencontrer', translationAr: 'يلتقي', translationEn: 'to meet', highlightAr: 'ren و con مقطعان أنفيان في كلمة واحدة!', highlightEn: '"ren" and "con" are both nasal in one word!' },
      { word: 'augmenter', translationAr: 'يزيد', translationEn: 'to increase', highlightAr: 'en رنين أنفي فخم (أوغمونتيه)', highlightEn: '"en" creates a rich, rounded nasal tone' },
    ],
    funTipAr: 'جربي وضع إصبعكِ برفق على أنفكِ؛ إذا شعرتِ باهتزاز خفيف، فأنتِ تنطقين الصوت الأنفي بإتقان 100%!',
    funTipEn: 'Gently place your finger on the bridge of your nose; if you feel a gentle vibration, your nasal vowel is 100% authentic!',
  },
  {
    id: 'french-u',
    titleAr: 'سر حرف U الفرنسي الساحر (Le son [y])',
    titleEn: 'The Magic of French "U" (Le son [y])',
    badgeAr: 'القاعدة #3 سر التفوق',
    badgeEn: 'Rule #3 Pro Sound',
    summaryAr: 'حرف U في الفرنسية يختلف تماماً عن OU! إنه يحتاج حركة شفتين خاصة.',
    summaryEn: 'French "u" is completely different from "ou"! It requires tight, rounded lips.',
    teacherStoryAr:
      'كيف ننطق حرف U الفرنسي بدقة؟ انطقي حرف (إي) بالعربية أو (ee)، وأثناء نطقكِ له، زمّي شفتيكِ إلى الأمام وكأنكِ تستعدين للتصفير! سيخرج صوت U الفرنسي النقي فوراً.',
    teacherStoryEn:
      'How to make the French "u" sound? Say English "ee", and while holding that tongue position, round your lips forward as if preparing to whistle! Perfect French "u" pops right out.',
    examples: [
      { word: 'juste', translationAr: 'فقط / عادل', translationEn: 'just/only', highlightAr: 'زمّي الشفتين مع ج ناعمة -> (جْيُوسْت)', highlightEn: 'Soft "j" with whistle-shaped lips -> "zhoost"' },
      { word: 'une seule fois', translationAr: 'مرة واحدة', translationEn: 'only once', highlightAr: 'une تبدأ بصوت U الفرنسي الدقيق', highlightEn: '"une" begins with the pure French "u"' },
      { word: 'solitude', translationAr: 'وحدة', translationEn: 'solitude', highlightAr: 'المقطع tude بزم الشفتين', highlightEn: '"-tude" uses rounded lips for the "u"' },
      { word: 'réduire', translationAr: 'يقلل', translationEn: 'to reduce', highlightAr: 'duire رقيقة وناعمة', highlightEn: '"-duire" is smooth and compact' },
    ],
    funTipAr: 'لا تخلطي بين OU (مثل كلمة où = أين) وبين U (مثل une). الفرق كله في استدارة الشفتين!',
    funTipEn: 'Do not confuse "ou" (like in "soup") with "u" (like in "une"). The secret is all in forward lip rounding!',
  },
  {
    id: 'french-accents',
    titleAr: 'الحركات والأكسنت السحرية (Les accents)',
    titleEn: 'French Accents & Marks (Les accents)',
    badgeAr: 'القاعدة #4 إتقان الكتابة',
    badgeEn: 'Rule #4 Perfect Spelling',
    summaryAr: 'الحركات ليست مجرد زينة، بل تغير نطق ومعنى الكلمة تماماً!',
    summaryEn: 'Accents are not decorations—they change how words sound and what they mean!',
    teacherStoryAr:
      'الحركات الفرنسية تشبه التشكيل في لغتنا العربية الجميلة، وتساعدك على معرفة كيف تفتحين فمك أو تمدين الحرف.',
    teacherStoryEn:
      'French accents tell you whether to smile brightly (é), open your mouth relaxed (è), or elongate gently (ê).',
    examples: [
      { word: 'collée', translationAr: 'ملصوقة', translationEn: 'glued', highlightAr: 'é نبرة حادة (Aigu): ابتسامة عريضة مفتوحة للأعلى', highlightEn: '"é" (acute): smiling bright "ay" sound' },
      { word: 'fête', translationAr: 'حفلة', translationEn: 'party/celebration', highlightAr: 'ê قبعة (Circonflexe): مدة لطيفة مثل كلمة بَيْت', highlightEn: '"ê" (circumflex): slightly prolonged open "e"' },
      { word: 'là', translationAr: 'هناك', translationEn: 'there', highlightAr: 'à نبرة هابطة (Grave): تفرق بين هناك (là) وبين (la)', highlightEn: '"à" (grave): distinguishes "there" from article "la"' },
      { word: 'réduire', translationAr: 'يقلل', translationEn: 'to reduce', highlightAr: 'é واضحة ومميزة في بداية الفعل', highlightEn: 'Clear acute accent at the beginning' },
    ],
    funTipAr: 'عندما ترين النبرة الحادة (é)، تذكري أنها تشبه الابتسامة المشرقة!',
    funTipEn: 'Whenever you see acute accent "é", think of a wide cheerful smile!',
  },
  {
    id: 'verb-endings',
    titleAr: 'نهايات أفعال المجموعة الأولى (-ER)',
    titleEn: 'First-Group Verb Endings (-ER)',
    badgeAr: 'القاعدة #5 أفعال الدرس',
    badgeEn: 'Rule #5 Verb Endings',
    summaryAr: 'أي فعل ينتهي بالحرفين -er، ينطق دائماً مثل حرف (é) ولا ننطق الـ R أبداً!',
    summaryEn: 'Any infinitive verb ending in -er is pronounced like "é" [ay]; never pronounce the "r"!',
    teacherStoryAr:
      'معظم أفعال اللغة الفرنسية تنتهي بـ -er. القاعدة الذهبية تقول: لا تنطقي الراء في آخر الفعل أبداً! بل انطقيها وكأنها ياء فرنسية (إيه).',
    teacherStoryEn:
      'Most French verbs end in -er. The golden rule: the final "r" takes a holiday! Pronounce it just like "ay".',
    examples: [
      { word: 'rencontrer', translationAr: 'يلتقي', translationEn: 'to meet', highlightAr: 'تنطق: رانكونترِيهْ (بلا حرف R في النهاية!)', highlightEn: 'Pronounced: "rahn-kohn-tray" without final "r"!' },
      { word: 'augmenter', translationAr: 'يزيد', translationEn: 'to increase', highlightAr: 'تنطق: أوغمانتِيهْ', highlightEn: 'Pronounced: "ohg-mahn-tay"' },
      { word: 'diminuer', translationAr: 'يقلل / يُخفف', translationEn: 'to diminish', highlightAr: 'تنطق: ديمينْوِيهْ', highlightEn: 'Pronounced: "dee-mee-nway"' },
    ],
    funTipAr: 'أي فعل ترين في آخره er، تذكري أن الـ r أخذت إجازة صامتة!',
    funTipEn: 'Every time you spot -er at the end of an infinitive, remember the "r" is on silent vacation!',
  },
];

const ENGLISH_RULES: RuleItem[] = [
  {
    id: 'en-silent-letters',
    titleAr: 'سر الحروف الصامتة في الإنجليزية (Silent Letters)',
    titleEn: 'Silent Letters in English (K, W, GH, B)',
    badgeAr: 'القاعدة #1 الشائعة',
    badgeEn: 'Rule #1 Essential',
    summaryAr: 'الكثير من الكلمات الإنجليزية تحتوي حروفاً تُكتب ولا تُنطق أبداً!',
    summaryEn: 'Many English words contain silent letters that are written but never spoken!',
    teacherStoryAr:
      'حرف K قبل N صامت تماماً (مثل know و knee)! وحرف W قبل R صامت (مثل write و wrong)! والحرفان GH في وسط الكلمات صامتان مثل كلمة neighbor من درسنا!',
    teacherStoryEn:
      'K before N is silent (know, knee). W before R is silent (write, wrong). And GH is completely silent in words like "neighbor" and "night"!',
    examples: [
      { word: 'neighbor', translationAr: 'جار', translationEn: 'neighbor', highlightAr: 'حرفا gh صامتان تماماً -> نيبور', highlightEn: '"gh" is 100% silent -> "nay-ber"' },
      { word: 'knee', translationAr: 'ركبة', translationEn: 'knee', highlightAr: 'حرف k صامت -> نِي', highlightEn: '"k" is silent -> sounds like "nee"' },
      { word: 'write', translationAr: 'يكتب', translationEn: 'to write', highlightAr: 'حرف w صامت -> رَايْت', highlightEn: '"w" is silent -> sounds like "rite"' },
      { word: 'doubt', translationAr: 'شك', translationEn: 'doubt', highlightAr: 'حرف b صامت -> دَاوْت', highlightEn: '"b" is silent -> sounds like "dowt"' },
    ],
    funTipAr: 'إذا رأيتِ kn في بداية الكلمة، تذكري أن حرف الـ k خجول ولا يتكلم أبداً!',
    funTipEn: 'When you see "kn" at the start, remember the "k" is shy and keeps completely quiet!',
  },
  {
    id: 'en-magic-e',
    titleAr: 'قاعدة حرف E السحري (The Magic E)',
    titleEn: 'The Magic E Rule (Silent E)',
    badgeAr: 'القاعدة #2 سحر الأصوات',
    badgeEn: 'Rule #2 Magic E',
    summaryAr: 'حرف E في نهاية الكلمة صامت، لكنه يمنح الحرف الصوتي قبله قوة ليقول اسمه!',
    summaryEn: 'The silent ending E gives power to the vowel before it to say its long name!',
    teacherStoryAr:
      'حرف E في نهاية الكلمات الإنجليزية هو ساحر صغير! لا ينطق بنفسه، لكنه يقفز ويجعل الحرف الصوتي ينطق صوته الطويل: مثل كلمة inside في درسنا (i أصبحت آي)!',
    teacherStoryEn:
      'Silent E works like magic: "hop" becomes "hope", "bit" becomes "bite", and in our word "inside", the "i" says "eye"!',
    examples: [
      { word: 'inside', translationAr: 'في الداخل', translationEn: 'inside', highlightAr: 'حرف e صامت يجعل i ممدودة (إنسايد)', highlightEn: 'Silent "e" makes "i" say its name' },
      { word: 'hope', translationAr: 'أمل', translationEn: 'hope', highlightAr: 'e صامتة تجعل o ممدودة (هُوبْ)', highlightEn: 'Silent "e" creates long "oh"' },
      { word: 'cake', translationAr: 'كعكة', translationEn: 'cake', highlightAr: 'e صامتة تجعل a تنطق إيه (كِيكْ)', highlightEn: 'Silent "e" makes "ay" sound' },
      { word: 'cute', translationAr: 'لطيف', translationEn: 'cute', highlightAr: 'e تجعل u تنطق يوو (كْيُوتْ)', highlightEn: 'Silent "e" makes "yoo" sound' },
    ],
    funTipAr: 'تذكري: Magic E لا يتكلم، لكنه يجعل الحرف الصوتي الذي قبله يبتسم ويقول اسمه!',
    funTipEn: 'Magic E never speaks, but it makes the previous vowel say its full name!',
  },
  {
    id: 'en-th-sounds',
    titleAr: 'صوتا حرفي TH (The & Think)',
    titleEn: 'Voiced & Unvoiced TH Sounds',
    badgeAr: 'القاعدة #3 دقة المخارج',
    badgeEn: 'Rule #3 Tongue Position',
    summaryAr: 'المقطع TH له صوتان: مثل حرف (ذ) أو مثل حرف (ث) بالعربية!',
    summaryEn: 'TH has two sounds: voiced like "there/the" (ذ) and unvoiced like "think" (ث)!',
    teacherStoryAr:
      'أخرجي طرف لسانكِ برفق بين أسنانكِ! في كلمة there من درسنا، الصوت جهري مثل حرف الذال (ذِيرْ). وفي كلمات مثل think الصوت مهموس مثل حرف الثاء (ثِنْكْ).',
    teacherStoryEn:
      'Place your tongue gently between your front teeth. In "there", it vibrates (voiced). In "think", just soft air comes through (unvoiced).',
    examples: [
      { word: 'there', translationAr: 'هناك', translationEn: 'there', highlightAr: 'صوت ذال جهري -> ذِيرْ', highlightEn: 'Voiced "th" sound' },
      { word: 'brother', translationAr: 'أخ', translationEn: 'brother', highlightAr: 'صوت ذال ناعم -> بْرَاذَرْ', highlightEn: 'Voiced "th" sound' },
      { word: 'think', translationAr: 'يفكر', translationEn: 'think', highlightAr: 'صوت ثاء مهموس -> ثِنْكْ', highlightEn: 'Unvoiced "th" sound' },
      { word: 'birthday', translationAr: 'عيد ميلاد', translationEn: 'birthday', highlightAr: 'صوت ثاء لطيف -> بَيْرثْدِي', highlightEn: 'Unvoiced "th" sound' },
    ],
    funTipAr: 'ضعي يدكِ على حنجرتكِ؛ إذا اهتزت فـ TH هي صوت (ذ) مثل there، وإذا لم تهتز فهي (ث) مثل think!',
    funTipEn: 'Touch your throat: if it buzzes, it is voiced TH (there); if only air flows, it is unvoiced (think)!',
  },
  {
    id: 'en-vowel-teams',
    titleAr: 'أزواج حروف المد (Vowel Teams: EA, EE)',
    titleEn: 'Vowel Teams (EA & EE for Long E)',
    badgeAr: 'القاعدة #4 أصوات ممتدة',
    badgeEn: 'Rule #4 Vowel Teams',
    summaryAr: 'عندما يجتمع حرفان صوتيان مثل EA أو EE، ينطقان صوتاً واحداً ممدوداً!',
    summaryEn: 'When two vowels go walking, the first one does the talking! (Long "ee" sound).',
    teacherStoryAr:
      'في الإنجليزية مثل شهير: "When two vowels go walking, the first one does the talking!". المقطع ea في dear و increase، والمقطع ee في meet ينطقان ياء ممدودة صافية وسعيدة!',
    teacherStoryEn:
      'Double "ee" and "ea" frequently make a long smiling "ee" sound, as in "meet", "dear", and "increase"!',
    examples: [
      { word: 'dear', translationAr: 'عزيزي', translationEn: 'dear', highlightAr: 'المقطع ea ينطق ياء ممدودة (دِيرْ)', highlightEn: 'Long "ee" sound: "d-ee-r"' },
      { word: 'meet', translationAr: 'يلتقي', translationEn: 'to meet', highlightAr: 'الحرفان ee ينطقان ياء ممدودة (مِيتْ)', highlightEn: 'Long "ee" sound: "m-ee-t"' },
      { word: 'increase', translationAr: 'يزيد', translationEn: 'to increase', highlightAr: 'المقطع ea ينطق ياء ممدودة (إنكريس)', highlightEn: 'Long "ee" sound in second syllable' },
      { word: 'clean', translationAr: 'نظيف', translationEn: 'clean', highlightAr: 'المقطع ea ينطق ياء نقية (كْلِينْ)', highlightEn: 'Pure long "ee" sound' },
    ],
    funTipAr: 'تخيلي أنكِ تبتسمين للكاميرا عند نطق EA أو EE: (Smile and say eee)!',
    funTipEn: 'Smile brightly like you are posing for a photo whenever you say EE or EA!',
  },
];

interface PronunciationRulesGuideProps {
  appLang?: AppLanguage;
  trainingLang?: TrainingLanguage;
}

export const PronunciationRulesGuide: React.FC<PronunciationRulesGuideProps> = ({
  appLang = 'ar',
  trainingLang = 'fr',
}) => {
  const t = appLang === 'en' ? UI_TEXT.en : UI_TEXT.ar;
  const [selectedRulesTrack, setSelectedRulesTrack] = useState<TrainingLanguage>(trainingLang);

  const activeRules = selectedRulesTrack === 'en' ? ENGLISH_RULES : FRENCH_RULES;

  const handlePlayWord = (word: string) => {
    playSound('pop');
    if (selectedRulesTrack === 'en') {
      speakEnglish(word, 'normal');
    } else {
      speakFrench(word, 'normal');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hero Header */}
      <div className={`rounded-3xl p-6 md:p-8 text-white shadow-xl space-y-3 transition-colors ${
        selectedRulesTrack === 'en'
          ? 'bg-gradient-to-r from-blue-700 via-indigo-700 to-teal-700'
          : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
            <BookOpen className="w-4 h-4 text-amber-300" />
            <span>{selectedRulesTrack === 'en' ? 'قواعد النطق الإنجليزي الذهبية 🇬🇧' : 'قواعد النطق الفرنسي الذهبية 🇫🇷'}</span>
          </div>

          {/* Toggle between French Rules & English Rules */}
          <div className="flex items-center bg-black/20 p-1 rounded-2xl border border-white/20 text-xs font-bold">
            <button
              onClick={() => setSelectedRulesTrack('fr')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                selectedRulesTrack === 'fr' ? 'bg-white text-indigo-950 shadow-sm' : 'text-white/80 hover:text-white'
              }`}
            >
              <span>🇫🇷</span>
              <span>قواعد الفرنسية</span>
            </button>
            <button
              onClick={() => setSelectedRulesTrack('en')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                selectedRulesTrack === 'en' ? 'bg-white text-blue-950 shadow-sm' : 'text-white/80 hover:text-white'
              }`}
            >
              <span>🇬🇧</span>
              <span>قواعد الإنجليزية</span>
            </button>
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-black">
          {selectedRulesTrack === 'en'
            ? 'أسرار وقواعد النطق الإنجليزي مع أستاذ اللغات 🎓'
            : t.rulesTitle}
        </h2>
        <p className="text-white/90 text-sm max-w-2xl leading-relaxed">
          {selectedRulesTrack === 'en'
            ? 'تعلمي أسرار الحروف الصامتة، الـ Magic E، أصوات الـ TH، وحروف المد الإنجليزية بكل سهولة ومرح! انقري على أي كلمة لسماع نطقها فوراً.'
            : t.rulesDesc}
        </p>
      </div>

      {/* Rules Accordion / Cards List */}
      <div className="space-y-6">
        {activeRules.map((rule, idx) => (
          <div
            key={rule.id}
            className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200/80 shadow-md hover:border-indigo-200 transition-all space-y-5"
          >
            {/* Title & Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-lg ${
                  selectedRulesTrack === 'en'
                    ? 'bg-blue-50 border border-blue-200 text-blue-700'
                    : 'bg-indigo-50 border border-indigo-200 text-indigo-700'
                }`}>
                  {idx + 1}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">
                    {appLang === 'en' ? rule.titleEn : rule.titleAr}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {appLang === 'en' ? rule.summaryEn : rule.summaryAr}
                  </p>
                </div>
              </div>

              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                selectedRulesTrack === 'en'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-indigo-100 text-indigo-800'
              }`}>
                {appLang === 'en' ? rule.badgeEn : rule.badgeAr}
              </span>
            </div>

            {/* Teacher's Friendly Story */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3">
              <Smile className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-950 leading-relaxed">
                {appLang === 'en' ? rule.teacherStoryEn : rule.teacherStoryAr}
              </p>
            </div>

            {/* Interactive Audio Examples */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 block">
                {selectedRulesTrack === 'en'
                  ? 'أمثلة توضيحية لنطق الكلمات الإنجليزية (انقري للاستماع):'
                  : 'أمثلة تطبيقية مباشرة من ورقة الدرس (انقري للاستماع):'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {rule.examples.map((ex, i) => (
                  <div
                    key={i}
                    onClick={() => handlePlayWord(ex.word)}
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-french font-bold text-lg text-indigo-900 group-hover:text-indigo-600" dir="ltr">
                          {ex.word}
                        </span>
                        <span className="text-xs font-medium text-slate-500">
                          ({appLang === 'en' ? ex.translationEn : ex.translationAr})
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        {appLang === 'en' ? ex.highlightEn : ex.highlightAr}
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
              <span>{appLang === 'en' ? rule.funTipEn : rule.funTipAr}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
