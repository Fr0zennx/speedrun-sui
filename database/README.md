# Database Schema Documentation

## Overview
This database schema is designed for a Web3 education platform on Supabase (PostgreSQL) that tracks user progress through Sui blockchain learning chapters.

## Tables

### 1. `users`
Stores wallet addresses and user registration information.

| Column | Type | Description |
|--------|------|-------------|
| wallet_address | TEXT (PK) | User's blockchain wallet address |
| created_at | TIMESTAMP | When the user first registered |
| updated_at | TIMESTAMP | Last update timestamp |

### 2. `chapters`
Contains information about each learning level.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL (PK) | Unique chapter identifier |
| level_number | INTEGER | Sequential level number (1-6) |
| title | TEXT | Chapter title |
| description | TEXT | Chapter description |
| created_at | TIMESTAMP | When the chapter was created |

**Pre-populated with 6 levels:**
1. Sui Garage Development
2. Character Card
3. NFT & Visual Ownership
4. Battle & Level Up
5. Sui Car
6. Sui Gallery

### 3. `submissions`
Tracks user submissions for each chapter.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique submission identifier |
| wallet_address | TEXT (FK) | User who submitted |
| chapter_id | INTEGER (FK) | Which chapter this submission is for |
| vercel_url | TEXT | URL to deployed Vercel project |
| suiscan_url | TEXT | URL to Suiscan transaction/contract |
| status | TEXT | Review status: 'pending', 'accepted', 'rejected' |
| submitted_at | TIMESTAMP | When submission was made |
| reviewed_at | TIMESTAMP | When submission was reviewed |
| reviewer_notes | TEXT | Feedback from reviewer |

**Constraints:**
- Unique constraint on (wallet_address, chapter_id) - one active submission per chapter per user
- Status must be one of: 'pending', 'accepted', 'rejected'

### 4. `user_progress`
Tracks each user's current position and overall progress.

| Column | Type | Description |
|--------|------|-------------|
| wallet_address | TEXT (PK, FK) | User identifier |
| current_chapter_id | INTEGER (FK) | Chapter user is currently working on |
| completed_chapters | INTEGER[] | Array of completed chapter IDs |
| last_activity_at | TIMESTAMP | Last time user was active |
| total_submissions | INTEGER | Total number of submissions made |
| accepted_submissions | INTEGER | Number of accepted submissions |
| created_at | TIMESTAMP | When progress tracking started |
| updated_at | TIMESTAMP | Last progress update |

## Triggers & Functions

### 1. `initialize_user_progress()`
Automatically creates a progress record when a new user registers, starting them at chapter 1.

### 2. `update_user_progress_on_acceptance()`
When a submission is accepted:
- Adds chapter to `completed_chapters` array
- Advances `current_chapter_id` to next level
- Increments `accepted_submissions` count
- Updates `last_activity_at` timestamp

### 3. `update_submission_count()`
Increments `total_submissions` count when user submits work.

### 4. `update_updated_at_column()`
Automatically updates the `updated_at` timestamp on record modifications.

## Views

### 1. `user_statistics`
Comprehensive user information including:
- Registration date
- Current chapter and title
- Submission counts
- Completion status
- User status: 'new', 'active', or 'completed'

```sql
SELECT * FROM user_statistics WHERE wallet_address = '0x...';
```

### 2. `leaderboard`
Ranks users by:
1. Number of completed chapters (primary)
2. Number of accepted submissions (secondary)
3. Last activity time (tiebreaker)

```sql
SELECT * FROM leaderboard LIMIT 10;
```

### 3. `chapter_statistics`
Shows analytics for each chapter:
- Total attempts
- Number of users who completed it
- Pending reviews
- Average review time

```sql
SELECT * FROM chapter_statistics;
```

## Row Level Security (RLS)

### Users Table
- Users can only view and insert their own records

### Submissions Table
- Users can only view and create their own submissions

### User Progress Table
- Users can only view their own progress

### Chapters Table
- Public read access for all users

## Usage Examples

### 1. Register a new user
```sql
INSERT INTO users (wallet_address)
VALUES ('0x1234...');
-- Automatically creates user_progress record via trigger
```

### 2. Submit work for a chapter
```sql
INSERT INTO submissions (wallet_address, chapter_id, vercel_url, suiscan_url)
VALUES (
    '0x1234...',
    1,
    'https://my-project.vercel.app',
    'https://suiscan.xyz/testnet/tx/0xabc...'
);
```

### 3. Get user's current progress
```sql
SELECT * FROM user_statistics 
WHERE wallet_address = '0x1234...';
```

### 4. Accept a submission
```sql
UPDATE submissions
SET 
    status = 'accepted',
    reviewed_at = CURRENT_TIMESTAMP,
    reviewer_notes = 'Great work!'
WHERE id = 'submission-uuid';
-- Automatically updates user_progress via trigger
```

### 5. Get user's next chapter
```sql
SELECT c.* 
FROM user_progress up
JOIN chapters c ON c.id = up.current_chapter_id
WHERE up.wallet_address = '0x1234...';
```

## Setup Instructions

1. Create a new Supabase project
2. Go to SQL Editor
3. Copy and paste the entire `schema.sql` file
4. Execute the script
5. Verify tables, triggers, and views are created successfully

## Security Notes

- Row Level Security (RLS) is enabled on all tables
- Users can only access their own data
- JWT claims are used for authentication
- Chapters table is publicly readable
- Consider adding admin roles for reviewing submissions

## Performance Indexes

The schema includes indexes on:
- `users.created_at` - for sorting new users
- `submissions.wallet_address` - for user submission queries
- `submissions.chapter_id` - for chapter-specific queries
- `submissions.status` - for filtering by review status
- `submissions.submitted_at` - for chronological sorting
- `user_progress.last_activity_at` - for leaderboard queries
- `user_progress.current_chapter_id` - for progress tracking

## Future Enhancements

Consider adding:
- `achievements` table for gamification
- `mentors` table for peer review system
- `comments` table for submission feedback
- `notifications` table for user alerts
- `analytics_events` table for tracking user behavior
