# Submit Challenge API Documentation

## Overview
RESTful API endpoint for submitting and managing user challenge submissions in the Sui Garage education platform.

## Endpoint
```
POST /api/submit-challenge
GET  /api/submit-challenge
```

## Base URL
```
http://localhost:3000/api/submit-challenge (Development)
https://your-domain.com/api/submit-challenge (Production)
```

---

## POST - Submit Challenge

### Description
Creates a new submission or updates an existing submission for a specific chapter. Automatically creates user record if it doesn't exist.

### Request

#### Headers
```json
{
  "Content-Type": "application/json"
}
```

#### Body Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| wallet_address | string | Yes | User's Sui wallet address (must start with 0x) |
| chapter_id | number | Yes | Chapter ID (1-6) |
| vercel_url | string | No | Deployed Vercel application URL |
| suiscan_url | string | No | Sui testnet explorer URL |

#### Request Example
```json
{
  "wallet_address": "0x1234567890abcdef1234567890abcdef12345678",
  "chapter_id": 2,
  "vercel_url": "https://my-sui-project.vercel.app",
  "suiscan_url": "https://suiscan.xyz/testnet/tx/0xabc123..."
}
```

### Response

#### Success Response (201 Created - New Submission)
```json
{
  "success": true,
  "message": "Submission created successfully",
  "data": {
    "submission_id": "550e8400-e29b-41d4-a716-446655440000",
    "wallet_address": "0x1234567890abcdef1234567890abcdef12345678",
    "chapter_id": 2,
    "status": "pending",
    "submitted_at": "2025-12-29T10:30:00.000Z",
    "is_update": false
  }
}
```

#### Success Response (200 OK - Updated Submission)
```json
{
  "success": true,
  "message": "Submission updated successfully",
  "data": {
    "submission_id": "550e8400-e29b-41d4-a716-446655440000",
    "wallet_address": "0x1234567890abcdef1234567890abcdef12345678",
    "chapter_id": 2,
    "status": "pending",
    "submitted_at": "2025-12-29T11:45:00.000Z",
    "is_update": true
  }
}
```

#### Error Responses

**400 Bad Request - Missing Fields**
```json
{
  "error": "Missing required fields: wallet_address and chapter_id are required"
}
```

**400 Bad Request - Invalid Wallet**
```json
{
  "error": "Invalid wallet address format"
}
```

**400 Bad Request - Invalid Chapter ID**
```json
{
  "error": "Invalid chapter_id. Must be between 1 and 6"
}
```

**400 Bad Request - Invalid Vercel URL**
```json
{
  "error": "Vercel URL must be in format: https://your-app.vercel.app"
}
```

**400 Bad Request - Invalid Suiscan URL**
```json
{
  "error": "Suiscan URL must be from Suiscan, SuiVision, or SuiExplorer"
}
```

**400 Bad Request - Accepted Submission**
```json
{
  "error": "Cannot update an accepted submission",
  "message": "This challenge has already been accepted. Please contact support if you need to make changes."
}
```

**500 Internal Server Error**
```json
{
  "error": "Internal server error",
  "message": "Database connection failed"
}
```

---

## GET - Retrieve Submissions

### Description
Retrieves submissions for a specific wallet address, optionally filtered by chapter.

### Request

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| wallet_address | string | Yes | User's Sui wallet address |
| chapter_id | number | No | Filter by specific chapter ID |

#### Request Examples
```
GET /api/submit-challenge?wallet_address=0x1234...
GET /api/submit-challenge?wallet_address=0x1234...&chapter_id=2
```

### Response

#### Success Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "wallet_address": "0x1234567890abcdef1234567890abcdef12345678",
      "chapter_id": 2,
      "vercel_url": "https://my-project.vercel.app",
      "suiscan_url": "https://suiscan.xyz/testnet/tx/0xabc...",
      "status": "pending",
      "submitted_at": "2025-12-29T10:30:00.000Z",
      "reviewed_at": null,
      "reviewer_notes": null
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "wallet_address": "0x1234567890abcdef1234567890abcdef12345678",
      "chapter_id": 3,
      "vercel_url": "https://nft-project.vercel.app",
      "suiscan_url": "https://suiscan.xyz/testnet/object/0xdef...",
      "status": "accepted",
      "submitted_at": "2025-12-28T14:20:00.000Z",
      "reviewed_at": "2025-12-29T09:15:00.000Z",
      "reviewer_notes": "Great work! Well implemented."
    }
  ],
  "count": 2
}
```

#### Error Response (400 Bad Request)
```json
{
  "error": "wallet_address query parameter is required"
}
```

---

## Validation Rules

### Wallet Address
- Must start with `0x`
- Minimum length: 10 characters
- Format: Hexadecimal string

### Chapter ID
- Must be a number between 1 and 6 (inclusive)
- Maps to:
  - 1: Sui Garage Development
  - 2: Character Card
  - 3: NFT & Visual Ownership
  - 4: Battle & Level Up
  - 5: Sui Car
  - 6: Sui Gallery

### Vercel URL (Optional)
- Must be a valid HTTPS URL
- Must match pattern: `https://*.vercel.app/*`
- Examples:
  - ✅ `https://my-app.vercel.app`
  - ✅ `https://my-app-123.vercel.app/dashboard`
  - ❌ `http://my-app.vercel.app` (HTTP not allowed)
  - ❌ `https://my-app.com` (Not a Vercel domain)

### Suiscan URL (Optional)
- Must be a valid HTTPS URL
- Must be from one of:
  - `suiscan.xyz`
  - `suivision.xyz`
  - `suiexplorer.com`
- Must include:
  - Network: `testnet` or `mainnet`
  - Type: `tx`, `object`, or `account`
  - Address: Starting with `0x`
- Examples:
  - ✅ `https://suiscan.xyz/testnet/tx/0xabc123...`
  - ✅ `https://suivision.xyz/testnet/object/0xdef456...`
  - ✅ `https://suiexplorer.com/mainnet/account/0x789...`
  - ❌ `https://suiscan.xyz/tx/0xabc` (Missing network)

---

## Business Logic

### User Creation
1. When a submission is made, the system first checks if the user exists
2. If user doesn't exist, a new user record is automatically created
3. This also triggers the creation of a `user_progress` record via database trigger

### Submission Upsert Logic
1. System checks for existing submission with same `wallet_address` + `chapter_id`
2. **If exists:**
   - Check if status is `accepted`
   - If accepted: Return error (cannot update accepted submissions)
   - If not accepted: Update the submission with new data
   - Reset `status` to `pending`
   - Update `submitted_at` timestamp
   - Clear `reviewed_at` and `reviewer_notes`
3. **If doesn't exist:**
   - Create new submission with status `pending`

### Database Triggers
When a submission is created or updated, the following triggers execute:
- `update_submission_count`: Increments `total_submissions` in `user_progress`
- `update_user_progress_on_acceptance`: When status changes to `accepted`, updates user progress

---

## Frontend Integration Example

### React Component with API Call
```typescript
const handleSubmit = async (data: { vercelUrl: string; suiscanUrl: string }) => {
  try {
    const response = await fetch('/api/submit-challenge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        wallet_address: currentAccount.address,
        chapter_id: chapterId,
        vercel_url: data.vercelUrl,
        suiscan_url: data.suiscanUrl,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Submission failed');
    }

    alert(result.message);
    console.log('Submission:', result.data);
    
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to submit. Please try again.');
  }
};
```

### Fetch User Submissions
```typescript
const fetchSubmissions = async (walletAddress: string) => {
  const response = await fetch(
    `/api/submit-challenge?wallet_address=${walletAddress}`
  );
  const data = await response.json();
  
  if (data.success) {
    console.log('User submissions:', data.data);
    console.log('Total submissions:', data.count);
  }
};
```

---

## Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

⚠️ **Important:** Never expose `SUPABASE_SERVICE_ROLE_KEY` in client-side code. This key bypasses Row Level Security and should only be used in API routes.

---

## Rate Limiting (Recommended)

Consider implementing rate limiting to prevent abuse:

```typescript
// Example with next-rate-limit
import rateLimit from 'next-rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500, // Max 500 users per minute
});

export async function POST(request: NextRequest) {
  try {
    await limiter.check(10, 'CACHE_TOKEN'); // 10 requests per minute
    // ... rest of the code
  } catch {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }
}
```

---

## Testing

### cURL Examples

**Create Submission:**
```bash
curl -X POST http://localhost:3000/api/submit-challenge \
  -H "Content-Type: application/json" \
  -d '{
    "wallet_address": "0x1234567890abcdef1234567890abcdef12345678",
    "chapter_id": 2,
    "vercel_url": "https://my-project.vercel.app",
    "suiscan_url": "https://suiscan.xyz/testnet/tx/0xabc123..."
  }'
```

**Get Submissions:**
```bash
curl "http://localhost:3000/api/submit-challenge?wallet_address=0x1234567890abcdef1234567890abcdef12345678"
```

### Postman Collection
Import this JSON into Postman for testing:

```json
{
  "info": {
    "name": "Sui Garage API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Submit Challenge",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"wallet_address\": \"0x1234567890abcdef1234567890abcdef12345678\",\n  \"chapter_id\": 2,\n  \"vercel_url\": \"https://my-project.vercel.app\",\n  \"suiscan_url\": \"https://suiscan.xyz/testnet/tx/0xabc123...\"\n}"
        },
        "url": {
          "raw": "http://localhost:3000/api/submit-challenge",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["api", "submit-challenge"]
        }
      }
    }
  ]
}
```

---

## Security Considerations

1. **Authentication**: Currently uses wallet address. Consider adding JWT authentication.
2. **Input Sanitization**: All inputs are validated before database operations.
3. **SQL Injection**: Using Supabase's parameterized queries prevents SQL injection.
4. **CORS**: Configure CORS headers for production deployment.
5. **Rate Limiting**: Implement to prevent spam submissions.
6. **Logging**: All errors are logged server-side for monitoring.

---

## Future Enhancements

- [ ] Add webhook support for submission status updates
- [ ] Implement email notifications on submission acceptance/rejection
- [ ] Add file upload support for screenshots
- [ ] Create admin dashboard for reviewing submissions
- [ ] Add submission analytics and metrics
- [ ] Implement automated testing for contract URLs
- [ ] Add submission comments/feedback system
