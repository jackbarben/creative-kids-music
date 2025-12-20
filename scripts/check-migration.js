const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTable() {
  const { data, error } = await supabase.from('magic_links').select('id').limit(1);
  if (error && error.code === '42P01') {
    console.log('magic_links table does not exist - needs migration');
    process.exit(1);
  } else if (error) {
    console.log('Error:', error.message);
    process.exit(1);
  } else {
    console.log('magic_links table exists!');
  }
}

checkTable();
