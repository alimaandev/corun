-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql/new)

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  player_name TEXT NOT NULL DEFAULT 'Runner',
  created_at TIMESTAMPTZ DEFAULT now(),
  last_seen TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  score INTEGER NOT NULL CHECK (score > 0),
  mode TEXT NOT NULL DEFAULT 'freeplay' CHECK (mode IN ('freeplay', 'story', 'daily')),
  level_id INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_scores_score_desc ON scores(score DESC);
CREATE INDEX IF NOT EXISTS idx_scores_profile_id ON scores(profile_id);
CREATE INDEX IF NOT EXISTS idx_scores_created_at ON scores(created_at);
CREATE INDEX IF NOT EXISTS idx_scores_mode ON scores(mode);

CREATE OR REPLACE FUNCTION get_leaderboard(lim INTEGER, off INTEGER)
RETURNS TABLE (profile_id UUID, player_name TEXT, best_score INTEGER)
LANGUAGE SQL
AS $$
  SELECT p.id, p.player_name, MAX(s.score)::INTEGER
  FROM scores s
  JOIN profiles p ON p.id = s.profile_id
  GROUP BY p.id, p.player_name
  ORDER BY 3 DESC
  LIMIT lim
  OFFSET off
$$;

CREATE OR REPLACE FUNCTION get_daily_leaderboard(day DATE)
RETURNS TABLE (profile_id UUID, player_name TEXT, best_score INTEGER)
LANGUAGE SQL
AS $$
  SELECT p.id, p.player_name, MAX(s.score)::INTEGER
  FROM scores s
  JOIN profiles p ON p.id = s.profile_id
  WHERE s.created_at >= day::TIMESTAMPTZ
  GROUP BY p.id, p.player_name
  ORDER BY 3 DESC
  LIMIT 100
$$;

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon insert profiles" ON profiles;
DROP POLICY IF EXISTS "anon select profiles" ON profiles;
DROP POLICY IF EXISTS "anon update profiles" ON profiles;
DROP POLICY IF EXISTS "anon insert scores" ON scores;
DROP POLICY IF EXISTS "anon select scores" ON scores;

CREATE POLICY "anon insert profiles" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "anon select profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "anon update profiles" ON profiles FOR UPDATE USING (true);

CREATE POLICY "anon insert scores" ON scores FOR INSERT WITH CHECK (true);
CREATE POLICY "anon select scores" ON scores FOR SELECT USING (true);
