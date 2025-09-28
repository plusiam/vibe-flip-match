-- Add difficulty and category columns to game_records table
ALTER TABLE public.game_records 
ADD COLUMN IF NOT EXISTS difficulty TEXT DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'emoji';

-- Create index for better leaderboard performance with filters
CREATE INDEX IF NOT EXISTS idx_game_records_category_difficulty 
ON public.game_records (category, difficulty, score DESC, time_seconds ASC);

-- Create a view for leaderboard with rankings
CREATE OR REPLACE VIEW public.leaderboard_view AS
SELECT 
  id,
  player_name,
  score,
  time_seconds,
  moves,
  difficulty,
  category,
  created_at,
  ROW_NUMBER() OVER (
    PARTITION BY difficulty, category 
    ORDER BY score DESC, time_seconds ASC
  ) as rank,
  ROW_NUMBER() OVER (
    ORDER BY score DESC, time_seconds ASC
  ) as overall_rank
FROM public.game_records;

-- Grant permissions for the view
GRANT SELECT ON public.leaderboard_view TO anon, authenticated;