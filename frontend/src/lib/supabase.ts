import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a Supabase client with the service role key for server-side operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Types for database tables
export interface User {
  wallet_address: string;
  created_at: string;
  updated_at: string;
}

export interface Submission {
  id: string;
  wallet_address: string;
  chapter_id: number;
  vercel_url: string | null;
  suiscan_url: string | null;
  status: 'pending' | 'accepted' | 'rejected';
  submitted_at: string;
  reviewed_at: string | null;
  reviewer_notes: string | null;
}

export interface UserProgress {
  wallet_address: string;
  current_chapter_id: number;
  completed_chapters: number[];
  last_activity_at: string;
  total_submissions: number;
  accepted_submissions: number;
  created_at: string;
  updated_at: string;
}

export interface Chapter {
  id: number;
  level_number: number;
  title: string;
  description: string | null;
  created_at: string;
}
