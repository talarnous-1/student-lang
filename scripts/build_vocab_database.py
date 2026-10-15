# -*- coding: utf-8 -*-
import json
import re

# Comprehensive list of 500 primary school elementary words
# Each item is a tuple:
# (french, arabicMeaning, englishMeaning, arabicPhonetic, englishPhonetic, englishArabicPhonetic, ipa, ipaEnglish, syllables, englishSyllables, category, categoryLabelAr, categoryLabelEn, pronunciationTip, englishPronunciationTipAr, exampleFrench, exampleArabic, exampleEnglish, noteAr)

DATA = []

def add(fr, ar, en, fr_phon, en_phon, en_ar_phon, fr_ipa, en_ipa, fr_syl, en_syl, cat, cat_ar, cat_en, fr_tip, en_tip, ex_fr, ex_ar, ex_en, note=""):
    DATA.append({
        "french": fr,
        "arabicMeaning": ar,
        "englishMeaning": en,
        "arabicPhonetic": fr_phon,
        "englishPhonetic": en_phon,
        "englishArabicPhonetic": en_ar_phon,
        "ipa": fr_ipa,
        "ipaEnglish": en_ipa,
        "syllables": fr_syl,
        "englishSyllables": en_syl,
        "category": cat,
        "categoryLabelAr": cat_ar,
        "categoryLabelEn": cat_en,
        "pronunciationTip": fr_tip,
        "pronunciationTipEn": f"In French, '{fr}' is pronounced cleanly with proper accent.",
        "englishPronunciationTipAr": en_tip,
        "englishPronunciationTipEn": f"In English, '{en}' has clear pronunciation for primary learners.",
        "exampleFrench": ex_fr,
        "exampleArabic": ex_ar,
        "exampleEnglish": ex_en,
        "synonymsOrNotes": note or f"كلمة مهمة لطلاب المرحلة الابتدائية ({ar}).",
        "synonymsOrNotesEn": f"Essential primary vocabulary: {en}.",
        "isMastered": False,
        "practiceScore": 0,
        "isPrimarySchool": True,
        "gradeLevel": "ابتدائي (Primary)"
    })

print("Helper defined")
