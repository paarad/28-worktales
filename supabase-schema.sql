-- WorkTales Database Schema for Supabase
-- Copy and paste this into your Supabase SQL Editor
-- All tables prefixed with 'worktales_' to avoid conflicts with other projects

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for story tones (project-specific)
CREATE TYPE worktales_story_tone AS ENUM (
  'Spooky',
  'Emotional', 
  'Wholesome',
  'Weird',
  'Ironic',
  'Mysterious',
  'Heartwarming',
  'Dramatic'
);

-- Stories table - stores all generated stories
CREATE TABLE worktales_stories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  content TEXT NOT NULL,
  job VARCHAR(100) NOT NULL,
  tone worktales_story_tone NOT NULL,
  word_count INTEGER,
  is_approved BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences table - stores user's story preferences
CREATE TABLE worktales_user_preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  favorite_jobs TEXT[], -- Array of favorite job types
  favorite_tones worktales_story_tone[], -- Array of favorite tones
  preferred_word_count_min INTEGER DEFAULT 150,
  preferred_word_count_max INTEGER DEFAULT 250,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Story collections table - organize stories into collections
CREATE TABLE worktales_story_collections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Junction table for stories in collections
CREATE TABLE worktales_collection_stories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  collection_id UUID REFERENCES worktales_story_collections(id) ON DELETE CASCADE,
  story_id UUID REFERENCES worktales_stories(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(collection_id, story_id)
);

-- Story exports table - track when stories are exported
CREATE TABLE worktales_story_exports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  story_id UUID REFERENCES worktales_stories(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  export_format VARCHAR(50) NOT NULL, -- 'tiktok', 'script', 'caption'
  exported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs reference table with project prefix
CREATE TABLE worktales_jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  category VARCHAR(50) NOT NULL,
  description TEXT,
  storytelling_potential INTEGER DEFAULT 5 CHECK (storytelling_potential >= 1 AND storytelling_potential <= 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_worktales_stories_user_id ON worktales_stories(user_id);
CREATE INDEX idx_worktales_stories_job ON worktales_stories(job);
CREATE INDEX idx_worktales_stories_tone ON worktales_stories(tone);
CREATE INDEX idx_worktales_stories_is_approved ON worktales_stories(is_approved);
CREATE INDEX idx_worktales_stories_created_at ON worktales_stories(created_at DESC);
CREATE INDEX idx_worktales_user_preferences_user_id ON worktales_user_preferences(user_id);
CREATE INDEX idx_worktales_story_collections_user_id ON worktales_story_collections(user_id);
CREATE INDEX idx_worktales_collection_stories_collection_id ON worktales_collection_stories(collection_id);
CREATE INDEX idx_worktales_story_exports_user_id ON worktales_story_exports(user_id);

-- Row Level Security (RLS) Policies
ALTER TABLE worktales_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE worktales_user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE worktales_story_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE worktales_collection_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE worktales_story_exports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for worktales_stories table
CREATE POLICY "Users can view their own stories" ON worktales_stories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stories" ON worktales_stories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stories" ON worktales_stories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stories" ON worktales_stories
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for worktales_user_preferences table
CREATE POLICY "Users can view their own preferences" ON worktales_user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" ON worktales_user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON worktales_user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for worktales_story_collections table
CREATE POLICY "Users can view their own collections" ON worktales_story_collections
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view public collections" ON worktales_story_collections
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can insert their own collections" ON worktales_story_collections
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own collections" ON worktales_story_collections
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own collections" ON worktales_story_collections
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for worktales_collection_stories table
CREATE POLICY "Users can view stories in their collections" ON worktales_collection_stories
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM worktales_story_collections 
      WHERE worktales_story_collections.id = worktales_collection_stories.collection_id 
      AND worktales_story_collections.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add stories to their collections" ON worktales_collection_stories
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM worktales_story_collections 
      WHERE worktales_story_collections.id = worktales_collection_stories.collection_id 
      AND worktales_story_collections.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can remove stories from their collections" ON worktales_collection_stories
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM worktales_story_collections 
      WHERE worktales_story_collections.id = worktales_collection_stories.collection_id 
      AND worktales_story_collections.user_id = auth.uid()
    )
  );

-- RLS Policies for worktales_story_exports table
CREATE POLICY "Users can view their own exports" ON worktales_story_exports
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own exports" ON worktales_story_exports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Functions and triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION worktales_update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_worktales_stories_updated_at 
  BEFORE UPDATE ON worktales_stories 
  FOR EACH ROW EXECUTE FUNCTION worktales_update_updated_at_column();

CREATE TRIGGER update_worktales_user_preferences_updated_at 
  BEFORE UPDATE ON worktales_user_preferences 
  FOR EACH ROW EXECUTE FUNCTION worktales_update_updated_at_column();

CREATE TRIGGER update_worktales_story_collections_updated_at 
  BEFORE UPDATE ON worktales_story_collections 
  FOR EACH ROW EXECUTE FUNCTION worktales_update_updated_at_column();

-- Sample jobs data
INSERT INTO worktales_jobs (name, category, storytelling_potential) VALUES
('Nurse', 'Healthcare', 9),
('Barista', 'Food Service', 8),
('Janitor', 'Maintenance', 9),
('Uber Driver', 'Transportation', 8),
('Theme Park Mascot', 'Entertainment', 10),
('Night Shift Cashier', 'Retail', 9),
('Paramedic', 'Emergency', 10),
('Hotel Receptionist', 'Hospitality', 8),
('Funeral Director', 'Specialized', 10),
('School Teacher', 'Education', 7),
('Crime Scene Cleaner', 'Specialized', 10),
('Pizza Delivery Driver', 'Food Service', 8),
('Airport Security', 'Security', 8),
('Tarot Reader', 'Entertainment', 9),
('Emergency Room Doctor', 'Healthcare', 9),
('Mechanic', 'Automotive', 8),
('Construction Worker', 'Construction', 7),
('Electrician', 'Trades', 7),
('Plumber', 'Trades', 8),
('Locksmith', 'Services', 9),
('Landscaper', 'Outdoor', 6),
('Pool Cleaner', 'Maintenance', 7),
('HVAC Technician', 'Trades', 6),
('Substitute Teacher', 'Education', 8),
('School Bus Driver', 'Transportation', 8),
('Daycare Worker', 'Childcare', 8),
('Tutor', 'Education', 6),
('Librarian', 'Education', 7),
('Museum Guide', 'Culture', 7),
('Camp Counselor', 'Recreation', 8),
('Gas Station Attendant', 'Retail', 8),
('Grocery Store Clerk', 'Retail', 7),
('Department Store Associate', 'Retail', 6),
('Call Center Agent', 'Customer Service', 8),
('Bank Teller', 'Financial', 7),
('Pharmacy Clerk', 'Healthcare', 7),
('Electronics Store Employee', 'Retail', 6),
('Thrift Store Worker', 'Retail', 8),
('Movie Theater Usher', 'Entertainment', 7),
('Concert Security', 'Security', 8),
('DJ', 'Entertainment', 7),
('Wedding Photographer', 'Events', 7),
('Escape Room Guide', 'Entertainment', 9),
('Haunted House Actor', 'Entertainment', 10),
('Street Performer', 'Entertainment', 8),
('Casino Dealer', 'Gaming', 9),
('Dog Walker', 'Pet Services', 7),
('Pet Groomer', 'Pet Services', 7),
('Personal Trainer', 'Fitness', 6),
('Massage Therapist', 'Wellness', 7),
('Life Coach', 'Consulting', 6),
('Real Estate Agent', 'Sales', 7),
('Insurance Adjuster', 'Insurance', 8),
('Pawn Shop Employee', 'Retail', 9),
('Antique Appraiser', 'Specialized', 8),
('Storage Unit Manager', 'Management', 9),
('Lost and Found Officer', 'Services', 9)
ON CONFLICT (name) DO NOTHING;

-- Create a view for story analytics
CREATE VIEW worktales_story_analytics AS
SELECT 
  job,
  tone,
  COUNT(*) as total_stories,
  COUNT(CASE WHEN is_approved = true THEN 1 END) as approved_stories,
  AVG(word_count) as avg_word_count,
  DATE_TRUNC('day', created_at) as date_created
FROM worktales_stories
GROUP BY job, tone, DATE_TRUNC('day', created_at)
ORDER BY date_created DESC, total_stories DESC; 