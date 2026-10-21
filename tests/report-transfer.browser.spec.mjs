import { test, expect } from "@playwright/test";
const base="http://127.0.0.1:4173/report-transfer.html";
const link="#no=NT-20261021-ABC123&token="+ "a".repeat(64);
test("valid email link previews registration and submits last five digits",async({page})=>{
 const calls=[];
 await page.route("https://eanxqqctblwfhtdrhwuk.supabase.co/functions/v1/report-transfer-link",async route=>{
  const body=route.request().postDataJSON();calls.push(body);
  await route.fulfill({status:200,contentType:"application/json",body:JSON.stringify(body.action==="preview"?{ok:true,event_title:"測試小旅行",event_date:"2026-12-26",quantity:1,total_amount:500,status:"pending_transfer",reportable:true}:{ok:true,status:"transfer_reported"})});
 });
 await page.goto(base+link);
 await expect(page.locator("#info")).toContainText("測試小旅行");
 await expect(page.locator("#form")).toBeVisible();
 await expect(page).not.toHaveURL(/token=/);
 await page.locator("#last5").fill("12345");
 await page.locator("#submit").click();
 await expect(page.locator("#msg")).toContainText("成功回報");
 await expect(page.locator("#form")).toBeHidden();
 expect(calls.map(x=>x.action)).toEqual(["preview","submit"]);
 expect(calls[1].transfer_last5).toBe("12345");
});
test("invalid or expired link does not show form",async({page})=>{
 await page.route("https://eanxqqctblwfhtdrhwuk.supabase.co/functions/v1/report-transfer-link",route=>route.fulfill({status:404,contentType:"application/json",body:JSON.stringify({ok:false,error:"invalid_or_expired_link"})}));
 await page.goto(base+link);
 await expect(page.locator("#info")).toContainText("無效或已過期");
 await expect(page.locator("#form")).toBeHidden();
});
test("already reported link cannot submit again",async({page})=>{
 await page.route("https://eanxqqctblwfhtdrhwuk.supabase.co/functions/v1/report-transfer-link",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({ok:true,event_title:"測試小旅行",event_date:"2026-12-26",quantity:1,total_amount:500,status:"transfer_reported",reportable:false})}));
 await page.goto(base+link);
 await expect(page.locator("#msg")).toContainText("已回報匯款");
 await expect(page.locator("#form")).toBeHidden();
});
test("missing token is rejected without request",async({page})=>{
 await page.goto(base+"#no=NT-20261021-ABC123");
 await expect(page.locator("#info")).toContainText("連結不完整");
 await expect(page.locator("#form")).toBeHidden();
});
