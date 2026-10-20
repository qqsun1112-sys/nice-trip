// Pure, server-compatible phase-one price calculation; no database writes.
// Only use server-resolved event/ticket data, never browser supplied prices.
export const START_MS=Date.parse("2026-10-20T00:00:00+08:00");
export const END_MS=Date.parse("2026-12-31T23:59:59+08:00");
export function calculateWelcomeOrder({couponCode="",eventService,eventEligible=false,ticketPrice,quantity,now=new Date(),otherDiscountApplied=false}){
 if(!Number.isSafeInteger(ticketPrice)||ticketPrice<0||!Number.isSafeInteger(quantity)||quantity<1||quantity>100)throw Error("invalid_ticket");
 const gross=ticketPrice*quantity;if(!Number.isSafeInteger(gross))throw Error("invalid_amount");
 const timestamp=now instanceof Date?now.getTime():new Date(now).getTime();if(!Number.isFinite(timestamp))throw Error("invalid_date");
 const requested=String(couponCode).trim()!=="";
 if(!requested)return {requested:false,accepted:false,gross,discount:0,total:gross,reason:null};
 const validCode=String(couponCode).trim().toUpperCase()==="WELCOME50";
 const reason=!validCode?"invalid_code":timestamp<START_MS?"not_started":timestamp>END_MS?"expired":eventService!=="city"||!eventEligible?"not_eligible":ticketPrice===0?"free_ticket":otherDiscountApplied?"cannot_stack":null;
 if(reason)return {requested:true,accepted:false,gross,discount:0,total:gross,reason};
 const discount=quantity*Math.min(50,ticketPrice);
 return {requested:true,accepted:true,gross,discount,total:gross-discount,reason:null};
}
