CREATE TABLE home_highlights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  image_url text NOT NULL,
  link_to text,
  display_order integer NOT NULL DEFAULT 0,
  available boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE home_highlights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available highlights"
  ON home_highlights FOR SELECT USING (available = true);

CREATE POLICY "Admins can manage highlights"
  ON home_highlights FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));