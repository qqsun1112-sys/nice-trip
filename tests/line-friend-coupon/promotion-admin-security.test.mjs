import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (p) => readFileSync(new URL("../../" + p, import.meta.url), "utf8");
const schema = read("supabase/migrations-draft/20261020_reusable_promotion_campaigns.sql");
const atomic = read("supabase/migrations-draft/20261020_promotion_admin_atomic.sql");
const endpoint = read("supabase/functions-draft/manage-promotions/index.ts");

for (const phrase of [
  "SECURITY DEFINER",
  "IF auth.role() IS DISTINCT FROM 'service_role'",
  "FOR UPDATE",
  "INSERT INTO public.promotion_campaign_audit",
  "REVOKE ALL ON FUNCTION public.manage_promotion_campaign_atomic",
  "GRANT EXECUTE ON FUNCTION public.manage_promotion_campaign_atomic",
  "duplicate_event_scope",
  "invalid_event_scope",
  "IF jsonb_typeof(p_campaign->'enabled') IS DISTINCT FROM 'boolean'"
]) assert.ok(atomic.includes(phrase), "Missing privileged write guard: " + phrase);

assert.ok(atomic.indexOf("INSERT INTO public.promotion_campaign_audit") > atomic.indexOf("UPDATE public.promotion_campaigns SET"), "Audit must follow campaign mutation in the same transaction");
assert.ok(atomic.includes("SELECT count(*) INTO n FROM public.site_activities"), "Selected activities must be checked server-side");
assert.ok(schema.includes("enabled boolean NOT NULL DEFAULT false"), "New promotions must default disabled");
assert.ok(schema.includes("REVOKE ALL ON public.promotion_campaign_audit FROM anon, authenticated"), "Audit must not be publicly accessible");
for (const phrase of [
  "auth.auth.getUser(bearer[1])",
  "ADMIN_USER_IDS",
  "if(!allowed.has(userId))",
  "admin.rpc(\"manage_promotion_campaign_atomic\"",
  "events.length!==slugs.length"
]) assert.ok(endpoint.includes(phrase), "Missing admin API guard: " + phrase);

console.log("Promotion admin authorization and audit static checks passed (not a live integration test)");
