import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function testAutoAccept() {
  const walletAddress = "0xtest1234567890abcdeftest1234567890abcdeftest1234567890abcdeftest12";
  const chapterId = 3;

  console.log('Creating auto-accepted submission...\n');

  // Create submission
  const { data: submission, error: submitError } = await supabaseAdmin
    .from('submissions')
    .insert({
      wallet_address: walletAddress,
      chapter_id: chapterId,
      vercel_url: 'https://test-auto.vercel.app',
      suiscan_url: 'https://suiscan.xyz/testnet/tx/0xautotest123456789abcdef',
      status: 'accepted',
      reviewed_at: new Date().toISOString(),
      reviewer_notes: 'Auto-approved: Valid URLs provided'
    })
    .select()
    .single();

  if (submitError) {
    console.error('❌ Submission Error:', submitError);
    return;
  }

  console.log('✅ Submission created:', submission);

  // Wait a bit for trigger
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Check user progress
  const { data: progress, error: progressError } = await supabaseAdmin
    .from('user_progress')
    .select('*')
    .eq('wallet_address', walletAddress)
    .single();

  if (progressError) {
    console.error('❌ Progress Error:', progressError);
  } else {
    console.log('\n✅ User Progress:');
    console.log('Completed chapters:', progress.completed_chapters);
    console.log('Current chapter:', progress.current_chapter_id);
    console.log('Accepted submissions:', progress.accepted_submissions);
  }

  // Check via API
  console.log('\n🔍 Checking via user-status API...');
  const apiResponse = await fetch(`http://localhost:3000/api/user-status?address=${walletAddress}`);
  const apiData = await apiResponse.json();
  
  console.log('Completed chapters:', apiData.data.completed_chapters);
  console.log('Next chapter:', apiData.data.next_chapter);
  console.log('Total completed:', apiData.data.total_completed);
}

testAutoAccept();
