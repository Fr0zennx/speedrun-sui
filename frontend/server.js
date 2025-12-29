import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in environment variables');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Validation functions
function isValidSuiAddress(address) {
  return /^0x[a-fA-F0-9]{64}$/.test(address);
}

function isValidVercelUrl(url) {
  return /^https:\/\/[a-zA-Z0-9-]+\.vercel\.app(\/.*)?$/.test(url);
}

function isValidSuiscanUrl(url) {
  return /^https:\/\/(suiscan\.xyz|suivision\.xyz|suiexplorer\.com)\/(testnet|mainnet)\/(tx|object)\/0x[a-fA-F0-9]+$/.test(url);
}

// POST /api/submit-challenge
app.post('/api/submit-challenge', async (req, res) => {
  try {
    const { wallet_address, chapter_id, vercel_url, suiscan_url } = req.body;

    // Validation
    if (!wallet_address || !chapter_id || !vercel_url || !suiscan_url) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: wallet_address, chapter_id, vercel_url, suiscan_url'
      });
    }

    if (!isValidSuiAddress(wallet_address)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Sui wallet address format'
      });
    }

    if (!Number.isInteger(chapter_id) || chapter_id < 1 || chapter_id > 15) {
      return res.status(400).json({
        success: false,
        error: 'Invalid chapter_id. Must be an integer between 1 and 15'
      });
    }

    if (!isValidVercelUrl(vercel_url)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Vercel URL format. Must be https://*.vercel.app'
      });
    }

    if (!isValidSuiscanUrl(suiscan_url)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid blockchain explorer URL. Must be from suiscan.xyz, suivision.xyz, or suiexplorer.com'
      });
    }

    // Check if user exists, create if not
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('wallet_address')
      .eq('wallet_address', wallet_address)
      .single();

    if (!existingUser) {
      console.log('Creating new user:', wallet_address);
      const { data: newUser, error: userError } = await supabaseAdmin
        .from('users')
        .insert({ wallet_address })
        .select();

      if (userError) {
        console.error('Error creating user:');
        console.error('Message:', userError.message);
        console.error('Code:', userError.code);
        console.error('Details:', userError.details);
        console.error('Full error:', JSON.stringify(userError, null, 2));
        return res.status(500).json({
          success: false,
          error: 'Failed to create user',
          details: userError.message
        });
      }
      console.log('User created successfully:', newUser);
    }

    // Check for existing submission
    const { data: existingSubmission } = await supabaseAdmin
      .from('submissions')
      .select('*')
      .eq('wallet_address', wallet_address)
      .eq('chapter_id', chapter_id)
      .single();

    if (existingSubmission) {
      // Prevent updating accepted submissions
      if (existingSubmission.status === 'accepted') {
        return res.status(400).json({
          success: false,
          error: 'Cannot update an accepted submission'
        });
      }

      // Update existing submission
      const { data, error } = await supabaseAdmin
        .from('submissions')
        .update({
          vercel_url,
          suiscan_url,
          status: 'accepted',
          submitted_at: new Date().toISOString(),
          reviewed_at: new Date().toISOString(),
          reviewer_notes: 'Auto-approved: Valid URLs provided'
        })
        .eq('wallet_address', wallet_address)
        .eq('chapter_id', chapter_id)
        .select()
        .single();

      if (error) {
        console.error('Error updating submission:', error);
        return res.status(500).json({
          success: false,
          error: 'Failed to update submission'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Submission updated successfully',
        data
      });
    } else {
      // Create new submission
      const { data, error } = await supabaseAdmin
        .from('submissions')
        .insert({
          wallet_address,
          chapter_id,
          vercel_url,
          suiscan_url,
          status: 'accepted',
          reviewed_at: new Date().toISOString(),
          reviewer_notes: 'Auto-approved: Valid URLs provided'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating submission:', error);
        return res.status(500).json({
          success: false,
          error: 'Failed to create submission'
        });
      }

      return res.status(201).json({
        success: true,
        message: 'Submission created successfully',
        data
      });
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/submit-challenge
app.get('/api/submit-challenge', async (req, res) => {
  try {
    const { wallet_address, chapter_id } = req.query;

    if (!wallet_address) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameter: wallet_address'
      });
    }

    if (!isValidSuiAddress(wallet_address)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Sui wallet address format'
      });
    }

    let query = supabaseAdmin
      .from('submissions')
      .select('*')
      .eq('wallet_address', wallet_address)
      .order('submitted_at', { ascending: false });

    if (chapter_id) {
      const chapterId = parseInt(chapter_id);
      if (!Number.isInteger(chapterId) || chapterId < 1 || chapterId > 15) {
        return res.status(400).json({
          success: false,
          error: 'Invalid chapter_id. Must be an integer between 1 and 15'
        });
      }
      query = query.eq('chapter_id', chapterId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching submissions:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch submissions'
      });
    }

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/user-status
app.get('/api/user-status', async (req, res) => {
  try {
    const { address } = req.query;

    if (!address) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameter: address'
      });
    }

    if (!isValidSuiAddress(address)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Sui wallet address format'
      });
    }

    // Get user's submissions with accepted status
    const { data: submissions, error: submissionsError } = await supabaseAdmin
      .from('submissions')
      .select('chapter_id, status, submitted_at, reviewed_at')
      .eq('wallet_address', address)
      .order('chapter_id', { ascending: true });

    if (submissionsError) {
      console.error('Error fetching submissions:', submissionsError);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch user status'
      });
    }

    // Get user progress from user_progress table
    const { data: userProgress, error: progressError } = await supabaseAdmin
      .from('user_progress')
      .select('*')
      .eq('wallet_address', address)
      .single();

    if (progressError && progressError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Error fetching user progress:', progressError);
    }

    // Calculate completed chapters
    const completedChapters = submissions
      ?.filter(s => s.status === 'accepted')
      .map(s => s.chapter_id) || [];

    // Calculate pending chapters
    const pendingChapters = submissions
      ?.filter(s => s.status === 'pending')
      .map(s => s.chapter_id) || [];

    // Calculate rejected chapters
    const rejectedChapters = submissions
      ?.filter(s => s.status === 'rejected')
      .map(s => s.chapter_id) || [];

    // Find next chapter to work on
    let nextChapter = 1;
    if (completedChapters.length > 0) {
      const maxCompleted = Math.max(...completedChapters);
      nextChapter = maxCompleted + 1 <= 15 ? maxCompleted + 1 : 15;
    }

    // Get all submissions details
    const submissionsMap = {};
    submissions?.forEach(sub => {
      submissionsMap[sub.chapter_id] = {
        status: sub.status,
        submitted_at: sub.submitted_at,
        reviewed_at: sub.reviewed_at
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        wallet_address: address,
        completed_chapters: completedChapters,
        pending_chapters: pendingChapters,
        rejected_chapters: rejectedChapters,
        next_chapter: nextChapter,
        total_completed: completedChapters.length,
        total_pending: pendingChapters.length,
        submissions: submissionsMap,
        progress: userProgress || null
      }
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
