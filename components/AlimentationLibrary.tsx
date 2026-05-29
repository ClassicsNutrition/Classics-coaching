'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ChevronLeft, Info, X, Zap, Heart, CheckCircle2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';

interface FoodItem {
  id: string;
  name: string;
  category: 'Légumes' | 'Fruits' | 'Féculents' | 'Protéines' | 'Laitages';
  emoji: string;
  description: string;
  calories: number; // per 100g
  protein: number;  // per 100g
  carbs: number;    // per 100g
  fat: number;      // per 100g
  benefits: string[];
  tips: string;
}

const HEALTHY_FOODS: FoodItem[] = [
  // 1. Légumes
  {
    id: 'brocoli',
    name: 'Brocoli',
    category: 'Légumes',
    emoji: '🥦',
    description: 'Le brocoli est un super-aliment réputé pour sa haute teneur en nutriments essentiels et son apport calorique très faible. C\'est l\'un des légumes de prédilection des sportifs.',
    calories: 34,
    protein: 2.8,
    carbs: 7,
    fat: 0.4,
    benefits: [
      'Riche en vitamine C et en antioxydants puissants.',
      'Soutient la synthèse des protéines et la récupération musculaire.',
      'Contient des glucosinolates qui aident à la détoxification de l\'organisme.',
      'Excellente source de fibres pour améliorer la digestion.'
    ],
    tips: 'Cuire de préférence à la vapeur pendant 5 à 7 minutes pour préserver toutes ses vitamines et minéraux, puis arroser d\'un filet de jus de citron.'
  },
  {
    id: 'epinards',
    name: 'Épinards',
    category: 'Légumes',
    emoji: '🌱',
    description: 'Les épinards sont célèbres pour leur apport en fer et minéraux essentiels. Ils augmentent l\'efficacité de la respiration cellulaire pendant l\'effort.',
    calories: 23,
    protein: 2.9,
    carbs: 3.6,
    fat: 0.4,
    benefits: [
      'Riches en nitrates qui améliorent le flux sanguin et l\'endurance musculaire.',
      'Excellente source de magnésium pour limiter les crampes.',
      'Fort pouvoir alcalinisant pour lutter contre l\'acidité musculaire.'
    ],
    tips: 'Idéal en salade fraîche avec des morceaux d\'avocat ou juste tombés à la poêle avec une touche d\'ail.'
  },
  {
    id: 'asperges',
    name: 'Asperges',
    category: 'Légumes',
    emoji: '🎍',
    description: 'Les asperges sont idéales pour éliminer l\'excès d\'eau dans le corps tout en apportant des nutriments hautement bénéfiques pour la flore intestinale.',
    calories: 20,
    protein: 2.2,
    carbs: 3.9,
    fat: 0.1,
    benefits: [
      'Action diurétique naturelle très efficace (idéal en période de sèche).',
      'Riche en acide folique (vitamine B9) et vitamine K.',
      'Contient de l\'inuline, un prébiotique qui nourrit le microbiote intestinal.'
    ],
    tips: 'Faites-les griller légèrement au four avec un filet d\'huile d\'olive et du sel de mer pour un accompagnement croquant et savoureux.'
  },
  {
    id: 'concombre',
    name: 'Concombre',
    category: 'Légumes',
    emoji: '🥒',
    description: 'Composé à 96% d\'eau, le concombre est le légume d\'hydratation par excellence. Il apporte fraîcheur et micronutriments sans peser sur le total calorique.',
    calories: 15,
    protein: 0.6,
    carbs: 3.6,
    fat: 0.1,
    benefits: [
      'Hydratation maximale et rafraîchissement rapide.',
      'Contient du silicium qui participe à la santé de la peau et des articulations.',
      'Faible teneur en sodium et fort pouvoir drainant.'
    ],
    tips: 'Consommez-le avec la peau (si biologique) car c\'est là que se concentrent la majorité des fibres et des vitamines.'
  },
  {
    id: 'carotte',
    name: 'Carotte',
    category: 'Légumes',
    emoji: '🥕',
    description: 'La carotte est une source majeure de caroténoïdes protecteurs. Elle apporte des antioxydants précieux pour limiter le stress oxydatif induit par l\'entraînement.',
    calories: 41,
    protein: 0.9,
    carbs: 9.6,
    fat: 0.2,
    benefits: [
      'Excellente source de bêta-carotène (précurseur de la vitamine A).',
      'Soutient la santé oculaire et le renouvellement cellulaire de la peau.',
      'Apporte des fibres douces et digestes pour le système digestif.'
    ],
    tips: 'Associez-les à une source de lipides sains (comme l\'huile d\'olive ou l\'avocat) pour maximiser l\'absorption du bêta-carotène.'
  },

  // 2. Fruits
  {
    id: 'pomme',
    name: 'Pomme',
    category: 'Fruits',
    emoji: '🍎',
    description: 'La pomme est un fruit hautement rassasiant grâce à ses fibres solubles uniques. C\'est l\'encas sain par excellence pour réguler la glycémie.',
    calories: 52,
    protein: 0.3,
    carbs: 14,
    fat: 0.2,
    benefits: [
      'Riche en pectine, une fibre soluble qui régule le cholestérol et l\'appétit.',
      'Aide à stabiliser la glycémie et évite les pics d\'insuline.',
      'Contient des polyphénols antioxydants protecteurs.'
    ],
    tips: 'Une pomme consommée 30 minutes avant un repas aide à manger plus calmement et améliore la satiété globale.'
  },
  {
    id: 'banane',
    name: 'Banane',
    category: 'Fruits',
    emoji: '🍌',
    description: 'La banane est le carburant naturel des athlètes. Riches en glucides facilement assimilables et en minéraux, elle aide à prévenir la fatigue musculaire.',
    calories: 89,
    protein: 1.1,
    carbs: 23,
    fat: 0.3,
    benefits: [
      'Excellente source de potassium pour le bon fonctionnement musculaire.',
      'Glucides rapidement digestes parfaits pour l\'apport énergétique pré ou post-effort.',
      'Aide à réguler l\'humeur et le sommeil grâce à sa teneur en vitamine B6.'
    ],
    tips: 'Consommez-la plutôt mûre (tachetée) avant l\'entraînement pour une énergie rapide, ou légèrement verte pour des fibres prébiotiques résistantes.'
  },
  {
    id: 'myrtilles',
    name: 'Myrtilles',
    category: 'Fruits',
    emoji: '🫐',
    description: 'Les myrtilles sont de véritables bombes nutritionnelles. Leurs pigments bleus luttent activement contre les dommages cellulaires et accélèrent la récupération musculaire.',
    calories: 57,
    protein: 0.7,
    carbs: 14,
    fat: 0.3,
    benefits: [
      'Championne absolue des antioxydants (anthocyanes).',
      'Réduit les courbatures (DOMS) et accélère la régénération musculaire.',
      'Améliore la sensibilité à l\'insuline et soutient les fonctions cognitives.'
    ],
    tips: 'Idéal à ajouter surgelées ou fraîches dans vos porridges chauds, bowls de yaourts grecs ou shakes protéinés.'
  },
  {
    id: 'avocat',
    name: 'Avocat',
    category: 'Fruits',
    emoji: '🥑',
    description: 'Bien que consommé comme légume, l\'avocat est un fruit oléagineux exceptionnel. C\'est l\'une des meilleures sources de lipides de qualité.',
    calories: 160,
    protein: 2,
    carbs: 8.5,
    fat: 15,
    benefits: [
      'Riche en acides gras mono-insaturés excellents pour le cœur et l\'équilibre hormonal.',
      'Teneur record en potassium (plus que la banane) et en fibres.',
      'Favorise l\'absorption des vitamines liposolubles (A, D, E, K) des autres aliments.'
    ],
    tips: 'Parfait écrasé sur une tranche de pain complet grillée avec des œufs pochés, ou intégré dans un smoothie pour une texture crémeuse.'
  },
  {
    id: 'citron',
    name: 'Citron',
    category: 'Fruits',
    emoji: '🍋',
    description: 'Le citron est un excellent régulateur de pH de l\'organisme et un puissant tonifiant digestif au lever.',
    calories: 29,
    protein: 1.1,
    carbs: 9,
    fat: 0.3,
    benefits: [
      'Fort pouvoir alcalinisant après métabolisation (neutralise l\'acidité).',
      'Riche en vitamine C pour stimuler les défenses naturelles.',
      'Aide à stimuler la production de bile pour une meilleure digestion.'
    ],
    tips: 'Pressez un demi-citron frais dans un verre d\'eau tiède chaque matin à jeun pour réactiver votre système digestif.'
  },

  // 3. Féculents & Grains
  {
    id: 'patate-douce',
    name: 'Patate Douce',
    category: 'Féculents',
    emoji: '🍠',
    description: 'La patate douce est le féculent fétiche des passionnés de fitness. Son indice glycémique modéré en fait une source d\'énergie durable et stable.',
    calories: 86,
    protein: 1.6,
    carbs: 20,
    fat: 0.1,
    benefits: [
      'Index glycémique modéré évitant les coups de pompe.',
      'Extrêmement riche en vitamine A (bêta-carotène) et en potassium.',
      'Digeste et douce pour les intestins des sportifs.'
    ],
    tips: 'Coupez-la en frites, saupoudrez de paprika et faites cuire au four à 200°C sans excès d\'huile pour une alternative saine aux frites classiques.'
  },
  {
    id: 'riz-complet',
    name: 'Riz Complet',
    category: 'Féculents',
    emoji: '🌾',
    description: 'Moins raffiné que le riz blanc, le riz complet conserve son enveloppe riche en fibres, minéraux et vitamines du groupe B, indispensables au métabolisme énergétique.',
    calories: 111,
    protein: 2.6,
    carbs: 23,
    fat: 0.9,
    benefits: [
      'Énergie diffuse et durable sans pic d\'insuline majeur.',
      'Riche en magnésium, sélénium et manganèse.',
      'Apporte des fibres pour réguler le transit intestinal.'
    ],
    tips: 'Rincez toujours le riz complet avant cuisson pour enlever l\'amidon de surface et cuisez-le par absorption lente.'
  },
  {
    id: 'flocons-avoine',
    name: 'Flocons d\'Avoine',
    category: 'Féculents',
    emoji: '🥣',
    description: 'L\'avoine est la céréale reine du petit-déjeuner fitness. Elle procure une satiété longue et fournit des glucides de très haute qualité.',
    calories: 389,
    protein: 16.9,
    carbs: 66,
    fat: 6.9,
    benefits: [
      'Contient du bêta-glucane, une fibre soluble qui réduit le cholestérol et régule la glycémie.',
      'Teneur élevée en protéines pour une céréale.',
      'Excellente satiété réduisant les fringales de milieu de matinée.'
    ],
    tips: 'Préparez un "overnight oat" en laissant tremper vos flocons d\'avoine toute la nuit dans du lait d\'amande avec des myrtilles et de la whey.'
  },
  {
    id: 'quinoa',
    name: 'Quinoa',
    category: 'Féculents',
    emoji: '🍚',
    description: 'Le quinoa est une pseudo-céréale sans gluten d\'une valeur nutritionnelle hors norme. Il contient tous les acides aminés essentiels.',
    calories: 120,
    protein: 4.4,
    carbs: 21,
    fat: 1.9,
    benefits: [
      'Protéine végétale complète (contient les 9 acides aminés essentiels).',
      'Naturellement sans gluten et très digeste.',
      'Riche en fibres, fer et magnésium.'
    ],
    tips: 'Idéal en salade froide après cuisson, mélangé avec des crudités, des dés de poulet ou du tofu grillé.'
  },

  // 4. Protéines
  {
    id: 'poulet',
    name: 'Blanc de Poulet',
    category: 'Protéines',
    emoji: '🍗',
    description: 'La référence ultime des protéines maigres. C\'est l\'allié indispensable pour bâtir ou maintenir la masse musculaire sans ajouter de graisses superflues.',
    calories: 120,
    protein: 26,
    carbs: 0,
    fat: 1.5,
    benefits: [
      'Taux record de protéines pures hautement biodisponibles.',
      'Quasi absence de graisses saturées et de glucides.',
      'Riche en vitamines B3 et B6 indispensables au métabolisme musculaire.'
    ],
    tips: 'Pour éviter qu\'il ne s\'assèche, faites-le mariner avec des herbes, du citron et une cuillère d\'huile d\'olive avant de le griller à la poêle.'
  },
  {
    id: 'boeuf-5',
    name: 'Steak Haché 5% MG',
    category: 'Protéines',
    emoji: '🥩',
    description: 'Une viande rouge très maigre qui allie le plaisir gustatif à un apport de premier choix en acides aminés, fer héminique et créatine naturelle.',
    calories: 124,
    protein: 21,
    carbs: 0,
    fat: 5,
    benefits: [
      'Riche en fer héminique (hautement assimilable) pour lutter contre l\'anémie et la fatigue.',
      'Source naturelle de zinc et de créatine pour la force musculaire.',
      'Protéines de haute valeur biologique.'
    ],
    tips: 'Faites-le cuire sans ajout de matière grasse dans une poêle antiadhésive bien chaude, et évitez la sur-cuisson pour conserver ses jus.'
  },
  {
    id: 'saumon',
    name: 'Saumon Sauvage',
    category: 'Protéines',
    emoji: '🐟',
    description: 'Le saumon sauvage est une source exceptionnelle de protéines et d\'acides gras oméga-3. Il agit comme un puissant anti-inflammatoire naturel.',
    calories: 180,
    protein: 20,
    carbs: 0,
    fat: 11,
    benefits: [
      'Teneur exceptionnelle en oméga-3 (EPA/DHA) protecteurs pour le cœur et les articulations.',
      'Aide à réduire l\'inflammation systémique et musculaire après l\'effort.',
      'Riche en vitamine D de haute qualité.'
    ],
    tips: 'Préférez une cuisson douce (à l\'unilatérale à la poêle ou en papillote au four) pour ne pas dénaturer les précieux acides gras oméga-3.'
  },
  {
    id: 'oeufs',
    name: 'Œufs Entiers (Plein air)',
    category: 'Protéines',
    emoji: '🥚',
    description: 'L\'œuf est la protéine de référence biologique absolue. Le jaune contient des nutriments essentiels et de bons lipides nécessaires aux hormones.',
    calories: 143,
    protein: 12.6,
    carbs: 0.7,
    fat: 9.5,
    benefits: [
      'Protéine de référence avec le meilleur aminogramme possible (valeur 100).',
      'Riche en choline pour le bon fonctionnement cérébral et nerveux.',
      'Le jaune contient de la lutéine protectrice et de bonnes graisses saines.'
    ],
    tips: 'Privilégiez les œufs certifiés biologiques ou plein air (code 0 ou 1) et préférez les œufs mollets ou pochés pour garder le jaune coulant et intact.'
  },
  {
    id: 'tofu',
    name: 'Tofu Nature',
    category: 'Protéines',
    emoji: '🫘',
    description: 'Fabriqué à partir de lait de soja caillé, le tofu est la protéine végétale par excellence. Très polyvalent, il s\'adapte à toutes les saveurs.',
    calories: 76,
    protein: 8,
    carbs: 1.9,
    fat: 4.8,
    benefits: [
      'Source complète de protéines végétales, faible en graisses saturées.',
      'Sans cholestérol et naturellement sans lactose.',
      'Riche en calcium et en fer végétal.'
    ],
    tips: 'Pressez bien le tofu pour en retirer l\'excès d\'eau, coupez-le en dés, faites-le mariner dans de la sauce soja et du gingembre, puis dorez-le au Airfryer.'
  },

  // 5. Laitages & Alternatives
  {
    id: 'yaourt-grec',
    name: 'Yaourt Grec Nature (Véritable)',
    category: 'Laitages',
    emoji: '🍦',
    description: 'Le véritable yaourt grec (égoutté) est beaucoup plus riche en protéines et plus faible en lactose qu\'un yaourt classique. Il offre une texture crémeuse inimitable.',
    calories: 60,
    protein: 9,
    carbs: 3,
    fat: 0, // Option 0% MG
    benefits: [
      'Teneur élevée en protéines (notamment caséine à diffusion lente).',
      'Riche en probiotiques (bactéries amies) qui améliorent la digestion.',
      'Source majeure de calcium pour la santé osseuse.'
    ],
    tips: 'Idéal comme collation protéinée avec des myrtilles, une poignée d\'amandes et un filet de miel d\'acacia.'
  },
  {
    id: 'lait-amande',
    name: 'Lait d\'Amande sans sucre',
    category: 'Laitages',
    emoji: '🥛',
    description: 'Une boisson végétale ultra-légère et digeste. Sa faible teneur en calories en fait une base parfaite pour tous vos shakes protéinés en période de sèche.',
    calories: 13,
    protein: 0.4,
    carbs: 0.2,
    fat: 1.1,
    benefits: [
      'Extrêmement faible en calories (idéal pour optimiser le volume alimentaire).',
      'Sans lactose, sans gluten et 100% végétal pour une digestion parfaite.',
      'Naturellement riche en vitamine E antioxydante.'
    ],
    tips: 'Vérifiez bien l\'étiquette pour choisir la version "Sans Sucres Ajoutés" (généralement autour de 13-15 kcal aux 100 ml).'
  },
  {
    id: 'fromage-blanc-0',
    name: 'Fromage Blanc 0%',
    category: 'Laitages',
    emoji: '🧀',
    description: 'Le fromage blanc 0% est composé principalement de caséine, une protéine à diffusion lente qui nourrit les muscles sur plusieurs heures.',
    calories: 48,
    protein: 8,
    carbs: 3.5,
    fat: 0.1,
    benefits: [
      'Protéine à libération prolongée (caséine) idéale pour limiter le catabolisme musculaire.',
      'Parfait pour les collations du soir ou avant le coucher.',
      'Apporte une grande quantité de calcium pour l\'entretien du squelette.'
    ],
    tips: 'Mélangez-le avec une pincée de cannelle et quelques graines de chia pour une collation nocturne hautement rassasiante et reconstructrice.'
  },
  {
    id: 'lait-coco-light',
    name: 'Lait de Coco Léger (light)',
    category: 'Laitages',
    emoji: '🥥',
    description: 'Une alternative exotique et onctueuse. Le lait de coco contient des acides gras spécifiques facilement utilisés comme source d\'énergie.',
    calories: 75,
    protein: 0.8,
    carbs: 2,
    fat: 7,
    benefits: [
      'Contient des triglycérides à chaîne moyenne (TCM) rapidement métabolisés en énergie.',
      'Alternative onctueuse sans lactose pour les préparations culinaires.',
      'Apporte du potassium, du fer et du phosphore.'
    ],
    tips: 'Utilisez-le comme base pour réaliser des currys de poulet ou de tofu parfumés aux légumes frais et aux épices.'
  }
];

interface AlimentationLibraryProps {
  user: any;
  isAdmin?: boolean;
}

export default function AlimentationLibrary({ user, isAdmin }: AlimentationLibraryProps) {
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [activeFood, setActiveFood] = useState<FoodItem | null>(null);

  // Sync with search URL parameter (e.g. ?category=Legumes)
  useEffect(() => {
    const catParam = searchParams.get('category');
    if (catParam) {
      // Handle mapping/normalization
      let normalized = catParam;
      if (normalized === 'Légumes' || normalized.toLowerCase().startsWith('leg')) normalized = 'Légumes';
      if (normalized.toLowerCase().startsWith('fruit')) normalized = 'Fruits';
      if (normalized.toLowerCase().startsWith('fec') || normalized.toLowerCase().startsWith('grain')) normalized = 'Féculents';
      if (normalized.toLowerCase().startsWith('prot')) normalized = 'Protéines';
      if (normalized.toLowerCase().startsWith('lait') || normalized.toLowerCase().startsWith('yaou')) normalized = 'Laitages';

      const validCategories = ['Tous', 'Légumes', 'Fruits', 'Féculents', 'Protéines', 'Laitages'];
      if (validCategories.includes(normalized)) {
        setSelectedCategory(normalized);
      }
    } else {
      setSelectedCategory('Tous');
    }
  }, [searchParams]);

  // Filters
  const matchesSearch = (text: string) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));

  const filteredFoods = HEALTHY_FOODS.filter(food => {
    const matchesQuery = matchesSearch(food.name) || matchesSearch(food.description);
    const matchesCat = selectedCategory === 'Tous' || food.category === selectedCategory;
    return matchesQuery && matchesCat;
  });

  const categoriesConfig = [
    { name: 'Tous', param: 'Tous', desc: 'Découvrez tous nos aliments recommandés.', icon: '🥗', color: 'var(--miami-cyan)', glow: 'rgba(0, 245, 255, 0.25)' },
    { name: 'Légumes', param: 'Légumes', desc: 'Fibres, antioxydants et micronutriments.', icon: '🥦', color: '#10b981', glow: 'rgba(16, 185, 129, 0.25)' },
    { name: 'Fruits', param: 'Fruits', desc: 'Énergie naturelle et vitamines vitales.', icon: '🍎', color: 'var(--miami-pink)', glow: 'rgba(255, 10, 94, 0.25)' },
    { name: 'Féculents', param: 'Féculents', desc: 'Glucides complexes pour l\'endurance.', icon: '🍠', color: '#facc15', glow: 'rgba(250, 204, 21, 0.25)' },
    { name: 'Protéines', param: 'Protéines', desc: 'Indispensables pour réparer et bâtir le muscle.', icon: '🍗', color: '#ef4444', glow: 'rgba(239, 68, 68, 0.25)' },
    { name: 'Laitages & Alts', param: 'Laitages', desc: 'Calcium, protéines lentes et probiotiques.', icon: '🥛', color: 'var(--miami-purple-light)', glow: 'rgba(189, 0, 255, 0.25)' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, width: '100%' }}>
      
      {/* Search and Header Header card */}
      <div 
        className="card-glass" 
        style={{ 
          padding: '24px 32px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 16,
          border: '1px solid rgba(0, 245, 255, 0.25)',
          boxShadow: '0 8px 32px rgba(7, 6, 26, 0.5), 0 0 25px rgba(0, 245, 255, 0.08)',
          borderRadius: 20
        }}
      >
        <div style={{ position: 'relative', width: '100%' }}>
          <Search 
            size={22} 
            style={{ 
              position: 'absolute', 
              left: 18, 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: 'var(--miami-cyan)' 
            }} 
          />
          <input 
            className="input-miami" 
            placeholder="Rechercher un aliment (ex: brocoli, yaourt, avocat...)" 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ 
              paddingLeft: 54, 
              width: '100%', 
              height: 56, 
              fontSize: '1.05rem',
              borderRadius: 14,
              borderColor: searchTerm ? 'var(--miami-cyan)' : 'rgba(255, 10, 94, 0.25)'
            }}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              style={{
                position: 'absolute',
                right: 18,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'rgba(226, 232, 240, 0.5)',
                cursor: 'pointer',
                padding: 4
              }}
            >
              <X size={18} />
            </button>
          )}
        </div>
        
        {searchTerm.trim().length > 0 && (
          <div style={{ fontSize: '0.9rem', color: 'rgba(245, 240, 255, 0.65)' }}>
            Résultats de recherche pour &quot;<span style={{ color: 'var(--miami-cyan)' }}>{searchTerm}</span>&quot; : 
            {` ${filteredFoods.length} aliment(s) trouvé(s).`}
          </div>
        )}
      </div>

      {/* Main layout container (stacked vertically) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 48, width: '100%' }}>
        
        <div className="card-glass" style={{ padding: '32px 24px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ 
                width: 40, 
                height: 40, 
                borderRadius: 10, 
                background: 'rgba(0, 245, 255, 0.1)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: 'var(--miami-cyan)',
                boxShadow: '0 0 10px rgba(0, 245, 255, 0.2)'
              }}>
                <Zap size={20} />
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 'normal', color: 'white', letterSpacing: '0.04em' }}>
                Guide de Nutrition Saine
              </h2>
            </div>
            <div className="badge badge-cyan" style={{ letterSpacing: '0.05em' }}>
              100% Produits Sains & Naturels
            </div>
          </div>

          {/* Categories Cards Row/Grid */}
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
              gap: 16, 
              marginBottom: 32,
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              paddingBottom: 24
            }}
          >
            {categoriesConfig.map(cat => {
              const isSelected = selectedCategory === cat.param;
              return (
                <div
                  key={cat.param}
                  onClick={() => setSelectedCategory(cat.param)}
                  className="hover-lift"
                  style={{
                    background: isSelected ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.01)',
                    border: `1px solid ${isSelected ? cat.color : 'rgba(255, 255, 255, 0.06)'}`,
                    borderRadius: 14,
                    padding: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    transition: 'all 0.3s ease',
                    boxShadow: isSelected ? `0 0 15px ${cat.glow}` : 'none',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={e => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.01)';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '1.25rem' }}>{cat.icon}</span>
                    <span style={{ 
                      color: 'white', 
                      fontWeight: 700, 
                      fontSize: '0.95rem',
                      fontFamily: 'var(--font-display)',
                      letterSpacing: '0.03em'
                    }}>
                      {cat.name}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(245, 240, 255, 0.55)', lineHeight: 1.3 }}>
                    {cat.desc}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Foods list display */}
          {filteredFoods.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 16px', color: 'rgba(245, 240, 255, 0.4)' }}>
              <Info size={36} style={{ marginBottom: 12, opacity: 0.3, color: 'var(--miami-cyan)' }} />
              <p style={{ fontSize: '0.9rem' }}>Aucun aliment correspondant trouvé</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
              {filteredFoods.map(food => (
                <div
                  key={food.id}
                  onClick={() => setActiveFood(food)}
                  className="hover-lift"
                  style={{
                    background: 'rgba(20, 19, 58, 0.35)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: 16,
                    padding: 18,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 14,
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(0, 245, 255, 0.35)';
                    e.currentTarget.style.background = 'rgba(0, 245, 255, 0.02)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.background = 'rgba(20, 19, 58, 0.35)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 50,
                      height: 50,
                      borderRadius: 12,
                      background: 'rgba(7, 6, 26, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.8rem',
                      border: '1px solid rgba(255, 255, 255, 0.06)'
                    }}>
                      {food.emoji}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ color: 'white', fontWeight: 700, fontSize: '1rem', fontFamily: 'var(--font-body)', margin: 0 }}>
                        {food.name}
                      </h4>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        color: food.category === 'Légumes' ? '#10b981' : 
                               food.category === 'Fruits' ? 'var(--miami-pink)' :
                               food.category === 'Féculents' ? '#facc15' :
                               food.category === 'Protéines' ? '#ef4444' : 'var(--miami-purple-light)',
                        fontWeight: 600
                      }}>
                        {food.category}
                      </span>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.8rem', color: 'rgba(245, 240, 255, 0.6)', lineHeight: 1.4, margin: 0, height: '2.8em', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {food.description}
                  </p>

                  {/* Micro Nutrients summary badge */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(4, 1fr)', 
                    gap: 6,
                    background: 'rgba(7, 6, 26, 0.4)',
                    padding: '8px 10px',
                    borderRadius: 10,
                    textAlign: 'center',
                    fontSize: '0.7rem',
                    border: '1px solid rgba(255, 255, 255, 0.03)'
                  }}>
                    <div>
                      <div style={{ color: 'rgba(245, 240, 255, 0.5)', fontSize: '0.6rem' }}>Cal.</div>
                      <div style={{ fontWeight: 700, color: 'white' }}>{food.calories}</div>
                    </div>
                    <div>
                      <div style={{ color: 'rgba(245, 240, 255, 0.5)', fontSize: '0.6rem' }}>Prot.</div>
                      <div style={{ fontWeight: 700, color: '#ef4444' }}>{food.protein}g</div>
                    </div>
                    <div>
                      <div style={{ color: 'rgba(245, 240, 255, 0.5)', fontSize: '0.6rem' }}>Gluc.</div>
                      <div style={{ fontWeight: 700, color: '#facc15' }}>{food.carbs}g</div>
                    </div>
                    <div>
                      <div style={{ color: 'rgba(245, 240, 255, 0.5)', fontSize: '0.6rem' }}>Lip.</div>
                      <div style={{ fontWeight: 700, color: 'var(--miami-cyan)' }}>{food.fat}g</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

      {/* Pop-up Food Details Modal */}
      {activeFood && (
        <div 
          style={{ 
            position: 'fixed', 
            inset: 0, 
            background: 'rgba(4, 3, 16, 0.85)', 
            backdropFilter: 'blur(16px)', 
            zIndex: 1100, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: 20 
          }}
          onClick={() => setActiveFood(null)}
        >
          <div 
            className="card-glass" 
            style={{ 
              width: '100%', 
              maxWidth: 580, 
              padding: 32, 
              position: 'relative',
              border: '1px solid rgba(0, 245, 255, 0.3)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 245, 255, 0.15)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setActiveFood(null)} 
              style={{ 
                position: 'absolute', 
                top: 20, 
                right: 20, 
                background: 'rgba(255,255,255,0.03)', 
                border: '1px solid rgba(255,255,255,0.08)', 
                color: 'white', 
                cursor: 'pointer',
                borderRadius: '50%',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,245,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
            >
              <X size={20} />
            </button>

            {/* Modal Body */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 10 }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: 14,
                  background: 'rgba(7, 6, 26, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  {activeFood.emoji}
                </div>
                <div>
                  <h3 style={{ 
                    fontFamily: 'var(--font-display)', 
                    fontSize: '2.4rem', 
                    fontWeight: 'normal', 
                    color: 'white', 
                    lineHeight: 1.1, 
                    letterSpacing: '0.04em',
                    margin: 0
                  }}>
                    {activeFood.name}
                  </h3>
                  <span style={{ 
                    fontSize: '0.85rem', 
                    color: 'var(--miami-cyan)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {activeFood.category}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p style={{ fontSize: '0.95rem', color: 'rgba(245, 240, 255, 0.8)', lineHeight: 1.6, margin: 0 }}>
                {activeFood.description}
              </p>

              {/* Macronutrient Visual Gauges (Premium Design!) */}
              <div>
                <h4 style={{ 
                  color: 'white', 
                  fontFamily: 'var(--font-display)', 
                  fontSize: '1.25rem', 
                  fontWeight: 'normal', 
                  letterSpacing: '0.04em',
                  marginBottom: 12
                }}>
                  Valeurs Nutritionnelles (pour 100g)
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, background: 'rgba(7, 6, 26, 0.45)', padding: '16px 20px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.03)' }}>
                  
                  {/* Calorie Summary */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.9rem', color: 'rgba(245, 240, 255, 0.65)' }}>Énergie</span>
                    <strong style={{ fontSize: '1rem', color: 'white' }}>{activeFood.calories} kcal</strong>
                  </div>

                  {/* Protein Bar */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 4 }}>
                      <span style={{ color: 'rgba(245, 240, 255, 0.65)' }}>Protéines</span>
                      <strong style={{ color: '#ef4444' }}>{activeFood.protein} g</strong>
                    </div>
                    <div style={{ width: '100%', height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${Math.min((activeFood.protein / 30) * 100, 100)}%`, 
                        height: '100%', 
                        background: '#ef4444', 
                        boxShadow: '0 0 8px rgba(239, 68, 68, 0.5)'
                      }} />
                    </div>
                  </div>

                  {/* Carbs Bar */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 4 }}>
                      <span style={{ color: 'rgba(245, 240, 255, 0.65)' }}>Glucides</span>
                      <strong style={{ color: '#facc15' }}>{activeFood.carbs} g</strong>
                    </div>
                    <div style={{ width: '100%', height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${Math.min((activeFood.carbs / 80) * 100, 100)}%`, 
                        height: '100%', 
                        background: '#facc15',
                        boxShadow: '0 0 8px rgba(250, 204, 21, 0.5)'
                      }} />
                    </div>
                  </div>

                  {/* Fat Bar */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 4 }}>
                      <span style={{ color: 'rgba(245, 240, 255, 0.65)' }}>Lipides</span>
                      <strong style={{ color: 'var(--miami-cyan)' }}>{activeFood.fat} g</strong>
                    </div>
                    <div style={{ width: '100%', height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${Math.min((activeFood.fat / 25) * 100, 100)}%`, 
                        height: '100%', 
                        background: 'var(--miami-cyan)',
                        boxShadow: '0 0 8px rgba(0, 245, 255, 0.5)'
                      }} />
                    </div>
                  </div>

                </div>
              </div>

              {/* Benefits list */}
              <div>
                <h4 style={{ 
                  color: 'white', 
                  fontFamily: 'var(--font-display)', 
                  fontSize: '1.25rem', 
                  fontWeight: 'normal', 
                  letterSpacing: '0.04em',
                  marginBottom: 10,
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingBottom: 6
                }}>
                  Bienfaits Santé & Sport
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {activeFood.benefits.map((benefit, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <CheckCircle2 size={16} style={{ color: 'var(--miami-cyan)', marginTop: 2, flexShrink: 0 }} />
                      <span style={{ fontSize: '0.9rem', color: 'rgba(245, 240, 255, 0.75)', lineHeight: 1.4 }}>
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prep & consumption advice */}
              <div>
                <h4 style={{ 
                  color: 'white', 
                  fontFamily: 'var(--font-display)', 
                  fontSize: '1.25rem', 
                  fontWeight: 'normal', 
                  letterSpacing: '0.04em',
                  marginBottom: 6
                }}>
                  Conseil de Consommation
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'rgba(245, 240, 255, 0.7)', lineHeight: 1.5, background: 'rgba(0, 245, 255, 0.03)', padding: 14, borderRadius: 10, borderLeft: '3px solid var(--miami-cyan)' }}>
                  {activeFood.tips}
                </p>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
