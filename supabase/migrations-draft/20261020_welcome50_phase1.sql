-- DRAFT ONLY: WELCOME50 phase-one database schema. NOT APPLIED.
-- Apply only on a verified isolated Supabase development database after approval.
-- Assumes existing public.site_activities and public.registrations schema (read-only checked 2026-10-20).
BEGIN;
ALTER TABLE public.site_activities
  ADD COLUMN IF NOT EXISTS welcome50_enabled boolean NOT NULL DEFAULT false;
ALTER TABLE public.registrations
  ADD COLUMN IF NOT EXISTS promotion_code text,
  ADD COLUMN IF NOT EXISTS promotion_discount integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS original_total integer;
ALTER TABLE public.registrations
  ADD CONSTRAINT registrations_promotion_discount_nonnegative CHECK (promotion_discount >= 0);
-- Do not add total_amount = original_total - discount constraint until legacy data is audited.
-- Do not turn on any activity by default. Admin must opt in explicitly.
COMMIT;
