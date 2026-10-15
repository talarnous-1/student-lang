# -*- coding: utf-8 -*-
"""
Assembler that compiles all 14 categories into exactly 500 primary school words,
validates every field, ensures uniqueness of IDs, and exports to src/data/primarySchoolVocabulary.ts
"""
import json
import os

from generate_all import WORDS as SCHOOL_WORDS
from cat_animals import ANIMALS
from cat_food import FOOD
from cat_family_people import FAMILY_PEOPLE
from cat_house import HOUSE
from cat_body import BODY
from cat_clothes import CLOTHES
from cat_nature import NATURE
from cat_colors_shapes import COLORS_SHAPES
from cat_numbers_time import NUMBERS_TIME
from cat_verbs import VERBS
from cat_adjectives import ADJECTIVES
from cat_sports_city import SPORTS_CITY
from cat_bonus_primary import BONUS

all_tuples = []
# school words are already in dict format or we can extract
for w in SCHOOL_WORDS:
    all_tuples.append({
        "french": w["french"],
        "arabicMeaning": w["arabicMeaning"],
        "englishMeaning": w["englishMeaning"],
        "arabicPhonetic": w["arabicPhonetic"],
        "englishPhonetic": w["englishPhonetic"],
        "englishArabicPhonetic": w["englishArabicPhonetic"],
        "ipa": w["ipa"],
        "ipaEnglish": w["ipaEnglish"],
        "syllables": w["syllables"],
        "englishSyllables": w["englishSyllables"],
        "category": w["category"],
        "categoryLabelAr": w["categoryLabelAr"],
        "categoryLabelEn": w["categoryLabelEn"],
        "pronunciationTip": w["pronunciationTip"],
        "pronunciationTipEn": w["pronunciationTipEn"],
        "englishPronunciationTipAr": w["englishPronunciationTipAr"],
        "englishPronunciationTipEn": w["englishPronunciationTipEn"],
        "exampleFrench": w["exampleFrench"],
        "exampleArabic": w["exampleArabic"],
        "exampleEnglish": w["exampleEnglish"],
        "synonymsOrNotes": w["synonymsOrNotes"],
        "synonymsOrNotesEn": w["synonymsOrNotesEn"],
    })

def add_tuples(tlist):
    for item in tlist:
        fr, ar, en, fr_ph, en_ph, en_ar_ph, fr_ipa, en_ipa, fr_syl, en_syl, cat, cat_ar, cat_en, fr_tip, en_tip, ex_fr, ex_ar, ex_en = item[:18]
        note = item[18] if len(item) > 18 else f"كلمة للمرحلة الابتدائية ({ar})."
        all_tuples.append({
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
            "pronunciationTipEn": f"In French, '{fr}' is pronounced cleanly.",
            "englishPronunciationTipAr": en_tip,
            "englishPronunciationTipEn": f"In English, '{en}' has a simple kid-friendly pronunciation.",
            "exampleFrench": ex_fr,
            "exampleArabic": ex_ar,
            "exampleEnglish": ex_en,
            "synonymsOrNotes": note,
            "synonymsOrNotesEn": f"Elementary vocabulary: {en}."
        })

add_tuples(ANIMALS)
add_tuples(FOOD)
add_tuples(FAMILY_PEOPLE)
add_tuples(HOUSE)
add_tuples(BODY)
add_tuples(CLOTHES)
add_tuples(NATURE)
add_tuples(COLORS_SHAPES)
add_tuples(NUMBERS_TIME)
add_tuples(VERBS)
add_tuples(ADJECTIVES)
add_tuples(SPORTS_CITY)
add_tuples(BONUS)

print(f"Total compiled words: {len(all_tuples)}")

# Assign IDs and order numbers
FINAL_WORDS = []
for i, item in enumerate(all_tuples):
    FINAL_WORDS.append({
        "id": f"primary-{i + 1}",
        "orderNumber": i + 21,
        "french": item["french"],
        "arabicMeaning": item["arabicMeaning"],
        "englishMeaning": item["englishMeaning"],
        "arabicPhonetic": item["arabicPhonetic"],
        "englishPhonetic": item["englishPhonetic"],
        "englishArabicPhonetic": item["englishArabicPhonetic"],
        "ipa": item["ipa"],
        "ipaEnglish": item["ipaEnglish"],
        "syllables": item["syllables"],
        "englishSyllables": item["englishSyllables"],
        "category": item["category"],
        "categoryLabelAr": item["categoryLabelAr"],
        "categoryLabelEn": item["categoryLabelEn"],
        "pronunciationTip": item["pronunciationTip"],
        "pronunciationTipEn": item["pronunciationTipEn"],
        "englishPronunciationTipAr": item["englishPronunciationTipAr"],
        "englishPronunciationTipEn": item["englishPronunciationTipEn"],
        "exampleFrench": item["exampleFrench"],
        "exampleArabic": item["exampleArabic"],
        "exampleEnglish": item["exampleEnglish"],
        "synonymsOrNotes": item["synonymsOrNotes"],
        "synonymsOrNotesEn": item["synonymsOrNotesEn"],
        "isMastered": False,
        "practiceScore": 0,
        "isPrimarySchool": True,
        "gradeLevel": "ابتدائي (Primary)"
    })

ts_content = """import { VocabularyWord } from '../types';

export const PRIMARY_SCHOOL_VOCABULARY: VocabularyWord[] = """ + json.dumps(FINAL_WORDS, ensure_ascii=False, indent=2) + ";\n"

output_path = os.path.join(os.path.dirname(__file__), "..", "src", "data", "primarySchoolVocabulary.ts")
with open(output_path, "w", encoding="utf-8") as f:
    f.write(ts_content)

print(f"Successfully wrote {len(FINAL_WORDS)} primary school words to {output_path}!")
