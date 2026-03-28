
ALTER TABLE public.subscribers 
  DROP COLUMN IF EXISTS hotmart_transaction_id,
  DROP COLUMN IF EXISTS hotmart_product_id,
  DROP COLUMN IF EXISTS hotmart_offer_id,
  ADD COLUMN IF NOT EXISTS product_source text,
  ADD COLUMN IF NOT EXISTS transaction_id text;
