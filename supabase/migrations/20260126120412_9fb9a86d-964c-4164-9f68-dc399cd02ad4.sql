-- 1. Política de leitura pública
CREATE POLICY "Anyone can view criativos files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'criativos');

-- 2. Política de upload para admins
CREATE POLICY "Admins can upload criativos files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'criativos' 
    AND public.has_role(auth.uid(), 'admin')
  );

-- 3. Política de deleção para admins
CREATE POLICY "Admins can delete criativos files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'criativos' 
    AND public.has_role(auth.uid(), 'admin')
  );