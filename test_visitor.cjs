const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envConfig = fs.readFileSync('.env', 'utf8').split('\n').reduce((acc, line) => {
  const match = line.split('=');
  if (match.length > 1) acc[match[0]] = match.slice(1).join('=').trim().replace(/^"|"$/g, '');
  return acc;
}, {});

const supabaseUrl = envConfig.VITE_SUPABASE_URL || envConfig.SUPABASE_URL;
const supabaseKey = envConfig.VITE_SUPABASE_PUBLISHABLE_KEY || envConfig.SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  const uuid = require('crypto').randomUUID();
  const { data, error } = await supabase.from('profiles').insert({
    id: uuid,
    user_id: uuid,
    email: `visitor_${uuid}@guest.local`,
    first_name: 'Visitor'
  }).select();
  
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Success:', data);
  }
}

testInsert();
