-- Create subscription status enum
CREATE TYPE subscription_status AS ENUM ('pending', 'active', 'cancelled', 'expired');

-- Create subscribers table
CREATE TABLE public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  hotmart_transaction_id TEXT UNIQUE,
  hotmart_product_id TEXT,
  hotmart_offer_id TEXT,
  subscription_status subscription_status NOT NULL DEFAULT 'pending',
  signup_token TEXT UNIQUE,
  signup_token_expires_at TIMESTAMPTZ,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Admins can manage all subscribers
CREATE POLICY "Admins can manage subscribers"
  ON public.subscribers FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Users can view their own subscription
CREATE POLICY "Users can view own subscription"
  ON public.subscribers FOR SELECT
  USING (user_id = auth.uid());

-- Create trigger for updated_at
CREATE TRIGGER update_subscribers_updated_at
  BEFORE UPDATE ON public.subscribers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();