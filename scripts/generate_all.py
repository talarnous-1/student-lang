# -*- coding: utf-8 -*-
"""
Constructs 500 primary school elementary words with full metadata:
French, English, Arabic translation, Arabic phonetic transcription for French,
English phonetic respelling, Arabic transcription for English, IPA for French and English,
syllables, grammar categories, examples, and pronunciation tips.
"""
import json
import re

SECTIONS = []

def sec(title):
    pass

WORDS = []

def W(fr, ar, en, fr_ph, en_ph, en_ar_ph, fr_ipa, en_ipa, fr_syl, en_syl, cat, cat_ar, cat_en, fr_tip, en_tip, ex_fr, ex_ar, ex_en, note=""):
    WORDS.append({
        "id": f"primary-{len(WORDS) + 1}",
        "orderNumber": len(WORDS) + 21,
        "french": fr,
        "arabicMeaning": ar,
        "englishMeaning": en,
        "arabicPhonetic": fr_ph,
        "englishPhonetic": en_ph,
        "englishArabicPhonetic": en_ar_ph,
        "ipa": fr_ipa,
        "ipaEnglish": en_ipa,
        "syllables": fr_syl,
        "englishSyllables": en_syl,
        "category": cat,
        "categoryLabelAr": cat_ar,
        "categoryLabelEn": cat_en,
        "pronunciationTip": fr_tip,
        "pronunciationTipEn": f"In French, '{fr}' is pronounced cleanly with native rhythm.",
        "englishPronunciationTipAr": en_tip,
        "englishPronunciationTipEn": f"In English, '{en}' is pronounced with clear syllables.",
        "exampleFrench": ex_fr,
        "exampleArabic": ex_ar,
        "exampleEnglish": ex_en,
        "synonymsOrNotes": note or f"كلمة للمرحلة الابتدائية ({ar}).",
        "synonymsOrNotesEn": f"Essential primary vocabulary: {en}.",
        "isMastered": False,
        "practiceScore": 0,
        "isPrimarySchool": True,
        "gradeLevel": "ابتدائي (Primary)"
    })

# --- 1. المدرسة والصف (School & Learning) : 40 words ---
W("livre", "كتاب", "Book", "لِيفْرْ", "leevr", "بُوكْ", "[livʁ]", "[bʊk]", ["li", "vre"], ["book"], "noun", "اسم مذكر (Nom)", "Noun", "حرف i ينطق بكسرة نقية صريحة (لي).", "حرفا oo صوت ضمة قصيرة سريعة مثل صوت الواو الخفيف.", "J'ouvre mon livre.", "أفتح كتابي.", "I open my book.", "جمعها: des livres")
W("crayon", "قلم رصاص", "Pencil", "كْرَايُونْ", "kray-on", "بِنْسِلْ", "[kʁɛ.jɔ̃]", "[ˈpɛn.səl]", ["cray", "on"], ["pen", "cil"], "noun", "اسم مذكر (Nom)", "Noun", "المقطع on صوت أنفي رنان.", "حرف c ينطق سين لوجود i بعده.", "Je dessine avec mon crayon.", "أرسم بقلم الرصاص.", "I draw with my pencil.")
W("cahier", "دفتر", "Notebook", "كَايِي", "ka-yay", "نُوتْ بُوكْ", "[ka.je]", "[ˈnoʊt.bʊk]", ["ca", "hier"], ["note", "book"], "noun", "اسم مذكر (Nom)", "Noun", "حرف h صامت وer تنطق كحرف الياء إيه.", "كلمة مركبة من note وbook.", "J'écris dans mon cahier.", "أكتب في دفتري.", "I write in my notebook.")
W("gomme", "ممحاة", "Eraser", "غُومْ", "gum", "إِرِيسَرْ", "[ɡɔm]", "[ɪˈɹeɪ.sɚ]", ["gom", "me"], ["e", "ra", "ser"], "noun", "اسم مؤنث (Nom)", "Noun", "حرف o مفتوح وحرف e صامت.", "نبرة الصوت في المقطع الثاني e-RA-ser.", "J'efface avec ma gomme.", "أمسح بممحاتي.", "I erase with my eraser.")
W("règle", "مسطرة", "Ruler", "رِيغْلْ", "regl", "رُولَرْ", "[ʁɛɡl]", "[ˈɹuː.lɚ]", ["rè", "gle"], ["ru", "ler"], "noun", "اسم مؤنث (Nom)", "Noun", "النبرة المفتوحة è تعطي صوتاً عريضاً.", "حرف u ينطق واواً طويلة.", "Je mesure avec ma règle.", "أقيس بمسطرتي.", "I measure with my ruler.")
W("cartable", "محفظة مدرسية", "Backpack", "كَارْتَابْلْ", "kar-tabl", "بَاكْ بَاكْ", "[kaʁ.tabl]", "[ˈbæk.pæk]", ["car", "ta", "ble"], ["back", "pack"], "noun", "اسم مذكر (Nom)", "Noun", "حرف a بفتحة واضحة مفخمة.", "صوت a القصير في كلا المقطعين.", "Mon cartable est bleu.", "محفظتي زرقاء.", "My backpack is blue.")
W("école", "مدرسة", "School", "إِيكُولْ", "ay-kol", "سْكُولْ", "[e.kɔl]", "[skuːl]", ["é", "co", "le"], ["school"], "noun", "اسم مؤنث (Nom)", "Noun", "النبرة الحادة é تنطق إي مغلقة.", "حرفا ch ينطقان كافاً (سْكُولْ).", "J'aime mon école.", "أحب مدرستي.", "I love my school.")
W("stylo", "قلم حبر", "Pen", "سْتِيلُو", "stee-lo", "بِنْ", "[sti.lo]", "[pɛn]", ["sty", "lo"], ["pen"], "noun", "اسم مذكر (Nom)", "Noun", "حرف y ينطق كصوت الياء i.", "صوت e قصير وواضح.", "J'ai un stylo rouge.", "لدي قلم حبر أحمر.", "I have a red pen.")
W("trousse", "مقلمة", "Pencil case", "تْرُوسْ", "trooss", "بِنْسِلْ كِيسْ", "[tʁus]", "[ˈpɛn.səl keɪs]", ["trous", "se"], ["pen", "cil", "case"], "noun", "اسم مؤنث (Nom)", "Noun", "حرفا ou ينطقان أو ممدودة.", "كلمتان: pencil وcase.", "Ma trousse est sur la table.", "مقلمتي على الطاولة.", "My pencil case is on the table.")
W("classe", "فصل / صف", "Classroom", "كْلاَسْ", "klass", "كْلاَسْ رُومْ", "[klɑs]", "[ˈklæs.ɹuːm]", ["clas", "se"], ["class", "room"], "noun", "اسم مؤنث (Nom)", "Noun", "حرفا ss يمنعان تحول الصوت إلى زاي.", "غرفة الصف والمذاكرة.", "Notre classe est grande.", "فصلنا كبير.", "Our classroom is big.")
W("tableau", "سبورة", "Board", "تَابْلُو", "tab-lo", "بُورْدْ", "[ta.blo]", "[bɔːɹd]", ["ta", "bleau"], ["board"], "noun", "اسم مذكر (Nom)", "Noun", "المقطع eau ينطق واواً مفخمة.", "صوت أو ممدود في الإنجليزية.", "Regardez le tableau.", "انظروا إلى السبورة.", "Look at the board.")
W("maître", "معلم", "Teacher", "مِيتْرْ", "metr", "تِيتْشَرْ", "[mɛtʁ]", "[ˈtiː.tʃɚ]", ["maî", "tre"], ["tea", "cher"], "noun", "اسم مذكر (Nom)", "Noun", "المدة î تجعل الحرف ممدوداً ومفتوحاً.", "المقطع ch ينطق تش صريحة.", "Le maître entre dans la classe.", "يدخل المعلم إلى الفصل.", "The teacher enters the classroom.")
W("maîtresse", "معلمة", "Teacher", "مِيتْرِيسْ", "meh-tress", "تِيتْشَرْ", "[mɛ.tʁɛs]", "[ˈtiː.tʃɚ]", ["maî", "tres", "se"], ["tea", "cher"], "noun", "اسم مؤنث (Nom)", "Noun", "المقطع esse ينطق إيس بنبرة واضحة.", "المعلمة الفاضلة والمربية.", "La maîtresse est très gentille.", "المعلمة لطيفة جداً.", "The teacher is very kind.")
W("élève", "تلميذ", "Student", "إِيلِيفْ", "ay-lev", "سْتْيُودِنْتْ", "[e.lɛv]", "[ˈstjuː.dənt]", ["é", "lè", "ve"], ["stu", "dent"], "noun", "اسم (Nom)", "Noun", "لاحظ تبادل النبرة بين é وè.", "النبرة على المقطع الأول STU-dent.", "Chaque élève a un cahier.", "كل تلميذ لديه دفتر.", "Each student has a notebook.")
W("bureau", "مكتب", "Desk", "بِيغُو", "bu-ro", "دِسْكْ", "[by.ʁo]", "[dɛsk]", ["bu", "reau"], ["desk"], "noun", "اسم مذكر (Nom)", "Noun", "صوت u الفرنسي مستدير الشفتين.", "مقطع واحد قصير ينتهي بـ sk.", "Mon bureau est bien rangé.", "مكتبي مرتب جيداً.", "My desk is well arranged.")
W("chaise", "كرسي", "Chair", "شِيزْ", "shez", "تْشِيرْ", "[ʃɛz]", "[tʃɛəɹ]", ["chai", "se"], ["chair"], "noun", "اسم مؤنث (Nom)", "Noun", "المقطع ai ينطق إيه المفتوحة.", "حرفا ch ينطقان تش.", "Assieds-toi sur la chaise.", "اجلس على الكرسي.", "Sit on the chair.")
W("ciseaux", "مقص", "Scissors", "سِيزُو", "see-zo", "سِيزَرْزْ", "[si.zo]", "[ˈsɪz.ɚz]", ["ci", "seaux"], ["scis", "sors"], "noun", "اسم جمع (Nom)", "Noun", "حرف x صامت لا ينطق في نهاية الجمع.", "تأتي بصيغة الجمع دائماً.", "Je coupe avec mes ciseaux.", "أقص بمقصي.", "I cut with my scissors.")
W("colle", "صمغ", "Glue", "كُولْ", "kol", "غْلُو", "[kɔl]", "[ɡluː]", ["col", "le"], ["glue"], "noun", "اسم مؤنث (Nom)", "Noun", "حرف o مفتوح وحرف e الأخير صامت.", "ينطق بمد الواو.", "Mets un peu de colle.", "ضع قليلاً من الصمغ.", "Put a little glue.")
W("taille-crayon", "مبراة", "Sharpener", "تَايْ كْرَايُونْ", "tie-kray-on", "شَارْبْنَرْ", "[tɑj.kʁɛ.jɔ̃]", "[ˈʃɑːɹp.nɚ]", ["taille", "cray", "on"], ["sharp", "en", "er"], "noun", "اسم مذكر (Nom)", "Noun", "مقطعان مركبان لصنع الأقلام حادة.", "من كلمة sharp أي حاد.", "Prête-moi ton taille-crayon.", "أعرني مبراة أقلامك.", "Lend me your sharpener.")
W("feuille", "ورقة", "Sheet of paper", "فُويْ", "fuy", "شِيتْ", "[fœj]", "[ʃiːt]", ["feuil", "le"], ["sheet"], "noun", "اسم مؤنث (Nom)", "Noun", "المقطع euille صوت مميز مبهج.", "صوت ee ممدود مثل شيت.", "Prends une feuille blanche.", "خذ ورقة بيضاء.", "Take a white sheet of paper.")
W("craie", "طباشير", "Chalk", "كْرِيه", "kreh", "تْشُوكْ", "[kʁɛ]", "[tʃɔːk]", ["craie"], ["chalk"], "noun", "اسم مؤنث (Nom)", "Noun", "المقطع aie ينطق إيه عريضة.", "حرف l صامت تماماً (تشوك).", "Le maître écrit avec la craie.", "يكتب المعلم بالطباشير.", "The teacher writes with chalk.")
W("horloge", "ساعة حائط", "Clock", "أُورْلُوجْ", "or-lozh", "كْلُوكْ", "[ɔʁ.lɔʒ]", "[klɒk]", ["hor", "lo", "ge"], ["clock"], "noun", "اسم مؤنث (Nom)", "Noun", "حرف h صامت وg ينطق ژ.", "صوت o قصير بين حرفين صامتين.", "L'horloge sonne l'heure.", "الساعة تدق معلنة الوقت.", "The clock chimes the hour.")
W("carte", "خريطة", "Map", "كَارْتْ", "kart", "مَابْ", "[kaʁt]", "[mæp]", ["car", "te"], ["map"], "noun", "اسم مؤنث (Nom)", "Noun", "حرف r فرنسي خفيف من الحلق.", "صوت a مفتوح خفيف.", "Voici la carte du pays.", "هذه خريطة البلاد.", "Here is the map of the country.")
W("globe", "كرة أرضية مجسمة", "Globe", "غْلُوبْ", "glob", "غْلُوبْ", "[ɡlɔb]", "[ɡloʊb]", ["glo", "be"], ["globe"], "noun", "اسم مذكر (Nom)", "Noun", "حرف b وl بصوت متصل.", "حرف o يمد بالواو (غلوب).", "Le globe tourne sur lui-même.", "تدور الكرة الأرضية حول نفسها.", "The globe spins around.")
W("ordinateur", "حاسوب", "Computer", "أُورْدِينَاتُورْ", "or-dee-na-tur", "كَمْبْيُوتَرْ", "[ɔʁ.di.na.tœʁ]", "[kəmˈpjuː.tɚ]", ["or", "di", "na", "teur"], ["com", "pu", "ter"], "noun", "اسم مذكر (Nom)", "Noun", "المقطع teur ينطق بتدوير الشفتين.", "النبرة على مقطع PU (كمبيوتر).", "Nous travaillons sur ordinateur.", "نعمل على الحاسوب.", "We work on the computer.")
W("tablette", "جهاز لوحي", "Tablet", "تَابْلِيتْ", "tab-let", "تَابْلِتْ", "[ta.blɛt]", "[ˈtæb.lɪt]", ["ta", "blet", "te"], ["tab", "let"], "noun", "اسم مؤنث (Nom)", "Noun", "المقطع ette ينطق إيت مشددة.", "مقطعان اثنان: tab وlet.", "L'enfant dessine sur la tablette.", "يرسم الطفل على اللوحي.", "The child draws on the tablet.")
W("cloche", "جرس", "Bell", "كْلُوشْ", "klosh", "بِلْ", "[klɔʃ]", "[bɛl]", ["clo", "che"], ["bell"], "noun", "اسم مؤنث (Nom)", "Noun", "المقطع che ينطق شين.", "حرف e قصير مع لام مشددة.", "La cloche annonce la fin.", "الجرس يعلن النهاية.", "The bell announces the end.")
W("récréation", "استراحة / فسحة", "Recess", "رِيكْرِيَاسْيُونْ", "ray-kray-ah-syon", "رِيسِسْ", "[ʁe.kʁe.a.sjɔ̃]", "[ˈɹiː.sɛs]", ["ré", "cré", "a", "tion"], ["re", "cess"], "noun", "اسم مؤنث (Nom)", "Noun", "المقطع tion ينطق سيون بأنفية.", "وقت اللعب والراحة.", "C'est l'heure de la récréation !", "إنه وقت الفسحة والاستراحة!", "It is recess time!")
W("devoir", "واجب مدرسي", "Homework", "دُوفْوَارْ", "duh-vwar", "هُومْ وِيرْكْ", "[də.vwaʁ]", "[ˈhoʊm.wɜːk]", ["de", "voir"], ["home", "work"], "noun", "اسم مذكر (Nom)", "Noun", "المقطع oi ينطق وا (دوفوار).", "كلمة مدمجة من home وwork.", "Je finis mon devoir.", "أنهي واجبي المدرسي.", "I finish my homework.")
W("leçon", "درس", "Lesson", "لُوسُونْ", "luh-son", "لِسِنْ", "[lə.sɔ̃]", "[ˈlɛs.ən]", ["le", "çon"], ["les", "son"], "noun", "اسم مؤنث (Nom)", "Noun", "العلامة ç تنطق سين دائماً.", "مقطعان: les وson.", "Écoute bien la leçon.", "استمع جيداً للدرس.", "Listen well to the lesson.")
W("examen", "امتحان", "Exam", "إِغْزَامَانْ", "eg-za-man", "إِغْزَامْ", "[ɛɡ.za.mɛ̃]", "[ɪɡˈzæm]", ["ex", "a", "men"], ["ex", "am"], "noun", "اسم مذكر (Nom)", "Noun", "المقطع en ينطق صوتاً أنفياً مميزاً.", "اختصار لكلمة examination.", "Je réussis mon examen.", "أنجح في امتحاني.", "I pass my exam.")
W("question", "سؤال", "Question", "كِسْتْيُونْ", "kes-tyon", "كْوِسْتْشِنْ", "[kɛs.tjɔ̃]", "[ˈkwɛs.tʃən]", ["ques", "tion"], ["ques", "tion"], "noun", "اسم مؤنث (Nom)", "Noun", "المقطع qu ينطق كافاً.", "صوت qu في الإنجليزية ينطق كو (kw).", "Pose une bonne question.", "اطرح سؤالاً ذكياً.", "Ask a good question.")
W("réponse", "إجابة", "Answer", "رِيبُونْسْ", "ray-pons", "آنْسَرْ", "[ʁe.pɔ̃s]", "[ˈɑːn.sɚ]", ["ré", "pon", "se"], ["an", "swer"], "noun", "اسم مؤنث (Nom)", "Noun", "المقطع on أنفي رنان.", "حرف w صامت تماماً (آن-سر).", "Donne ta réponse.", "أعطِ إجابتك.", "Give your answer.")
W("page", "صفحة", "Page", "بَاجْ", "pazh", "بِيجْ", "[paʒ]", "[peɪdʒ]", ["pa", "ge"], ["page"], "noun", "اسم مؤنث (Nom)", "Noun", "حرف g أمام e ينطق ژ.", "صوت a ممدود مع صوت dj.", "Ouvrez à la page cinq.", "افتحوا على الصفحة الخامسة.", "Open to page five.")
W("mot", "كلمة", "Word", "مُو", "mo", "وِيرْدْ", "[mo]", "[wɜːd]", ["mot"], ["word"], "noun", "اسم مذكر (Nom)", "Noun", "حرف t الأخير صامت.", "صوت or يشبه er في bird.", "J'apprends ce nouveau mot.", "أتعلم هذه الكلمة الجديدة.", "I learn this new word.")
W("phrase", "جملة", "Sentence", "فْرَازْ", "fraz", "سِنْتِنْسْ", "[fʁɑz]", "[ˈsɛn.təns]", ["phra", "se"], ["sen", "tence"], "noun", "اسم مؤنث (Nom)", "Noun", "حرفا ph ينطقان فاء.", "حرف c الأخير ينطق سين.", "Répète cette belle phrase.", "كرر هذه الجملة الجميلة.", "Repeat this nice sentence.")
W("bibliothèque", "مكتبة للقراءة", "Library", "بِيبْلِيُوتِيكْ", "beeb-lyo-tek", "لايْبْرَرِي", "[bi.bli.jɔ.tɛk]", "[ˈlaɪ.bɹə.ɹi]", ["bi", "blio", "thè", "que"], ["li", "bra", "ry"], "noun", "اسم مؤنث (Nom)", "Noun", "المقطع th ينطق تاء في الفرنسية.", "ثلاثة مقاطع: li-bra-ry.", "Le silence règne à la bibliothèque.", "يسود الهدوء في المكتبة.", "Silence rules in the library.")
W("peinture", "طلاء / رسم", "Paint", "بَانْتِيرْ", "pan-toor", "بِينْتْ", "[pɛ̃.tyʁ]", "[peɪnt]", ["pein", "tu", "re"], ["paint"], "noun", "اسم مؤنث (Nom)", "Noun", "المقطع ein صوت أنفي ناعم.", "صوت ai ينطق إيه طويلة.", "J'adore la peinture vive.", "أعشق الرسم بالألوان الزاهية.", "I love bright paint.")
W("pinceau", "فرشاة تلوين", "Paintbrush", "بَانْسُو", "pan-so", "بِينْتْ بْرَاشْ", "[pɛ̃.so]", "[ˈpeɪnt.bɹʌʃ]", ["pin", "ceau"], ["paint", "brush"], "noun", "اسم مذكر (Nom)", "Noun", "المقطع eau ينطق واواً صريحة.", "فرشاة الرسم والتلوين.", "Trempe le pinceau dans la couleur.", "اغمس الفرشاة في اللون.", "Dip the paintbrush in the color.")
W("dictionnaire", "معجم / قاموس", "Dictionary", "دِيكْسْيُونِيرْ", "deek-syo-ner", "دِكْشَنْرِي", "[dik.sjɔ.nɛʁ]", "[ˈdɪk.ʃən.ɹi]", ["dic", "tion", "nai", "re"], ["dic", "tion", "a", "ry"], "noun", "اسم مذكر (Nom)", "Noun", "المقطع aire ينطق إير مفتوحة.", "النبرة على المقطع الأول DIC-tion-ary.", "Ce dictionnaire est très utile.", "هذا القاموس مفيد جداً.", "This dictionary is very useful.")

print("Wrote school words successfully:", len(WORDS))
