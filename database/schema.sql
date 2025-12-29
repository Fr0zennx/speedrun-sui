-- Web3 Education Platform Database Schema for Supabase
-- Created: 2025-12-29

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
-- Stores wallet addresses and registration time
CREATE TABLE users (
    wallet_address TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on created_at for sorting
CREATE INDEX idx_users_created_at ON users(created_at);

-- Chapters/Levels table
-- Stores information about each learning chapter
CREATE TABLE chapters (
    id SERIAL PRIMARY KEY,
    level_number INTEGER NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default chapters
INSERT INTO chapters (level_number, title, description) VALUES
(1, 'Level 1: Sui Garage Development', 'Introduction to Sui blockchain and basic Move programming'),
(2, 'Level 2: Character Card', 'Building your first digital asset with Sui objects'),
(3, 'Level 3: NFT & Visual Ownership', 'Creating NFTs with the Display Standard'),
(4, 'Level 4: Battle & Level Up', 'Implementing gaming logic with Hero-Core module'),
(5, 'Level 5: Sui Car', 'Mastering object composition and hierarchical structures'),
(6, 'Level 6: Sui Gallery', 'Building NFT collections and marketplace integration');

-- Submissions table
-- Stores user submissions for each chapter
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address TEXT NOT NULL REFERENCES users(wallet_address) ON DELETE CASCADE,
    chapter_id INTEGER NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
    vercel_url TEXT,
    suiscan_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewer_notes TEXT,
    UNIQUE(wallet_address, chapter_id)
);

-- Create indexes for submissions
CREATE INDEX idx_submissions_wallet ON submissions(wallet_address);
CREATE INDEX idx_submissions_chapter ON submissions(chapter_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_submitted_at ON submissions(submitted_at);

-- User Progress table
-- Tracks which chapter each user is currently working on
CREATE TABLE user_progress (
    wallet_address TEXT PRIMARY KEY REFERENCES users(wallet_address) ON DELETE CASCADE,
    current_chapter_id INTEGER NOT NULL REFERENCES chapters(id),
    completed_chapters INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    total_submissions INTEGER DEFAULT 0,
    accepted_submissions INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on last_activity_at for leaderboard queries
CREATE INDEX idx_user_progress_last_activity ON user_progress(last_activity_at);
CREATE INDEX idx_user_progress_current_chapter ON user_progress(current_chapter_id);

-- Function to update user_progress when submission is accepted
CREATE OR REPLACE FUNCTION update_user_progress_on_acceptance()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'accepted' AND OLD.status != 'accepted' THEN
        -- Update user_progress
        UPDATE user_progress
        SET 
            completed_chapters = array_append(
                CASE 
                    WHEN completed_chapters @> ARRAY[NEW.chapter_id] THEN completed_chapters
                    ELSE completed_chapters
                END,
                CASE 
                    WHEN NOT (completed_chapters @> ARRAY[NEW.chapter_id]) THEN NEW.chapter_id
                    ELSE NULL
                END
            ),
            current_chapter_id = CASE 
                WHEN NEW.chapter_id < 6 THEN NEW.chapter_id + 1
                ELSE current_chapter_id
            END,
            accepted_submissions = accepted_submissions + 1,
            last_activity_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE wallet_address = NEW.wallet_address;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating user_progress on submission acceptance
CREATE TRIGGER trigger_update_progress_on_acceptance
    AFTER UPDATE ON submissions
    FOR EACH ROW
    WHEN (NEW.status = 'accepted')
    EXECUTE FUNCTION update_user_progress_on_acceptance();

-- Function to update submission count in user_progress
CREATE OR REPLACE FUNCTION update_submission_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE user_progress
        SET 
            total_submissions = total_submissions + 1,
            last_activity_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE wallet_address = NEW.wallet_address;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for counting submissions
CREATE TRIGGER trigger_update_submission_count
    AFTER INSERT ON submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_submission_count();

-- Function to initialize user_progress when user is created
CREATE OR REPLACE FUNCTION initialize_user_progress()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_progress (wallet_address, current_chapter_id)
    VALUES (NEW.wallet_address, 1)
    ON CONFLICT (wallet_address) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for initializing user_progress
CREATE TRIGGER trigger_initialize_progress
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION initialize_user_progress();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_user_progress_updated_at
    BEFORE UPDATE ON user_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies for Supabase

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;

-- Users table policies
-- Users can read their own data
CREATE POLICY "Users can view their own data"
    ON users FOR SELECT
    USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- Users can insert their own data
CREATE POLICY "Users can insert their own data"
    ON users FOR INSERT
    WITH CHECK (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- Submissions table policies
-- Users can view their own submissions
CREATE POLICY "Users can view their own submissions"
    ON submissions FOR SELECT
    USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- Users can insert their own submissions
CREATE POLICY "Users can insert their own submissions"
    ON submissions FOR INSERT
    WITH CHECK (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- User Progress table policies
-- Users can view their own progress
CREATE POLICY "Users can view their own progress"
    ON user_progress FOR SELECT
    USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- Chapters table policies
-- Everyone can read chapters
CREATE POLICY "Anyone can view chapters"
    ON chapters FOR SELECT
    USING (true);

-- Views for easier querying

-- User statistics view
CREATE OR REPLACE VIEW user_statistics AS
SELECT 
    u.wallet_address,
    u.created_at as registered_at,
    up.current_chapter_id,
    c.title as current_chapter_title,
    up.total_submissions,
    up.accepted_submissions,
    array_length(up.completed_chapters, 1) as completed_chapters_count,
    up.last_activity_at,
    CASE 
        WHEN array_length(up.completed_chapters, 1) >= 6 THEN 'completed'
        WHEN up.total_submissions > 0 THEN 'active'
        ELSE 'new'
    END as user_status
FROM users u
LEFT JOIN user_progress up ON u.wallet_address = up.wallet_address
LEFT JOIN chapters c ON up.current_chapter_id = c.id;

-- Leaderboard view
CREATE OR REPLACE VIEW leaderboard AS
SELECT 
    u.wallet_address,
    array_length(up.completed_chapters, 1) as completed_chapters,
    up.accepted_submissions,
    up.total_submissions,
    up.last_activity_at,
    RANK() OVER (ORDER BY array_length(up.completed_chapters, 1) DESC, up.accepted_submissions DESC, up.last_activity_at DESC) as rank
FROM users u
LEFT JOIN user_progress up ON u.wallet_address = up.wallet_address
WHERE up.accepted_submissions > 0
ORDER BY rank;

-- Chapter completion stats view
CREATE OR REPLACE VIEW chapter_statistics AS
SELECT 
    c.id,
    c.level_number,
    c.title,
    COUNT(DISTINCT s.wallet_address) as total_attempts,
    COUNT(DISTINCT CASE WHEN s.status = 'accepted' THEN s.wallet_address END) as completed_users,
    COUNT(DISTINCT CASE WHEN s.status = 'pending' THEN s.wallet_address END) as pending_reviews,
    AVG(CASE 
        WHEN s.status = 'accepted' THEN 
            EXTRACT(EPOCH FROM (s.reviewed_at - s.submitted_at)) / 3600 
    END) as avg_review_time_hours
FROM chapters c
LEFT JOIN submissions s ON c.id = s.chapter_id
GROUP BY c.id, c.level_number, c.title
ORDER BY c.level_number;

-- Comments
COMMENT ON TABLE users IS 'Stores user wallet addresses and registration information';
COMMENT ON TABLE chapters IS 'Stores learning chapters/levels information';
COMMENT ON TABLE submissions IS 'Stores user submissions for each chapter with review status';
COMMENT ON TABLE user_progress IS 'Tracks user progress through the curriculum';
COMMENT ON VIEW user_statistics IS 'Provides comprehensive user statistics and current status';
COMMENT ON VIEW leaderboard IS 'Ranks users by completed chapters and accepted submissions';
COMMENT ON VIEW chapter_statistics IS 'Shows statistics for each chapter including completion rates';
