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

// New verified image URLs from docteur-fitness.com
const updates = [
  {
    name: "Développé incliné haltères",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2021/06/developpe-incline-halteres-pectoraux.jpg"
  },
  {
    name: "Pull-over avec haltère",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2021/12/pullover-haltere-exercice-dos.jpg"
  },
  {
    name: "Tirage vertical poitrine",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2021/11/tirage-vertical-poitrine-exercice-dos.jpg"
  },
  {
    name: "Tirage horizontal poulie basse",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2022/02/tirage-horizontal-poulie-exercice-dos.jpg"
  },
  {
    name: "Rowing barre buste penché",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2021/09/rowing-barre-dos.jpg"
  },
  {
    name: "Développé militaire à la barre",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2021/08/developpe-militaire-epaules.jpg"
  },
  {
    name: "Élévations latérales avec haltères",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2000/08/elevations-laterales-epaules.jpg"
  },
  {
    name: "Oiseau avec haltères buste penché",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2021/12/oiseau-assis-sur-banc-exercice-epaule.jpg"
  },
  {
    name: "Curl Biceps incliné",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2021/10/curl-haltere-incline-biceps.jpg"
  },
  {
    name: "Curl Biceps au pupitre Larry Scott",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2022/01/curl-au-pupitre-barre-ez-larry-scott-exercice-biceps.jpg"
  },
  {
    name: "Extensions triceps à la poulie haute",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2021/10/extension-triceps-poulie-haute-corde-exercice.jpg"
  },
  {
    name: "Squat arrière à la barre",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2021/12/squat-barre-devant-exercice-quadriceps.jpg"
  },
  {
    name: "Fentes avant aux haltères",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2021/06/fentes-avant-quadriceps.jpg"
  },
  {
    name: "Soulevé de terre jambes tendues",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2022/04/souleve-de-terre-jambes-tendues-exercice-musculation-ischio-jambiers.jpg"
  },
  {
    name: "Crunch au sol",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2021/07/crunch-au-sol-abdominaux.jpg"
  },
  {
    name: "Crunch inversé",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2022/08/crunch-avec-jambes-verticales-exercice-abdos-beton.jpg"
  },
  {
    name: "Relevé de jambes suspendu",
    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2022/02/releve-de-jambes-suspendu-exercice-grand-droit-abdomen.jpg"
  },
];

async function run() {
  console.log(`Updating ${updates.length} exercise images...\n`);
  let successCount = 0;
  let errorCount = 0;

  for (const update of updates) {
    const { error } = await supabase
      .from('exercises')
      .update({ gif_url: update.gif_url })
      .eq('name', update.name);

    if (error) {
      console.error(`❌ Error updating "${update.name}":`, error.message);
      errorCount++;
    } else {
      console.log(`✅ Updated: ${update.name}`);
      console.log(`   → ${update.gif_url}`);
      successCount++;
    }
  }

  console.log(`\n✅ ${successCount} exercises updated successfully`);
  if (errorCount > 0) console.log(`❌ ${errorCount} errors`);
}

run();
