# Setup Guide for Submit Challenge Feature

## Prerequisites
- Node.js 18+ installed
- Supabase account created
- Sui Garage frontend project set up

## Step 1: Install Required Dependencies

```bash
cd frontend
npm install @supabase/supabase-js
```

If you get TypeScript errors about `process`, also install:
```bash
npm install --save-dev @types/node
```

## Step 2: Set Up Supabase Project

### 2.1 Create Supabase Project
1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Enter project name: `sui-garage` (or your preferred name)
4. Set a strong database password
5. Choose a region close to your users
6. Click "Create new project"

### 2.2 Run Database Schema
1. In your Supabase project, go to "SQL Editor"
2. Click "New Query"
3. Copy the entire contents of `database/schema.sql`
4. Paste into the SQL editor
5. Click "Run" or press `Ctrl+Enter`
6. Verify all tables, triggers, and views were created successfully

### 2.3 Get API Keys
1. Go to "Project Settings" → "API"
2. Copy the following values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: Long string starting with `eyJ...`
   - **service_role key**: Long string starting with `eyJ...` (different from anon key)

## Step 3: Configure Environment Variables

### 3.1 Create `.env.local` File
In your `frontend` directory, create a `.env.local` file:

```bash
cd frontend
touch .env.local  # On Windows: type nul > .env.local
```

### 3.2 Add Environment Variables
Copy the following into `.env.local` and replace with your actual values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **Important Security Notes:**
- Never commit `.env.local` to Git
- The `.env.local` file is already in `.gitignore`
- Only `NEXT_PUBLIC_*` variables are exposed to the browser
- `SUPABASE_SERVICE_ROLE_KEY` is server-side only

### 3.3 Verify Environment Variables
Create a test file to verify:

```bash
# frontend/test-env.js
console.log('Public URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set ✓' : 'Missing ✗');
console.log('Service Key:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set ✓' : 'Missing ✗');
```

Run with:
```bash
node test-env.js
```

## Step 4: Update TypeScript Configuration

If using TypeScript, ensure `tsconfig.json` has proper path aliases:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Step 5: Test the API Endpoint

### 5.1 Start Development Server
```bash
cd frontend
npm run dev
```

### 5.2 Test with cURL
```bash
curl -X POST http://localhost:3000/api/submit-challenge \
  -H "Content-Type: application/json" \
  -d '{
    "wallet_address": "0x1234567890abcdef1234567890abcdef12345678",
    "chapter_id": 2,
    "vercel_url": "https://test-project.vercel.app",
    "suiscan_url": "https://suiscan.xyz/testnet/tx/0xabc123def456"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Submission created successfully",
  "data": {
    "submission_id": "...",
    "wallet_address": "0x1234...",
    "chapter_id": 2,
    "status": "pending",
    "submitted_at": "...",
    "is_update": false
  }
}
```

### 5.3 Verify in Supabase
1. Go to your Supabase project
2. Navigate to "Table Editor"
3. Check the `users`, `submissions`, and `user_progress` tables
4. You should see your test data

## Step 6: Test Frontend Integration

### 6.1 Connect Wallet
1. Open your app in the browser: `http://localhost:3000`
2. Click "Connect" and connect your Sui wallet

### 6.2 Test Submission Flow
1. Click "Get Started"
2. Navigate to any level (e.g., Level 2: Character Card)
3. Go to the last chapter "Submit Your Work"
4. Enter valid URLs:
   - Vercel URL: `https://your-app.vercel.app`
   - Suiscan URL: `https://suiscan.xyz/testnet/tx/0x...`
5. Click "Submit Challenge"
6. You should see a success message

## Step 7: Verify Database Updates

After submitting, check your Supabase tables:

### Check Users Table
```sql
SELECT * FROM users ORDER BY created_at DESC LIMIT 5;
```

### Check Submissions Table
```sql
SELECT * FROM submissions ORDER BY submitted_at DESC LIMIT 5;
```

### Check User Progress
```sql
SELECT * FROM user_progress ORDER BY last_activity_at DESC LIMIT 5;
```

### Check User Statistics View
```sql
SELECT * FROM user_statistics 
WHERE wallet_address = 'YOUR_WALLET_ADDRESS';
```

## Step 8: Enable Row Level Security (Production)

For production deployment, ensure RLS is properly configured:

### 8.1 Verify RLS is Enabled
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

All tables should show `rowsecurity = true`.

### 8.2 Test RLS Policies
1. Try accessing data from a client without proper authentication
2. Verify users can only see their own data
3. Test that the service role key bypasses RLS (in API routes only)

## Troubleshooting

### Error: "Cannot find module '@supabase/supabase-js'"
```bash
npm install @supabase/supabase-js
```

### Error: "Cannot find name 'process'"
```bash
npm install --save-dev @types/node
```

### Error: "Missing Supabase environment variables"
- Check that `.env.local` exists in the `frontend` directory
- Verify all three environment variables are set
- Restart the development server after adding env vars

### Error: "CORS policy blocked"
In production, configure CORS in your API route:
```typescript
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
```

### Database Connection Failed
1. Check Supabase project is active
2. Verify API keys are correct
3. Check database password
4. Ensure project hasn't been paused (free tier)

### Submissions Not Creating
1. Check browser console for errors
2. Verify Network tab shows API request
3. Check API route logs in terminal
4. Verify database schema is properly set up

## Production Deployment Checklist

- [ ] Set environment variables in Vercel/hosting platform
- [ ] Enable RLS on all tables
- [ ] Add rate limiting to API routes
- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Configure proper CORS headers
- [ ] Add logging for production debugging
- [ ] Test with real wallet addresses
- [ ] Set up database backups
- [ ] Monitor Supabase usage quotas
- [ ] Add authentication middleware
- [ ] Set up webhook for submission notifications

## Next Steps

1. **Add Admin Dashboard**: Create a page to review submissions
2. **Email Notifications**: Send emails when submissions are reviewed
3. **Analytics**: Track submission success rates per chapter
4. **Leaderboard**: Display top users based on completed challenges
5. **Badge System**: Award badges for completing levels

## Support

For issues or questions:
- Check the [API Documentation](./API_DOCUMENTATION.md)
- Review [Database Schema](./database/README.md)
- Check Supabase documentation: https://supabase.com/docs
- Next.js App Router docs: https://nextjs.org/docs/app

## Security Best Practices

1. Never commit `.env.local` to version control
2. Use service role key only in API routes (server-side)
3. Validate all user inputs on the server
4. Implement rate limiting in production
5. Enable RLS on all sensitive tables
6. Use HTTPS in production
7. Keep dependencies updated
8. Monitor for suspicious activity
9. Implement proper authentication
10. Regular security audits
