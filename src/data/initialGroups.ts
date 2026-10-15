import { WordGroup } from '../types';

export const INITIAL_GROUPS: WordGroup[] = [
  {
    id: 'group-school',
    name: 'أدوات المدرسة والفصل 🎒',
    description: 'الكلمات الأساسية للحقيبة، الكتب، والمقلمة داخل الفصل المدرسي',
    color: 'indigo',
    icon: '🎒',
    createdAt: Date.now() - 500000,
    wordIds: [
      'primary-1',  // livre / book
      'primary-2',  // crayon / pencil
      'primary-3',  // cahier / notebook
      'primary-4',  // gomme / eraser
      'primary-5',  // règle / ruler
      'primary-6',  // cartable / backpack
      'primary-7',  // école / school
      'primary-8',  // stylo / pen
      'primary-9',  // trousse / pencil case
      'primary-10', // classe / classroom
      'primary-11', // tableau / board
      'primary-12', // maître / teacher
    ],
  },
  {
    id: 'group-animals',
    name: 'عالم الحيوانات الأليفة 🐾',
    description: 'أجمل الحيوانات الأليفة والطيور التي يحبها أطفال الابتدائي',
    color: 'emerald',
    icon: '🐾',
    createdAt: Date.now() - 400000,
    wordIds: [
      'primary-41', // chat / cat
      'primary-42', // chien / dog
      'primary-43', // oiseau / bird
      'primary-44', // papillon / butterfly
      'primary-45', // cheval / horse
      'primary-46', // lion / lion
      'primary-56', // panda / panda
      'primary-58', // souris / mouse
      'primary-76', // lapin / rabbit
      'primary-84', // poisson / fish
    ],
  },
  {
    id: 'group-food',
    name: 'سلة الفواكه والأطعمة 🍎',
    description: 'أشهى الفواكه والخضار والوجبات اليومية الصحية للأطفال',
    color: 'amber',
    icon: '🍎',
    createdAt: Date.now() - 350000,
    wordIds: [
      'primary-91',  // pomme / apple
      'primary-92',  // banane / banana
      'primary-93',  // orange / orange
      'primary-94',  // fraise / strawberry
      'primary-95',  // raisin / grape
      'primary-96',  // pastèque / watermelon
      'primary-104', // carotte / carrot
      'primary-111', // pain / bread
      'primary-112', // lait / milk
      'primary-113', // fromage / cheese
      'primary-123', // gâteau / cake
      'primary-125', // chocolat / chocolate
    ],
  },
  {
    id: 'group-verbs',
    name: 'أفعال الحركة والنشاط ⚡',
    description: 'أهم الأفعال اليومية التي يفعلها الطالب في المدرسة والبيت',
    color: 'sky',
    icon: '⚡',
    createdAt: Date.now() - 300000,
    wordIds: [
      'primary-391', // manger / eat
      'primary-392', // boire / drink
      'primary-393', // dormir / sleep
      'primary-395', // jouer / play
      'primary-396', // écrire / write
      'primary-397', // lire / read
      'primary-398', // dessiner / draw
      'primary-399', // chanter / sing
      'primary-401', // courir / run
      'primary-402', // marcher / walk
      'primary-403', // sauter / jump
      'primary-404', // nager / swim
    ],
  },
  {
    id: 'group-family-home',
    name: 'عائلتي ومنزلي الدافئ 🏡',
    description: 'أفراد الأسرة والبيت الدافئ بالفرنسية والإنجليزية',
    color: 'rose',
    icon: '🏡',
    createdAt: Date.now() - 200000,
    wordIds: [
      'primary-146', // père / father
      'primary-147', // mère / mother
      'primary-148', // frère / brother
      'primary-149', // sœur / sister
      'primary-150', // grand-père / grandfather
      'primary-151', // grand-mère / grandmother
      'primary-152', // bébé / baby
      'primary-186', // maison / house
      'primary-187', // chambre / bedroom
      'primary-197', // lit / bed
    ],
  },
  {
    id: 'group-colors-nature',
    name: 'الألوان والطبيعة الساحرة 🎨',
    description: 'ألوان الطيف والشمس والسماء والأشجار والزهور',
    color: 'purple',
    icon: '🎨',
    createdAt: Date.now() - 100000,
    wordIds: [
      'primary-291', // soleil / sun
      'primary-292', // lune / moon
      'primary-293', // étoile / star
      'primary-294', // ciel / sky
      'primary-299', // arc-en-ciel / rainbow
      'primary-302', // arbre / tree
      'primary-303', // fleur / flower
      'primary-326', // rouge / red
      'primary-327', // bleu / blue
      'primary-328', // vert / green
      'primary-329', // jaune / yellow
    ],
  },
];
