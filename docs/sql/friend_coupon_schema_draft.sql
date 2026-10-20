-- DESIGN DRAFT ONLY. DO NOT APPLY TO PRODUCTION.
-- Requires independent Supabase staging project, migration review and authorization.
-- Referral identities must be verified by LINE Login / LIFF or an approved verification flow.
-- Never accept client-submitted discounts or person identifiers as proof of eligibility.
begin;

create table if not exists public.friend_coupon_entitlements (
  id uuid primary key default gen_random_uuid(),
  campaign_code text not null default 'friend-2026',
  -- opaque verified identity key (HMAC from a private server key), never raw LINE ID
  subject_key text not null,
  role text not null check (role in ('referrer','referred')),
  token_hash text not null unique,
  referral_evidence jsonb not null default '{}'::jsonb,
  verified_at timestamptz not null,
  issued_at timestamptz not null default now(),
  expires_at timestamptz not null default '2027-01-01 00:00:00+08',
  revoked_at timestamptz,
  redeemed_registration_id uuid references public.registrations(id),
  redeemed_at timestamptz,
  constraint friend_coupon_one_person_per_campaign unique (campaign_code,subject_key),
  constraint friend_coupon_redemption_pair check (
    (redeemed_registration_id is null and redeemed_at is null)
    or (redeemed_registration_id is not null and redeemed_at is not null)
  )
);

create table if not exists public.friend_coupon_redemption_audit (
  id bigint generated always as identity primary key,
  entitlement_id uuid not null references public.friend_coupon_entitlements(id),
  registration_id uuid not null references public.registrations(id),
  amount integer not null check (amount=50),
  redeemed_at timestamptz not null default now(),
  unique (entitlement_id),
  unique (registration_id,entitlement_id)
);

alter table public.friend_coupon_entitlements enable row level security;
alter table public.friend_coupon_redemption_audit enable row level security;
revoke all on public.friend_coupon_entitlements from anon, authenticated;
revoke all on public.friend_coupon_redemption_audit from anon, authenticated;

-- Must be added to registrations only in staging after backup and review:
alter table public.registrations
  add column if not exists gross_amount integer,
  add column if not exists discount_amount integer not null default 0,
  add constraint registrations_discount_nonnegative check (discount_amount>=0);

-- IMPORTANT: These tables alone DO NOT implement atomic coupon redemption.
-- Next migration must introduce a single transaction boundary which:
-- 1) locks activity row and validates active paid city ticket from DB;
-- 2) locks coupon entitlement rows in deterministic UUID order;
-- 3) verifies authenticated subject keys and signed referral evidence;
-- 4) checks issuance, expiry, unique redemption, ticket quantity;
-- 5) calculates gross and discount server-side, not from JSON p_row;
-- 6) inserts registration using original capacity/availability invariants;
-- 7) inserts audit rows and marks entitlements redeemed;
-- 8) returns committed final total for all emails and UI.
-- The existing create_registration_atomic(p_row) must NOT be directly reused
-- with user-supplied price fields. Keep public RPC grants reviewed separately.
rollback;
