// Run: node scripts/test-activity-details.cjs
const fs=require("node:fs"), vm=require("node:vm"), assert=require("node:assert/strict");
const ctx={window:{}};vm.runInNewContext(fs.readFileSync("activity-details.js","utf8"),ctx);
const api=ctx.window.NiceTripActivityDetails;
const keys=["mind-body-balance-20261122","beitou-20261010","xizhi-gongbeidian-20261011","muzha-20261017","keelung-xiandong-20261018","xinzhuang-2026-10-24","yuanshan-20261025","sheliao-2026-10-31","zhishanyan-20261101","monga","dalongdong-20261108","xinzhuang-faith-20261114","taipei-shikoku-20261115","guandu-2026-11-21","neihu-20261122","dadaocheng-20261128","xizhi-20261129","tamsui-20261205","songshan-20261206","ximen-20261213","muzha-zhubai-20261212","temple-songshan-20261026"];
for(const key of keys){
 const base=key.replace(/(?:-\d{8}|-\d{4}-\d{2}-\d{2})+$/,"");
 assert.equal(api.keyFor(base+"-20281231"),key);
 assert.equal(api.get({slug:"renamed-20290101",detail_key:key}),api.get(key));
 assert.equal(api.get(base+"-20281231"),api.get(key));
}
assert.equal(api.get("muzha-other-20281231"),null);
assert.equal(api.get({slug:"monga",detail_key:"invalid"}),null);
assert.equal(api.ready({slug:"unknown",service:"city"}),false);
assert.equal(api.ready({slug:"monga-20281231",service:"city"}),true);
assert.equal(api.ready({slug:"mind-body-balance-20281231",service:"meditation"}),true);
assert.equal(api.ready({slug:"mind-body-balance-20281231",service:"city"}),false);
console.log("Passed clone inheritance for "+keys.length+" templates, repeated copies, unknown content and service-specific validation.");
