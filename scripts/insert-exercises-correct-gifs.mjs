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

// GIF URLs obtained directly from docteur-fitness.com pages
// by reading the img src attribute (equivalent to right-click > copy image address)
const newExercises = [

  // ─── BRAS - BICEPS ────────────────────────────────────────────────────────
  {
    name: "Curl biceps barre",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2021/09/curl-barre.gif",
    muscle_group: "Bras - Biceps (Portion courte), Bras - Biceps (Portion longue)",
    instructions: "DESCRIPTION DE L'EXERCICE\nLe curl barre est l'exercice de référence pour développer la masse du biceps. Il permet de charger lourd et d'augmenter la force globale des bras.\n\n1. Debout, saisissez la barre avec une prise supination (paumes vers le haut), largeur d'épaules.\n2. Gardez les coudes fixes le long du corps et fléchissez les bras pour monter la barre vers les épaules.\n3. Contractez fort en haut puis redescendez lentement.\n\nCONSEILS DU COACH\n- Évitez de balancer le corps pour aider à monter la barre (triche).\n- Utilisez une barre EZ pour réduire le stress sur les poignets si nécessaire.\n- Gardez les coudes fixes le long du corps tout au long du mouvement."
  },
  {
    name: "Curl marteau (Hammer Curl)",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2022/09/curl-haltere-prise-neutre.gif",
    muscle_group: "Bras - Biceps (Portion longue), Bras - Avant-bras",
    instructions: "DESCRIPTION DE L'EXERCICE\nLe curl marteau (hammer curl) cible le brachial et le brachio-radial (avant-bras), en plus de la longue portion du biceps. Essentiel pour avoir des bras complets et épais.\n\n1. Debout, haltères en main avec une prise neutre (paumes vers l'intérieur), bras tendus le long du corps.\n2. Fléchissez les coudes pour monter les haltères sans changer la position des poignets (prise neutre maintenue).\n3. Contrôlez la descente lentement.\n\nCONSEILS DU COACH\n- Excellent complément au curl classique pour épaissir les bras.\n- Peut être fait simultanément ou en alternance.\n- Ne laissez pas les coudes bouger vers l'avant."
  },
  {
    name: "Curl biceps haltères alterné",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2022/08/curl-biceps-avec-halteres-alterne.gif",
    muscle_group: "Bras - Biceps (Portion courte), Bras - Biceps (Portion longue), Bras - Avant-bras",
    instructions: "DESCRIPTION DE L'EXERCICE\nLe curl haltères alterné permet de travailler chaque bras indépendamment et de mieux contrôler la contraction du biceps.\n\n1. Debout, un haltère dans chaque main bras tendus le long du corps, paumes vers l'intérieur.\n2. Fléchissez un bras en supinant le poignet (paume vers le haut) lors de la montée, contractez fort le biceps en haut.\n3. Redescendez contrôlé et recommencez avec l'autre bras.\n\nCONSEILS DU COACH\n- Gardez les coudes fixes le long du corps, ils ne doivent pas avancer pendant la montée.\n- La supination (rotation du poignet) maximise le recrutement des fibres du biceps."
  },

  // ─── BRAS - TRICEPS ───────────────────────────────────────────────────────
  {
    name: "Extension triceps assis au-dessus de la tête",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2022/12/extensions-des-triceps-assis-avec-haltere.gif",
    muscle_group: "Bras - Triceps (Chef long), Bras - Triceps (Chef médial)",
    instructions: "DESCRIPTION DE L'EXERCICE\nL'extension triceps assis au-dessus de la tête cible particulièrement le chef long du triceps, qui est le plus grand des trois faisceaux. Cet angle permet un étirement complet du muscle.\n\n1. Assis sur un banc avec le dossier droit, tenez un haltère à deux mains au-dessus de votre tête, bras tendus.\n2. Pliez les coudes pour descendre l'haltère derrière la nuque en gardant les coudes pointés vers le plafond.\n3. Remontez en tendant les bras et en contractant fort les triceps.\n\nCONSEILS DU COACH\n- Gardez les coudes fixes et rapprochés de la tête tout au long du mouvement.\n- Ne laissez pas les coudes s'écarter, c'est la principale erreur technique.\n- Idéal pour l'étirement maximal du chef long."
  },
  {
    name: "Kickback triceps haltère",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2021/09/kickback.gif",
    muscle_group: "Bras - Triceps (Chef latéral), Bras - Triceps (Chef médial)",
    instructions: "DESCRIPTION DE L'EXERCICE\nLe kickback est un exercice d'isolation très efficace pour finir les triceps et les sculpter. Il cible particulièrement le chef externe du triceps.\n\n1. Buste penché à l'horizontal, un genou et une main sur un banc pour le support, un haltère dans la main libre.\n2. Remontez le coude à la hauteur de la hanche (coude fléchi à 90°), puis tendez complètement le bras vers l'arrière.\n3. Contrôlez le retour à 90° sans descendre le coude.\n\nCONSEILS DU COACH\n- Toute la force doit venir du triceps, le coude ne doit pas bouger.\n- La contraction en position haute (bras tendu) est maximale, marquez une pause d'une seconde."
  },
  {
    name: "Dips sur banc",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2021/09/dips-sur-banc.gif",
    muscle_group: "Bras - Triceps (Chef long), Bras - Triceps (Chef latéral), Épaules - Faisceau antérieur",
    instructions: "DESCRIPTION DE L'EXERCICE\nLes dips sur banc sont une excellente alternative aux dips aux barres parallèles, permettant de travailler les triceps même sans équipement spécifique.\n\n1. Assis sur le bord d'un banc, mains de chaque côté des hanches, doigts vers l'avant, jambes tendues devant vous.\n2. Descendez le corps en fléchissant les coudes jusqu'à former un angle de 90°.\n3. Remontez en poussant sur les paumes pour tendre les bras.\n\nCONSEILS DU COACH\n- Gardez le dos proche du banc tout au long du mouvement.\n- Pour augmenter la difficulté, surélevez les pieds sur un autre banc ou ajoutez des poids sur les cuisses."
  },

  // ─── ÉPAULES ──────────────────────────────────────────────────────────────
  {
    name: "Arnold Press (Développé Arnold)",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2000/08/developpe-arnold-exercice-musculation.gif",
    muscle_group: "Épaules - Faisceau antérieur, Épaules - Faisceau moyen, Épaules - Faisceau postérieur, Triceps",
    instructions: "DESCRIPTION DE L'EXERCICE\nL'Arnold Press (inventé par Arnold Schwarzenegger) est une variante du développé épaules qui sollicite les trois faisceaux du deltoïde sur une amplitude de rotation complète.\n\n1. Assis sur un banc droit, tenez deux haltères devant vous à hauteur des épaules, paumes vers vous (comme à la fin d'un curl).\n2. En poussant les haltères vers le haut, effectuez simultanément une rotation des poignets de 180° pour finir avec les paumes vers l'avant, bras tendus.\n3. Redescendez en inversant le mouvement de rotation.\n\nCONSEILS DU COACH\n- Mouvement fluide et continu, sans à-coups.\n- Idéal pour compléter le travail des épaules après le développé militaire classique."
  },
  {
    name: "Développé épaules haltères assis",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2022/02/developpe-epaule-halteres.gif",
    muscle_group: "Épaules - Faisceau antérieur, Épaules - Faisceau moyen, Triceps",
    instructions: "DESCRIPTION DE L'EXERCICE\nLe développé épaules assis avec haltères est une alternative au développé militaire barre, offrant une amplitude de mouvement plus naturelle et indépendante pour chaque bras.\n\n1. Assis sur un banc avec le dossier incliné à 90°, tenez les haltères à la hauteur des épaules, coudes fléchis.\n2. Poussez les haltères vers le haut en les rapprochant légèrement (sans les toucher) jusqu'à avoir les bras quasiment tendus.\n3. Contrôlez le retour jusqu'à la position de départ.\n\nCONSEILS DU COACH\n- Ne verrouillez pas complètement les coudes en haut pour maintenir la tension.\n- Gardez le dos en appui contre le dossier du banc tout au long du mouvement."
  },

  // ─── DOS ──────────────────────────────────────────────────────────────────
  {
    name: "Soulevé de terre conventionnel",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2021/11/souleve-de-terre-deadlift.gif",
    muscle_group: "Dos - Lombaires, Dos - Grand dorsal, Dos - Trapèzes, Jambes - Ischio-jambiers, Jambes - Fessiers",
    instructions: "DESCRIPTION DE L'EXERCICE\nLe soulevé de terre est LE mouvement fondamental de force. Il sollicite la quasi-totalité des muscles du corps, de la chaîne postérieure aux membres supérieurs.\n\n1. Debout, pieds à largeur de bassin sous la barre, orteils légèrement sortis.\n2. Saisissez la barre en pronation (ou prise mixte) juste à l'extérieur de vos genoux. Dos plat, poitrine sortie, regard droit devant.\n3. Poussez le sol avec vos pieds et montez la barre le long des tibias.\n4. Redressez-vous complètement en contractant les fessiers et le dos. Redescendez de manière contrôlée.\n\nCONSEILS DU COACH\n- Ne jamais arrondir le bas du dos. C'est la règle numéro 1.\n- Contractez les abdominaux comme si vous alliez recevoir un coup dans le ventre.\n- Gardez la barre le plus proche possible du corps tout au long du mouvement."
  },
  {
    name: "Rowing haltères buste penché",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2022/10/bent-over-row-avec-halteres.gif",
    muscle_group: "Dos - Grand dorsal, Dos - Grand rond & coiffe, Biceps",
    instructions: "DESCRIPTION DE L'EXERCICE\nLe rowing haltères buste penché est un excellent exercice pour développer l'épaisseur du dos tout en corrigeant les déséquilibres entre les deux côtés.\n\n1. Debout, penchez le buste en avant à 45 degrés, dos bien plat, un haltère dans chaque main bras tendus.\n2. Tirez les haltères vers vos hanches en rentrant les coudes près du corps et en contractant fort le dorsal.\n3. Redescendez les haltères lentement en contrôlant l'étirement.\n\nCONSEILS DU COACH\n- Évitez de rouler les épaules lors de la montée.\n- Concentrez-vous sur les coudes qui montent, pas sur les mains.\n- Gardez le dos parfaitement plat tout au long du mouvement."
  },
  {
    name: "Tirage vertical prise serrée",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2021/08/tirage-vertical-prise-serree.gif",
    muscle_group: "Dos - Grand dorsal, Biceps - Portion courte, Dos - Trapèzes",
    instructions: "DESCRIPTION DE L'EXERCICE\nLe tirage vertical prise serrée (mains rapprochées) est une variante du tirage vertical classique permettant de mieux isoler le grand dorsal et de réduire le stress sur les épaules.\n\n1. Assis à la machine, saisissez la barre avec une prise pronation serrée (mains espacées de 20-30 cm).\n2. Tirez vers le haut de la poitrine en expirant, en serrant fort les omoplates en bas de chaque répétition.\n3. Contrôlez le retour bras tendus pour étirer pleinement le dorsal.\n\nCONSEILS DU COACH\n- Initiez le mouvement avec les coudes (pas les mains) pour mieux recruter le dorsal.\n- Conservez un léger cambré et la poitrine bien sortie tout au long du mouvement."
  },
  {
    name: "Extension lombaires au banc romain",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2000/03/extension-lombaires-banc-romain-exercice-musculation.gif",
    muscle_group: "Dos - Lombaires, Jambes - Fessiers, Jambes - Ischio-jambiers",
    instructions: "DESCRIPTION DE L'EXERCICE\nL'extension lombaire au banc romain (ou hyperextension) est le meilleur exercice d'isolation pour renforcer les muscles érecteurs du rachis (lombaires).\n\n1. Placez-vous sur le banc romain (cavaletti), pieds bloqués sous les coussinets, hanches au bord du support.\n2. Croisez les bras sur la poitrine ou derrière la tête. Laissez le buste descendre lentement vers le bas.\n3. Relevez le buste jusqu'à ce que votre corps forme une ligne droite (ne vous cambrez pas en arrière).\n\nCONSEILS DU COACH\n- Ne dépassez pas la ligne droite en remontant pour éviter de compresser les vertèbres.\n- Pour augmenter la difficulté, tenez un disque contre la poitrine.\n- Mouvement lent et contrôlé, sans élan."
  },

  // ─── JAMBES ───────────────────────────────────────────────────────────────
  {
    name: "Leg Press à la machine",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2022/08/presse-a-cuisses-inclinee.gif",
    muscle_group: "Jambes - Quadriceps, Jambes - Fessiers, Jambes - Ischio-jambiers",
    instructions: "DESCRIPTION DE L'EXERCICE\nLa presse à cuisses (leg press) est le meilleur exercice de musculation de la jambe après le squat. Elle permet de travailler en toute sécurité avec des charges très lourdes.\n\n1. Assis dans la machine, pieds sur la plateforme à largeur d'épaules (mi-hauteur). Dos et tête en appui contre le dossier.\n2. Décollez la charge en déverrouillant les butées de sécurité.\n3. Fléchissez les genoux pour descendre la plateforme jusqu'à un angle de 90° (ou un peu plus), sans que vos fesses ne décollent du siège.\n4. Poussez fort pour revenir à la position initiale sans verrouiller les genoux.\n\nCONSEILS DU COACH\n- Ne verrouillez JAMAIS les genoux en extension complète (risque de blessure).\n- Un placement haut des pieds cible davantage les fessiers/ischio ; un placement bas cible les quadriceps.\n- Ne laissez pas les genoux rentrer vers l'intérieur."
  },
  {
    name: "Hip Thrust à la barre",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2021/12/hips-thrust.gif",
    muscle_group: "Jambes - Fessiers, Jambes - Ischio-jambiers",
    instructions: "DESCRIPTION DE L'EXERCICE\nLe hip thrust est THE exercice numéro 1 pour le développement des fessiers. Il permet une activation maximale des grand, moyen et petit fessiers sur une amplitude de mouvement complète.\n\n1. Dos appuyé sur le bord d'un banc (mi-dos), barre sur les hanches (avec protection mousse), pieds à plat au sol largeur d'épaules.\n2. Descendez les hanches vers le sol.\n3. Poussez sur vos talons pour soulever les hanches jusqu'à ce que votre corps forme une ligne droite, en serrant fort les fessiers en haut.\n4. Contrôlez la descente.\n\nCONSEILS DU COACH\n- Vos tibias doivent être perpendiculaires au sol en position haute.\n- Maintenez la contraction des fessiers une seconde en haut de chaque répétition.\n- Regardez vers l'avant, pas vers le plafond."
  },
  {
    name: "Leg Curl allongé à la machine",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2021/10/leg-curl-allonge.gif",
    muscle_group: "Jambes - Ischio-jambiers",
    instructions: "DESCRIPTION DE L'EXERCICE\nLe leg curl allongé (lying leg curl) est l'exercice d'isolation par excellence pour les ischio-jambiers (biceps fémoraux, semi-tendineux, semi-membraneux).\n\n1. Allongé face vers le bas sur la machine, tibias sous le coussin de résistance, mains sur les poignées.\n2. Fléchissez les genoux pour ramener le coussin vers les fessiers, en contractant fort les ischio-jambiers.\n3. Revenez à la position initiale en contrôlant bien la descente.\n\nCONSEILS DU COACH\n- Gardez les hanches en appui sur le coussin, ne les soulevez pas lors de la montée.\n- Effectuez le mouvement de manière lente et contrôlée pour maximiser le temps sous tension."
  },
  {
    name: "Leg Extension à la machine",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2021/09/leg-extension.gif",
    muscle_group: "Jambes - Quadriceps",
    instructions: "DESCRIPTION DE L'EXERCICE\nLa leg extension est l'exercice d'isolation par excellence pour les quadriceps. Elle complète parfaitement le squat et la presse en ciblant chaque faisceau des quadriceps.\n\n1. Assis sur la machine, chevilles sous le coussin de résistance, genoux au bord du siège.\n2. Tendez les jambes complètement en contractant fort les quadriceps au sommet du mouvement.\n3. Redescendez lentement sans laisser les poids toucher la pile.\n\nCONSEILS DU COACH\n- Maintenez la contraction 1 seconde en haut pour maximiser le travail musculaire.\n- Cet exercice peut provoquer une tension sur les ligaments du genou si la charge est trop lourde ou le mouvement trop rapide. Restez prudent."
  },
  {
    name: "Squat bulgare aux haltères (Bulgarian Split Squat)",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2000/06/squat-bulgare-halteres-exercice-musculation.gif",
    muscle_group: "Jambes - Quadriceps, Jambes - Fessiers, Jambes - Ischio-jambiers",
    instructions: "DESCRIPTION DE L'EXERCICE\nLe Bulgarian Split Squat (squat fendu bulgare) est l'un des exercices unilatéraux les plus efficaces pour développer la force et la masse des jambes.\n\n1. Debout, dos à un banc, une jambe (le pied) posée derrière vous sur le banc, l'autre jambe bien avancée devant. Haltères dans les mains.\n2. Descendez en fléchissant le genou avant pour que votre cuisse avant soit parallèle au sol.\n3. Remontez en poussant fort avec le talon de la jambe avant.\n\nCONSEILS DU COACH\n- La jambe avant fait tout le travail, la jambe arrière sert uniquement à l'équilibre.\n- Attendez-vous à de sévères courbatures les premiers jours !\n- Gardez le buste droit tout au long du mouvement."
  },
  {
    name: "Fentes inversées avec Landmine",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2022/04/fentes-arriere-landmine.gif",
    muscle_group: "Jambes - Quadriceps, Jambes - Fessiers",
    instructions: "DESCRIPTION DE L'EXERCICE\nLes fentes inversées avec landmine sont une variante des fentes arrière avec barre. La landmine guide le mouvement et réduit le stress sur les genoux et les lombaires.\n\n1. Tenez une extrémité de la barre landmine des deux mains devant vous, debout, pieds à largeur de hanches.\n2. Faites un grand pas en arrière avec une jambe et descendez le genou arrière vers le sol jusqu'à former un angle de 90° avec la jambe avant.\n3. Remontez en poussant fort avec la jambe avant et ramenez le pied à la position initiale.\n\nCONSEILS DU COACH\n- La majorité du poids doit être sur la jambe avant.\n- Gardez le buste droit tout au long du mouvement.\n- Excellent exercice pour les débutants avant de passer aux fentes libres."
  },

  // ─── MOLLETS ──────────────────────────────────────────────────────────────
  {
    name: "Extension mollets debout à la machine",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2021/10/extension-mollets-debout-machine.gif",
    muscle_group: "Jambes - Mollets",
    instructions: "DESCRIPTION DE L'EXERCICE\nL'élévation de mollets debout à la machine est l'exercice de base pour développer le volume et la force du mollet (gastrocnémien).\n\n1. Debout dans la machine, épaules sous les coussinets, pieds sur le support, talons dans le vide.\n2. Descendez les talons sous le niveau du support pour étirer complètement les mollets.\n3. Montez sur la pointe des pieds le plus haut possible en contractant fort les mollets.\n4. Contrôlez la descente lentement.\n\nCONSEILS DU COACH\n- L'amplitude complète (descente sous le support) est la clé pour progresser sur les mollets.\n- Maintenez la contraction une seconde en position haute.\n- Mouvement lent et contrôlé pour maximiser le temps sous tension."
  },
  {
    name: "Extension mollets assis à la machine",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2021/10/extension-mollets-assis-machine.gif",
    muscle_group: "Jambes - Mollets",
    instructions: "DESCRIPTION DE L'EXERCICE\nL'élévation de mollets assis à la machine cible principalement le soléaire (le muscle sous-jacent du mollet), qui est mieux sollicité genou fléchi.\n\n1. Assis sur la machine, coussin de résistance posé sur les genoux, pointes des pieds sur le support, talons dans le vide.\n2. Laissez les talons descendre pour étirer les mollets complètement.\n3. Montez sur la pointe des pieds le plus haut possible et maintenez une seconde.\n\nCONSEILS DU COACH\n- Le soléaire a plus d'endurance que le gastrocnémien ; n'hésitez pas à faire des séries longues (15-20 reps).\n- Amplitude complète obligatoire pour progresser.\n- Complément idéal de l'élévation debout."
  },

  // ─── ABDOMINAUX ──────────────────────────────────────────────────────────
  {
    name: "Planche (Gainage ventral)",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2022/05/planche-abdos.gif",
    muscle_group: "Abdominaux - Transverse, Abdominaux - Grand droit, Épaules - Faisceau antérieur",
    instructions: "DESCRIPTION DE L'EXERCICE\nLa planche (plank) est l'exercice de gainage fondamental. Elle renforce le muscle transverse de l'abdomen, véritable ceinture naturelle protégeant le dos.\n\n1. Allongé face au sol, appuyez-vous sur les avant-bras (coudes sous les épaules) et la pointe des pieds.\n2. Décollez le bassin pour former une ligne parfaitement droite de la tête aux talons.\n3. Contractez fort les abdominaux, les fessiers et les quadriceps pour maintenir la position.\n\nCONSEILS DU COACH\n- Respirez normalement, ne retenez pas votre respiration.\n- Ne laissez pas les hanches monter (fesses en l'air) ni descendre (hanches qui s'affaissent).\n- La qualité de la position prime sur la durée."
  },
];

async function run() {
  console.log("Checking and inserting new exercises with correct GIFs...");

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
  console.log("Exercises to insert:", toInsert.map(e => e.name).join('\n  - '));

  const { error: insertErr } = await supabase
    .from('exercises')
    .insert(toInsert);

  if (insertErr) {
    console.error("Error inserting exercises:", insertErr);
    process.exit(1);
  }

  console.log(`\n✅ Successfully inserted ${toInsert.length} new exercises with correct GIFs!`);
}

run();
