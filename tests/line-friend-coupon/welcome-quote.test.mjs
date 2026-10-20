import assert from "node:assert/strict";
import {quoteWelcome} from "./welcome-quote.mjs";
const base={unitPrice:600,quantity:1,service:"city",code:"WELCOME50",at:"2026-10-20T12:00:00+08:00"};
assert.equal(quoteWelcome(base).provisionalTotal,550);
assert.equal(quoteWelcome({...base,code:" welcome50 "}).provisionalDiscount,50);
assert.equal(quoteWelcome({...base,code:"OTHER"}).provisionalDiscount,0);
assert.equal(quoteWelcome({...base,quantity:2}).provisionalDiscount,50); // one shared code does not confer 2 discounts
assert.equal(quoteWelcome({...base,service:"temple"}).provisionalDiscount,0);
assert.equal(quoteWelcome({...base,unitPrice:0}).provisionalDiscount,0);
assert.equal(quoteWelcome({...base,at:"2026-12-31T23:59:59+08:00"}).provisionalDiscount,50);
assert.equal(quoteWelcome({...base,at:"2027-01-01T00:00:00+08:00"}).provisionalDiscount,0);
assert.equal(quoteWelcome(base).redeemable,false);
assert.equal(quoteWelcome(base).verified,false);
assert.throws(()=>quoteWelcome({...base,quantity:0}),/invalid_ticket/);
console.log("Welcome coupon preview assertions passed");
