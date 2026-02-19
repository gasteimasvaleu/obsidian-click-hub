-- Add WhatsApp opt-in columns to subscribers table
ALTER TABLE subscribers 
ADD COLUMN IF NOT EXISTS whatsapp_optin BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS whatsapp_optin_at TIMESTAMP WITH TIME ZONE;

-- Add comment for documentation
COMMENT ON COLUMN subscribers.whatsapp_optin IS 'Whether user opted in to receive daily devotionals via WhatsApp';
COMMENT ON COLUMN subscribers.whatsapp_optin_at IS 'Timestamp when user opted in/out of WhatsApp notifications';