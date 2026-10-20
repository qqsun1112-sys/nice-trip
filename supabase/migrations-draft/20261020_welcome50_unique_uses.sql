-- WELCOME50 per-person eligibility DRAFT, not applied to any database.
-- Depends on a server-managed registration_participants table and secure HMAC identities.
-- All data below are synthetic; no national IDs stored in this eligibility ledger.
BEGIN;
CREATE TABLE IF NOT EXISTS public.welcome50_uses (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  event_slug text NOT NULL,
  identity_hmac text NOT NULL,
  registration_id bigint NOT NULL,
  participant_index integer NOT NULL CHECK (participant_index > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT welcome50_uses_one_person_per_event UNIQUE (event_slug,identity_hmac),
  CONSTRAINT welcome50_uses_one_slot_per_order UNIQUE (registration_id,participant_index)
);
-- Deliberately do not expose this ledger through public APIs.
REVOKE ALL ON TABLE public.welcome50_uses FROM anon,authenticated;
REVOKE ALL ON SEQUENCE public.welcome50_uses_id_seq FROM anon,authenticated;
COMMIT;

-- Intended RPC transaction: validate event/tickets and identities server-side;
-- lock event and check capacity; insert registration and participants; insert each
-- welcome50_uses row. Unique violation aborts whole transaction (no partial discounts).
-- On cancellation, preserve redemption by default until a reviewed restoration
-- policy exists; do not delete ledger rows automatically.
