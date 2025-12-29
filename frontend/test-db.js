import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Service Key exists:', !!supabaseServiceKey);

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
  try {
    // Test 1: Check connection
    console.log('\n1. Testing connection...');
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Error:', error.message);
      console.error('Code:', error.code);
      console.error('Details:', error.details);
      console.error('Hint:', error.hint);
    } else {
      console.log('✅ Connection successful!');
      console.log('Users table exists');
      console.log('Found', data?.length || 0, 'users');
    }

    // Test 2: Check chapters table
    console.log('\n2. Checking chapters table...');
    const { data: chapters, error: chaptersError } = await supabaseAdmin
      .from('chapters')
      .select('*')
      .limit(5);
    
    if (chaptersError) {
      console.error('❌ Chapters Error:', chaptersError.message);
    } else {
      console.log('✅ Chapters table exists');
      console.log('Found', chapters?.length || 0, 'chapters');
    }

    // Test 3: Check submissions table
    console.log('\n3. Checking submissions table...');
    const { data: submissions, error: submissionsError } = await supabaseAdmin
      .from('submissions')
      .select('*')
      .limit(5);
    
    if (submissionsError) {
      console.error('❌ Submissions Error:', submissionsError.message);
    } else {
      console.log('✅ Submissions table exists');
      console.log('Found', submissions?.length || 0, 'submissions');
    }

  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testConnection();
