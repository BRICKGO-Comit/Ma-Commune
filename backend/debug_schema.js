const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function checkSchema() {
  console.log('Checking communes table...');
  const { data, error } = await supabase.from('communes').select('*').limit(1);
  if (error) {
    console.error('Error selecting from communes:', error);
  } else {
    console.log('Communes sample data:', data);
    if (data && data.length > 0) {
      console.log('Available columns:', Object.keys(data[0]));
    } else {
      console.log('Table is empty, checking columns via RPC or internal query is limited with JS client.');
    }
  }

  console.log('\nChecking users table...');
  const { data: uData, error: uError } = await supabase.from('users').select('*').limit(1);
  if (uError) {
    console.log('Users table error (might not exist):', uError.message);
  } else {
    console.log('Users table exists.');
  }

  console.log('\nChecking profiles table...');
  const { data: pData, error: pError } = await supabase.from('profiles').select('*').limit(1);
  if (pError) {
    console.log('Profiles table error (might not exist):', pError.message);
  } else {
    console.log('Profiles table exists.');
  }
}

checkSchema();
