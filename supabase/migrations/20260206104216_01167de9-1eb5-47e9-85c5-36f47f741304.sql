-- Create table for test results
CREATE TABLE public.test_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL DEFAULT '',
  client_email TEXT NOT NULL DEFAULT '',
  client_city TEXT NOT NULL DEFAULT '',
  client_age INTEGER NOT NULL,
  client_gender TEXT NOT NULL,
  answers JSONB NOT NULL DEFAULT '[]'::jsonb,
  raw_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  percentiles JSONB NOT NULL DEFAULT '{}'::jsonb,
  question_22_answer TEXT NOT NULL DEFAULT 'no',
  question_197_answer TEXT NOT NULL DEFAULT 'no',
  maybe_count INTEGER NOT NULL DEFAULT 0,
  duration_minutes INTEGER NOT NULL DEFAULT 0,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert results (public test submission)
CREATE POLICY "Anyone can insert test results"
ON public.test_results
FOR INSERT
WITH CHECK (true);

-- Allow anyone to read results (for admin panel - in production should be restricted)
CREATE POLICY "Anyone can read test results"
ON public.test_results
FOR SELECT
USING (true);

-- Allow anyone to delete results (for admin panel)
CREATE POLICY "Anyone can delete test results"
ON public.test_results
FOR DELETE
USING (true);