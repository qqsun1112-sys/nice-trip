// Isolated adapter for the existing submit-registration v16 data model.
// This file is NOT deployed. All activity and ticket inputs must be fetched server-side.
import {calculateWelcomeOrder} from "./welcome-order-policy.mjs";
export function prepareWelcomeRegistration({activity,ticketCode,quantity,couponCode="",now=new Date()}){
 if(!activity||activity.published!==true||activity.status!=="open")throw Error("event_not_open");
 if(!Number.isSafeInteger(quantity)||quantity<1||quantity>20)throw Error("invalid_quantity");
 if(activity.max_per_registration!=null&&quantity>Number(activity.max_per_registration))throw Error("quantity_limit");
 const options=Array.isArray(activity.ticket_options)?activity.ticket_options:[];
 const ticket=options.find(t=>t&&t.active!==false&&String(t.code)===String(ticketCode));
 if(!ticket)throw Error("invalid_ticket");
 const min=Number(ticket.min_qty??1),max=ticket.max_qty==null?Infinity:Number(ticket.max_qty);
 if(quantity<min||quantity>max)throw Error("ticket_quantity_mismatch");
 const unit=Number(ticket.unit_price);
 if(!Number.isSafeInteger(unit)||unit<0)throw Error("invalid_ticket_price");
 // Explicit allowlist on a server-owned field. Default-off for all activities.
 const eligible=activity.service==="city"&&activity.welcome50_enabled===true;
 const price=calculateWelcomeOrder({couponCode,eventService:activity.service,eventEligible:eligible,ticketPrice:unit,quantity,now,otherDiscountApplied:ticket.other_coupon_applied===true});
 if(price.requested&&!price.accepted){const error=new Error("coupon_"+price.reason);error.code="coupon_"+price.reason;throw error;}
 return {ticket_type:String(ticket.label??ticketCode),ticket_code:String(ticketCode),unit_price:unit,quantity,total_amount:price.total,promotion_code:price.accepted?"WELCOME50":null,promotion_discount:price.discount,original_total:price.gross};
}
