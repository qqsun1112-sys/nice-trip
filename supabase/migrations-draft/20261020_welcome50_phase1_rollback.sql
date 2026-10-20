-- DRAFT ONLY: rollback for WELCOME50 schema migration. NOT APPLIED.
-- Destructive: only run after checking for actual WELCOME50 orders and backing up data.
BEGIN;
ALTER TABLE public.registrations
  DROP CONSTRAINT IF EXISTS registrations_promotion_discount_nonnegative,
  DROP COLUMN IF EXISTS original_total,
  DROP COLUMN IF EXISTS promotion_discount,
  DROP COLUMN IF EXISTS promotion_code;
ALTER TABLE public.site_activities
  DROP COLUMN IF EXISTS welcome50_enabled;
COMMIT;
