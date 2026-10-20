-- DRAFT ONLY. NOT DEPLOYED. Requires explicit approval and isolated tests.
-- Long-term promotion campaign registry; replaces hard-coded WELCOME50 rules in a later integration.
BEGIN;
CREATE TABLE IF NOT EXISTS public.promotion_campaigns (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  code text NOT NULL UNIQUE,
  title text NOT NULL,
  discount_per_person integer NOT NULL CHECK (discount_per_person > 0),
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  enabled boolean NOT NULL DEFAULT false,
  service text NOT NULL DEFAULT 'city' CHECK (service = 'city'),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT promotion_campaigns_valid_code CHECK (code ~ '^[A-Z0-9_-]{3,32}$'),
  CONSTRAINT promotion_campaigns_valid_period CHECK (ends_at > starts_at)
);
-- Restrict access: promotions must be verified by the server, never trusted from the browser.
ALTER TABLE public.promotion_campaigns ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.promotion_campaigns FROM anon, authenticated;
-- No public SELECT/INSERT/UPDATE policies. Admin management requires a separately
-- verified privileged backend with authorization checks and audit logging.
-- Existing per-activity opt-in remains fail-closed; all campaigns default disabled.
-- This migration does NOT replace the registration RPC or activate any discount.
COMMIT;
