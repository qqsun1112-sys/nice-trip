import assert from "node:assert/strict";
import {prepareWelcomeRegistration as prepare} from "./welcome-registration-adapter.mjs";

// Simulates the server-resolved activity/ticket payload, never browser pricing.
const event={slug:"sample-city",published:true,status:"open",service:"city",welcome50_enabled:true,max_per_registration:10,ticket_options:[{code:"REG",label:"一般票",unit_price:600,active:true}]};
const args={activity:event,ticketCode:"REG",quantity:2,couponCode:"WELCOME50",now:"2026-10-20T12:00:00+08:00"};
const order=prepare(args);
assert.equal(order.original_total,1200);
assert.equal(order.promotion_discount,100);
assert.equal(order.total_amount,1100);
assert.equal(order.promotion_code,"WELCOME50");
// Browser-supplied totals or discount flags must not affect this server-only adapter.
const tampered=prepare({...args,unit_price:1,total_amount:1,discount:99999,eventEligible:true});
assert.deepEqual(tampered,order);
// Input is not mutated, so existing registration flow can still use the same activity.
assert.equal(event.ticket_options[0].unit_price,600);
assert.equal(event.welcome50_enabled,true);
// Fail closed: invalid code never produces a registration payload.
assert.throws(()=>prepare({...args,couponCode:"WRONG"}),/coupon_invalid_code/);
// Opt-in defaults off: ordinary registration remains available, code is rejected.
const disabled={...event,welcome50_enabled:false};
assert.equal(prepare({...args,activity:disabled,couponCode:""}).total_amount,1200);
assert.throws(()=>prepare({...args,activity:disabled}),/coupon_not_eligible/);
// Multiple ticket types remain single-ticket-per-order; only selected server ticket counts.
const multi={...event,ticket_options:[...event.ticket_options,{code:"EARLY",label:"早鳥票",unit_price:500,active:true}]};
assert.equal(prepare({...args,activity:multi,ticketCode:"EARLY"}).total_amount,900);
console.log("9 offline integration guard assertions passed");
