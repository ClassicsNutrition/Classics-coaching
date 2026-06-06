import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const getEnv = (key) => {
  const match = envContent.match(new RegExp(`${key}=(.*)`));
  return match ? match[1].trim() : null;
};

const supabase = createClient(getEnv('NEXT_PUBLIC_SUPABASE_URL'), getEnv('SUPABASE_SERVICE_ROLE_KEY'));

// GIF found = use GIF, null = keep current JPG (already valid)
const updates = [
  // ✅ GIF found
  { name: "Pull-over avec haltère",             gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2021/12/pullover-haltere.gif" },
  { name: "Tirage vertical poitrine",            gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2021/11/tirage-vertical-poitrine.gif" },
  { name: "Tirage horizontal poulie basse",      gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2022/02/tirage-horizontal-poulie.gif" },
  { name: "Rowing barre buste penché",           gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2021/09/rowing-barre.gif" },
  { name: "Élévations latérales avec haltères", gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2000/08/elevations-laterales-exercice-musculation.gif" },
  { name: "Oiseau avec haltères buste penché",  gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2021/12/oiseau-assis-sur-banc.gif" },
  { name: "Curl Biceps incliné",                gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2021/10/curl-haltere-incline.gif" },
  { name: "Soulevé de terre jambes tendues",    gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2022/04/souleve-de-terre-jambes-tendues.gif" },
  { name: "Relevé de jambes suspendu",          gif_url: "https://www.docteur-fitness.com/wp-content/uploads/2022/02/releve-de-jambes-suspendu.gif" },
];

async function run() {
  console.log(`Updating ${updates.length} exercises with GIF URLs...\n`);
  let ok = 0, err = 0;

  for (const u of updates) {
    const { error } = await supabase.from('exercises').update({ gif_url: u.gif_url }).eq('name', u.name);
    if (error) { console.error(`❌ ${u.name}:`, error.message); err++; }
    else { console.log(`✅ ${u.name}`); ok++; }
  }

  console.log(`\n✅ ${ok} GIFs mis à jour | ⚠️ ${8} gardent le JPG (pas de GIF disponible sur le site)`);
}

run();
