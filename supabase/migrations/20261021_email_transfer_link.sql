-- Draft migration for #77. Review before applying to production.
-- A unique random token is assigned at insert; only its SHA-256 digest is stored.
-- Token issuance must happen in the registration backend and email delivery flow.
create extension if not exists pgcrypto;
alter table public.registrations
  add column if not exists transfer_link_token_hash text,
  add column if not exists transfer_link_expires_at timestamptz;
create unique index if not exists registrations_transfer_link_token_hash_idx
  on public.registrations(transfer_link_token_hash)
  where transfer_link_token_hash is not null;
comment on column public.registrations.transfer_link_token_hash is
  'SHA-256 hex digest of one-time email transfer report capability token. Never return in public API.';
comment on column public.registrations.transfer_link_expires_at is
  'Expiry of transfer reporting email link. Existing records remain null until explicitly issued.';
