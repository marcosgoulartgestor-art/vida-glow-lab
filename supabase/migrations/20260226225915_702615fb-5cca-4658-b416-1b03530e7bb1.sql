ALTER TABLE public.health_markers
  ADD COLUMN IF NOT EXISTS optimal_min numeric,
  ADD COLUMN IF NOT EXISTS optimal_max numeric,
  ADD COLUMN IF NOT EXISTS marker_id text;