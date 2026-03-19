require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateSuperAdmin() {
  const email = 'macommune5@gmail.com';
  
  const { data, error } = await supabase
    .from('users')
    .update({ 
      role: 'super_admin',
      password: 'MaCommune555@',
      updated_at: new Date().toISOString()
    })
    .eq('email', email);

  if (error) {
    console.error('Error updating to super admin:', error);
  } else {
    console.log('Super admin updated successfully:', email);
  }
}

updateSuperAdmin();
