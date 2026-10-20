import assert from "node:assert/strict";
import {prepareWelcomeRegistration} from "./welcome-registration-adapter.mjs";
// Focused regression: existing no-code registration and simple optional WELCOME50.
const activity={slug:"test-city",service:"city",welcome50_enabled:true,published:true,status:"open",ticket_options:[{code:"NORMAL",label:"一般票",unit_price:600,active:true}]};
const make=(quantity,couponCode="",patch={})=>prepareWelcomeRegistration({activity:{...activity,...patch},ticketCode:"NORMAL",quantity,couponCode,now:"2026-10-20T12:00:00+08:00"});
for(const quantity of [1,2,3,10]){
 const ordinary=make(quantity);
 assert.equal(ordinary.total_amount,600*quantity);
 assert.equal(ordinary.promotion_code,null);
 assert.equal(ordinary.promotion_discount,0);
 const coupon=make(quantity,"WELCOME50");
 assert.equal(coupon.total_amount,550*quantity);
 assert.equal(coupon.promotion_discount,50*quantity);
 assert.equal(coupon.original_total,600*quantity);
}
assert.equal(make(2,"  welcome50  ").total_amount,1100);
assert.throws(()=>make(2,"NOTVALID"),/coupon_invalid_code/);
assert.throws(()=>make(2,"WELCOME50",{welcome50_enabled:false}),/coupon_not_eligible/);
assert.equal(make(2,"",{welcome50_enabled:false}).total_amount,1200);
console.log("WELCOME50 minimal regression: 22 assertions passed");
