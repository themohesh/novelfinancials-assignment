-- Enable realtime for the tables
-- Run this in your Supabase SQL Editor after creating the tables

-- Enable realtime replication for polls table
ALTER PUBLICATION supabase_realtime ADD TABLE public.polls;

-- Enable realtime replication for poll_options table  
ALTER PUBLICATION supabase_realtime ADD TABLE public.poll_options;

-- Enable realtime replication for votes table
ALTER PUBLICATION supabase_realtime ADD TABLE public.votes;

-- Verify realtime is enabled
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';
