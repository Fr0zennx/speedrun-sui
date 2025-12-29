import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function acceptSubmission() {
  const walletAddress = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
  const chapterId = 2;

  console.log('Accepting submission for wallet:', walletAddress, 'chapter:', chapterId);

  const { data, error } = await supabaseAdmin
    .from('submissions')
    .update({
      status: 'accepted',
      reviewed_at: new Date().toISOString(),
      reviewer_notes: 'Test approval - Great work!'
    })
    .eq('wallet_address', walletAddress)
    .eq('chapter_id', chapterId)
    .select();

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('✅ Submission accepted!');
    console.log(data);
  }
}

acceptSubmission();
