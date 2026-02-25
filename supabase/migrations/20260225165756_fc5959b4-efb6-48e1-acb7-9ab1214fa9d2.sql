
-- Allow users to delete their own exams
CREATE POLICY "Users can delete own exams" ON public.exams
  FOR DELETE USING (auth.uid() = user_id);

-- Allow users to delete their own health markers
CREATE POLICY "Users can delete own markers" ON public.health_markers
  FOR DELETE USING (auth.uid() = user_id);
