import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const sql=readFileSync(new URL("../../supabase/migrations-draft/20261020_reusable_promotion_campaigns.sql",import.meta.url),"utf8");
for(const required of [
 "CREATE TABLE IF NOT EXISTS public.promotion_campaigns",
 "code text NOT NULL UNIQUE",
 "discount_per_person integer NOT NULL CHECK (discount_per_person > 0)",
 "starts_at timestamptz NOT NULL",
 "ends_at timestamptz NOT NULL",
 "enabled boolean NOT NULL DEFAULT false",
 "eligible_event_slugs text[] NOT NULL DEFAULT ARRAY[]::text[]",
 "CONSTRAINT promotion_campaigns_requires_events CHECK (cardinality(eligible_event_slugs) > 0)",
 "CONSTRAINT promotion_campaigns_no_blank_events CHECK (array_position(eligible_event_slugs, NULL) IS NULL",
 "CONSTRAINT promotion_campaigns_valid_period CHECK (ends_at > starts_at)",
 "ENABLE ROW LEVEL SECURITY",
 "REVOKE ALL ON public.promotion_campaigns FROM anon, authenticated"
])assert.ok(sql.includes(required),`Missing promotion guard: ${required}`);
assert.ok(!/INSERT INTO public\.promotion_campaigns/i.test(sql),"Do not auto-enable campaigns");
console.log("Reusable promotion schema static checks passed (not a database migration test)");
