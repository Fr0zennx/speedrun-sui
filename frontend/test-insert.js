import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function testInsert() {
  console.log('Testing user insert...\n');
  
  const wallet_address = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
  
  // Try to insert
  const { data, error } = await supabaseAdmin
    .from('users')
    .insert({ wallet_address })
    .select();
  
  if (error) {
    console.error('❌ Insert failed:');
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    console.error('Details:', error.details);
    console.error('Hint:', error.hint);
    console.error('\nFull error object:', JSON.stringify(error, null, 2));
  } else {
    console.log('✅ User inserted successfully!');
    console.log('Data:', data);
  }
}

testInsert();
