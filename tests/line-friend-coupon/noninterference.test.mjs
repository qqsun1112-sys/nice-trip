import assert from "node:assert/strict";
import {quoteFriendCoupon} from "./quote.mjs";
import {resolvePromotionChoice,confirmStandardRegistration} from "./optional-promotion.mjs";
import {campaignDecision} from "./campaigns.mjs";

// Cross-module regression: promotions must be optional, never a dependency
// for ordinary registration. These tests are isolated from Supabase and LINE.
const now=new Date("2026-12-20T04:00:00Z");
const standard={unitPrice:750,quantity:1,service:"city",now};
const noCoupon=quoteFriendCoupon({...standard,entitlements:[]});
assert.equal(noCoupon.total,750);
assert.equal(noCoupon.discount,0);
assert.equal(resolvePromotionChoice({requested:false,originalTotal:noCoupon.total}).maySubmit,true);

const valid={verified:true,used:false,token:"unique",personId:"one"};
assert.equal(quoteFriendCoupon({...standard,entitlements:[valid]}).total,700);

const expired={code:"year-end",enabled:true,startDate:"2026-12-01",endDate:"2026-12-19",services:["city"]};
assert.equal(campaignDecision({campaign:expired,service:"city",ticketCode:"standard",now}).reason,"expired");
const fallback=resolvePromotionChoice({requested:true,validated:false,reason:"expired",originalTotal:750});
assert.equal(fallback.maySubmit,false);
assert.equal(fallback.requiresConfirmation,true);
assert.deepEqual(confirmStandardRegistration(fallback),{promotionRequested:false,confirmedStandardPrice:750});

const serviceDown=resolvePromotionChoice({requested:true,validated:false,reason:"service_unavailable",originalTotal:750});
assert.equal(serviceDown.maySubmit,false);
assert.equal(resolvePromotionChoice({requested:false,originalTotal:750}).total,750);
assert.equal(quoteFriendCoupon({...standard,service:"temple",entitlements:[valid]}).total,750);
assert.equal(quoteFriendCoupon({...standard,quantity:2,entitlements:[valid]}).total,1450);
assert.equal(quoteFriendCoupon({...standard,unitPrice:0,payment:"free",entitlements:[valid]}).total,0);
console.log("12 cross-module non-interference assertions passed");
