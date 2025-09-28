-- Create game_records table for storing game results
CREATE TABLE public.game_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  time_seconds INTEGER NOT NULL,
  moves INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (public readable for leaderboard)
ALTER TABLE public.game_records ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read game records (for leaderboard)
CREATE POLICY "Anyone can view game records" 
ON public.game_records 
FOR SELECT 
USING (true);

-- Create policy to allow anyone to insert game records
CREATE POLICY "Anyone can insert game records" 
ON public.game_records 
FOR INSERT 
WITH CHECK (true);

-- Create index for better performance when querying leaderboard
CREATE INDEX idx_game_records_score_time ON public.game_records (score DESC, time_seconds ASC, created_at DESC);