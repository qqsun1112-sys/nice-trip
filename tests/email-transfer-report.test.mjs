// node --test tests/email-transfer-report.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const page=read("report-transfer.html");
const submit=read("supabase/functions/submit-registration/index.ts");
const report=read("supabase/functions/report-transfer-link/index.ts");
const migration=read("supabase/migrations/20261021_email_transfer_link.sql");
test("Email CTA and cancellation link remain present",()=>{
 assert.match(submit,/我已完成匯款，立即回報/);
 assert.match(submit,/cancel-booking\.html#no=/);
 assert.match(submit,/report-transfer\.html#no=/);
});
test("Email link uses independent random token, stored as digest",()=>{
 assert.match(submit,/crypto\.getRandomValues\(new Uint8Array\(32\)\)/);
 assert.match(submit,/SHA-256/);
 assert.match(submit,/transfer_link_token_hash:digest/);
 assert.doesNotMatch(submit,/transfer_link_token_hash:token/);
});
test("Link is cleared from browser address and only last five digits required",()=>{
 assert.match(page,/history\.replaceState/);
 assert.match(page,/pattern="\[0-9\]\{5\}"/);
 assert.match(page,/report-transfer-link/);
});
test("Backend validates expiry and status on write, no auto confirmation",()=>{
 assert.match(report,/transfer_link_expires_at/);
 assert.match(report,/\.gt\("transfer_link_expires_at",new Date\(\)\.toISOString\(\)\)/);
 assert.match(report,/\.eq\("status","pending_transfer"\)/);
 assert.match(report,/status:"transfer_reported"/);
 assert.doesNotMatch(report,/status:"confirmed"/);
});
test("Migration adds token digest and expiry",()=>{
 assert.match(migration,/transfer_link_token_hash/);
 assert.match(migration,/transfer_link_expires_at/);
 assert.match(migration,/create unique index/);
});
