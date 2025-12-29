import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Request body type
interface SubmitChallengeRequest {
  wallet_address: string;
  chapter_id: number;
  vercel_url: string;
  suiscan_url: string;
}

// Validation helper
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Validate Vercel URL
function isValidVercelUrl(url: string): boolean {
  const vercelPattern = /^https:\/\/[a-zA-Z0-9-]+\.vercel\.app(\/.*)?$/;
  return vercelPattern.test(url);
}

// Validate Sui explorer URL
function isValidSuiscanUrl(url: string): boolean {
  const suiscanPattern = /^https:\/\/(suivision\.xyz|suiscan\.xyz|suiexplorer\.com)\/(testnet|mainnet)\/(tx|object|account)\/0x[a-fA-F0-9]+$/;
  return suiscanPattern.test(url);
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== Submit Challenge API Called ===');
    
    // Parse request body
    let body: SubmitChallengeRequest;
    try {
      body = await request.json();
      console.log('Request body:', body);
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    const { wallet_address, chapter_id, vercel_url, suiscan_url } = body;

    // Validate required fields
    if (!wallet_address || !chapter_id) {
      return NextResponse.json(
        { error: 'Missing required fields: wallet_address and chapter_id are required' },
        { status: 400 }
      );
    }

    // Validate wallet address format (basic check)
    if (!wallet_address.startsWith('0x') || wallet_address.length < 10) {
      return NextResponse.json(
        { error: 'Invalid wallet address format' },
        { status: 400 }
      );
    }

    // Validate chapter_id range (1-6)
    if (chapter_id < 1 || chapter_id > 6) {
      return NextResponse.json(
        { error: 'Invalid chapter_id. Must be between 1 and 6' },
        { status: 400 }
      );
    }

    // Validate URLs if provided
    if (vercel_url && !isValidUrl(vercel_url)) {
      return NextResponse.json(
        { error: 'Invalid Vercel URL format' },
        { status: 400 }
      );
    }

    if (vercel_url && !isValidVercelUrl(vercel_url)) {
      return NextResponse.json(
        { error: 'Vercel URL must be in format: https://your-app.vercel.app' },
        { status: 400 }
      );
    }

    if (suiscan_url && !isValidUrl(suiscan_url)) {
      return NextResponse.json(
        { error: 'Invalid Suiscan URL format' },
        { status: 400 }
      );
    }

    if (suiscan_url && !isValidSuiscanUrl(suiscan_url)) {
      return NextResponse.json(
        { error: 'Suiscan URL must be from Suiscan, SuiVision, or SuiExplorer' },
        { status: 400 }
      );
    }

    // 1. Check if user exists, if not create
    const { data: existingUser, error: userCheckError } = await supabaseAdmin
      .from('users')
      .select('wallet_address')
      .eq('wallet_address', wallet_address)
      .single();

    if (userCheckError && userCheckError.code !== 'PGRST116') {
      // PGRST116 is "not found" error
      console.error('Error checking user:', userCheckError);
      return NextResponse.json(
        { error: 'Database error while checking user' },
        { status: 500 }
      );
    }

    // Create user if doesn't exist
    if (!existingUser) {
      const { error: userCreateError } = await supabaseAdmin
        .from('users')
        .insert({ wallet_address });

      if (userCreateError) {
        console.error('Error creating user:', userCreateError);
        return NextResponse.json(
          { error: 'Failed to create user record' },
          { status: 500 }
        );
      }
    }

    // 2. Check if submission already exists for this wallet_address + chapter_id
    const { data: existingSubmission, error: submissionCheckError } = await supabaseAdmin
      .from('submissions')
      .select('id, status')
      .eq('wallet_address', wallet_address)
      .eq('chapter_id', chapter_id)
      .single();

    if (submissionCheckError && submissionCheckError.code !== 'PGRST116') {
      console.error('Error checking submission:', submissionCheckError);
      return NextResponse.json(
        { error: 'Database error while checking submission' },
        { status: 500 }
      );
    }

    let result;
    let isUpdate = false;

    if (existingSubmission) {
      // 3a. UPDATE existing submission
      isUpdate = true;
      
      // Don't allow updating accepted submissions
      if (existingSubmission.status === 'accepted') {
        return NextResponse.json(
          { 
            error: 'Cannot update an accepted submission',
            message: 'This challenge has already been accepted. Please contact support if you need to make changes.'
          },
          { status: 400 }
        );
      }

      const { data: updatedSubmission, error: updateError } = await supabaseAdmin
        .from('submissions')
        .update({
          vercel_url,
          suiscan_url,
          status: 'pending',
          submitted_at: new Date().toISOString(),
          reviewed_at: null,
          reviewer_notes: null
        })
        .eq('id', existingSubmission.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating submission:', updateError);
        return NextResponse.json(
          { error: 'Failed to update submission' },
          { status: 500 }
        );
      }

      result = updatedSubmission;
    } else {
      // 3b. INSERT new submission
      const { data: newSubmission, error: insertError } = await supabaseAdmin
        .from('submissions')
        .insert({
          wallet_address,
          chapter_id,
          vercel_url,
          suiscan_url,
          status: 'pending'
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating submission:', insertError);
        return NextResponse.json(
          { error: 'Failed to create submission' },
          { status: 500 }
        );
      }

      result = newSubmission;
    }

    // 4. Return success response
    return NextResponse.json(
      {
        success: true,
        message: isUpdate 
          ? 'Submission updated successfully' 
          : 'Submission created successfully',
        data: {
          submission_id: result.id,
          wallet_address: result.wallet_address,
          chapter_id: result.chapter_id,
          status: result.status,
          submitted_at: result.submitted_at,
          is_update: isUpdate
        }
      },
      { status: isUpdate ? 200 : 201 }
    );

  } catch (error) {
    console.error('Unexpected error in submit-challenge:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve user's submissions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const wallet_address = searchParams.get('wallet_address');
    const chapter_id = searchParams.get('chapter_id');

    if (!wallet_address) {
      return NextResponse.json(
        { error: 'wallet_address query parameter is required' },
        { status: 400 }
      );
    }

    let query = supabaseAdmin
      .from('submissions')
      .select('*')
      .eq('wallet_address', wallet_address)
      .order('submitted_at', { ascending: false });

    if (chapter_id) {
      query = query.eq('chapter_id', parseInt(chapter_id));
    }

    const { data: submissions, error } = await query;

    if (error) {
      console.error('Error fetching submissions:', error);
      return NextResponse.json(
        { error: 'Failed to fetch submissions' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: submissions,
      count: submissions?.length || 0
    });

  } catch (error) {
    console.error('Unexpected error in GET submissions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
