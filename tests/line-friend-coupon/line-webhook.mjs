// Prototype only. Deploy only after isolated integration tests.
// Verify X-Line-Signature against the *raw* request body before JSON parsing.
// Channel secret must be read from server environment, never included in client JS.
import {createHmac,timingSafeEqual} from "node:crypto";
export function verifyLineWebhookSignature(rawBody, signature, channelSecret) {
  if (typeof rawBody!=="string" && !Buffer.isBuffer(rawBody)) return false;
  if (typeof signature!=="string" || !/^[A-Za-z0-9+/]{43}=$/.test(signature)) return false;
  if (typeof channelSecret!=="string" || !channelSecret) return false;
  const expected=createHmac("sha256",channelSecret).update(rawBody).digest();
  const actual=Buffer.from(signature,"base64");
  return actual.length===expected.length && timingSafeEqual(actual,expected);
}
export function extractFollowCandidates(rawBody, signature, channelSecret) {
  if (!verifyLineWebhookSignature(rawBody,signature,channelSecret)) throw new Error("invalid_signature");
  let payload;
  try { payload=JSON.parse(rawBody); } catch {throw new Error("invalid_json");}
  if (!Array.isArray(payload.events)) throw new Error("invalid_events");
  return payload.events.filter(e=>e?.type==="follow" && typeof e?.source?.userId==="string" && e.source.userId.length>0)
    .map(e=>({userId:e.source.userId, timestamp:e.timestamp, webhookEventId:e.webhookEventId||null}));
}
// Do not award entitlements here. The caller must persist events with replay
// protection, establish verified identity mapping, and check first-follow status.
