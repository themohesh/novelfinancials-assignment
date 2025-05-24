-- This is a simplified setup script for quick testing
-- Run this in your Supabase SQL Editor

-- Drop existing tables if they exist (be careful in production!)
DROP TABLE IF EXISTS public.votes CASCADE;
DROP TABLE IF EXISTS public.poll_options CASCADE;
DROP TABLE IF EXISTS public.polls CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create polls table
CREATE TABLE public.polls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create poll_options table
CREATE TABLE public.poll_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create votes table
CREATE TABLE public.votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE NOT NULL,
  option_id UUID REFERENCES public.poll_options(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(poll_id, user_id)
);

-- Enable RLS
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Simple policies for testing
CREATE POLICY "Enable read access for all users" ON public.polls FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.polls FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all users" ON public.poll_options FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.poll_options FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all users" ON public.votes FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.votes FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Insert some sample data for testing
INSERT INTO public.polls (title, description, created_by) VALUES 
('What is your favorite programming language?', 'Choose your preferred language for web development', (SELECT id FROM auth.users LIMIT 1));

-- Get the poll ID for options
INSERT INTO public.poll_options (poll_id, text) VALUES 
((SELECT id FROM public.polls LIMIT 1), 'JavaScript'),
((SELECT id FROM public.polls LIMIT 1), 'TypeScript'),
((SELECT id FROM public.polls LIMIT 1), 'Python'),
((SELECT id FROM public.polls LIMIT 1), 'Go');
