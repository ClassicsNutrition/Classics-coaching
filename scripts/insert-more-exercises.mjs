import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Read env variables manually from .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
const getEnv = (key) => {
  const match = envContent.match(new RegExp(`${key}=(.*)`));
  return match ? match[1].trim() : null;
};

const url = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const serviceKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');

if (!url || !serviceKey) {
  console.error("Missing credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

const newExercises = [

  // ─── PECTORAUX ───────────────────────────────────────────────────────────
  {
    name: "Pompes inclinées (pieds surélevés)",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2022/01/pompes-inclinee-pieds-sureles.gif",
    muscle_group: "Pectoraux - Portion supérieure, Épaules - Faisceau antérieur, Triceps - Chef latéral",
    instructions: "DESCRIPTION DE L'EXERCICE\nLes pompes avec les pieds surélevés permettent de cibler la portion supérieure des pectoraux, à la manière d'un développé incliné.\n\n1. Placez vos pieds sur une chaise ou un banc, mains au sol largeur d'épaules.\n2. Descendez la poitrine vers le sol en contrôlant bien le mouvement, coudes à environ 45° du corps.\n3. Poussez fort pour revenir à la position haute en contractant les pectoraux.\n\nCONSEILS DU COACH\n- Gardez le corps aligné (gainage) tout au long du mouvement.\n- Plus les pieds sont hauts, plus le haut des pectoraux est sollicité.\n- Ne laissez pas les hanches tomber ou monter."
  },
  {
    name: "Pompes déclinées (mains surélevées)",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2022/01/pompes-mains-sureles.gif",
    muscle_group: "Pectoraux - Portion inférieure, Triceps - Chef latéral, Épaules - Faisceau antérieur",
    instructions: "DESCRIPTION DE L'EXERCICE\nLes pompes avec les mains surélevées (sur un banc ou une boîte) ciblent la partie inférieure et la zone sterno-costale des pectoraux.\n\n1. Placez vos mains sur un banc solide, pieds au sol ; corps incliné vers le bas.\n2. Descendez la poitrine vers le bord du banc en fléchissant les coudes.\n3. Poussez fort pour revenir à la position haute.\n\nCONSEILS DU COACH\n- Idéal en fin de séance pour finir les pectoraux avec du volume.\n- Variez l'écartement des mains pour changer l'accent musculaire."
  },
  {
    name: "Câble Crossover (Croisé poulies hautes)",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2000/06/ecarte-poulie-vis-a-vis-exercice-musculation-pectoraux.gif",
    muscle_group: "Pectoraux - Portion inférieure, Pectoraux - Portion moyenne, Épaules - Faisceau antérieur",
    instructions: "DESCRIPTION DE L'EXERCICE\nLe câble crossover (croisé poulies hautes) est l'exercice d'isolation par excellence pour la définition et le galbe des pectoraux.\n\n1. Placez les deux poulies en position haute. Tenez une poignée dans chaque main.\n2. Avancez d'un pas pour mettre les câbles sous tension, un pied devant l'autre.\n3. En gardant une légère flexion des coudes, ramenez vos mains en croisant légèrement devant vos hanches.\n4. Revenez lentement à la position initiale en contrôlant l'étirement.\n\nCONSEILS DU COACH\n- Imaginez que vous étreindre quelqu'un devant vous.\n- Ne bougez pas les épaules lors de la contraction.\n- Variez la hauteur des poulies pour changer la zone ciblée."
  },
  {
    name: "Développé couché prise serrée",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2000/03/developpe-couche-prise-serree-exercice-musculation.gif",
    muscle_group: "Triceps - Chef latéral, Triceps - Chef médial, Pectoraux - Portion moyenne, Épaules - Faisceau antérieur",
    instructions: "DESCRIPTION DE L'EXERCICE\nLe développé couché prise serrée est l'un des meilleurs exercices polyarticulaires pour les triceps, tout en sollicitant le milieu des pectoraux.\n\n1. Allongé sur un banc plat, saisissez la barre avec une prise rapprochée (environ 30 cm entre les pouces).\n2. Descendez la barre contrôlée vers le bas du sternum, coudes restant collés au corps.\n3. Poussez explosément pour revenir à la position haute, sans déverrouiller complètement les coudes.\n\nCONSEILS DU COACH\n- Ne prenez pas une prise trop serrée (mains très rapprochées) car cela stresse excessivement les poignets.\n- Gardez les coudes rentrés vers le corps, pas écartés comme un développé couché classique."
  },

  // ─── DOS ──────────────────────────────────────────────────────────────────
  {
    name: "Soulevé de terre conventionnel",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2021/11/souleve-de-terre-deadlift.gif",
    muscle_group: "Dos - Lombaires, Dos - Grand dorsal, Dos - Trapèzes, Jambes - Ischio-jambiers, Jambes - Fessiers",
    instructions: "DESCRIPTION DE L'EXERCICE\nLe soulevé de terre est LE mouvement fondamental de force. Il sollicite la quasi-totalité des muscles du corps, de la chaîne postérieure aux membres supérieurs.\n\n1. Debout, pieds à largeur de bassin sous la barre, orteils légèrement sortis.\n2. Saisissez la barre en pronation (ou prise mixte) juste à l'extérieur de vos genoux. Dos plat, poitrine sortie, regard droit devant.\n3. Poussez le sol avec vos pieds et montez la barre le long des tibias, genoux s'écartant pour laisser passer la barre.\n4. Redressez-vous complètement en contractant les fessiers et le dos. Redescendez de manière contrôlée.\n\nCONSEILS DU COACH\n- Ne jamais arrondir le bas du dos. C'est la règle numéro 1.\n- Contractez les abdominaux comme si vous alliez recevoir un coup dans le ventre.\n- Gardez la barre le plus proche possible du corps tout au long du mouvement."
  },
  {
    name: "Tirage vertical prise neutre",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2000/05/tirage-vertical-prise-neutre-exercice-musculation.gif",
    muscle_group: "Dos - Grand dorsal, Biceps - Portion courte, Dos - Trapèzes",
    instructions: "DESCRIPTION DE L'EXERCICE\nLe tirage vertical prise neutre (paumes en vis-à-vis) est une variante du tirage vertical classique permettant de mieux isoler le grand dorsal et de réduire le stress sur les épaules.\n\n1. Assis à la machine, saisissez les deux poignées parallèles avec les paumes face à face.\n2. Tirez vers le haut de la poitrine en expirant, en serrant fort les omoplates en bas de chaque répétition.\n3. Contrôlez le retour bras tendus pour étirer pleinement le dorsal.\n\nCONSEILS DU COACH\n- Initiez le mouvement avec les coudes (pas les mains) pour mieux recruter le dorsal.\n- Conservez un léger cambré et la poitrine bien sortie tout au long du mouvement."
  },
  {
    name: "Rowing haltère unilatéral (One Arm Row)",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2021/11/rowing-haltere-unilateral.gif",
    muscle_group: "Dos - Grand dorsal, Dos - Grand rond & coiffe, Biceps",
    instructions: "DESCRIPTION DE L'EXERCICE\nLe rowing unilatéral avec haltère (one-arm dumbbell row) est un excellent exercice pour développer l'épaisseur du dos tout en corrigeant les déséquilibres entre les deux côtés.\n\n1. Posez un genou et une main sur un banc pour vous stabiliser, un haltère dans la main opposée bras tendu.\n2. Tirez l'haltère vers votre hanche en rentrant le coude près du corps et en contractant fort le dorsal.\n3. Redescendez l'haltère lentement en contrôlant l'étirement.\n\nCONSEILS DU COACH\n- Évitez de rouler l'épaule lors de la montée.\n- Concentrez-vous sur le coude qui monte, pas sur la main.\n- Gardez le dos parfaitement plat tout au long du mouvement."
  },
  {
    name: "Face Pull à la poulie",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2022/01/face-pull-poulie.gif",
    muscle_group: "Épaules - Faisceau postérieur, Dos - Trapèzes, Dos - Grand rond & coiffe",
    instructions: "DESCRIPTION DE L'EXERCICE\nLe face pull est un exercice incontournable pour la santé des épaules. Il renforce les muscles de la coiffe des rotateurs et les trapèzes, contrebalançant le travail des muscles pousseurs.\n\n1. Réglez la poulie à la hauteur de votre visage et accrochez une corde.\n2. Saisissez la corde à deux mains, paumes vers le bas, et reculez d'un pas.\n3. Tirez la corde vers votre visage en écartant les deux extrémités de chaque côté de votre tête, coudes à la hauteur des épaules.\n4. Revenez lentement à la position initiale.\n\nCONSEILS DU COACH\n- Ne laissez pas les coudes tomber en dessous des épaules pendant le tirage.\n- Imaginez que vous voulez montrer vos biceps en tirant vers vous.\n- Idéal en début ou fin de séance pour l'équilibre musculaire des épaules."
  },
  {
    name: "Good Morning à la barre",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2022/01/good-morning-barre.gif",
    muscle_group: "Dos - Lombaires, Jambes - Ischio-jambiers, Jambes - Fessiers",
    instructions: "DESCRIPTION DE L'EXERCICE\nLe Good Morning est un exercice excellent pour renforcer les lombaires, les ischio-jambiers et les fessiers. C'est un mouvement complémentaire parfait pour améliorer votre squat et votre soulevé de terre.\n\n1. Barre posée sur le haut des trapèzes, pieds à largeur d'épaules, genoux légèrement fléchis.\n2. Gardez le dos bien plat et penchez le buste vers l'avant en poussant les hanches vers l'arrière.\n3. Descendez jusqu'à ce que le buste soit à peu près parallèle au sol (ou jusqu'au bout de votre amplitude avec le dos droit).\n4. Remontez en poussant les hanches vers l'avant et en contractant les fessiers.\n\nCONSEILS DU COACH\n- Commencez TRÈS léger pour maîtriser la technique.\n- Le bas du dos doit rester en position neutre (légère cambrure naturelle) tout au long du mouvement."
  },
  {
    name: "Tirage horizontal à la machine",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2000/07/tirage-horizontal-machine-exercice-musculation.gif",
    muscle_group: "Dos - Grand dorsal, Dos - Trapèzes, Dos - Grand rond & coiffe, Biceps",
    instructions: "DESCRIPTION DE L'EXERCICE\nLe tirage horizontal à la machine est une version guidée du rowing barre, idéale pour les débutants ou pour isoler le dos en fin de séance.\n\n1. Assis à la machine, poitrine contre le support, saisissez les poignées avec une prise confortable.\n2. Tirez les poignées vers vous en serrant les omoplates, coudes le long du corps.\n3. Contrôlez le retour à la position initiale en étirant bien les dorsaux.\n\nCONSEILS DU COACH\n- Ne compensez pas avec le buste (pas de balancement).\n- Concentrez-vous sur la contraction des omoplates en fin de mouvement."
  },
  {
    name: "Extension lombaires au banc romain",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2000/03/extension-lombaires-banc-romain-exercice-musculation.gif",
    muscle_group: "Dos - Lombaires, Jambes - Fessiers, Jambes - Ischio-jambiers",
    instructions: "DESCRIPTION DE L'EXERCICE\nL'extension lombaire au banc romain (ou hyperextension) est le meilleur exercice d'isolation pour renforcer les muscles érecteurs du rachis (lombaires).\n\n1. Placez-vous sur le banc romain (cavaletti), pieds bloqués sous les coussinets, hanches au bord du support.\n2. Croisez les bras sur la poitrine ou derrière la tête. Laissez le buste descendre lentement vers le bas.\n3. Relevez le buste jusqu'à ce que votre corps forme une ligne droite (ne vous cambrez pas en arrière).\n\nCONSEILS DU COACH\n- Ne dépassez pas la ligne droite en remontant pour éviter de compresser les vertèbres.\n- Pour augmenter la difficulté, tenez un disque contre la poitrine.\n- Mouvement lent et contrôlé, sans élan."
  },

  // ─── ÉPAULES ──────────────────────────────────────────────────────────────
  {
    name: "Arnold Press (Développé Arnold)",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2022/01/arnold-press.gif",
    muscle_group: "Épaules - Faisceau antérieur, Épaules - Faisceau moyen, Épaules - Faisceau postérieur, Triceps",
    instructions: "DESCRIPTION DE L'EXERCICE\nL'Arnold Press (inventé par Arnold Schwarzenegger) est une variante du développé épaules qui sollicite les trois faisceaux du deltoïde sur une amplitude de rotation complète.\n\n1. Assis sur un banc droit, tenez deux haltères devant vous à hauteur des épaules, paumes vers vous (comme à la fin d'un curl).\n2. En poussant les haltères vers le haut, effectuez simultanément une rotation des poignets de 180° pour finir avec les paumes vers l'avant, bras tendus.\n3. Redescendez en inversant le mouvement de rotation.\n\nCONSEILS DU COACH\n- Mouvement fluide et continu, sans à-coups.\n- Idéal pour compléter le travail des épaules après le développé militaire classique."
  },
  {
    name: "Élévations latérales à la poulie basse",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2022/01/elevation-laterale-poulie-basse.gif",
    muscle_group: "Épaules - Faisceau moyen",
    instructions: "DESCRIPTION DE L'EXERCICE\nLes élévations latérales à la poulie basse offrent une tension constante sur tout le mouvement, contrairement aux haltères. Idéal pour l'hypertrophie du faisceau moyen du deltoïde.\n\n1. Debout de côté par rapport à la poulie basse, saisissez la poignée avec la main la plus éloignée de la machine.\n2. Élevez le bras sur le côté jusqu'à la hauteur des épaules (bras légèrement fléchi), en gardant le coude légèrement au-dessus du poignet.\n3. Contrôlez le retour lentement.\n\nCONSEILS DU COACH\n- La tension est maximale tout au long de l'amplitude, profitez-en.\n- Ne montez pas les épaules lors de la montée du bras.\n- Effectuez l'exercice des deux côtés."
  },
  {
    name: "Développé épaules haltères assis",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2022/01/developpe-epaules-halteres-assis.gif",
    muscle_group: "Épaules - Faisceau antérieur, Épaules - Faisceau moyen, Triceps",
    instructions: "DESCRIPTION DE L'EXERCICE\nLe développé épaules assis avec haltères est une alternative au développé militaire barre, offrant une amplitude de mouvement plus naturelle et indépendante pour chaque bras.\n\n1. Assis sur un banc avec le dossier incliné à 90°, tenez les haltères à la hauteur des épaules, coudes fléchis.\n2. Poussez les haltères vers le haut en les rapprochant légèrement (sans les toucher) jusqu'à avoir les bras quasiment tendus.\n3. Contrôlez le retour jusqu'à la position de départ.\n\nCONSEILS DU COACH\n- Ne verrouillez pas complètement les coudes en haut pour maintenir la tension.\n- Gardez le dos en appui contre le dossier du banc tout au long du mouvement."
  },
  {
    name: "Shrug haltères (Élévations d'épaules)",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2000/09/shrug-halteres-exercice-musculation.gif",
    muscle_group: "Dos - Trapèzes",
    instructions: "DESCRIPTION DE L'EXERCICE\nLe shrug aux haltères cible spécifiquement les trapèzes supérieurs pour développer le volume et la force de cette zone.\n\n1. Debout, tenez un haltère dans chaque main le long du corps, paumes vers l'intérieur.\n2. Haussez les épaules le plus haut possible en contractant les trapèzes, comme si vous essayiez de toucher vos oreilles avec vos épaules.\n3. Maintenez la contraction une seconde puis redescendez lentement.\n\nCONSEILS DU COACH\n- Ne faites pas de rotations avec les épaules, mouvement purement vertical.\n- Évitez de pencher la tête pendant l'exercice."
  },
  {
    name: "Tirage menton à la barre (Upright Row)",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2000/07/tirage-menton-barre-exercice-musculation.gif",
    muscle_group: "Épaules - Faisceau moyen, Dos - Trapèzes, Biceps",
    instructions: "DESCRIPTION DE L'EXERCICE\nLe tirage menton (upright row) sollicite à la fois le faisceau moyen des deltoïdes et les trapèzes en un même mouvement polyarticulaire.\n\n1. Debout, saisissez la barre avec une prise pronation serrée (mains espacées de 30 cm environ).\n2. Tirez la barre le long du corps vers votre menton en gardant les coudes plus hauts que les poignets.\n3. Contrôlez le retour à la position initiale.\n\nCONSEILS DU COACH\n- Ne montez pas la barre trop haut, s'arrêter au niveau de la clavicule est suffisant.\n- Une prise trop serrée peut stresser les épaules ; si inconfort, élargissez la prise ou utilisez une corde de poulie."
  },

  // ─── BRAS ─────────────────────────────────────────────────────────────────
  {
    name: "Curl haltères alterné",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2000/01/curl-halteres-alternes-exercice-musculation.gif",
    muscle_group: "Bras - Biceps (Portion courte), Bras - Biceps (Portion longue), Bras - Avant-bras",
    instructions: "DESCRIPTION DE L'EXERCICE\nLe curl haltères alterné est la version la plus populaire du curl. Il permet de travailler chaque bras indépendamment et de mieux contrôler la contraction.\n\n1. Debout, un haltère dans chaque main bras tendus le long du corps, paumes vers l'intérieur.\n2. Fléchissez un bras en supinant le poignet (paume vers le haut) lors de la montée, contractez fort le biceps en haut.\n3. Redescendez contrôlé et recommencez avec l'autre bras.\n\nCONSEILS DU COACH\n- Gardez les coudes fixes le long du corps, ils ne doivent pas avancer pendant la montée.\n- La supination (rotation du poignet) maximise le recrutement des fibres du biceps."
  },
  {
    name: "Curl marteau (Hammer Curl)",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2000/01/curl-halteres-marteau-exercice-musculation.gif",
    muscle_group: "Bras - Biceps (Portion longue), Bras - Avant-bras",
    instructions: "DESCRIPTION DE L'EXERCICE\nLe curl marteau (hammer curl) cible le brachial et le brachio-radial (avant-bras), en plus de la longue portion du biceps. C'est un exercice essentiel pour avoir des bras complets et épais.\n\n1. Debout, haltères en main avec une prise neutre (paumes vers l'intérieur), bras tendus le long du corps.\n2. Fléchissez les coudes pour monter les haltères sans changer la position des poignets (prise neutre maintenue).\n3. Contrôlez la descente lentement.\n\nCONSEILS DU COACH\n- Excellent complément au curl classique pour épaissir les bras.\n- Peut être fait simultanément ou en alternance."
  },
  {
    name: "Curl barre (Biceps Curl à la barre)",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2000/01/curl-biceps-barre-exercice-musculation.gif",
    muscle_group: "Bras - Biceps (Portion courte), Bras - Biceps (Portion longue)",
    instructions: "DESCRIPTION DE L'EXERCICE\nLe curl barre est l'exercice de référence pour développer la masse du biceps. Il permet de charger lourd et d'augmenter la force globale des bras.\n\n1. Debout, saisissez la barre avec une prise supination (paumes vers le haut), largeur d'épaules.\n2. Gardez les coudes fixes le long du corps et fléchissez les bras pour monter la barre vers les épaules.\n3. Contractez fort en haut puis redescendez lentement.\n\nCONSEILS DU COACH\n- Évitez de balancer le corps pour aider à monter la barre (triche).\n- Utilisez une barre EZ pour réduire le stress sur les poignets si nécessaire."
  },
  {
    name: "Extension triceps au-dessus de la tête (Haltère)",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2000/01/extension-triceps-dessus-tete-haltere-exercice-musculation.gif",
    muscle_group: "Bras - Triceps (Chef long), Bras - Triceps (Chef médial)",
    instructions: "DESCRIPTION DE L'EXERCICE\nL'extension triceps au-dessus de la tête cible particulièrement le chef long du triceps, qui est le plus grand des trois faisceaux. Cet angle permet un étirement complet du muscle.\n\n1. Debout ou assis, tenez un haltère à deux mains au-dessus de votre tête, bras tendus.\n2. Pliez les coudes pour descendre l'haltère derrière la nuque en gardant les coudes pointés vers le plafond.\n3. Remontez en tendant les bras et en contractant fort les triceps.\n\nCONSEILS DU COACH\n- Gardez les coudes fixes et rapprochés de la tête tout au long du mouvement.\n- Ne laissez pas les coudes s'écarter, c'est la principale erreur technique."
  },
  {
    name: "Kickback triceps haltère (Kick-back)",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2000/01/kickback-triceps-haltere-exercice-musculation.gif",
    muscle_group: "Bras - Triceps (Chef latéral), Bras - Triceps (Chef médial)",
    instructions: "DESCRIPTION DE L'EXERCICE\nLe kickback est un exercice d'isolation très efficace pour finir les triceps et les sculpter. Il cible particulièrement le chef externe du triceps.\n\n1. Buste penché à l'horizontal, un genou et une main sur un banc pour le support, un haltère dans la main libre.\n2. Remontez le coude à la hauteur de la hanche (coude fléchi à 90°), puis tendez complètement le bras vers l'arrière.\n3. Contrôlez le retour à 90° sans descendre le coude.\n\nCONSEILS DU COACH\n- Toute la force doit venir du triceps, le coude ne doit pas bouger.\n- La contraction en position haute (bras tendu) est maximale, marquez une pause d'une seconde."
  },
  {
    name: "Dips sur banc",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2000/07/dips-sur-banc-exercice-musculation.gif",
    muscle_group: "Bras - Triceps (Chef long), Bras - Triceps (Chef latéral), Épaules - Faisceau antérieur",
    instructions: "DESCRIPTION DE L'EXERCICE\nLes dips sur banc sont une excellente alternative aux dips aux barres parallèles, permettant de travailler les triceps même sans équipement spécifique.\n\n1. Assis sur le bord d'un banc, mains de chaque côté des hanches, doigts vers l'avant, jambes tendues devant vous.\n2. Descendez le corps en fléchissant les coudes jusqu'à former un angle de 90°.\n3. Remontez en poussant sur les paumes pour tendre les bras.\n\nCONSEILS DU COACH\n- Gardez le dos proche du banc tout au long du mouvement.\n- Pour augmenter la difficulté, surélevez les pieds sur un autre banc ou ajoutez des poids sur les cuisses."
  },

  // ─── JAMBES ───────────────────────────────────────────────────────────────
  {
    name: "Leg Press à la machine",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2021/08/leg-press.gif",
    muscle_group: "Jambes - Quadriceps, Jambes - Fessiers, Jambes - Ischio-jambiers",
    instructions: "DESCRIPTION DE L'EXERCICE\nLa presse à cuisses (leg press) est le meilleur exercice de musculation de la jambe après le squat. Elle permet de travailler en toute sécurité avec des charges très lourdes.\n\n1. Assis dans la machine, pieds sur la plateforme à largeur d'épaules (mi-hauteur). Dos et tête en appui contre le dossier.\n2. Décollez la charge en déverrouillant les butées de sécurité.\n3. Fléchissez les genoux pour descendre la plateforme jusqu'à un angle de 90° (ou un peu plus), sans que vos fesses ne décollent du siège.\n4. Poussez fort pour revenir à la position initiale sans verrouiller les genoux.\n\nCONSEILS DU COACH\n- Ne verrouillez JAMAIS les genoux en extension complète (risque de blessure).\n- Un placement haut des pieds cible davantage les fessiers/ischio ; un placement bas cible les quadriceps.\n- Ne laissez pas les genoux rentrer vers l'intérieur."
  },
  {
    name: "Hip Thrust à la barre (Développé des fessiers)",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2021/08/hip-thrust-barre.gif",
    muscle_group: "Jambes - Fessiers, Jambes - Ischio-jambiers",
    instructions: "DESCRIPTION DE L'EXERCICE\nLe hip thrust est THE exercice numéro 1 pour le développement des fessiers. Il permet une activation maximale des grand, moyen et petit fessiers sur une amplitude de mouvement complète.\n\n1. Dos appuyé sur le bord d'un banc (mi-dos), barre sur les hanches (avec protection mousse), pieds à plat au sol largeur d'épaules.\n2. Descendez les hanches vers le sol (elles ne doivent pas toucher le sol).\n3. Poussez sur vos talons pour soulever les hanches jusqu'à ce que votre corps forme une ligne droite, en serrant fort les fessiers en haut.\n4. Contrôlez la descente.\n\nCONSEILS DU COACH\n- Vos tibias doivent être perpendiculaires au sol en position haute.\n- Maintenez la contraction des fessiers une seconde en haut de chaque répétition.\n- Regardez vers l'avant, pas vers le plafond, pour maintenir une position neutre du cou."
  },
  {
    name: "Squat avant à la barre (Front Squat)",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2022/01/front-squat-barre.gif",
    muscle_group: "Jambes - Quadriceps, Jambes - Fessiers, Dos - Lombaires",
    instructions: "DESCRIPTION DE L'EXERCICE\nLe squat avant (front squat) avec la barre devant les épaules cible davantage les quadriceps que le squat arrière classique, tout en sollicitant moins les lombaires.\n\n1. Placez la barre sur la face avant de vos épaules, coudes hauts (prise frontale ou bras croisés). Pieds à largeur d'épaules, orteils légèrement sortis.\n2. Descendez en fléchissant les genoux et les hanches, en maintenant le buste droit et les coudes hauts.\n3. Descendez jusqu'à ce que vos cuisses soient au moins parallèles au sol, puis remontez fort.\n\nCONSEILS DU COACH\n- Cet exercice exige plus de mobilité de cheville et de poignet que le squat arrière.\n- Gardez les coudes hauts : si ils tombent, vous perdez la barre.\n- Excellent exercice pour renforcer le bas du dos et améliorer la posture."
  },
  {
    name: "Squat sumo à la barre",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2022/01/squat-sumo-barre.gif",
    muscle_group: "Jambes - Fessiers, Jambes - Quadriceps, Jambes - Ischio-jambiers",
    instructions: "DESCRIPTION DE L'EXERCICE\nLe squat sumo se caractérise par un écartement large des pieds et des orteils très tournés vers l'extérieur. Il cible davantage les fessiers, les adducteurs et l'intérieur des cuisses.\n\n1. Pieds très écartés (plus large que les épaules), orteils tournés à 45° vers l'extérieur, barre sur le haut des trapèzes.\n2. Descendez en poussant les genoux dans la direction des orteils, en gardant le buste droit.\n3. Remontez en contractant fort les fessiers et les adducteurs.\n\nCONSEILS DU COACH\n- Si vous avez des difficultés de mobilité des hanches, le squat sumo peut être plus confortable que le squat classique.\n- Attention à bien faire suivre les genoux dans l'axe des pieds."
  },
  {
    name: "Leg Curl couché à la machine",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2000/01/leg-curl-couche-exercice-musculation.gif",
    muscle_group: "Jambes - Ischio-jambiers",
    instructions: "DESCRIPTION DE L'EXERCICE\nLe leg curl couché (lying leg curl) est l'exercice d'isolation par excellence pour les ischio-jambiers (biceps fémoraux, semi-tendineux, semi-membraneux).\n\n1. Allongé face vers le bas sur la machine, tibias sous le coussin de résistance, mains sur les poignées.\n2. Fléchissez les genoux pour ramener le coussin vers les fessiers, en contractant fort les ischio-jambiers.\n3. Revenez à la position initiale en contrôlant bien la descente.\n\nCONSEILS DU COACH\n- Gardez les hanches en appui sur le coussin, ne les soulevez pas lors de la montée.\n- Effectuez le mouvement de manière lente et contrôlée pour maximiser le temps sous tension."
  },
  {
    name: "Extension quadriceps à la machine (Leg Extension)",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2000/01/leg-extension-exercice-musculation.gif",
    muscle_group: "Jambes - Quadriceps",
    instructions: "DESCRIPTION DE L'EXERCICE\nLa leg extension est l'exercice d'isolation par excellence pour les quadriceps. Elle complète parfaitement le squat et la presse en ciblant chaque faisceau des quadriceps.\n\n1. Assis sur la machine, chevilles sous le coussin de résistance, genoux au bord du siège.\n2. Tendez les jambes complètement en contractant fort les quadriceps au sommet du mouvement.\n3. Redescendez lentement sans laisser les poids toucher la pile.\n\nCONSEILS DU COACH\n- Maintenez la contraction 1 seconde en haut pour maximiser le travail musculaire.\n- Cet exercice peut provoquer une tension sur les ligaments du genou si la charge est trop lourde ou le mouvement trop rapide. Restez prudent."
  },
  {
    name: "Fentes inversées (Split Squat)",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2021/11/fentes-inversees.gif",
    muscle_group: "Jambes - Quadriceps, Jambes - Fessiers",
    instructions: "DESCRIPTION DE L'EXERCICE\nLes fentes inversées sont une variante des fentes avant dans laquelle la jambe active (avant) reste fixe et c'est la jambe arrière qui recule. Elles sont plus stables et plus faciles à maîtriser que les fentes avant marchées.\n\n1. Debout, pieds à largeur de hanches, les bras le long du corps ou mains sur les hanches.\n2. Faites un grand pas en arrière avec une jambe et descendez le genou arrière vers le sol.\n3. Remontez en poussant avec la jambe avant, puis ramenez le pied arrière à la position initiale.\n\nCONSEILS DU COACH\n- La majorité du poids doit être sur la jambe avant.\n- Gardez le buste droit tout au long du mouvement.\n- Excellent exercice de gainage pour les débutants avant de passer aux fentes marchées."
  },
  {
    name: "Bulgarian Split Squat",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2022/01/bulgarian-split-squat.gif",
    muscle_group: "Jambes - Quadriceps, Jambes - Fessiers, Jambes - Ischio-jambiers",
    instructions: "DESCRIPTION DE L'EXERCICE\nLe Bulgarian Split Squat (squat fendu bulgare) est l'un des exercices unilatéraux les plus efficaces pour développer la force et la masse des jambes.\n\n1. Debout, dos à un banc, une jambe (le pied) posée derrière vous sur le banc, l'autre jambe bien avancée devant.\n2. Descendez en fléchissant le genou avant pour que votre cuisse avant soit parallèle au sol.\n3. Remontez en poussant fort avec le talon de la jambe avant.\n\nCONSEILS DU COACH\n- Peut être réalisé avec des haltères, une barre ou au poids de corps.\n- La jambe avant fait tout le travail, la jambe arrière sert uniquement à l'équilibre.\n- Attendez-vous à de sévères courbatures les premiers jours !"
  },

  // ─── MOLLETS ─────────────────────────────────────────────────────────────
  {
    name: "Élévations des mollets debout (Standing Calf Raise)",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2000/01/elevation-mollets-debout-exercice-musculation.gif",
    muscle_group: "Jambes - Mollets",
    instructions: "DESCRIPTION DE L'EXERCICE\nL'élévation de mollets debout est l'exercice de base pour développer le volume et la force du mollet (gastrocnémien).\n\n1. Debout sur le bord d'une marche ou d'un step, pieds à largeur d'épaules, talons dans le vide.\n2. Descendez les talons sous le niveau du step pour étirer complètement les mollets.\n3. Montez sur la pointe des pieds le plus haut possible en contractant fort les mollets.\n4. Contrôlez la descente lentement.\n\nCONSEILS DU COACH\n- Gardez les genoux légèrement fléchis pour éviter le blocage de l'articulation.\n- L'amplitude complète (descente sous le step) est la clé pour progresser sur les mollets.\n- Peut être fait avec des haltères, une barre ou au poids de corps."
  },
  {
    name: "Élévations des mollets assis à la machine",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2000/01/elevation-mollets-assis-exercice-musculation.gif",
    muscle_group: "Jambes - Mollets",
    instructions: "DESCRIPTION DE L'EXERCICE\nL'élévation de mollets assis à la machine cible principalement le soléaire (le muscle sous-jacent du mollet), qui est mieux sollicité genou fléchi.\n\n1. Assis sur la machine, coussin de résistance posé sur les genoux, pointes des pieds sur le support, talons dans le vide.\n2. Laissez les talons descendre pour étirer les mollets complètement.\n3. Montez sur la pointe des pieds le plus haut possible et maintenez une seconde.\n\nCONSEILS DU COACH\n- Le soléaire a plus d'endurance que le gastrocnémien ; n'hésitez pas à faire des séries longues (15-20 reps).\n- Amplitude complète obligatoire pour progresser."
  },
  {
    name: "Sauts à la corde",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2000/01/sauts-corde-exercice-musculation.gif",
    muscle_group: "Jambes - Mollets, Jambes - Quadriceps, Abdominaux",
    instructions: "DESCRIPTION DE L'EXERCICE\nLes sauts à la corde sont un exercice cardio et fonctionnel redoutable qui développe les mollets, améliore la coordination et le cardio.\n\n1. Tenez les poignées de la corde à chaque main, corde derrière vous.\n2. Faites tourner la corde par-dessus votre tête et sautez légèrement lorsqu'elle arrive à vos pieds.\n3. Rebondissez sur la pointe des pieds de manière continue.\n\nCONSEILS DU COACH\n- Commencez lentement pour maîtriser la coordination.\n- Les sauts doivent être minimalistes (juste assez pour laisser passer la corde).\n- Excellent pour les séances de cardio ou en échauffement."
  },

  // ─── ABDOMINAUX ──────────────────────────────────────────────────────────
  {
    name: "Planche (Gainage ventral)",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2000/01/gainage-planche-exercice-musculation.gif",
    muscle_group: "Abdominaux - Transverse, Abdominaux - Grand droit, Épaules - Faisceau antérieur",
    instructions: "DESCRIPTION DE L'EXERCICE\nLa planche (plank) est l'exercice de gainage fondamental. Elle renforce le muscle transverse de l'abdomen, véritable ceinture naturelle protégeant le dos.\n\n1. Allongé face au sol, appuyez-vous sur les avant-bras (coudes sous les épaules) et la pointe des pieds.\n2. Décollez le bassin pour former une ligne parfaitement droite de la tête aux talons.\n3. Contractez fort les abdominaux, les fessiers et les quadriceps pour maintenir la position.\n\nCONSEILS DU COACH\n- Respirez normalement, ne retenez pas votre respiration.\n- Ne laissez pas les hanches monter (fesses en l'air) ni descendre (hanches qui s'affaissent).\n- La qualité de la position prime sur la durée."
  },
  {
    name: "Russian Twist (Rotations du buste)",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2000/09/russian-twist-exercice-musculation-abdominaux.gif",
    muscle_group: "Abdominaux - Grand droit, Abdominaux - Transverse",
    instructions: "DESCRIPTION DE L'EXERCICE\nLe Russian Twist est un exercice efficace pour travailler la rotation du tronc et solliciter les muscles obliques et le grand droit.\n\n1. Assis sur le sol, dos légèrement incliné en arrière (à 45°), jambes fléchies ou surélevées (plus difficile).\n2. Tenez un haltère, une médecine-ball ou joignez les mains devant vous.\n3. Tournez le buste d'un côté à l'autre en alternance, en contrôlant le mouvement.\n\nCONSEILS DU COACH\n- La rotation doit provenir du tronc, pas des épaules.\n- Plus les pieds sont surélevés, plus l'exercice est difficile.\n- Gardez le dos droit, ne vous voûtez pas."
  },
  {
    name: "Crunch à la machine",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2000/01/crunch-machine-exercice-musculation.gif",
    muscle_group: "Abdominaux - Grand droit",
    instructions: "DESCRIPTION DE L'EXERCICE\nLe crunch à la machine permet d'effectuer des crunchs avec une résistance progressive (charge), idéal pour ceux qui ont besoin de surcharger progressivement leurs abdominaux.\n\n1. Assis sur la machine, mains sur les poignées (ou bras croisés sur le coussin), pieds sous le coussin de résistance des tibias.\n2. Contractez les abdominaux pour enrouler le buste vers les cuisses en simultané.\n3. Contrôlez le retour à la position initiale sans relâcher complètement la tension.\n\nCONSEILS DU COACH\n- Soufflez à la contraction (quand vous enroulez le buste).\n- Ne tirez pas avec les bras pour aider, l'effort doit venir uniquement des abdominaux."
  },
  {
    name: "Mountain Climbers (Grimpeur de montagne)",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2000/01/mountain-climbers-exercice-musculation.gif",
    muscle_group: "Abdominaux - Grand droit, Abdominaux - Fléchisseurs de hanche, Jambes - Quadriceps",
    instructions: "DESCRIPTION DE L'EXERCICE\nLes mountain climbers sont un exercice dynamique de gainage qui combine le travail cardiovasculaire et le renforcement abdominal.\n\n1. En position de pompe haute (bras tendus), corps aligné.\n2. Ramenez un genou rapidement vers votre poitrine, puis replacez-le.\n3. Alternez rapidement les deux jambes dans un mouvement de course.\n\nCONSEILS DU COACH\n- Gardez les hanches basses (ne sautillez pas avec les fesses en l'air).\n- Plus vous allez vite, plus l'aspect cardio est important.\n- Excellent exercice pour les circuits training ou en fin de séance."
  },
  {
    name: "Ab Wheel (Roue abdominale)",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2000/01/roue-abdominale-exercice-musculation.gif",
    muscle_group: "Abdominaux - Grand droit, Abdominaux - Transverse, Dos - Lombaires",
    instructions: "DESCRIPTION DE L'EXERCICE\nLa roue abdominale (ab wheel) est l'un des exercices les plus difficiles et les plus efficaces pour renforcer l'intégralité de la sangle abdominale. À réserver aux pratiquants intermédiaires et avancés.\n\n1. À genoux, tenez la roue devant vous, bras tendus.\n2. Roulez lentement la roue vers l'avant en vous allongeant vers le sol, le plus loin possible sans toucher le sol.\n3. Contractez fort les abdominaux pour revenir à la position initiale en tirant la roue vers vous.\n\nCONSEILS DU COACH\n- Ne laissez pas le bas du dos se creuser excessivement lors de l'extension.\n- Commencez par de courtes amplitudes et progressez au fur et à mesure.\n- Mouvement ultra exigeant, évitez si vous avez des douleurs lombaires."
  },

  // ─── EXERCICES FONCTIONNELS / FULL BODY ──────────────────────────────────
  {
    name: "Burpees",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2000/01/burpee-exercice-musculation.gif",
    muscle_group: "Jambes - Quadriceps, Jambes - Fessiers, Pectoraux - Portion moyenne, Abdominaux - Grand droit",
    instructions: "DESCRIPTION DE L'EXERCICE\nLe burpee est un exercice full-body par excellence qui combine force, cardio et coordination. Très utilisé en HIIT (High Intensity Interval Training).\n\n1. Debout, descendez en position accroupie et posez les mains au sol.\n2. D'un saut, repoussez les pieds vers l'arrière pour vous retrouver en position de pompe.\n3. Effectuez une pompe (facultatif selon le niveau).\n4. Ramenez les pieds vers les mains en sautant et redressez-vous.\n5. Terminez en sautant vers le haut avec les bras tendus.\n\nCONSEILS DU COACH\n- Gardez le dos plat en position de pompe.\n- Le burpee peut être simplifié (sans saut, sans pompe) ou complexifié (avec jump squat en fin de mouvement)."
  },
  {
    name: "Kettlebell Swing",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2022/01/kettlebell-swing.gif",
    muscle_group: "Jambes - Fessiers, Jambes - Ischio-jambiers, Dos - Lombaires, Abdominaux - Transverse",
    instructions: "DESCRIPTION DE L'EXERCICE\nLe kettlebell swing est un exercice balistique fondamental qui renforce la chaîne postérieure complète et améliore la puissance explosive des hanches.\n\n1. Debout, pieds légèrement plus larges que les épaules, kettlebell entre les pieds.\n2. Saisissez la kettlebell à deux mains, dos plat, genoux légèrement fléchis.\n3. Balancez la kettlebell vers l'arrière entre vos jambes, puis projetez-la vers l'avant en poussant explosément les hanches.\n4. Laissez la kettlebell monter jusqu'à la hauteur des épaules, puis contrôlez la descente et recommencez.\n\nCONSEILS DU COACH\n- Ce n'est PAS un squat : le mouvement vient de la poussée des hanches, pas de la flexion des genoux.\n- Contractez fort les fessiers en haut du mouvement.\n- Gardez les bras relâchés, la force vient des hanches."
  },
  {
    name: "Box Jump (Saut sur boîte)",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2022/01/box-jump.gif",
    muscle_group: "Jambes - Quadriceps, Jambes - Fessiers, Jambes - Mollets",
    instructions: "DESCRIPTION DE L'EXERCICE\nLe box jump est un exercice pliométrique qui développe la puissance explosive des membres inférieurs. Il améliore la détente verticale et l'activation neuromusculaire.\n\n1. Debout face à une boîte ou un step solide, pieds à largeur d'épaules.\n2. Fléchissez légèrement les genoux et les hanches, puis sautez de manière explosive sur la boîte.\n3. Atterrissez en douceur avec les deux pieds, genoux fléchis, en absorbant l'impact.\n4. Descendez de la boîte en marche (ne sautez pas en bas pour éviter les blessures).\n\nCONSEILS DU COACH\n- Choisissez une hauteur de boîte adaptée à votre niveau.\n- L'atterrissage doit être silencieux et contrôlé.\n- Pas idéal si vous avez des douleurs aux genoux."
  }
];

async function run() {
  console.log("Checking and inserting new exercises...");

  // Fetch existing exercises from DB to prevent duplicates
  const { data: existing, error: fetchErr } = await supabase
    .from('exercises')
    .select('name');

  if (fetchErr) {
    console.error("Error fetching existing exercises:", fetchErr);
    process.exit(1);
  }

  const existingNames = new Set(existing.map(e => e.name.toLowerCase().trim()));
  const toInsert = newExercises.filter(ex => !existingNames.has(ex.name.toLowerCase().trim()));

  if (toInsert.length === 0) {
    console.log("All exercises already exist in the database!");
    process.exit(0);
  }

  console.log(`Inserting ${toInsert.length} new exercises...`);
  console.log("Exercises to insert:", toInsert.map(e => e.name).join(', '));

  const { error: insertErr } = await supabase
    .from('exercises')
    .insert(toInsert);

  if (insertErr) {
    console.error("Error inserting exercises:", insertErr);
    process.exit(1);
  }

  console.log(`\n✅ Successfully inserted ${toInsert.length} new exercises!`);
}

run();
