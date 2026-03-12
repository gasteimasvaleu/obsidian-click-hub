-- Add unique constraint on user_id for upsert support
CREATE UNIQUE INDEX IF NOT EXISTS subscribers_user_id_unique ON public.subscribers (user_id) WHERE user_id IS NOT NULL;

-- Allow authenticated users to insert/update their own subscriber record
CREATE POLICY "Users can upsert own subscription"
ON public.subscribers
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own subscription"
ON public.subscribers
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());