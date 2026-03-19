const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('⚠️ SUPABASE_URL ou SUPABASE_ANON_KEY manquant dans le fichier .env');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };
