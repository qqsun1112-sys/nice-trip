// Isolated pricing reference implementation; not wired to the live website or Supabase.
// Monetary amounts are integer TWD. Entitlement validation/redemption MUST be server-side and atomic.
export const CAMPAIGN_START = "2026-10-20";
export const CAMPAIGN_END = "2026-12-31";
const TWD = 50;
function taiwanDate(instant) {
  if (!(instant instanceof Date) || Number.isNaN(instant.getTime())) throw new Error("invalid_date");
  return new Intl.DateTimeFormat("en-CA", {timeZone:"Asia/Taipei",year:"numeric",month:"2-digit",day:"2-digit"}).format(instant);
}
export function quoteFriendCoupon({unitPrice,quantity,service,payment="bank-transfer",entitlements=[],now=new Date()}) {
  if (!Number.isSafeInteger(unitPrice)||unitPrice<0||!Number.isSafeInteger(quantity)||quantity<1||quantity>20) throw new Error("invalid_ticket");
  const gross=unitPrice*quantity;
  if (!Number.isSafeInteger(gross)) throw new Error("invalid_amount");
  const day=taiwanDate(now);
  const eligible=service==="city" && payment!=="free" && unitPrice>0 && day>=CAMPAIGN_START && day<=CAMPAIGN_END;
  // A single validated entitlement may discount only one participant.
  // Distinct identity and token checks are illustrative; database constraints are still required.
  const seenTokens=new Set(),seenPeople=new Set();
  let count=0;
  if (eligible) for (const e of entitlements) {
    if (!e || e.verified!==true || e.used===true || e.revoked===true || !e.token || !e.personId) continue;
    if (seenTokens.has(e.token)||seenPeople.has(e.personId)) continue;
    if (e.expiresAt && day>e.expiresAt) continue;
    seenTokens.add(e.token);seenPeople.add(e.personId);count++;
    if(count>=quantity)break;
  }
  const discount=eligible?Math.min(gross,count*Math.min(TWD,unitPrice)):0;
  return {gross,discount,total:gross-discount,discountedParticipants:eligible?count:0,eligible};
}
