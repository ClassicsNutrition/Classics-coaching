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
  {
    name: "Développé incliné haltères",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2021/10/developpe-incline-halteres.gif",
    muscle_group: "Pectoraux - Portion supérieure, Épaules - Faisceau antérieur, Triceps",
    instructions: "Le développé incliné avec haltères cible le haut des pectoraux et l'avant des épaules.\n\n1. Allongez-vous sur un banc incliné à 30-45 degrés, haltères en mains au niveau de la poitrine.\n2. Poussez les haltères verticalement en rapprochant les bras tout en contractant les pectoraux.\n3. Contrôlez la descente lentement jusqu'à ressentir un étirement léger en bas."
  },
  {
    name: "Pull-over avec haltère",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2000/06/pullover-avec-haltere-exercice-musculation.gif",
    muscle_group: "Pectoraux - Portion inférieure, Dos - Grand dorsal, Triceps",
    instructions: "Le pull-over étire la cage thoracique et travaille simultanément le bas des pecs et le grand dorsal.\n\n1. Allongez-vous sur un banc, le haut du dos en appui, fessiers légèrement bas, tenant un haltère à deux mains au-dessus de votre poitrine.\n2. Descendez lentement l'haltère derrière votre tête en gardant les coudes légèrement fléchis.\n3. Ramenez la charge au-dessus de la poitrine sous tension constante en contractant les pecs."
  },
  {
    name: "Tirage vertical poitrine",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2000/01/tirage-poitrine-poulie-haute-exercice-musculation.gif",
    muscle_group: "Dos - Grand dorsal, Dos - Trapèzes, Biceps",
    instructions: "Le tirage vertical poitrine est l'exercice de base pour donner de l'ampleur et de la largeur au dos.\n\n1. Assis à la machine de tirage, bloquez vos genoux et saisissez la barre avec une prise large en pronation.\n2. Tirez la barre vers le haut de votre poitrine en resserrant les omoplates et en tirant les coudes vers le bas et l'arrière.\n3. Contrôlez le retour à la position initiale pour étirer les dorsaux."
  },
  {
    name: "Tirage horizontal poulie basse",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2000/03/tirage-horizontal-poulie-basse-exercice-musculation.gif",
    muscle_group: "Dos - Trapèzes, Dos - Grand dorsal, Biceps",
    instructions: "Le tirage horizontal développe l'épaisseur du dos (trapèzes et grand dorsal).\n\n1. Assis face à la poulie basse, pieds sur les cales, buste bien droit et genoux légèrement fléchis.\n2. Tirez la poignée double vers votre nombril en serrant fortement le dos et en reculant les épaules.\n3. Ramenez lentement les bras tendus sans cambrer le bas du dos."
  },
  {
    name: "Rowing barre buste penché",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2021/11/rowing-barre-buste-penche.gif",
    muscle_group: "Dos - Grand dorsal, Dos - Trapèzes, Biceps",
    instructions: "Un exercice de base pour bâtir de la force et de la masse globale sur le dos.\n\n1. Debout, pieds largeur d'épaules, penchez le buste vers l'avant à 45 degrés avec le dos bien plat.\n2. Saisissez la barre en pronation et tirez-la vers votre nombril en gardant les coudes serrés près du corps.\n3. Contrôlez la descente de la charge."
  },
  {
    name: "Développé militaire à la barre",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2021/11/developpe-militaire-debout-barre.gif",
    muscle_group: "Épaules - Faisceau antérieur, Triceps",
    instructions: "L'exercice roi pour développer la force et la masse des deltoïdes antérieurs.\n\n1. Debout, saisissez la barre au niveau du haut de la poitrine, pieds stables.\n2. Poussez la barre verticalement au-dessus de la tête en contractant les abdominaux et les fessiers pour rester stable.\n3. Redescendez contrôlé jusqu'au niveau des clavicules."
  },
  {
    name: "Élévations latérales avec haltères",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2000/05/elevations-laterales-halteres.gif",
    muscle_group: "Épaules - Faisceau moyen",
    instructions: "Isoler le faisceau moyen des deltoïdes pour élargir la carrure.\n\n1. Debout, un haltère dans chaque main le long du corps.\n2. Élevez les bras sur les côtés jusqu'à l'horizontale en gardant une légère flexion des coudes (mains légèrement inclinées vers l'avant).\n3. Redescendez lentement sans relâcher la tension."
  },
  {
    name: "Oiseau avec haltères buste penché",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2000/08/oiseau-halteres-buste-penche-exercice-musculation.gif",
    muscle_group: "Épaules - Faisceau postérieur, Dos - Trapèzes",
    instructions: "Idéal pour renforcer l'arrière de l'épaule et équilibrer la posture.\n\n1. Debout, buste penché à l'horizontale, dos parfaitement plat, genoux légèrement déverrouillés.\n2. Élevez les haltères sur les côtés en contractant l'arrière des épaules, sans hausser les trapèzes.\n3. Contrôlez le retour à la position initiale."
  },
  {
    name: "Curl Biceps incliné",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2022/01/curl-incline-halteres.gif",
    muscle_group: "Bras - Biceps (Portion longue)",
    instructions: "L'inclinaison étire la longue portion du biceps pour un recrutement optimal.\n\n1. Assis sur un banc incliné à 45 degrés, bras tendus verticalement avec les haltères.\n2. Effectuez un curl classique en gardant les coudes fixes et orientés vers le sol.\n3. Contractez en haut et contrôlez le retour."
  },
  {
    name: "Curl Biceps au pupitre Larry Scott",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2022/01/curl-pupitre-ez.gif",
    muscle_group: "Bras - Biceps (Portion courte)",
    instructions: "Le pupitre Larry Scott empêche toute triche de triceps/épaules, isolant le biceps.\n\n1. Assis, placez le haut des bras calé sur le pupitre incliné, saisissez la barre EZ.\n2. Effectuez une flexion en contractant le biceps sans décoller les coudes du support.\n3. Redescendez lentement sans verrouiller complètement les coudes en bas."
  },
  {
    name: "Extensions triceps à la poulie haute",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2000/01/extension-triceps-poulie-haute.gif",
    muscle_group: "Bras - Triceps (Chef latéral), Bras - Triceps (Chef médial)",
    instructions: "Cible le faisceau externe et interne des triceps avec une tension continue.\n\n1. Debout face à la poulie haute, coudes collés aux flancs, tenez la poignée droite ou la corde.\n2. Poussez la charge vers le bas en tendant complètement les coudes.\n3. Remontez lentement jusqu'à un angle de 90 degrés sans écarter les coudes."
  },
  {
    name: "Squat arrière à la barre",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2021/08/back-squat.gif",
    muscle_group: "Jambes - Quadriceps, Jambes - Fessiers, Jambes - Ischio-jambiers",
    instructions: "L'exercice roi pour le développement global de la force et du volume des cuisses et fessiers.\n\n1. Barre posée sur le haut des trapèzes, pieds largeur d'épaules.\n2. Descendez en poussant les fessiers vers l'arrière et en fléchissant les genoux jusqu'à ce que les cuisses soient sous la parallèle au sol.\n3. Poussez fort sur vos talons pour remonter."
  },
  {
    name: "Fentes avant aux haltères",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2000/12/fentes-avant-avec-halteres.gif",
    muscle_group: "Jambes - Quadriceps, Jambes - Fessiers",
    instructions: "Cible les quadriceps et fessiers unilatéralement tout en améliorant la stabilité.\n\n1. Debout, un haltère dans chaque main le long du corps.\n2. Faites un grand pas en avant et descendez le genou arrière près du sol jusqu'à former un angle de 90 degrés.\n3. Poussez fort avec la jambe avant pour revenir à la position de départ."
  },
  {
    name: "Soulevé de terre jambes tendues",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2021/11/souleve-de-terre-jambes-tendues.gif",
    muscle_group: "Jambes - Ischio-jambiers, Jambes - Fessiers, Dos - Lombaires",
    instructions: "Cible l'isolation de la chaîne postérieure (arrière des cuisses et fessiers).\n\n1. Debout avec une barre en main, genoux très légèrement fléchis et bloqués dans cette position.\n2. Penchez le buste en avant en poussant les hanches le plus loin possible vers l'arrière, barre glissant sur les cuisses.\n3. Remontez en contractant les fessiers et les ischio-jambiers."
  },
  {
    name: "Crunch au sol",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2000/01/crunch-abdos.gif",
    muscle_group: "Abdominaux - Grand droit",
    instructions: "Isoler la partie supérieure de la sangle abdominale.\n\n1. Allongé sur le dos, genoux fléchis, pieds à plat au sol, mains posées sur les tempes.\n2. Contractez les abdominaux pour décoller uniquement le haut du dos et les omoplates du sol en enroulant la colonne.\n3. Redescendez doucement sans reposer la tête au sol."
  },
  {
    name: "Crunch inversé",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2000/09/crunch-inverse-exercice-musculation-abdominaux.gif",
    muscle_group: "Abdominaux - Bas des abdos",
    instructions: "Cible le bas des abdominaux en enroulant le bassin.\n\n1. Allongé sur le dos, mains le long du corps pour la stabilité, jambes pliées ou tendues verticalement.\n2. Contractez le bas des abdos pour enrouler le bassin et décoller les fesses du sol.\n3. Ramenez lentement le bassin sans creuser le bas du dos."
  },
  {
    name: "Relevé de jambes suspendu",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2000/10/releve-jambes-suspendu-exercice-musculation.gif",
    muscle_group: "Abdominaux - Bas des abdos, Abdominaux - Fléchisseurs de hanche",
    instructions: "Un exercice avancé pour dessiner la partie inférieure de la sangle abdominale.\n\n1. Suspendu à une barre de traction fixe, bras tendus, corps immobile.\n2. Relevez les jambes tendues devant vous jusqu'à former un angle de 90 degrés avec le buste en contractant les abdos.\n3. Contrôlez la descente lentement pour éviter le balancement."
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

  const { error: insertErr } = await supabase
    .from('exercises')
    .insert(toInsert);

  if (insertErr) {
    console.error("Error inserting exercises:", insertErr);
    process.exit(1);
  }

  console.log("Successfully inserted all exercises!");
}

run();
