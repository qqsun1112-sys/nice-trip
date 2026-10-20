// First-phase offline quote only. Not an entitlement or redemption API.
export const WELCOME_START_TAIPEI="2026-10-20T00:00:00+08:00";
export const WELCOME_END_TAIPEI="2026-12-31T23:59:59+08:00";
export function quoteWelcome({unitPrice,quantity,service,code,at}){
 if(!Number.isSafeInteger(unitPrice)||unitPrice<0||!Number.isSafeInteger(quantity)||quantity<1||quantity>20)throw Error("invalid_ticket");
 const gross=unitPrice*quantity;if(!Number.isSafeInteger(gross))throw Error("invalid_amount");
 const now=at instanceof Date?at:new Date(at??Date.now());if(Number.isNaN(now.getTime()))throw Error("invalid_date");
 const matches=String(code??"").trim().toUpperCase()==="WELCOME50";
 const within=now.getTime()>=Date.parse(WELCOME_START_TAIPEI)&&now.getTime()<=Date.parse(WELCOME_END_TAIPEI);
 const eligible=matches&&service==="city"&&unitPrice>0&&within;
 // Shared code is not proof of LINE coupon possession, validity or unused status.
 const provisionalDiscount=eligible?Math.min(gross,50*quantity):0;
 return {gross,provisionalDiscount,provisionalTotal:gross-provisionalDiscount,codeRecognized:matches,eligibleForPreview:eligible,verified:false,redeemable:false};
}
