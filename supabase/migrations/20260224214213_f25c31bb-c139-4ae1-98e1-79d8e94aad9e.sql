ALTER TABLE public.health_markers
  ADD COLUMN what_is text,
  ADD COLUMN why_matters text,
  ADD COLUMN what_to_do text[];