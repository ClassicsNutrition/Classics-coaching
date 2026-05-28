import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Read env variables manually from .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
const getEnv = (key) => {
  const match = envContent.match(new RegExp(`${key}=(.*)`));
  return match ? match[1].trim() : null;
};

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const serviceRoleKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const exerciseMappings = {
  "développé couché": [
    "Pectoraux - Portion moyenne",
    "Pectoraux - Portion inférieure",
    "Triceps - Chef latéral",
    "Épaules - Faisceau antérieur"
  ],
  "Développé incliné à la barre": [
    "Pectoraux - Portion supérieure",
    "Épaules - Faisceau antérieur",
    "Triceps - Chef latéral"
  ],
  "Écartés couché avec haltères": [
    "Pectoraux - Portion moyenne",
    "Épaules - Faisceau antérieur"
  ],
  "Écartés à la poulie vis-à-vis": [
    "Pectoraux - Portion moyenne",
    "Pectoraux - Portion inférieure",
    "Épaules - Faisceau antérieur"
  ],
  "Développé couché haltères": [
    "Pectoraux - Portion moyenne",
    "Pectoraux - Portion inférieure",
    "Triceps - Chef latéral"
  ],
  "Dips aux barres parallèles": [
    "Pectoraux - Portion inférieure",
    "Triceps - Chef long",
    "Épaules - Faisceau antérieur"
  ],
  "Pec-deck ou butterfly": [
    "Pectoraux - Portion moyenne"
  ],
  "Développé incliné à la machine convergente": [
    "Pectoraux - Portion supérieure",
    "Épaules - Faisceau antérieur",
    "Triceps - Chef latéral"
  ],
  "Écartés unilatéraux à la landmine": [
    "Pectoraux - Portion supérieure",
    "Pectoraux - Portion moyenne"
  ],
  "Pompes": [
    "Pectoraux - Portion moyenne",
    "Triceps - Chef latéral",
    "Abdominaux - Grand droit"
  ],
  "Développé décliné à la barre": [
    "Pectoraux - Portion inférieure",
    "Triceps - Chef latéral",
    "Épaules - Faisceau antérieur"
  ],
  "Écartés décliné avec haltères": [
    "Pectoraux - Portion inférieure"
  ],
  "Écartés hyght": [
    "Pectoraux - Portion supérieure"
  ],
  "Développé couché prise inversée": [
    "Pectoraux - Portion supérieure",
    "Triceps - Chef latéral",
    "Biceps - Portion longue"
  ],
  "Développé couché avec chaînes": [
    "Pectoraux - Portion moyenne",
    "Triceps - Chef latéral"
  ],
  "Développé décliné avec haltère": [
    "Pectoraux - Portion inférieure",
    "Triceps - Chef latéral"
  ]
};

async function migrate() {
  console.log("Fetching exercises...");
  const { data: exercises, error } = await supabase.from('exercises').select('*');
  
  if (error) {
    console.error("Error fetching exercises:", error);
    process.exit(1);
  }

  console.log(`Found ${exercises.length} exercises. Starting migration...`);

  for (const ex of exercises) {
    // Normalise name check (case-insensitive and trimming)
    const matchName = Object.keys(exerciseMappings).find(
      key => key.toLowerCase().trim() === ex.name.toLowerCase().trim()
    );

    if (matchName) {
      const portions = exerciseMappings[matchName];
      const newValue = portions.join(', ');
      console.log(`Updating "${ex.name}" with muscles: ${newValue}`);
      
      const { error: updateError } = await supabase
        .from('exercises')
        .update({ muscle_group: newValue })
        .eq('id', ex.id);

      if (updateError) {
        console.error(`Error updating "${ex.name}":`, updateError.message);
      }
    } else {
      console.log(`No mapping found for exercise: "${ex.name}"`);
    }
  }

  console.log("Migration complete!");
}

migrate();
