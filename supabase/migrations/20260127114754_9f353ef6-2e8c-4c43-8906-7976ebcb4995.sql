-- Add subscription expiration column
ALTER TABLE subscribers
ADD COLUMN subscription_expires_at TIMESTAMP WITH TIME ZONE;

COMMENT ON COLUMN subscribers.subscription_expires_at IS 
  'Data de expiração da assinatura (próxima cobrança da Hotmart)';