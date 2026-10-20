// Pure promotion decision logic for staging only; no production dependencies.
// Caller must obtain confirmed totals from server; never trust browser-supplied discounts.
export function resolvePromotionChoice({requested=false,validated=false,reason=null,originalTotal}) {
  if (!Number.isSafeInteger(originalTotal) || originalTotal<0) throw new Error("invalid_original_total");
  if (!requested) return {status:"standard",maySubmit:true,requiresConfirmation:false,total:originalTotal};
  if (!validated) return {status:"promotion_unavailable",reason:reason||"promotion_unavailable",maySubmit:false,requiresConfirmation:true,total:originalTotal};
  return {status:"promotion_verified",maySubmit:true,requiresConfirmation:false,total:null};
}
// Promotion error must never create a registration or silently charge the full price.
// UI asks for explicit confirmation, then resubmits WITHOUT a promotion request.
export function confirmStandardRegistration(previous) {
  if(previous?.status!=="promotion_unavailable") throw new Error("confirmation_not_applicable");
  return {promotionRequested:false,confirmedStandardPrice:previous.total};
}
