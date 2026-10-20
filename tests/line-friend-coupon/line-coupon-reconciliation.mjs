// Isolated LINE coupon reconciliation rules. No production API calls.
// A LINE coupon screenshot or displayed serial is NOT proof of unused entitlement.
export function assessLineCoupon({promotionRequested=false,participantCount,unitPrice,verifiedClaims=[],campaignActive=true,service="city"}) {
  if(!Number.isSafeInteger(participantCount)||participantCount<1||!Number.isSafeInteger(unitPrice)||unitPrice<0) throw new Error("invalid_ticket");
  const originalTotal=participantCount*unitPrice;
  if(!Number.isSafeInteger(originalTotal)) throw new Error("invalid_amount");
  if(!promotionRequested) return {status:"standard",originalTotal,discount:0,total:originalTotal,canSubmit:true};
  if(!campaignActive||service!=="city"||unitPrice===0) return {status:"ineligible",originalTotal,discount:0,total:originalTotal,canSubmit:false,requiresConfirmation:true};
  // Claims must come from a trusted server verifier, not user-entered tokens or screenshots.
  const uniquePeople=new Set(),uniqueClaims=new Set();
  for(const claim of verifiedClaims) {
    if(!claim||claim.serverVerified!==true||claim.redeemed===true||claim.lineCouponId==null||claim.participantId==null) continue;
    if(uniquePeople.has(claim.participantId)||uniqueClaims.has(claim.lineCouponId)) continue;
    uniquePeople.add(claim.participantId);uniqueClaims.add(claim.lineCouponId);
  }
  if(uniquePeople.size!==participantCount) return {status:"verification_required",originalTotal,discount:0,total:originalTotal,canSubmit:false,requiresConfirmation:true,verifiedParticipants:uniquePeople.size};
  const discount=participantCount*Math.min(50,unitPrice);
  return {status:"quote_only",originalTotal,discount,total:originalTotal-discount,canSubmit:false,requiresAtomicRedemption:true,verifiedParticipants:uniquePeople.size};
}
