
CREATE TABLE public.health_markers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
  marker_name TEXT NOT NULL,
  value NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  reference_min NUMERIC,
  reference_max NUMERIC,
  status TEXT CHECK (status IN ('Alto', 'Baixo', 'Normal')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.health_markers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own markers"
  ON public.health_markers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own markers"
  ON public.health_markers FOR INSERT
  WITH CHECK (auth.uid() = user_id);
